import { type Contract } from "ethers";

export interface ZapContract {
  namespace: string;
  contract: Contract;
}

export interface State {
  getDataZap?: any;
  dataZapOnRequest?: number;
  data_ZapResponse?: any;
  contracts?: ZapContract | null;
}

export interface Action {
  type: string;
  state?: State;
}

export const stateInitial: State = {
  getDataZap: null,
  dataZapOnRequest: 0,
  data_ZapResponse: null,
  contracts: null,
};

export const actionInitial: Action = {
  type: null,
  state: stateInitial,
};
