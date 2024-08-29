import { type Action, stateInitial } from "./types";

export const GET_DATA = "DBOARD_GET_DATA";
export const DATA_RESPONSE = "DBOARD_DATA_RESPONSE";
export const RESET_DATA_RESPONSE = "DBOARD_RESET_DATA_RESPONSE";

export const CLEANUP = "DBOARD_CLEANUP";

export function getData(time: number, serviceId: number | string): Action {
  return {
    type: GET_DATA,
    state: {
      getData: {
        time,
        serviceId,
      },
    },
  };
}

export function dataResponse(response: any | unknown): Action {
  return {
    type: DATA_RESPONSE,
    state: {
      dataResponse: response,
    },
  };
}

export function resetDataResponse(): Action {
  return {
    type: RESET_DATA_RESPONSE,
    state: {
      dataResponse: null,
    },
  };
}

export function cleanup(): Action {
  return {
    type: CLEANUP,
    state: stateInitial,
  };
}
