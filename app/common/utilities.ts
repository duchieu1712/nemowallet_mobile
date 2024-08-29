import * as ethers from "ethers";
import simple_jsonrpc from "simple-jsonrpc-js";
import { BigNumber, type BigNumberish, Contract } from "ethers";
import {
  ContractFromAddressCogiChain,
  ContractFromNamespaceCogiChain,
  ListAddresdFromNamespace,
  providerCall,
} from "../modules/wallet/utilities";
import {
  CHAINID_COGI,
  DEFAULT_CHAINID,
  PERCENT_AFTER_BURN,
  APP_VERSION,
} from "./constants";
import cf_Chains from "../config/chains";
import lodash, { isEmpty, isNumber } from "lodash";
// import { sha256 } from 'react-native-sha256'
import { DEFAULT_MAX_VALUE_FILTER } from "../common/constants";
import {
  ColorPurifiedAttributes,
  FILTER_NFT_TYPE as FILTER_NFT_TYPE_GLAIX,
  LOCALE_STORAGE,
  MATCH_FIRST,
  NAMESPACE_DEPOSIT_WITHDRAW,
  RESULT_LOTTERY,
  TYPE_DEPOSIT_WITHDRAW,
} from "../common/enum";
import cf_coins from "../config/coins";
import { type Nft, Status } from "../modules/graphql/types/generated";

import {
  formatUnits,
  isBytes,
  isHexString,
  parseUnits,
} from "ethers/lib/utils";
import { ClassWithStaticMethod } from "./static";
import { GalixBridgeAbi } from "./abi";
import { appState } from "../modules";
import dayjs from "dayjs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decryptData, encryptData } from "../modules/account/utilities";
import { ICONS, TITLE_COLOR_QUALITY } from "../themes/theme";
import { createHash } from "react-native-crypto";
import i18n from "../../i18n.config";
import { Animated, Keyboard } from "react-native";
import { endpointFromChainId, getNetworkByChainID } from "./utilities_config";

export const sha256 = (data: any | unknown): Buffer => {
  return createHash("sha256").update(data).digest();
};

export const toAddress = (s: string): string => {
  return ethers.utils.getAddress(s);
};

export const timestampToHuman = (t: number): string => {
  const d = new Date(t * 1000);
  return d.toLocaleDateString("en-ZA", {
    day: "numeric",
    year: "numeric",
    month: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

export const timestampToHuman_v2 = (t: number): string => {
  const d = new Date(t * 1000);
  return d.toLocaleTimeString("en-ZA", {
    day: "numeric",
    year: "numeric",
    month: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

export const timesOnChain = (t: number): string => {
  const d = new Date(t);
  return d.toLocaleString();
};

export function ellipseText(address = "", width = 10): string {
  if (address.length > width) {
    return `${address.slice(0, width)}...${address.slice(-width)}`;
  } else {
    return address;
  }
}

export function ellipseAddress(address = "", width = 7): string {
  if (!address) {
    return "";
  }
  if (address.length >= 2 * width) {
    return `${address.slice(0, width)}...${address.slice(-width)}`;
  } else {
    return `${address}`;
  }
}

export function getAddressFormat(address = ""): string {
  if (!address) {
    return "";
  }
  return toNEMOWallet(address);
}

export function getAddress(address: string | any): string {
  return ethers.utils.getAddress(address);
}

export function isAddress(address: string | any): boolean {
  return ethers.utils.isAddress(address);
}

export function toEther(
  wei: BigNumberish,
  unitName: BigNumberish = 18,
): string {
  if (isEmpty(wei?.toString()) || !isBigNumberish(wei)) return "0";
  return formatUnits(wei, unitName);
}

export function toEther_v2(
  wei: BigNumberish,
  unitName: BigNumberish = 18,
): string {
  try {
    if (isEmpty(wei?.toString()) || !isBigNumberish(wei)) return "0";
    return formatUnits(wei, unitName);
  } catch (e: any) {
    throw new Error(e?.message ?? e);
  }
}

export function toWei(
  ether: string,
  unitName: BigNumberish = 18,
): BigNumber | null {
  try {
    if (isEmpty(ether)) return parseUnits("0");
    return parseUnits(ether, unitName);
  } catch (e: any) {
    throw new Error(e?.message ?? e);
  }
}

export function toWei_v2(
  ether: string,
  unitName: BigNumberish = 18,
): BigNumber | null {
  try {
    if (isEmpty(ether)) return parseUnits("0");
    return parseUnits(ether, unitName);
  } catch (e: any) {
    throw new Error(e?.message ?? e);
  }
}

export function toWei6(ether: string): BigNumber {
  return parseUnits(ether, 6);
}

export function toEther6(wei: BigNumberish): string {
  if (isEmpty(wei)) return "0";
  return formatUnits(wei, 6);
}

export function cast<T>(obj: any | unknown): T {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return obj as T;
}

export function msToTime(time: number): string {
  if (time == null || time < 0) return "";
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;

  const minute = minutes < 10 ? "0" + minutes : minutes;
  const second = seconds < 10 ? "0" + seconds : seconds;

  return minute + " : " + second;
}

export function timeStampToTime(sec_num: number): string {
  if (sec_num < 0) sec_num = 0;
  sec_num = parseInt((sec_num ?? "0")?.toString());
  if (sec_num <= 0) return "00:00:00";
  const days = Math.floor(sec_num / (3600 * 24));
  const hours = Math.floor((sec_num - days * 3600 * 24) / 3600);
  const minutes = Math.floor((sec_num - days * 3600 * 24 - hours * 3600) / 60);
  const seconds = sec_num - days * 3600 * 24 - hours * 3600 - minutes * 60;
  const resDays =
    days.toString().length < 2
      ? ("0" + days.toString()).slice(-2)
      : days.toString();
  const resHours = ("0" + hours.toString()).slice(-2);
  const resMinutes = ("0" + minutes.toString()).slice(-2);
  const resSeconds = ("0" + seconds.toString()).slice(-2);
  return (
    (days != 0 ? resDays + ":" : "") +
    resHours +
    ":" +
    resMinutes +
    ":" +
    resSeconds
  );
}

export function timeStampToTime_V2(sec_num: number): string {
  sec_num = parseInt((sec_num ?? "0")?.toString());
  if (sec_num <= 0) return "00:00:00";
  const hours = Math.floor(sec_num / 3600);
  const minutes = Math.floor((sec_num - hours * 3600) / 60);
  const seconds = sec_num - hours * 3600 - minutes * 60;
  const resHours =
    hours.toString().length < 2
      ? ("0" + hours.toString()).slice(-2)
      : hours.toString();
  const resMinutes = ("0" + minutes.toString()).slice(-2);
  const resSeconds = ("0" + seconds.toString()).slice(-2);
  return resHours + ":" + resMinutes + ":" + resSeconds;
}

export function timeStampToTime_V3(sec_num: number): string {
  sec_num = parseInt((sec_num ?? "0")?.toString());
  if (sec_num <= 0) return "0 d : 0 h: 0 m : 0 s";
  const days = Math.floor(sec_num / (3600 * 24));
  const hours = Math.floor((sec_num - days * 3600 * 24) / 3600);
  const minutes = Math.floor((sec_num - days * 3600 * 24 - hours * 3600) / 60);
  const seconds = sec_num - days * 3600 * 24 - hours * 3600 - minutes * 60;

  const resDays =
    days.toString().length < 2
      ? ("0" + days.toString()).slice(-2)
      : days.toString();
  const resHours = ("0" + hours.toString()).slice(-2);
  const resMinutes = ("0" + minutes.toString()).slice(-2);
  const resSeconds = ("0" + seconds.toString()).slice(-2);
  return (
    (days != 0 ? `${resDays} d` + " : " : "") +
    `${resHours} h` +
    " : " +
    `${resMinutes} m` +
    " : " +
    `${resSeconds} s`
  );
}

export function timeStampToTime_Object(sec_num: number): any {
  sec_num = parseInt((sec_num ?? "0")?.toString());
  if (sec_num <= 0)
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  const days = Math.floor(sec_num / (3600 * 24));
  const hours = Math.floor((sec_num - days * 3600 * 24) / 3600);
  const minutes = Math.floor((sec_num - days * 3600 * 24 - hours * 3600) / 60);
  const seconds = sec_num - days * 3600 * 24 - hours * 3600 - minutes * 60;
  return {
    days,
    hours,
    minutes,
    seconds,
  };
}

export function countDown_Days(sec_num: number): number {
  if (!sec_num) return 0;
  return Math.floor(sec_num / (3600 * 24));
}

export function countDown_Hours(sec_num: number): number {
  if (!sec_num) return 0;
  return Math.floor((sec_num - countDown_Days(sec_num) * 3600 * 24) / 3600);
}

export function countDown_Minutes(sec_num: number): number {
  if (!sec_num) return 0;
  return Math.floor(
    (sec_num -
      countDown_Days(sec_num) * 3600 * 24 -
      countDown_Hours(sec_num) * 3600) /
      60,
  );
}

export function countDown_Seconds(sec_num: number): number {
  if (!sec_num) return 0;
  return Math.floor(
    sec_num -
      countDown_Days(sec_num) * 3600 * 24 -
      countDown_Hours(sec_num) * 3600 -
      countDown_Minutes(sec_num) * 60,
  );
}

export function checkIsNumber(value: string, isCheckBlank = false): boolean {
  if (value == "" && !isCheckBlank) return true;
  const regex = /^[0-9]+$/;
  if (value.match(regex)) {
    return true;
  }
  return false;
}

export function isLessMaximumPrice(value: string): boolean {
  const val = parseInt(value);
  if (val <= DEFAULT_MAX_VALUE_FILTER) {
    return true;
  }
  return false;
}

export function getMaximumPriceFormat(): string {
  return DEFAULT_MAX_VALUE_FILTER.toString().replace(
    /(.)(?=(\d{3})+$)/g,
    "$1.",
  );
}

export function getColorForItem(id: string): any {
  const t: any = "ATTR_" + id;
  return ColorPurifiedAttributes[t];
}

export function roundNumber(number: any | unknown, decimal = 3): number {
  try {
    if (number == null) return 0;
    if (!isNumber(parseFloat(number))) return number;
    const res =
      Math.round(parseFloat(number.toString()) * Math.pow(10, decimal)) /
      Math.pow(10, decimal);
    return res;
  } catch {
    return number;
  }
}

export function roundDownNumber(number: any | unknown, decimal = 3): number {
  try {
    if (number == null) return 0;
    if (!isNumber(parseFloat(number))) return number;
    const res =
      Math.floor(number * Math.pow(10, decimal)) / Math.pow(10, decimal);
    return res;
  } catch {
    return number;
  }
}

export function roundDownNumber_v2(number: number, decimal = 3): number {
  try {
    if (number == null) return 0;
    const res =
      Math.floor(number * Math.pow(10, decimal)) / Math.pow(10, decimal);
    return res;
  } catch {
    return number;
  }
}

export const timestampToHumanDashaboard = (t: number): string => {
  const now = dayjs().valueOf();
  const time = Math.round((now - t * 1000) / 1000);
  if (time <= 45) {
    return "few seconds ago";
  } else if (time >= 46 && time <= 105) {
    return "a minute ago";
  } else if (time >= 106 && time <= 3599) {
    return Math.round(time / 60) + " minutes ago";
  } else if (time >= 3600 && time <= 7199) {
    return "an hour ago";
  } else if (time >= 7200 && time <= 86399) {
    return Math.round(time / 3600) + " hours ago";
  }
  const d = new Date(t * 1000);
  return d.toLocaleString();
};

// export const currencyFormat = (num: any) => {
//   if (num == null) return ''
//   return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
// }
export const currencyFormat = (num: any | unknown): any => {
  if (num == null) return "";
  const parts = num?.toString()?.split(".");
  return (
    parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
    (parts[1] ? "." + parts[1] : "")
  );
};

export function checkIsEmail(email: any): boolean {
  const regEmail =
    /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (regEmail.test(email)) {
    return true;
  } else {
    return false;
  }
}

export const nFormatterDown = (num: number, digits = 0): any => {
  const si = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    // { value: 1E9, symbol: "G" },
    // { value: 1E12, symbol: "T" },
    // { value: 1E15, symbol: "P" },
    // { value: 1E18, symbol: "E" }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (
    roundDownNumber(num / si[i].value, digits)
      .toFixed(digits)
      .replace(rx, "$1") + si[i].symbol
  );
};

export function checkValidatePassword(pw: string): boolean {
  const regPw = /(.){8,}/;
  if (
    // RegExp(
    //   // /^\S*(?=\S{8,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])(?=.*[\W])\S*$/
    //   // /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
    //   /(.){8,}/,
    // ).test(pw)
    regPw.test(pw)
  ) {
    return true;
  } else {
    return false;
  }
}

export function getNumberCoin(coin: string): number {
  return parseInt(coin);
}

export function getTimeStake(time: number): number {
  return roundNumber(time / 3600, 3);
}

export function checkCoinCogi(address: string | any): boolean {
  return cf_coins.some(
    (e) =>
      e.contract.toLowerCase() == address?.toLowerCase() && e.symbol == "COGI",
  );
}

export function getSymbolCoin(address: string | any): any {
  const coin = cf_coins.find(
    (e) => e?.contract?.toLowerCase() == address?.toLowerCase(),
  );
  if (coin) {
    return {
      ...coin,
      symbolCoin: coin?.symbol,
      nameCoin: coin?.name,
    };
  }
  return {
    symbolCoin: "",
    nameCoin: "",
  };
}

export function getSymbolCoin_v2(address: string | any): any {
  const coin = cf_coins.find(
    (e) =>
      e.contract?.toLowerCase() == address.toLowerCase() &&
      e.chainID == DEFAULT_CHAINID,
  );
  if (coin) {
    return {
      symbolCoin: coin?.symbol,
      nameCoin: coin?.name,
      // image: coin?.icon,
      decimals: coin?.decimals,
    };
  }
  return {
    symbolCoin: "",
    nameCoin: "",
    image: "",
    decimals: 0,
  };
}

export function getSymbolCoin_Network(
  address: string | any,
  network: number,
): any {
  const coin = cf_coins.find(
    (e) =>
      e.contract?.toLowerCase() == address?.toLowerCase() &&
      e.chainID == network,
  );
  if (coin) {
    return {
      symbolCoin: coin?.symbol,
      nameCoin: coin?.name,
      // image: coin?.icon,
      decimals: coin?.decimals,
      address: coin?.contract,
    };
  }
  return {
    symbolCoin: "",
    nameCoin: "",
    image: "",
    decimals: 0,
  };
}

export const timestampToDate = (t: number): string => {
  const d = new Date(t * 1000);
  return d.toLocaleString();
};

export const converToURL = (url: string): string => {
  return url.replace("+", "%2b");
};

export const unConvertFromURL = (url: string): string => {
  return url.replace("%2b", "+");
};

export function cogiToUSDT(cogi: number, ticketPrice: number): number {
  if (!cogi || !ticketPrice) return 0;
  return roundNumber(cogi / ticketPrice, 3);
}

export function sumNumber(a: number, b: number): number {
  return roundNumber(
    parseFloat((a ?? 0).toString()) + parseFloat((b ?? 0).toString()),
    3,
  );
}

export function matchFirst(a: number, index: number, lstRatio: any[]): number {
  if (!a) return 0;
  let ratio = 0;
  if (lstRatio.length >= index - 1) ratio = lstRatio[index - 1];
  return roundNumber((a * ratio * PERCENT_AFTER_BURN) / 100, 3);
}

export function matchFirstUSDT(
  a: number,
  index: number,
  lstRatio: any[],
): number {
  if (!a) return 0;
  let ratio = 0;
  const sumRatio = lodash.sum(lstRatio);
  if (lstRatio.length >= index - 1) {
    ratio = lstRatio[index - 1];
  }
  return roundNumber((a * ratio) / sumRatio, 3);
}

export function burn(a: number): number {
  if (!a) return 0;
  return roundNumber((a * MATCH_FIRST.BURN) / 100, 3);
}

export function reverseString(str: string): any {
  if (!str) return "";
  const splitString = str?.split("");
  const reverseArray = splitString.reverse();
  const joinArray = reverseArray.join("");
  return joinArray;
}

export function formatTicket(str: string): any {
  if (!str) return "";
  const splitString = str?.split("");
  const joinArray = splitString.join("-");
  return joinArray;
}

export function checkMatchFirst(
  ticket: any | unknown,
  prize: any | unknown,
): any {
  let res = 0;
  for (let i = 0; i < ticket.length; i++) {
    if (ticket[i] == prize[i]) {
      res++;
    } else {
      break;
    }
  }
  return res;
}

export function insertString(
  txt1: any | unknown,
  txt2: any | unknown,
  index: any | unknown,
): any {
  return txt1.substring(0, index) + txt2 + txt1.substring(index);
}

export function replaceAt(
  txt1: any | unknown,
  txt2: any | unknown,
  index: any | unknown,
): any {
  return txt1.substring(0, index) + txt2 + txt1.substring(index + 1);
}

export function getTokenFormat(num: number): number {
  if (!num) return 0;
  return num / Math.pow(10, 18);
}

export function convertHexToCogi(num: number): number {
  if (!num) return 0;
  return num / Math.pow(10, 18);
}

export function convertHexToUSD(num: number): number {
  if (!num) return 0;
  return num / Math.pow(10, 18);
}

export function checkMatchNumber(num: number): boolean {
  switch (num) {
    case RESULT_LOTTERY.MATCH_1:
    case RESULT_LOTTERY.MATCH_2:
    case RESULT_LOTTERY.MATCH_3:
    case RESULT_LOTTERY.MATCH_4:
    case RESULT_LOTTERY.MATCH_5:
      return true;
    default:
      return false;
  }
}

export function getStatusLottery(num: number): string {
  switch (num) {
    case 0:
      return Status.Pending;
    case 1:
      return Status.Open;
    case 2:
      return Status.Close;
    case 3:
      return Status.Claimable;
  }
  return "";
}

export const getRPCNetwork = (): any => {
  let res: any = "";
  for (let i = 0; i < cf_Chains.length; i++) {
    if (cf_Chains[i].chainId == ClassWithStaticMethod.STATIC_DEFAULT_CHAINID) {
      res = cf_Chains[i].rpcUrl;
      break;
    }
  }
  return res;
};

export const calAPY = (
  galixPrice: number,
  nemoPrice: number,
  rewardRate: number,
  totalStaked: number,
): string => {
  const n = 365;
  // const apr = (totalReward / totalStaked / 7) * 365 * (nemoPrice / galixPrice)
  const apr =
    ((rewardRate * (3600 * 24)) / totalStaked) * n * (nemoPrice / galixPrice);
  const APY = (Math.pow(1 + apr / n, n) - 1) * 100;
  // const response = currencyFormat(nFormatter(roundNumber(APY, 0), 2))
  const response = currencyFormat(nFormatter(roundNumber(APY, 0), 0));
  return response;
};

export const nFormatter = (num: number, digits = 0): string => {
  const si = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    // { value: 1E9, symbol: "G" },
    // { value: 1E12, symbol: "T" },
    // { value: 1E15, symbol: "P" },
    // { value: 1E18, symbol: "E" }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
};

export const formatTokenNumber = (
  number: string | number,
  digit = 2,
): number => {
  return currencyFormat(
    nFormatter(
      (typeof number === "string" ? parseFloat(number) : number) ?? 0,
      digit,
    ),
  );
};

export const createAccountTemp = async (): Promise<any> => {
  try {
    const provider = simple_jsonrpc.connect_xhr(
      endpointFromChainId(ClassWithStaticMethod.STATIC_DEFAULT_CHAINID)
        .endpoint,
    );
    const res = await provider.call("nemo_hotwallet.create", []);
    if (res) {
      return res.account;
    } else {
      return "";
    }
  } catch {
    return "";
  }
};

export const getLocationView = (x: any, y: any) => {
  try {
    if (!x || !y) return "";
    const lstX = x.match(/\d+/g);
    const lstY = y.match(/\d+/g);
    return `[${lstX[0]},${lstY[0]}] ~ [${lstX[1]},${lstY[1]}]`;
  } catch {
    return "";
  }
};

export const toNEMOWallet = (x: any) => {
  if (x == null) return "";
  // return x
  return "0x" + x.slice(2, x.length);
};

export const getRandomLand = (
  landid: any | string,
  level: any | string,
): number => {
  try {
    const temp = (parseInt(level) + parseInt(landid)) % 5;
    return temp + 1;
  } catch {
    return 1;
  }
};

export const getRandomLandImage = (
  landid: any | string,
  level: any | string,
): any => {
  try {
    const temp = (parseInt(level) + parseInt(landid)) % 5;
    return `land_level_${level}_${temp + 1}`;
  } catch {
    return `land_level_${level}_1`;
  }
};

export const descyptNEMOWallet = (nemoWallet: any) => {
  try {
    if (!nemoWallet) return "";
    return nemoWallet.replace("NEMOx", "0x").replace("nemox", "0x");
  } catch {
    return "";
  }
};

export const checkViewAccount = async (): Promise<boolean> => {
  let ret = false;
  try {
    const data = decryptData(
      await AsyncStorage.getItem(LOCALE_STORAGE.ACCOUNT),
    );
    if (data && data != "") {
      const jsonData = JSON.parse(data);
      if (parseInt(jsonData.timestamp) > dayjs().valueOf()) {
        ret = true;
      }
    }
  } catch (e: any) {
    throw new Error(e?.message ?? e);
  }
  return ret;
};

export const IsCogiChain = (): boolean => {
  return ClassWithStaticMethod.STATIC_DEFAULT_CHAINID == CHAINID_COGI;
};

export const saveStateLoginGID = async (data: any | unknown): Promise<any> => {
  if (data != null) {
    await AsyncStorage.setItem(
      LOCALE_STORAGE.STATE_LOGIN_GID,
      JSON.stringify(encryptData(data)),
    );
  } else {
    await AsyncStorage.setItem(LOCALE_STORAGE.STATE_LOGIN_GID, "");
  }
};

export const checkStarGalix = (
  star: any | unknown,
  grade: any | unknown,
): any => {
  if (star == 1 && grade == 1)
    return {
      image: "hero_star",
      number: 1,
    };
  else if (star == 2 && grade == 1)
    return {
      image: "hero_star",
      number: 2,
    };
  else if (star == 2 && grade == 2)
    return {
      image: "hero_star",
      number: 3,
    };
  else if (star == 3 && grade == 1)
    return {
      image: "hero_star",
      number: 4,
    };
  else if (star == 3 && grade == 2)
    return {
      image: "hero_star",
      number: 5,
    };
  else if (star == 3 && grade == 3)
    return {
      image: "hero_star_1",
      number: 1,
    };
  else if (star == 4 && grade == 1)
    return {
      image: "hero_star_1",
      number: 2,
    };
  else if (star == 4 && grade == 2)
    return {
      image: "hero_star_1",
      number: 3,
    };
  else if (star == 4 && grade == 3)
    return {
      image: "hero_star_1",
      number: 4,
    };
  else if (star == 4 && grade == 4)
    return {
      image: "hero_star_1",
      number: 5,
    };
  else if (star == 5 && grade == 1)
    return {
      image: "hero_star_2",
      number: 1,
    };
  else if (star == 5 && grade == 2)
    return {
      image: "hero_star_2",
      number: 2,
    };
  else if (star == 5 && grade == 3)
    return {
      image: "hero_star_2",
      number: 3,
    };
  else if (star == 5 && grade == 4)
    return {
      image: "hero_star_2",
      number: 4,
    };
  else if (star == 5 && grade == 5)
    return {
      image: "hero_star_2",
      number: 5,
    };
  else if (star == 6 && grade == 1)
    return {
      image: "hero_star_3",
      number: 1,
    };
  else
    return {
      image: "hero_star",
      number: 1,
    };
};

export const checkViewSubTagMenu = (
  lstMenu: any | unknown,
  lmenu: any | unknown,
): any => {
  if (lstMenu?.toLowerCase().trim() == "all") return true;
  return lmenu.some((e: any) =>
    e?.urlConfig
      ?.split(",")
      .some((temp: any) =>
        lstMenu?.toLowerCase().trim()?.includes(temp.toLowerCase().trim()),
      ),
  );
};

export const getNamespaceWithdraw_Deposit = (
  chainID: number,
): string | NAMESPACE_DEPOSIT_WITHDRAW => {
  switch (chainID) {
    case 5555:
    case 76923:
      return NAMESPACE_DEPOSIT_WITHDRAW._NEMO;
    case 97:
    case 56:
      return NAMESPACE_DEPOSIT_WITHDRAW._BSC;
    case 43114:
    case 43113:
      return NAMESPACE_DEPOSIT_WITHDRAW._FUJI;
  }
  return "";
};

export const sleep = async (ms: number): Promise<any> =>
  await new Promise((r) => setTimeout(r, ms));

export const getContractBridge = (
  lstBridge: any | unknown,
  network: any | unknown,
  tokenAddress: any | unknown,
): any | ethers.ethers.Contract => {
  if (!lstBridge) return null;
  const bridge = lstBridge.find(
    (e: any) =>
      e.chain_id == network &&
      e.tokens.some((a: any) => a.toLowerCase() == tokenAddress.toLowerCase()),
  );
  if (bridge) {
    const store = appState();
    const web3 = store?.wallet?.web3Provider;
    const signer = web3?.getSigner();
    return new Contract(bridge.address, GalixBridgeAbi, signer);
  }
  return null;
};

export const getPoolBridge = (
  lstBridge: any | unknown,
  network: any | unknown,
  tokenAddress: any | unknown,
): any => {
  if (!lstBridge) return null;
  const bridge = lstBridge.find(
    (e: any) =>
      e.chain_id == network &&
      e?.tokens?.some(
        (a: any) => a.toLowerCase() == tokenAddress?.toLowerCase(),
      ),
  );
  return bridge;
};

export const getPoolBridge_Deposit_V2 = (
  lstBridge: any | unknown,
  network: any | unknown,
  tokenAddress: any | unknown,
): any => {
  if (!lstBridge) return null;
  const ResBridge = lstBridge.find(
    (bridge: any) =>
      bridge?.chain_id == ClassWithStaticMethod.NEMO_WALLET_CHAINID &&
      bridge?.received?.some(
        (b: any) =>
          b.chain_id == network &&
          b?.received?.chain_id == ClassWithStaticMethod.NEMO_WALLET_CHAINID &&
          b?.token?.toLowerCase() == tokenAddress?.toLowerCase(),
      ),
  );
  const received = ResBridge?.received?.find(
    (b: any) =>
      b.chain_id == network &&
      b?.received?.chain_id == ClassWithStaticMethod.NEMO_WALLET_CHAINID &&
      b?.token?.toLowerCase() == tokenAddress?.toLowerCase(),
  );
  if (ResBridge) {
    ResBridge.receive = received;
  }
  return ResBridge;
};

export const getPoolBridge_Withdraw_V2 = (
  lstBridge: any | unknown,
  networkFrom: any | unknown,
  tokenAddress: any | unknown,
  networkTo: any | unknown,
): any => {
  if (!lstBridge) return null;
  const ResBridge = lstBridge.find(
    (bridge: any) =>
      bridge?.chain_id == networkFrom &&
      bridge?.destinations?.some(
        (b: any) => b?.token?.toLowerCase() == tokenAddress?.toLowerCase(),
      ),
  );
  const destination = ResBridge?.destinations?.find(
    (b: any) =>
      b?.token?.toLowerCase() == tokenAddress?.toLowerCase() &&
      b?.destination?.chain_id == networkTo?.chainId,
  );
  if (ResBridge) {
    ResBridge.destination = destination;
  }
  return ResBridge;
};

export const getInfoBridge = (
  lstBridge: any | unknown,
  namespaceToken: any | unknown,
  typeWithDraw: any | unknown,
): any => {
  let lstFilter = [];
  if (typeWithDraw == TYPE_DEPOSIT_WITHDRAW._TYPE_DEPOSIT) {
    const token = ListAddresdFromNamespace(namespaceToken);
    lstFilter = lstBridge?.filter(
      (e: any) =>
        e.chain_id_whitelist.includes(
          ClassWithStaticMethod.NEMO_WALLET_CHAINID,
        ) &&
        e.tokens.some((a: any) =>
          token.some((b: any) => a.toLowerCase() == b?.contract?.toLowerCase()),
        ),
    );
  } else if (typeWithDraw == TYPE_DEPOSIT_WITHDRAW._TYPE_WITHDRAW) {
    const token = ContractFromNamespaceCogiChain(namespaceToken);
    lstFilter = lstBridge?.filter(
      (e: any) =>
        e.chain_id == ClassWithStaticMethod.NEMO_WALLET_CHAINID &&
        e.tokens.some(
          (a: any) => a.toLowerCase() == token?.address?.toLowerCase(),
        ),
    );
  }
  return lstFilter;
};

export const popupCenter = ({
  url,
  title = "Marketplace",
  w = 400,
  h = 800,
}: {
  url?: any;
  title?: string;
  w?: number;
  h?: number;
}): any => {
  // Fixes dual-screen position                             Most browsers      Firefox
  // const dualScreenLeft =
  //   window.screenLeft !== undefined ? window.screenLeft : window.screenX
  // const dualScreenTop =
  //   window.screenTop !== undefined ? window.screenTop : window.screenY
  // const width = window.innerWidth
  //   ? window.innerWidth
  //   : document.documentElement.clientWidth
  //   ? document.documentElement.clientWidth
  //   : screen.width
  // const height = window.innerHeight
  //   ? window.innerHeight
  //   : document.documentElement.clientHeight
  //   ? document.documentElement.clientHeight
  //   : screen.height
  // const systemZoom = width / window.screen.availWidth
  // const left = (width - w) / 2 / systemZoom + dualScreenLeft
  // const top = (height - h) / 2 / systemZoom + dualScreenTop
  // const newWindow = window.open(
  //   url,
  //   title,
  //   `
  //   scrollbars=yes,
  //   width=${w / systemZoom},
  //   height=${h / systemZoom},
  //   top=${top},
  //   left=${left}
  //   `
  // )
  // if (window.focus) newWindow.focus()
};

export const getPinCode = (otp: any | unknown): string => {
  const hash = sha256(Buffer.from(otp));
  return ethers.utils.hexlify(hash);
};

export const checkSameVersionWeb = async (): Promise<any> => {
  const versionWeb = await AsyncStorage.getItem(LOCALE_STORAGE.VERSION_WEB);
  if (
    !isEmpty(versionWeb) &&
    decryptData(versionWeb).toString() != APP_VERSION
  ) {
    await AsyncStorage.setItem(
      LOCALE_STORAGE.VERSION_WEB,
      JSON.stringify(encryptData(APP_VERSION)),
    );
    return false;
  }
  return true;
};

export const getMethodTx = (tx: string, method: any | unknown): any => {
  let res = method;
  try {
    const contract = ContractFromAddressCogiChain(tx);
    if (contract) {
      const pMethod = contract?.interface?.getFunction(method);
      if (pMethod) {
        res = pMethod.name;
      }
    }
  } catch {
    res = method;
  }
  return res;
};

export const decimalToHex = (value: number): string => {
  return "0x" + value.toString(16);
};

export const switchChainPerform = async (
  provider: any | unknown,
  chainId: any | unknown,
): Promise<any> => {
  providerCall(provider, "wallet_switchEthereumChain", [
    { chainId: decimalToHex(chainId) },
  ]).catch((e) => {
    if (e.code == 4001) return;
    const switchToChain = getNetworkByChainID(chainId);
    if (!switchToChain) return;
    const network: any = {
      chainId: decimalToHex(switchToChain.chainId),
      chainName: switchToChain.name,
      rpcUrls: [switchToChain.rpcUrl],
      nativeCurrency: switchToChain.nativeCurrency,
      blockExplorerUrls: [],
    };
    if (switchToChain.explorer != "") {
      network.blockExplorerUrls = [switchToChain.explorer];
    }
    providerCall(provider, "wallet_addEthereumChain", [network]).catch((e) => {
      // eslint-disable-next-line no-console
      console.log(e);
    });
  });
};

export const checkFundPasswordLocked = (): boolean | any => {
  const store = appState();
  const accountWeb = store?.account?.dataAccount;
  return (
    accountWeb?.fund_password_locked * 1000 - dayjs().valueOf() > 0 ?? false
  );
};

export const saveRememberFundPassword = async (
  data: any | unknown,
): Promise<any> => {
  if (data != null) {
    await AsyncStorage.setItem(
      LOCALE_STORAGE.SAVE_FUND_PASSWORD,
      JSON.stringify(encryptData(JSON.stringify(data))),
    );
  } else {
    await AsyncStorage.setItem(LOCALE_STORAGE.SAVE_FUND_PASSWORD, "");
  }
};

export const getRememberFundPassword = async (): Promise<string> => {
  let res = "";
  const data = decryptData(
    await AsyncStorage.getItem(LOCALE_STORAGE.SAVE_FUND_PASSWORD),
  );
  if (data && data != "") {
    const jsonData = JSON.parse(data);
    if (parseInt(jsonData.deadTime) > dayjs().valueOf() / 1000) {
      res = jsonData?.fund_password.toString();
    } else {
      saveRememberFundPassword({
        deadTime: 0,
        fund_password: "",
      });
    }
  }
  return res;
};
export const getRememberFundPasswordForApprove = (): any => {
  const now = Math.round(dayjs().valueOf() / 1000);
  const pin_approve = ClassWithStaticMethod.PIN_APPROVE;
  if (now < pin_approve.timestamp) {
    return pin_approve.pin;
  }
};

export const checkCreatePIN = (): boolean => {
  const store = appState();
  const accountWeb = store?.account?.dataAccount;
  return !accountWeb?.fund_password;
};

export const isLogined = (): boolean => {
  const store = appState();
  const accountWeb = store?.account?.dataAccount;
  if (isEmpty(descyptNEMOWallet(accountWeb?.nemo_address))) {
    return false;
  }
  return true;
};

export function isBigNumberish(value: any | unknown): value is BigNumberish {
  return (
    value != null &&
    (BigNumber.isBigNumber(value) ||
      (typeof value === "number" && value % 1 === 0) ||
      (typeof value === "string" && !!value.match(/^-?[0-9]+$/)) ||
      isHexString(value) ||
      typeof value === "bigint" ||
      isBytes(value))
  );
}

export const getImageTokenMarketplace_9DNFT = (): any => {
  return ICONS.nemo;
};

export const getRarerityForMarswar = (rarerity: string | number): string => {
  let res = "0-big";
  const _r = typeof rarerity === "string" ? parseInt(rarerity) : rarerity;
  switch (_r) {
    case 1:
      res = "1-big";
      break;
    case 2:
      res = "2-big";
      break;
    case 3:
      res = "3-big";
      break;
    case 4:
      res = "4-big";
      break;
    case 5:
      res = "6-big";
      break;
  }
  return res;
};

export const getRarerityInForSkillMarswar = (
  rarerity: number,
): number | any => {
  let res = 0;
  switch (rarerity.toString().toLowerCase()) {
    case "d":
      res = 1;
      break;
    case "c":
      res = 2;
      break;
    case "b":
      res = 3;
      break;
    case "a":
      res = 4;
      break;
    case "s":
      res = 6;
      break;
  }
  return res;
};

export const getRarerityInForMarswar = (rarerity: any | unknown): any => {
  if (isEmpty(rarerity))
    return {
      class: "",
      rarerity: "",
      value: rarerity,
    };
  const splitRare = rarerity?.trim()?.split(" ");
  if (splitRare.length == 2) {
    return {
      class: " pColor-" + getRarerityInForSkillMarswar(splitRare[0]),
      rarerity: capitalize(splitRare[0]),
      value: splitRare[1],
    };
  } else if (splitRare.length == 1) {
    return {
      class: "",
      rarerity: "",
      value: rarerity,
    };
  } else {
    return {
      class: "",
      rarerity: "",
      value: rarerity,
    };
  }
};

export const getRarerityForGalixCity = (nft: Nft): string => {
  let res = "0-big";
  if (!nft) return res;
  if (nft.metadataNftType == FILTER_NFT_TYPE_GLAIX.LAND) {
    res = nft.metadataLevel - 1 + "-big";
  } else if (nft.metadataNftType == FILTER_NFT_TYPE_GLAIX.HERO) {
    switch (nft?.metadataRarity) {
      case 1:
        res = "0-big";
        break;
      case 2:
        res = "1-big";
        break;
      case 3:
        res = "2-big";
        break;
      case 4:
        res = "3-big";
        break;
      case 5:
        res = "5-big";
        break;
      case 6:
        res = "6-big";
        break;
    }
  } else if (nft.metadataNftType == FILTER_NFT_TYPE_GLAIX.RESOURCE) {
    switch (nft?.metadataIndex) {
      case 1:
        res = "1-big";
        break;
      case 2:
        res = "1-big";
        break;
      case 3:
        res = "3-big";
        break;
      case 4:
        res = "3-big";
        break;
      case 5:
        res = "5-big";
        break;
      case 6:
        res = "5-big";
        break;
      case 7:
        res = "5-big";
        break;
    }
  } else if (nft.metadataNftType == FILTER_NFT_TYPE_GLAIX.MYSTERY_BOX) {
    switch (nft?.metadataRarity) {
      case 1:
        res = "3-big";
        break;
      case 2:
        res = "4-big";
        break;
      case 3:
        res = "6-big";
        break;
    }
  }
  return res;
};

export const getRarerityForGalixCityAttributes = (nft: any | unknown): any => {
  let res = "0-big";
  if (!nft) return res;
  if (nft?.nfttype?.value == FILTER_NFT_TYPE_GLAIX.LAND) {
    res = parseInt(nft.level) - 1 + "-big";
  } else if (nft?.nfttype?.value == FILTER_NFT_TYPE_GLAIX.HERO) {
    switch (parseInt(nft?.rarity?.value)) {
      case 1:
        res = "0-big";
        break;
      case 2:
        res = "1-big";
        break;
      case 3:
        res = "2-big";
        break;
      case 4:
        res = "3-big";
        break;
      case 5:
        res = "5-big";
        break;
      case 6:
        res = "6-big";
        break;
    }
  } else if (nft?.nfttype?.value == FILTER_NFT_TYPE_GLAIX.RESOURCE) {
    switch (parseInt(nft?.quality)) {
      case 1:
        res = "1-big";
        break;
      case 2:
        res = "1-big";
        break;
      case 3:
        res = "3-big";
        break;
      case 4:
        res = "3-big";
        break;
      case 5:
        res = "5-big";
        break;
      case 6:
        res = "5-big";
        break;
      case 7:
        res = "5-big";
        break;
    }
  }
  return res;
};

export const getRarerityForFlashPoint = (nft: Nft): any => {
  let res = "0-big";
  if (!nft) return res;
  switch (nft?.metadataQuality) {
    case 1:
      res = "1-big";
      break;
    case 2:
      res = "2-big";
      break;
    case 3:
      res = "3-big";
      break;
    case 4:
      res = "5-big";
      break;
    case 5:
      res = "4-big";
      break;
    case 6:
      res = "6-big";
      break;
  }
  return res;
};

export const getRarerityForFlashPointAttributes = (nft: any | unknown): any => {
  let res = "0-big";
  if (!nft) return res;
  switch (parseInt(nft?.quality?.value)) {
    case 1:
      res = "1-big";
      break;
    case 2:
      res = "2-big";
      break;
    case 3:
      res = "3-big";
      break;
    case 4:
      res = "5-big";
      break;
    case 5:
      res = "4-big";
      break;
    case 6:
      res = "6-big";
      break;
  }
  return res;
};

export const getBGColorFromSymbolGalix = (symbol: any | string): any => {
  const tmp = symbol?.toLowerCase();
  if (tmp == "gbox") return TITLE_COLOR_QUALITY.Blue;
  else if (tmp == "pbox") return TITLE_COLOR_QUALITY.Yellow;
  else return TITLE_COLOR_QUALITY.Red;
};

export const getBGColorFromSymbolMechaWarfare = (symbol: any | string): any => {
  const tmp = symbol?.toLowerCase();
  if (tmp == "n81mbox") return TITLE_COLOR_QUALITY.Blue;
  else if (tmp == "n81pbox") return TITLE_COLOR_QUALITY.Violet;
  else return TITLE_COLOR_QUALITY.Red;
};

export const getBGColorFromSymbol9DNFT = (symbol: any | string): any => {
  const tmp = symbol?.toLowerCase();
  if (tmp == "abox") return TITLE_COLOR_QUALITY.Red;
  else return TITLE_COLOR_QUALITY.Red;
};

export const getBGColorFromSymbolFLASHPOINT = (symbol: any | string): any => {
  const tmp = symbol?.toLowerCase();
  if (tmp == "babox") return TITLE_COLOR_QUALITY.Green;
  if (tmp == "gabox") return TITLE_COLOR_QUALITY.Blue;
  if (tmp == "ppbox") return TITLE_COLOR_QUALITY.Violet;
  else return TITLE_COLOR_QUALITY.White;
};

export const capitalize = (s: string): any => {
  return s && s.length > 1 ? s[0].toUpperCase() + s.slice(1) : s.toUpperCase();
};

export const checkStar = (
  star: string | number,
  grade: string | number,
): any => {
  if (star == 1 && grade == 1)
    return {
      image: "hero_star",
      number: 1,
    };
  else if (star == 2 && grade == 1)
    return {
      image: "hero_star",
      number: 2,
    };
  else if (star == 2 && grade == 2)
    return {
      image: "hero_star",
      number: 3,
    };
  else if (star == 3 && grade == 1)
    return {
      image: "hero_star",
      number: 4,
    };
  else if (star == 3 && grade == 2)
    return {
      image: "hero_star",
      number: 5,
    };
  else if (star == 3 && grade == 3)
    return {
      image: "hero_star_1",
      number: 1,
    };
  else if (star == 4 && grade == 1)
    return {
      image: "hero_star_1",
      number: 2,
    };
  else if (star == 4 && grade == 2)
    return {
      image: "hero_star_1",
      number: 3,
    };
  else if (star == 4 && grade == 3)
    return {
      image: "hero_star_1",
      number: 4,
    };
  else if (star == 4 && grade == 4)
    return {
      image: "hero_star_1",
      number: 5,
    };
  else if (star == 5 && grade == 1)
    return {
      image: "hero_star_2",
      number: 1,
    };
  else if (star == 5 && grade == 2)
    return {
      image: "hero_star_2",
      number: 2,
    };
  else if (star == 5 && grade == 3)
    return {
      image: "hero_star_2",
      number: 3,
    };
  else if (star == 5 && grade == 4)
    return {
      image: "hero_star_2",
      number: 4,
    };
  else if (star == 5 && grade == 5)
    return {
      image: "hero_star_2",
      number: 5,
    };
  else if (star == 6 && grade == 1)
    return {
      image: "hero_star_3",
      number: 1,
    };
  else
    return {
      image: "hero_star",
      number: 1,
    };
};

export const getFeeDeposit = (
  deposit: any | unknown,
  decimals = 18,
): number | any => {
  return toEther(deposit?.receive?.received?.minFees ?? 0, decimals);
};

export const getMinDeposit = (
  deposit: any | unknown,
  decimals = 18,
): number | any => {
  const x = toEther(deposit?.min_in_wei ?? 0, decimals);
  const y = toEther(deposit?.receive?.received?.minFees ?? 0, decimals);
  if (x > y) return x;
  else return y;
};

export const getFeeWithdraw = (min: any | unknown): number | any => {
  return toEther(min?.destination?.destination?.minFees ?? 0);
};

export const getMinWithdraw = (min: any | unknown): number | any => {
  const x = toEther(min?.min_in_wei ?? 0);
  const y = toEther(min?.destination?.destination?.minFees ?? 0);
  if (x > y) return x;
  else return y;
};

export function imageExists(image_url: any) {
  const http = new XMLHttpRequest();

  http.open("HEAD", image_url, false);
  http.send();

  return http.status != 404;
}

export const translateMessage = (key: any | string) => {
  const result = i18n.t(key);
  if (result == key) return "";
  return result;
};

export const keyboardListener = (
  imageHeight: any,
  minHeight = 80,
  maxHeight = 160,
) => {
  const keyboardWillShow = () => {
    Animated.timing(imageHeight, {
      duration: 300,
      toValue: minHeight,
    }).start();
  };

  const keyboardWillHide = () => {
    Animated.timing(imageHeight, {
      duration: 300,
      toValue: maxHeight,
    }).start();
  };
  const keyboardWillShowSub = Keyboard.addListener(
    "keyboardDidShow",
    keyboardWillShow,
  );
  const keyboardWillHideSub = Keyboard.addListener(
    "keyboardDidHide",
    keyboardWillHide,
  );

  return () => {
    keyboardWillShowSub.remove();
    keyboardWillHideSub.remove();
  };
};

export const customBase64Encode = (input: any) => {
  const base64Chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const paddingChar = "=";

  let output = "";
  let buffer = 0;
  let bufferLength = 0;

  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i);
    buffer = (buffer << 8) | charCode;
    bufferLength += 8;

    while (bufferLength >= 6) {
      const index = (buffer >> (bufferLength - 6)) & 0x3f;
      output += base64Chars.charAt(index);
      bufferLength -= 6;
    }
  }

  // Handle any remaining bits in the buffer
  if (bufferLength > 0) {
    const index = (buffer << (6 - bufferLength)) & 0x3f;
    output += base64Chars.charAt(index);
  }

  // Add padding if necessary
  while (output.length % 4 !== 0) {
    output += paddingChar;
  }

  return output;
};
