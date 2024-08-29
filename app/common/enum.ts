export enum KogiApi {
  TRANSACTION_INTERNAL = 207,
  TRANSACTION_AWARD = 206,
  TRANSACTION_CHARGE = 205,
  TRANSACTION_CLAIMTOKEN = 204,
  TRANSACTION_ONCHAIN = 203,
  TRANSACTION_OFFCHAIN = 202,
  TRANSACTION_WITHDRAW = 201,
  TRANSACTION_DEPOSIT = 200,
  NFT_EVENT = 100,
  UNLOCKED = 51,
  TRANSFER = 50,
  NFT_REQUEST_MINT = 4,
  HOTWALLET_ON_FORWARD = 4,
  HOTWALLET_ON_SUCCESS = 3,
  CONTRACT_ON_SUCCESS = 3,
  NFT_MINT_TX_SUCCESS = 3,
  TX_SUCCESS = 3,
  CONTRACT_ON_HASH = 2,
  NFT_MINT_TX_HASH = 2,
  HOTWALLET_ON_QUEUE = 1,
  CONTRACT_ON_QUEUE = 1,
  NFT_MINT_QUEUE = 1,
  TX_PENDING = 9, // An sửa 1 thành 9
  NORMAL = 1,
  WALLET_SUSPENDED = 0,
  NOPE = 0,
  QUEUE = 0,
  HOTWALLET_OVERBALANCE = -1,
  HOTWALLET_REQUEST_WITHDRAW_DUPLICATE = -1,
  NFT_MINT_DUPLICATE = -1,
  INPUT_INVALID = -1,
  HOTWALLET_ON_FAILED = -3,
  CONTRACT_ON_FAILED = -3,
  NFT_MINT_TX_FAILED = -3,
  TX_FAILED = -3,
  BURNED = -50,
  LOCKED = -51,
  UNAUTHORIZED = -401,
  INPUT_SOMETHING_WRONG = -500,
  NFT_CONVERT_SUCCESS = 5,
  NFT_CONVERT_REQUEST_CLAIM = 10,
  NFT_CONVERT_WAIT_ON_CHAIN = 11,
}

export enum ListInventory {
  LIST_FULL = "My Items",
  LIST_SELLING = "My Listing",
  LIST_OFFERING = "My Offers",
  LIST_SOLD = "My Sold Items",
}

export enum ListDashboard {
  RECENTLY_LIST = "recently-list",
  RECENTLY_SOLD = "recently-sold",
}

export enum ColorPurifiedAttributes {
  // Attributes
  ATTR_0 = "#B6B6D2",
  ATTR_1 = "#21A232",
  ATTR_2 = "#0793FF",
  ATTR_3 = "#A15AFF",
  ATTR_4 = "#FFBF00",
  ATTR_5 = "#FF5735",
  ATTR_6 = "#FF1E1E",
}

export enum List_Coin {
  GALIX_COIN = "galix_coin",
  NEMO_COIN = "nemo_coin",
  COGI_COIN = "cogi_coin",
}

export enum FILTER_DASHBOARD {
  DAY = 1,
  WEEK = 2,
  MONTH = 3,
  TOTAL = 4,
}

export enum Page_Acccount {
  GAME_ACCOUNT = "game-account",
  SECURITY = "security",
}

// export enum STAKE_TYPE {
//   FARM = 'farm',
//   POOL = 'pool',
//   ITEM = 'item',
// }

// export enum STAKE_COIN {
//   COGI,
//   COD,
// }

export enum SYMBOL_POOL {
  SIBX = "SIBX",
  GOBX = "GOBX",
  PLBX = "PLBX",
  DIBX = "DIBX",
  MYBX = "MYBX",
}

export enum FILTER_LOTTERY {
  DRAW_HISTORY = 1,
  YOUR_HISTORY = 2,
}

export enum MATCH_FIRST {
  FIRST_1 = 2,
  FIRST_2 = 3,
  FIRST_3 = 10,
  FIRST_4 = 25,
  FIRST_5 = 45,
  BURN = 15,
}

export enum RESULT_LOTTERY {
  MATCH_1 = 0,
  MATCH_2 = 1,
  MATCH_3 = 2,
  MATCH_4 = 3,
  MATCH_5 = 4,
  NO_MATCH = 999,
  NO_TIME_PRIZE = 998,
}

export enum POSITION_POPUP {
  LEFT,
  RIGHT,
}

export enum FLAG_CLAIMED {
  CLAIMED = 1,
  NOT_CLAIMED = 0,
}

export enum FILTER_NFT_TYPE {
  ALL = "All",
  HERO = "Hero",
  RESOURCE = "Resource",
  LAND = "Land",
  MYSTERY_BOX = "Box",
}

export enum FILTER_NFT_TYPE_GALIX_MARKET {
  HERO = "Hero",
  RESOURCE = "Resource",
  LAND = "Land",
  MYSTERY_BOX = "Box",
  PACKAGE = "Package",
}

export enum FILTER_NFT_TYPE_RICHWORK_FARM_FAMILY_MARKET {
  Dream_Farm = "Dream Farm",
  Farm_Tycoon = "Farm Tycoon",
  Fruit_Farmer = "Fruit Farmer",
  Hyper_Harvester = "Hyper Harvester",
  Land_Owner = "Land Owner",
}

export enum FILTER_NFT_TYPE_FLASHPOINT_MARKET {
  WEAPON = "Weapon",
}

export enum FILTER_NFT_TYPE_MARSWAR_MARKET {
  HERO = "Hero",
  EQUIPMENT = "Equipment",
  MATERIAL = "Material",
  MYSTERY_BOX = "Mystery Box",
}

export enum FILTER_NFT_TYPE_9DNFT_MARKET {
  MYSTERY_BOX = "Mystery Box",
}

export enum FILTER_NFT_DETAIL {
  INFO = 1,
  TRADE = 2,
}

export enum FILTER_BUY_SELL_NEMO {
  BUY = 1,
  SELL = 2,
}

export enum FILTER_LANDING {
  LAND = "land",
  MAP = "map",
  MYSTERY_HOUSE = "mystery_house",
  RENTING_LAND = "renting_land",
}

export enum FILTER_STAKE_TYPE {
  ALL = 1,
  STAKE = 2,
  UNSTAKE = 3,
}

export enum STATUS_LAND {
  LANDSTATUS_DISABLED = 0, // disabled, not open for sale yet - black
  LANDSTATUS_ONSALE = 1, // open for sale - blue
  LANDSTATUS_NOTONSAL = 2, // not open for sale yet - black
  LANDSTATUS_SOLD = 3, // already sold, have an owner - red
  LANDSTATUS_LOCKED = 4, // user sold- locked
}

export enum STATUS_LAND_SALE {
  LANDSTATUS_AVAILABLE = 1, // AVAILABLE
  LANDSTATUS_CONFIRM = 2, // CONFIRM
  LANDSTATUS_NOTONSAL = 3, // Not sale
}

export enum TYPE_RESOURCE {
  RESOURCE_CRYTAL = 1,
  RESOURCE_METAL = 1,
  RESOURCE_FUEL = 2,
  RESOURCE_ELECTRICITY = 4,
}

export enum TYPE_PACKAGE {
  PACKAGE_50K = 50000011,
  PACKAGE_100K = 50000012,
  PACKAGE_500K = 50000013,
  PACKAGE_1M = 50000014,
  PACKAGE_2M = 50000015,
}

export enum TYPE_LOGIN {
  PHONE,
  EMAIL,
}

export enum SYMBOL_MYSTERY_BOX {
  GOBX = "GOBX",
  PLBX = "PLBX",
  DIBX = "DIBX",
}

export enum STAGE_MYSTERYBOX {
  END = 0,
  STAGE_1_PRIVATE = 1,
  STAGE_1_PUBLIC = 2,
  STAGE_2_PRIVATE = 3,
  STAGE_2_PUBLIC = 4,
  INIT_STAGE_1 = 5,
  INIT_STAGE_2 = 6,
}

export enum VIEW_REFER_FROM {
  STEP_3 = 1,
  INFO = 2,
}

export enum LOCALE_STORAGE {
  REMEMBER_ME = "rememberme",
  ACCOUNT = "avbbdf",
  CODE_LOGIN_GID = "bvvvvvvv",
  STATE_LOGIN_GID = "werw",
  CODE_LOGIN = "bbbbbbsd",
  FLAG_SIGNOUT = "adasdasdasd",
  VERSION_WEB = "aaaae2e3",
  SHOW_AGAIN_BANNER = "aaa343434",
  SAVE_FUND_PASSWORD = "ssdf1211",
  IS_DARK_THEME = "aaxcsdasdasd",
  LANGUAGE = "axxxfdfdfdf",

  ON_TOUCHID = "gdfgdfgdfgdfg",
  IS_ON_BORDING = "IS_ON_BORDING",
  TIME_BACK_GROUND = "fsdfsdfsdf",
  IS_SCREEN_POP_BACK_GROUND = "xxffdfdfd",
  METHOD_LOGIN = "sfsdfnsdlkfnsdlf",

  _TOP_SEARCH = "top_search",
  _TOP_SEARCH_ITEMS = "top_search_items",
  _EVENTS = "events",
  _WALLET = "wallet",
  _NFTS = "nfts",
  _VERSION = "version",
  IS_LOGINED = "sfsfsdfsdfsd",
  _DATA_DEEP_LINGING = "sfopopppo",
}

export enum NETWORK_TYPE {
  MAINNET = "mainnet",
  TESTNET = "testnet",
}

export enum SERVICE_ID {
  _9DNFT = "10000",
  _GALIXCITY = "20000",
  _SOUL_REALM = "30000",
  _HEAVEN_SWORD = "40000",
  _MARSWAR = "50000",
  _NARUTO = "60000",
  _FLASHPOINT = "70000",
  _RICHWORK_FARM_FAMILY = "80000",
  _OPS_ALPHA = "11000",
}

export enum TYPE_DEPOSIT_WITHDRAW {
  _TYPE_WITHDRAW,
  _TYPE_DEPOSIT,
}

export enum NAMESPACE_DEPOSIT_WITHDRAW {
  _FUJI = "bridge",
  _BSC = "bridge",
  _NEMO = "bridge",
}

export enum FLAG_SECURITY {
  ACTIVE,
  CHANGE,
  DELETE,
}

export enum RESPONSE {
  SUCCESS,
  ERROR,
}

export enum TAB_MY_WALLET_TOKEN {
  LIST_TOKEN,
  TX_HISTORY,
  TX_PENDING,
}

export enum TAB_HISTORY_TOKEN {
  TX_HISTORY_ALL = "TX_HISTORY_ALL",
  TX_HISTORY_SEND = "TX_HISTORY_SEND",
  TX_HISTORY_RECEIVE = "TX_HISTORY_RECEIVE",
}

export enum TAB_MY_WALLET_NFT {
  LIST_NFT,
  TX_HISTORY,
}

export enum TAB_MY_WALLET {
  TOKEN = "token",
  NFT = "nft",
}

export enum TYPE_NFT {
  ERC_20 = "ERC-20",
  ERC_721 = "ERC-721",
}

export enum TYPE_ACTION {
  SEND,
  RECECEIVE,
}

export enum FLAG_APPROVE {
  RECALL,
  APPROVE,
  APPROVEALL,
}

export enum TYPE_DEPOSIT {
  DEPOSIT = "deposit",
  DEPOSIT_AUTO = "deposit_auto",
}

export enum TYPE_WITHDRAW {
  WITHDRAW = "withdraw",
  WITHDRAW_AUTO = "withdraw_auto",
}

export enum TAB_STAKING {
  STAKING_PACK = 0,
  STAKING_HISTORY = 1,
}

export enum TAB_WALLET {
  COINS = 0,
  NFTS = 1,
}

export enum TAB_LANDPORTAL {
  LAND = 0,
  MAP = 1,
  MYSTERY_HOUSE = 2,
}

export enum TAB_NOTIFICATIONS {
  ANNOUNCEMENT = 0,
  TRANSACTIONS = 1,
  NEWS = 2,
}

export enum SELECT_DAY_STAKING_PACK {
  _30_DAYS = "30 Days",
  _60_DAYS = "60 Days",
  _90_DAYS = "90 Days",
  _120_DAYS = "120 Days",
  _FLEXIBLE = "Flexible",
}

export enum TOP_SERVICE_VOTE {
  TOP_1 = "top_1",
  TOP_2 = "top_2",
  TOP_3 = "top_3",
  TOP_4 = "top_4",
  TOP_5 = "top_5",
  TOP_6 = "top_6",
  TOP_7 = "top_7",
  TOP_8 = "top_8",
  TOP_9 = "top_9",
}

export enum TYPE_WITHDRAW_ADDRESS_EMAIL {
  ADDRESS = "ADDRESS",
  EMAIL = "EMAIL",
}

export enum PACKAGE_STAKING {
  _DIAMOND = 500000,
  _PLATINUM = 100000,
  _GOLD = 50000,
  _SILVER = 10000,
  _BRONZE = 1000,
}

export enum ENUM_ENDPOINT_RPC {
  _NEMO_WALLET,
  _GALIXCITY,
  _MECHA_WARFARE,
  _9DNFT,
  _FLASHPOINT,
  _RICHWORK_FARM_FAMILY,
}

export enum TAB_BOTTOM_INO_BOX {
  OVERVIEW = "overview",
  RULE = "rule",
  VIDEO = "video",
}

export enum TYPE_GAME_MECHA {
  MEDAL = "paladin medal",
  WEAPON = "weapon",
  VALARION_R = "valarion r",
  VALARION_SR = "valarion sr",
  VALARION_SSR = "valarion ssr",
  VALARION_UR = "valarion ur",
}

export enum RESPONSE_CODE_RPC {
  _UNAUTHORIZED = 4100,
}
// export enum TYPE_GAME_9DNFT {
//   CHEST = 'chest',
//   BOX = 'box',
//   TRESURE = 'tresure',
//   TREASURE = 'treasure'
// }

export enum LANGUAGE {
  _VIETNAM = "vi",
  _ENGLAND = "en",
}

export enum TAB_NFTS {
  MARKETPLACE = 0,
  DASHBOARD = 1,
  INVENTORY = 2,
  TX_NFTS = 3,
}
export enum _9D_MYSTERYBOX {
  ABOX = "abox",
  DBOX = "dbox",
}

export enum TYPE_METHOD_LOGIN {
  FACEBOOK = "facebook",
  GOOGLE = "google",
  APPLE_ID = "appleid",
}
// export enum TAB_STAKING {
//   STAKE_PACK = 0,
//   HISTORY = 1,
// }

export enum SIGN_IN_ERROR {
  UNVERIFIED_EMAIL = 1001,
  MISSING_PHONE_EMAIL = 1002,
  MISSING_PASSWORD = 1003,
  INVALID_EMAIL_PASSWORD = 1004,
  INVALID_EMAIL_PHONE = 1005,
  UNVERIFIED_PHONE = 1007,
  SCHEDULE_DELETION = 9007,
}

export enum NFTS_INDEX {
  _MARKETPLACE = 0,
  _DASHBOARD = 1,
  _INVENVTORY = 2,
  _TXNFTS = 3,
}

export enum BOTTOM_MENU {
  _WALLET = "Wallet",
  _NFTS = "NFTs",
  _PRODUCT = "Product",
  _EVENTS = "Events",
}

export enum TYPE_NOTIFY {
  CHANGE = "change",
  UPDATE_APP = "update app",
  SWAP = "swap",
  WITHDRAW = "withdraw",
  DEPOSIT = "deposit",
  NEWS = "news",
}
