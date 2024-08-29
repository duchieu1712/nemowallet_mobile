import { type NftsData } from "../graphql/types";
import { type Nft } from "../graphql/types/generated";

import {
  type GetClaimables,
  type RequestClaim,
  type Action,
  type GetData,
  type GetDatas,
  type GetMarketDatas,
  stateInitial,
  type RequestClaimResponse,
  type ClaimablesResponse,
  type Claimable,
  type CancelClaimResponse,
  type AvailableResponse,
  type GetAvailables,
} from "./types";

export const GET_CLAIMABLES = "NFT_GET_CLAIMABLES";
export const CLAIMABLES_RESPONSE = "NFT_CLAIMABLES_RESPONSE";
export const REQUEST_CLAIM = "NFT_REQUEST_CLAIM";
export const REQUEST_CLAIM_RESPONSE = "NFT_REQUEST_CLAIM_RESPONSE";
export const RESET_REQUEST_CLAIM_RESPONSE = "NFT_RESET_REQUEST_CLAIM_RESPONSE";
export const RESET_CLAIMABLES_RESPONSE = "NFT_RESET_CLAIMABLES_RESPONSE";
export const GET_AVAILABLES = "NFT_GET_AVAILABLES";
export const AVAILABLES_RESPONSE = "NFT_AVAILABLES_RESPONSE";
export const RESET_AVAILABLES_RESPONSE = "NFT_RESET_AVAILABLES_RESPONSE";

export const CANCEL_CLAIM = "NFT_CANCEL_CLAIM";
export const CANCEL_CLAIM_RESPONSE = "NFT_CANCEL_CLAIM_RESPONSE";
export const RESET_CANCEL_CLAIM_RESPONSE = "NFT_RESET_CANCEL_CLAIM_RESPONSE";

export const GET_DATA = "NFT_GET_DATA";
export const DATA_RESPONSE = "NFT_DATA_RESPONSE";
export const RESET_DATA_RESPONSE = "NFT_RESET_DATA_RESPONSE";

export const GET_DATAS = "NFT_GET_DATAS";
export const DATAS_RESPONSE = "NFT_DATAS_RESPONSE";
export const RESET_DATAS_RESPONSE = "NFT_RESET_DATAS_RESPONSE";

export const GET_MARKET_DATAS = "NFT_GET_MARKET_DATAS";
export const MARKET_DATAS_RESPONSE = "NFT_MARKET_DATAS_RESPONSE";
export const RESET_MARKET_DATAS_RESPONSE = "NFT_RESET_MARKET_DATAS_RESPONSE";

export const GET_FILTER_NAME_SELLING_DATAS =
  "NFT_GET_FILTER_NAME_SELLING_DATAS";
export const FILTER_NAME_SELLING_DATAS_RESPONSE =
  "NFT_FILTER_NAME_SELLING_DATAS_RESPONSE";
export const RESET_FILTER_NAME_SELLING_DATAS_RESPONSE =
  "NFT_RESET_FILTER_SELLING_NAME_DATAS_RESPONSE";

export const GET_FILTER_NAME_OFFERING_DATAS =
  "NFT_GET_FILTER_NAME_OFFERING_DATAS";
export const FILTER_NAME_OFFERING_DATAS_RESPONSE =
  "NFT_FILTER_NAME_OFFERING_DATAS_RESPONSE";
export const RESET_FILTER_NAME_OFFERING_DATAS_RESPONSE =
  "NFT_RESET_FILTER_OFFERING_NAME_DATAS_RESPONSE";

export const GET_FILTER_NAME_DATAS = "NFT_GET_FILTER_NAME_DATAS";
export const FILTER_NAME_DATAS_RESPONSE = "NFT_FILTER_NAME_DATAS_RESPONSE";
export const RESET_FILTER_NAME_DATAS_RESPONSE =
  "NFT_RESET_FILTER_NAME_DATAS_RESPONSE";

export const GET_OFFERING_DATAS = "NFT_GET_OFFERING_DATAS";
export const OFFERING_DATAS_RESPONSE = "NFT_OFFERING_DATAS_RESPONSE";
export const RESET_OFFERING_DATAS_RESPONSE =
  "NFT_RESET_OFFERING_DATAS_RESPONSE";

export const JSONRPC_RESPONSE = "NFT_JSONRPC_RESPONSE";
export const CLEANUP = "NFT_CLEANUP";
export const FROM_WALLET = "FROM_WALLET";

export function setFromWallet(request: any | unknown): Action {
  return {
    type: FROM_WALLET,
    state: {
      fromWallet: request,
    },
  };
}

export function jsonrpcResponse(response: any | unknown): Action {
  return {
    type: JSONRPC_RESPONSE,
    state: {
      jsonrpcResponse: response,
    },
  };
}

export function getClaimables(request: GetClaimables): Action {
  return {
    type: GET_CLAIMABLES,
    state: {
      getClaimables: request,
    },
  };
}

export function claimablesResponse(response: ClaimablesResponse): Action {
  return {
    type: CLAIMABLES_RESPONSE,
    state: {
      claimablesResponse: response,
    },
  };
}

export function resetClaimablesResponse(): Action {
  return {
    type: RESET_CLAIMABLES_RESPONSE,
    state: {
      claimablesResponse: null,
    },
  };
}

export function requestClaim(request: RequestClaim): Action {
  return {
    type: REQUEST_CLAIM,
    state: {
      requestClaim: request,
    },
  };
}

export function cancelClaim(request: Claimable): Action {
  return {
    type: CANCEL_CLAIM,
    state: {
      cancelClaim: request,
    },
  };
}

export function requestClaimResponse(response: RequestClaimResponse): Action {
  return {
    type: REQUEST_CLAIM_RESPONSE,
    state: {
      requestClaimResponse: response,
    },
  };
}

export function cancelClaimResponse(response: CancelClaimResponse): Action {
  return {
    type: CANCEL_CLAIM_RESPONSE,
    state: {
      cancelClaimResponse: response,
    },
  };
}

export function resetRequestClaimResponse(): Action {
  return {
    type: RESET_REQUEST_CLAIM_RESPONSE,
    state: {
      requestClaimResponse: null,
    },
  };
}

export function resetCancelClaimResponse(): Action {
  return {
    type: RESET_CANCEL_CLAIM_RESPONSE,
    state: {
      cancelClaimResponse: null,
    },
  };
}

export function getAvailables(request: GetAvailables): Action {
  return {
    type: GET_AVAILABLES,
    state: {
      getAvailables: request,
    },
  };
}

export function availablesResponse(response: AvailableResponse): Action {
  return {
    type: AVAILABLES_RESPONSE,
    state: {
      availablesResponse: response,
    },
  };
}

export function resetAvailablesResponse(): Action {
  return {
    type: AVAILABLES_RESPONSE,
    state: {
      availablesResponse: null,
    },
  };
}

export function getData(request: GetData): Action {
  return {
    type: GET_DATA,
    state: {
      getData: request,
    },
  };
}

export function dataResponse(response: Nft): Action {
  return {
    type: DATA_RESPONSE,
    state: {
      dataResponse: response,
    },
  };
}

export function resetDataResponse(): Action {
  return {
    type: RESET_DATA_RESPONSE,
    state: {
      dataResponse: null,
    },
  };
}

export function getDatas(request: GetDatas): Action {
  return {
    type: GET_DATAS,
    state: {
      getDatas: request,
    },
  };
}

export function datasResponse(response: NftsData): Action {
  return {
    type: DATAS_RESPONSE,
    state: {
      datasResponse: response,
    },
  };
}

export function resetDatasResponse(): Action {
  return {
    type: RESET_DATAS_RESPONSE,
    state: {
      datasResponse: null,
    },
  };
}

export function getFilterNameSellingDatas(request: GetDatas): Action {
  return {
    type: GET_FILTER_NAME_SELLING_DATAS,
    state: {
      getFilterNameSellingDatas: request,
    },
  };
}

export function filterNameSellingDatasResponse(response: Nft[]): Action {
  return {
    type: FILTER_NAME_SELLING_DATAS_RESPONSE,
    state: {
      filterNameSellingDatasResponse: response,
    },
  };
}

export function resetFilterNameSellingDatasResponse(): Action {
  return {
    type: RESET_FILTER_NAME_SELLING_DATAS_RESPONSE,
    state: {
      filterNameSellingDatasResponse: null,
    },
  };
}

export function getFilterNameOfferingDatas(request: GetDatas): Action {
  return {
    type: GET_FILTER_NAME_OFFERING_DATAS,
    state: {
      getFilterNameOfferingDatas: request,
    },
  };
}

export function filterNameOfferingDatasResponse(response: Nft[]): Action {
  return {
    type: FILTER_NAME_OFFERING_DATAS_RESPONSE,
    state: {
      filterNameOfferingDatasResponse: response,
    },
  };
}

export function resetFilterNameOfferingDatasResponse(): Action {
  return {
    type: RESET_FILTER_NAME_OFFERING_DATAS_RESPONSE,
    state: {
      filterNameOfferingDatasResponse: null,
    },
  };
}

export function getMarketDatas(request: GetMarketDatas): Action {
  return {
    type: GET_MARKET_DATAS,
    state: {
      getMarketDatas: request,
    },
  };
}

export function marketDatasResponse(response: NftsData): Action {
  return {
    type: MARKET_DATAS_RESPONSE,
    state: {
      marketDatasResponse: response,
    },
  };
}

export function resetMarketDatasResponse(): Action {
  return {
    type: RESET_MARKET_DATAS_RESPONSE,
    state: {
      marketDatasResponse: null,
    },
  };
}

export function getFilterNameDatas(request: GetMarketDatas): Action {
  return {
    type: GET_FILTER_NAME_DATAS,
    state: {
      getFilterNameDatas: request,
    },
  };
}

export function filterNameDatasResponse(response: Nft[]): Action {
  return {
    type: FILTER_NAME_DATAS_RESPONSE,
    state: {
      filterNameDatasResponse: response,
    },
  };
}

export function resetFilterNameDatasResponse(): Action {
  return {
    type: RESET_FILTER_NAME_DATAS_RESPONSE,
    state: {
      filterNameDatasResponse: null,
    },
  };
}

export function getOfferingDatas(request: GetDatas): Action {
  return {
    type: GET_OFFERING_DATAS,
    state: {
      getOfferingDatas: request,
    },
  };
}

export function offeringDatasResponse(response: NftsData): Action {
  return {
    type: OFFERING_DATAS_RESPONSE,
    state: {
      offeringDatasResponse: response,
    },
  };
}

export function resetOfferingDatasResponse(): Action {
  return {
    type: RESET_OFFERING_DATAS_RESPONSE,
    state: {
      offeringDatasResponse: null,
    },
  };
}

export function cleanup(): Action {
  return {
    type: CLEANUP,
    state: stateInitial,
  };
}
