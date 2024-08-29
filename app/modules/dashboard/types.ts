export interface DashboardStatistics {
  total_sales?: number;
  total_volume?: number; // or [namespace]
  item_sold?: number;
}

export interface GetData {
  time: number;
}

export interface State {
  getData?: any;
  dataOnRequest?: number;
  dataResponse?: any;
}

export interface Action {
  type: string;
  state?: State;
}

export const stateInitial: State = {
  getData: null,
  dataOnRequest: null,
  dataResponse: null,
};

export const actionInitial: Action = {
  type: null,
  state: stateInitial,
};
