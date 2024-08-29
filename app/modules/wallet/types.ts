import { type Contract } from "ethers";
import { CHAINID_COGI } from "../../common/constants";
import { type ISignaturePersonal } from "../../common/types";

export enum ErrorCode {
  ConnectWrongNetwork = -500,
  ConnectUserCancel = -499,
  ConnectUser_AccountWeb = -404,
}

export interface ContractCallRequest {
  namespace: string | any;
  method: string;
  params: any[];
}

export interface WalletContract {
  namespace: string;
  contract: Contract;
}

export interface State {
  web3Modal?: any;
  provider?: any;
  web3Provider?: any;
  address?: string | null;
  chainId?: number | null;
  userAction?: string | null;
  contractCallRequest?: any;
  contractCallResponse?: Record<string, Record<string, any>> | null;
  contractCallMetamaskRequest?: any;
  contractCallMetamaskResponse?: Record<string, Record<string, any>> | null;
  contractBatchRequest?: any;
  contractBatchResponse?: Record<string, Record<string, any>> | null;
  contracts?: WalletContract[] | null;
  contractsNetworkMetamask?: WalletContract[] | null;
  signature?: ISignaturePersonal | null;
  connecting?: boolean;
  connected?: boolean;
  errorCode?: ErrorCode | null;
  reloadData?: boolean;
}

export interface Action {
  type: string | null;
  state?: State;
}

export const stateInitial: State = {
  web3Modal: null,
  provider: null,
  web3Provider: null,
  address: null,
  chainId: CHAINID_COGI,
  userAction: null,
  contractCallRequest: null,
  contractCallResponse: null,
  contracts: null,
  signature: null,
  connecting: false,
  connected: false,
  errorCode: null,
  reloadData: false,
};

export const actionInitial: Action = {
  type: null,
  state: stateInitial,
};
