export interface State {
  dataAccount?: any;
  signing?: boolean;
  requestSignOut?: boolean;
  requestConnectWallet?: boolean;
  onProccessing?: boolean;
  initAccountSignIn?: any;
  onStatusNotification?: any;
}

export interface Action {
  type: string | null;
  state?: State;
}

export const stateInitial: State = {
  dataAccount: null,
  signing: false,
  requestSignOut: false,
  onProccessing: false,
  initAccountSignIn: null,
  onStatusNotification: {
    visible: false,
    errorMsg: "",
    txSuccess: "",
  },
};

export const actionInitial: Action = {
  type: null,
  state: stateInitial,
};
