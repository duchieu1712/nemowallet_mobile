import { type Contract } from "@ethersproject/contracts";
import { appState } from "../index";
import { cast } from "../../common/utilities";
import { type WalletContract } from "./types";
import * as reducers from "./reducers";
import { type IChainData } from "../../common/types";
import cf_Chains from "../../config/chains";
import { ClassWithStaticMethod } from "../../common/static";
import cf_coins from "../../config/coins";

export async function providerCall(
  provider: any | unknown,
  method: any | unknown,
  params: any | unknown,
): Promise<any> {
  return await new Promise((accept, reject) => {
    provider?.sendAsync({ method, params }, function (err: any, result: any) {
      if (err) {
        reject(err);
      } else if (result.error) {
        reject(result.error);
      } else {
        accept(result.result);
      }
    });
  });
}

// export const getChainId = (): number => {
//   return ClassWithStaticMethod.NEMO_WALLET_CHAINID
//   const ret = reducers.selectedChainId(appState())
//   // return ret > 0 ? ret : DEFAULT_CHAINID
//   return ret > 0 ? ret : ClassWithStaticMethod.STATIC_DEFAULT_CHAINID
// }

// export const getChainId_V2 = (): number => {
//   return ClassWithStaticMethod.STATIC_DEFAULT_CHAINID
//   const ret = reducers.selectedChainId(appState())
//   return ret > 0 ? ret : ClassWithStaticMethod.STATIC_DEFAULT_CHAINID
// }
export const getChainId = (): number => {
  return ClassWithStaticMethod.NEMO_WALLET_CHAINID;
};

export const ChainConfig = (chain_Id: any = null): IChainData => {
  let chainId = ClassWithStaticMethod.STATIC_DEFAULT_CHAINID;
  if (chain_Id != null) {
    chainId = chain_Id;
  }

  for (let i = 0; i < cf_Chains.length; i++) {
    if (cf_Chains[i].chainId == chainId) return cf_Chains[i];
  }
  return {
    name: null,
    shortName: null,
    chain: null,
    network: null,
    chainId: null,
    networkId: null,
    rpcUrl: null,
    nativeCurrency: {
      symbol: null,
      name: null,
      decimals: null,
      contractNamespace: null,
    },
  };
};

export const WalletContractFromAddress = (address: string): WalletContract => {
  const Contracts: WalletContract[] = reducers.contracts(appState());
  for (let i = 0; i < Contracts?.length; i++) {
    if (address.toLowerCase() == Contracts[i].contract.address.toLowerCase())
      return Contracts[i];
  }
  return cast<WalletContract>(null);
};

export const WalletContractFromNamespace = (
  namespace: string,
): WalletContract => {
  const Contracts: WalletContract[] = reducers.contracts(appState());
  for (let i = 0; i < Contracts?.length; i++) {
    if (namespace == Contracts[i].namespace) return Contracts[i];
  }
  return cast<WalletContract>(null);
};

export const ContractFromAddressAllNetwork = (namespace: string): Contract => {
  if (
    ClassWithStaticMethod.STATIC_DEFAULT_CHAINID ==
    ClassWithStaticMethod.NEMO_WALLET_CHAINID
  ) {
    return ContractFromAddressCogiChain(namespace);
  } else {
    return ContractFromAddress(namespace);
  }
};

export const ContractFromAddressCogiChain = (address: string): Contract => {
  const Contracts: WalletContract[] = reducers.contracts(appState());
  for (let i = 0; i < Contracts?.length; i++) {
    if (address.toLowerCase() == Contracts[i].contract.address.toLowerCase())
      return Contracts[i].contract;
  }
  return cast<Contract>(null);
};

export const ContractFromAddress = (address: string): Contract => {
  const ContractsNetworkMetamask: WalletContract[] =
    reducers.contractsNetworkMetamask(appState());
  for (let i = 0; i < ContractsNetworkMetamask?.length; i++) {
    if (
      address.toLowerCase() ==
      ContractsNetworkMetamask[i].contract.address.toLowerCase()
    )
      return ContractsNetworkMetamask[i].contract;
  }
  return cast<Contract>(null);
};

export const ContractFromNamespaceAllNetwork = (
  namespace: string,
): Contract => {
  if (
    ClassWithStaticMethod.STATIC_DEFAULT_CHAINID ==
    ClassWithStaticMethod.NEMO_WALLET_CHAINID
  ) {
    return ContractFromNamespaceCogiChain(namespace);
  } else {
    return ContractFromNamespace(namespace);
  }
};

export const ContractFromNamespace = (namespace: string): Contract => {
  const ContractsNetworkMetamask: WalletContract[] =
    reducers.contractsNetworkMetamask(appState());
  for (let i = 0; i < ContractsNetworkMetamask?.length; i++) {
    if (namespace == ContractsNetworkMetamask[i].namespace)
      return ContractsNetworkMetamask[i].contract;
  }
  return cast<Contract>(null);
};

export const ContractFromNamespaceCogiChain = (namespace: string): Contract => {
  const Contracts: WalletContract[] = reducers.contracts(appState());
  for (let i = 0; i < Contracts?.length; i++) {
    if (namespace == Contracts[i].namespace) return Contracts[i].contract;
  }
  return cast<Contract>(null);
};

export const NamespaceFromAddress = (address: string): string => {
  const Contracts: WalletContract[] = reducers.contracts(appState());
  for (let i = 0; i < Contracts?.length; i++) {
    if (address.toLowerCase() == Contracts[i].contract.address.toLowerCase())
      return Contracts[i].namespace;
  }
  return "";
};

export const ListAddresdFromNamespace = (namespace: string): any => {
  return cf_coins.filter((e) => e.namespace == namespace);
};
