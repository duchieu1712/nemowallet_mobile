import { type IChainData } from "../common/types";

const cf_Chains: IChainData[] = [
  {
    name: "Testnet Avalanche C-Chain",
    shortName: "avax",
    chain: "smartchain",
    network: "testnet",
    chainId: 43113,
    networkId: 43113,
    rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
    blockTime: 3,
    explorer: "https://testnet.snowtrace.io/",
    nativeCurrency: {
      symbol: "AVAX",
      name: "AVAX",
      decimals: 18,
      contractNamespace: "",
    },
  },
  {
    name: "BNB Smart Chain Testnet",
    shortName: "bsc",
    chain: "smartchain",
    network: "testnet",
    chainId: 97,
    networkId: 97,
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    blockTime: 3,
    explorer: "https://testnet.bscscan.com/",
    nativeCurrency: {
      symbol: "BNB",
      name: "BNB",
      decimals: 18,
      contractNamespace: "",
    },
  },
];

export default cf_Chains;
