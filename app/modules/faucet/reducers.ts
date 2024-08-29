import * as actions from "./actions";
import { type Action, type State, stateInitial } from "./types";

export const getDataPoolsFaucet = (state: any | unknown): any =>
  state.faucet.getDataPoolsFaucet;
export const dataPoolsOnRequestFaucet = (state: any | unknown): any =>
  state.faucet.data_PoolsOnRequest_Faucet;
export const dataPoolsResponseFaucet = (state: any | unknown): any =>
  state.faucet.dataPoolsResponseFaucet;

export const dump = (state: any | unknown): any => state.faucet;

function poolsReducer(state: State = stateInitial, action: Action): State {
  const _state = { ...state };
  switch (action.type) {
    case actions.GET_DATA_POOLS:
      _state.dataPoolsOnRequestFaucet++;
      break;
    case actions.DATA_FAUCETS_RESPONSE:
      _state.dataPoolsOnRequestFaucet--;
      break;
    //
    default:
      break;
  }
  switch (action.type) {
    case actions.GET_DATA_POOLS:
    case actions.DATA_FAUCETS_RESPONSE:
    case actions.RESET_DATA_FAUCETS_RESPONSE:
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
