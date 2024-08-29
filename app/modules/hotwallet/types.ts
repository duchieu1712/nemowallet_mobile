import { type IContractRelay } from "../../common/types";

export interface Balance {
  balance: string;
  available_balance: string;
  pending_balance: string;
}

export interface Transaction {
  sender_or_receiver?: string;
  kind: number;
  method: number;
  account: string;
  amount: number;
  balance: number;
  timestamp: number;
  hash: string;
  prevHash: string;
  status: number;
}

export interface RequestWithdrawRequest {
  namespace: string;
  amount: string;
}

export interface GetBalancesRequest {
  namespaces: string[] | any;
}

export interface GetTransactionsRequest {
  // namespaces: string[]
  next_page_params: any;
  tokenAddress: any;
  isNative: boolean;
}

export interface State {
  jsonrpcResponse?: any;
  getBalancesRequest?: GetBalancesRequest;
  getBalancesResponse?: Record<string, Balance>;
  getTransactionsRequest?: GetTransactionsRequest;
  getTransactionsResponse?: Record<string, Transaction[]>;
  getBalancesNFTResponse?: any;
  requestWithdrawRequest?: RequestWithdrawRequest;
  requestWithdrawResponse?: Record<string, IContractRelay>;
  getBridgePool?: any;
  bridgePoolResponse?: any;
  bridgeAvailableResponse?: any;
}

export interface Action {
  type: string;
  state?: State;
}

export const stateInitial: State = {
  jsonrpcResponse: null,
  getBalancesRequest: null,
  getBalancesResponse: null,
  getTransactionsRequest: null,
  getTransactionsResponse: null,
  requestWithdrawRequest: null,
  requestWithdrawResponse: null,
  bridgePoolResponse: null,
  bridgeAvailableResponse: null,
};

export const actionInitial: Action = {
  type: null,
  state: stateInitial,
};
