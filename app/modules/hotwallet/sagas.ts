import { take, put, fork, select, all, call } from "redux-saga/effects";
import * as actions from "./actions";
import * as reducers from "./reducers";
import {
  type Balance,
  type GetBalancesRequest,
  type GetTransactionsRequest,
  type RequestWithdrawRequest,
} from "./types";
import * as jsonrpcActions from "../jsonrpc/actions";
import { channel } from "redux-saga";
import {
  type Response,
  RESPONSE_STATUS_OK,
  type State as JsonRpcState,
} from "../jsonrpc/types";
import { cast, descyptNEMOWallet } from "../../common/utilities";
import { type IContractRelay } from "../../common/types";
import * as jsonrpcReducers from "../jsonrpc/reducers";
import * as AccountReducers from "../account/reducers";
import {
  rpcExecCogiChain,
  rpcExecCogiChain_batch,
  rpcFetchAPI,
} from "../../components/RpcExec/toast_chain";
import { TYPE_DEPOSIT, TYPE_WITHDRAW } from "../../common/enum";

const jsonrpcResponseChannel = channel();

function* requestWithdraw() {
  const request: RequestWithdrawRequest = yield select(
    reducers.requestWithdrawRequest,
  );
  const jsonrpc: JsonRpcState = yield select(jsonrpcReducers.dump);
  const accountWeb = yield select(AccountReducers.dataAccount);
  // yield put(
  //   jsonrpcActions.call({
  //     handler: (response) =>
  //       jsonrpcResponseChannel.put(actions.jsonrpcResponse(response)),
  //     method: `${request.namespace}.request_withdraw`,
  //     params: [accountWeb?.signature, jsonrpc.signature, request.amount],
  //   })
  // )
  yield put(
    jsonrpcActions.callWithdraw({
      handler: (response) => {
        jsonrpcResponseChannel.put(actions.jsonrpcResponse(response));
      },
      method: `${request.namespace}.request_withdraw`,
      params: [
        accountWeb?.account?.signature,
        jsonrpc.signature,
        request.amount,
      ],
    }),
  );
}

function* getBalances() {
  const request: GetBalancesRequest = yield select(reducers.getBalancesRequest);
  const ret: Record<string, Balance> = {};
  const batch = [];
  for (let i = 0; i < request.namespaces.length; i++) {
    const namespace = request.namespaces[i];
    batch.push({
      method: `${namespace}.get_balance`,
      params: [],
    });
  }
  try {
    const ress = yield rpcExecCogiChain_batch(batch);
    for (let k = 0; k < ress?.length; k++) {
      const res = ress[k];
      ret[request.namespaces[k]] = cast<Balance>(res);
    }
    yield put(actions.resetGetBalancesResponse());
    yield put(actions.getBalancesResponse(ret));
    // An - Khóa
    // yield getBalancesReload()
  } catch {
    yield put(actions.resetGetBalancesResponse());
  }
}

function* getBridgePools() {
  const request = yield select(reducers.getBridgePool);
  try {
    let method = "";
    if (request == TYPE_DEPOSIT.DEPOSIT || request == TYPE_WITHDRAW.WITHDRAW) {
      method = "bridge.pools";
      const retPools = yield call(rpcExecCogiChain, {
        method,
        params: [],
      });
      yield put(actions.resetBridgePoolsResponse());
      yield put(
        actions.bridgePoolsResponse({
          pools: retPools,
        }),
      );
    } else {
      const retPools = yield call(rpcExecCogiChain, {
        method: "bridge.pools",
        params: [],
      });
      const retSupporting_pools = yield call(rpcExecCogiChain, {
        method: "bridge.supporting_pools",
        params: [],
      });
      yield put(actions.resetBridgePoolsResponse());
      yield put(
        actions.bridgePoolsResponse({
          pools: retPools,
          supporting_pools: retSupporting_pools,
        }),
      );
    }
  } catch {
    yield put(actions.resetBridgePoolsResponse());
  }
}

function* getBridgeAvailable() {
  try {
    // const accountWeb = yield select(AccountReducers.dataAccount)
    const ret = yield call(rpcExecCogiChain, {
      method: "bridge.available",
      params: [],
    });
    yield put(actions.resetBridgeAvailableResponse());
    yield put(actions.bridgeAvailableResponse(ret));
  } catch {
    yield put(actions.resetBridgeAvailableResponse());
  }
}

function* getTransactions() {
  try {
    const request: GetTransactionsRequest = yield select(
      reducers.getTransactionsRequest,
    );
    const accountWeb = yield select(AccountReducers.dataAccount);

    let options;
    let url = "";
    if (request?.isNative) {
      url =
        "addresses/" +
        descyptNEMOWallet(accountWeb?.nemo_address) +
        "/tokens/0x0000000000000000000000000000000000000000/token-transfers";
    } else {
      url =
        "addresses/" +
        descyptNEMOWallet(accountWeb?.nemo_address) +
        "/tokens/" +
        request.tokenAddress +
        "/token-transfers";
    }
    if (request?.next_page_params) {
      options = {
        ...request?.next_page_params,
      };
    }
    const ress = yield rpcFetchAPI(url, options);
    yield put(actions.resetGetTransactionsResponse());
    yield put(actions.getTransactionsResponse(ress));
    // An - Khóa
    // yield getTransactionsReload()
  } catch {
    yield put(actions.resetGetTransactionsResponse());
  }
}

function* getBalancesNFT() {
  try {
    const accountWeb = yield select(AccountReducers.dataAccount);
    const url =
      "addresses/" +
      descyptNEMOWallet(accountWeb?.nemo_address) +
      "/token-balances";
    const ress = yield rpcFetchAPI(url);
    yield put(actions.resetBalancesNFTResponse());
    yield put(actions.balancesNFTResponse(ress));
  } catch {
    yield put(actions.resetBalancesNFTResponse());
  }
}

function* actionRequestWithdrawListener() {
  while (true) {
    yield take(actions.REQUEST_WITHDRAW);
    yield fork(requestWithdraw);
  }
}

function* actionGetTransactionsListener() {
  while (true) {
    yield take(actions.GET_TRANSACTIONS);
    yield fork(getTransactions);
  }
}

function* actionGetBalancesNFTListener() {
  while (true) {
    yield take(actions.GET_BALANCES_NFT);
    yield fork(getBalancesNFT);
  }
}

function* actionGetBalancesListener() {
  while (true) {
    yield take(actions.GET_BALANCES);
    yield fork(getBalances);
  }
}

function* jsonrpcResponse() {
  const response: Response = yield select(reducers.jsonrpcResponse);
  if (response.status != RESPONSE_STATUS_OK) {
    console.error(`jsonrpcResponse Failed ${JSON.stringify(response)}`);
    const [namespace, method] = response.request.method?.split(".");
    const rwres: any = {};
    rwres[namespace] = method + new Date();
    rwres.err = true;
    yield put(actions.requestWithdrawResponse(rwres));
    return;
  }
  const [namespace, method] = response.request.method?.split(".");
  switch (method) {
    case "request_withdraw": {
      /*
      {
        "request": {
            "method": "cogi_hotwallet.request_withdraw",
            "params": [
                "100"
            ]
        },
        "status": "RESPONSE_STATUS_OK",
        "rawMsg": {
            "contract_relay": {
                "method": "withdraw",
                "params": {
                    "account": "0x98740350D82B648A70bC216A6b922F3c6Fa2E0Ef",
                    "amount": "100",
                    "deadline": 1634183090,
                    "signature": "0xcda2a667b23981e9a69ad6a253d220245671e615ddcc001933adb7d6ac63b6a64ec6f24e0daac8f780543979f0985a7c482bc2e1d9c42ef9b03308762e34553e1b"
                }
            }
        }
      }
      */
      let rwres: Record<string, IContractRelay> = yield select(
        reducers.requestWithdrawResponse,
      );
      yield put(actions.resetRequestWithdrawResponse());
      if (rwres == null) {
        rwres = {};
      }
      rwres[namespace] = cast<IContractRelay>(response.rawMsg.contract_relay);
      yield put(actions.requestWithdrawResponse(rwres));
      break;
    }
    default: {
      // eslint-disable-next-line no-console
      console.log(`not found ${response.request.method}`);
    }
  }
}

function* actionJsonrpcResponseListener() {
  while (true) {
    yield take(actions.JSONRPC_RESPONSE);
    yield fork(jsonrpcResponse);
  }
}

function* jsonrpcResponseChannelListener() {
  while (true) {
    const action = yield take(jsonrpcResponseChannel);
    yield put(action);
  }
}

function* bridgeResponseChannelListener() {
  while (true) {
    yield take(actions.GET_BRIDGE_POOL);
    yield fork(getBridgePools);
  }
}

function* bridgeAvailableResponseChannelListener() {
  while (true) {
    yield take(actions.GET_BRIDGE_AVAILABLE);
    yield fork(getBridgeAvailable);
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
function* actionReloadListener() {}

function* actionListener() {
  yield all([
    fork(actionGetBalancesListener),
    fork(actionGetTransactionsListener),
    fork(actionRequestWithdrawListener),
    fork(jsonrpcResponseChannelListener),
    fork(bridgeResponseChannelListener),
    fork(bridgeAvailableResponseChannelListener),
    fork(actionGetBalancesNFTListener),
    fork(actionReloadListener),
  ]);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
function* startup() {}

export default function* root(): any {
  yield all([
    fork(startup),
    fork(actionListener),
    fork(actionJsonrpcResponseListener),
  ]);
}
