import * as actions from "./actions";
import { type Action, type State, stateInitial } from "./types";

export const onActionChangePW = (state: any | unknown): any =>
  state.profile.onActionChangePW;
export const onActionLinkAccount = (state: any | unknown): any =>
  state.profile.onActionLinkAccount;
export const onActionLogin = (state: any | unknown): any =>
  state.profile.onActionLogIn;
export const onActionRegister = (state: any | unknown): any =>
  state.profile.onActionRegister;
export const onActionConnect = (state: any | unknown): any =>
  state.profile.onActionConnect;
export const onActionCreatePIN = (state: any | unknown): any =>
  state.profile.onActionCreatePIN;
export const dataClaim = (state: any | unknown): any =>
  state.profile.getDataClaim;
export const dataClaimOnRequest = (state: any | unknown): any =>
  state.profile.dataClaimOnRequest;
//
export const getDataAuthenticatorsEnabled = (state: any | unknown): any =>
  state.profile.getDataAuthenticators_Enabled;
export const dataAuthenticatorsEnabled = (state: any | unknown): any =>
  state.profile.dataAuthenticators_Enabled;
export const dataExtractSecuredMethods = (state: any | unknown): any =>
  state.profile.dataExtractSecuredMethods;

export const dataRefer = (state: any | unknown): any =>
  state.profile.getDataRefer;

export const dataGetFriendsResponse = (state: any | unknown): any =>
  state.profile.dataGetFriendsResponse;
export const dataGetInfoResponse = (state: any | unknown): any =>
  state.profile.dataGetInfoResponse;
export const confirm2FA = (state: any | unknown): any =>
  state.profile.confirm2FA;

export const dump = (state: any | unknown): any => state.profile;

function profileReducer(state: State = stateInitial, action: Action): State {
  const _state = {
    ...state,
  };
  switch (action.type) {
    case actions.GET_DATA_CLAIM:
      _state.dataClaimOnRequest++;
      break;
    case actions.DATA_CLAIM_RESPONSE:
      _state.dataClaimOnRequest--;
      break;
    default:
      break;
  }

  switch (action.type) {
    case actions.ACTION_CHANGE_PW:
    case actions.ACTION_LINK_ACCOUNT:
    case actions.ACTION_LOG_IN:
    case actions.ACTION_REGISTER:
    case actions.ACTION_CONNECT:
    case actions.ACTION_CREATE_PIN:
    case actions.GET_DATA_CLAIM:
    case actions.DATA_CLAIM_RESPONSE:
    case actions.GET_DATA_REFER:
    case actions.GET_FRIENDS:
    case actions.DATA_GET_FRIENDS_RESPONSE:
    case actions.GET_INFO:
    case actions.DATA_GET_INFO_RESPONSE:
    case actions.GET_AUTHENTICATORS_ENABLED:
    case actions.AUTHENTICATORS_ENABLED_RESPONSE:
    case actions.RESET_AUTHENTICATORS_ENABLED_RESPONSE:
    case actions.GET_EXTRACT_SECURED_METHODS:
    case actions.EXTRACT_SECURED_METHODS_RESPONSE:
    case actions.RESET_EXTRACT_SECURED_METHODS:
    case actions.CONFIRM_2FA:
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
