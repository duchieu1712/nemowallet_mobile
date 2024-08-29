import { ENUM_ENDPOINT_RPC, SERVICE_ID } from "../../common/enum";
import {
  GAMES_AVATAR,
  MYSTERY_BOX_9D,
  MYSTERY_BOX_9D_BG,
  MYSTERY_BOX_FP,
  MYSTERY_BOX_FP_BG,
  MYSTERY_BOX_GALIX,
  MYSTERY_BOX_GALIX_BG,
  MYSTERY_BOX_MECHA,
  MYSTERY_BOX_MECHA_BG,
} from "../../themes/theme";
import {
  getBGColorFromSymbol9DNFT,
  getBGColorFromSymbolFLASHPOINT,
  getBGColorFromSymbolGalix,
  getBGColorFromSymbolMechaWarfare,
} from "../../common/utilities";

import { cf_assetMysteryBoxs_9DNFT } from "./9dnft/box-mystery";
import { cf_assetMysteryBoxs_Flashpoint } from "./flashpoint/box-mystery";
import { cf_assetMysteryBoxs_Galix } from "./galix/box-mystery";
import { cf_assetMysteryBoxs_Mecha } from "./mecha_warfare/box-mystery";
import cf_rewards_mysterybox from "./galix/reward_mysterybox_galix";
import cf_rewards_mysterybox_9dnft from "./9dnft/reward_mysterybox_9dnft";
import cf_rewards_mysterybox_flashpoint from "./flashpoint/reward_mysterybox_flashpoint";
import cf_rewards_mysterybox_mecha from "./mecha_warfare/reward_mysterybox_mecha";

export const cf_BOX_DATA_CONFIG = [
  {
    serviceID: SERVICE_ID._9DNFT,
    serviceName: "9D NFT",
    logo: GAMES_AVATAR["9dnft"],
    image: MYSTERY_BOX_9D,
    box_bg: MYSTERY_BOX_9D_BG,
    contract: "erc721_9dnft_ino",
    assets: cf_assetMysteryBoxs_9DNFT,
    endpoint: ENUM_ENDPOINT_RPC._9DNFT,
    color_box: getBGColorFromSymbol9DNFT,
    reward: cf_rewards_mysterybox_9dnft,
    link_detail: "mysterybox_9dnft",
  },
  {
    serviceID: SERVICE_ID._FLASHPOINT,
    serviceName: "Flash Point",
    logo: GAMES_AVATAR.flashpoint,
    image: MYSTERY_BOX_FP,
    box_bg: MYSTERY_BOX_FP_BG,
    contract: "erc721_flashpoint_ino",
    assets: cf_assetMysteryBoxs_Flashpoint,
    endpoint: ENUM_ENDPOINT_RPC._FLASHPOINT,
    color_box: getBGColorFromSymbolFLASHPOINT,
    reward: cf_rewards_mysterybox_flashpoint,
    link_detail: "mysterybox_flashpoint",
  },
  {
    serviceID: SERVICE_ID._MARSWAR,
    serviceName: "Mecha Marswar",
    logo: GAMES_AVATAR.mechawarfare,
    image: MYSTERY_BOX_MECHA,
    box_bg: MYSTERY_BOX_MECHA_BG,
    contract: "erc721_marswar_ino",
    assets: cf_assetMysteryBoxs_Mecha,
    endpoint: ENUM_ENDPOINT_RPC._MECHA_WARFARE,
    color_box: getBGColorFromSymbolMechaWarfare,
    reward: cf_rewards_mysterybox_mecha,
    link_detail: "mysterybox_mecha",
  },
  {
    serviceID: SERVICE_ID._GALIXCITY,
    serviceName: "GaliXCity",
    logo: GAMES_AVATAR.galixcity,
    image: MYSTERY_BOX_GALIX,
    box_bg: MYSTERY_BOX_GALIX_BG,
    contract: "erc721_galixnft_ino",
    assets: cf_assetMysteryBoxs_Galix,
    endpoint: ENUM_ENDPOINT_RPC._GALIXCITY,
    color_box: getBGColorFromSymbolGalix,
    reward: cf_rewards_mysterybox,
    link_detail: "mysterybox_galix",
  },
];
