import { type IEnpoint, type IHotwallet } from "../common/types";

export const cf_endpoints_NEMOWallet: IEnpoint[] = [
  {
    chainId: 1344,
    endpoint: "http://127.0.0.1:5555/jsonrpc",
  },
  {
    chainId: 43113,
    endpoint: "https://rpc.nemoverse.io/nemo-wallet-testnet",
  },
  {
    chainId: 43114,
    endpoint: "https://rpc.nemoverse.io/nemo-wallet-testnet",
  },
  // BSC
  {
    chainId: 97,
    endpoint: "https://rpc-testnet.cogi.technology/bsc/jsonrpc",
  },
  {
    chainId: 56,
    endpoint: "https://rpc.nemoverse.io/nemo-wallet-testnet",
  },
  // COGI
  {
    chainId: 5555,
    endpoint: "https://rpc.nemoverse.io/nemo-wallet-testnet",
  },
  {
    chainId: 76923,
    endpoint: "https://rpc.nemoverse.io/nemo-wallet",
  },
];

export const cf_endpoints_GaliXCity: IEnpoint[] = [
  // COGI
  {
    chainId: 5555,
    endpoint: "https://rpc.nemoverse.io/galixcity-v2-testnet",
  },
  {
    chainId: 76923,
    endpoint: "https://rpc.nemoverse.io/galixcity-v2",
  },
];

export const cf_endpoints_MechaWarfare: IEnpoint[] = [
  // COGI
  {
    chainId: 5555,
    endpoint: "https://rpc.nemoverse.io/marswar-testnet",
  },
  {
    chainId: 76923,
    endpoint: "https://rpc.nemoverse.io/marswar",
  },
];

export const cf_endpoints_9DNFT: IEnpoint[] = [
  // COGI
  {
    chainId: 5555,
    endpoint: "https://rpc.nemoverse.io/9dnft-testnet",
  },
  {
    chainId: 76923,
    endpoint: "https://rpc.nemoverse.io/9dnft",
  },
];

export const cf_endpointsAPIFetch: IEnpoint[] = [
  // COGI
  {
    chainId: 5555,
    endpoint: "https://api.nemoverse.io/cogiscan-testnet/",
  },
  {
    chainId: 76923,
    endpoint: "https://api.nemoverse.io/cogiscan/",
  },
];

export const cf_hotwallets: IHotwallet[] = [
  {
    namespace: "nemo_hotwallet",
    contractNamespace: "erc20_bridge",
    assetContractNamespace: "nemo_coin",
  },
  {
    namespace: "gosu_hotwallet",
    contractNamespace: "erc20_bridge",
    assetContractNamespace: "gosu_coin",
  },
];

export const cf_hotwalletsReceiveToken: IHotwallet[] = [
  {
    namespace: "nemo_hotwallet",
    contractNamespace: "erc20_bridge",
    assetContractNamespace: "nemo_coin",
  },
  {
    namespace: "",
    contractNamespace: "erc20_bridge",
    assetContractNamespace: "cogi_coin",
  },
  {
    namespace: "",
    contractNamespace: "erc20_bridge",
    assetContractNamespace: "usdt_coin",
  },
];

export const cf_hotwalletsErc20: IHotwallet[] = [
  {
    namespace: "usdt_hotwallet",
    contractNamespace: "erc20_bridge",
    assetContractNamespace: "usdt_coin",
  },
];
