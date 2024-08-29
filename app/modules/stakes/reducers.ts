import * as actions from "./actions";
import { type Action, type State, stateInitial } from "./types";

export const getDataPools = (state: any | unknown): any =>
  state.stake.getDataPools;
export const dataPoolsOnRequest = (state: any | unknown): any =>
  state.stake.dataPoolsOnRequest;
export const dataPoolsResponse = (state: any | unknown): any =>
  state.stake.dataPoolsResponse;

export const getDataPoolsStaked = (state: any | unknown): any =>
  state.stake.getDataPoolsStaked;
export const dataPoolsStakedOnRequest = (state: any | unknown): any =>
  state.stake.dataPoolsStakedOnRequest;
export const dataPoolsStakedResponse = (state: any | unknown): any =>
  state.stake.dataPoolsStakedResponse;
export const contracts = (state: any | unknown): any => state.stake.contracts;

export const dump = (state: any | unknown): any => state.stake;

function poolsReducer(state: State = stateInitial, action: Action): State {
  const _state = {
    ...state,
  };
  switch (action.type) {
    case actions.GET_DATA_POOLS:
      _state.dataPoolsOnRequest++;
      break;
    case actions.DATA_POOLS_RESPONSE:
      _state.dataPoolsOnRequest--;
      break;
    //
    case actions.GET_DATA_POOLS_STAKED:
      _state.dataPoolsStakedOnRequest++;
      break;
    case actions.DATA_POOLS_STAKED_RESPONSE:
      _state.dataPoolsStakedOnRequest--;
      break;
    default:
      break;
  }
  switch (action.type) {
    case actions.GET_DATA_POOLS:
    case actions.DATA_POOLS_RESPONSE:
    case actions.RESET_DATA_POOLS_RESPONSE:
    case actions.GET_DATA_POOLS_STAKED:
    case actions.DATA_POOLS_STAKED_RESPONSE:
    case actions.RESET_DATA_POOLS_STAKED_RESPONSE:
    case actions.CONNECT_CONTRACT:
    case actions.CONTRACT:
    case actions.RESET_CONTRACT:
    case actions.CLEANUP:
      return {
        ..._state,
        ...action.state,
      };
    default:
      return {
        ...state,
      };
  }
}

export default poolsReducer;
