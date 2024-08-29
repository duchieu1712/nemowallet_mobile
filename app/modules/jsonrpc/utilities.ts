import { select } from "redux-saga/effects";
import * as reducers from "./reducers";

export function* isConnected(): any {
  const connected = yield select(reducers.connected);
  return connected;
}
