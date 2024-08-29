import {
  type GetBalancesRequest,
  type GetTransactionsRequest,
  type RequestWithdrawRequest,
  type Action,
  type Balance,
  type Transaction,
  stateInitial,
} from "./types";

export const RESET_REQUEST_WITHDRAW_RESPONSE =
  "RESET_REQUEST_WITHDRAW_RESPONSE";
export const REQUEST_WITHDRAW = "HOTWALLET_REQUEST_WITHDRAW";
export const REQUEST_WITHDRAW_RESPONSE = "HOTWALLET_REQUEST_WITHDRAW_RESPONSE";
export const GET_TRANSACTIONS = "HOTWALLET_GET_TRANSACTIONS";
export const GET_TRANSACTIONS_RESPONSE = "HOTWALLET_GET_TRANSACTIONS_RESPONSE";
export const RESET_TRANSACTIONS_RESPONSE = "RESET_TRANSACTIONS_RESPONSE";
export const GET_BALANCES = "HOTWALLET_GET_BALANCES";
export const GET_BALANCES_RESPONSE = "HOTWALLET_GET_BALANCES_RESPONSE";
export const RESET_GET_BALANCES_RESPONSE = "RESET_GET_BALANCES_RESPONSE";
export const JSONRPC_RESPONSE = "HOTWALLET_JSONRPC_RESPONSE";
//
export const GET_BRIDGE_POOL = "HOTWALLET_GET_BRIDGE_POOL";
export const BRIDGE_POOL_RESPONSE = "HOTWALLET_BRIDGE_POOL_RESPONSE";
export const RESET_BRIDGE_POOL_RESPONSE =
  "HOTWALLET_RESET_BRIDGE_POOL_RESPONSE";
//
//
export const GET_BRIDGE_AVAILABLE = "HOTWALLET_GET_BRIDGE_AVAILABLE";
export const BRIDGE_AVAILABLE_RESPONSE = "HOTWALLET_BRIDGE_AVAILABLE_RESPONSE";
export const RESET_BRIDGE_AVAILABLE_RESPONSE =
  "HOTWALLET_RESET_BRIDGE_AVAILABLE_RESPONSE";
//

export const GET_BALANCES_NFT = "HOTWALLET_GET_BALANCES_NFT";
export const GET_BALANCES_NFT_RESPONSE = "HOTWALLET_GET_BALANCES_NFT_RESPONSE";
export const RESET_GET_BALANCES_NFT_RESPONSE =
  "RESET_GET_BALANCES_NFT_RESPONSE";

export const CLEANUP = "HOTWALLET_CLEANUP";

export function getBridgePools(getBridgePool: any | unknown): Action {
  return {
    type: GET_BRIDGE_POOL,
    state: {
      getBridgePool,
    },
  };
}

export function resetBridgePoolsResponse(): Action {
  return {
    type: RESET_BRIDGE_POOL_RESPONSE,
    state: {
      bridgePoolResponse: null,
    },
  };
}

export function bridgePoolsResponse(response: any | unknown): Action {
  return {
    type: BRIDGE_POOL_RESPONSE,
    state: {
      bridgePoolResponse: response,
    },
  };
}

export function getBridgeAvailable(): Action {
  return {
    type: GET_BRIDGE_AVAILABLE,
    state: stateInitial,
  };
}

export function resetBridgeAvailableResponse(): Action {
  return {
    type: RESET_BRIDGE_AVAILABLE_RESPONSE,
    state: {
      bridgeAvailableResponse: null,
    },
  };
}

export function bridgeAvailableResponse(response: any | unknown): Action {
  return {
    type: BRIDGE_AVAILABLE_RESPONSE,
    state: {
      bridgeAvailableResponse: response,
    },
  };
}

export function jsonrpcResponse(response: any | unknown): Action {
  return {
    type: JSONRPC_RESPONSE,
    state: {
      jsonrpcResponse: response,
    },
  };
}

export function requestWithdraw(request: RequestWithdrawRequest): Action {
  return {
    type: REQUEST_WITHDRAW,
    state: {
      requestWithdrawRequest: request,
    },
  };
}

export function resetRequestWithdrawResponse(): Action {
  return {
    type: RESET_REQUEST_WITHDRAW_RESPONSE,
    state: {
      requestWithdrawResponse: null,
    },
  };
}

export function requestWithdrawResponse(response: any | unknown): Action {
  return {
    type: REQUEST_WITHDRAW_RESPONSE,
    state: {
      requestWithdrawResponse: response,
    },
  };
}

export function getBalances(request: GetBalancesRequest): Action {
  return {
    type: GET_BALANCES,
    state: {
      getBalancesRequest: request,
    },
  };
}

export function getBalancesResponse(response: Record<string, Balance>): Action {
  return {
    type: GET_BALANCES_RESPONSE,
    state: {
      getBalancesResponse: response,
    },
  };
}

export function resetGetBalancesResponse(): Action {
  return {
    type: RESET_GET_BALANCES_RESPONSE,
    state: {
      getBalancesResponse: null,
    },
  };
}

export function getTransactions(request: GetTransactionsRequest): Action {
  return {
    type: GET_TRANSACTIONS,
    state: {
      getTransactionsRequest: request,
    },
  };
}

export function getTransactionsResponse(
  response: Record<string, Transaction[]>,
): Action {
  return {
    type: GET_TRANSACTIONS_RESPONSE,
    state: {
      getTransactionsResponse: response,
    },
  };
}

export function resetGetTransactionsResponse(): Action {
  return {
    type: RESET_TRANSACTIONS_RESPONSE,
    state: {
      getTransactionsResponse: null,
    },
  };
}

export function getBalancesNFT(): Action {
  return {
    type: GET_BALANCES_NFT,
  };
}

export function balancesNFTResponse(
  response: Record<string, Transaction[]>,
): Action {
  return {
    type: GET_BALANCES_NFT_RESPONSE,
    state: {
      getBalancesNFTResponse: response,
    },
  };
}

export function resetBalancesNFTResponse(): Action {
  return {
    type: RESET_GET_BALANCES_NFT_RESPONSE,
    state: {
      getBalancesNFTResponse: null,
    },
  };
}

export function cleanup(): Action {
  return {
    type: CLEANUP,
    state: stateInitial,
  };
}
