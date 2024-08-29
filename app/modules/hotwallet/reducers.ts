import * as walletActions from "../wallet/actions";
import * as actions from "./actions";
import { type Action, stateInitial, type State } from "./types";

export const jsonrpcResponse = (state: any | unknown): any =>
  state.hotwallet.jsonrpcResponse;
export const getTransactionsRequest = (state: any | unknown): any =>
  state.hotwallet.getTransactionsRequest;
export const getTransactionsResponse = (state: any | unknown): any =>
  state.hotwallet.getTransactionsResponse;
export const getBalancesRequest = (state: any | unknown): any =>
  state.hotwallet.getBalancesRequest;
export const getBalancesResponse = (state: any | unknown): any =>
  state.hotwallet.getBalancesResponse;
export const requestWithdrawRequest = (state: any | unknown): any =>
  state.hotwallet.requestWithdrawRequest;
export const requestWithdrawResponse = (state: any | unknown): any =>
  state.hotwallet.requestWithdrawResponse;
export const getBridgePool = (state: any | unknown): any =>
  state.hotwallet.getBridgePool;
export const bridgePoolResponse = (state: any | unknown): any =>
  state.hotwallet.bridgePoolResponse;
export const bridgeAvailableResponse = (state: any | unknown): any =>
  state.hotwallet.bridgeAvailableResponse;
export const getBalancesNFTResponse = (state: any | unknown): any =>
  state.hotwallet.getBalancesNFTResponse;
export const dump = (state: any | unknown): any => state.hotwallet;

function hotwalletReducer(state: State = stateInitial, action: Action): State {
  switch (action.type) {
    case actions.JSONRPC_RESPONSE:
    case actions.REQUEST_WITHDRAW:
    case actions.REQUEST_WITHDRAW_RESPONSE:
    case actions.GET_BALANCES:
    case actions.GET_BALANCES_RESPONSE:
    case actions.RESET_GET_BALANCES_RESPONSE:
    case actions.GET_TRANSACTIONS:
    case actions.GET_BRIDGE_POOL:
    case actions.BRIDGE_POOL_RESPONSE:
    case actions.RESET_BRIDGE_POOL_RESPONSE:
    case actions.GET_TRANSACTIONS_RESPONSE:
    case actions.RESET_REQUEST_WITHDRAW_RESPONSE:
    case actions.RESET_TRANSACTIONS_RESPONSE:
    case actions.GET_BALANCES_NFT_RESPONSE:
    case actions.GET_BALANCES_NFT:
    case actions.GET_BRIDGE_AVAILABLE:
    case actions.RESET_BRIDGE_AVAILABLE_RESPONSE:
    case actions.BRIDGE_AVAILABLE_RESPONSE:
    case actions.CLEANUP:
      return {
        ...state,
        ...action.state,
      };
    case walletActions.RESET_WEB3_PROVIDER:
      return stateInitial;
    default:
      return {
        ...state,
      };
  }
}

export default hotwalletReducer;
