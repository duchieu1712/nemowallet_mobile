import {
  type State,
  type Action,
  stateInitial,
  type WalletContract,
} from "./types";
import * as actions from "./actions";

export const contractCallRequest = (state: any): any =>
  state.wallet.contractCallRequest;
export const contractResponse = (state: any): any =>
  state.wallet.contractCallResponse;

export const contractCallMetamaskRequest = (state: any): any =>
  state.wallet.contractCallMetamaskRequest;
export const contractMetamaskResponse = (state: any): any =>
  state.wallet.contractCallMetamaskResponse;

export const contractBatchRequest = (state: any): any =>
  state.wallet.contractBatchRequest;
export const contractBatchResponse = (state: any): any =>
  state.wallet.contractBatchResponse;

export const selectedWeb3Modal = (state: any): any => state.wallet.web3Modal;
export const selectedWeb3Provider = (state: any): any =>
  state.wallet.web3Provider;
export const selectedProvider = (state: any): any => state.wallet.provider;
export const selectedChainId = (state: any): any => state.wallet.chainId;
export const selectedAddress = (state: any): any => state.wallet.address;
export const selectedUserAction = (state: any): any => state.wallet.userAction;
export const selectedSignature = (state: any): any => state.wallet.signature;
export const contractCallResponse = (state: any): any =>
  state.wallet.contractCallResponse;
export const dump = (state: any): any => state.wallet;
export const connecting = (state: any): any => state.wallet.connecting;
export const connected = (state: any): any => state.wallet.connected;
export const contracts = (state: any): any => state.wallet.contracts;
export const contractsNetworkMetamask = (state: any): any =>
  state.wallet.contractsNetworkMetamask;
export const isOnReload = (state: any): any =>
  state.wallet.userAction == actions.RELOAD;
export const errorCode = (state: any): any => state.wallet.errorCode;
export const reloadData = (state: any): any => state.wallet.reloadData;

export const selectedContractFromNamespace = (
  state: any | unknown,
  namespace: string,
): any => {
  for (let i = 0; i < state?.wallet?.contractsNetworkMetamask?.length; i++) {
    const wc: WalletContract = state.wallet.contractsNetworkMetamask[i];
    if (wc.namespace == namespace) {
      return wc.contract;
    }
  }
  return null;
};

export const selectedContractFromNamespaceCogiNetwork = (
  state: any | unknown,
  namespace: string,
): any => {
  for (let i = 0; i < state?.wallet?.contracts?.length; i++) {
    const wc: WalletContract = state.wallet.contracts[i];
    if (wc.namespace == namespace) {
      return wc.contract;
    }
  }
  return null;
};

function walletReducer(state: State = stateInitial, action: Action): State {
  switch (action.type) {
    case actions.CONTRACT_CALL:
    case actions.CONTRACT_CALL_RESPONSE:
    case actions.RESET_CONTRACT_CALL_RESPONSE:
    case actions.CONTRACT_CALL_METAMASK:
    case actions.CONTRACT_CALL_METAMASK_RESPONSE:
    case actions.RESET_CONTRACT_CALL_METAMASK_RESPONSE:
    case actions.CONTRACT_BATCH:
    case actions.CONTRACT_BATCH_RESPONSE:
    case actions.ACCOUNT_TO_SIGNATURE:
    case actions.ACCOUNT_TO_SIGNATURE_RESPONSE:
    case actions.SET_WEB3_PROVIDER:
    case actions.SET_PROVIDER:
    case actions.SET_ADDRESS:
    case actions.SET_CHAIN_ID:
    case actions.CONNECT:
    case actions.CONNECT_METAMASK:
    case actions.CANCEL:
    case actions.DISCONNECT:
    case actions.RELOAD:
    case actions.RELOAD_DATA:
    case actions.RESET_WEB3_PROVIDER:
    case actions.CLEANUP:
      return {
        ...state,
        ...action.state,
      };
    default:
      return {
        ...state,
      };
  }
}

export default walletReducer;
