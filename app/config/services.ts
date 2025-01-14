// import { IGraphGateway } from '../common/types'

import { NFTS_INDEX, SERVICE_ID } from "../common/enum";

import { IMAGES } from "../themes/theme";

export const cf_services = [
  {
    serviceID: SERVICE_ID._OPS_ALPHA,
    serviceName: "Scan Root",
    image: "FlashPoint.png",
    logoGame: require("../assets/images/images_copy/games/ops.png"),
    linkHomePage: "",
    linkCHPlay: "",
    linkIOS: "",
    desciption: "Scan root",
    isComingSoon: false,
    isActiveMarketplace: true,
    isActive: true,
    isActiveINO: false,
    image_select: require("../assets/images/images_n69/mysterybox/Select-9DNFT.png"),
    productBG: require("../assets/images/images_n69/nfts/games/9dnft.png"),
  },
  {
    serviceID: SERVICE_ID._9DNFT,
    serviceName: "9D NFT",
    image: "9D_NFT.png",
    linkHomePage: "https://9dnft.com/",
    linkCHPlay:
      "https://play.google.com/store/apps/details?id=com.cogi.ninesun&hl=vi&gl=US",
    linkIOS: "",
    desciption: "Swordsman, MMORPG, 3D",
    isComingSoon: false,
    isActiveMarketplace: true,
    isActive: true,
    isActiveINO: true,
    logoGame: require("../assets/images/images_copy/games/9dnft.png"),
    image_select: require("../assets/images/images_n69/mysterybox/Select-9DNFT.png"),
    productBG: require("../assets/images/images_n69/nfts/games/9dnft.png"),
  },
  {
    serviceID: SERVICE_ID._GALIXCITY,
    serviceName: "GaliXCity",
    image: "GaliXCity.png",
    linkHomePage: "https://galixcity.io/",
    linkCHPlay:
      "https://play.google.com/store/apps/details?id=com.galix.city&hl=en_US&gl=US",
    linkIOS: "",
    desciption: "Strategy, SLG, 3D, Cyber",
    isComingSoon: false,
    isActiveMarketplace: true,
    isActive: true,
    isActiveINO: true,
    logoGame: require("../assets/images/images_copy/games/galixcity.png"),
    image_select: require("../assets/images/images_n69/mysterybox/Select-Galix.png"),
    productBG: require("../assets/images/images_n69/nfts/games/galixcity.png"),
  },
  {
    serviceID: SERVICE_ID._SOUL_REALM,
    serviceName: "Soul Realm",
    image: "Soul Realm.png",
    linkHomePage: "https://soulrealm.nemoverse.io/",
    linkCHPlay: "https://play.google.com/store/apps/details?id=com.soul.realm",
    linkIOS: "https://soulrealm.nemoverse.io/ios",
    desciption: "MMORPG, 3D, Myth",
    isComingSoon: false,
    isActiveMarketplace: true,
    isActive: true,
    isActiveINO: false,
    logoGame: require("../assets/images/images_copy/games/soulrrealm.png"),
    image_select: require("../assets/images/images_n69/mysterybox/Select-Galix.png"),
    productBG: require("../assets/images/images_n69/nfts/games/soulrealm.png"),
  },
  // {
  //   serviceID: SERVICE_ID._HEAVEN_SWORD,
  //   serviceName: "Heaven Sword",
  //   image: "Heaven_Sword.png",
  //   linkHomePage: "",
  //   linkCHPlay: "",
  //   linkIOS: "",
  //   desciption: "MMORPG, 3D, Myth",
  //   isComingSoon: false,
  //   isActiveMarketplace: false,
  //   isActive: false,
  //   isActiveINO: false,
  //   logoGame: require("../assets/images/images_copy/games/heavensword.png"),
  //   image_select: require("../assets/images/images_n69/mysterybox/Select-Heaven.png"),
  //   productBG: require("../assets/images/images_n69/nfts/games/heavensword.png"),
  // },
  {
    serviceID: SERVICE_ID._MARSWAR,
    serviceName: "Mecha Warfare",
    image: "Mecha Warfare.png",
    linkHomePage: "https://mecha.nemoverse.io/",
    linkCHPlay: "",
    linkIOS: "",
    desciption: "Turnbase, 3D, Gundam",
    isComingSoon: false,
    isActiveMarketplace: true,
    isActive: true,
    isActiveINO: true,
    logoGame: require("../assets/images/images_copy/games/mechawarfare.png"),
    image_select: require("../assets/images/images_n69/mysterybox/Select-Mecha.png"),
    productBG: require("../assets/images/images_n69/nfts/games/mechawarfare.png"),
  },
  // {
  //   serviceID: SERVICE_ID._NARUTO,
  //   serviceName: "Naruto",
  //   image: "Naruto.png",
  //   linkHomePage: "",
  //   linkCHPlay: "",
  //   linkIOS: "",
  //   desciption: "Turnbase, 3D, Gundam",
  //   isComingSoon: false,
  //   isActiveMarketplace: false,
  //   isActive: false,
  //   isActiveINO: false,
  //   logoGame: require("../assets/images/images_copy/games/naruto.png"),
  //   image_select: require("../assets/images/images_n69/mysterybox/Select-Naruto.png"),
  //   productBG: require("../assets/images/images_n69/nfts/games/naruto.png"),
  // },
  {
    serviceID: SERVICE_ID._RICHWORK_FARM_FAMILY,
    serviceName: "Richwork Farm Family",
    image: "GaliXCity.png",
    linkHomePage: "",
    linkCHPlay: "",
    linkIOS: "",
    desciption: "Strategy, SLG, 3D, Cyber",
    isComingSoon: false,
    isActiveMarketplace: true,
    isActive: false,
    isActiveINO: false,
    logoGame: require("../assets/images/images_copy/games/richworkfarmfamily.png"),
    image_select: require("../assets/images/images_n69/mysterybox/Select-Galix.png"),
    productBG: require("../assets/images/images_n69/nfts/games/RichworkFarmFamily.png"),
  },
  {
    serviceID: SERVICE_ID._FLASHPOINT,
    serviceName: "FlashPoint",
    image: "FlashPoint.png",
    linkHomePage: "",
    linkCHPlay: "",
    linkIOS: "",
    desciption: "FPS, 3D, Gunfight",
    isComingSoon: false,
    isActiveMarketplace: true,
    isActive: true,
    isActiveINO: true,
    logoGame: require("../assets/images/images_copy/games/flashpoint.png"),
    image_select: require("../assets/images/images_n69/mysterybox/1Select-FlashPoint.png"),
    productBG: require("../assets/images/images_n69/nfts/games/Flashpoint.png"),
  },
];

export const events = [
  {
    title: "event.mystery_box",
    fullName: "Myster Box",
    description: "event.event_descrip",
    image: IMAGES.mysteryBox,
    textButton: "event.go_now",
    linkNavigation: "MysteryBoxScreen",
  },
  {
    title: "event.land_portal",
    fullName: "Land Portal",
    description: "event.event_descrip",
    image: IMAGES.land,
    textButton: "event.go_now",
    linkNavigation: "LandPortalScreen",
  },
  {
    title: "event.staking",
    fullName: "Staking",
    description: "event.event_descrip",
    image: IMAGES.staking,
    textButton: "event.stake_now",
    linkNavigation: "StakingScreen",
  },
  {
    title: "event.topup",
    fullName: "Topup",
    description: "event.topup_descrip",
    image: IMAGES.nemo_big,
    textButton: "event.buy_now",
    url: "https://topup.nemoverse.io/",
    linkNavigation: "",
  },
];

export const cf_notShowFilter = [NFTS_INDEX._DASHBOARD, NFTS_INDEX._TXNFTS];
