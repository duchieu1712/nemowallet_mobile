import { take, put, fork, select, call, all } from "redux-saga/effects";
import * as actions from "./actions";
import * as reducers from "./reducers";
import {
  type RequestClaim,
  type RequestClaimResponse,
  type GetClaimables,
  type Claimable,
  type GetData,
  type GetDatas,
  type GetMarketDatas,
  type ClaimablesResponse,
  type CancelClaimResponse,
} from "./types";
import { channel } from "redux-saga";
import { type Response, RESPONSE_STATUS_OK } from "../jsonrpc/types";
import { cast } from "../../common/utilities";
import * as graphql from "../graphql";
import { type NftsData } from "../graphql/types";
import { type Nft } from "../graphql/types/generated";
import marketConfig from "../../config/market";
import { KogiApi, SERVICE_ID } from "../../common/enum";
import * as walletActions from "../wallet/actions";
import {
  rpcExecCogiChain,
  rpcExecCogiChain_batch,
} from "../../components/RpcExec/toast_chain";
import { type IContractRelay } from "../../common/types";

const jsonrpcResponseChannel = channel();
const getClaimablesSubscribeChannel = channel();

// function* getMarketDatas() {
//   const request: GetMarketDatas = yield select(reducers.getMarketDatas)
//   if (request.serviceID == SERVICE_ID._GALIXCITY) {
//     const ret: NftsData = yield call(
//       graphql.getNftsData_Galix,
//       marketConfig.contractNamespace,
//       request.serviceID,
//       request.account,
//       null,
//       request.filters
//     )
//     yield put(actions.resetMarketDatasResponse())
//     yield put(actions.marketDatasResponse(ret))
//   } else if (
//     request.serviceID == SERVICE_ID._9DNFT ||
//     request.serviceID == SERVICE_ID._SOUL_REALM ||
//     request.serviceID == SERVICE_ID._NARUTO
//   ) {
//     const ret: NftsData = yield call(
//       graphql.getNftsData_9DNFT,
//       marketConfig.contractNamespace,
//       request.serviceID,
//       request.account,
//       null,
//       request.filters
//     )
//     yield put(actions.resetMarketDatasResponse())
//     yield put(actions.marketDatasResponse(ret))
//   } else if (request.serviceID == SERVICE_ID._MARSWAR) {
//     const ret: NftsData = yield call(
//       graphql.getNftsData_Marswar,
//       marketConfig.contractNamespace,
//       request.serviceID,
//       request.account,
//       null,
//       request.filters
//     )
//     yield put(actions.resetMarketDatasResponse())
//     yield put(actions.marketDatasResponse(ret))
//   } else if (request.serviceID == SERVICE_ID._FLASHPOINT) {
//     const ret: NftsData = yield call(
//       graphql.getNftsData_Galix,
//       marketConfig.contractNamespace,
//       request.serviceID,
//       request.account,
//       null,
//       request.filters
//     )
//     yield put(actions.resetMarketDatasResponse())
//     yield put(actions.marketDatasResponse(ret))
//   } else if (request.serviceID == SERVICE_ID._RICHWORK_FARM_FAMILY) {
//     const ret: NftsData = yield call(
//       graphql.getNftsData_Galix,
//       marketConfig.contractNamespace,
//       request.serviceID,
//       request.account,
//       null,
//       request.filters
//     )
//     yield put(actions.resetMarketDatasResponse())
//     yield put(actions.marketDatasResponse(ret))
//   }
// }

function* getMarketDatas() {
  const request: GetMarketDatas = yield select(reducers.getMarketDatas);
  if (
    request.serviceID == SERVICE_ID._GALIXCITY ||
    request.serviceID == SERVICE_ID._OPS_ALPHA
  ) {
    const ret: NftsData = yield call(
      graphql.getNftsData_Galix,
      marketConfig.contractNamespace,
      request.serviceID,
      request.account,
      null,
      request.filters,
    );
    yield put(actions.resetMarketDatasResponse());
    yield put(actions.marketDatasResponse(ret));
  } else if (
    request.serviceID == SERVICE_ID._9DNFT ||
    request.serviceID == SERVICE_ID._SOUL_REALM ||
    request.serviceID == SERVICE_ID._NARUTO
  ) {
    const ret: NftsData = yield call(
      graphql.getNftsData_9DNFT,
      marketConfig.contractNamespace,
      request.serviceID,
      request.account,
      null,
      request.filters,
    );

    yield put(actions.resetMarketDatasResponse());
    yield put(actions.marketDatasResponse(ret));
  } else if (request.serviceID == SERVICE_ID._MARSWAR) {
    const ret: NftsData = yield call(
      graphql.getNftsData_Marswar,
      marketConfig.contractNamespace,
      request.serviceID,
      request.account,
      null,
      request.filters,
    );
    yield put(actions.resetMarketDatasResponse());
    yield put(actions.marketDatasResponse(ret));
  } else if (request.serviceID == SERVICE_ID._FLASHPOINT) {
    const ret: NftsData = yield call(
      graphql.getNftsData_Galix,
      marketConfig.contractNamespace,
      request.serviceID,
      request.account,
      null,
      request.filters,
    );
    yield put(actions.resetMarketDatasResponse());
    yield put(actions.marketDatasResponse(ret));
  } else if (request.serviceID == SERVICE_ID._RICHWORK_FARM_FAMILY) {
    const ret: NftsData = yield call(
      graphql.getNftsData_Galix,
      marketConfig.contractNamespace,
      request.serviceID,
      request.account,
      null,
      request.filters,
    );
    yield put(actions.resetMarketDatasResponse());
    yield put(actions.marketDatasResponse(ret));
  } else if (request.serviceID == SERVICE_ID._FANTASY_DYNASTY) {
    const ret: NftsData = yield call(
      graphql.getNftsData_Galix,
      marketConfig.contractNamespace,
      request.serviceID,
      request.account,
      null,
      request.filters,
    );
    yield put(actions.resetMarketDatasResponse());
    yield put(actions.marketDatasResponse(ret));
  }
}

function* getDataOfferings() {
  const request = yield select(reducers.getOfferingDatas);
  let ret;
  if (
    request.serviceID == SERVICE_ID._GALIXCITY ||
    request.serviceID == SERVICE_ID._FLASHPOINT ||
    request.serviceID == SERVICE_ID._OPS_ALPHA
  ) {
    ret = yield call(
      graphql.getNftDataOffering_Galix,
      marketConfig.contractNamespace,
      request.serviceID,
      request.account,
      request.filters,
    );
  } else if (
    request.serviceID == SERVICE_ID._9DNFT ||
    request.serviceID == SERVICE_ID._SOUL_REALM ||
    request.serviceID == SERVICE_ID._NARUTO
  ) {
    ret = yield call(
      graphql.getNftDataOffering_9DNFT,
      marketConfig.contractNamespace,
      request.serviceID,
      request.account,
      request.filters,
    );
  } else if (request.serviceID == SERVICE_ID._MARSWAR) {
    ret = yield call(
      graphql.getNftDataOffering_Marswar,
      marketConfig.contractNamespace,
      request.serviceID,
      request.account,
      request.filters,
    );
  }
  yield put(actions.resetOfferingDatasResponse());
  yield put(actions.offeringDatasResponse(ret));
}

// function* getDatas() {
//   const request: GetDatas = yield select(reducers.getDatas)
//   const ret: NftsData = yield call(
//     graphql.getNftsData,
//     marketConfig.contractNamespace,
//     null,
//     request.account,
//     request.filters
//   )
//   yield put(actions.resetDatasResponse())
//   yield put(actions.datasResponse(ret))
// }

function* getDatas() {
  const request: GetDatas = yield select(reducers.getDatas);
  if (
    request.serviceID == SERVICE_ID._GALIXCITY ||
    request.serviceID == SERVICE_ID._FLASHPOINT ||
    request.serviceID == SERVICE_ID._RICHWORK_FARM_FAMILY ||
    request.serviceID == SERVICE_ID._OPS_ALPHA
  ) {
    const ret: NftsData = yield call(
      graphql.getNftsData_Galix,
      marketConfig.contractNamespace,
      request.serviceID,
      null,
      request.account,
      request.filters,
    );
    yield put(actions.resetDatasResponse());
    yield put(actions.datasResponse(ret));
  } else if (
    request.serviceID == SERVICE_ID._9DNFT ||
    request.serviceID == SERVICE_ID._SOUL_REALM ||
    request.serviceID == SERVICE_ID._NARUTO
  ) {
    const ret: NftsData = yield call(
      graphql.getNftsData_9DNFT,
      marketConfig.contractNamespace,
      request.serviceID,
      null,
      request.account,
      request.filters,
    );
    yield put(actions.resetDatasResponse());
    yield put(actions.datasResponse(ret));
  } else if (request.serviceID == SERVICE_ID._MARSWAR) {
    const ret: NftsData = yield call(
      graphql.getNftsData_Marswar,
      marketConfig.contractNamespace,
      request.serviceID,
      null,
      request.account,
      request.filters,
    );
    yield put(actions.resetDatasResponse());
    yield put(actions.datasResponse(ret));
  }
}

function* getData() {
  const request: GetData = yield select(reducers.getData);
  let ret;
  if (
    request.serviceID == SERVICE_ID._GALIXCITY ||
    request.serviceID == SERVICE_ID._FLASHPOINT ||
    request.serviceID == SERVICE_ID._RICHWORK_FARM_FAMILY ||
    request.serviceID == SERVICE_ID._OPS_ALPHA
  ) {
    ret = yield call(
      graphql.getNftData_Galix,
      marketConfig.contractNamespace,
      request.serviceID,
      request.collection,
      request.tokenId,
    );
  } else if (
    request.serviceID == SERVICE_ID._9DNFT ||
    request.serviceID == SERVICE_ID._SOUL_REALM ||
    request.serviceID == SERVICE_ID._NARUTO
  ) {
    ret = yield call(
      graphql.getNftData_9DNFT,
      marketConfig.contractNamespace,
      request.serviceID,
      request.collection,
      request.tokenId,
    );
  } else if (request.serviceID == SERVICE_ID._MARSWAR) {
    ret = yield call(
      graphql.getNftData_Marswar,
      marketConfig.contractNamespace,
      request.serviceID,
      request.collection,
      request.tokenId,
    );
  }
  yield put(actions.resetDataResponse());
  yield put(actions.dataResponse(ret));
}

function* getFilterNameOffferingDatas() {
  const request = yield select(reducers.getFilterNameOfferingDatas);
  let ret;
  if (
    request.serviceID == SERVICE_ID._GALIXCITY ||
    request.serviceID == SERVICE_ID._FLASHPOINT ||
    request.serviceID == SERVICE_ID._RICHWORK_FARM_FAMILY ||
    request.serviceID == SERVICE_ID._OPS_ALPHA
  ) {
    ret = yield call(
      graphql.getNftDataOffering_Galix,
      marketConfig.contractNamespace,
      request.serviceID,
      request.account,
      request.filters,
    );
  } else if (
    request.serviceID == SERVICE_ID._9DNFT ||
    request.serviceID == SERVICE_ID._SOUL_REALM ||
    request.serviceID == SERVICE_ID._NARUTO
  ) {
    ret = yield call(
      graphql.getNftDataOffering_9DNFT,
      marketConfig.contractNamespace,
      request.serviceID,
      request.account,
      request.filters,
    );
  } else if (request.serviceID == SERVICE_ID._MARSWAR) {
    ret = yield call(
      graphql.getNftDataOffering_Marswar,
      marketConfig.contractNamespace,
      request.serviceID,
      request.account,
      request.filters,
    );
  }
  if (ret?.bids != null) {
    const lstNfts: Nft[] = [];
    for (let i = 0; i < ret.bids.length; i++) {
      if (
        ret.bids[i] &&
        !lstNfts.some(
          (e) => e.metadata.name == ret.bids[i]?.nft?.metadata?.name,
        )
      ) {
        lstNfts.push(ret.bids[i].nft);
      }
    }
    yield put(actions.resetFilterNameOfferingDatasResponse());
    yield put(actions.filterNameOfferingDatasResponse(lstNfts));
  }
}

function* getFilterNameSellingDatas() {
  const request: GetDatas = yield select(reducers.getFilterNameSellingDatas);
  let ret;
  if (
    request.serviceID == SERVICE_ID._GALIXCITY ||
    request.serviceID == SERVICE_ID._FLASHPOINT ||
    request.serviceID == SERVICE_ID._RICHWORK_FARM_FAMILY ||
    request.serviceID == SERVICE_ID._OPS_ALPHA
  ) {
    ret = yield call(
      graphql.getNftsData_Galix,
      marketConfig.contractNamespace,
      request.serviceID,
      request.account,
      null,
      request.filters,
    );
  } else if (
    request.serviceID == SERVICE_ID._9DNFT ||
    request.serviceID == SERVICE_ID._SOUL_REALM ||
    request.serviceID == SERVICE_ID._NARUTO
  ) {
    ret = yield call(
      graphql.getNftsData_9DNFT,
      marketConfig.contractNamespace,
      request.serviceID,
      request.account,
      null,
      request.filters,
    );
  } else if (request.serviceID == SERVICE_ID._MARSWAR) {
    ret = yield call(
      graphql.getNftsData_Marswar,
      marketConfig.contractNamespace,
      request.serviceID,
      request.account,
      null,
      request.filters,
    );
  }
  if (ret?.nfts != null) {
    const lstNfts: Nft[] = [];
    for (let i = 0; i < ret.nfts.length; i++) {
      if (
        ret.nfts[i] &&
        !lstNfts.some((e) => e.metadata.name == ret.nfts[i].metadata.name)
      ) {
        lstNfts.push(ret.nfts[i]);
      }
    }
    yield put(actions.resetFilterNameSellingDatasResponse());
    yield put(actions.filterNameSellingDatasResponse(lstNfts));
  }
}

function* getFilterNameListingDatas() {
  const request: GetDatas = yield select(reducers.getFilterNameDatas);
  let ret;
  if (
    request.serviceID == SERVICE_ID._GALIXCITY ||
    request.serviceID == SERVICE_ID._FLASHPOINT ||
    request.serviceID == SERVICE_ID._RICHWORK_FARM_FAMILY ||
    request.serviceID == SERVICE_ID._OPS_ALPHA
  ) {
    ret = yield call(
      graphql.getNftsData_Galix,
      marketConfig.contractNamespace,
      request.serviceID,
      null,
      request.account,
      request.filters,
    );
  } else if (
    request.serviceID == SERVICE_ID._9DNFT ||
    request.serviceID == SERVICE_ID._SOUL_REALM ||
    request.serviceID == SERVICE_ID._NARUTO
  ) {
    ret = yield call(
      graphql.getNftsData_9DNFT,
      marketConfig.contractNamespace,
      request.serviceID,
      null,
      request.account,
      request.filters,
    );
  } else if (request.serviceID == SERVICE_ID._MARSWAR) {
    ret = yield call(
      graphql.getNftsData_Marswar,
      marketConfig.contractNamespace,
      request.serviceID,
      null,
      request.account,
      request.filters,
    );
  }
  if (ret?.nfts != null) {
    const lstNfts: Nft[] = [];
    for (let i = 0; i < ret.nfts.length; i++) {
      if (
        ret.nfts[i] &&
        !lstNfts.some((e) => e.metadata.name == ret.nfts[i].metadata.name)
      ) {
        lstNfts.push(ret.nfts[i]);
      }
    }
    yield put(actions.resetFilterNameDatasResponse());
    yield put(actions.filterNameDatasResponse(lstNfts));
  }
}

function* requestClaim() {
  const request: RequestClaim = yield select(reducers.requestClaim);
  const ret: RequestClaimResponse = {
    namespace: request.namespace,
    contractRelay: null,
  };
  try {
    const params = [request.cid];
    const res = yield rpcExecCogiChain({
      method: `${request.namespace}.request_claim`,
      params,
    });
    if (res.contract_relay != undefined) {
      ret.namespace = request.namespace;
      ret.contractRelay = cast<IContractRelay>(res.contract_relay);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
  yield put(actions.requestClaimResponse(ret));
}

function* cancelClaim() {
  const request: Claimable = yield select(reducers.cancelClaim);
  const ret: CancelClaimResponse = {
    status: KogiApi.INPUT_SOMETHING_WRONG,
    error: "KogiApi.INPUT_SOMETHING_WRONG",
    request,
  };
  try {
    const params = [request.cid];
    const res = yield rpcExecCogiChain({
      method: `${request.namespace}.cancel_claim`,
      params,
    });
    if (res.status != undefined) {
      ret.status = parseInt(res.status);
      ret.error = null;
    }
  } catch (e) {
    ret.error = e;
  }
  yield put(actions.cancelClaimResponse(ret));
}

function* getClaimables() {
  const request: GetClaimables = yield select(reducers.getClaimables);
  const ret: ClaimablesResponse = [];
  const params = [];
  const batch = [];
  for (let i = 0; i < request.namespaces.length; i++) {
    const namespace = request.namespaces[i];
    batch.push({
      method: `${namespace}.get_claimable`,
      params,
    });
  }
  const ress = yield rpcExecCogiChain_batch(batch);
  for (let k = 0; k < ress.length; k++) {
    const res = ress[k];
    if (res.claimable == undefined) continue;
    for (let i = 0; i < res.claimable.length; i++) {
      const _res = cast<Claimable>({
        ...res.claimable[i],
        namespace: request.namespaces[k],
      });
      ret.push(_res);
    }
  }

  if (request.reload != undefined && request.reload) {
    yield put(actions.resetCancelClaimResponse());
  }

  yield put(actions.claimablesResponse(ret));
  // An - Khóa
  // yield getClaimablesReload()
}

function* jsonrpcResponse() {
  const response: Response = yield select(reducers.jsonrpcResponse);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [namespace, method] = response.request.method?.split(".");
  if (response.status != RESPONSE_STATUS_OK) {
    console.error(`jsonrpcResponse Failed ${JSON.stringify(response)}`);
    return;
  }
  switch (method) {
    default: {
      throw `not found ${response.request.method}`;
    }
  }
}

function* actionRequestClaimListener() {
  while (true) {
    yield take(actions.REQUEST_CLAIM);
    yield fork(requestClaim);
  }
}

function* actionCancelClaimListener() {
  while (true) {
    yield take(actions.CANCEL_CLAIM);
    yield fork(cancelClaim);
  }
}

function* actionGetClaimablesListener() {
  while (true) {
    yield take(actions.GET_CLAIMABLES);
    yield fork(getClaimables);
  }
}

function* actionGetDataListener() {
  while (true) {
    yield take(actions.GET_DATA);
    yield fork(getData);
  }
}

function* actionGetDatasListener() {
  while (true) {
    yield take(actions.GET_DATAS);
    yield fork(getDatas);
  }
}

function* actionGetMarketDatasListener() {
  while (true) {
    yield take(actions.GET_MARKET_DATAS);
    yield fork(getMarketDatas);
  }
}

function* actionGetFilterNameDatasListener() {
  while (true) {
    yield take(actions.GET_FILTER_NAME_DATAS);
    yield fork(getFilterNameListingDatas);
  }
}

function* actionGetFilterNameSellingDatasListener() {
  while (true) {
    yield take(actions.GET_FILTER_NAME_SELLING_DATAS);
    yield fork(getFilterNameSellingDatas);
  }
}

function* actionGetFilterNameOfferingDatasListener() {
  while (true) {
    yield take(actions.GET_FILTER_NAME_OFFERING_DATAS);
    yield fork(getFilterNameOffferingDatas);
  }
}

function* actionGetDataOfferingsListener() {
  while (true) {
    yield take(actions.GET_OFFERING_DATAS);
    yield fork(getDataOfferings);
  }
}

function* getClaimablesSubscribeChannelListener() {
  while (true) {
    const action = yield take(getClaimablesSubscribeChannel);
    yield put(action);
  }
}

function* jsonrpcResponseChannelListener() {
  while (true) {
    const action = yield take(jsonrpcResponseChannel);
    yield put(action);
  }
}

function* actionJsonrpcResponseListener() {
  while (true) {
    yield take(actions.JSONRPC_RESPONSE);
    yield fork(jsonrpcResponse);
  }
}

function* actionCleanupListener() {
  while (true) {
    yield take(walletActions.CLEANUP);
    yield put(actions.cleanup());
  }
}

function* actionListener() {
  yield all([
    fork(actionGetClaimablesListener),
    fork(jsonrpcResponseChannelListener),
    fork(getClaimablesSubscribeChannelListener),
    fork(actionRequestClaimListener),
    fork(actionCancelClaimListener),
    fork(actionGetDataListener),
    fork(actionGetDatasListener),
    fork(actionGetMarketDatasListener),
    fork(actionGetFilterNameDatasListener),
    fork(actionGetFilterNameSellingDatasListener),
    fork(actionGetFilterNameOfferingDatasListener),
    fork(actionGetDataOfferingsListener),
    fork(actionCleanupListener),
  ]);
}

export default function* root(): any {
  yield all([fork(actionListener), fork(actionJsonrpcResponseListener)]);
}
