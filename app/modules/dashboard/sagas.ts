import { take, put, fork, select, call, all } from "redux-saga/effects";
import * as actions from "./actions";
import * as reducers from "./reducers";
import { type DashboardStatistics, type GetData } from "./types";
import * as graphql from "../graphql";
import marketConfig from "../../config/market";

function* getData() {
  const request: GetData = yield select(reducers.getData);
  const ret: DashboardStatistics = yield call(
    graphql.getDashboardData,
    marketConfig.contractNamespace,
    request,
  );
  yield put(actions.resetDataResponse());
  yield put(actions.dataResponse(ret));
}

function* actionGetDataListener() {
  while (true) {
    yield take(actions.GET_DATA);
    yield fork(getData);
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
