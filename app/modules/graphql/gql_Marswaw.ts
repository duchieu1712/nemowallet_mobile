import { gql } from "graphql-request";
export const getNftsData = gql`
  query getNftsData(
    $first: Int
    $skip: Int!
    $where: NFT_filter
    $orderBy: NFT_orderBy
    $orderDirection: OrderDirection
  ) {
    nfts(
      where: $where
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      skip: $skip
    ) {
      id
      collection {
        id
      }
      metadataNftType
      metadataType
      metadataName
      metadataRarity
      metadataIndex
      metadataLevel
      metadataStar
      isTradable
      bids(
        where: { isTradable: true }
        orderBy: "updatedAt"
        orderDirection: "asc"
      ) {
        id
        isTradable
        buyer {
          id
        }
        price
      }
      tokenId
      askPrice
      seller {
        id
      }
      owner {
        id
      }
      metadata {
        id
        name
        image
        description
        attributes {
          id
          display_type
          value
          trait_type
        }
      }
      updatedAt
    }
  }
`;

export const getNftsDataNemoWallet = gql`
  query getNftsData(
    $first: Int
    $skip: Int!
    $where: NFT_filter
    $orderBy: NFT_orderBy
    $orderDirection: OrderDirection
  ) {
    nfts(
      where: $where
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      skip: $skip
    ) {
      metadata {
        id
        name
        image
        description
        attributes {
          id
          display_type
          value
          trait_type
        }
      }
      metadataType
      metadataName
      isTradable
      tokenId
      askPrice
      seller {
        id
      }
      owner {
        id
      }
      collection {
        id
      }
    }
  }
`;
export const getNftData = gql`
  query getNftData($where: NFT_filter) {
    nfts(where: $where) {
      id
      collection {
        id
      }
      metadataNftType
      metadataType
      metadataName
      metadataRarity
      metadataIndex
      metadataLevel
      metadataStar
      isTradable
      tokenId
      askPrice
      seller {
        id
      }
      owner {
        id
      }
      metadata {
        id
        name
        image
        description
        attributes {
          id
          display_type
          value
          trait_type
        }
      }
      asks(
        where: { isTradable: true }
        orderBy: "updatedAt"
        orderDirection: "asc"
      ) {
        id
        isTradable
        seller {
          id
        }
        price
      }
      bids(
        where: { isTradable: true }
        orderBy: "updatedAt"
        orderDirection: "asc"
      ) {
        id
        isTradable
        buyer {
          id
        }
        price
      }
      transactionHistory(orderBy: "timestamp", orderDirection: "desc") {
        id
        sender {
          id
        }
        recipient {
          id
        }
        timestamp
        price
        kind
      }
    }
  }
`;

export const getNftDataOffering = gql`
  query getNftData(
    $first: Int
    $skip: Int!
    $where: BidOrder_filter
    $orderBy: BidOrder_orderBy
    $orderDirection: OrderDirection
  ) {
    bidOrders(
      where: $where
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      skip: $skip
    ) {
      id
      isTradable
      nftMetadataName
      nft {
        id
        collection {
          id
        }
        isTradable
        tokenId
        askPrice
        metadataNftType
        metadataType
        metadataName
        metadataRarity
        metadataIndex
        metadataLevel
        metadataStar
        seller {
          id
        }
        owner {
          id
        }
        metadata {
          id
          name
          image
          description
          attributes {
            id
            display_type
            value
            trait_type
          }
        }
      }
      price
      buyer {
        id
      }
    }
  }
`;

export const getTransaction = gql`
  query getNftData(
    $first: Int
    $skip: Int!
    $where: Transaction_filter
    $orderBy: Transaction_orderBy
    $orderDirection: OrderDirection
  ) {
    transactions(
      where: $where
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      skip: $skip
    ) {
      id
      price
      kind
      timestamp
      sender {
        id
      }
      recipient {
        id
      }
      nft {
        id
        collection {
          id
        }
        metadataNftType
        metadataType
        metadataName
        metadataRarity
        metadataIndex
        metadataLevel
        isTradable
        tokenId
        seller {
          id
        }
        owner {
          id
        }
        metadata {
          id
          name
          image
          description
          attributes {
            id
            display_type
            value
            trait_type
          }
        }
      }
    }
  }
`;
