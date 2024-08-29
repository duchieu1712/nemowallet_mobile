export interface State {
  dataAccount?: any;
}

export interface Action {
  type: string;
  state?: State;
}

export const stateInitial: State = {
  dataAccount: null,
};

export const actionInitial: Action = {
  type: null,
  state: stateInitial,
};
