import { type Contract } from "ethers";

export const IBoxs_FILTER_AND = ";";
export const IBoxs_FILTER_OR = ",";

export interface IBoxFilters {
  orders?: Record<string, string>;
  limit?: number;
  offset?: number;
  clean?: (key: string) => void;
  remove?: (key: string, value: string | Record<string, string>) => void;
  push?: (key: string, value: string | Record<string, string>) => void;
  toString?: () => string;
  toInterface?: () => any;
  toDict?: () => Record<string, any>;
  fromString?: (str: string) => any;
  fromObject?: (object: any) => any;
  includes?: (k: any, v: any) => boolean;
}

export interface IBoxStakedFilters {
  id?: string;
  clean?: (key: string) => void;
  remove?: (key: string, value: string | Record<string, string>) => void;
  push?: (key: string, value: string | Record<string, string>) => void;
  toString?: () => string;
  toInterface?: () => any;
  toDict?: () => Record<string, any>;
  fromString?: (str: string) => any;
  fromObject?: (object: any) => any;
  includes?: (k: any, v: any) => boolean;
}

export interface INOContract {
  namespace: string;
  contract: Contract;
}

export interface State {
  getDataBoxs?: any;
  dataBoxsOnRequest?: number;
  data_BoxsResponse?: any;
  dataBoxsOnRequestDetail?: number;
  dataBoxsDetailResponse?: any;
  contracts?: INOContract;
  requestBoxsFail?: any;
  getDataBoxsFail?: any;
  dataBoxsFailOnRequest?: any;
  dataBoxsFailResponse?: any;
  serviceID?: any;
}

export interface Action {
  type: string;
  state?: State;
}

export const stateInitial: State = {
  getDataBoxs: null,
  dataBoxsOnRequest: null,
  data_BoxsResponse: null,
  dataBoxsOnRequestDetail: null,
  dataBoxsDetailResponse: null,
  contracts: null,
  requestBoxsFail: null,
  getDataBoxsFail: null,
  dataBoxsFailOnRequest: null,
  dataBoxsFailResponse: null,
};

export const actionInitial: Action = {
  type: null,
  state: stateInitial,
};
