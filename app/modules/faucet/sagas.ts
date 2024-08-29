import { take, put, fork, all } from "redux-saga/effects";
import * as actions from "./actions";
import { rpcExecCogiChainNotEncodeParam } from "../../components/RpcExec/toast_chain";
// import market from '../../config/market'

function* getDataPoolsFaucet() {
  const ret = yield rpcExecCogiChainNotEncodeParam({
    method: `faucet.pools`,
    params: [{}],
  });
  yield put(actions.resetData_PoolsResponse_Faucet());
  yield put(actions.dataPoolsResponseFaucet(ret));
  // yield put(actions.connect_contract_Faucet())
}

function* actionGetDataPoolFaucetListener() {
  while (true) {
    yield take(actions.GET_DATA_POOLS);
    yield fork(getDataPoolsFaucet);
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
    fork(actionGetDataPoolFaucetListener),
    fork(actionCleanupListener),
  ]);
}

export default function* root(): any {
  yield all([fork(actionListener)]);
}
