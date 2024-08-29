export interface DashboardStatistics {
  total_sales?: number;
  total_volume?: number; // or [namespace]
  item_sold?: number;
}

export interface GetData {
  time: number;
}

export interface State {
  onActionConnect?: boolean;
  onActionRegister?: boolean;
  onActionLogIn?: boolean;
  onActionChangePW?: boolean;
  onActionLinkAccount?: boolean;
  onActionCreatePIN?: boolean;
  getDataClaim?: string;
  dataClaimOnRequest?: number;
  dataClaimResponse?: any;
  getDataRefer?: any;
  dataReferOnRequest?: number;
  dataReferResponse?: any;
  dataGetFriendsResponse?: DataFriendClaim;
  dataGetInfoResponse?: DataInfoClaim;
  getDataAuthenticators_Enabled?: any;
  dataAuthenticators_Enabled?: any;
  dataExtractSecuredMethods?: any;
  confirm2FA?: any;
}

export interface Action {
  type: string;
  state?: State;
}

export const stateInitial: State = {
  onActionConnect: false,
  onActionLogIn: false,
  onActionChangePW: false,
  onActionLinkAccount: false,
  onActionCreatePIN: false,
  getDataClaim: null,
  dataClaimOnRequest: null,
  dataClaimResponse: null,
  getDataRefer: null,
  dataReferOnRequest: null,
  dataReferResponse: null,
  dataGetFriendsResponse: null,
  dataGetInfoResponse: null,
  confirm2FA: null,
};

export const actionInitial: Action = {
  type: null,
  state: stateInitial,
};

export interface DataClaim {
  friend_address?: string;
}

export interface DataFriendClaim {
  account?: string;
  refer_code?: string;
  presenter?: string;
  rewards?: string;
  claimed?: string;
  timestamp?: number;
}

export interface DataInfoClaim {
  invited?: number;
  received?: string;
  available?: string;
}

export interface DataRefer {
  refer_code?: string;
  presenter?: string;
  presenter_code?: string;
}
