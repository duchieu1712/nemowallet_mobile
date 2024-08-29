import * as actions from "./actions";
import { type Action, type State, stateInitial } from "./types";

export const getDataZap = (state: any | unknown): any => state.zap.getDataZap;
export const dataZapOnRequest = (state: any | unknown): any =>
  state.zap.dataZapOnRequest;
export const dataZapResponse = (state: any | unknown): any =>
  state.zap.data_ZapResponse;

export const contracts = (state: any | unknown): any => state.zap.contracts;

export const dump = (state: any | unknown): any => state.zap;

function airdropsReducer(state: State = stateInitial, action: Action): State {
  const _state = {
    ...state,
  };
  switch (action.type) {
    case actions.GET_DATA_ZAP: {
      _state.dataZapOnRequest++;
      break;
    }
    case actions.DATA_ZAP_RESPONSE: {
      _state.dataZapOnRequest--;
      break;
    }
    default:
      break;
  }
  switch (action.type) {
    case actions.GET_DATA_ZAP:
    case actions.DATA_ZAP_RESPONSE:
    case actions.RESET_DATA_ZAP_RESPONSE:
    case actions.CONTRACT:
    case actions.RESET_CONTRACT:
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

export default airdropsReducer;
