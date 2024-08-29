import { type Action, type GetTransactionDatas, stateInitial } from "./types";

export const GET_DATA_TRANSACTION = "TRANSACTION_GET_DATA_TRANSACTION";
export const DATA_RESPONSE_TRANSACTION =
  "TRANSACTION_DATA_RESPONSE_TRANSACTION";
export const RESET_DATA_RESPONSE_TRANSACTION =
  "TRANSACTION_RESET_DATA_RESPONSE_TRANSACTION";

export const CLEANUP = "TRANSACTION_CLEANUP";

export function getDataTransaction(getdata: GetTransactionDatas): Action {
  return {
    type: GET_DATA_TRANSACTION,
    state: {
      getDataTransactions: getdata,
    },
  };
}

export function dataResponseTransaction(response: any | unknown): Action {
  return {
    type: DATA_RESPONSE_TRANSACTION,
    state: {
      dataResponseTransactions: response,
    },
  };
}

export function resetDataResponseTransaction(): Action {
  return {
    type: RESET_DATA_RESPONSE_TRANSACTION,
    state: {
      dataResponseTransactions: null,
    },
  };
}
export function cleanup(): Action {
  return {
    type: CLEANUP,
    state: stateInitial,
  };
}
