import { gql } from "graphql-request";

export const getListPool = gql`
  query getNftData(
    $first: Int
    $skip: Int!
    $where: Pool_filter
    $orderBy: Pool_orderBy
    $orderDirection: OrderDirection
  ) {
    pools(
      where: $where
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      skip: $skip
    ) {
      id
      nativeTokenAllowed
      stakingToken
      rewardsToken
      products(orderDirection: desc, orderBy: price) {
        id
        productId
        lockPeriod
        rewardRate
        price
        limit
        limitPerUser
        endDate
        startDate
        roundDate
        sold
        redeemed
        paid
        pool {
          id
          nativeTokenAllowed
          rewardsToken
          stakingToken
        }
        subscriptions(where: { account: "{account}" }) {
          id
          subscriptionId
          account
          valueDate
          interestEndDate
          redeemedDate
          rewardAmount
          redeemed
        }
      }
    }
  }
`;

export const getListPoolStaked = gql`
  query getNftData(
    $first: Int
    $skip: Int!
    $where: SubscribedUser_filter
    $orderBy: SubscribedUser_orderBy
    $orderDirection: OrderDirection
  ) {
    subscribedUsers(
      where: $where
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      skip: $skip
    ) {
      id
      subscriptionId
      account
      valueDate
      interestEndDate
      subscriptionDate
      redeemedDate
      rewardAmount
      redeemed
      product {
        id
        productId
        lockPeriod
        rewardRate
        price
        limit
        limitPerUser
        endDate
        startDate
        roundDate
        sold
        redeemed
        paid
        pool {
          id
          nativeTokenAllowed
          rewardsToken
          stakingToken
        }
      }
    }
  }
`;
