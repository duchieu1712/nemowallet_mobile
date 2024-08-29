import { cast } from "../../common/utilities";
import { type Contract } from "ethers";
import { type ZapContract } from "./types";
import * as reducers from "./reducers";
import { appState } from "..";

export const ContractLaunchpadFromAddress = (address: string): Contract => {
  const Contracts: ZapContract[] = reducers.contracts(appState());
  for (let i = 0; i < Contracts?.length; i++) {
    if (address?.toLowerCase() == Contracts[i].contract.address.toLowerCase())
      return Contracts[i].contract;
  }
  return cast<Contract>(null);
};
