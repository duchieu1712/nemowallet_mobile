import { take, put, fork, all, select } from "redux-saga/effects";
import * as actions from "./actions";
import * as reducers from "./reducers";
import { isConnected } from "../jsonrpc/utilities";
import {
  contractCogiChain_call_Get_Not_Login,
  decodeFunctionResult,
  rpcExecCogiChain_Signer_batch,
} from "../../components/RpcExec/toast_chain";
import {
  ContractFromNamespaceCogiChain,
  getChainId,
} from "../wallet/utilities";
import { type INOContract } from "./types";
import { sleep } from "../../common/utilities";
import { cf_BOX_DATA_CONFIG } from "../../config/mysterybox/configMysteryBox";

function* getData_INO() {
  try {
    const serviceID = yield select(reducers.serviceID);
    const boxData: any = cf_BOX_DATA_CONFIG.find(
      (e: any) => e.serviceID == serviceID,
    );
    const contracts: INOContract[] = [];
    const contract = ContractFromNamespaceCogiChain(boxData.contract);
    const lstArray = boxData.assets
      .filter((e: any) => e.chainID == getChainId())
      .map(async (e: any) => {
        return {
          router: e.router,
          address: e.id,
          symbol: e.symbol,
          name: e.name,
          info: decodeFunctionResult(
            contract,
            "asksOf",
            await contractCogiChain_call_Get_Not_Login(contract, "asksOf", [
              e.id,
            ]),
          ),
        };
      });

    contracts.push({
      namespace: "",
      contract,
    });
    let lstRes = yield Promise.all(lstArray);
    lstRes = lstRes.filter((e: any) => e != null);
    yield sleep(5);
    yield put(actions.reset_data_Contract());
    yield put(actions.data_Contract(contracts));
    yield put(actions.resetData_BoxsResponse());
    yield put(actions.data_BoxsResponse(lstRes));
  } catch (e) {
    yield put(actions.reset_data_Contract());
    yield put(actions.resetData_BoxsResponse());
  }
}

function* getData_INODetail() {
  const serviceID = yield select(reducers.serviceID);
  const boxData: any = cf_BOX_DATA_CONFIG.find(
    (e: any) => e.serviceID == serviceID,
  );
  const box = yield select(reducers.getDataBoxs);
  if (
    box == null ||
    !boxData.assets.some((e: any) => e.symbol.toLowerCase() == box)
  ) {
    yield put(actions.resetData_Boxs_DetailResponse());
    return;
  }
  const contracts: INOContract[] = [];
  const contract = ContractFromNamespaceCogiChain(boxData.contract);
  const lstArray = boxData.assets
    .filter(
      (e: any) => e.chainID == getChainId() && e.symbol.toLowerCase() == box,
    )
    .map(async (e: any) => {
      return {
        router: e.router,
        address: e.id,
        symbol: e.symbol,
        name: e.name,
        info: decodeFunctionResult(
          contract,
          "asksOf",
          await contractCogiChain_call_Get_Not_Login(contract, "asksOf", [
            e.id,
          ]),
        ),
        // info: decodeFunctionResult(
        //   contract,
        //   'asksOf',
        //   '0x0000000000000000000000007394db35fba179b46c45475bac6b7c76223da16a00000000000000000000000000000000000000000000000000000000040d9900000000000000000000000000000000000000000000000000000000006316114800000000000000000000000000000000000000000000000000000000631762c80000000000000000000000009702230a8ea53601f5cd2dc00fdbc13d4df4a8c7000000000000000000000000d2d3fa440a80e431d299db71711d276a4127931d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000003d09000000000000000000000000000000000000000000000000000000000006315688800000000000000000000000000000000000000000000000000000000631611470000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000035a'
        // ),
      };
    });
  contracts.push({
    namespace: "",
    contract,
  });
  let lstRes = yield Promise.all(lstArray);
  lstRes = lstRes.filter((e: any) => e != null);
  yield sleep(5);
  yield put(actions.reset_data_Contract());
  yield put(actions.data_Contract(contracts));
  if (lstRes && lstRes.length != 0) {
    yield put(actions.resetData_Boxs_DetailResponse());
    yield put(actions.dataBoxsDetailResponse(lstRes[0]));
  }
}

function* getData_BoxFail() {
  const serviceID = yield select(reducers.serviceID);
  const boxData: any = cf_BOX_DATA_CONFIG.find(
    (e: any) => e.serviceID == serviceID,
  );
  if (!(yield isConnected())) return;
  const request = yield select(reducers.requestBoxsFail);
  const ret = [];
  const batch = [];
  for (let i = 0; i < request?.length; i++) {
    const namespace = request[i].namespace;
    batch.push({
      method: `${namespace}.get_boxsfailed`,
      params: {},
      endpoint: boxData.endpoint,
    });
  }
  const ress = yield rpcExecCogiChain_Signer_batch(batch, boxData.endpoint);
  for (let k = 0; k < ress?.length; k++) {
    const res = ress[k];
    if (res.boxsfailed == undefined) continue;
    const _res = {
      namespace: request[k].namespace,
      data: res.boxsfailed,
    };
    ret.push(_res);
  }
  yield put(actions.resetData_BoxsFailResponse());
  yield put(actions.dataBoxsFailResponse(ret));
}

function* actionGetDataListener() {
  while (true) {
    yield take(actions.GET_DATA_BOXS);
    yield fork(getData_INO);
  }
}

function* actionGetDataDetailListener() {
  while (true) {
    yield take(actions.GET_DATA_BOXS_DETAIL);
    yield fork(getData_INODetail);
  }
}

function* actionGetBoxsFailListener() {
  while (true) {
    yield take(actions.GET_DATA_BOXS_FAIL);
    yield fork(getData_BoxFail);
  }
}

function* actionCleanupListener() {
  while (true) {
    yield take(actions.CLEANUP);
    yield put(actions.cleanup());
  }
}

function* actionListener() {
  yield all([
    fork(actionGetDataListener),
    fork(actionGetDataDetailListener),
    fork(actionGetBoxsFailListener),
    fork(actionCleanupListener),
  ]);
}

export default function* root() {
  yield all([fork(actionListener)]);
}
