import { type Contract } from "ethers";

export interface PoolContract {
  namespace: string;
  contract: Contract;
}

export interface State {
  getDataPools?: any;
  dataPoolsOnRequest?: number;
  dataPoolsResponse?: any;
  getDataPoolsStaked?: any;
  dataPoolsStakedOnRequest?: number;
  dataPoolsStakedResponse?: any;
  contracts?: PoolContract;
}

export interface Action {
  type: string;
  state?: State;
}

export const stateInitial: State = {
  getDataPools: null,
  dataPoolsOnRequest: null,
  dataPoolsResponse: null,
  getDataPoolsStaked: null,
  dataPoolsStakedOnRequest: null,
  dataPoolsStakedResponse: null,
  contracts: null,
};

export const actionInitial: Action = {
  type: null,
  state: stateInitial,
};
