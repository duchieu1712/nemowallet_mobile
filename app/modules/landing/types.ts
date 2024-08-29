import { type Contract } from "ethers";

export interface StakeContract {
  namespace: string;
  contract: Contract;
}

export interface State {
  getDataLanding?: any;
  dataLandingOnRequest?: number;
  dataLandingResponse?: any;
  getDataRentingLanding?: any;
  dataRentingLandingOnRequest?: number;
  dataRentingLandingResponse?: any;
  contracts?: StakeContract;
}

export interface Action {
  type: string;
  state?: State;
}

export const stateInitial: State = {
  getDataLanding: null,
  dataLandingOnRequest: null,
  dataLandingResponse: null,
  getDataRentingLanding: null,
  dataRentingLandingOnRequest: null,
  dataRentingLandingResponse: null,
  contracts: null,
};

export const actionInitial: Action = {
  type: null,
  state: stateInitial,
};
