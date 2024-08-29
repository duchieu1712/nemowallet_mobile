import { type IContractRelay, type INFTMetaData } from "../../common/types";
import { type NftsData } from "../graphql/types";
import { type Nft } from "../graphql/types/generated";

export const INFT_FILTER_AND = ";";
export const INFT_FILTER_OR = ",";

export interface INFTFilters {
  terms: string;
  collections: string[]; // or [namespace]
  prices: {
    min?: string;
    max?: string;
  };
  orders: Record<string, string>;
  limit: number;
  offset: number;
  metadataTypes: string[];
  metadataRaritys: number[];
  metadataQualitys: number[];
  metadataIndexs: number[];
  metadataStar: {
    min?: string;
    max?: string;
  };
  metadataNftType: string;
  metadataLevels: {
    min?: string;
    max?: string;
  };
  metadataGrades: {
    min?: number;
    max?: number;
  };
  metadataNames: string;
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

export interface GetMarketDatas {
  account?: string;
  filters?: INFTFilters;
  serviceID?: string | number;
}

export interface GetDatas {
  account?: string;
  filters: INFTFilters;
  serviceID?: string | number;
}

export interface GetData {
  collection: string;
  tokenId: string;
  serviceID?: string | number;
}

export interface GetClaimables {
  namespaces: string[];
  reload?: boolean;
}
export interface Claimable {
  namespace: string;
  cid: string;
  metadata: INFTMetaData;
  status: number;
}

export type ClaimablesResponse = Claimable[];

export interface RequestClaim {
  namespace: string;
  cid: string;
}
export interface RequestClaimResponse {
  namespace: string;
  contractRelay: IContractRelay;
}

export interface CancelClaimResponse {
  status: number;
  error?: any;
  request: Claimable;
}

export interface GetAvailables {
  namespaces: string[];
}

export interface Available {
  namespace: string;
  cid: string;
  metadata: INFTMetaData;
  status: number;
}

export type AvailableResponse = Available[];

export interface State {
  jsonrpcResponse?: any;

  getClaimables?: GetClaimables | any;
  claimablesResponse?: ClaimablesResponse | any;
  claimablesSubscribeResponse?: any;

  requestClaim?: RequestClaim | any;
  requestClaimResponse?: RequestClaimResponse | any;

  cancelClaim?: Claimable | any;
  cancelClaimResponse?: CancelClaimResponse | any;

  getAvailables?: GetAvailables | any;
  availablesResponse?: AvailableResponse | any;

  getData?: GetData | any;
  dataOnRequest?: number | any;
  dataResponse?: Nft | any;

  getDatas?: GetDatas | any;
  datasOnRequest?: number | any;
  datasResponse?: NftsData | any;

  getMarketDatas?: GetMarketDatas | any;
  marketDatasOnRequest?: number | any;
  marketDatasResponse?: NftsData | any;

  getFilterNameDatas?: GetMarketDatas | any;
  filterNameDatasOnRequest?: number | any;
  filterNameDatasResponse?: Nft[] | any;

  getFilterNameSellingDatas?: GetDatas | any;
  filterNameSellingDatasOnRequest?: number | any;
  filterNameSellingDatasResponse?: Nft[] | any;

  getFilterNameOfferingDatas?: GetDatas | any;
  filterNameOfferingDatasOnRequest?: number | any;
  filterNameOfferingDatasResponse?: Nft[] | any;

  getOfferingDatas?: GetDatas | any;
  offeringDatasOnRequest?: number | any;
  offeringDatasResponse?: NftsData | any;
  fromWallet?: boolean;
}

export interface Action {
  type: string | any;
  state?: State;
}

export const stateInitial: State = {
  jsonrpcResponse: null,

  getClaimables: null,
  claimablesResponse: null,
  claimablesSubscribeResponse: null,

  requestClaim: null,
  requestClaimResponse: null,

  getAvailables: null,
  availablesResponse: null,

  getData: null,
  dataOnRequest: null,
  dataResponse: null,

  getDatas: null,
  datasOnRequest: null,
  datasResponse: null,

  getMarketDatas: null,
  marketDatasOnRequest: null,
  marketDatasResponse: null,

  getFilterNameDatas: null,
  filterNameDatasOnRequest: null,
  filterNameDatasResponse: null,

  getFilterNameSellingDatas: null,
  filterNameSellingDatasOnRequest: null,
  filterNameSellingDatasResponse: null,

  getFilterNameOfferingDatas: null,
  filterNameOfferingDatasOnRequest: null,
  filterNameOfferingDatasResponse: null,

  getOfferingDatas: null,
  offeringDatasOnRequest: null,
  offeringDatasResponse: null,
  fromWallet: false,
};

export const actionInitial: Action = {
  type: null,
  state: stateInitial,
};
