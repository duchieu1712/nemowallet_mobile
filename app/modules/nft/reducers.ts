import * as walletActions from "../wallet/actions";
import * as actions from "./actions";
import { type Action, type State, stateInitial } from "./types";

export const getClaimables = (state: any | unknown): any =>
  state.nft.getClaimables;
export const claimablesResponse = (state: any | unknown): any =>
  state.nft.claimablesResponse;

export const requestClaim = (state: any | unknown): any =>
  state.nft.requestClaim;
export const requestClaimResponse = (state: any | unknown): any =>
  state.nft.requestClaimResponse;

export const cancelClaim = (state: any | unknown): any => state.nft.cancelClaim;
export const cancelClaimResponse = (state: any | unknown): any =>
  state.nft.cancelClaimResponse;

export const getAvailables = (state: any | unknown): any =>
  state.nft.getAvailables;
export const availablesResponse = (state: any | unknown): any =>
  state.nft.availablesResponse;

export const getData = (state: any | unknown): any => state.nft.getData;
export const dataOnRequest = (state: any | unknown): any =>
  state.nft.dataOnRequest;
export const dataResponse = (state: any | unknown): any =>
  state.nft.dataResponse;

export const getDatas = (state: any | unknown): any => state.nft.getDatas;
export const datasOnRequest = (state: any | unknown): any =>
  state.nft.datasOnRequest;
export const datasResponse = (state: any | unknown): any =>
  state.nft.datasResponse;

export const getMarketDatas = (state: any | unknown): any =>
  state.nft.getMarketDatas;
export const marketDatasOnRequest = (state: any | unknown): any =>
  state.nft.marketDatasOnRequest;
export const marketDatasResponse = (state: any | unknown): any =>
  state.nft.marketDatasResponse;

export const getFilterNameDatas = (state: any | unknown): any =>
  state.nft.getFilterNameDatas;
export const filterNameDatasOnRequest = (state: any | unknown): any =>
  state.nft.filterNameDatasOnRequest;
export const filterNameDatasResponse = (state: any | unknown): any =>
  state.nft.filterNameDatasResponse;

export const getFilterNameSellingDatas = (state: any | unknown): any =>
  state.nft.getFilterNameSellingDatas;
export const filterNameSellingDatasOnRequest = (state: any | unknown): any =>
  state.nft.filterNameSellingDatasOnRequest;
export const filterNameSellingDatasResponse = (state: any | unknown): any =>
  state.nft.filterNameSellingDatasResponse;

export const getFilterNameOfferingDatas = (state: any | unknown): any =>
  state.nft.getFilterNameOfferingDatas;
export const filterNameOfferingDatasOnRequest = (state: any | unknown): any =>
  state.nft.filterNameOfferingDatasOnRequest;
export const filterNameOfferingDatasResponse = (state: any | unknown): any =>
  state.nft.filterNameOfferingDatasResponse;

export const getOfferingDatas = (state: any | unknown): any =>
  state.nft.getOfferingDatas;
export const offeringDatasOnRequest = (state: any | unknown): any =>
  state.nft.offeringDatasOnRequest;
export const offeringDatasResponse = (state: any | unknown): any =>
  state.nft.offeringDatasResponse;

export const jsonrpcResponse = (state: any | unknown): any =>
  state.nft.jsonrpcResponse;
export const dump = (state: any | unknown): any => state.nft;
export const fromWallet = (state: any): any => state.nft.fromWallet;

function nftReducer(state: State = stateInitial, action: Action): State {
  const _state = {
    ...state,
  };
  switch (action.type) {
    case actions.GET_DATA:
      _state.dataOnRequest++;
      break;
    case actions.DATA_RESPONSE:
      _state.dataOnRequest--;
      break;
    case actions.GET_DATAS:
      _state.datasOnRequest++;
      break;
    case actions.DATAS_RESPONSE:
      _state.datasOnRequest--;
      break;
    case actions.GET_MARKET_DATAS:
      _state.marketDatasOnRequest++;
      break;
    case actions.MARKET_DATAS_RESPONSE:
      _state.marketDatasOnRequest--;
      break;
    case actions.GET_FILTER_NAME_DATAS:
      _state.filterNameDatasOnRequest++;
      break;
    case actions.FILTER_NAME_DATAS_RESPONSE:
      _state.filterNameDatasOnRequest--;
      break;
    case actions.GET_FILTER_NAME_SELLING_DATAS:
      _state.filterNameSellingDatasOnRequest++;
      break;
    case actions.FILTER_NAME_SELLING_DATAS_RESPONSE:
      _state.filterNameSellingDatasOnRequest--;
      break;
    case actions.GET_FILTER_NAME_OFFERING_DATAS:
      _state.filterNameOfferingDatasOnRequest++;
      break;
    case actions.FILTER_NAME_OFFERING_DATAS_RESPONSE:
      _state.filterNameOfferingDatasOnRequest--;
      break;
    case actions.GET_OFFERING_DATAS:
      _state.offeringDatasOnRequest++;
      break;
    case actions.OFFERING_DATAS_RESPONSE: {
      _state.offeringDatasOnRequest--;
      break;
    }
    default:
      break;
  }

  switch (action.type) {
    case actions.FROM_WALLET:
    case actions.GET_CLAIMABLES:
    case actions.CLAIMABLES_RESPONSE:
    case actions.RESET_CLAIMABLES_RESPONSE:
    case actions.REQUEST_CLAIM:
    case actions.REQUEST_CLAIM_RESPONSE:
    case actions.RESET_REQUEST_CLAIM_RESPONSE:
    case actions.CANCEL_CLAIM:
    case actions.CANCEL_CLAIM_RESPONSE:
    case actions.RESET_CANCEL_CLAIM_RESPONSE:
    case actions.GET_AVAILABLES:
    case actions.AVAILABLES_RESPONSE:
    case actions.GET_DATA:
    case actions.DATA_RESPONSE:
    case actions.RESET_DATA_RESPONSE:
    case actions.GET_DATAS:
    case actions.DATAS_RESPONSE:
    case actions.RESET_DATAS_RESPONSE:
    case actions.GET_MARKET_DATAS:
    case actions.MARKET_DATAS_RESPONSE:
    case actions.RESET_MARKET_DATAS_RESPONSE:
    case actions.GET_FILTER_NAME_DATAS:
    case actions.FILTER_NAME_DATAS_RESPONSE:
    case actions.RESET_FILTER_NAME_DATAS_RESPONSE:
    case actions.GET_FILTER_NAME_SELLING_DATAS:
    case actions.FILTER_NAME_SELLING_DATAS_RESPONSE:
    case actions.RESET_FILTER_NAME_SELLING_DATAS_RESPONSE:
    case actions.GET_FILTER_NAME_OFFERING_DATAS:
    case actions.FILTER_NAME_OFFERING_DATAS_RESPONSE:
    case actions.RESET_FILTER_NAME_OFFERING_DATAS_RESPONSE:
    case actions.GET_OFFERING_DATAS:
    case actions.OFFERING_DATAS_RESPONSE:
    case actions.RESET_OFFERING_DATAS_RESPONSE:
    case actions.JSONRPC_RESPONSE:
    case actions.CLEANUP:
      return {
        ..._state,
        ...action.state,
      };
    case walletActions.RESET_WEB3_PROVIDER:
      return {
        ...stateInitial,
      };
    default:
      return {
        ...state,
      };
  }
}

export default nftReducer;
