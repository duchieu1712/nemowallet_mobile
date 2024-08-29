import * as AccountActions from "../../modules/account/actions";
import * as actions from "./actions";
import * as reducers from "./reducers";

import {
  type Action,
  type ContractCallRequest,
  ErrorCode,
  type WalletContract,
} from "./types";
import { Contract, providers } from "ethers";
import { type IContract as ContractConfig } from "../../common/types";
import { call, fork, put, select, take } from "redux-saga/effects";
import {
  contractCallNetwork_Eth,
  contractCogiChain_call,
  contractEth_batch,
} from "../../components/RpcExec/toast_chain";
import { dataFromWeb3, isAllowChainId } from "../../common/utilities_config";

import { ClassWithStaticMethod } from "../../common/static";
import { cf_MESSAGE_JSONRPC } from "../../config/message";
import contractConfigs from "../../config/contracts";
import { eventChannel } from "redux-saga";
import { isMobile } from "react-device-detect";
import { sleep } from "../../common/utilities";

function* accountToSignature() {
  try {
    const web3Provider = yield select(reducers.selectedWeb3Provider);
    const signature = yield call(getSigner, web3Provider, cf_MESSAGE_JSONRPC);
    if (signature != null) {
      yield put(
        actions.accountToSignatureResponse({
          message: cf_MESSAGE_JSONRPC,
          signature,
        }),
      );
    } else {
      yield disconnect();
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("annnn", e);
    yield disconnect();
  }
}

// function* accountToSignature() {
//   try {
//     const selectedAddress = yield select(reducers.selectedAddress)
//     const provider = yield select(reducers.selectedProvider)
//     const nonce = 0
//     const deadline = Math.round(+new Date() / 1000) + 60 * 60
//     const dataToSign = eip712SignatureToAccount
//     dataToSign['message'] = {
//       deadline: deadline,
//       nonce: nonce,
//     }
//     console.log('provider',provider);
//     console.log('selectedAddress',selectedAddress);

//     const method = 'eth_signTypedData_v4'
//     const signature = yield call(providerCall, provider, method, [
//       selectedAddress,
//       JSON.stringify(dataToSign),
//     ])
//     yield put(
//       actions.accountToSignatureResponse({ nonce, deadline, signature })
//     )
//   } catch (e) {
//     // eslint-disable-next-line no-console
//     console.log(e)
//   }
// }

const getSigner = async (web3Provider: any, message: any) => {
  try {
    const signer = await web3Provider.getSigner();
    const signedMessage = await signer.signMessage(message);
    return signedMessage;
  } catch {
    return null;
  }
};

function* contractCallMetamask() {
  try {
    const request: ContractCallRequest = yield select(
      reducers.contractCallMetamaskRequest,
    );
    const Contract: Contract = yield select(
      reducers.selectedContractFromNamespace,
      request.namespace,
    );
    if (Contract == null) throw `not found contracts[${request.namespace}]`;
    const ret = yield call(
      contractCallNetwork_Eth,
      Contract,
      request.method,
      request.params,
    );
    let res: Record<string, Record<string, any>> = yield select(
      reducers.contractCallMetamaskRequest,
    );
    if (res == null) {
      res = {};
    }
    if (res[request.namespace] == null) {
      res[request.namespace] = {};
    }
    res[request.namespace][request.method] = dataFromWeb3(ret);
    yield put(actions.resetContractCallMetamaskResponse());
    yield call(sleep, 100);
    yield put(actions.contractCallMetamaskResponse(res));
  } catch (e) {
    yield put(actions.resetContractCallMetamaskResponse());
  }
}

function* contractCall() {
  try {
    const request: ContractCallRequest = yield select(
      reducers.contractCallRequest,
    );
    const Contract: Contract = yield select(
      reducers.selectedContractFromNamespaceCogiNetwork,
      request.namespace,
    );
    if (Contract == null) throw `not found contracts[${request.namespace}]`;
    const ret = yield call(
      contractCogiChain_call,
      Contract,
      request.method,
      request.params,
    );
    let res: Record<string, Record<string, any>> = yield select(
      reducers.contractResponse,
    );
    if (res == null) {
      res = {};
    }
    if (res[request.namespace] == null) {
      res[request.namespace] = {};
    }
    res[request.namespace][request.method] = dataFromWeb3(ret);
    yield put(actions.resetContractCallResponse());
    yield call(sleep, 100);
    yield put(actions.contractCallResponse(res));
  } catch (e) {
    yield put(actions.resetContractCallResponse());
  }
}

function* contractBatch() {
  try {
    const request = yield select(reducers.contractBatchRequest);
    const lstRequestJsonRpc = [];
    for (let i = 0; i < request.lstBatch.length; i++) {
      const namespace = request.lstBatch[i].namespace;
      const params = request.lstBatch[i].params;
      const method = request.lstBatch[i].method;
      const Contract: Contract = yield select(
        reducers.selectedContractFromNamespaceCogiNetwork,
        namespace,
      );
      if (Contract == null) throw `not found contracts[${namespace}]`;
      lstRequestJsonRpc.push({
        contract: Contract,
        method,
        params,
      });
    }
    const ret = yield call(contractEth_batch, lstRequestJsonRpc);
    const res = new Object();
    for (let i = 0; i < ret.length; i++) {
      const namespace = request.lstBatch[i].namespace;
      const method = request.lstBatch[i].method;
      if (ret[i] instanceof Error) {
        res[namespace] = new Object();
        res[namespace][method] = "";
      } else {
        res[namespace] = new Object();
        res[namespace][method] = dataFromWeb3(ret[i]);
      }
    }
    yield put(actions.resetContractBatchResponse());
    yield put(actions.contractBatchResponse(res));
  } catch (e) {
    yield put(actions.resetContractBatchResponse());
  }
}

function* disconnect() {
  const web3Modal = yield select(reducers.selectedWeb3Modal);
  if (web3Modal?.on) {
    yield web3Modal.clearCachedProvider();
  }
  const provider = yield select(reducers.selectedProvider);
  if (provider?.disconnect && typeof provider.disconnect === "function") {
    yield provider.disconnect();
  }
  yield put(actions.resetWeb3Provider());
}

const getConnect = async (): Promise<Action> => {
  try {
    const contracts: WalletContract[] = [];
    for (let i = 0; i < contractConfigs.length; i++) {
      const cfg: ContractConfig = contractConfigs[i];
      if (cfg.chainId == ClassWithStaticMethod.NEMO_WALLET_CHAINID) {
        contracts.push({
          namespace: cfg.namespace,
          contract: new Contract(cfg.address, cfg.abi),
        });
      }
    }
    const action = actions.setWeb3Provider({
      address: null,
      chainId: ClassWithStaticMethod.NEMO_WALLET_CHAINID,
      contracts,
      connecting: false,
      connected: true,
      errorCode: null,
    });
    return action;
  } catch (e: any) {
    throw new Error(e?.message ?? e);
  }
};

function* connect() {
  try {
    const action = yield getConnect();
    yield put(action);
  } catch (_) {
    yield put(actions.cancel(ErrorCode.ConnectUserCancel));
  }
}

const getConnectMetamask = async (
  web3Modal = null,
  provider = null,
): Promise<Action> => {
  try {
    // const store = appState()
    // const accountWeb = store?.account?.dataAccount
    const web3Provider = new providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    const network = await web3Provider.getNetwork();

    let errorCode = null;
    if (!isAllowChainId(network.chainId)) {
      errorCode = ErrorCode.ConnectWrongNetwork;
    }
    const contracts: WalletContract[] = [];
    const contractsNetworkMetamask: WalletContract[] = [];
    for (let i = 0; i < contractConfigs.length; i++) {
      const cfg: ContractConfig = contractConfigs[i];
      if (cfg.chainId == ClassWithStaticMethod.NEMO_WALLET_CHAINID) {
        contracts.push({
          namespace: cfg.namespace,
          contract: new Contract(cfg.address, cfg.abi, signer),
        });
      }
      if (cfg.chainId == ClassWithStaticMethod.STATIC_DEFAULT_CHAINID) {
        contractsNetworkMetamask.push({
          namespace: cfg.namespace,
          contract: new Contract(cfg.address, cfg.abi, signer),
        });
      }
    }
    // ClassWithStaticMethod.SET_STATIC_DEFAULT_CHAINID(network.chainId)
    const action = actions.setWeb3Provider({
      web3Modal,
      provider,
      web3Provider,
      address,
      chainId: network.chainId,
      contracts,
      contractsNetworkMetamask,
      connecting: false,
      connected: true,
      errorCode,
    });
    return action;
  } catch (e: any) {
    throw new Error(e?.message ?? e);
  }
};

function* connectMetamask() {
  try {
    yield put(AccountActions.setRequestConnectWallet(true));
  } catch (_) {
    yield put(actions.cancel(ErrorCode.ConnectUserCancel));
  }
}

function* accountToSet_Provider() {
  try {
    const provider = yield select(reducers.selectedProvider);
    if (typeof window === "undefined") {
      yield put(actions.resetWeb3Provider());
      return;
    }
    const action = yield getConnectMetamask(null, provider);
    yield put(action);
    yield providerEventListener(null, provider);
    yield put(AccountActions.setRequestConnectWallet(true));
  } catch (_) {
    yield put(actions.cancel(ErrorCode.ConnectUserCancel));
  }
}

function providerEventChannel(web3Modal, provider) {
  return eventChannel((emit) => {
    provider.on("accountsChanged", async (_accounts: string[]) => {
      try {
        if (!isMobile) {
          emit(actions.cleanup());
          const action = await getConnectMetamask(web3Modal, provider);
          if (action != null) {
            emit(action);
          }
        }
        _accounts.length != 0 &&
          emit(actions.setAddress({ address: _accounts[0] }));
      } catch (_) {
        emit(actions.cancel(ErrorCode.ConnectUserCancel));
      }
    });

    provider.on("chainChanged", async (_chainId: number) => {
      try {
        if (!isMobile) {
          emit(actions.cleanup());
          const action = await getConnectMetamask(web3Modal, provider);
          emit(action);
        } else {
          ClassWithStaticMethod.SET_STATIC_DEFAULT_CHAINID(_chainId);
          emit(actions.setChainId({ chainId: _chainId }));
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
        emit(actions.cancel(ErrorCode.ConnectUserCancel));
      }
    });

    provider.on(
      "disconnect",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function (error: { code: number; message: string }) {
        emit(actions.disconnect());
      },
    );
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  });
}

function* actionContractCallListener() {
  while (true) {
    yield take(actions.CONTRACT_CALL);
    yield fork(contractCall);
  }
}

function* actionContractCallMetamaskListener() {
  while (true) {
    yield take(actions.CONTRACT_CALL_METAMASK);
    yield fork(contractCallMetamask);
  }
}

function* actionContractBatchListener() {
  while (true) {
    yield take(actions.CONTRACT_BATCH);
    yield fork(contractBatch);
  }
}

function* actionConnectMetamaskListener() {
  while (true) {
    yield take(actions.CONNECT_METAMASK);
    yield fork(connectMetamask);
  }
}

function* actionConnectListener() {
  while (true) {
    yield take(actions.CONNECT);
    yield fork(connect);
  }
}

function* actionDisconnectEventListener() {
  while (true) {
    yield take(actions.DISCONNECT);
    yield fork(disconnect);
  }
}

function* actionAccountToSignatureListener() {
  while (true) {
    yield take(actions.ACCOUNT_TO_SIGNATURE);
    yield fork(accountToSignature);
  }
}

function* actionAccountSet_Provider() {
  while (true) {
    yield take(actions.SET_PROVIDER);
    yield fork(accountToSet_Provider);
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
function* actionReloadListener() {}

function* actionListener() {
  yield fork(actionConnectListener);
  yield fork(actionConnectMetamaskListener);
  yield fork(actionDisconnectEventListener);
  yield fork(actionContractBatchListener);
  yield fork(actionContractCallListener);
  yield fork(actionContractCallMetamaskListener);
  yield fork(actionAccountToSignatureListener);
  yield fork(actionAccountSet_Provider);
  yield fork(actionReloadListener);
}

function* providerEventListener(web3Modal, provider) {
  const chan = providerEventChannel(web3Modal, provider);
  while (true) {
    const action = yield take(chan);
    yield put(action);
  }
}

function* startup() {
  // yield put(actions.connect())
}

export default function* root(): any {
  yield fork(startup);
  yield fork(actionListener);
}
