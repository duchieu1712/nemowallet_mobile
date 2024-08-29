import { utils } from "ethers";

import GalixERC20AbiJson from "../../galix_abi_docs/abi/GalixERC20.abi.json";

import GalixERC20HotWalletAbiJson from "../../galix_abi_docs/abi/GalixERC20HotWallet.abi.json";

import GalixERC721AbiJson from "../../galix_abi_docs/abi/GalixERC721.abi.json";

import OPSERC721AbiJson from "../../galix_abi_docs/abi/OPSERC721.abi.json";

import GalixERC721MarketAbiJson from "../../galix_abi_docs/abi/GalixERC721Market.abi.json";

import GalixStakingPoolAbiJson from "../../galix_abi_docs/abi/GalixStakingPool.abi.json";

import GalixZapPoolAbiJson from "../../galix_abi_docs/abi/GalixZapPool.abi.json";

import GalixERC721LandAbiJson from "../../galix_abi_docs/abi/GalixERC721Land.abi.json";

import KogiINOMarketAbiJson from "../../galix_abi_docs/abi/GalixINOMarket.abi.json";

import GalixERC721LandRentAbiJson from "../../galix_abi_docs/abi/GalixERC721LandRent.abi.json";

import GalixBridgeAbiJson from "../../galix_abi_docs/abi/GalixBridge.abi.json";

import GalixBridgeWithSupportingAbiJson from "../../galix_abi_docs/abi/GalixBridgeWithSupporting.abi.json";

import GalixSimpleEarnAbiJson from "../../galix_abi_docs/abi/GalixSimpleEarn.abi.json";
const GalixERC20AbiIface = new utils.Interface(GalixERC20AbiJson);
export const GalixERC20Abi = GalixERC20AbiIface.format(utils.FormatTypes.full);
const GalixERC20HotWalletIface = new utils.Interface(
  GalixERC20HotWalletAbiJson,
);
export const GalixERC20HotWalletAbi = GalixERC20HotWalletIface.format(
  utils.FormatTypes.full,
);
const GalixERC721Iface = new utils.Interface(GalixERC721AbiJson);
export const GalixERC721Abi = GalixERC721Iface.format(utils.FormatTypes.full);
const GalixERC721MarketIface = new utils.Interface(GalixERC721MarketAbiJson);
export const GalixERC721MarketAbi = GalixERC721MarketIface.format(
  utils.FormatTypes.full,
);
const GalixStakingPoolIface = new utils.Interface(GalixStakingPoolAbiJson);
export const GalixStakingPoolAbi = GalixStakingPoolIface.format(
  utils.FormatTypes.full,
);
const GalixZapPoolIface = new utils.Interface(GalixZapPoolAbiJson);
export const GalixZapPoolAbi = GalixZapPoolIface.format(utils.FormatTypes.full);
const GalixERC721LandIface = new utils.Interface(GalixERC721LandAbiJson);
export const GalixERC721LandIfaceAbi = GalixERC721LandIface.format(
  utils.FormatTypes.full,
);
const KogiINOMarketIface = new utils.Interface(KogiINOMarketAbiJson);
export const KogiINOMarketAbi = KogiINOMarketIface.format(
  utils.FormatTypes.full,
);
const GalixERC721LandRentIface = new utils.Interface(
  GalixERC721LandRentAbiJson,
);
export const GalixERC721LandRentAbi = GalixERC721LandRentIface.format(
  utils.FormatTypes.full,
);
const GalixBridgeIface = new utils.Interface(GalixBridgeAbiJson);
export const GalixBridgeAbi = GalixBridgeIface.format(utils.FormatTypes.full);
const GalixBridgeWithSupportingIface = new utils.Interface(
  GalixBridgeWithSupportingAbiJson,
);
export const GalixBridgeWithSupportingAbi =
  GalixBridgeWithSupportingIface.format(utils.FormatTypes.full);
const GalixSimpleEarnIface = new utils.Interface(GalixSimpleEarnAbiJson);
export const GalixSimpleEarnAbi = GalixSimpleEarnIface.format(
  utils.FormatTypes.full,
);

//
const OPSERC721Iface = new utils.Interface(OPSERC721AbiJson);
export const OPSERC721Abi = OPSERC721Iface.format(utils.FormatTypes.full);
