import DeviceInfo from "react-native-device-info";
import { SIZES } from "../themes/theme";

export const PROD = false;
export const CHAINID_COGI = PROD ? 76923 : 5555;
export const DEFAULT_CHAINID = PROD ? 76923 : 5555;
export const APP_VERSION = DeviceInfo.getVersion();
export const APP_VERSION_EXTENSION = DeviceInfo.getBuildNumber();
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const MARKET_OFFER_ENABLED = true;
export const DEFAULT_MAX_VALUE_FILTER = 1000000000;
export const DEFAULT_MAX_VALUE_FILTER_DASHBOARD = 1000000000;
export const STATUS_AVAILABLE_NFT = 3;
export const DEFAULT_NUM_NFT_FILTER_BY_NAME = 999;
export const API_KEY = "yYpMfsQt5BUB857umEdZ8z";
export const TIME_OTP = 180;
export const PERCENT_AFTER_BURN = 85;
export const IMAGE_COGI =
  "https://cloud.gsscorp.vn/f/8f625bafae644bada448/?dl=1";
export const IMAGE_COD =
  "https://cloud.gsscorp.vn/f/b8fb8a669f294e99b037/?dl=1";
export const PUBLIC_KEY =
  "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAznURZcvuyMtuX2Rt6zo4+1twP/01l+9glSQvfaqmyxxnt9mxSoNEYeOdmE6szInJi1q8hFCc1QZgNgUqt/7vaFq57BpcmKFPASYkJFPooaPPLnWk7FIIZd4wKD6I+SIxOqUVUPMxQGznKtGwXmDA3uNUsXn14sYs5O+GLh/Vv+ziLFMgBiHQFV68XQqdwoQrXmA7o1EeWCnq9NVfc9vDTJYdCNF5Bl4PZXBNd2KxGZtHh1/puLNQMgFN6zemCa643iZtFthUF7AWQC4qjc92KhM3pb1BON/xBVKu/r82HI0g1vpW04Yn6jlyY/PRbReD+djZuTmlvBIaSLB+5v+a2QIDAQAB";
export const SECRET_KEY = "yYpMfsQt5BUB857umEdZ";
export const CANVAS_WIDTH = SIZES.width - 32;
export const CANVAS_HEIGHT = SIZES.width - 32;
export const CANVAS_WIDTH_DETAIL = SIZES.width - 64;
export const CANVAS_HEIGHT_DETAIL = SIZES.width - 64;
export const CANVAS_FLAG_WIDTH_DETAIL = 960;
export const CANVAS_FLAG_HEIGHT_DETAIL = 576;
export const RATIO_MINI_MAP = 5;
export const LINK_ACCOUNT = PROD
  ? "https://marketplace.galixcity.io/?t=account&refer_id="
  : "https://test-market.galixcity.io/?t=account&refer_id=";
export const KEY_BAMS =
  "626fbc4008d1c1bef2a73c58247396fa195f284adddf301e8bd8dc4fec910aca";
export const LINK_P2P = PROD
  ? "https://nemoverse.io/"
  : "https://testnet.nemoverse.io/";

export const ENDPOINT_RPC = PROD ? "/nemo-wallet/" : "/nemo-wallet-testnet/";
export const URI_DIRECT = "";
export const TIME_SLEEP = 25 * 1000;
export const QUERY_DEFAULT_STATE_GID = "back_sign_up";
export const MAX_GAS_FEE = 0.06879;
export const LINK_WALLET = "https://nemoverse.io";
export const MAX_BIG =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
export const ERROR_MESSSAGE_NOT_TIME_SIGNATURE = "access_signature expired";
export const TIME_STEP = 1000 * 20;
export const MAX_STEP_WITHDRAW = 8;
export const DEEP_LINK_MARKETPLACE = PROD
  ? "https://nemoverse.io/"
  : "https://testnet.nemoverse.io/";
export const DEEP_LINK = PROD
  ? "https://nemoverse.io"
  : "https://testnet.nemoverse.io";
export const DEEP_LINK_ID = "nemo.app://";
