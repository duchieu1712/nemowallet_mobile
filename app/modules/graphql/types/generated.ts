export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: number;
  BigInt: number;
  Long: number;
}

export interface AskOrder {
  __typename?: "AskOrder";
  /** Collection */
  collection: Collection;
  /** Block hash */
  id: Scalars["ID"];
  /** isTradable */
  isTradable: Scalars["Boolean"];
  /** NFT */
  nft: Nft;
  /** Ask Price */
  price: Scalars["BigDecimal"];
  /** Seller */
  seller: User;
  /** Updated at */
  updatedAt: Scalars["BigInt"];
}

export interface BidOrder {
  __typename?: "BidOrder";
  /** Buyer */
  buyer: User;
  /** Collection */
  collection: Collection;
  /** ask ID + buyer ID */
  id: Scalars["ID"];
  /** isTradable */
  isTradable: Scalars["Boolean"];
  /** NFT */
  nft: Nft;
  /** Bid Price */
  price: Scalars["BigDecimal"];
  /** Updated at */
  updatedAt: Scalars["BigInt"];
}

export interface Collection {
  __typename?: "Collection";
  /** ID (address) */
  id: Scalars["ID"];
  /** Name */
  name: Scalars["String"];
  /** List of NFTs */
  nfts: Nft[];
  /** Symbol */
  symbol: Scalars["String"];
}

export interface Metadata {
  __typename?: "Metadata";
  /** List of attribute */
  attributes: MetadataAttribute[];
  /** Description */
  description: Scalars["String"];
  /** ID (cid) */
  id?: Scalars["ID"];
  /** Image */
  image: Scalars["String"];
  /** Name */
  name: Scalars["String"];
  /** NFT */
  nft?: Maybe<Nft>;
}

export interface MetadataAttribute {
  __typename?: "MetadataAttribute";
  /** display_type */
  display_type?: Scalars["String"];
  /** Metadata + incr */
  id?: Scalars["ID"];
  /** Metadata (cid) */
  metadata?: Metadata;
  /** trait_type */
  trait_type?: Scalars["String"];
  /** value */
  value?: Scalars["String"];
}

export interface Nft {
  __typename?: "NFT";
  /** current ask ID */
  askId?: Maybe<Scalars["String"]>;
  /** ask Price */
  askPrice: Scalars["BigDecimal"];
  /** asks */
  asks: AskOrder[];
  /** current bid ID */
  bidId?: Maybe<Array<Scalars["String"]>>;
  /** bids */
  bids: BidOrder[];
  /** Collection address */
  collection: Collection;
  /** CollectionAddress + tokenId */
  id: Scalars["ID"];
  /** isTradable */
  isTradable: Scalars["Boolean"];
  /** Metadata cid */
  metadata: Metadata;
  /** Metadata Type */
  metadataLevel: Scalars["Int"];
  /** Metadata Name */
  metadataNames: Scalars["String"];
  /** Metadata Type */
  metadataType: Scalars["String"];
  /** metadata NftType Type */
  metadataNftType: Scalars["String"];
  /** metadata Rarity */
  metadataRarity: Scalars["BigInt"];
  /** metadata Quality */
  metadataQuality: Scalars["BigInt"];
  /** metadata Index */
  metadataIndex: Scalars["BigInt"];
  /** Owner */
  owner: User;
  /** seller */
  seller: User;
  /** tokenId */
  tokenId: Scalars["BigInt"];
  /** Transaction history */
  transactionHistory: Transaction[];
  /** Updated at */
  updatedAt: Scalars["BigInt"];
}

export interface Transaction {
  __typename?: "Transaction";
  block: Scalars["BigInt"];
  /** Collection */
  collection: Collection;
  id: Scalars["ID"];
  /** Kind */
  kind: TransactionKind;
  /** NFT */
  nft: Nft;
  /** price (in COGI) */
  price: Scalars["BigDecimal"];
  /** transfer Recipient */
  recipient: User;
  /** transfer Sender */
  sender: User;
  /** Timestamp */
  timestamp: Scalars["BigInt"];
}

export enum TransactionKind {
  Bid = "Bid",
  Burn = "Burn",
  Cancel = "Cancel",
  Ino = "INO",
  List = "List",
  Mint = "Mint",
  Sale = "Sale",
  Transfer = "Transfer",
}

export interface User {
  __typename?: "User";
  /** List of NFTs */
  askNfts: Nft[];
  /** User address */
  id: Scalars["ID"];
  /** NFTs */
  nfts: Nft[];
  /** Number of tokens */
  numberTokens: Scalars["BigInt"];
  /** Number of tokens currently listed */
  numberTokensListed: Scalars["BigInt"];
  /** Number of tokens purchased */
  numberTokensPurchased: Scalars["BigInt"];
  /** Number of tokens sold */
  numberTokensSold: Scalars["BigInt"];
}

export interface Statistic {
  __typename?: "Statistic";
  /** Statistic address */
  id: Scalars["ID"];
  /** Collection */
  collection: Collection;
  /** time */
  time: Scalars["BigInt"];
  /** totalTransaction */
  totalTransaction: Scalars["BigInt"];
  /** volume */
  volume: Scalars["BigInt"];
}

export interface UserStake {
  id: Scalars["ID"];
  /** ID (pooladdress + address) */

  poolStaked: Pool;
  /** Pool user staked */

  totalPack: Scalars["BigInt"];
  /** How many pack the user has staked */

  totalDone: Scalars["BigInt"];
  /** How many staking pack has done */

  totalReceived: Scalars["BigInt"];
  /** How many staking pack user has received */

  lastTimeReceiveReward: Scalars["BigInt"];
  /** The amount of time it takes to complete the last package */

  timeOfPack: [Scalars["BigInt"]];
  /** Metadata Type */
}

export interface Pool {
  id: Scalars["ID"];
  /** ID (address) */

  rewardToken: CollectionPool;
  /** reward token */

  stakedToken: CollectionPool;
  /** staked token */

  stakeLocked: Scalars["Boolean"];
  /** Whether can stake token */

  startTime: Scalars["BigInt"];
  /** start time  */

  packLimitPerUser: Scalars["BigInt"];
  /** The limit per user (0 if none) */

  totalPackSupply: Scalars["BigInt"];
  /** The pack supply  */

  timePerPack: Scalars["BigInt"];
  /** The lock duration per pack */

  tokenPerPack: Scalars["BigInt"];
  /** The amount token lock per pack */

  totalStaked: Scalars["BigInt"];
  /** Total package has staked */

  image: Scalars["String"];
  /** Total package has staked */

  users: [UserStake];
}

export enum TokenKind {
  ERC20 = "ERC20",
  ERC721 = "ERC721",
}

export interface CollectionPool {
  id: Scalars["ID"];
  /** ID (address) */

  tokenKind: TokenKind;
  /** ERC20 or ERC721 */

  name: Scalars["String"];
  /** Name */

  symbol: Scalars["String"];
  /** Symbol */
}

export interface Lottery {
  id: Scalars["ID"];
  /** ID */
  totalUsers: Scalars["BigInt"];
  totalTickets: Scalars["BigInt"];
  totalCogi: Scalars["BigDecimal"];
  totalUsd: Scalars["BigDecimal"];
  totalCogiInjected: Scalars["BigDecimal"];
  status: Status;
  finalNumber: Scalars["BigInt"];
  winningTickets: Scalars["BigInt"];
  claimedTickets: Scalars["BigInt"];
  startTime: Scalars["BigInt"];
  endTime: Scalars["BigInt"];
  ticketPrice: Scalars["BigDecimal"];
  firstTicket: Scalars["BigInt"];
  lastTicket: Scalars["BigInt"];
  block: Scalars["BigInt"];
  /** Block */
  timestamp: Scalars["BigInt"];
  /** Block timestamp */
}

export enum Status {
  Pending = "Pending",
  Open = "Open",
  Close = "Close",
  Claimable = "Claimable",
}

export interface UserLottery {
  id: Scalars["ID"];
  /** ID */
  totalRounds: Scalars["BigInt"];
  totalTickets: Scalars["BigInt"];
  rounds: Round;
  totalCogi: Scalars["BigDecimal"];
  totalCogiClaimed: Scalars["BigDecimal"];
  totalUsdClaimed: Scalars["BigDecimal"];
  block: Scalars["BigInt"];
  /** Block */
  timestamp: Scalars["BigInt"];
  /** Block timestamp */
}

export interface Round {
  id: Scalars["ID"];
  /** ID */
  lottery: Lottery;
  user: UserLottery;
  claimed: Scalars["Boolean"];
  totalTickets: Scalars["BigInt"];
  totalCogiClaimed: Scalars["BigDecimal"];
  totalUsdClaimed: Scalars["BigDecimal"];
  block: Scalars["BigInt"];
  /** Block */
  timestamp: Scalars["BigInt"];
  /** Block timestamp */
}

export interface PoolStake {
  id: Scalars["ID"];
  totalReward: Scalars["BigDecimal"];
  totalSupply: Scalars["BigDecimal"];
  whitelistToken: [CollectionStaking];
  users: [UserStaking];
}

export interface UserStaking {
  id: Scalars["ID"];
  address: Scalars["String"];
  poolStaked: PoolStake;
  staked: [Asset];
  totalStaked: Scalars["BigDecimal"];
  totalReceived: Scalars["BigDecimal"];
}

export interface CollectionStaking {
  id: Scalars["ID"];
  address: Scalars["String"];
  pool: PoolStake;
  removed: Scalars["Boolean"];
}

export interface Asset {
  id: Scalars["ID"];
  owner: UserStaking;
  collection: CollectionStaking;
  balance: Scalars["BigDecimal"];
}

// Mystery Box

export interface Box {
  id: Scalars["ID"];
  /** ID (address) */

  rewardToken: CollectionPool;
  /** reward token */

  stakedToken: CollectionPool;
  /** staked token */

  stakeLocked: Scalars["Boolean"];
  /** Whether can stake token */

  startTime: Scalars["BigInt"];
  /** start time  */

  packLimitPerUser: Scalars["BigInt"];
  /** The limit per user (0 if none) */

  totalPackSupply: Scalars["BigInt"];
  /** The pack supply  */

  timePerPack: Scalars["BigInt"];
  /** The lock duration per pack */

  tokenPerPack: Scalars["BigInt"];
  /** The amount token lock per pack */

  totalStaked: Scalars["BigInt"];
  /** Total package has staked */

  image: Scalars["String"];
  /** Total package has staked */

  users: [UserStake];
}

export interface PoolRentingLand {
  id: Scalars["ID"];
  /** "Minimun rent time to claim reward" */
  crossTime: Scalars["BigInt"];

  /** "Address of land nft" */
  land: Scalars["String"];

  /** "Address of currency" */
  currency: Scalars["String"];

  /** "Level of land" */
  levels: [Scalars["BigInt"]];

  /** "Reward per cliff timestamp follow land level" */
  rewards: [Scalars["BigDecimal"]];

  /** "Cliff timestamp" */
  cliffTimestamps: [Scalars["BigInt"]];

  hasWhitelist: Scalars["Boolean"];
  /** Tokens in whitelist */
  whitelistTokens: [Scalars["BigInt"]];
  users: [UserRentingLand];
}

export interface UserRentingLand {
  /** " "ID (pooladdress + address)" */
  id: Scalars["ID"];
  /** "Address of land nft" */
  address: Scalars["String"];

  /** "Address of currency" */
  poolStaked: PoolRentingLand;
  /** "Lendlease" */
  lended: [LeaseRentingLand];
}

export interface LeaseRentingLand {
  /** "ID (collection id + token id)" */
  id: Scalars["ID"];

  /** "Address of lender" */
  owner: UserRentingLand;

  /** "Token ID" */
  tokenId: Scalars["BigInt"];

  /** "Level at lending time" */
  level: Scalars["BigInt"];

  /** "Last claim reward" */
  lastClaim: Scalars["BigInt"];

  /** "Total reward claimed" */
  received: Scalars["BigDecimal"];

  /** "User recalled land" */
  recalled: Scalars["Boolean"];

  /** Notified recall */
  notified: Scalars["Boolean"];
  /** time notify recall */
  notifiedAt: Scalars["BigInt"];
  /** recall after lock time */
  locked: Scalars["BigInt"];
}

export interface PoolSimpleEarn {
  id: Scalars["ID"];
  nativeTokenAllowed: Scalars["Boolean"];
  stakingToken: Scalars["String"];
  rewardsToken: Scalars["String"];
  products: ProductSimpleEarn[];
}

export interface SubscribedUser {
  id: Scalars["ID"];
  subscriptionId: Scalars["BigInt"];
  product: ProductSimpleEarn;
  account: Scalars["String"];
  subscriptionDate: Scalars["BigInt"];
  valueDate: Scalars["BigInt"];
  interestEndDate: Scalars["BigInt"];
  redeemedDate: Scalars["BigInt"];
  rewardAmount: Scalars["BigDecimal"];
  redeemed: Scalars["Boolean"];
}

export interface ProductSimpleEarn {
  id: Scalars["ID"];
  pool: PoolSimpleEarn;
  lockPeriod: Scalars["String"];
  rewardRate: Scalars["String"];
  rewardRateEarlier: Scalars["String"];
  price: Scalars["BigInt"];
  limit: Scalars["BigInt"];
  limitPerUser: Scalars["BigInt"];
  sold: Scalars["BigInt"];
  redeemed: Scalars["BigInt"];
  paid: Scalars["BigDecimal"];
  subscriptions: SubscribedUser[];
  endDate: Scalars["BigInt"];
  startDate: Scalars["BigInt"];
  roundDate: Scalars["BigInt"];
}
