import * as gql_Flashpoint from "./gql_Flashpoint";
import * as gql_RichWorkFamily from "./gql_RichWorkFamily";
import * as qpl9D from "./gql_9D";
import * as qplCommon from "./gql_Common";
import * as qplGalix from "./gql_Galix";
import * as qplMarswar from "./gql_Marswaw";
import * as qplStaking from "./gql_Staking";

import {
  type BidOrder,
  type Nft,
  type PoolRentingLand,
  type PoolSimpleEarn,
  type Statistic,
  type Transaction,
  type SubscribedUser,
} from "./types/generated";
import {
  type BidsData,
  type DashboardData,
  type NftsData,
  type TransactionsData,
} from "./types";
import { cast, unConvertFromURL } from "../../common/utilities";
import {
  collectionsAddressFromSlugs,
  getCollectionByType,
  graphGatewayEndpointFromNamespace,
  graphGatewayEndpointFromNamespace_v2,
} from "../../common/utilities_config";

import { DEFAULT_MAX_VALUE_FILTER_DASHBOARD } from "../../common/constants";
import { GraphQLClient } from "graphql-request";
import { type INFTFilters } from "../nft/types";
import { type ITransFilters } from "../transaction/types";
import { SERVICE_ID } from "../../common/enum";

const getGraphQLClient = (namespace: string): GraphQLClient | null => {
  const endpoint = graphGatewayEndpointFromNamespace(namespace);
  if (endpoint.endpoint == null) return null;
  return new GraphQLClient(endpoint.endpoint);
};

const getGraphQLClient_v2 = (
  namespace: string,
  serviceID: string | number,
): GraphQLClient | null => {
  const endpoint = graphGatewayEndpointFromNamespace_v2(namespace, serviceID);
  if (endpoint.endpoint == null) return null;
  return new GraphQLClient(endpoint.endpoint);
};

// item Detail
export async function getNftData_Galix(
  namespace: string, // Market namespace
  serviceID: string,
  address: string, // nft contract address
  tokenId: string,
): Promise<Nft> {
  const graphQLClient = getGraphQLClient_v2(namespace, serviceID);
  if (graphQLClient == null) return null;
  const variables = {
    where: {
      collection: address.toLowerCase(),
      tokenId,
    },
  };
  try {
    let data;
    if (serviceID == SERVICE_ID._FLASHPOINT) {
      data = await graphQLClient.request(gql_Flashpoint.getNftData, variables);
    } else {
      data = await graphQLClient.request(qplGalix.getNftData, variables);
    }
    return cast<Nft>(data.nfts[0]);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
  return null;
}

export async function getNftData_9DNFT(
  namespace: string, // Market namespace
  serviceID: string,
  address: string, // nft contract address
  tokenId: string,
): Promise<Nft> {
  const graphQLClient = getGraphQLClient_v2(namespace, serviceID);
  if (graphQLClient == null) return null;
  const variables = {
    where: {
      collection: address.toLowerCase(),
      tokenId,
    },
  };
  try {
    const data = await graphQLClient.request(qpl9D.getNftData, variables);
    return cast<Nft>(data.nfts[0]);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
  return null;
}

export async function getNftData_Marswar(
  namespace: string, // Market namespace
  serviceID: string,
  address: string, // nft contract address
  tokenId: string,
): Promise<Nft> {
  const graphQLClient = getGraphQLClient_v2(namespace, serviceID);
  if (graphQLClient == null) return null;
  const variables = {
    where: {
      collection: address.toLowerCase(),
      tokenId,
    },
  };
  try {
    const data = await graphQLClient.request(qplMarswar.getNftData, variables);
    return cast<Nft>(data.nfts[0]);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
  return null;
}
/// //

// export async function getNftsData(
//   namespace: string, //Market namespace
//   seller: string = null,
//   owner: string = null,
//   filters: INFTFilters = null
// ) {
//   const ret: NftsData = {
//     nfts: [],
//     pageInfo: {
//       hasPrevPage: false,
//       hasNextPage: false,
//     },
//   }
//   const graphQLClient = getGraphQLClient(namespace)
//   if (graphQLClient == null) return ret
//   const variables = {
//     where: {},
//     first: 1,
//     skip: 0,
//     orderBy: 'askPrice',
//     orderDirection: 'asc',
//   }

//   if (seller != null && seller != '') {
//     variables['where']['seller'] = seller.toLowerCase()
//   }

//   if (owner != null) {
//     variables['where']['owner'] = owner.toLowerCase()
//     variables['where']['isTradable'] = false
//   } else {
//     //getMarketDatas
//     variables['where']['isTradable'] = true
//   }

//   if (filters.collections != undefined) {
//     const collectionsAddress = collectionsAddressFromSlugs(filters.collections, serviceID)
//     const _c = []
//     for (let i = 0; i < collectionsAddress.length; i++) {
//       _c.push(collectionsAddress[i].toLowerCase())
//     }
//     if (_c.length != 0) {
//       variables['where']['collection_in'] = _c
//     }
//   }

//   if (filters.metadataTypes != undefined) {
//     variables['where']['metadataType_in'] = filters.metadataTypes
//   }

//   if (filters.metadataRaritys != undefined) {
//     variables['where']['metadataRarity_in'] = filters.metadataRaritys
//   }

//   if (filters.metadataIndexs != undefined) {
//     variables['where']['metadataIndex_in'] = filters.metadataIndexs
//   }

//   if (filters.metadataNftType != undefined) {
//     variables['where']['metadataNftType'] = filters.metadataNftType
//   }

//   if (filters.metadataLevels != undefined) {
//     variables['where']['metadataLevel_gte'] = parseInt(
//       filters.metadataLevels.min.toString()
//     )
//     variables['where']['metadataLevel_lte'] = parseInt(
//       filters.metadataLevels.max.toString()
//     )
//   }

//   if (filters.metadataNames != undefined) {
//     variables['where']['metadataName_contains'] = unConvertFromURL(
//       filters.metadataNames.toLowerCase()
//     )
//   }

//   if (filters.prices != undefined) {
//     variables['where']['askPrice_gte'] = filters.prices.min.toString()
//     variables['where']['askPrice_lte'] = filters.prices.max.toString()
//   }

//   if (filters.orders != undefined) {
//     if (filters.orders.created != undefined) {
//       variables['orderBy'] = 'updatedAt'
//       variables['orderDirection'] = filters.orders.created
//     }
//     if (filters.orders.price != undefined) {
//       variables['orderBy'] = 'askPrice'
//       variables['orderDirection'] = filters.orders.price
//     }
//   }

//   if (filters.limit != undefined && filters.offset != undefined) {
//     variables['first'] = filters.limit + 1
//     variables['skip'] = filters.offset
//   }

//   try {
//     const data = await graphQLClient.request(qplGalix.getNftsData, variables)
//     const nfts = cast<Nft[]>(data['nfts'])
//     ret['pageInfo'] = {
//       hasPrevPage: filters.offset > 0,
//       hasNextPage: nfts.length > filters.limit,
//     }
//     //delete nfts[filters.limit]
//     nfts.splice(filters.limit, 1)
//     ret['nfts'] = nfts
//   } catch (e) {
//     // eslint-disable-next-line no-console
//     console.log(e)
//   }
//   return ret
// }

// List Data Inventory
export async function getNftsData_Galix(
  namespace: string, // Market namespace
  serviceID: string | number,
  seller: string,
  owner: string,
  filters: INFTFilters = null,
): Promise<NftsData> {
  const ret: NftsData = {
    nfts: [],
    pageInfo: {
      hasPrevPage: false,
      hasNextPage: false,
    },
  };
  const graphQLClient = getGraphQLClient_v2(namespace, serviceID);
  if (graphQLClient == null) return ret;
  const variables = {
    where: {},
    first: 1,
    skip: 0,
    orderBy: "askPrice",
    orderDirection: "asc",
  };
  if (seller != null && seller != "") {
    variables.where.seller = seller.toLowerCase();
  }

  if (owner != null) {
    variables.where.owner = owner.toLowerCase();
    variables.where.isTradable = false;
  } else {
    // getMarketDatas
    variables.where.isTradable = true;
  }

  if (filters.collections != undefined) {
    const collectionsAddress = collectionsAddressFromSlugs(
      filters.collections,
      serviceID,
    );
    const _c = [];
    for (let i = 0; i < collectionsAddress.length; i++) {
      _c.push(collectionsAddress[i].toLowerCase());
    }
    if (_c.length != 0) {
      variables.where.collection_in = _c;
    }
  }

  if (filters.metadataTypes != undefined) {
    variables.where.metadataType_in = filters.metadataTypes;
  }

  if (filters.metadataRaritys != undefined) {
    variables.where.metadataRarity_in = filters.metadataRaritys;
  }

  if (filters.metadataQualitys != undefined) {
    variables.where.metadataQuality_in = filters.metadataQualitys;
  }

  if (filters.metadataIndexs != undefined) {
    variables.where.metadataIndex_in = filters.metadataIndexs;
  }

  if (filters.metadataNftType != undefined) {
    variables.where.metadataNftType = filters.metadataNftType;
  }

  if (filters.metadataLevels != undefined) {
    variables.where.metadataLevel_gte = parseInt(
      filters.metadataLevels.min.toString(),
    );
    variables.where.metadataLevel_lte = parseInt(
      filters.metadataLevels.max.toString(),
    );
  }

  if (filters.metadataNames != undefined) {
    variables.where.metadataName_contains = unConvertFromURL(
      filters.metadataNames.toLowerCase(),
    );
  }

  if (filters.prices != undefined) {
    variables.where.askPrice_gte = filters.prices.min.toString();
    variables.where.askPrice_lte = filters.prices.max.toString();
  }

  if (filters.orders != undefined) {
    if (filters.orders.created != undefined) {
      variables.orderBy = "updatedAt";
      variables.orderDirection = filters.orders.created;
    }
    if (filters.orders.price != undefined) {
      variables.orderBy = "askPrice";
      variables.orderDirection = filters.orders.price;
    }
  }

  if (filters.limit != undefined && filters.offset != undefined) {
    variables.first = filters.limit + 1;
    variables.skip = filters.offset;
  }
  try {
    let data;
    if (serviceID == SERVICE_ID._FLASHPOINT) {
      data = await graphQLClient.request(gql_Flashpoint.getNftsData, variables);
    } else {
      data = await graphQLClient.request(qplGalix.getNftsData, variables);
    }
    const nfts = cast<Nft[]>(data.nfts);
    ret.pageInfo = {
      hasPrevPage: filters.offset > 0,
      hasNextPage: nfts.length > filters.limit,
    };
    // delete nfts[filters.limit]
    nfts.splice(filters.limit, 1);
    ret.nfts = nfts;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
  return ret;
}

export async function getNftsData_9DNFT(
  namespace: string, // Market namespace
  serviceID: string | number,
  seller: string,
  owner: string,
  filters: INFTFilters = null,
): Promise<NftsData> {
  const ret: NftsData = {
    nfts: [],
    pageInfo: {
      hasPrevPage: false,
      hasNextPage: false,
    },
  };
  const graphQLClient = getGraphQLClient_v2(namespace, serviceID);
  if (graphQLClient == null) return ret;
  const variables: any = {
    where: {},
    first: 1,
    skip: 0,
    orderBy: "askPrice",
    orderDirection: "asc",
  };

  if (seller != null && seller != "") {
    variables.where.seller = seller.toLowerCase();
  }

  if (owner != null) {
    variables.where.owner = owner.toLowerCase();
    variables.where.isTradable = false;
  } else {
    // getMarketDatas
    variables.where.isTradable = true;
  }

  if (filters.collections != undefined) {
    const collectionsAddress = collectionsAddressFromSlugs(
      filters.collections,
      serviceID,
    );
    const _c = [];
    for (let i = 0; i < collectionsAddress.length; i++) {
      _c.push(collectionsAddress[i].toLowerCase());
    }
    if (_c.length != 0) {
      variables.where.collection_in = _c;
    }
  }

  if (filters.metadataTypes != undefined) {
    variables.where.metadataType_in = filters.metadataTypes;
  }

  if (filters.metadataLevels != undefined) {
    variables.where.metadataLevel_in = filters.metadataLevels;
  }

  if (filters.metadataGrades != undefined) {
    variables.where.metadataGrade_gte = parseInt(
      filters.metadataGrades.min!.toString(),
    );
    variables.where.metadataGrade_lte = parseInt(
      filters.metadataGrades.max!.toString(),
    );
  }

  if (filters.metadataNames != undefined) {
    variables.where.metadataName_contains = unConvertFromURL(
      filters.metadataNames.toLowerCase(),
    );
  }

  if (filters.prices != undefined) {
    variables.where.askPrice_gte = filters.prices.min!.toString();
    variables.where.askPrice_lte = filters.prices.max!.toString();
  }

  if (filters.orders != undefined) {
    if (filters.orders.created != undefined) {
      variables.orderBy = "updatedAt";
      variables.orderDirection = filters.orders.created;
    }
    if (filters.orders.price != undefined) {
      variables.orderBy = "askPrice";
      variables.orderDirection = filters.orders.price;
    }
  }

  if (filters.limit != undefined && filters.offset != undefined) {
    variables.first = filters.limit + 1;
    variables.skip = filters.offset;
  }

  try {
    const data: any = await graphQLClient.request(qpl9D.getNftsData, variables);
    const nfts = cast<Nft[]>(data.nfts);
    ret.pageInfo = {
      hasPrevPage: filters.offset > 0,
      hasNextPage: nfts.length > filters.limit,
    };
    // delete nfts[filters.limit]
    nfts.splice(12, 1);
    ret.nfts = nfts;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }

  return ret;
}

export async function getNftsData_Marswar(
  namespace: string, // Market namespace
  serviceID: string | number,
  seller: string,
  owner: string,
  filters: INFTFilters = null,
): Promise<NftsData> {
  const ret: NftsData = {
    nfts: [],
    pageInfo: {
      hasPrevPage: false,
      hasNextPage: false,
    },
  };
  const graphQLClient = getGraphQLClient_v2(namespace, serviceID);
  if (graphQLClient == null) return ret;
  const variables: any = {
    where: {},
    first: 1,
    skip: 0,
    orderBy: "askPrice",
    orderDirection: "asc",
  };

  if (seller != null && seller != "") {
    variables.where.seller = seller.toLowerCase();
  }

  if (owner != null) {
    variables.where.owner = owner.toLowerCase();
    variables.where.isTradable = false;
  } else {
    // getMarketDatas
    variables.where.isTradable = true;
  }

  if (filters.collections != undefined) {
    const collectionsAddress = collectionsAddressFromSlugs(
      filters.collections,
      serviceID,
    );
    const _c = [];
    for (let i = 0; i < collectionsAddress.length; i++) {
      _c.push(collectionsAddress[i].toLowerCase());
    }
    if (_c.length != 0) {
      variables.where.collection_in = _c;
    }
  }

  if (filters.metadataRaritys != undefined) {
    variables.where.metadataRarity_in = filters.metadataRaritys;
  }

  if (filters.metadataTypes != undefined) {
    variables.where.metadataType_in = filters.metadataTypes;
  }

  if (filters.metadataIndexs != undefined) {
    variables.where.metadataIndex_in = filters.metadataIndexs;
  }

  if (filters.metadataNftType != undefined) {
    variables.where.metadataNftType = filters.metadataNftType;
  }

  if (filters.metadataLevels != undefined) {
    variables.where.metadataLevel_gte = parseInt(
      filters.metadataLevels.min!.toString(),
    );
    variables.where.metadataLevel_lte = parseInt(
      filters.metadataLevels.max!.toString(),
    );
  }

  if (filters.metadataStar != undefined) {
    variables.where.metadataStar_gte = parseInt(
      filters.metadataStar.min!.toString(),
    );
    variables.where.metadataStar_lte = parseInt(
      filters.metadataStar.max!.toString(),
    );
  }

  if (filters.metadataNames != undefined) {
    variables.where.metadataName_contains = unConvertFromURL(
      filters.metadataNames.toLowerCase(),
    );
  }

  if (filters.prices != undefined) {
    variables.where.askPrice_gte = filters.prices.min!.toString();
    variables.where.askPrice_lte = filters.prices.max!.toString();
  }

  if (filters.orders != undefined) {
    if (filters.orders.created != undefined) {
      variables.orderBy = "updatedAt";
      variables.orderDirection = filters.orders.created;
    }
    if (filters.orders.price != undefined) {
      variables.orderBy = "askPrice";
      variables.orderDirection = filters.orders.price;
    }
  }

  if (filters.limit != undefined && filters.offset != undefined) {
    variables.first = filters.limit + 1;
    variables.skip = filters.offset;
  }
  try {
    const data = await graphQLClient.request(qplMarswar.getNftsData, variables);
    const nfts = cast<Nft[]>(data.nfts);
    ret.pageInfo = {
      hasPrevPage: filters.offset > 0,
      hasNextPage: nfts.length > filters.limit,
    };
    // delete nfts[filters.limit]
    nfts.splice(filters.limit, 1);
    ret.nfts = nfts;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
  return ret;
}

// Get nfts offerring
export async function getNftDataOffering_Galix(
  namespace: string, // Market namespace
  serviceID: string,
  buyer: string = null,
  filters: INFTFilters = null,
): Promise<BidsData> {
  const ret: BidsData = {
    bids: [],
    pageInfo: {
      hasPrevPage: false,
      hasNextPage: false,
    },
  };
  const graphQLClient = getGraphQLClient_v2(namespace, serviceID);
  if (graphQLClient == null) return ret;
  const variables = {
    where: {},
    first: 1,
    skip: 0,
    orderBy: "price",
    orderDirection: "asc",
  };

  if (buyer != null) {
    variables.where.buyer = buyer.toLowerCase();
  }
  variables.where.isTradable = true;

  if (filters.collections != undefined) {
    const collectionsAddress = collectionsAddressFromSlugs(
      filters.collections,
      serviceID,
    );
    const _c = [];
    for (let i = 0; i < collectionsAddress.length; i++) {
      _c.push(collectionsAddress[i].toLowerCase());
    }
    if (_c.length != 0) {
      variables.where.collection_in = _c;
    }
  }

  if (filters.metadataTypes != undefined) {
    variables.where.nftMetadataType_in = filters.metadataTypes;
  }

  if (filters.metadataRaritys != undefined) {
    variables.where.nftMetadataRarity_in = filters.metadataRaritys;
  }

  if (filters.metadataIndexs != undefined) {
    variables.where.nftMetadataIndex_in = filters.metadataIndexs;
  }

  if (filters.metadataNames != undefined) {
    variables.where.nftMetadataName_contains = unConvertFromURL(
      filters.metadataNames.toLowerCase(),
    );
  }

  if (filters.metadataNftType != undefined) {
    variables.where.nftMetadataNftType = filters.metadataNftType;
  }

  if (filters.metadataLevels != undefined) {
    variables.where.nftMetadataLevel_gte = parseInt(
      filters.metadataLevels.min.toString(),
    );
    variables.where.nftMetadataLevel_lte = parseInt(
      filters.metadataLevels.max.toString(),
    );
  }

  if (filters.prices != undefined) {
    variables.where.price_gte = filters.prices.min.toString();
    variables.where.price_lte = filters.prices.max.toString();
  }

  if (filters.orders != undefined) {
    if (filters.orders.created != undefined) {
      variables.orderBy = "updatedAt";
      variables.orderDirection = filters.orders.created;
    }
    if (filters.orders.price != undefined) {
      variables.orderBy = "price";
      variables.orderDirection = filters.orders.price;
    }
  }

  if (filters.limit != undefined && filters.offset != undefined) {
    variables.first = filters.limit + 1;
    variables.skip = filters.offset;
  }
  try {
    let data;
    if (serviceID == SERVICE_ID._FLASHPOINT) {
      data = await graphQLClient.request(
        gql_Flashpoint.getNftDataOffering,
        variables,
      );
    } else {
      data = await graphQLClient.request(
        qplGalix.getNftDataOffering,
        variables,
      );
    }
    const bids = cast<BidOrder[]>(data.bidOrders);
    ret.pageInfo = {
      hasPrevPage: filters.offset > 0,
      hasNextPage: bids.length > filters.limit,
    };
    // delete bids[filters.limit]
    bids.splice(filters.limit, 1);
    ret.bids = bids;
  } catch (e) {
    // eslint-disable-next-line no-console
  }
  return ret;
}

// Get nfts offerring
export async function getNftDataOffering_9DNFT(
  namespace: string, // Market namespace
  serviceID: string,
  buyer: string = null,
  filters: INFTFilters = null,
): Promise<BidsData> {
  const ret: BidsData = {
    bids: [],
    pageInfo: {
      hasPrevPage: false,
      hasNextPage: false,
    },
  };
  const graphQLClient = getGraphQLClient_v2(namespace, serviceID);
  if (graphQLClient == null) return ret;
  const variables = {
    where: {},
    first: 1,
    skip: 0,
    orderBy: "price",
    orderDirection: "asc",
  };

  if (buyer != null) {
    variables.where.buyer = buyer.toLowerCase();
  }
  variables.where.isTradable = true;

  if (filters.collections != undefined) {
    const collectionsAddress = collectionsAddressFromSlugs(
      filters.collections,
      serviceID,
    );
    const _c = [];
    for (let i = 0; i < collectionsAddress.length; i++) {
      _c.push(collectionsAddress[i].toLowerCase());
    }
    if (_c.length != 0) {
      variables.where.collection_in = _c;
    }
  }

  if (filters.metadataTypes != undefined) {
    variables.where.nftMetadataType_in = filters.metadataTypes;
  }

  if (filters.metadataLevels != undefined) {
    variables.where.nftMetadataLevel_in = filters.metadataLevels;
  }

  if (filters.metadataNames != undefined) {
    variables.where.nftMetadataName_contains = unConvertFromURL(
      filters.metadataNames.toLowerCase(),
    );
  }

  if (filters.metadataGrades != undefined) {
    variables.where.nftMetadataGrade_gte = parseInt(
      filters.metadataGrades.min.toString(),
    );
    variables.where.nftMetadataGrade_lte = parseInt(
      filters.metadataGrades.max.toString(),
    );
  }

  if (filters.prices != undefined) {
    variables.where.price_gte = filters.prices.min.toString();
    variables.where.price_lte = filters.prices.max.toString();
  }

  if (filters.orders != undefined) {
    if (filters.orders.created != undefined) {
      variables.orderBy = "updatedAt";
      variables.orderDirection = filters.orders.created;
    }
    if (filters.orders.price != undefined) {
      variables.orderBy = "price";
      variables.orderDirection = filters.orders.price;
    }
  }

  if (filters.limit != undefined && filters.offset != undefined) {
    variables.first = filters.limit + 1;
    variables.skip = filters.offset;
  }

  try {
    const data = await graphQLClient.request(
      qpl9D.getNftDataOffering,
      variables,
    );
    const bids = cast<BidOrder[]>(data.bidOrders);
    ret.pageInfo = {
      hasPrevPage: filters.offset > 0,
      hasNextPage: bids.length > filters.limit,
    };
    // delete bids[filters.limit]
    bids.splice(filters.limit, 1);
    ret.bids = bids;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
  return ret;
}

export async function getNftDataOffering_Marswar(
  namespace: string, // Market namespace
  serviceID: string,
  buyer: string = null,
  filters: INFTFilters = null,
): Promise<BidsData> {
  const ret: BidsData = {
    bids: [],
    pageInfo: {
      hasPrevPage: false,
      hasNextPage: false,
    },
  };
  const graphQLClient = getGraphQLClient_v2(namespace, serviceID);
  if (graphQLClient == null) return ret;
  const variables = {
    where: {},
    first: 1,
    skip: 0,
    orderBy: "price",
    orderDirection: "asc",
  };

  if (buyer != null) {
    variables.where.buyer = buyer.toLowerCase();
  }
  variables.where.isTradable = true;

  if (filters.collections != undefined) {
    const collectionsAddress = collectionsAddressFromSlugs(
      filters.collections,
      serviceID,
    );
    const _c = [];
    for (let i = 0; i < collectionsAddress.length; i++) {
      _c.push(collectionsAddress[i].toLowerCase());
    }
    if (_c.length != 0) {
      variables.where.collection_in = _c;
    }
  }

  if (filters.metadataTypes != undefined) {
    variables.where.nftMetadataType_in = filters.metadataTypes;
  }

  if (filters.metadataRaritys != undefined) {
    variables.where.nftMetadataRarity_in = filters.metadataRaritys;
  }

  if (filters.metadataIndexs != undefined) {
    variables.where.nftMetadataIndex_in = filters.metadataIndexs;
  }

  if (filters.metadataNames != undefined) {
    variables.where.nftMetadataName_contains = unConvertFromURL(
      filters.metadataNames.toLowerCase(),
    );
  }

  if (filters.metadataNftType != undefined) {
    variables.where.nftMetadataNftType = filters.metadataNftType;
  }

  if (filters.metadataLevels != undefined) {
    variables.where.nftMetadataLevel_gte = parseInt(
      filters.metadataLevels.min.toString(),
    );
    variables.where.nftMetadataLevel_lte = parseInt(
      filters.metadataLevels.max.toString(),
    );
  }

  if (filters.prices != undefined) {
    variables.where.price_gte = filters.prices.min.toString();
    variables.where.price_lte = filters.prices.max.toString();
  }

  if (filters.orders != undefined) {
    if (filters.orders.created != undefined) {
      variables.orderBy = "updatedAt";
      variables.orderDirection = filters.orders.created;
    }
    if (filters.orders.price != undefined) {
      variables.orderBy = "price";
      variables.orderDirection = filters.orders.price;
    }
  }

  if (filters.limit != undefined && filters.offset != undefined) {
    variables.first = filters.limit + 1;
    variables.skip = filters.offset;
  }
  try {
    const data = await graphQLClient.request(
      qplMarswar.getNftDataOffering,
      variables,
    );
    const bids = cast<BidOrder[]>(data.bidOrders);
    ret.pageInfo = {
      hasPrevPage: filters.offset > 0,
      hasNextPage: bids.length > filters.limit,
    };
    // delete bids[filters.limit]
    bids.splice(filters.limit, 1);
    ret.bids = bids;
  } catch (e) {
    // eslint-disable-next-line no-console
  }
  return ret;
}

export async function getDashboardData(
  namespace: string, // Market namespace
  request: any | unknown,
): Promise<DashboardData> {
  let pTrans = 0;
  let pTotal = 0;
  const ret: DashboardData = {
    numTransaction: 0,
    totalPriceTransaction: 0,
    avgTotalPriceTransaction: 0,
  };
  const graphQLClient = getGraphQLClient_v2(namespace, request?.serviceId);
  if (graphQLClient == null) return null;
  try {
    for (let i = 0; i < DEFAULT_MAX_VALUE_FILTER_DASHBOARD; i = i + 1000) {
      const variables = {
        where: {},
        first: 1000,
        skip: i,
        orderBy: "id",
        orderDirection: "asc",
      };
      if (request?.time != undefined) {
        variables.where.time_gt = request?.time.toString();
      }
      const data = await graphQLClient.request(
        qplCommon.getDashboardData,
        variables,
      );
      if (data != null && data.statistics.length != 0) {
        for (let j = 0; j < data.statistics.length; j++) {
          const b = cast<Statistic>(data.statistics[j]);
          pTrans = pTrans + parseInt(b.totalTransaction.toString());
          pTotal = pTotal + parseFloat(b.volume.toString());
        }
      } else {
        break;
      }
    }
    ret.numTransaction = pTrans;
    ret.totalPriceTransaction = pTotal;
    if (pTotal) ret.avgTotalPriceTransaction = pTotal / pTrans;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
  return ret;
}

export async function getTransactionData(
  namespace: string, // Market Transaction
  filters: ITransFilters = null,
  serviceID: SERVICE_ID = null,
  account: any = null,
): Promise<TransactionsData> {
  const ret: TransactionsData = {
    trans: [],
    pageInfo: {
      hasPrevPage: false,
      hasNextPage: false,
    },
  };
  const graphQLClient = getGraphQLClient_v2(namespace, serviceID);
  if (graphQLClient == null) return ret;
  const variables = {
    where: {},
    first: 1,
    skip: 0,
    orderBy: "timestamp",
    orderDirection: "desc",
  };

  if (filters.metadataNftType != undefined && filters.metadataNftType != "") {
    // get collection
    variables.where.collection = getCollectionByType(
      filters.metadataNftType,
      serviceID,
    );
    console.log("pppppp", variables.where.collection);
  }

  if (account != undefined && account != "") {
    variables.where.sender = account.toLowerCase();
  }

  if (filters.limit != undefined && filters.offset != undefined) {
    variables.first = filters.limit + 1;
    variables.skip = filters.offset;
  }
  if (filters.prices != undefined) {
    variables.where.price_gte = filters.prices.min.toString();
    variables.where.price_lte = filters.prices.max.toString();
  }

  if (filters.orders != undefined) {
    if (filters.orders.created != undefined) {
      variables.orderBy = "timestamp";
      variables.orderDirection = filters.orders.created;
    }
    if (filters.orders.price != undefined) {
      variables.orderBy = "price";
      variables.orderDirection = filters.orders.price;
    }
  }

  variables.where.kind = "Sale";

  try {
    let data;
    if (serviceID == SERVICE_ID._9DNFT || serviceID == SERVICE_ID._SOUL_REALM) {
      data = await graphQLClient.request(qpl9D.getTransaction, variables);
    } else if (serviceID == SERVICE_ID._GALIXCITY) {
      data = await graphQLClient.request(qplGalix.getTransaction, variables);
    } else if (serviceID == SERVICE_ID._MARSWAR) {
      data = await graphQLClient.request(qplMarswar.getTransaction, variables);
    } else if (serviceID == SERVICE_ID._FLASHPOINT) {
      data = await graphQLClient.request(
        gql_Flashpoint.getTransaction,
        variables,
      );
    } else if (serviceID == SERVICE_ID._RICHWORK_FARM_FAMILY) {
      data = await graphQLClient.request(
        gql_RichWorkFamily.getTransaction,
        variables,
      );
    } else {
      data = await graphQLClient.request(qplGalix.getTransaction, variables);
    }

    const trans = cast<Transaction[]>(data.transactions);
    ret.pageInfo = {
      hasPrevPage: filters.offset > 0,
      hasNextPage: trans.length > filters.limit,
    };
    // delete trans[filters.limit]
    trans.splice(filters.limit, 1);
    ret.trans = trans;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
  return ret;
}

export async function getDataLandRenting(
  namespace: string,
  account: string,
): Promise<PoolRentingLand> {
  const graphQLClient = getGraphQLClient(namespace);
  if (graphQLClient == null) return null;
  const variables = {
    where: {},
    first: 1000,
    skip: 0,
    orderBy: "id",
    orderDirection: "desc",
  };
  try {
    const data = await graphQLClient.request(
      qplGalix.getListRentingLand.replace(
        "{account}",
        account?.toLowerCase() ?? "",
      ),
      variables,
    );
    return cast<PoolRentingLand>(data.pools[0]);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
  return null;
}

export async function getListPool(
  namespace: string, // Market namespace
  account: string,
): Promise<any[]> {
  let ret = [];
  const graphQLClient = getGraphQLClient(namespace);
  if (graphQLClient == null) return ret;
  const variables = {
    where: {},
    first: 100,
    skip: 0,
  };

  try {
    const data = await graphQLClient.request(
      qplStaking.getListPool.replace("{account}", account?.toLowerCase() ?? ""),
      variables,
    );
    const pools = cast<PoolSimpleEarn[]>(data.pools);
    ret = pools;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
  return ret;
}

export async function getListPoolStaked(
  namespace: string, // Market namespace
  account: string,
): Promise<any[]> {
  let ret = [];
  const graphQLClient = getGraphQLClient(namespace);
  if (graphQLClient == null) return ret;
  const variables = {
    where: {},
    first: 100,
    skip: 0,
  };

  if (account) {
    variables.where.account = account?.toString()?.trim()?.toLowerCase();
  }

  try {
    const data = await graphQLClient.request(
      qplStaking.getListPoolStaked,
      variables,
    );
    const pools = cast<SubscribedUser[]>(data.subscribedUsers);
    ret = pools;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
  return ret;
}
