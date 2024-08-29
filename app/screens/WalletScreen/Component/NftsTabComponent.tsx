import * as AccountReducers from "../../../modules/account/reducers";

import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  contractEth_batch,
  decodeFunctionResult,
} from "../../../components/RpcExec/toast_chain";

import { COLORS } from "../../../themes/theme";
import { Collections } from "../../../config/collections";
import { ContractFromNamespaceCogiChain } from "../../../modules/wallet/utilities";
import { IconLoadingDataComponent } from "../../../components/LoadingComponent";
import ListNFTs from "./ListNftsComponent";
import ScrollViewToTop from "../../../components/ScrollToTopComponent";
import WidgetTotal from "./WidgetNFTsComponent";
import { descyptNEMOWallet } from "../../../common/utilities";
import { cf_services } from "../../../config/services";
import { useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";

export default function TabNFTsComponent() {
  const [game, setGame] = useState(null);
  const { colors } = useTheme();
  const [collection, setCollections] = useState<any>([]);
  const [nftAmount, setNftAmount] = useState<any>([]);
  const [totalNFTs, setTotalNFTs] = useState<any>(0);
  const [refreshing, setRefreshing] = useState<any>(false);
  const [initLoading, setInitLoading] = useState<any>(false);
  const accountWeb = useSelector(AccountReducers.dataAccount);

  useEffect(() => {
    setGame(cf_services[0]);
  }, []);

  useEffect(() => {
    if (!game) return;
    setInitLoading(true);
  }, [game]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  useEffect(() => {
    if (!accountWeb) {
      setTotalNFTs(0);
      setNftAmount([]);
    } else {
      setRefreshing(true);
    }
  }, [accountWeb]);

  useEffect(() => {
    if (!refreshing && !initLoading) return;
    const selectedCollections = Collections?.filter(
      (e) => e?.serviceID === game?.serviceID,
    );
    setCollections(selectedCollections);
  }, [refreshing, initLoading]);

  useEffect(() => {
    if (!collection || collection?.length === 0 || !accountWeb) {
      setTotalNFTs(0);
      setNftAmount([]);
      setRefreshing(false);
      setInitLoading(false);
      return;
    }
    setTimeout(() => {
      fetchAmount();
    }, 100);
  }, [collection]);

  const fetchAmount = async () => {
    let lstAPI = [];
    let contractNFT: any;
    lstAPI = collection.map((e: any) => {
      contractNFT = ContractFromNamespaceCogiChain(e.contractNamespace);
      return {
        method: "balanceOf",
        contract: contractNFT,
        params: [descyptNEMOWallet(accountWeb.nemo_address)],
      };
    });
    // if (lstAPI?.length !== 0) {
    //   setIsLoading(true);
    contractEth_batch(lstAPI)
      .then((res) => {
        setInitLoading(false);
        setRefreshing(false);
        const lstRes = res.map((e: any) => {
          return parseFloat(decodeFunctionResult(contractNFT, "balanceOf", e));
        });
        setNftAmount(lstRes);
        setTotalNFTs(lstRes.reduce((a: any, b: any) => a + b, 0));
      })
      .catch(() => {
        setInitLoading(false);
        setRefreshing(false);
      });
    // }
  };

  return (
    <ScrollViewToTop
      refreshing={refreshing}
      onRefresh={onRefresh}
      bottomIcon={100}
    >
      <View style={{ gap: 16, paddingBottom: 100 }}>
        <View
          // horizontal
          style={{
            marginHorizontal: 18,
          }}
        >
          <View style={styles.scrollSelectGame}>
            {cf_services.map((e, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  setGame(e);
                }}
                activeOpacity={0.8}
                style={{
                  borderWidth: game?.serviceID === e.serviceID ? 1 : 0,
                  borderColor:
                    game?.serviceID === e.serviceID
                      ? colors.primary
                      : COLORS.transparent,
                  borderRadius: 12,
                }}
              >
                <Image
                  source={e.logoGame}
                  style={{
                    ...styles.logoGame,
                    opacity: game?.serviceID === e.serviceID ? 1 : 0.5,
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <WidgetTotal total={totalNFTs} />
        {refreshing || initLoading ? (
          <View style={{ flex: 1 }}>
            <IconLoadingDataComponent />
          </View>
        ) : (
          <ListNFTs game={game} collection={collection} nftAmount={nftAmount} />
        )}
      </View>
    </ScrollViewToTop>
  );
}

const styles = StyleSheet.create({
  scrollSelectGame: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    columnGap: 12,
  },
  logoGame: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
});
