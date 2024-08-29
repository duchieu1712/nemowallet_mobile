import { type ISignaturePersonal } from "../../common/types";
import {
  type Action,
  type State,
  stateInitial,
  type ContractCallRequest,
  type ErrorCode,
} from "./types";

export const RELOAD = "RELOAD";
export const CONTRACT_CALL = "CONTRACT_CALL";
export const CONTRACT_CALL_RESPONSE = "CONTRACT_CALL_RESPONSE";
export const RESET_CONTRACT_CALL_RESPONSE = "RESET_CONTRACT_CALL_RESPONSE";
//
export const CONTRACT_CALL_METAMASK = "CONTRACT_CALL_METAMASK";
export const CONTRACT_CALL_METAMASK_RESPONSE =
  "CONTRACT_CALL_METAMASK_RESPONSE";
export const RESET_CONTRACT_CALL_METAMASK_RESPONSE =
  "RESET_CONTRACT_CALL_METAMASK_RESPONSE";
//
export const CONTRACT_BATCH = "CONTRACT_BATCH";
export const CONTRACT_BATCH_RESPONSE = "CONTRACT_BATCH_RESPONSE";
export const RESET_CONTRACT_BATCH_RESPONSE = "RESET_CONTRACT_BATCH_RESPONSE";

export const SET_WEB3_PROVIDER = "WALLET_SET_WEB3_PROVIDER";
export const SET_ADDRESS = "WALLET_SET_ADDRESS";
export const SET_CHAIN_ID = "WALLET_SET_CHAIN_ID";
export const RESET_WEB3_PROVIDER = "WALLET_RESET_WEB3_PROVIDER";
export const CANCEL = "WALLET_CANCEL";
export const CONNECT = "WALLET_CONNECT";
export const CONNECT_METAMASK = "WALLET_CONNECT_METAMASK";
export const SET_PROVIDER = "WALLET_SET_PROVIDER";
export const DISCONNECT = "WALLET_DISCONNECT";
export const ACCOUNT_TO_SIGNATURE = "WALLET_ACCOUNT_TO_SIGNATURE";
export const ACCOUNT_TO_SIGNATURE_RESPONSE =
  "WALLET_ACCOUNT_TO_SIGNATURE_RESPONSE";
export const RELOAD_DATA = "WALLET_RELOAD_DATA";

export const RESET_ERROR_CODE = "WALLET_RESET_ERROR_CODE";
export const CLEANUP = "WALLET_CLEANUP";

export function reloadData(flag: boolean): Action {
  return {
    type: RELOAD_DATA,
    state: {
      reloadData: flag,
    },
  };
}

export function accountToSignature(): Action {
  return {
    type: ACCOUNT_TO_SIGNATURE,
  };
}

export function accountToSignatureResponse(
  signature: ISignaturePersonal,
): Action {
  return {
    type: ACCOUNT_TO_SIGNATURE_RESPONSE,
    state: {
      signature,
    },
  };
}

export function contractCall(request: ContractCallRequest): Action {
  return {
    type: CONTRACT_CALL,
    state: {
      contractCallRequest: request,
    },
  };
}

export function resetContractCallResponse(): Action {
  return {
    type: RESET_CONTRACT_CALL_RESPONSE,
    state: {
      contractCallResponse: null,
    },
  };
}

export function contractCallResponse(response: any | unknown): Action {
  return {
    type: CONTRACT_CALL_RESPONSE,
    state: {
      contractCallResponse: response,
    },
  };
}

export function contractCallMetamask(request: ContractCallRequest): Action {
  return {
    type: CONTRACT_CALL_METAMASK,
    state: {
      contractCallMetamaskRequest: request,
    },
  };
}

export function resetContractCallMetamaskResponse(): Action {
  return {
    type: RESET_CONTRACT_CALL_METAMASK_RESPONSE,
    state: {
      contractCallMetamaskResponse: null,
    },
  };
}

export function contractCallMetamaskResponse(response: any | unknown): Action {
  return {
    type: CONTRACT_CALL_METAMASK_RESPONSE,
    state: {
      contractCallMetamaskResponse: response,
    },
  };
}

export function contractBatch(request: any | unknown): Action {
  return {
    type: CONTRACT_BATCH,
    state: {
      contractBatchRequest: request,
    },
  };
}

export function resetContractBatchResponse(): Action {
  return {
    type: RESET_CONTRACT_BATCH_RESPONSE,
    state: {
      contractBatchResponse: null,
    },
  };
}

export function contractBatchResponse(response: any | unknown): Action {
  return {
    type: CONTRACT_BATCH_RESPONSE,
    state: {
      contractBatchResponse: response,
    },
  };
}

export function reset_ErrorCode(): Action {
  return {
    type: RESET_ERROR_CODE,
    state: {
      errorCode: null,
    },
  };
}

export function connect(): Action {
  return {
    type: CONNECT,
    state: {
      userAction: CONNECT,
      connecting: true,
      errorCode: null,
    },
  };
}

export function connectMetamask(): Action {
  return {
    type: CONNECT_METAMASK,
    state: {
      userAction: CONNECT_METAMASK,
      connecting: true,
      errorCode: null,
    },
  };
}

export function cancel(errorCode: ErrorCode): Action {
  return {
    type: CANCEL,
    state: {
      userAction: CANCEL,
      connecting: false,
      errorCode,
    },
  };
}

export function reload(): Action {
  return {
    type: RELOAD,
    state: {
      userAction: RELOAD,
    },
  };
}

export function disconnect(): Action {
  return {
    type: DISCONNECT,
    state: {
      userAction: DISCONNECT,
      connecting: false,
    },
  };
}

export function setProvider(provider: any): Action {
  return {
    type: SET_PROVIDER,
    state: {
      provider,
    },
  };
}

export function setWeb3Provider(state: State): Action {
  const _state: State = {
    web3Modal: state.web3Modal,
    provider: state.provider,
    web3Provider: state.web3Provider,
    address: state.address,
    chainId: state.chainId,
    contracts: state.contracts,
    contractsNetworkMetamask: state.contractsNetworkMetamask,
    connecting: state.connecting,
    connected: state.connected,
    errorCode: state.errorCode,
  };
  if (state.contracts != null) {
    _state.errorCode = null;
  }

  return {
    type: SET_WEB3_PROVIDER,
    state: _state,
  };
}

export function setAddress(state: State): Action {
  return {
    type: SET_ADDRESS,
    state: {
      address: state.address,
    },
  };
}

export function setChainId(state: State): Action {
  return {
    type: SET_CHAIN_ID,
    state: {
      chainId: state.chainId,
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function resetWeb3Provider(state: State = {}): Action {
  return {
    type: RESET_WEB3_PROVIDER,
    state: {
      web3Modal: null,
      provider: null,
      web3Provider: null,
      address: null,
      chainId: null,
      contractsNetworkMetamask: null,
    },
  };
}

export function cleanup(): Action {
  return {
    type: CLEANUP,
    state: stateInitial,
  };
}
