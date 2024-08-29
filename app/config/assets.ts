import { TYPE_DEPOSIT_WITHDRAW } from "../common/enum";
import { type IAssetData } from "../common/types";
import * as image from "../assets/images/images_n69/mywallet";

export const cf_assets: IAssetData[] = [
  {
    contractNamespace: "nemo_coin",
    contractBridge: "erc20_bridge",
    name: "NEMO Coin",
    symbol: "NEMO",
    decimals: 18,
    icon: image.img_nemo,
    icon_9d: image.img_nemo,
    native: false,
    allowSwap: true,
    typeDeposit_Withdraw: [
      TYPE_DEPOSIT_WITHDRAW._TYPE_WITHDRAW,
      TYPE_DEPOSIT_WITHDRAW._TYPE_DEPOSIT,
    ],
  },
  {
    contractNamespace: "usdt_coin",
    contractBridge: "erc20_bridge",
    name: "USDT Coin",
    symbol: "USDT",
    decimals: 18,
    icon: image.img_aUSDT,
    icon_9d: image.img_aUSDT,
    native: false,
    allowSwap: true,
    typeDeposit_Withdraw: [
      TYPE_DEPOSIT_WITHDRAW._TYPE_WITHDRAW,
      TYPE_DEPOSIT_WITHDRAW._TYPE_DEPOSIT,
    ],
  },
  {
    contractNamespace: "gosu_coin",
    contractBridge: "erc20_bridge",
    name: "GOSU Coin",
    symbol: "GOSU",
    decimals: 18,
    icon: image.img_gosu,
    icon_9d: image.img_gosu,
    native: false,
    allowSwap: false,
    typeDeposit_Withdraw: [TYPE_DEPOSIT_WITHDRAW._TYPE_WITHDRAW],
  },
];

export const cf_assetsData: IAssetData[] = [
  {
    contractNamespace: "nemo_coin",
    contractBridge: "erc20_bridge",
    name: "NEMO Coin",
    symbol: "NEMO",
    decimals: 18,
    icon: image.img_nemo,
    icon_9d: image.img_nemo,
    native: false,
    allowSwap: true,
    typeDeposit_Withdraw: [
      TYPE_DEPOSIT_WITHDRAW._TYPE_WITHDRAW,
      TYPE_DEPOSIT_WITHDRAW._TYPE_DEPOSIT,
    ],
  },
  {
    contractNamespace: "usdt_coin",
    contractBridge: "erc20_bridge",
    name: "USDT Coin",
    symbol: "USDT",
    decimals: 18,
    icon: image.img_aUSDT,
    icon_9d: image.img_aUSDT,
    native: false,
    allowSwap: true,
    typeDeposit_Withdraw: [
      TYPE_DEPOSIT_WITHDRAW._TYPE_WITHDRAW,
      TYPE_DEPOSIT_WITHDRAW._TYPE_DEPOSIT,
    ],
  },
  {
    contractNamespace: "gosu_coin",
    contractBridge: "erc20_bridge",
    name: "GOSU Coin",
    symbol: "GOSU",
    decimals: 18,
    icon: image.img_gosu,
    icon_9d: image.img_gosu,
    native: false,
    allowSwap: false,
    typeDeposit_Withdraw: [TYPE_DEPOSIT_WITHDRAW._TYPE_WITHDRAW],
  },
  {
    contractNamespace: "cogi_coin",
    contractBridge: "erc20_bridge",
    name: "COGI Coin",
    symbol: "COGI",
    decimals: 18,
    icon: image.img_cogi,
    icon_9d: image.img_cogi,
    native: true,
    allowSwap: false,
    // allowSwap: true,
    typeDeposit_Withdraw: [
      TYPE_DEPOSIT_WITHDRAW._TYPE_WITHDRAW,
      TYPE_DEPOSIT_WITHDRAW._TYPE_DEPOSIT,
    ],
  },
];

export const cf_assetsCoinNative: IAssetData = {
  contractNamespace: "cogi_coin",
  contractBridge: "erc20_bridge",
  name: "COGI Coin",
  symbol: "COGI",
  decimals: 18,
  icon: image.img_cogi,
  icon_9d: image.img_cogi,
  native: true,
  typeDeposit_Withdraw: [
    TYPE_DEPOSIT_WITHDRAW._TYPE_WITHDRAW,
    TYPE_DEPOSIT_WITHDRAW._TYPE_DEPOSIT,
  ],
};

export const cf_assetsINO: IAssetData[] = [
  {
    contractNamespace: "usdt_coin",
    contractBridge: "erc20_bridge",
    name: "USDT Coin",
    symbol: "USDT",
    decimals: 6,
    icon: image.img_aUSDT,
    icon_9d: image.img_aUSDT,
  },
  {
    contractNamespace: "erc721_galixnft_ticket",
    contractBridge: "erc20_bridge",
    name: "NEMO Ticket",
    symbol: "Ticket",
    decimals: 18,
    icon: image.img_ticket,
    icon_9d: image.img_ticket,
  },
];

export const cf_assetsReceive: IAssetData[] = [
  {
    contractNamespace: "usdt_coin",
    contractBridge: "erc20_bridge",
    name: "USDT Coin",
    symbol: "USDT",
    decimals: 18,
    icon: image.img_aUSDT,
    icon_9d: image.img_aUSDT,
  },
  {
    contractNamespace: "cogi_coin",
    contractBridge: "erc20_bridge",
    name: "COGI coin",
    symbol: "COGI",
    decimals: 18,
  },
  {
    contractNamespace: "nemo_coin",
    contractBridge: "erc20_bridge",
    name: "NEMO coin",
    symbol: "NEMO",
    decimals: 18,
  },
];
