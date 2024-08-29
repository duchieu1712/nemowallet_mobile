import { type IMarket } from "../common/types";
import { toWei } from "../common/utilities";

const cf_market: IMarket = {
  contractNamespace: "erc721market_nft",
  contractNamespace_9DNFT: "erc721market_9dnft",
  contractNamespace_Galix: "erc721market_galixnft",
  contractNamespace_SoulRealm: "spiritland_erc721_market",
  contractNamespace_Marswar: "erc721_marswar_market",
  contractNamespace_Naruto: "naruto_erc721_market",
  contractNamespace_Flashpoint: "erc721market_flashpointnft",
  contractNamespace_RichWorkFamily: "erc721market_richworkfarmfamilynft",
  contractNamespace_renting_land: "erc721market_galix_renting_land",
  contractNamespace_staking: "erc20_staking",
  tokenNamespaceWhitelists: [
    "erc721_9dnft_hro",
    "erc721_9dnft_pet",
    "erc721_9dnft_petn",
    "erc721_9dnft_mnt",
    "erc721_9dnft_box",
    "erc721_9dnft_aeq",
    "erc721_9dnft_oeq",
    "erc721_9dnft_ueq",
    "erc721_9dnft_mat",
    "erc721_9dnft_gem",
  ],
  tokenPriceMin: [
    toWei("1")!.toString(),
    toWei("1")!.toString(),
    toWei("1")!.toString(),
    toWei("1")!.toString(),
    toWei("1")!.toString(),
    toWei("1")!.toString(),
    toWei("1")!.toString(),
    toWei("1")!.toString(),
    toWei("1")!.toString(),
    toWei("1")!.toString(),
  ],
  currencyNamespace: "cogi_coin",
  currencyNamespaceCogi: "nemo_coin",
};

export default cf_market;
