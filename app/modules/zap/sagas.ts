import { take, put, fork, all } from "redux-saga/effects";
import * as actions from "./actions";
import { type ZapContract } from "./types";
import { Contract } from "ethers";
import { toEther_v2, sleep } from "../../common/utilities";
import cf_assetZaps from "../../config/zap-contract";
import { GalixZapPoolAbi } from "../../common/abi";
import { promiseGetData } from "./function";
import { ClassWithStaticMethod } from "../../common/static";

function* getDataZap() {
  const resTotal = [];
  const contracts: ZapContract[] = [];
  const callGetDataLaunchpad = [];
  for (let i = 0; i < cf_assetZaps.length; i++) {
    const temp = cf_assetZaps[i];
    if (temp.chainID == ClassWithStaticMethod.STATIC_DEFAULT_CHAINID) {
      const contract = {
        namespace: temp.address,
        contract: new Contract(temp.address, GalixZapPoolAbi),
      };
      contracts.push(contract);
      const functionGetData = async () => {
        return await promiseGetData(temp, contract.contract);
      };
      callGetDataLaunchpad.push(functionGetData);
    }
  }
  try {
    const response = yield all(
      callGetDataLaunchpad.map(async (e) => await e()),
    );

    for (let i = 0; i < cf_assetZaps.length; i++) {
      const zap = response.find(
        (e) =>
          e.address.toLowerCase().trim() ==
          cf_assetZaps[i].address.toLowerCase().trim(),
      );
      if (zap != null) {
        resTotal.push({
          ...cf_assetZaps[i],
          ratio: toEther_v2(zap.ratio, cf_assetZaps[i].coinZap[0].decimals),
        });
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
  yield sleep(100);
  yield put(actions.resetData_ZapResponse());
  yield put(actions.data_ZapResponse(resTotal));
  yield put(actions.reset_data_Contract());
  yield put(actions.data_Contract(contracts));
}

function* actionGetDataListener() {
  while (true) {
    yield take(actions.GET_DATA_ZAP);
    yield fork(getDataZap);
  }
}
function* actionCleanupListener() {
  while (true) {
    yield take(actions.CLEANUP);
    yield put(actions.cleanup());
  }
}

function* actionListener() {
  yield all([fork(actionGetDataListener), fork(actionCleanupListener)]);
}

export default function* root(): any {
  yield all([fork(actionListener)]);
}
