import { type IChainData } from "../common/types";

const cf_Chains: IChainData[] = [
  {
    name: "Testnet Avalanche C-Chain",
    shortName: "avax_testnet",
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
    name: "Avalanche C-Chain",
    shortName: "avax",
    chain: "smartchain",
    network: "mainnet",
    chainId: 43114,
    networkId: 43114,
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    blockTime: 3,
    explorer: "https://snowtrace.io/",
    nativeCurrency: {
      symbol: "AVAX",
      name: "AVAX",
      decimals: 18,
      contractNamespace: "",
    },
  },
  {
    name: "BNB Smart Chain",
    shortName: "bsc",
    chain: "smartchain",
    network: "mainnet",
    chainId: 56,
    networkId: 56,
    rpcUrl: "https://bsc-dataseed.binance.org",
    blockTime: 3,
    explorer: "https://bscscan.com/",
    nativeCurrency: {
      symbol: "BNB",
      name: "BNB",
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
  {
    name: "COGI Chain TESTNET",
    shortName: "cogi",
    chain: "smartchain",
    network: "testnet",
    chainId: 5555,
    networkId: 5555,
    rpcUrl: "",
    blockTime: 3,
    explorer: "https://testnet.cogiscan.io/",
    nativeCurrency: {
      symbol: "COGI",
      name: "COGI",
      decimals: 18,
      contractNamespace: "",
    },
  },
  {
    name: "COGI Chain",
    shortName: "cogi",
    chain: "smartchain",
    network: "mainnet",
    chainId: 76923,
    networkId: 76923,
    rpcUrl: "",
    blockTime: 3,
    explorer: "https://cogiscan.io/",
    nativeCurrency: {
      symbol: "COGI",
      name: "COGI",
      decimals: 18,
      contractNamespace: "",
    },
  },
  // {
  //   name: 'Rinkeby Testnet',
  //   shortName: 'rinkeby',
  //   chain: 'smartchain',
  //   network: 'testnet',
  //   chainId: 4,
  //   networkId: 4,
  //   rpcUrl: 'https://rpc.ankr.com/eth_rinkeby',
  //   blockTime: 13,
  //   explorer: 'https://rinkeby.etherscan.io/',
  //   nativeCurrency: {
  //     symbol: 'ETH',
  //     name: 'ETH',
  //     decimals: 18,
  //     contractNamespace: '',
  //   },
  // },
  // {
  //   name: 'Ethereum Mainnet',
  //   shortName: 'eth',
  //   chain: 'smartchain',
  //   network: 'mainnet',
  //   chainId: 1,
  //   networkId: 1,
  //   rpcUrl: 'https://rpc.ankr.com/eth',
  //   blockTime: 13,
  //   explorer: 'https://etherscan.io/',
  //   nativeCurrency: {
  //     symbol: 'ETH',
  //     name: 'ETH',
  //     decimals: 18,
  //     contractNamespace: '',
  //   },
  // },
];

export default cf_Chains;

export const ChainsWallet = [
  {
    name: "COGI Chain TESTNET",
    shortName: "cogi",
    chain: "smartchain",
    network: "testnet",
    chainId: 5555,
    networkId: 5555,
    rpcUrl: "",
    blockTime: 3,
    explorer: "https://testnet.cogiscan.io/",
    nativeCurrency: {
      symbol: "COGI",
      name: "COGI",
      decimals: 18,
      contractNamespace: "",
    },
  },
  {
    name: "COGI Chain",
    shortName: "cogi",
    chain: "smartchain",
    network: "mainnet",
    chainId: 76923,
    networkId: 76923,
    rpcUrl: "",
    blockTime: 3,
    explorer: "https://cogiscan.io/",
    nativeCurrency: {
      symbol: "COGI",
      name: "COGI",
      decimals: 18,
      contractNamespace: "",
    },
  },
];
