import { take, put, fork, all } from "redux-saga/effects";
import * as actions from "./actions";
function* actionCleanupListener() {
  while (true) {
    yield take(actions.CLEANUP);
    yield put(actions.cleanup());
  }
}

function* actionListener() {
  yield all([fork(actionCleanupListener)]);
}

export default function* root(): any {
  yield all([fork(actionListener)]);
}
