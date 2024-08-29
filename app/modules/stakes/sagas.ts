import { take, put, fork, call, all, select } from "redux-saga/effects";
import * as actions from "./actions";
import * as graphql from "../graphql";
import marketConfig from "../../config/market";
import * as reducers from "./reducers";
import * as AccountReducers from "../account/reducers";
import { type PoolContract } from "./types";
import { Contract } from "ethers";
import {
  type PoolSimpleEarn,
  type SubscribedUser,
} from "../graphql/types/generated";
import { GalixSimpleEarnAbi } from "../../common/abi";
import { descyptNEMOWallet } from "../../common/utilities";

function* getDataPools() {
  const accountWeb = yield select(AccountReducers.dataAccount);
  const ret = yield call(
    graphql.getListPool,
    marketConfig.contractNamespace_staking,
    descyptNEMOWallet(accountWeb?.nemo_address),
  );
  yield put(actions.resetData_PoolsResponse());
  yield put(actions.dataPoolsResponse(ret));
  yield put(actions.connect_contract());
}

function* actionGetDataListener() {
  while (true) {
    yield take(actions.GET_DATA_POOLS);
    yield fork(getDataPools);
  }
}

function* getData_Pools_Staked() {
  const accountWeb = yield select(AccountReducers.dataAccount);
  const ret = yield call(
    graphql.getListPoolStaked,
    marketConfig.contractNamespace_staking,
    descyptNEMOWallet(accountWeb?.nemo_address),
  );
  yield put(actions.resetData_Pools_StakedResponse());
  yield put(actions.data_Pools_StakedResponse(ret));
  yield put(actions.connectContractStaked());
}

function* actionGetDataPoolStakedListener() {
  while (true) {
    yield take(actions.GET_DATA_POOLS_STAKED);
    yield fork(getData_Pools_Staked);
  }
}

function* connectContract() {
  // Connect contract Pool
  const data_Pools = yield select(reducers.dataPoolsResponse);
  let contracts: PoolContract[] = [];
  contracts = data_Pools?.map((e) => {
    const cfg: PoolSimpleEarn = e;
    return {
      namespace: "",
      address: cfg.id,
      contract: new Contract(cfg.id, GalixSimpleEarnAbi),
    };
  });
  yield put(actions.reset_data_Contract());
  yield put(actions.data_Contract(contracts));
}

function* connectContractStaked() {
  // Connect contract Pool
  const data_Pools = yield select(reducers.dataPoolsStakedResponse);
  let contracts: PoolContract[] = [];
  contracts = data_Pools?.map((e) => {
    const cfg: SubscribedUser = e;
    return {
      namespace: "",
      address: cfg?.product?.pool?.id,
      contract: new Contract(cfg?.product?.pool?.id, GalixSimpleEarnAbi),
    };
  });
  yield put(actions.reset_data_Contract());
  yield put(actions.data_Contract(contracts));
}

function* actionConnectContractListener() {
  while (true) {
    yield take(actions.CONNECT_CONTRACT);
    yield fork(connectContract);
  }
}

function* actionConnectContractStakedListener() {
  while (true) {
    yield take(actions.CONNECT_CONTRACT_STAKED);
    yield fork(connectContractStaked);
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
    fork(actionGetDataPoolStakedListener),
    fork(actionConnectContractListener),
    fork(actionConnectContractStakedListener),
    fork(actionCleanupListener),
  ]);
}

export default function* root(): any {
  yield all([fork(actionListener)]);
}
