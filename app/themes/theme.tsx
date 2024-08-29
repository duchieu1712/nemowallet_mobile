import { Dimensions, Text } from "react-native";

import LinearGradient from "react-native-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

const { width, height } = Dimensions.get("screen");

type THEMES = Record<string, any>;

export const COLORS = {
  primary: "#5142FC",
  primaryLight: "rgba(0,186,135,.15)",
  secondary: "#090A15",
  success: "#0ecb81",
  success_2: "#1EAF4E",
  success_3: "#03BF7A",
  sell: "#259242",
  success_4: "rgba(3, 191, 122, 0.30)",
  success_5: "#47a432",
  offer: "#CB1D2C",
  danger: "#ff4a5c",
  red: "#DF4949",
  info: "#627EEA",
  warning: "#E8A829",
  white: "#fff",
  dark: "#2f2f2f",
  light: "#E6E6E6",
  divider: "#7a798a81",
  placeholder: "#7A798A",
  yellow: "#E8A829",
  blue: "#05A9FC",
  neon: "#32F0FF",
  neon2: "#5EE2FE",
  transparent: "transparent",
  orange: "#FF5735",
  progress_bg: "#2B3062",
  dark_blue: "#4F6DC3",
  // light
  title: "#20212D",
  text: "#909090",
  background: "#e2e2e2",
  card: "#fff",
  border: "#7A798A",
  backgroundInput: "#1F222A",
  card2: "#ebebeb",
  notibar: "#fff",

  // dark
  darkTitle: "#fff",
  darkText: "#8A8AA0",
  darkBackground: "#181A20",
  darkCard: "#252731",
  darkBorder: "#252739",
  descriptionText: "#7A798A",
  greyBackground: "#1F222A",
  greySecondBg: "#181A20",
  borderColor: "#35383F",
  tabBarDark: "rgba(34, 36, 44, 0.85)",
  card2Dark: "#1a1c23",
  notibarDark: "#1F222A",

  // button
  buttonGrey: "#34383F",
  disabledBtn: "#343444",
  disbaledButton: "rgba(52, 52, 68, 0.5)",
};

export const SIZES = {
  font2Xl: 30,
  fontXl: 20,
  fontlg: 18,
  fontMd: 16,
  font: 14,
  fontSm: 13,
  fontXs: 12,
  radius: 10,
  radius_lg: 20,
  radius_sm: 6,

  // space
  padding: 15,
  margin: 15,

  // Font Sizes
  h1: 40,
  h2: 28,
  h3: 24,
  h4: 22,
  h5: 18,
  h6: 16,

  // App dimensions
  width,
  height,
  contentArea: {
    paddingTop: 70,
    paddingBottom: 150,
  },
};

export const FONTS = {
  font: {
    fontSize: SIZES.font,
    lineHeight: 20,
    // fontFamily: "UTM-Daxline"
  },
  fontSm: {
    fontSize: SIZES.fontSm,
    lineHeight: 18,
    // fontFamily: "UTM-Daxline"
  },
  fontXs: {
    fontSize: SIZES.fontXs,
    lineHeight: 14,
    // fontFamily: "UTM-Daxline"
  },
  h1: {
    fontSize: SIZES.h1,
    lineHeight: 48,
    color: COLORS.title,
    // fontFamily: "UTM-Daxline",
    fontWeight: "700",
  },
  h2: {
    fontSize: SIZES.h2,
    lineHeight: 32,
    color: COLORS.title,
    // fontFamily: "UTM-Daxline",
    fontWeight: "700",
  },
  h3: {
    fontSize: SIZES.h3,
    lineHeight: 28,
    color: COLORS.title,
    // fontFamily: "UTM-Daxline",
    fontWeight: "700",
  },
  h4: {
    fontSize: SIZES.h4,
    lineHeight: 26,
    color: COLORS.title,
    // fontFamily: "UTM-Daxline",
    fontWeight: "700",
  },
  h5: {
    fontSize: SIZES.h5,
    lineHeight: 24,
    color: COLORS.title,
    // fontFamily: "UTM-Daxline",
    fontWeight: "700",
  },
  h6: {
    fontSize: SIZES.h6,
    lineHeight: 20,
    color: COLORS.title,
    // fontFamily: "UTM-Daxline",
    fontWeight: "700",
  },

  fontMedium: {
    // fontFamily: "UTM-Daxline",
    fontWeight: "600",
  },
  fontBold: {
    // fontFamily: "UTM-Daxline",
    fontWeight: "700",
  },
  fontDefault: {
    // fontFamily: "UTM-Daxline"
  },
};

export const IMAGES: THEMES = {
  bg1: require("../assets/images/background/bg1.png"),
  bitcoin: require("../assets/images/coins/bitcoin.png"),
  ethereum: require("../assets/images/coins/eth.png"),
  ripple: require("../assets/images/coins/mer.png"),
  dash: require("../assets/images/coins/dash.png"),
  nem: require("../assets/images/coins/nem.png"),
  emc: require("../assets/images/coins/emc.png"),
  etp: require("../assets/images/coins/etp.png"),
  flux: require("../assets/images/coins/flux.png"),
  gdb: require("../assets/images/coins/gdb.png"),
  cdn: require("../assets/images/coins/cdn.png"),
  lun: require("../assets/images/coins/lun.png"),
  logo160x160: require("../assets/images/images_n69/COGI-ICO-Color.png"),
  background: require("../assets/images/images_n69/Background1.png"),
  backgroundWallet: require("../assets/images/images_n69/homepage/wallet.png"),
  avatar: require("../assets/images/images_n69/profile/avatar.png"),
  success: require("../assets/images/images_n69/homepage/success.png"),
  processing: require("../assets/images/images_n69/homepage/processing.png"),
  error: require("../assets/images/images_n69/component/perror.png"),
  defaultAvatart: require("../assets/images/images_n69/profile/default_avatar.png"),
  metamask: require("../assets/images/metamask.png"),
  wrong_network: require("../assets/images/img-network.png"),
  staking: require("../assets/images/images_n69/staking.png"),
  land: require("../assets/images/images_n69/Land/Land.png"),
  mysteryBox: require("../assets/images/images_n69/mysterybox/Box/GBOX.png"),
  no_data: require("../assets/images/images_copy/staking/no_data.png"),
  chart1_bg: require("../assets/images/images_n69/dashboard/chart.png"),
  chart1: require("../assets/images/images_n69/dashboard/status-up.png"),
  chart2_bg: require("../assets/images/images_n69/dashboard/chart-volume.png"),
  chart2: require("../assets/images/images_n69/dashboard/chart-2.png"),
  resource1: require("../assets/images/images_n69/resource/icon_resource1.png"),
  resource2: require("../assets/images/images_n69/resource/icon_resource2.png"),
  resource3: require("../assets/images/images_n69/resource/icon_resource3.png"),
  resource4: require("../assets/images/images_n69/resource/icon_resource4.png"),
  arrow_up: require("../assets/images/images_n69/landing/Vector.png"),
  earth: require("../assets/images/images_n69/landing/img-world.png"),
  common_bg: require("../assets/images/images_n69/landing/Subtract.png"),
  rare_bg: require("../assets/images/images_n69/landing/Subtract_1.png"),
  epic_bg: require("../assets/images/images_n69/landing/Subtract_2.png"),
  legend_bg: require("../assets/images/images_n69/landing/Subtract_3.png"),
  error_pc: require("../assets/images/images_n69/component/error.png"),
  nemo_big: require("../assets/images/images_n69/icon-nemo.png"),
};

export const STAR: THEMES = {
  hero_star: require("../assets/images/images_n69/star/hero_star.png"),
  hero_star_1: require("../assets/images/images_n69/star/hero_star_1.png"),
  hero_star_2: require("../assets/images/images_n69/star/hero_star_2.png"),
  hero_star_3: require("../assets/images/images_n69/star/hero_star_3.png"),
};

export const LANDS: THEMES = {
  land_level_1_1: require("../assets/images/images_n69/Land/Random/Land_Level_1_1.png"),
  land_level_1_2: require("../assets/images/images_n69/Land/Random/Land_Level_1_2.png"),
  land_level_1_3: require("../assets/images/images_n69/Land/Random/Land_Level_1_3.png"),
  land_level_1_4: require("../assets/images/images_n69/Land/Random/Land_Level_1_4.png"),
  land_level_1_5: require("../assets/images/images_n69/Land/Random/Land_Level_1_5.png"),

  land_level_2_1: require("../assets/images/images_n69/Land/Random/Land_Level_2_1.png"),
  land_level_2_2: require("../assets/images/images_n69/Land/Random/Land_Level_2_2.png"),
  land_level_2_3: require("../assets/images/images_n69/Land/Random/Land_Level_2_3.png"),
  land_level_2_4: require("../assets/images/images_n69/Land/Random/Land_Level_2_4.png"),
  land_level_2_5: require("../assets/images/images_n69/Land/Random/Land_Level_2_5.png"),

  land_level_3_1: require("../assets/images/images_n69/Land/Random/Land_Level_3_1.png"),
  land_level_3_2: require("../assets/images/images_n69/Land/Random/Land_Level_3_2.png"),
  land_level_3_3: require("../assets/images/images_n69/Land/Random/Land_Level_3_3.png"),
  land_level_3_4: require("../assets/images/images_n69/Land/Random/Land_Level_3_4.png"),
  land_level_3_5: require("../assets/images/images_n69/Land/Random/Land_Level_3_5.png"),

  land_level_4_1: require("../assets/images/images_n69/Land/Random/Land_Level_4_1.png"),
  land_level_4_2: require("../assets/images/images_n69/Land/Random/Land_Level_4_2.png"),
  land_level_4_3: require("../assets/images/images_n69/Land/Random/Land_Level_4_3.png"),
  land_level_4_4: require("../assets/images/images_n69/Land/Random/Land_Level_4_4.png"),
  land_level_4_5: require("../assets/images/images_n69/Land/Random/Land_Level_4_5.png"),

  land_level_5_1: require("../assets/images/images_n69/Land/Random/Land_Level_5_1.png"),
  land_level_5_2: require("../assets/images/images_n69/Land/Random/Land_Level_5_2.png"),
  land_level_5_3: require("../assets/images/images_n69/Land/Random/Land_Level_5_3.png"),
  land_level_5_4: require("../assets/images/images_n69/Land/Random/Land_Level_5_4.png"),
  land_level_5_5: require("../assets/images/images_n69/Land/Random/Land_Level_5_5.png"),

  land_level_6_1: require("../assets/images/images_n69/Land/Random/Land_Level_6_1.png"),
  land_level_6_2: require("../assets/images/images_n69/Land/Random/Land_Level_6_2.png"),
  land_level_6_3: require("../assets/images/images_n69/Land/Random/Land_Level_6_3.png"),
  land_level_6_4: require("../assets/images/images_n69/Land/Random/Land_Level_6_4.png"),
  land_level_6_5: require("../assets/images/images_n69/Land/Random/Land_Level_6_5.png"),

  land_level_7_1: require("../assets/images/images_n69/Land/Random/Land_Level_7_1.png"),
  land_level_7_2: require("../assets/images/images_n69/Land/Random/Land_Level_7_2.png"),
  land_level_7_3: require("../assets/images/images_n69/Land/Random/Land_Level_7_3.png"),
  land_level_7_4: require("../assets/images/images_n69/Land/Random/Land_Level_7_4.png"),
  land_level_7_5: require("../assets/images/images_n69/Land/Random/Land_Level_7_5.png"),

  land_level_8_1: require("../assets/images/images_n69/Land/Random/Land_Level_8_1.png"),
  land_level_8_2: require("../assets/images/images_n69/Land/Random/Land_Level_8_2.png"),
  land_level_8_3: require("../assets/images/images_n69/Land/Random/Land_Level_8_3.png"),
  land_level_8_4: require("../assets/images/images_n69/Land/Random/Land_Level_8_4.png"),
  land_level_8_5: require("../assets/images/images_n69/Land/Random/Land_Level_8_5.png"),

  land_level_9_1: require("../assets/images/images_n69/Land/Random/Land_Level_9_1.png"),
  land_level_9_2: require("../assets/images/images_n69/Land/Random/Land_Level_9_2.png"),
  land_level_9_3: require("../assets/images/images_n69/Land/Random/Land_Level_9_3.png"),
  land_level_9_4: require("../assets/images/images_n69/Land/Random/Land_Level_9_4.png"),
  land_level_9_5: require("../assets/images/images_n69/Land/Random/Land_Level_9_5.png"),
};

export const LAND_LEVEL: THEMES = {
  1: require("../assets/images/images_n69/Land/Land_Level_1.png"),
  2: require("../assets/images/images_n69/Land/Land_Level_2.png"),
  3: require("../assets/images/images_n69/Land/Land_Level_3.png"),
  4: require("../assets/images/images_n69/Land/Land_Level_4.png"),
  5: require("../assets/images/images_n69/Land/Land_Level_5.png"),
  6: require("../assets/images/images_n69/Land/Land_Level_6.png"),
  7: require("../assets/images/images_n69/Land/Land_Level_7.png"),
  8: require("../assets/images/images_n69/Land/Land_Level_8.png"),
};

export const MAP: THEMES = {
  land_lv1: require("../assets/images/images_n69/map/land_lv1.png"),
  land_lv2: require("../assets/images/images_n69/map/land_lv2.png"),
  land_lv3: require("../assets/images/images_n69/map/land_lv3.png"),
  land_lv4: require("../assets/images/images_n69/map/land_lv4.png"),
  land_lv5: require("../assets/images/images_n69/map/land_lv5.png"),
  land_lv6: require("../assets/images/images_n69/map/land_lv6.png"),
  land_lv7: require("../assets/images/images_n69/map/land_lv7.png"),
  land_lv8: require("../assets/images/images_n69/map/land_lv8.png"),
  land_locked_1: require("../assets/images/images_n69/map/land_locked_1.png"),
  land_locked_2: require("../assets/images/images_n69/map/land_locked_2.png"),
  land_unlocked: require("../assets/images/images_n69/map/land_unlocked.png"),
  zone_unit: require("../assets/images/images_n69/map/zone_unit.png"),
};

export const QUALITY: THEMES = {
  White: require("../assets/images/images_copy/quality/1.png"),
  Green: require("../assets/images/images_copy/quality/2.png"),
  Blue: require("../assets/images/images_copy/quality/3.png"),
  Violet: require("../assets/images/images_copy/quality/4.png"),
  Yellow: require("../assets/images/images_copy/quality/5.png"),
  Orange: require("../assets/images/images_copy/quality/6.png"),
  Red: require("../assets/images/images_copy/quality/7.png"),
  Platinum: require("../assets/images/images_copy/quality/8.png"),
  null: require("../assets/images/images_copy/quality/null.png"),
  White_big: require("../assets/images/images_copy/quality/1_big.png"),
  Green_big: require("../assets/images/images_copy/quality/2_big.png"),
  Blue_big: require("../assets/images/images_copy/quality/3_big.png"),
  Violet_big: require("../assets/images/images_copy/quality/4_big.png"),
  Yellow_big: require("../assets/images/images_copy/quality/5_big.png"),
  Orange_big: require("../assets/images/images_copy/quality/6_big.png"),
  Red_big: require("../assets/images/images_copy/quality/7_big.png"),
  Platinum_big: require("../assets/images/images_copy/quality/8_big.png"),
};

export const QUALITY_GALIX: THEMES = {
  "0-big": require("../assets/images/images_copy/quality/1_big.png"),
  "1-big": require("../assets/images/images_copy/quality/2_big.png"),
  "2-big": require("../assets/images/images_copy/quality/3_big.png"),
  "3-big": require("../assets/images/images_copy/quality/4_big.png"),
  "4-big": require("../assets/images/images_copy/quality/5_big.png"),
  "5-big": require("../assets/images/images_copy/quality/6_big.png"),
  "6-big": require("../assets/images/images_copy/quality/7_big.png"),
  "7-big": require("../assets/images/images_copy/quality/8_big.png"),
};

export const DASHBOARD_9D: THEMES = {
  White: require("../assets/images/images_copy/quality/dashboard/1.png"),
  Green: require("../assets/images/images_copy/quality/dashboard/2.png"),
  Blue: require("../assets/images/images_copy/quality/dashboard/3.png"),
  Violet: require("../assets/images/images_copy/quality/dashboard/4.png"),
  Yellow: require("../assets/images/images_copy/quality/dashboard/5.png"),
  Gold: require("../assets/images/images_copy/quality/dashboard/5.png"),
  Orange: require("../assets/images/images_copy/quality/dashboard/6.png"),
  Red: require("../assets/images/images_copy/quality/dashboard/7.png"),
  Platinum: require("../assets/images/images_copy/quality/dashboard/8.png"),
  null: require("../assets/images/images_copy/quality/null.png"),
};

export const MYSTERY_BOX_9D: THEMES = {
  ABOX: require("../assets/images/images_n69/mysterybox/Box_9DNFT/ABOX.png"),
  DBOX: require("../assets/images/images_n69/mysterybox/Box_9DNFT/DBOX.png"),
};
export const MYSTERY_BOX_9D_BG: THEMES = {
  ABOX: QUALITY.Red_big,
  DBOX: QUALITY.Red_big,
};
export const MYSTERY_BOX_GALIX: THEMES = {
  DBOX: require("../assets/images/images_n69/mysterybox/Box/DBOX.png"),
  GBOX: require("../assets/images/images_n69/mysterybox/Box/GBOX.png"),
  PBOX: require("../assets/images/images_n69/mysterybox/Box/PBOX.png"),
};
export const MYSTERY_BOX_GALIX_BG: THEMES = {
  DBOX: QUALITY.Blue_big,
  GBOX: QUALITY.Violet_big,
  PBOX: QUALITY.Red_big,
};

export const MYSTERY_BOX_MECHA: THEMES = {
  N81MBOX: require("../assets/images/images_n69/mysterybox/Box_Mecha/N81MBOX.png"),
  N81PBOX: require("../assets/images/images_n69/mysterybox/Box_Mecha/N81PBOX.png"),
  N81SBOX: require("../assets/images/images_n69/mysterybox/Box_Mecha/N81SBOX.png"),
};
export const MYSTERY_BOX_MECHA_BG: THEMES = {
  N81MBOX: QUALITY.Blue_big,
  N81PBOX: QUALITY.Violet_big,
  N81SBOX: QUALITY.Red_big,
};
export const MYSTERY_BOX_FP: THEMES = {
  BABOX: require("../assets/images/images_n69/mysterybox/Box_FLASHPOINT/BABOX.png"),
  GABOX: require("../assets/images/images_n69/mysterybox/Box_FLASHPOINT/GABOX.png"),
  PPBOX: require("../assets/images/images_n69/mysterybox/Box_FLASHPOINT/PPBOX.png"),
};

export const STAKING_BG: THEMES = {
  diamond: require("../assets/images/images_copy/staking/diamond.png"),
  platinum: require("../assets/images/images_copy/staking/platium.png"),
  gold: require("../assets/images/images_copy/staking/gold.png"),
  silver: require("../assets/images/images_copy/staking/silver.png"),
  bronze: require("../assets/images/images_copy/staking/bronze.png"),
};

export const MYSTERY_BOX_FP_BG: THEMES = {
  BABOX: QUALITY.Green_big,
  GABOX: QUALITY.Blue_big,
  PPBOX: QUALITY.Violet_big,
};

export const TITLE_COLOR_QUALITY: THEMES = {
  Green: "#21A232",
  White: "#B6B6D2",
  Blue: "#0793FF",
  Violet: "#A15AFF",
  Purple: "#A15AFF",
  Gold: "#FFBF00",
  Yellow: "#FFBF00",
  Orange: "#FF5735",
  Red: "#FF1E1E",
  Platinum: require("../assets/images/images_copy/quality/8.png"),
  "0-big": "#B6B6D2",
  "1-big": "#21A232",
  "2-big": "#0793FF",
  "3-big": "#A15AFF",
  "4-big": "#FFBF00",
  "5-big": "#FF5735",
  "6-big": "#FF1E1E",
};

export const SOCIALS: THEMES = {
  apple: require("../assets/images/images_n69/SocialAP.png"),
  facebook: require("../assets/images/images_n69/SocialFB.png"),
  google: require("../assets/images/images_n69/SocialGG.png"),
};

export const GAMES_AVATAR: THEMES = {
  bctest: require("../assets/images/games/bctest.png"),
  "9dnft": require("../assets/images/games/9dnft.png"),
  soulrealm: require("../assets/images/games/soulrealm.png"),
  galixcity: require("../assets/images/games/galixcity.png"),
  mechawarfare: require("../assets/images/games/mechawarfare.png"),
  heavensword: require("../assets/images/games/heavensword.png"),
  flashpoint: require("../assets/images/games/flashpoint.png"),
  default: require("../assets/images/games/default.png"),
};

export const ICONS: THEMES = {
  google: require("../assets/images/icons/google.png"),
  chplay: require("../assets/images/icons/chplay.png"),
  appstore: require("../assets/images/icons/appstore.png"),
  facebook: require("../assets/images/icons/facebook.png"),
  whatsapp: require("../assets/images/icons/whatsapp.png"),
  instagram: require("../assets/images/icons/instagram.png"),
  twitter: require("../assets/images/icons/twitter.png"),
  home: require("../assets/images/icons/home.png"),
  homeWhite: require("../assets/images/icons/homeWhite.png"),
  wallet: require("../assets/images/icons/wallet.png"),
  profile: require("../assets/images/icons/profile.png"),
  colorswatch: require("../assets/images/icons/colorswatch.png"),
  trade: require("../assets/images/icons/trade.png"),
  grid: require("../assets/images/icons/grid.png"),
  setting: require("../assets/images/icons/setting.png"),
  logout: require("../assets/images/icons/logout.png"),
  sun: require("../assets/images/icons/sun.png"),
  moon: require("../assets/images/icons/moon.png"),
  bell: require("../assets/images/icons/bell.png"),
  wallet2: require("../assets/images/icons/wallet2.png"),
  chart: require("../assets/images/icons/chart.png"),
  trophy: require("../assets/images/icons/trophy.png"),
  withdrawal: require("../assets/images/icons/withdraw.png"),
  transfer: require("../assets/images/icons/swap.png"),
  deposit: require("../assets/images/icons/deposit.png"),
  delete: require("../assets/images/icons/delete.png"),
  qr: require("../assets/images/icons/qr.png"),
  // copy: require('../assets/images/icons/copy.png'),
  cryptowallet: require("../assets/images/icons/cryptowallet.png"),
  cashwallet: require("../assets/images/icons/cashwallet.png"),
  card: require("../assets/images/icons/card.png"),
  bank: require("../assets/images/icons/bank.png"),
  info: require("../assets/images/icons/info.png"),
  check: require("../assets/images/icons/check.png"),
  checkIn: require("../assets/images/icons/checkIn.png"),
  pending: require("../assets/images/icons/pending.png"),
  verified: require("../assets/images/icons/verified.png"),
  history: require("../assets/images/icons/history.png"),
  support: require("../assets/images/icons/support.png"),
  badge: require("../assets/images/icons/badge.png"),
  doubts: require("../assets/images/icons/doubts.png"),
  email: require("../assets/images/icons/email.png"),
  lock: require("../assets/images/icons/lock.png"),
  phone: require("../assets/images/icons/phone.png"),
  payment: require("../assets/images/icons/payment.png"),
  document: require("../assets/images/icons/document.png"),
  windows: require("../assets/images/icons/windows.png"),
  chrome: require("../assets/images/icons/chrome.png"),
  firefox: require("../assets/images/icons/firefox.png"),
  microsoft: require("../assets/images/icons/microsoft.png"),
  minus: require("../assets/images/icons/minus.png"),
  plus: require("../assets/images/icons/plus.png"),
  csv: require("../assets/images/icons/csv.png"),
  xlsx: require("../assets/images/icons/xlsx.png"),
  pdf: require("../assets/images/icons/pdf.png"),
  arrowUp: require("../assets/images/icons/up-arrow.png"),
  arrowDown: require("../assets/images/icons/down-arrow.png"),
  dropDown: require("../assets/images/icons/dropdown.png"),
  attachment: require("../assets/images/icons/attachment.png"),
  send: require("../assets/images/icons/send.png"),
  customer: require("../assets/images/icons/customer.png"),
  dollor: require("../assets/images/icons/dollor.png"),
  mail: require("../assets/images/icons/mail.png"),
  thumbsUp: require("../assets/images/icons/thumbs-up.png"),
  back: require("../assets/images/images_n69/arrow-back.png"),
  arrowLeftWhite: require("../assets/images/icons/arrowLeftWhite.png"),
  close: require("../assets/images/images_n69/close-circle.png"),
  arrowRight: require("../assets/images/icons/arrowRight.png"),
  nfts: require("../assets/images/icons/nfts.png"),
  product: require("../assets/images/icons/product.png"),
  event: require("../assets/images/icons/event.png"),
  cogi: require("../assets/images/coins/cogi.png"),
  nemo: require("../assets/images/coins/nemo.png"),
  usdt: require("../assets/images/coins/usdt.png"),
  gosu: require("../assets/images/coins/gosu.png"),
  avax_testnet: require("../assets/images/images_n69/avax.png"),
  bsc: require("../assets/images/images_n69/bsc.png"),
  search: require("../assets/images/icons/search.png"),
  copy: require("../assets/images/images_n69/copy.png"),
  notify: require("../assets/images/icons/notification.png"),
  arrowDown2x: require("../assets/images/icons/arrow-down2x.png"),
  filter: require("../assets/images/icons/filter.png"),
  share: require("../assets/images/icons/share.png"),
  vietnam: require("../assets/images/images_copy/flag/VN.png"),
  eng: require("../assets/images/images_copy/flag/eng.jpg"),
  1: require("../assets/images/images_n69/network/1.png"),
  4: require("../assets/images/images_n69/network/4.png"),
  12: require("../assets/images/images_n69/network/12.png"),
  56: require("../assets/images/images_n69/network/56.png"),
  97: require("../assets/images/images_n69/network/97.png"),
  5555: require("../assets/images/images_n69/network/5555.png"),
  76923: require("../assets/images/images_n69/network/76923.png"),
  43113: require("../assets/images/images_n69/network/43113.png"),
  43114: require("../assets/images/images_n69/network/43114.png"),
  polygon_left: require("../assets/images/images_n69/mysterybox/Polygon_3.png"),
  polygon_right: require("../assets/images/images_n69/mysterybox/Polygon_4.png"),
  top_search: require("../assets/images/images_n69/top_search.png"),
  scan: require("../assets/images/icons/scan.png"),
};

export const MyTextApp = (props: any) => {
  const { style, children } = props;

  return (
    <Text
      style={{ ...FONTS.fontDefault, color: COLORS.white, ...style }}
      ellipsizeMode={props?.ellipsizeMode ?? "tail"}
      numberOfLines={props?.numberOfLines}
      onPress={props?.onPress}
      accessibilityLabel={props?.accessibilityLabel}
      accessibilityLabelledBy={props?.accessibilityLabelledBy}
      nativeID={props?.nativeID}
    >
      {children}
    </Text>
  );
};

interface GradientTextProps {
  colors: string[];
  [x: string]: any;
}

export const GradientText = ({ colors, ...rest }: GradientTextProps) => {
  return (
    <MaskedView maskElement={<Text {...rest} />}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text {...rest} style={[rest.style, { opacity: 0 }]} />
      </LinearGradient>
    </MaskedView>
  );
};

const appTheme = { COLORS, SIZES, FONTS, IMAGES, ICONS };

export default appTheme;
