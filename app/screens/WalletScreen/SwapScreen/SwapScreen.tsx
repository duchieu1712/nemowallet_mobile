import * as AccountReducers from "../../../modules/account/reducers";
import * as HotwalletActions from "../../../modules/hotwallet/actions";
import * as HotwalletReducers from "../../../modules/hotwallet/reducers";
import * as WalletActions from "../../../modules/wallet/actions";
import * as WalletReducers from "../../../modules/wallet/reducers";
import * as ZapActions from "../../../modules/zap/actions";
import * as ZapReducers from "../../../modules/zap/reducers";

import { COLORS, MyTextApp, SIZES } from "../../../themes/theme";
import {
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { type IAssetData, type IBalanceData } from "../../../common/types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  balancesFromHotwalletSaga,
  balancesFromWalletSaga_ZAP,
  balancesFromWalletSaga_ZAPMetmask,
} from "../../../common/utilities_config";
import { cf_assetsZap, cf_assetsZapMetmask } from "../../../config/assets_zap";
import { useDispatch, useSelector } from "react-redux";
import { useRoute, useTheme } from "@react-navigation/native";

import { ClassWithStaticMethod } from "../../../common/static";
import Collapsible from "react-native-collapsible";
import { FILTER_BUY_SELL_NEMO } from "../../../common/enum";
import Icon from "react-native-vector-icons/AntDesign";
import { IconButtonNotifyComponent } from "../../../components/ButtonComponent/ButtonIconComponent";
import { ScrollViewIndicator } from "@fanchenbao/react-native-scroll-indicator";
import { SkeletonComponent } from "../../../components/LoadingComponent";
import ZapComponent from "./Component/ZapComponent";
import cf_Chains from "../../../config/chains";
import { descyptNEMOWallet } from "../../../common/utilities";
import { cf_hotwallets as hotwalletsConfig } from "../../../config/kogi-api";
import { useTranslation } from "react-i18next";

const SwapScreen = ({ navigation }: { navigation: any }) => {
  const route = useRoute<any>();
  // const symbol = "USDT";
  const screenWidth = SIZES.width;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [listZap, setListZap] = useState<any>(null);
  const [onRequestZap, setOnRequestZap] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  const [isEditNetwork, setIsEditNetwork] = useState(true);
  const [onchainBalances, setOnchainBalances] = useState<any>([]);
  const [networkFrom, setNetworkFrom] = useState(
    cf_Chains.find(
      (e) => e.chainId === ClassWithStaticMethod.NEMO_WALLET_CHAINID,
    ),
  );
  const [filterBuySellType, setFilterBuySellType] = useState(
    FILTER_BUY_SELL_NEMO.BUY,
  );

  const [symbol, setSymbol] = useState("");

  // const chainId = useSelector(WalletReducers.selectedChainId);
  const chainId = useSelector(WalletReducers.selectedChainId);
  const accountWeb = useSelector(AccountReducers.dataAccount);
  const account = useSelector(WalletReducers.selectedAddress);
  const dataZapOnRequest = useSelector(ZapReducers.dataZapOnRequest);
  const dataZapResponse: any = useSelector(ZapReducers.dataZapResponse);
  const getBalancesResponse = useSelector(
    HotwalletReducers.getBalancesResponse,
  );
  const contractMetamaskResponse = useSelector(
    WalletReducers.contractMetamaskResponse,
  );
  const contractCallResponse = useSelector(WalletReducers.contractCallResponse);

  const dispatchContractCallOnchainBalances = () => {
    cf_assetsZap.map((asset: IAssetData) => {
      dispatch(
        WalletActions.contractCall({
          namespace: asset.contractNamespace,
          method: "balanceOf",
          params: [descyptNEMOWallet(accountWeb?.nemo_address)],
        }),
      );
    });
  };

  const dispatchContractCallMetamaskOnchainBalances = () => {
    cf_assetsZapMetmask.map((asset: IAssetData) => {
      dispatch(
        WalletActions.contractCallMetamask({
          namespace: asset.contractNamespace,
          method: "balanceOf",
          params: [account],
        }),
      );
    });
  };

  useEffect(() => {
    loadData();
  }, [chainId]);

  useEffect(() => {
    setOnRequestZap(dataZapOnRequest > 0);
  }, [dataZapOnRequest]);

  useEffect(() => {
    dispatch(WalletActions.connect());
  }, []);

  useEffect(() => {
    if (refreshing) {
      loadData();
    }
  }, [refreshing]);

  useEffect(() => {
    if (!accountWeb) {
      setOnchainBalances([]);
    }
  }, [accountWeb]);

  useEffect(() => {
    if (onRequestZap) return;
    let ret: any = [];
    if (dataZapResponse !== null) {
      ret = [...ret, ...dataZapResponse];
      setListZap(ret);
    }
    setRefreshing(false);
  }, [onRequestZap]);

  useEffect(() => {}, [listZap]);

  useEffect(() => {
    // onchain Balances
    let ret: IBalanceData[] = [];
    if (contractMetamaskResponse !== null) {
      ret = balancesFromWalletSaga_ZAPMetmask(contractMetamaskResponse);
    }
    // setOnchainBalances(null)
    setOnchainBalances([...onchainBalances, ...ret]);
  }, [contractMetamaskResponse]);

  useEffect(() => {
    // onchain Balances
    let ret: IBalanceData[] = [];
    if (contractCallResponse !== null) {
      ret = balancesFromWalletSaga_ZAP(contractCallResponse);
    }
    let temp = onchainBalances ? [...onchainBalances] : [];
    ret.map((e: any) => {
      temp = temp.filter(
        (b) =>
          b?.assetData?.contractNamespace !== e?.assetData?.contractNamespace,
      );
      temp?.push(e);
    });
    setOnchainBalances([...temp]);
  }, [contractCallResponse]);

  useEffect(() => {
    if (getBalancesResponse) {
      let temp = onchainBalances ? [...onchainBalances] : [];
      const ret = balancesFromHotwalletSaga(getBalancesResponse);
      ret.map((e: any) => {
        temp = temp.filter(
          (b) =>
            b?.assetData?.contractNamespace !== e?.assetData?.contractNamespace,
        );
        temp?.push(e);
      });
      setOnchainBalances([...temp]);
    }
  }, [getBalancesResponse]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  const dispatchGetDataZap = () => dispatch(ZapActions.getDataZap());

  const loadData = () => {
    setOnchainBalances([]);
    dispatchGetDataZap();
    if (!networkFrom) return;
    if (accountWeb) {
      getBalance();
    }
  };

  const dispatchGetBalances = () => {
    const res = [];
    for (let i = 0; i < hotwalletsConfig.length; i++) {
      res.push(hotwalletsConfig[i].namespace);
    }
    dispatch(
      HotwalletActions.getBalances({
        namespaces: res,
      }),
    );
  };

  const getBalance = () => {
    setOnchainBalances([]);
    if (chainId === ClassWithStaticMethod.NEMO_WALLET_CHAINID) {
      dispatchContractCallOnchainBalances();
      dispatchGetBalances();
    } else {
      dispatchContractCallMetamaskOnchainBalances();
    }
    setRefreshing(false);
  };

  useEffect(() => {
    if (!route.params) return;
    const { token } = route.params;
    if (!token) return;
    setSymbol(token.symbol);
  }, [route.params]);

  const RenderItem = useMemo(() => {
    return ({ item, index }: { item: any; index: any }) => {
      return (
        <ZapComponent
          navigation={navigation}
          key={index}
          item={item}
          reload={loadData}
          getBalance={getBalance}
          balances={onchainBalances}
          tag={filterBuySellType}
          setTag={setFilterBuySellType}
          isEditNetwork={isEditNetwork}
          setIsEditNetwork={setIsEditNetwork}
          networkFrom={networkFrom}
          setNetworkFrom={setNetworkFrom}
          symbol={symbol}
        />
      );
    };
  }, [
    listZap,
    onchainBalances,
    networkFrom,
    symbol,
    isEditNetwork,
    filterBuySellType,
  ]);

  return (
    <>
      <View
        style={{
          ...styles.container,
          backgroundColor: colors.card,
          minHeight: SIZES.height,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            position: "relative",
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 0,
          }}
        >
          {/* <AvatarLoginedComponent /> */}
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 42,
              borderRadius: 20,
              height: 42,
            }}
            activeOpacity={0.5}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrowleft" size={24} color={colors.title} />
          </TouchableOpacity>
          <View>
            <MyTextApp
              style={{
                ...styles.headTitle,
                color: colors.title,
                textTransform: "uppercase",
              }}
            >
              {t("swap.title")}
            </MyTextApp>
          </View>
          <IconButtonNotifyComponent navigation={navigation} />
        </View>

        <ScrollView
          nestedScrollEnabled={true}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          // contentContainerStyle={{ paddingBottom: 80 }}
        >
          <TouchableOpacity
            style={styles.collapse}
            onPress={() => {
              setIsCollapsed(!isCollapsed);
            }}
          >
            <MyTextApp style={{ ...styles.greyText, color: colors.text }}>
              {t("swap.info_token")}
            </MyTextApp>
            <Icon
              name={isCollapsed ? "caretdown" : "caretup"}
              color={colors.text}
              size={10}
            />
          </TouchableOpacity>
          <Collapsible collapsed={isCollapsed}>
            <View style={styles.infoContent}>
              <ScrollViewIndicator
                scrollViewProps={{ nestedScrollEnabled: true }}
                indStyle={{ backgroundColor: colors.title }}
              >
                <MyTextApp style={{ color: colors.title, lineHeight: 22 }}>
                  {t("swap.info_token_content")}
                </MyTextApp>
              </ScrollViewIndicator>
            </View>
          </Collapsible>
          {listZap !== null ? (
            <FlatList
              nestedScrollEnabled
              scrollEnabled={false}
              data={listZap}
              renderItem={RenderItem}
            />
          ) : (
            <View
              style={{
                width: "100%",
                alignItems: "center",
                gap: 16,
                paddingTop: 25,
              }}
            >
              <SkeletonComponent
                style={{ borderRadius: 8 }}
                width={screenWidth - 32}
                height={60}
              />
              <SkeletonComponent
                style={{ borderRadius: 8 }}
                width={screenWidth - 32}
                height={170}
              />
              <SkeletonComponent
                style={{ borderRadius: 8 }}
                width={screenWidth - 32}
                height={170}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  collapse: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingBottom: 8,
  },
  greyText: {
    fontSize: 14,
    marginRight: 5,
  },
  infoContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 20,
    maxHeight: 400,
  },
  alignCenter: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  swapContainer: {
    minHeight: 679,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 20,
    paddingTop: 8,
  },
  topItem: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.disabledBtn,
    borderRadius: 5,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  swapItem: {
    backgroundColor: COLORS.greyBackground,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 5,
  },
  spaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    fontSize: 20,
    fontWeight: "bold",
    minWidth: 110,
    textAlign: "right",
  },
  swapIcon: {
    position: "absolute",
    transform: [{ rotate: "90deg" }],
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9,
    top: 105,
    left: Dimensions.get("window").width / 2 - 40,
  },
});

export default SwapScreen;
