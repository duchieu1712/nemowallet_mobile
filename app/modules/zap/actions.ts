import { stateInitial, type Action } from "./types";
export const GET_DATA_ZAP = "ZAP_GET_DATA_ZAP";
export const DATA_ZAP_RESPONSE = "ZAP_DATA_ZAP_RESPONSE";
export const RESET_DATA_ZAP_RESPONSE = "ZAP_RESET_DATA_ZAP_RESPONSE";

export const CONTRACT = "ZAP_CONTRACT";
export const RESET_CONTRACT = "ZAP_RESET_CONTRACT";
export const CLEANUP = "ZAP_CLEANUP";

export function getDataZap(): Action {
  return {
    type: GET_DATA_ZAP,
  };
}

export function data_ZapResponse(response: any | unknown): Action {
  return {
    type: DATA_ZAP_RESPONSE,
    state: {
      data_ZapResponse: response,
    },
  };
}

export function resetData_ZapResponse(): Action {
  return {
    type: RESET_DATA_ZAP_RESPONSE,
    state: {
      data_ZapResponse: null,
    },
  };
}

export function data_Contract(response: any | unknown): Action {
  return {
    type: CONTRACT,
    state: {
      contracts: response,
    },
  };
}

export function reset_data_Contract(): Action {
  return {
    type: RESET_CONTRACT,
    state: {
      contracts: null,
    },
  };
}

export function cleanup(): Action {
  return {
    type: CLEANUP,
    state: stateInitial,
  };
}
