import { type BoxsData } from "../graphql/types";
import { type Action, stateInitial } from "./types";

export const GET_DATA_BOXS = "BOXS_GET_DATA_BOXS";
export const DATA_BOXS_RESPONSE = "BOXS_DATA_BOXS_RESPONSE";
export const RESET_DATA_BOXS_RESPONSE = "BOXS_RESET_DATA_BOXS_RESPONSE";

export const GET_DATA_BOXS_DETAIL = "BOXS_GET_DATA_BOXS_DETAIL";
export const DATA_BOXS_DETAIL_RESPONSE = "BOXS_DATA_BOXS_DETAIL_RESPONSE";
export const RESET_DATA_BOXS_DETAIL_RESPONSE =
  "BOXS_RESET_DATA_BOXS_DETAIL_RESPONSE";

export const GET_DATA_BOXS_FAIL = "BOXS_GET_DATA_BOXS_FAIL";
export const DATA_BOXS_FAIL_RESPONSE = "BOXS_DATA_BOXS_FAIL_RESPONSE";
export const RESET_DATA_BOXS_FAIL_RESPONSE =
  "BOXS_RESET_DATA_BOXS_FAIL_RESPONSE";

export const CONNECT_CONTRACT = "BOXS_CONNECT_CONTRACT";
export const CONTRACT = "BOXS_CONTRACT";
export const RESET_CONTRACT = "BOXS_RESET_CONTRACT";
export const CLEANUP = "BOXS_CLEANUP";

export function getDataBoxs(serviceID: any): Action {
  return {
    type: GET_DATA_BOXS,
    state: {
      serviceID,
    },
  };
}

export function data_BoxsResponse(response: BoxsData): Action {
  return {
    type: DATA_BOXS_RESPONSE,
    state: {
      data_BoxsResponse: response,
    },
  };
}

export function resetData_BoxsResponse(): Action {
  return {
    type: RESET_DATA_BOXS_RESPONSE,
    state: {
      data_BoxsResponse: null,
    },
  };
}

export function getData_Boxs_Detail(serviceID: any, request: any): Action {
  return {
    type: GET_DATA_BOXS_DETAIL,
    state: {
      serviceID,
      getDataBoxs: request,
    },
  };
}

export function dataBoxsDetailResponse(response: BoxsData): Action {
  return {
    type: DATA_BOXS_DETAIL_RESPONSE,
    state: {
      dataBoxsDetailResponse: response,
    },
  };
}

export function resetData_Boxs_DetailResponse(): Action {
  return {
    type: RESET_DATA_BOXS_DETAIL_RESPONSE,
    state: {
      dataBoxsDetailResponse: null,
    },
  };
}

export function data_Contract(response: any): Action {
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

export function connect_contract(): Action {
  return {
    type: CONNECT_CONTRACT,
  };
}

export function getDataBoxsFail(serviceID: any, request: any): Action {
  return {
    type: GET_DATA_BOXS_FAIL,
    state: {
      requestBoxsFail: request,
      serviceID,
    },
  };
}

export function dataBoxsFailResponse(response: any): Action {
  return {
    type: DATA_BOXS_FAIL_RESPONSE,
    state: {
      dataBoxsFailResponse: response,
    },
  };
}

export function resetData_BoxsFailResponse(): Action {
  return {
    type: RESET_DATA_BOXS_FAIL_RESPONSE,
    state: {
      dataBoxsFailResponse: null,
    },
  };
}

export function cleanup(): Action {
  return {
    type: CLEANUP,
    state: stateInitial,
  };
}
