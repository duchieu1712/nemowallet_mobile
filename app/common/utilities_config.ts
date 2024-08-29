import {
  type AssetInfo,
  type IAssetData,
  type IAssetDataNFT,
  type IBalanceData,
  type IBalanceDataCountDowwn,
  type IChainData,
  type ICollection,
  type IContract,
  type IEnpoint,
  type IHotwallet,
  type IMarket,
  type ITransactionData,
} from "./types";
import {
  cf_assets as Assets,
  cf_assetsINO,
  cf_assetsReceive,
} from "../config/assets";
import { type Balance, type Transaction } from "../modules/hotwallet/types";
import {
  ChainConfig,
  getChainId,
  providerCall,
} from "../modules/wallet/utilities";
import { ENUM_ENDPOINT_RPC, SERVICE_ID } from "./enum";
import { IMAGE_COD, IMAGE_COGI } from "./constants";
import {
  IPFS_GATEWAY_9DNFT,
  IPFS_GATEWAY_GALIX,
  IPFS_ORIGIN_9DNFT,
  IPFS_ORIGIN_GALIX,
} from "../config/ipfs";
import { cast, descyptNEMOWallet } from "./utilities";
import { cf_assetsZap, cf_assetsZapMetmask } from "../config/assets_zap";
import {
  cf_endpointsAPIFetch,
  cf_endpoints_9DNFT,
  cf_endpoints_GaliXCity,
  cf_endpoints_MechaWarfare,
  cf_endpoints_NEMOWallet,
  cf_hotwallets,
} from "../config/kogi-api";
import { isArray, sortBy } from "lodash";

import { ClassWithStaticMethod } from "./static";
import { Collections } from "../config/collections";
import { type Nft } from "../modules/graphql/types/generated";
import { appState } from "../modules";
import cf_Chains from "../config/chains";
import { cf_assets_NFT } from "../config/assets_NFT";
import cf_cogiIds from "../config/cogi-id";
import { cf_graphGateways } from "../config/graph-gateway";
import contracts from "../config/contracts";

export const toIpfsGatewayUrl = (
  origin: string,
  serviceID: string | any,
): string => {
  if (
    serviceID == SERVICE_ID._9DNFT ||
    serviceID == SERVICE_ID._SOUL_REALM ||
    serviceID == SERVICE_ID._NARUTO
  ) {
    return origin
      ?.replace(IPFS_ORIGIN_9DNFT, IPFS_GATEWAY_9DNFT)
      ?.replace("ipfs://", IPFS_GATEWAY_9DNFT);
  } else if (serviceID == SERVICE_ID._GALIXCITY) {
    return origin
      ?.replace(IPFS_ORIGIN_GALIX, IPFS_GATEWAY_GALIX)
      ?.replace("ipfs://", IPFS_GATEWAY_GALIX);
  } else if (serviceID == SERVICE_ID._MARSWAR) {
    return origin
      ?.replace(IPFS_ORIGIN_GALIX, IPFS_GATEWAY_GALIX)
      ?.replace("ipfs://", IPFS_GATEWAY_GALIX);
  }
  return origin
    ?.replace(IPFS_ORIGIN_GALIX, IPFS_GATEWAY_GALIX)
    ?.replace("ipfs://", IPFS_GATEWAY_GALIX);
};

export const getDefaultChain = (): IChainData | null => {
  for (let i = 0; i < cf_Chains.length; i++) {
    if (cf_Chains[i].chainId == ClassWithStaticMethod.STATIC_DEFAULT_CHAINID)
      return cf_Chains[i];
  }
  return null;
};

export const isAllowChainId = (chainId: number): boolean => {
  return (
    chainId == ClassWithStaticMethod.STATIC_DEFAULT_CHAINID ||
    ClassWithStaticMethod.STATIC_DEFAULT_CHAINID ==
      ClassWithStaticMethod.NEMO_WALLET_CHAINID
  );
  // return true || chainId == DEFAULT_CHAINID
  // return chainId == DEFAULT_CHAINID
  // for (let i = 0; i < contracts.length; i++) {
  //   if (contracts[i].chainId == chainId) return true
  // }
  // return false
};

export const graphGatewayEndpointFromNamespace = (namespace: string): any => {
  const chainId = getChainId();
  // let ret: IEnpoint = {
  //   chainId: 0,
  //   endpoint: null,
  //   endpointWs: null,
  // }
  let ret;
  for (let i = 0; i < cf_graphGateways.length; i++) {
    if (cf_graphGateways[i].namespace == namespace) {
      for (let j = 0; j < cf_graphGateways[i].endpoints.length; j++) {
        if (cf_graphGateways[i].endpoints[j].chainId == chainId) {
          ret = cf_graphGateways[i].endpoints[j];
        }
      }
    }
  }
  return ret;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const collectionSlugFromAddress = (
  address: string,
): string | undefined => {
  const c = contractConfigFromAddress(address);
  for (let i = 0; i < Collections.length; i++) {
    if (Collections[i].contractNamespace == c.namespace) {
      return Collections[i].slug;
    }
  }
  return "";
};

export const graphGatewayEndpointFromNamespace_v2 = (
  namespace: string,
  serviceID: string | number,
): any => {
  // Disable multi Change
  const chainId = ClassWithStaticMethod.STATIC_DEFAULT_CHAINID;
  let ret: any = {
    chainId: 0,
    endpoint: null,
    serviceID: null,
    serviceName: "",
  };
  for (let i = 0; i < cf_graphGateways.length; i++) {
    if (cf_graphGateways[i].namespace == namespace) {
      for (let j = 0; j < cf_graphGateways[i].endpoints.length; j++) {
        if (cf_graphGateways[i].endpoints[j].chainId == chainId) {
          const e = cf_graphGateways[i].endpoints[j];
          if (!isArray(e.endpoint)) continue;
          for (let it = 0; it < e.endpoint.length; it++) {
            if (e.endpoint[it].serviceID == serviceID) {
              ret = {
                ...e.endpoint[it],
                chainId: cf_graphGateways[i].endpoints[j].chainId,
              };
            }
          }
        }
      }
    }
  }
  return ret;
};

export const getListServiceNameNFT = (namespace: string): any => {
  const chainId = getChainId();
  const a = [];
  for (let i = 0; i < cf_graphGateways.length; i++) {
    if (cf_graphGateways[i].namespace == namespace) {
      for (let j = 0; j < cf_graphGateways[i].endpoints.length; j++) {
        if (cf_graphGateways[i].endpoints[j].chainId == chainId) {
          const e = cf_graphGateways[i].endpoints[j];
          if (!isArray(e.endpoint)) continue;
          for (let it = 0; it < e.endpoint.length; it++) {
            a.push(e.endpoint[it].serviceName);
          }
        }
      }
    }
  }
  return a;
};

export const getListEndpoint = (namespace: string): any => {
  const chainId = getChainId();
  const lst = [];
  for (let i = 0; i < cf_graphGateways.length; i++) {
    if (cf_graphGateways[i].namespace == namespace) {
      for (let j = 0; j < cf_graphGateways[i].endpoints.length; j++) {
        if (cf_graphGateways[i].endpoints[j].chainId == chainId) {
          const e = cf_graphGateways[i].endpoints[j];
          for (let it = 0; it < e.endpoint.length; it++) {
            lst.push(e.endpoint[it]);
          }
        }
      }
    }
  }
  return lst;
};

export const dataFromWeb3 = (web3data: any): any => {
  return web3data.toString();
};

export const cogiIDFromChainid = (chainId: number): IEnpoint => {
  for (let i = 0; i < cf_cogiIds.length; i++) {
    if (cf_cogiIds[i].chainId == chainId) return cf_cogiIds[i];
  }
  return {
    chainId: 0,
    endpoint: "",
  };
};

export const endpointFromChainId = (chainId: number): IEnpoint => {
  for (let i = 0; i < cf_endpoints_NEMOWallet.length; i++) {
    if (cf_endpoints_NEMOWallet[i].chainId == chainId)
      return cf_endpoints_NEMOWallet[i];
  }
  return {
    chainId: 0,
    endpoint: "",
  };
};

export const endpointContractFromChainIdRpc = (
  endpoint: ENUM_ENDPOINT_RPC,
  chainId: number,
): IEnpoint | null => {
  if (endpoint == ENUM_ENDPOINT_RPC._NEMO_WALLET) {
    return endpointContractFromChainId(chainId);
  } else if (endpoint == ENUM_ENDPOINT_RPC._GALIXCITY) {
    return endpointContractFromChainIdGaliXCity(chainId);
  } else if (endpoint == ENUM_ENDPOINT_RPC._MECHA_WARFARE) {
    return endpointContractFromChainIdMecha_Warfare(chainId);
  } else if (endpoint == ENUM_ENDPOINT_RPC._9DNFT) {
    return endpointContractFromChainId9DNFT(chainId);
  }
  return null;
};

export const endpointContractFromChainId = (chainId: number): IEnpoint => {
  for (let i = 0; i < cf_endpoints_NEMOWallet.length; i++) {
    if (cf_endpoints_NEMOWallet[i].chainId == chainId)
      return cf_endpoints_NEMOWallet[i];
  }
  return {
    chainId: 0,
    endpoint: "",
  };
};

export const endpointContractFromChainIdGaliXCity = (
  chainId: number,
): IEnpoint => {
  for (let i = 0; i < cf_endpoints_GaliXCity.length; i++) {
    if (cf_endpoints_GaliXCity[i].chainId == chainId)
      return cf_endpoints_GaliXCity[i];
  }
  return {
    chainId: 0,
    endpoint: "",
  };
};

export const endpointContractFromChainIdMecha_Warfare = (
  chainId: number,
): IEnpoint => {
  for (let i = 0; i < cf_endpoints_MechaWarfare.length; i++) {
    if (cf_endpoints_MechaWarfare[i].chainId == chainId)
      return cf_endpoints_MechaWarfare[i];
  }
  return {
    chainId: 0,
    endpoint: "",
  };
};

export const endpointContractFromChainId9DNFT = (chainId: number): IEnpoint => {
  for (let i = 0; i < cf_endpoints_9DNFT.length; i++) {
    if (cf_endpoints_9DNFT[i].chainId == chainId) return cf_endpoints_9DNFT[i];
  }
  return {
    chainId: 0,
    endpoint: "",
  };
};

export const endpointAPIFetchFromChainId = (chainId: number): IEnpoint => {
  for (let i = 0; i < cf_endpointsAPIFetch.length; i++) {
    if (cf_endpointsAPIFetch[i].chainId == chainId)
      return cf_endpointsAPIFetch[i];
  }
  return {
    chainId: 0,
    endpoint: "",
  };
};

export const contractConfigFromAddress = (address: string | any): IContract => {
  const chainId = getChainId();
  for (let i = 0; i < contracts.length; i++) {
    if (
      (contracts[i].address == address ||
        contracts[i].address?.toLowerCase() == address) &&
      contracts[i].chainId == chainId
    )
      return contracts[i];
  }
  return {
    chainId: null,
    namespace: null,
    address: null,
    abi: null,
  };
};

export const contractConfigFromNamespace = (
  namespace: string | any,
): IContract => {
  const chainId = getChainId();
  for (let i = 0; i < contracts.length; i++) {
    if (contracts[i].namespace == namespace && contracts[i].chainId == chainId)
      return contracts[i];
  }
  return {
    chainId: null,
    namespace: null,
    address: null,
    abi: null,
  };
};

export const hotwalletConfigFromNamespace = (
  namespace: string | any,
): IHotwallet => {
  for (let i = 0; i < cf_hotwallets.length; i++) {
    if (cf_hotwallets[i].namespace == namespace) return cf_hotwallets[i];
  }
  return {
    namespace: null,
    contractNamespace: null,
    assetContractNamespace: null,
  };
};

export const balancesFromWalletSaga = (res: any | unknown): IBalanceData[] => {
  const ret: IBalanceData[] = [];
  for (const namespace in res) {
    const asset: IAssetData = assetFromNamespace(namespace);
    if (res[namespace].balanceOf == undefined) continue;
    ret.push({
      assetData: asset,
      balance: res[namespace].balanceOf,
    });
  }
  return ret;
};

export const balancesFromWalletSagaReceive = (
  res: any | unknown,
): IBalanceData[] => {
  const ret: IBalanceData[] = [];
  for (const namespace in res) {
    const asset: IAssetData = assetFromNamespaceReceive(namespace);
    if (res[namespace].balanceOf == undefined) continue;
    ret.push({
      assetData: asset,
      balance: res[namespace].balanceOf,
    });
  }
  return ret;
};

export const balancesINOFromWalletSaga = (
  res: any | unknown,
): IBalanceData[] => {
  const ret: IBalanceData[] = [];
  for (const namespace in res) {
    const asset: IAssetData = assetFromNamespaceINO(namespace);
    if (res[namespace].balanceOf == undefined) continue;
    ret.push({
      assetData: asset,
      balance: res[namespace].balanceOf,
    });
  }
  return ret;
};

export const balancesNEMOFromWalletSaga = (
  res: any | unknown,
): IBalanceData[] => {
  const ret: IBalanceData[] = [];
  for (const namespace in res) {
    const assetsNEMO: IAssetData = assetFromNamespaceINO(namespace);
    if (res[namespace].balanceOf == undefined) continue;
    ret.push({
      assetData: assetsNEMO,
      balance: res[namespace].balanceOf,
    });
  }
  return ret;
};

export const balancesFromHotwalletSaga = (
  res: any | unknown,
): IBalanceData[] => {
  const ret: IBalanceData[] = [];
  for (const namespace in res) {
    const h = hotwalletConfigFromNamespace(namespace);
    const asset: IAssetData = assetFromNamespace(h.assetContractNamespace);
    const b: Balance = cast<Balance>(res[namespace]);
    ret.push({
      assetData: asset,
      balance: b?.balance,
      avaiableBalance: b?.available_balance,
      pendingBalance: b?.pending_balance,
      hotwalletNamespace: namespace,
    });
  }
  return ret;
};

export const balancesTimeCountDownFromHotwalletSaga = (
  res: any | unknown,
): IBalanceDataCountDowwn[] => {
  const ret: IBalanceDataCountDowwn[] = [];
  for (const namespace in res) {
    const b: Balance = cast<Balance>(res[namespace]);
    ret.push({
      balance: b?.balance,
      hotwalletNamespace: namespace,
      timeCountDown: null,
      isEdit: false,
    });
  }
  return ret;
};

export const balancesFromNFT = (res: any | unknown): IBalanceData[] => {
  const ret: IBalanceData[] = [];
  for (const namespace in res) {
    const assets_NFT: IAssetDataNFT = assetFromNamespaceNFT(namespace);
    if (res[namespace].balanceOf == undefined) continue;
    ret.push({
      assetData: assets_NFT,
      balance: res[namespace].balanceOf,
    });
  }
  return ret;
};

export function assetFromNamespaceNFT(namespace: any | unknown): IAssetDataNFT {
  for (let i = 0; i < cf_assets_NFT.length; i++) {
    if (cf_assets_NFT[i].contractNamespace == namespace)
      return cf_assets_NFT[i];
  }
  return {
    symbol: "",
    name: "",
    decimals: 0,
    contractNamespace: "",
    contractBridge: "",
    icon: null,
    serviceID: null,
  };
}

export const transactionsFromHotwalletSaga = (
  res: any | unknown,
): ITransactionData[] => {
  const ret: ITransactionData[] = [];
  for (const namespace in res) {
    const h = hotwalletConfigFromNamespace(namespace);
    const asset: IAssetData = assetFromNamespace(h.assetContractNamespace);
    for (let i = 0; i < res[namespace]?.length; i++) {
      const tx: Transaction = cast<Transaction>(res[namespace][i]);
      if (!tx.method) continue;
      ret.push({
        hash: tx.hash,
        sender_or_receiver: tx.sender_or_receiver,
        kind: tx.kind,
        timestamp: tx.timestamp,
        method: tx.method,
        amount: tx.amount,
        status: tx.status,
        assetData: asset,
        hotwalletNamespace: namespace,
      });
    }
  }
  return sortBy(ret, "timestamp").reverse();
};

export function assetFromNamespace(namespace: any | unknown): IAssetData {
  for (let i = 0; i < Assets.length; i++) {
    if (Assets[i].contractNamespace == namespace) return Assets[i];
  }
  return {
    symbol: "",
    name: "",
    decimals: 0,
    contractNamespace: "",
    contractBridge: "",
    icon: null,
  };
}

export function assetFromNamespaceReceive(
  namespace: any | unknown,
): IAssetData {
  for (let i = 0; i < cf_assetsReceive.length; i++) {
    if (cf_assetsReceive[i].contractNamespace == namespace)
      return cf_assetsReceive[i];
  }
  return {
    symbol: "",
    name: "",
    decimals: 0,
    contractNamespace: "",
    contractBridge: "",
    icon: null,
  };
}

export function assetFromNamespaceINO(namespace: any | unknown): IAssetData {
  for (let i = 0; i < cf_assetsINO.length; i++) {
    if (cf_assetsINO[i].contractNamespace == namespace) return cf_assetsINO[i];
  }
  return {
    symbol: "",
    name: "",
    decimals: 0,
    contractNamespace: "",
    contractBridge: "",
    icon: null,
  };
}

export function explorerFromTxhashCogiChain(txHash: string): string {
  return (
    ChainConfig(ClassWithStaticMethod.NEMO_WALLET_CHAINID).explorer +
    "tx/" +
    txHash
  );
}

export function explorerFromTxhash(txHash: string, chain_Id = null): string {
  return ChainConfig(chain_Id).explorer + "tx/" + txHash;
}

export function blockCountDownToTime(
  block: any | unknown,
  chain_Id = null,
): number {
  return block * (ChainConfig(chain_Id)?.blockTime ?? 0);
}

export function explorerFromBlock(
  blockHeight: number,
  chain_Id = null,
): string {
  return ChainConfig(chain_Id).explorer + "block/" + blockHeight;
}

export function explorerFromTokenAndAddress(
  token: any | unknown,
  address: any | unknown,
  chain_Id = null,
): string {
  return ChainConfig(chain_Id).explorer + "token/" + token + "?a=" + address;
}

export function explorerFromAddress(
  address: any | unknown,
  chain_Id = null,
): string {
  return ChainConfig(chain_Id).explorer + "address/" + address;
}

export function explorerFromAddressCogiChain(address: any | unknown): string {
  return (
    ChainConfig(ClassWithStaticMethod.NEMO_WALLET_CHAINID).explorer +
    "address/" +
    address
  );
}

export function explorerFromTx(address: any | unknown): string {
  return ChainConfig().explorer + "tx/" + address;
}

export function explorerFromTxCogiChain(address: any | unknown): string {
  return (
    ChainConfig(ClassWithStaticMethod.NEMO_WALLET_CHAINID).explorer +
    "tx/" +
    address
  );
}

export const balancesFromWalletSaga_ZAP = (
  res: any | unknown,
): IBalanceData[] => {
  const ret: IBalanceData[] = [];
  for (const namespace in res) {
    const asset: IAssetData = assetFromNamespace_ZAP(namespace);
    if (res[namespace].balanceOf == undefined) continue;
    ret.push({
      assetData: asset,
      balance: res[namespace].balanceOf,
    });
  }
  return ret;
};
export const balancesFromWalletSaga_ZAPMetmask = (
  res: any | unknown,
): IBalanceData[] => {
  const ret: IBalanceData[] = [];
  for (const namespace in res) {
    const asset: IAssetData = assetFromNamespace_ZAPMetamask(namespace);
    if (res[namespace].balanceOf == undefined) continue;
    ret.push({
      assetData: asset,
      balance: res[namespace].balanceOf,
    });
  }
  return ret;
};

export const balancesFromHotwalletSaga_ZAP = (
  res: any | unknown,
): IBalanceData[] => {
  const ret: IBalanceData[] = [];
  for (const namespace in res) {
    const h = hotwalletConfigFromNamespace(namespace);
    const asset: IAssetData = assetFromNamespace_ZAP(h.assetContractNamespace);
    const b: Balance = cast<Balance>(res[namespace]);
    ret.push({
      assetData: asset,
      balance: b.balance,
      avaiableBalance: b.available_balance,
      pendingBalance: b.pending_balance,
      hotwalletNamespace: namespace,
    });
  }
  return ret;
};

export function assetFromNamespace_ZAP(namespace: any | unknown): IAssetData {
  for (let i = 0; i < cf_assetsZap.length; i++) {
    if (cf_assetsZap[i].contractNamespace == namespace) return cf_assetsZap[i];
  }
  return {
    symbol: "",
    name: "",
    decimals: 0,
    contractNamespace: "",
    icon: null,
  };
}

export function assetFromNamespace_ZAPMetamask(
  namespace: any | unknown,
): IAssetData {
  for (let i = 0; i < cf_assetsZapMetmask.length; i++) {
    if (cf_assetsZapMetmask[i].contractNamespace == namespace)
      return cf_assetsZapMetmask[i];
  }
  return {
    symbol: "",
    name: "",
    decimals: 0,
    contractNamespace: "",
    icon: null,
  };
}

export const getCollectionByType = (type: string, service_id: string): any => {
  const chainId = getChainId();
  const collection = Collections.find(
    (e: any) =>
      e.metadataNftType.toLowerCase() == type.toLowerCase() &&
      e.serviceID == service_id,
  );
  if (collection) {
    for (let i = 0; i < contracts.length; i++) {
      if (
        contracts[i].namespace == collection.contractNamespace &&
        contracts[i].chainId == chainId &&
        contracts[i].service_id == service_id
      )
        return contracts[i].address?.toLowerCase();
    }
  }
  return "";
};

export const collectionsAddressFromSlugs = (
  slugs: string[],
  serviceID: string | number,
): string[] => {
  const ret: string[] = [];
  for (let i = 0; i < Collections.length; i++) {
    if (
      slugs.some(
        (e) => e.toLowerCase() == Collections[i].slug?.toLowerCase(),
      ) &&
      Collections[i].serviceID == serviceID
    ) {
      const c = contractConfigFromNamespace(Collections[i].contractNamespace);
      if (c.address != null) {
        ret.push(c.address);
      }
    }
  }
  return ret;
};

export const getNameNetWork = (chainID: number): any => {
  let res: any = "";
  for (let i = 0; i < cf_Chains.length; i++) {
    if (cf_Chains[i].chainId == chainID) return (res = cf_Chains[i].name);
  }
  return res;
};

export const collectionFromAddress = (address: string): ICollection => {
  for (let i = 0; i < Collections.length; i++) {
    if (
      address ==
      contractConfigFromNamespace(
        Collections[i].contractNamespace,
      )?.address?.toLowerCase()
    ) {
      return Collections[i];
    }
  }
  return {
    name: null,
    symbol: null,
    contractNamespace: null,
    icon: null,
    isBurnToUse: false,
    serviceID: null,
  };
};

export const getContractNamespace = (
  market: IMarket,
  serviceID: number | string,
): any => {
  if (serviceID == SERVICE_ID._GALIXCITY) return market.contractNamespace_Galix;
  else if (serviceID == SERVICE_ID._9DNFT)
    return market.contractNamespace_9DNFT;
  else if (serviceID == SERVICE_ID._SOUL_REALM)
    return market.contractNamespace_SoulRealm;
  else if (serviceID == SERVICE_ID._MARSWAR)
    return market.contractNamespace_Marswar;
  else if (serviceID == SERVICE_ID._NARUTO)
    return market.contractNamespace_Naruto;
  else if (serviceID == SERVICE_ID._FLASHPOINT)
    return market.contractNamespace_Flashpoint;
  else if (serviceID == SERVICE_ID._RICHWORK_FARM_FAMILY)
    return market.contractNamespace_RichWorkFamily;
  return "";
};

export const getOwnerAccount = (flagCogiChain = false): any => {
  const store = appState();
  const accountWeb = store?.account?.dataAccount;
  const account = store?.wallet?.address;
  if (flagCogiChain) {
    return descyptNEMOWallet(accountWeb?.nemo_address?.toLowerCase());
  }
  if (
    ClassWithStaticMethod.STATIC_DEFAULT_CHAINID ==
    ClassWithStaticMethod.NEMO_WALLET_CHAINID
  )
    return descyptNEMOWallet(accountWeb?.nemo_address?.toLowerCase());
  else {
    return account?.toLowerCase();
  }
};

export const getMarketCurrencyNamespace = (market: any | unknown): any => {
  if (
    ClassWithStaticMethod.STATIC_DEFAULT_CHAINID ==
    ClassWithStaticMethod.NEMO_WALLET_CHAINID
  ) {
    return market.currencyNamespaceCogi;
  } else {
    return market.currencyNamespace;
  }
};

export const getNetworkByChainID = (chainID: number): any => {
  let res;
  for (let i = 0; i < cf_Chains.length; i++) {
    if (cf_Chains[i].chainId == chainID) {
      res = cf_Chains[i];
      break;
    }
  }
  return res;
};

export const getAddressOwnerNFT = (nft: Nft): string => {
  if (!nft) return "";
  if (nft?.isTradable) {
    return nft?.seller?.id;
  } else {
    return nft?.owner?.id;
  }
};

export const getTitle = (serviceID: any, symbol: any) => {
  let temp = "";
  if (serviceID == SERVICE_ID._9DNFT) {
    switch (symbol) {
      case "ABOX":
        temp = `Open Ancient Box to get all the following items: 
          - Wood Dragon Order Chest (NFT) x1
          - Super Rare Tablet Box (NFT) x1
          - Sect Transfer Box (NFT) x1
          And have 10% chance to get special NEMO Chest
          - Golden NEMO Treasure (NFT) x1:  Open will randomly receive between 50 and 5,000 NEMO `;
        break;
      case "DBOX":
        temp = `Open Divine Box to get all the following items:
          - Water Spirit Piece Chest (NFT) x1 
          - Random God Beast Treasure (NFT) x1
          - Noble Outfit Piece Box (NFT) x1
          - Ancient Wheel Piece Chest (NFT) x1
          And have 10% chance to get special NEMO Chest
          - Diamond NEMO Random Chest (NFT) x1: Open will randomly receive between 100 and 10,000 NEMO`;
        break;
    }
  } else if (serviceID == SERVICE_ID._FLASHPOINT) {
    switch (symbol) {
      case "BABOX":
        temp = `Open will receive any 1 NFT with green quality, blue quality or purple quality`;
        break;
      case "GABOX":
        temp = `Open will receive any 1 NFT with purple quality or orange quality`;
        break;
      case "PPBOX":
        temp = `Open will receive any 1 NFT with orange quality or gold quality`;
        break;
    }
  } else if (serviceID == SERVICE_ID._MARSWAR) {
    switch (symbol) {
      case "N81MBOX":
        return (temp =
          "Open will definitely get 1 Medal (30 days) and 1 random Valarion.");
      case "N81PBOX":
        return (temp =
          "Open will definitely get 1 Medal (30 days), 1 Rare Valarion and 1 random Valarion.");
      case "N81SBOX":
        return (temp =
          "Open will definitely get 1 Medal (30 days), 1 Rare Valarion, 1 Elite Valarion and 1 random Valarion.");
    }
  }
  return temp;
};

export const getTotalBox = (serviceID: any, symbol: any, stage: any) => {
  if (serviceID == SERVICE_ID._9DNFT) {
    switch (symbol) {
      case "ABOX":
        return [80, 20, 80, 0, 100, 20, 80][stage];
        return [100, 20, 80, 0, 100, 20, 100][stage];
      case "DBOX":
        return [20, 5, 20, 0, 25, 5, 25][stage];
        return [25, 5, 20, 0, 25, 5, 25][stage];
    }
  } else if (serviceID == SERVICE_ID._FLASHPOINT) {
    switch (symbol) {
      case "BABOX":
        return [120, 0, 120, 0, 0, 0, 120][stage];
      // return [100, 20, 80, 0, 100, 20, 100][stage]
      case "GABOX":
        return [60, 0, 60, 0, 0, 0, 60][stage];
      // return [25, 5, 20, 0, 25, 5, 25][stage]
      case "PPBOX":
        return [30, 0, 30, 0, 0, 0, 30][stage];
      // return [25, 5, 20, 0, 25, 5, 25][stage]
    }
  } else if (serviceID == SERVICE_ID._MARSWAR) {
    switch (symbol) {
      case "N81SBOX":
        return [15, 5, 15, 0, 40, 5, 40][stage];
      // return [40, 5, 15, 0, 40, 5, 40][stage]
      case "N81PBOX":
        return [30, 10, 30, 0, 80, 10, 80][stage];
      // return [80, 10, 30, 0, 80, 10, 80][stage]
      case "N81MBOX":
        return [45, 15, 45, 0, 120, 15, 120][stage];
      // return [120, 15, 45, 0, 120, 15, 120][stage]
    }
  }
  return "";
};

export const getPlusButton = (e: any | string): any => {
  let value = e;
  const temp = parseInt(value);
  if (!isNaN(temp)) {
    value = (temp + 1).toString();
    return value;
  } else return value;
};

export const getMinusButton = (e: any | string): any => {
  let value = e;
  const temp = parseInt(value);
  if (!isNaN(temp) && temp > 1) {
    value = (temp - 1).toString();
    return value;
  } else return value;
};

export const getChainConnect = (): IChainData | null => {
  const chainId = ClassWithStaticMethod.STATIC_DEFAULT_CHAINID;
  for (let i = 0; i < cf_Chains.length; i++) {
    if (cf_Chains[i].chainId == chainId) return cf_Chains[i];
  }
  return null;
};

export const addAssetPerform = async (
  provider: any | unknown,
  asset: AssetInfo,
): Promise<any> => {
  let image = "";
  if (asset.symbol == "COGI") {
    image = IMAGE_COGI;
  } else if (asset.symbol == "COD") {
    image = IMAGE_COD;
  }
  providerCall(provider, "wallet_watchAsset", {
    type: "ERC20",
    options: {
      address: asset.address,
      symbol: asset.symbol,
      name: asset.name,
      image,
      decimals: 18,
    },
  }).catch((e) => {
    // eslint-disable-next-line no-console
    console.log(e);
  });
};
