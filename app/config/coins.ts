import { DEFAULT_CHAINID, PROD } from "../common/constants";

import { ICONS } from "../themes/theme";
import { type TYPE_DEPOSIT_WITHDRAW } from "../common/enum";
import { cf_assetsData } from "./assets";

const cf_coins = [
  {
    chainID: 5555,
    contract: "0xCD0195D773e1126e8ec4376e9B890DF4d97d6EcE",
    namespace: "gosu_coin",
    hot_wallet: "gosu_hotwallet",
    symbol: "GOSU",
    name: "GOSU Coin",
    decimals: 18,
    contractBridge: "erc20_bridge",
    native: false,
    offchain: true,
  },
  {
    chainID: 5555,
    contract: "0x1c753dD9955782aC974798A6f65dfFe03f217841",
    namespace: "nemo_coin",
    hot_wallet: "nemo_hotwallet",
    symbol: "NEMO",
    name: "NEMO Coin",
    decimals: 18,
    contractBridge: "erc20_bridge",
    native: false,
    offchain: true,
  },
  {
    chainID: 5555,
    contract: "0x6a4D0e491ddc2D817baF8Ea0AEA23A9b709d61B3",
    symbol: "USDT",
    namespace: "usdt_coin",
    name: "USDT Coin",
    decimals: 18,
    contractBridge: "erc20_bridge",
    native: false,
    offchain: false,
  },
  {
    chainID: 5555,
    contract: "0xe27ee69b15924685658B54D7f154452de26F5E2F",
    symbol: "COGI",
    namespace: "cogi_coin",
    name: "COGI Coin",
    decimals: 18,
    contractBridge: "erc20_bridge",
    native: true,
    offchain: false,
  },
  //
  {
    chainID: 76923,
    contract: "0xf538030Ba4B39E35A3576bD6698cfcc6AC34A81f",
    namespace: "nemo_coin",
    hot_wallet: "nemo_hotwallet",
    symbol: "NEMO",
    name: "NEMO Coin",
    decimals: 18,
    contractBridge: "erc20_bridge",
    native: false,
    offchain: true,
  },
  {
    chainID: 76923,
    contract: "0xaFE5A737968C1830B2A2b4062ce4B6763d4d8044",
    symbol: "USDT",
    namespace: "usdt_coin",
    name: "USDT Coin",
    decimals: 18,
    contractBridge: "erc20_bridge",
    native: false,
    offchain: false,
  },
  {
    chainID: 76923,
    contract: "0x6cB755C4B82e11e727C05f697c790FdBC4253957",
    symbol: "COGI",
    namespace: "cogi_coin",
    name: "COGI Coin",
    decimals: 18,
    contractBridge: "erc20_bridge",
    native: true,
    offchain: false,
  },
  //
  {
    chainID: 97,
    contract: "0xEb7e95513270F75c707ceD36B97bcFe7baCa10c6",
    namespace: "nemo_coin",
    symbol: "NEMO",
    name: "NEMO Coin",
    decimals: 18,
    contractBridge: "erc20_bridge",
    native: false,
    offchain: false,
  },
  {
    chainID: 97,
    contract: "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee",
    symbol: "USDT",
    namespace: "usdt_coin",
    name: "USDT Coin",
    decimals: 18,
    contractBridge: "erc20_bridge",
    native: false,
    offchain: false,
  },
  {
    chainID: 97,
    contract: "0x82f1ffCdB31433B63AA311295a69892EeBcdc2Bb",
    symbol: "COGI",
    namespace: "cogi_coin",
    name: "COGI Coin",
    decimals: 18,
    contractBridge: "erc20_bridge",
    native: false,
    offchain: false,
  },
  //
  {
    chainID: 56,
    contract: "0xf538030Ba4B39E35A3576bD6698cfcc6AC34A81f",
    namespace: "nemo_coin",
    symbol: "NEMO",
    name: "NEMO Coin",
    decimals: 18,
    contractBridge: "erc20_bridge",
    native: false,
    offchain: false,
  },
  {
    chainID: 56,
    contract: "0x55d398326f99059ff775485246999027b3197955",
    symbol: "USDT",
    namespace: "usdt_coin",
    name: "USDT Coin",
    decimals: 18,
    contractBridge: "erc20_bridge",
    native: false,
    offchain: false,
  },
  {
    chainID: 56,
    contract: "0x6cB755C4B82e11e727C05f697c790FdBC4253957",
    symbol: "COGI",
    namespace: "cogi_coin",
    name: "COGI Coin",
    decimals: 18,
    contractBridge: "erc20_bridge",
    native: false,
    offchain: false,
  },
  //
  // {
  //   chainID: 4,
  //   contract: '0xEb7e95513270F75c707ceD36B97bcFe7baCa10c6',
  //   namespace: 'nemo_coin',
  //   symbol: 'NEMO',
  //   name: 'NEMO Coin',
  //   decimals: 18,
  //   contractBridge: 'erc20_bridge',
  //   native: false,
  // },
  // {
  //   chainID: 4,
  //   contract: '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
  //   symbol: 'USDT',
  //   namespace: 'usdt_coin',
  //   name: 'USDT Coin',
  //   decimals: 18,
  //   contractBridge: 'erc20_bridge',
  //   native: false,
  // },
  // {
  //   chainID: 4,
  //   contract: '0x82f1ffCdB31433B63AA311295a69892EeBcdc2Bb',
  //   symbol: 'COGI',
  //   namespace: 'cogi_coin',
  //   name: 'COGI Coin',
  //   decimals: 18,
  //   contractBridge: 'erc20_bridge',
  //   native: false,
  // },
  //
  {
    chainID: 43113,
    contract: "0x3cd4787C6930942F67FD700e128906cFA3077643",
    namespace: "nemo_coin",
    symbol: "NEMO",
    name: "NEMO Coin",
    decimals: 18,
    contractBridge: "erc20_bridge",
    native: false,
    offchain: false,
  },
  {
    chainID: 43113,
    contract: "0x08a978a0399465621e667c49cd54cc874dc064eb",
    symbol: "USDT",
    namespace: "usdt_coin",
    name: "USDT Coin",
    decimals: 18,
    contractBridge: "erc20_bridge",
    native: false,
    offchain: false,
  },
  {
    chainID: 43113,
    contract: "0xf98ba93A9eeE2d532c54aEFb46d87466Ce8fD68C",
    symbol: "COGI",
    namespace: "cogi_coin",
    name: "COGI Coin",
    decimals: 18,
    contractBridge: "erc20_bridge",
    native: false,
    offchain: false,
  },
  //
  {
    chainID: 43114,
    contract: "0xf538030Ba4B39E35A3576bD6698cfcc6AC34A81f",
    namespace: "nemo_coin",
    symbol: "NEMO",
    name: "NEMO Coin",
    decimals: 18,
    contractBridge: "erc20_bridge",
    native: false,
    offchain: false,
  },
  {
    chainID: 43114,
    contract: "0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7",
    symbol: "USDT",
    namespace: "usdt_coin",
    name: "USDT Coin",
    decimals: 6,
    contractBridge: "erc20_bridge",
    native: false,
    offchain: false,
  },
  {
    chainID: 43114,
    contract: "0x6cB755C4B82e11e727C05f697c790FdBC4253957",
    symbol: "COGI",
    namespace: "cogi_coin",
    name: "COGI Coin",
    decimals: 18,
    contractBridge: "erc20_bridge",
    native: false,
    offchain: false,
  },
];

export default cf_coins;

export interface TokenInfo {
  id: string;
  name: string;
  symbol: string;
  logo: string | any;
  balance?: number;
  decimals?: number;
  native?: boolean;
  offchain?: boolean;
  common?: boolean;
  allowSwap?: boolean | any;
  typeDeposit_Withdraw?: TYPE_DEPOSIT_WITHDRAW[] | any;
  namespace?: any;
  contract?: any;
}

export type ChainTokens = Record<number, TokenInfo[]>;

export interface ChainInfo {
  id: number;
  name: string;
  logo: string;
}

export class ChainManager {
  private static readonly CHAINS: ChainInfo[] = [
    {
      id: DEFAULT_CHAINID,
      name: "COGI Chain",
      logo: "/tokens/cogi.png",
    },
    // {
    //   id: 1,
    //   name: 'Ethereum',
    //   logo: '/ethereum.png'
    // },
  ];

  public static list(): ChainInfo[] {
    return this.CHAINS;
  }
}

export const TOKENS = {
  cogi: PROD
    ? "0x6cB755C4B82e11e727C05f697c790FdBC4253957"
    : "0xe27ee69b15924685658B54D7f154452de26F5E2F",
  nemo: PROD
    ? "0xf538030Ba4B39E35A3576bD6698cfcc6AC34A81f"
    : "0x1c753dD9955782aC974798A6f65dfFe03f217841",
  usdt: PROD
    ? "0xaFE5A737968C1830B2A2b4062ce4B6763d4d8044"
    : "0x6a4D0e491ddc2D817baF8Ea0AEA23A9b709d61B3",
};

export class TokenManager {
  private static readonly TOKENS: ChainTokens = {
    [DEFAULT_CHAINID]: cf_coins
      .filter((e: any) => e.chainID == DEFAULT_CHAINID)
      .map((e: any) => {
        return {
          id: e.contract,
          name: e.name,
          symbol: e.symbol,
          decimals: e.decimal,
          logo: ICONS[e.symbol.toLowerCase()],
          native: e.native,
          offchain: e.offchain,
          common: e.common,
          contract: e.contract,
          allowSwap: cf_assetsData.find((v) => v.symbol == e.symbol)?.allowSwap,
          typeDeposit_Withdraw: cf_assetsData.find((v) => v.symbol == e.symbol)
            ?.typeDeposit_Withdraw,
          namespace: e.namespace,
        };
      }),
  };

  public static list(chainId: number): TokenInfo[] {
    return this.TOKENS[chainId];
  }

  public static getToken(chainId: number, tokenId: string): TokenInfo | null {
    const tokens = this.TOKENS[chainId] || [];
    const found = tokens.filter((i) => i.id === tokenId);
    return found.length > 0 ? found[0] : null;
  }
}
