import { type ISignaturePersonal } from "../../common/types";
import {
  type Action,
  stateInitial,
  type Response,
  type Request,
  type Subscribe,
  type SubscribeResponse,
} from "./types";

export const DISCONNECT = "JSONRPC_DISCONNECT";
export const DISCONNECT_RESPONSE = "JSONRPC_DISCONNECT_RESPONSE";
export const CONNECT = "JSONRPC_CONNECT";
export const CONNECT_RESPONSE = "JSONRPC_CONNECT_RESPONSE";
export const CALL = "JSONRPC_CALL";
export const CALL_WITHDRAW = "JSONRPC_CALL_WITHDRAW";
export const BATCH = "JSONRPC_BATCH";
export const SUBSCRIBE = "JSONRPC_SUBSCRIBE";
export const SUBSCRIBE_RESPONSE = "JSONRPC_SUBSCRIBE_RESPONSE";
export const RESET_SUBSCRIBE_RESPONSE = "JSONRPC_RESET_SUBSCRIBE_RESPONSE";
export const SUBSCRIBE_RESPONSE_REDIRECT =
  "JSONRPC_SUBSCRIBE_RESPONSE_REDIRECT";
export const CALL_RESPONSE = "JSONRPC_CALL_RESPONSE";
export const BATCH_RESPONSE = "JSONRPC_BATCH_RESPONSE";
export const CLEANUP = "JSONRPC_CLEANUP";

export function disconnect(): Action {
  return {
    type: DISCONNECT,
    state: stateInitial,
  };
}

export function disconnectResponse(response: any | unknown): Action {
  return {
    type: DISCONNECT,
    state: {
      response,
    },
  };
}

export function connect(
  endpoint: string,
  signature?: ISignaturePersonal,
): Action {
  return {
    type: CONNECT,
    state: {
      endpoint,
      signature,
    },
  };
}

export function connectResponse(state: any | unknown): Action {
  return {
    type: CONNECT_RESPONSE,
    state,
  };
}

export function call(request: Request): Action {
  return {
    type: CALL,
    state: {
      request,
    },
  };
}

export function callWithdraw(request: Request): Action {
  return {
    type: CALL_WITHDRAW,
    state: {
      request,
    },
  };
}

export function batch(requests: Request[]): Action {
  return {
    type: BATCH,
    state: {
      batch: requests,
    },
  };
}

export function subscribeResponseRedirect(response: any | unknown): Action {
  return {
    type: SUBSCRIBE_RESPONSE_REDIRECT,
    state: {
      subscribeResponseRedirect: response,
    },
  };
}

export function subscribeResponse(response: SubscribeResponse): Action {
  return {
    type: SUBSCRIBE_RESPONSE,
    state: {
      subscribeResponse: response,
    },
  };
}

export function resetSubscribeResponse(): Action {
  return {
    type: RESET_SUBSCRIBE_RESPONSE,
    state: {
      subscribeResponse: null,
    },
  };
}

export function subscribe(request: Subscribe): Action {
  return {
    type: SUBSCRIBE,
    state: {
      subscribe: request,
    },
  };
}

export function batchResponse(responses: Response[]): Action {
  return {
    type: BATCH_RESPONSE,
    state: {
      batchResponse: responses,
    },
  };
}

export function callResponse(response: Response): Action {
  return {
    type: CALL_RESPONSE,
    state: {
      response,
    },
  };
}

export function cleanup(): Action {
  return {
    type: CLEANUP,
    state: stateInitial,
  };
}
