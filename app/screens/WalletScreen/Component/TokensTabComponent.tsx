import * as AccountReducers from "../../../modules/account/reducers";

import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { sleep, toEther } from "../../../common/utilities";

import { API_GET_PRICE_COGI } from "../../../common/api";
import { DEFAULT_CHAINID } from "../../../common/constants";
import { type TokenInfo } from "../../../config/coins";
import WalletBalanceList from "./WalletBalanceListComponent";
import WidgetPieChartComponent from "./WidgetPieChartComponent";
import useBalances from "../../../hooks/useBalances";
import { useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";
import useTokens from "../../../hooks/useTokens";

export default function TokensTabComponent({ props }: { props: any }) {
  const theme = useTheme();
  const tokens = useTokens(DEFAULT_CHAINID);

  const [priceCOGI, setPriceCOGI] = useState(0);
  const [lstTokenBalance, setLstTokenBalance] = useState<any>([]);
  const [refresh, setRefreshing] = useState(true);
  const balances = useBalances(lstTokenBalance);

  const accountWeb = useSelector(AccountReducers.dataAccount);

  const getBalances = (token: TokenInfo, balances: any) => {
    setRefreshing(false);
    let balance = toEther(0);
    if (token.native) {
      if (balances?.balance_Native) {
        balance = toEther(balances?.balance_Native[0]?.balance ?? "");
      }
    } else {
      // NEMO & GOSU
      if (token.offchain) {
        if (balances?.balance_NEMO) {
          balances.balance_NEMO.map((e: any) => {
            if (e.assetData.symbol === token.symbol) {
              balance = e.balance ?? 0;
            }
          });
        }
      }
      // USDT
      else {
        if (balances?.balance_ERC20) {
          const temp: any = balances?.balance_ERC20?.find(
            (e: any) => e.assetData.name === token.name,
          );
          balance = toEther(temp?.balance ?? 0);
        }
      }
    }
    return {
      shortBalance: balance,
      originalBalance: balance,
    };
  };

  const getBTCAndTrade = (item: any) => {
    const amount = getBalances(item, balances).originalBalance;
    let btc = 0.0;
    if (item.symbol === "USDT") {
      btc = 1.0;
    } else if (item.symbol === "COGI") {
      btc = priceCOGI;
    } else if (item.symbol === "NEMO") {
      btc = 0.1;
    } else {
      btc = 0.0004565;
    }
    return {
      btc,
      trade: parseFloat(btc.toString()) * parseFloat(amount),
    };
  };

  const getAllTrade = () => {
    let sum = 0;
    if (!tokens) return 0;
    for (let i = 0; i < tokens?.length; i++) {
      sum = sum + getBTCAndTrade(tokens[i]).trade;
    }
    return sum;
  };

  const getPriceCogi = () => {
    fetch(API_GET_PRICE_COGI)
      .then(async (data) => await data.json())
      .then((res: any) => {
        setPriceCOGI(res);
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  const loadData = async () => {
    getPriceCogi();
    setLstTokenBalance(null);
    await sleep(1000);
    setLstTokenBalance(tokens ? tokens.map((i) => i.id) : []);
  };

  useEffect(() => {
    if (refresh) {
      loadData();
    }
  }, [refresh]);

  useEffect(() => {
    setRefreshing(true);
  }, [accountWeb]);

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: 100,
      }}
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
      }
    >
      <WidgetPieChartComponent total={getAllTrade} />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 15,
          marginBottom: 12,
        }}
      ></View>
      <WalletBalanceList
        navigate={props.navigation.navigate}
        destination="Trade"
        data={tokens}
        balances={balances}
        theme={theme}
        priceCogi={priceCOGI}
        refreshing={refresh}
        getBalances={getBalances}
        getBTCAndTrade={getBTCAndTrade}
      />
    </ScrollView>
  );
}
