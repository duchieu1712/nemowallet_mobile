import { type Action, stateInitial } from "./types";

export const GET_DATA_ACCOUNT = "ACCOUNT_DATA_ACCOUNT";
export const DATA_ACCOUNT_RESPONSE = "ACCOUNT_DATA_ACCOUNT_RESPONSE";
export const ACCOUNT_SIGNING = "ACCOUNT_ACCOUNT_SIGNING";
export const ACCOUNT_REQUEST_SIGN_OUT = "ACCOUNT_REQUEST_SIGN_OUT";
export const ACCOUNT_REQUEST_CONNECT_WALLET = "ACCOUNT_REQUEST_CONNECT_WALLET";
export const ACCOUNT_SET_PROCCESSING = "ACCOUNT_SET_PROCCESSING";
export const ACCOUNT_SET_INIT_ACCOUNT_SIGN_IN =
  "ACCOUNT_SET_INIT_ACCOUNT_SIGN_IN";
export const CLEANUP = "ACCOUNT_CLEANUP";
export const ON_STATUS_NOTIFICATION = "ON_STATUS_NOTIFICATION";

export function setOnStatusNotification(req: any): Action {
  return {
    type: ON_STATUS_NOTIFICATION,
    state: {
      onStatusNotification: req,
    },
  };
}

export function dataAccountResponse(res: any | unknown): Action {
  return {
    type: DATA_ACCOUNT_RESPONSE,
    state: {
      dataAccount: res,
    },
  };
}

export function setSigning(res: any | unknown): Action {
  return {
    type: ACCOUNT_SIGNING,
    state: {
      signing: res,
    },
  };
}

export function setInitAccountSignIn(res: any | unknown): Action {
  return {
    type: ACCOUNT_SET_INIT_ACCOUNT_SIGN_IN,
    state: {
      initAccountSignIn: res,
    },
  };
}

export function setProccessing(res: any | unknown): Action {
  return {
    type: ACCOUNT_SET_PROCCESSING,
    state: {
      onProccessing: res,
    },
  };
}

export function setRequestSignOut(res: any | unknown): Action {
  return {
    type: ACCOUNT_REQUEST_SIGN_OUT,
    state: {
      requestSignOut: res,
    },
  };
}

export function setRequestConnectWallet(res: any | unknown): Action {
  return {
    type: ACCOUNT_REQUEST_CONNECT_WALLET,
    state: {
      requestConnectWallet: res,
    },
  };
}

// export function getDataAccount(): Action {
//   return {
//     type: DATA_ACCOUNT_RESPONSE,
//   }
// }

export function cleanup(): Action {
  return {
    type: CLEANUP,
    state: stateInitial,
  };
}
