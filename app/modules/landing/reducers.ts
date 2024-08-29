import * as actions from "./actions";
import { type Action, type State, stateInitial } from "./types";

export const getDataLanding = (state: any | unknown): any =>
  state.land.getDataLanding;
export const dataLandingOnRequest = (state: any | unknown): any =>
  state.land.dataLandingOnRequest;
export const dataLandingResponse = (state: any | unknown): any =>
  state.land.dataLandingResponse;

export const getDataRentingLanding = (state: any | unknown): any =>
  state.land.getDataRentingLanding;
export const dataRentingLandingOnRequest = (state: any | unknown): any =>
  state.land.dataRentingLandingOnRequest;
export const dataRentingLandingResponse = (state: any | unknown): any =>
  state.land.dataRentingLandingResponse;

export const contracts = (state: any | unknown): any => state.land.contracts;

export const dump = (state: any | unknown): any => state.land;

function LandingReducer(state: State = stateInitial, action: Action): State {
  const _state = {
    ...state,
  };
  switch (action.type) {
    case actions.GET_DATA_LANDING:
      _state.dataLandingOnRequest++;
      break;
    case actions.DATA_LANDING_RESPONSE:
      _state.dataLandingOnRequest--;
      break;
    case actions.GET_DATA_RENGTING_LANDING:
      _state.dataRentingLandingOnRequest++;
      break;
    case actions.DATA_RENGTING_LANDING_RESPONSE:
      _state.dataRentingLandingOnRequest--;
      break;
    default:
      break;
  }

  switch (action.type) {
    case actions.GET_DATA_LANDING:
    case actions.DATA_LANDING_RESPONSE:
    case actions.RESET_DATA_LANDING_RESPONSE:
    case actions.GET_DATA_RENGTING_LANDING:
    case actions.DATA_RENGTING_LANDING_RESPONSE:
    case actions.RESET_DATA_RENGTING_LANDING_RESPONSE:
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

export default LandingReducer;
