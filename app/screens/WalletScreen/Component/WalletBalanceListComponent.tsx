import { GestureHandlerRootView } from "react-native-gesture-handler";
import React from "react";
import WalletBalance from "./WalletBalanceComponent";

export default function WalletBalanceListComponent(props: any) {
  const renderItems = () => {
    return props.data.map((item: any, i: any) => (
      <WalletBalance
        key={i}
        props={{
          theme: props.theme,
          index: i,
          coin: item.logo,
          coinName: item.symbol,
          amount: props.getBalances(item, props.balances),
          trade: props.getBTCAndTrade(item).trade,
          data: item.data,
          btc: props.getBTCAndTrade(item).btc,
          tag: item.tag,
          id: item.id,
          refreshing: props.refreshing,
          tokenPressed: () =>
            props.navigate("TokenScreen", {
              data: {
                ...item,
                amount: props.getBalances(item, props.balances),
              },
            }),
        }}
      />
    ));
  };

  return <GestureHandlerRootView>{renderItems()}</GestureHandlerRootView>;
}
