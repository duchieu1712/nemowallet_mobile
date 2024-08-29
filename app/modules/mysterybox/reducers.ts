import * as actions from "./actions";
import { type Action, type State, stateInitial } from "./types";

export const getDataBoxs = (state: any) => state.boxs.getDataBoxs;
export const dataBoxsOnRequest = (state?: any) => state.boxs.dataBoxsOnRequest;
export const dataBoxsResponse = (state?: any) => state.boxs.data_BoxsResponse;

export const dataBoxsOnRequestDetail = (state: any) =>
  state.boxs.dataBoxsOnRequestDetail;
export const dataBoxsDetailResponse = (state: any) =>
  state.boxs.dataBoxsDetailResponse;

export const requestBoxsFail = (state: any) => state.boxs.requestBoxsFail;
export const getDataBoxsFail = (state: any) => state.boxs.getDataBoxsFail;
export const dataBoxsFailOnRequest = (state: any) =>
  state.boxs.dataBoxsFailOnRequest;
export const dataBoxsFailResponse = (state: any) =>
  state.boxs.dataBoxsFailResponse;
export const serviceID = (state: any) => state.boxs.serviceID;
export const contracts = (state: any) => state.boxs.contracts;

export const dump = (state: any) => state.boxs;

function boxsReducer(state: State = stateInitial, action: Action): State {
  const _state = {
    ...state,
  };
  switch (action.type) {
    case actions.GET_DATA_BOXS:
      _state.dataBoxsOnRequest++;
      break;
    case actions.DATA_BOXS_RESPONSE:
      _state.dataBoxsOnRequest--;
      break;
    //
    case actions.GET_DATA_BOXS_DETAIL:
      _state.dataBoxsOnRequestDetail++;
      break;
    case actions.DATA_BOXS_DETAIL_RESPONSE:
      _state.dataBoxsOnRequestDetail--;
      break;
    //
    case actions.GET_DATA_BOXS_FAIL:
      _state.dataBoxsFailOnRequest++;
      break;
    case actions.RESET_DATA_BOXS_FAIL_RESPONSE:
      _state.dataBoxsFailOnRequest--;
      break;
    default:
      break;
  }
  switch (action.type) {
    case actions.GET_DATA_BOXS:
    case actions.GET_DATA_BOXS_DETAIL:
    case actions.DATA_BOXS_RESPONSE:
    case actions.RESET_DATA_BOXS_RESPONSE:
    case actions.DATA_BOXS_DETAIL_RESPONSE:
    case actions.RESET_DATA_BOXS_DETAIL_RESPONSE:
    case actions.CONNECT_CONTRACT:
    case actions.CONTRACT:
    case actions.RESET_CONTRACT:
    case actions.GET_DATA_BOXS_FAIL:
    case actions.DATA_BOXS_FAIL_RESPONSE:
    case actions.RESET_DATA_BOXS_FAIL_RESPONSE:
    case actions.CLEANUP:
      return {
        ..._state,
        ...action.state,
      };
    default:
      return {
        ...state,
      };
  }
}

export default boxsReducer;
