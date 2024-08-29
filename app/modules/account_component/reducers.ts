import * as actions from "./actions";
import { type Action, type State, stateInitial } from "./types";

export const dataAccount = (state: any | unknown): any =>
  state.account.dataAccount;
export const dump = (state: any | unknown): any => state.account;

function profileReducer(state: State = stateInitial, action: Action): State {
  const _state = {
    ...state,
  };
  switch (action.type) {
    case actions.GET_DATA_ACCOUNT:
    case actions.DATA_ACCOUNT_RESPONSE:
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

export default profileReducer;
