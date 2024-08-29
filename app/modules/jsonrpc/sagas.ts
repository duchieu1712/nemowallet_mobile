import { take, put, fork, select, all } from "redux-saga/effects";
import * as actions from "./actions";
import * as reducers from "./reducers";
import simple_jsonrpc from "simple-jsonrpc-js";
import {
  type Response,
  RESPONSE_STATUS_FAILED,
  RESPONSE_STATUS_OK,
  type State,
} from "./types";
import { eventChannel, channel } from "redux-saga";
import * as walletActions from "../wallet/actions";

const jsonrpcConnectResponseChannel = channel();

function* subscribe() {
  const state: State = yield select(reducers.dump);
  if (state.subscribe == null) return;
  yield state.provider.call(`${state.subscribe.namespace}.subscribe`, [
    state.signature,
  ]);
}

function* connect() {
  const endpoint: string = yield select(reducers.selectedEndpoint);
  const provider = simple_jsonrpc.connect_xhr(endpoint);
  yield put(
    actions.connectResponse({
      endpoint,
      provider,
    }),
  );
}

function* actionConnectListener() {
  while (true) {
    yield take(actions.CONNECT);
    yield fork(connect);
  }
}

function* batch() {
  const state: State = yield select(reducers.dump);
  const signature = yield select(reducers.selectedSignature);
  const ret: Response[] = [];
  for (let i = 0; i < state.batch.length; i++) {
    const request = state.batch[i];
    const res = yield state.provider.call(request.method, [
      signature,
      ...request.params,
    ]);
    ret.push({
      request,
      status: RESPONSE_STATUS_OK,
      rawMsg: res,
    });
  }
  yield put(actions.batchResponse(ret));
}

function* call() {
  const state: State = yield select(reducers.dump);
  const signature = yield select(reducers.selectedSignature);
  const chan = eventChannel((emit) => {
    state.provider
      .call(state.request.method, [signature, ...state.request.params])
      .then((data) => {
        emit(
          actions.callResponse({
            request: state.request,
            status: RESPONSE_STATUS_OK,
            rawMsg: data,
          }),
        );
      })
      .catch((err) => {
        emit(
          actions.callResponse({
            request: state.request,
            status: RESPONSE_STATUS_FAILED,
            rawMsg: err,
          }),
        );
      });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  });
  while (true) {
    const action = yield take(chan);
    yield put(action);
  }
}

function* callWithdraw() {
  const state: State = yield select(reducers.dump);
  // const signature = yield select(reducers.selectedSignature)
  const chan = eventChannel((emit) => {
    state.provider
      .call(state.request.method, [...state.request.params])
      .then((data) => {
        emit(
          actions.callResponse({
            request: state.request,
            status: RESPONSE_STATUS_OK,
            rawMsg: data,
          }),
        );
      })
      .catch((err) => {
        emit(
          actions.callResponse({
            request: state.request,
            status: RESPONSE_STATUS_FAILED,
            rawMsg: err,
          }),
        );
      });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  });
  while (true) {
    const action = yield take(chan);
    yield put(action);
  }
}

function* actionBatchListener() {
  while (true) {
    yield take(actions.BATCH);
    yield fork(batch);
  }
}

function* actionBatchResponseListener() {
  while (true) {
    yield take(actions.BATCH_RESPONSE);
    const state: State = yield select(reducers.dump);
    for (let i = 0; i < state.batchResponse.length; i++) {
      state.batchResponse[i].request.handler(state.batchResponse[i]);
    }
  }
}

function* actionCallListener() {
  while (true) {
    yield take(actions.CALL);
    yield fork(call);
  }
}

function* actionCallWithdrawListener() {
  while (true) {
    yield take(actions.CALL_WITHDRAW);
    yield fork(callWithdraw);
  }
}

function* actionCallResponseListener() {
  while (true) {
    yield take(actions.CALL_RESPONSE);
    const state: State = yield select(reducers.dump);
    state.response.request.handler(state.response);
  }
}

function* actionSubscribeListener() {
  while (true) {
    yield take(actions.SUBSCRIBE);
    yield fork(subscribe);
  }
}

function* actionSubscribeResponseListener() {
  while (true) {
    yield take(actions.SUBSCRIBE_RESPONSE);
    const state: State = yield select(reducers.dump);
    state.subscribeResponse.request.handler(state.subscribeResponse);
  }
}

function* connectResponseChannelListener() {
  while (true) {
    const action = yield take(jsonrpcConnectResponseChannel);
    yield put(action);
  }
}

function* actionCleanupListener() {
  while (true) {
    yield take(walletActions.CLEANUP);
    yield put(actions.cleanup());
  }
}

function* actionListener() {
  yield all([
    fork(actionConnectListener),
    fork(actionCallListener),
    fork(actionCallWithdrawListener),
    fork(actionCallResponseListener),
    fork(actionBatchListener),
    fork(actionBatchResponseListener),
    fork(actionSubscribeListener),
    fork(actionSubscribeResponseListener),
    fork(connectResponseChannelListener),
    fork(actionCleanupListener),
  ]);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
function* startup() {}

export default function* root(): any {
  yield all([fork(startup), fork(actionListener)]);
}
