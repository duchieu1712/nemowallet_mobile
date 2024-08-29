import { take, put, fork, select, all, call } from "redux-saga/effects";
import * as actions from "./actions";
import * as reducers from "./reducers";
import { API_FIND_REFERENCES } from "../../common/api";
import { API_KEY } from "../../common/constants";
import { ClassWithStaticMethod } from "../../common/static";
import { rpcExecCogiChain } from "../../components/RpcExec/toast_chain";
import Toast from "../../components/ToastInfo";
import { cogiIDFromChainid } from "../../common/utilities_config";

function* claimReward() {
  // if (!(yield isConnected())) return
  // const request: DataClaim = yield select(reducers.dataClaim)
  // const jsonrpc: JsonRpcState = yield select(jsonrpcReducers.dump)
  // try {
  //   if (request != null && request != '') {
  //     yield jsonrpc.provider.call('cogi_referral.claim', [
  //       jsonrpc.signature,
  //       { friend: request },
  //     ])
  //   } else {
  //     yield jsonrpc.provider.call('cogi_referral.claim', [
  //       jsonrpc.signature,
  //       {},
  //     ])
  //   }
  //   toast.success('Claim success')
  // } catch (e) {
  //   toast.error(e.message)
  // }
  // yield put(actions.dataClaimResponse())
}

function* refer() {
  // if (!(yield isConnected())) return
  // const request: DataRefer = yield select(reducers.dataRefer)
  // const jsonrpc: JsonRpcState = yield select(jsonrpcReducers.dump)
  // try {
  //   yield jsonrpc.provider.call('cogi_referral.refer', [
  //     jsonrpc.signature,
  //     {
  //       refer_code: request.refer_code,
  //       presenter: request.presenter,
  //       presenter_code: request.presenter_code,
  //     },
  //   ])
  // } catch (e) {
  //   toast.error(e.message)
  // }
}

function* getInfo() {
  // if (!(yield isConnected())) return
  // const jsonrpc: JsonRpcState = yield select(jsonrpcReducers.dump)
  // try {
  //   const res = yield jsonrpc.provider.call('cogi_referral.get_info', [
  //     jsonrpc.signature,
  //   ])
  //   yield put(actions.dataGetInfoResponse(res?.info))
  // } catch (e) {
  //   toast.error(e.message)
  // }
}

const getFriendRefer = async (request: any) => {
  try {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: API_KEY,
      },
    };
    const res = await fetch(
      cogiIDFromChainid(ClassWithStaticMethod.STATIC_DEFAULT_CHAINID).endpoint +
        API_FIND_REFERENCES +
        request,
      requestOptions,
    );
    return await res.json();
  } catch (e) {
    return null;
  }
};

function* getFriends(): Generator<any> {
  const request = yield select(reducers.dataRefer);
  try {
    const res: any = yield call(getFriendRefer, request);
    yield put(actions.dataGetFriendsResponse(res?.data ?? []));
  } catch (e: any) {
    Toast.error(e.message);
  }
}

const getAuthenticators_Enabled = async () => {
  try {
    return await rpcExecCogiChain({
      method: "account.account_info",
      params: [],
    });
  } catch (e) {
    return null;
  }
};

function* getAuthenticators_enabled(): Generator<any> {
  try {
    const res = yield call(getAuthenticators_Enabled);
    yield put(actions.resetDataAuthenticators_EnabledResponse());
    yield put(actions.dataAuthenticators_EnabledResponse(res ?? []));
  } catch (e: any) {
    Toast.error(e.message);
  }
}

const getExtract_Secured_Methods = async () => {
  try {
    return await rpcExecCogiChain({
      method: "extract_secured_methods",
      params: [],
    });
  } catch (e) {
    return null;
  }
};

function* getExtract_secured_methods(): Generator<any> {
  try {
    const res = yield call(getExtract_Secured_Methods);
    yield put(actions.resetExtract_Secured_MethodsResponse());
    yield put(actions.dataExtract_Secured_MethodsResponse(res ?? []));
  } catch (e: any) {
    Toast.error(e.message);
  }
}

function* actionGetDataClaimListener() {
  while (true) {
    yield take(actions.GET_DATA_CLAIM);
    yield fork(claimReward);
  }
}

function* actionGetDataReferListener() {
  while (true) {
    yield take(actions.GET_DATA_REFER);
    yield fork(refer);
  }
}

function* actionGetFriendsListener() {
  while (true) {
    yield take(actions.GET_FRIENDS);
    yield fork(getFriends);
  }
}

function* actionGetInfoListener() {
  while (true) {
    yield take(actions.GET_INFO);
    yield fork(getInfo);
  }
}

function* actionGetAuthenticators_Enabled() {
  while (true) {
    yield take(actions.GET_AUTHENTICATORS_ENABLED);
    yield fork(getAuthenticators_enabled);
  }
}

function* actionExtract_secured_methods() {
  while (true) {
    yield take(actions.GET_EXTRACT_SECURED_METHODS);
    yield fork(getExtract_secured_methods);
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
    fork(actionGetDataClaimListener),
    fork(actionGetDataReferListener),
    fork(actionCleanupListener),
    fork(actionGetInfoListener),
    fork(actionGetFriendsListener),
    fork(actionGetAuthenticators_Enabled),
    fork(actionExtract_secured_methods),
  ]);
}

export default function* root(): any {
  yield all([fork(actionListener)]);
}
