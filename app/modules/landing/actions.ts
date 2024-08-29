import { type Action, stateInitial } from "./types";

export const GET_DATA_LANDING = "LANDING_GET_DATA_LANDING";
export const DATA_LANDING_RESPONSE = "LANDING_DATA_LANDING_RESPONSE";
export const RESET_DATA_LANDING_RESPONSE =
  "LANDING_RESET_DATA_LANDING_RESPONSE";

export const GET_DATA_RENGTING_LANDING = "LANDING_GET_DATA_RENGTING_LANDING";
export const DATA_RENGTING_LANDING_RESPONSE =
  "LANDING_DATA_RENGTING_LANDING_RESPONSE";
export const RESET_DATA_RENGTING_LANDING_RESPONSE =
  "LANDING_RESET_DATA_RENGTING_LANDING_RESPONSE";

export const CONTRACT = "LANDING_CONTRACT";
export const RESET_CONTRACT = "LANDING_RESET_CONTRACT";
export const CLEANUP = "LANDING_CLEANUP";

export function getDataLanding(): Action {
  return {
    type: GET_DATA_LANDING,
  };
}

export function dataLandingResponse(response: any | unknown): Action {
  return {
    type: DATA_LANDING_RESPONSE,
    state: {
      dataLandingResponse: response,
    },
  };
}

export function resetData_LandingResponse(): Action {
  return {
    type: RESET_DATA_LANDING_RESPONSE,
    state: {
      dataLandingResponse: null,
    },
  };
}

// renting
export function getData_Rent_Landing(): Action {
  return {
    type: GET_DATA_RENGTING_LANDING,
  };
}

export function data_Rent_LandingResponse(response: any | unknown): Action {
  return {
    type: DATA_RENGTING_LANDING_RESPONSE,
    state: {
      dataRentingLandingResponse: response,
    },
  };
}

export function resetData_Rent_LandingResponse(): Action {
  return {
    type: RESET_DATA_LANDING_RESPONSE,
    state: {
      dataRentingLandingResponse: null,
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
