import { type PoolsData } from "../graphql/types";
import { type Action, stateInitial } from "./types";

export const GET_DATA_POOLS = "POOLS_GET_DATA_POOLS";
export const DATA_POOLS_RESPONSE = "POOLS_DATA_POOLS_RESPONSE";
export const RESET_DATA_POOLS_RESPONSE = "POOLS_RESET_DATA_POOLS_RESPONSE";

export const GET_DATA_POOLS_STAKED = "POOLS_GET_DATA_POOLS_STAKED";
export const DATA_POOLS_STAKED_RESPONSE = "POOLS_DATA_POOLS_STAKED_RESPONSE";
export const RESET_DATA_POOLS_STAKED_RESPONSE =
  "POOLS_RESET_DATA_POOLS_STAKED_RESPONSE";

export const CONNECT_CONTRACT = "POOLS_CONNECT_CONTRACT";
export const CONNECT_CONTRACT_STAKED = "POOLS_CONNECT_CONTRACT_STAKED";
export const CONTRACT = "POOLS_CONTRACT";
export const RESET_CONTRACT = "POOLS_RESET_CONTRACT";
export const CLEANUP = "POOLS_CLEANUP";

export function getDataPools(): Action {
  return {
    type: GET_DATA_POOLS,
  };
}

export function dataPoolsResponse(response: PoolsData): Action {
  return {
    type: DATA_POOLS_RESPONSE,
    state: {
      dataPoolsResponse: response,
    },
  };
}

export function resetData_PoolsResponse(): Action {
  return {
    type: RESET_DATA_POOLS_RESPONSE,
    state: {
      dataPoolsResponse: null,
    },
  };
}

export function getData_Pools_Staked(): Action {
  return {
    type: GET_DATA_POOLS_STAKED,
  };
}

export function data_Pools_StakedResponse(response: any | unknown): Action {
  return {
    type: DATA_POOLS_STAKED_RESPONSE,
    state: {
      dataPoolsStakedResponse: response,
    },
  };
}

export function resetData_Pools_StakedResponse(): Action {
  return {
    type: RESET_DATA_POOLS_STAKED_RESPONSE,
    state: {
      dataPoolsStakedResponse: null,
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

export function connect_contract(): Action {
  return {
    type: CONNECT_CONTRACT,
  };
}

export function connectContractStaked(): Action {
  return {
    type: CONNECT_CONTRACT_STAKED,
  };
}

export function cleanup(): Action {
  return {
    type: CLEANUP,
    state: stateInitial,
  };
}
