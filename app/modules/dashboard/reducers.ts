import * as actions from "./actions";
import { type Action, type State, stateInitial } from "./types";

export const getData = (state: any | unknown): any => state.dashboard.getData;
export const dataOnRequest = (state: any | unknown): any =>
  state.dashboard.dataOnRequest;
export const dataResponse = (state: any | unknown): any =>
  state.dashboard.dataResponse;

export const dump = (state: any | unknown): any => state.dashboard;

function dashboardReducer(state: State = stateInitial, action: Action): State {
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
    default:
      break;
  }
  switch (action.type) {
    case actions.GET_DATA:
    case actions.DATA_RESPONSE:
    case actions.RESET_DATA_RESPONSE:
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

export default dashboardReducer;
