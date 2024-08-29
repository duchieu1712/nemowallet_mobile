import type simple_jsonrpc from "simple-jsonrpc-js";
import { type ISignaturePersonal } from "../../common/types";

export const RESPONSE_STATUS_OK = "RESPONSE_STATUS_OK";
export const RESPONSE_STATUS_FAILED = "RESPONSE_STATUS_FAILED";

export interface Request {
  handler: any;
  method: string;
  params: any[];
}

export interface Subscribe {
  namespace: string;
  handler: any;
}

export interface Response {
  request: Request;
  status: string;
  rawMsg: any;
}

export interface SubscribeResponse {
  request: Subscribe;
  status: number;
  rawMsg: any;
}

export interface State {
  endpoint?: string;
  provider?: simple_jsonrpc;
  socket?: any;
  signature?: ISignaturePersonal;
  userAction?: string;
  request?: Request;
  response?: Response;
  batch?: Request[];
  batchResponse?: Response[];
  subscribe?: Subscribe;
  subscribeResponse?: SubscribeResponse;
  subscribeResponseRedirect?: any;
}

export interface Action {
  type: string;
  state?: State;
}

export const stateInitial: State = {
  endpoint: null,
  provider: null,
  socket: null,
  signature: null,
  userAction: null,
  request: null,
  response: null,
  batch: null,
  batchResponse: null,
  subscribe: null,
  subscribeResponse: null,
  subscribeResponseRedirect: null,
};

export const actionInitial: Action = {
  type: null,
  state: stateInitial,
};
