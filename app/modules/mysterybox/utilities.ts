import * as reducers from "./reducers";

import {
  collectionSlugFromAddress,
  toIpfsGatewayUrl,
} from "../../common/utilities_config";

import { type Contract } from "ethers";
import { type INOContract } from "./types";
import { type Nft } from "../graphql/types/generated";
import { SERVICE_ID } from "../../common/enum";
import { appState } from "..";
import { cast } from "../../common/utilities";

export const toIpfsJsonUrl = (item: Nft): any => {
  return toIpfsGatewayUrl(
    `ipfs://${item.metadata.id}/${collectionSlugFromAddress(
      item.collection.id,
    )}-${item.tokenId}.json`,
    SERVICE_ID._GALIXCITY,
  );
};

export const ContractBoxFromAddress = (address: string): Contract => {
  const Contracts: INOContract[] = reducers.contracts(appState());
  for (let i = 0; i < Contracts?.length; i++) {
    if (address?.toLowerCase() == Contracts[i].contract.address.toLowerCase())
      return Contracts[i].contract;
  }
  return cast<Contract>(null);
};
