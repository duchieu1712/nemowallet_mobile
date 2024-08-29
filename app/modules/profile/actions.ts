import {
  type Action,
  type DataFriendClaim,
  type DataInfoClaim,
  type DataRefer,
  stateInitial,
} from "./types";

export const ACTION_CHANGE_PW = "PROFILE_ACTION_CHANGE_PW";
export const ACTION_LINK_ACCOUNT = "PROFILE_ACTION_LINK_ACCOUNT";
export const ACTION_LOG_IN = "PROFILE_ACTION_LOG_IN";
export const ACTION_REGISTER = "PROFILE_ACTION_REGISTER";
export const ACTION_CONNECT = "PROFILE_ACTION_CONNECT";
export const ACTION_CREATE_PIN = "PROFILE_ACTION_CREATE_PIN";

export const GET_DATA_CLAIM = "PROFILE_DATA_CLAIM";
export const DATA_CLAIM_RESPONSE = "PROFILE_DATA_CLAIM_RESPONSE";
export const GET_DATA_REFER = "PROFILE_DATA_REFER";

export const GET_FRIENDS = "PROFILE_GET_FRIENDS";
export const DATA_GET_FRIENDS_RESPONSE = "PROFILE_DATA_GET_FRIENDS_RESPONSE";
export const GET_INFO = "PROFILE_GET_INFO";
export const DATA_GET_INFO_RESPONSE = "PROFILE_DATA_GET_INFO_RESPONSE";

//
export const GET_AUTHENTICATORS_ENABLED = "PROFILE_GET_AUTHENTICATORS_ENABLED";
export const AUTHENTICATORS_ENABLED_RESPONSE =
  "PROFILE_AUTHENTICATORS_ENABLED_RESPONSE";
export const RESET_AUTHENTICATORS_ENABLED_RESPONSE =
  "PROFILE_RESET_AUTHENTICATORS_ENABLED_RESPONSE";
//
//
export const GET_EXTRACT_SECURED_METHODS =
  "PROFILE_GET_EXTRACT_SECURED_METHODS";
export const EXTRACT_SECURED_METHODS_RESPONSE =
  "PROFILE_EXTRACT_SECURED_METHODS";
export const RESET_EXTRACT_SECURED_METHODS =
  "PROFILE_RESET_EXTRACT_SECURED_METHODS";
//

//
export const CONFIRM_2FA = "PROFILE_CONFIRM_2FA";
//

export const CLEANUP = "PROFILE_CLEANUP";

export function setOnActionCreatePIN(request: any | unknown): Action {
  return {
    type: ACTION_CREATE_PIN,
    state: {
      onActionCreatePIN: request,
    },
  };
}

export function setConfirm2FA(request: any | unknown): Action {
  return {
    type: CONFIRM_2FA,
    state: {
      confirm2FA: request,
    },
  };
}

export function setActionRegister(action: boolean): Action {
  return {
    type: ACTION_REGISTER,
    state: {
      onActionRegister: action,
    },
  };
}

export function setActionLogIn(action: boolean): Action {
  return {
    type: ACTION_LOG_IN,
    state: {
      onActionLogIn: action,
    },
  };
}

export function setActionConnect(action: boolean): Action {
  return {
    type: ACTION_CONNECT,
    state: {
      onActionConnect: action,
    },
  };
}

export function setActionChangePW(action: boolean): Action {
  return {
    type: ACTION_CHANGE_PW,
    state: {
      onActionChangePW: action,
    },
  };
}

export function setActionLinkAccount(action: boolean): Action {
  return {
    type: ACTION_LINK_ACCOUNT,
    state: {
      onActionLinkAccount: action,
    },
  };
}

export function getDataClaim(friend_address?: string): Action {
  return {
    type: GET_DATA_CLAIM,
    state: {
      getDataClaim: friend_address,
    },
  };
}

export function dataClaimResponse(): Action {
  return {
    type: DATA_CLAIM_RESPONSE,
  };
}

export function getDataRefer(req: DataRefer): Action {
  return {
    type: GET_DATA_REFER,
    state: {
      getDataRefer: req,
    },
  };
}

export function getFriend(req: any | unknown): Action {
  return {
    type: GET_FRIENDS,
    state: {
      getDataRefer: req,
    },
  };
}

export function dataGetFriendsResponse(response: DataFriendClaim): Action {
  return {
    type: DATA_GET_FRIENDS_RESPONSE,
    state: {
      dataGetFriendsResponse: response,
    },
  };
}

export function getInfo(): Action {
  return {
    type: GET_INFO,
  };
}

export function dataGetInfoResponse(response: DataInfoClaim): Action {
  return {
    type: DATA_GET_INFO_RESPONSE,
    state: {
      dataGetInfoResponse: response,
    },
  };
}

export function getAuthenticators_Enabled(): Action {
  return {
    type: GET_AUTHENTICATORS_ENABLED,
  };
}

export function dataAuthenticators_EnabledResponse(
  response: any | unknown,
): Action {
  return {
    type: AUTHENTICATORS_ENABLED_RESPONSE,
    state: {
      dataAuthenticators_Enabled: response,
    },
  };
}

export function resetDataAuthenticators_EnabledResponse(): Action {
  return {
    type: AUTHENTICATORS_ENABLED_RESPONSE,
    state: {
      dataAuthenticators_Enabled: null,
    },
  };
}

export function getExtract_Secured_Methods(): Action {
  return {
    type: GET_EXTRACT_SECURED_METHODS,
  };
}

export function dataExtract_Secured_MethodsResponse(
  response: any | unknown,
): Action {
  return {
    type: AUTHENTICATORS_ENABLED_RESPONSE,
    state: {
      dataExtractSecuredMethods: response,
    },
  };
}

export function resetExtract_Secured_MethodsResponse(): Action {
  return {
    type: AUTHENTICATORS_ENABLED_RESPONSE,
    state: {
      dataExtractSecuredMethods: null,
    },
  };
}

export function cleanup(): Action {
  return {
    type: CLEANUP,
    state: stateInitial,
  };
}
