import { take, put, fork, all, select, call } from "redux-saga/effects";
import * as actions from "./actions";
import { isConnected } from "../jsonrpc/utilities";
import * as walletReducers from "../wallet/reducers";
import * as graphql from "../graphql";
import marketConfig from "../../config/market";
import { rpcExecCogiChain_Signer } from "../../components/RpcExec/toast_chain";
import { ENUM_ENDPOINT_RPC } from "../../common/enum";

function* getDataLanding() {
  try {
    if (!(yield isConnected())) return;
    const res = {
      landinfo: [],
      nemo_hotwallet_pendingonchain: false,
      erc721_galix_resource_pendingonchain: false,
    };
    const get_landinfo = yield rpcExecCogiChain_Signer({
      method: `erc721_galix_land.get_landinfo`,
      params: {},
      endpoint: ENUM_ENDPOINT_RPC._GALIXCITY,
    });
    res.landinfo = get_landinfo?.landinfo;
    // if (accountWeb?.account != null) {
    //   batch.push({
    //     call: {
    //       method: `nemo_hotwallet.get_pendingonchain`,
    //       params: [accountWeb?.account?.signature],
    //     },
    //   })
    // }

    // tạm khóa
    // res.erc721_galix_resource_pendingonchain = yield rpcExecCogiChain_Signer({
    //   method: `erc721_galix_resource.get_pendingonchain`,
    //   params: [{}],
    //   endpoint: ENUM_ENDPOINT_RPC._GALIXCITY
    // })
    // batch.push({
    //   call: {
    //     method: `erc721_galix_resource.get_pendingonchain`,
    //     params: [{}],
    //   },
    // })
    // const res = yield call(promiseGetDataBatch, jsonrpc.provider, batch)
    yield put(actions.resetData_LandingResponse());
    yield put(actions.dataLandingResponse(res));
  } catch {
    yield put(actions.resetData_LandingResponse());
    yield put(
      actions.dataLandingResponse({
        landinfo: [],
        nemo_hotwallet_pendingonchain: true,
        erc721_galix_resource_pendingonchain: true,
      }),
    );
  }
}

function* getData_Rengting_Landing() {
  try {
    const account = yield select(walletReducers.selectedAddress);
    const ret = yield call(
      graphql.getDataLandRenting,
      marketConfig.contractNamespace_renting_land,
      account,
    );
    yield put(actions.resetData_Rent_LandingResponse());
    yield put(actions.data_Rent_LandingResponse(ret));
  } catch {
    yield put(actions.resetData_Rent_LandingResponse());
  }
}

function* actionGetDataListener() {
  while (true) {
    yield take(actions.GET_DATA_LANDING);
    yield fork(getDataLanding);
  }
}

function* actionGetDataRentingLandListener() {
  while (true) {
    yield take(actions.GET_DATA_RENGTING_LANDING);
    yield fork(getData_Rengting_Landing);
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
    fork(actionGetDataRentingLandListener),
    fork(actionCleanupListener),
  ]);
}

export default function* root(): any {
  yield all([fork(actionListener)]);
}
