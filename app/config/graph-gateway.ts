// import { IGraphGateway } from '../common/types'

import { SERVICE_ID } from "../common/enum";

export const cf_graphGateways = [
  {
    namespace: "erc721market_nft",
    endpoints: [
      {
        chainId: 97,
        endpoint: [
          {
            serviceID: SERVICE_ID._9DNFT,
            serviceName: "9D NFT",
            endpoint:
              "https://graphql-gateway-testnet.cogi.technology/prebsc/9dnft-nft-market",
          },
        ],
      },
      {
        chainId: 56,
        endpoint: [
          {
            serviceID: SERVICE_ID._9DNFT,
            serviceName: "9D NFT",
            endpoint: "https://graphql-gateway.cogi.technology/nft-market",
          },
        ],
      },
      {
        chainId: 76923,
        endpoint: [
          {
            serviceID: SERVICE_ID._9DNFT,
            serviceName: "9D NFT",
            endpoint:
              "https://graphql-gateway.nemoverse.io/cogi/9dnft-nft-nemo-market",
          },
        ],
      },
      {
        chainId: 76923,
        endpoint: [
          {
            serviceID: SERVICE_ID._SOUL_REALM,
            serviceName: "Soul Realm",
            endpoint:
              "https://graphql-gateway.nemoverse.io/cogi/soulrealm-nft-market",
          },
        ],
      },
      // Galix
      {
        chainId: 76923,
        endpoint: [
          {
            serviceID: SERVICE_ID._GALIXCITY,
            serviceName: "GaliXCity",
            endpoint:
              "https://graphql-gateway.nemoverse.io/cogi/galixcity-nft-market",
          },
        ],
      },
      {
        chainId: 76923,
        endpoint: [
          {
            serviceID: SERVICE_ID._MARSWAR,
            serviceName: "Mecha Warfare",
            endpoint:
              "https://graphql-gateway.nemoverse.io/cogi/mecha-warfare-nft-market",
          },
        ],
      },
      // Naruto
      {
        chainId: 76923,
        endpoint: [
          {
            serviceID: SERVICE_ID._NARUTO,
            serviceName: "Naruto",
            endpoint:
              "https://graphql-gateway.nemoverse.io/cogi/naruto-nft-market",
          },
        ],
      },
      // ALPHA
      {
        chainId: 76923,
        endpoint: [
          {
            serviceID: SERVICE_ID._OPS_ALPHA,
            serviceName: "OPS ALPHA",
            endpoint: "https://graphql-gateway.nemoverse.io/cogi/ops-alpha",
          },
        ],
      },
      // 9DNFT
      {
        chainId: 5555,
        endpoint: [
          {
            serviceID: SERVICE_ID._9DNFT,
            serviceName: "9D NFT",
            endpoint:
              "https://graphql-gateway.nemoverse.io/cogitestnet/9dnft-nft-market",
          },
        ],
      },
      // _SOUL_REALM
      {
        chainId: 5555,
        endpoint: [
          {
            serviceID: SERVICE_ID._SOUL_REALM,
            serviceName: "Soul Realm",
            endpoint:
              "https://graphql-gateway.nemoverse.io/cogitestnet/soulrealm-nft-market",
          },
        ],
      },
      // Naruto
      {
        chainId: 5555,
        endpoint: [
          {
            serviceID: SERVICE_ID._NARUTO,
            serviceName: "Naruto",
            endpoint:
              "https://graphql-gateway.nemoverse.io/cogitestnet/naruto-nft-market",
          },
        ],
      },
      // Galix
      {
        chainId: 5555,
        endpoint: [
          {
            serviceID: SERVICE_ID._GALIXCITY,
            serviceName: "GaliXCity",
            endpoint:
              "https://graphql-gateway.nemoverse.io/cogitestnet/galix-nft-market",
          },
        ],
      },
      // Flashpoint
      {
        chainId: 5555,
        endpoint: [
          {
            serviceID: SERVICE_ID._FLASHPOINT,
            serviceName: "FlashPoint",
            endpoint:
              "https://graphql-gateway.nemoverse.io/cogitestnet/flashpoint-nft-market",
          },
        ],
      },
      // Mecha Warfare
      {
        chainId: 5555,
        endpoint: [
          {
            serviceID: SERVICE_ID._MARSWAR,
            serviceName: "Mecha Warfare",
            endpoint:
              "https://testnet-graphql-gateway.nemoverse.io/cogitestnet/marswar-nft-market",
          },
        ],
      },
      // _RICHWORK_FARM_FAMILY
      {
        chainId: 5555,
        endpoint: [
          {
            serviceID: SERVICE_ID._RICHWORK_FARM_FAMILY,
            serviceName: "Richwork Farm Family",
            endpoint:
              "https://graphql-gateway.nemoverse.io/cogitestnet/richwork-nft-market",
          },
        ],
      },
      // _OPS_ALPHA
      {
        chainId: 5555,
        endpoint: [
          {
            serviceID: SERVICE_ID._OPS_ALPHA,
            serviceName: "OPS ALPHA",
            endpoint:
              "https://graphql-gateway.nemoverse.io/cogitestnet/ops-alpha",
          },
        ],
      },
    ],
  },
  {
    namespace: "erc20_staking",
    endpoints: [
      {
        chainId: 76923,
        endpoint:
          "https://graphql-gateway.nemoverse.io/cogi/simple-earn-secondary",
      },
      {
        chainId: 5555,
        endpoint:
          "https://testnet-graphql-gateway.nemoverse.io/testnetcogi/simple-earn",
      },
    ],
  },
];
