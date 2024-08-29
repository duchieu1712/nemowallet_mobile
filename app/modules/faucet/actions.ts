import { type Action, stateInitial } from "./types";

export const GET_DATA_POOLS = "FAUCETS_GET_DATA_POOLS";
export const DATA_FAUCETS_RESPONSE = "FAUCETS_DATA_FAUCETS_RESPONSE";
export const RESET_DATA_FAUCETS_RESPONSE =
  "FAUCETS_RESET_DATA_FAUCETS_RESPONSE";
export const CLEANUP = "FAUCETS_CLEANUP";

export function getDataPoolsFaucet(): Action {
  return {
    type: GET_DATA_POOLS,
  };
}

export function dataPoolsResponseFaucet(response: any | unknown): Action {
  return {
    type: DATA_FAUCETS_RESPONSE,
    state: {
      dataPoolsResponse_Faucet: response,
    },
  };
}

export function resetData_PoolsResponse_Faucet(): Action {
  return {
    type: RESET_DATA_FAUCETS_RESPONSE,
    state: {
      dataPoolsResponse_Faucet: null,
    },
  };
}

export function cleanup(): Action {
  return {
    type: CLEANUP,
    state: stateInitial,
  };
}
