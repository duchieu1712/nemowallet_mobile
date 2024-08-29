import { type Action, stateInitial } from "./types";

export const GET_DATA_ACCOUNT = "ACCOUNT_DATA_ACCOUNT";
export const DATA_ACCOUNT_RESPONSE = "ACCOUNT_DATA_ACCOUNT_RESPONSE";
export const CLEANUP = "ACCOUNT_CLEANUP";

export function dataAccountResponse(res: any | unknown): Action {
  return {
    type: DATA_ACCOUNT_RESPONSE,
    state: {
      dataAccount: res,
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
