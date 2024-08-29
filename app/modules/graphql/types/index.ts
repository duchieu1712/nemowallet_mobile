import {
  type Nft,
  type BidOrder,
  type Transaction,
  type Pool,
  type UserStake,
  type PoolSimpleEarn,
} from "./generated";

export interface PageInfo {
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export interface NftsData {
  nfts: Nft[];
  pageInfo: PageInfo;
}

export interface BidsData {
  bids: BidOrder[];
  pageInfo: PageInfo;
}

export interface PoolsData {
  pools: PoolSimpleEarn[];
  pageInfo: PageInfo;
}

export interface BoxsData {
  boxs: Pool[];
  pageInfo: PageInfo;
}

export interface UserStakesData {
  users: UserStake[];
  pageInfo: PageInfo;
}

export interface TransactionsData {
  trans: Transaction[];
  pageInfo: PageInfo;
}

export interface DashboardData {
  numTransaction: number;
  totalPriceTransaction: number;
  avgTotalPriceTransaction: number;
}
