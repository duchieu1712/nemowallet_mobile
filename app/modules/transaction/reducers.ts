import { type Action, type State, stateInitial } from "./types";
import * as actions from "./actions";

export const getDataTransactions = (state: unknown | any): any =>
  state.transaction.getDataTransactions;
export const dataTransactionOnRequest = (state: unknown | any): any =>
  state.transaction.dataTransactionOnRequest;
export const dataResponseTransactions = (state: unknown | any): any =>
  state.transaction.dataResponseTransactions;

export const dump = (state: unknown | any): any => state.dashboard;

function dashboardReducer(state: State = stateInitial, action: Action): State {
  const _state = {
    ...state,
  };
  switch (action.type) {
    case actions.GET_DATA_TRANSACTION:
      _state.dataTransactionOnRequest++;
      break;
    case actions.DATA_RESPONSE_TRANSACTION:
      _state.dataTransactionOnRequest--;
      break;
    default:
      break;
  }
  switch (action.type) {
    case actions.GET_DATA_TRANSACTION:
    case actions.DATA_RESPONSE_TRANSACTION:
    case actions.RESET_DATA_RESPONSE_TRANSACTION:
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
