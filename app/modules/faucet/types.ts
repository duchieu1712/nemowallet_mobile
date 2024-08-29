export interface State {
  getDataPoolsFaucet?: any;
  dataPoolsOnRequestFaucet?: number;
  dataPoolsResponse_Faucet?: any;
}

export interface Action {
  type: string;
  state?: State;
}

export const stateInitial: State = {
  getDataPoolsFaucet: null,
  dataPoolsOnRequestFaucet: null,
  dataPoolsResponse_Faucet: null,
};

export const actionInitial: Action = {
  type: null,
  state: stateInitial,
};
