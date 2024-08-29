import * as actions from "./actions";

import { type Action, type State, stateInitial } from "./types";

export const dataAccount = (state: any | unknown): any =>
  state.account.dataAccount;
export const onProccessing = (state: any | unknown): any =>
  state.account.onProccessing;
export const initAccountSignIn = (state: any | unknown): any =>
  state.account.initAccountSignIn;
export const requestSignOut = (state: any | unknown): any =>
  state.account.requestSignOut;
export const requestConnectWallet = (state: any | unknown): any =>
  state.account.requestConnectWallet;
export const signIng = (state: any | unknown): any => state.account.signing;
export const dump = (state: any | unknown): any => state.account;
export const onStatusNotification = (state: any | unknown): any =>
  state.account.onStatusNotification;

function profileReducer(state: State = stateInitial, action: Action): State {
  const _state = {
    ...state,
  };
  switch (action.type) {
    case actions.GET_DATA_ACCOUNT:
    case actions.DATA_ACCOUNT_RESPONSE:
    case actions.ACCOUNT_REQUEST_SIGN_OUT:
    case actions.ACCOUNT_REQUEST_CONNECT_WALLET:
    case actions.ACCOUNT_SIGNING:
    case actions.ACCOUNT_SET_PROCCESSING:
    case actions.ACCOUNT_SET_INIT_ACCOUNT_SIGN_IN:
    case actions.ON_STATUS_NOTIFICATION:
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
