import {
  createStore,
  applyMiddleware,
  combineReducers,
  type Store,
} from "redux";
import createSagaMiddleware, { type Task } from "redux-saga";
import { fork, all } from "redux-saga/effects";
import jsonrpcSagas from "./jsonrpc/sagas";
import jsonrpcReducers from "./jsonrpc/reducers";
import walletSagas from "./wallet/sagas";
import walletReducers from "./wallet/reducers";
import hotwalletSagas from "./hotwallet/sagas";
import hotwalletReducers from "./hotwallet/reducers";
import profileSagas from "./profile/sagas";
import profileReducers from "./profile/reducers";
import accountSagas from "./account/sagas";
import accountReducers from "./account/reducers";
import nftReducer from "./nft/reducers";
import nftSagas from "./nft/sagas";
import zapReducer from "./zap/reducers";
import zapSagas from "./zap/sagas";
import transactionReducer from "./transaction/reducers";
import transactionSagas from "./transaction/sagas";
import dashboardReducer from "./dashboard/reducers";
import dashboardSagas from "./dashboard/sagas";
import stakeReducer from "./stakes/reducers";
import stakeSagas from "./stakes/sagas";
import landingReducer from "./landing/reducers";
import landingeSagas from "./landing/sagas";
import faucetSagas from "./faucet/sagas";
import faucetReducer from "./faucet/reducers";
import boxsReducer from "./mysterybox/reducers";
import boxsSaga from "./mysterybox/sagas";

const rootReducer = combineReducers({
  wallet: walletReducers,
  jsonrpc: jsonrpcReducers,
  hotwallet: hotwalletReducers,
  profile: profileReducers,
  account: accountReducers,
  nft: nftReducer,
  zap: zapReducer,
  transaction: transactionReducer,
  dashboard: dashboardReducer,
  stake: stakeReducer,
  land: landingReducer,
  boxs: boxsReducer,
  faucet: faucetReducer,
});

export function* rootSaga(): any {
  yield all([
    fork(walletSagas),
    fork(jsonrpcSagas),
    fork(hotwalletSagas),
    fork(profileSagas),
    fork(accountSagas),
    fork(nftSagas),
    fork(zapSagas),
    fork(transactionSagas),
    fork(dashboardSagas),
    fork(stakeSagas),
    fork(landingeSagas),
    fork(faucetSagas),
    fork(boxsSaga),
  ]);
}

export interface SagaStore extends Store {
  sagaTask: Task;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const makeStore = (): any => {
  const sagaMiddleware = createSagaMiddleware();
  // store = createStore(rootReducer, applyMiddleware(sagaMiddleware, logger))
  const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
  (store as SagaStore).sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};

export const store = makeStore();

export const appState = (): any => store !== undefined && store.getState();
export const appDispatch = (action: any | unknown): any =>
  store.dispatch(action);
