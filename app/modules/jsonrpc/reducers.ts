import { CHAINID_COGI } from "../../common/constants";
import { ClassWithStaticMethod } from "../../common/static";
import * as walletActions from "../wallet/actions";
import { type State } from "../wallet/types";
import * as actions from "./actions";
import { type Action, stateInitial } from "./types";

export const connected = (state: any | unknown): any =>
  (state.jsonrpc.provider != null && state.jsonrpc.signature != null) ||
  ClassWithStaticMethod.STATIC_DEFAULT_CHAINID == CHAINID_COGI;
export const connectedServer = (state: any | unknown): any =>
  state.jsonrpc.provider != null;
export const selectedProvider = (state: any | unknown): any =>
  state.jsonrpc.provider;
export const selectedEndpoint = (state: any | unknown): any =>
  state.jsonrpc.endpoint;
export const selectedSignature = (state: any | unknown): any =>
  state.jsonrpc.signature;
export const dump = (state: any | unknown): any => state.jsonrpc;

function jsonrpcReducer(state: State = stateInitial, action: Action): State {
  switch (action.type) {
    case actions.CONNECT:
    case actions.CONNECT_RESPONSE:
    case actions.BATCH:
    case actions.SUBSCRIBE:
    case actions.SUBSCRIBE_RESPONSE:
    case actions.SUBSCRIBE_RESPONSE_REDIRECT:
    case actions.RESET_SUBSCRIBE_RESPONSE:
    case actions.BATCH_RESPONSE:
    case actions.CALL:
    case actions.CALL_WITHDRAW:
    case actions.CALL_RESPONSE:
    case actions.DISCONNECT_RESPONSE:
    case actions.CLEANUP:
      return {
        ...state,
        ...action.state,
      };
    case walletActions.RESET_WEB3_PROVIDER:
    case actions.DISCONNECT:
      return {
        ...stateInitial,
      };
    default:
      return {
        ...state,
      };
  }
}

export default jsonrpcReducer;
