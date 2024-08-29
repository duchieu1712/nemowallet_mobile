import * as AccountReducers from "../../../../modules/account/reducers";
import * as HotwalletActions from "../../../../modules/hotwallet/actions";
import * as HotwalletReducers from "../../../../modules/hotwallet/reducers";
import * as WalletActions from "../../../../modules/wallet/actions";
import * as WalletReducers from "../../../../modules/wallet/reducers";

import {
  COLORS,
  FONTS,
  ICONS,
  MyTextApp,
  SIZES,
} from "../../../../themes/theme";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { TYPE_ACTION, TYPE_DEPOSIT } from "../../../../common/enum";
import {
  currencyFormat,
  descyptNEMOWallet,
  getFeeDeposit,
  getMinDeposit,
  getPoolBridge_Deposit_V2,
  roundDownNumber,
  toEther,
} from "../../../../common/utilities";
import { useDispatch, useSelector } from "react-redux";
import { useRoute, useTheme } from "@react-navigation/native";

import { ClassWithStaticMethod } from "../../../../common/static";
import DropdownSelectCoinComponent from "../../Component/SelectCoinComponent";
import InputComponent from "../../../../components/InputComponent";
import NetworkDropdownComponent from "../../Component/SelectNetworkComponent";
import cf_coins from "../../../../config/coins";
import { cf_hotwalletsReceiveToken } from "../../../../config/kogi-api";
import { useTranslation } from "react-i18next";

export default function DepositV2Component({ isFilter }: { isFilter: any }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const route = useRoute();
  const [data, setData] = useState<any>();

  // Account
  const accountWeb = useSelector(AccountReducers.dataAccount);
  const [coinSelected, setCoinSelected] = useState<any>(null);
  const [coinSelectedETH, setCoinSelectedETH] = useState<any>(null);
  const [networkSelected, setNetworkSelected] = useState<any>(null);
  const [symbol, setSymbol] = useState("");

  const [bridgePools, setBridgePools] = useState<any>(null);
  const [poolSelected, setPoolSelected] = useState<any>(null);
  const account: string = useSelector(WalletReducers.selectedAddress);
  const chainID = useSelector(WalletReducers.selectedChainId);
  // const jsonrpc = useSelector(JsonrpcReducers.dump)
  const bridgePoolsReponse = useSelector(HotwalletReducers.bridgePoolResponse);
  const dispatch = useDispatch();
  // Account
  // const accountWeb = useSelector(AccountReducers.dataAccount)
  const dispatchReload = () => dispatch(WalletActions.reload());
  const dispatchGetBridgePools = () =>
    dispatch(HotwalletActions.getBridgePools(TYPE_DEPOSIT.DEPOSIT_AUTO));

  const dispatchContractCallOnchainBalances = () => {
    if (chainID !== ClassWithStaticMethod.NEMO_WALLET_CHAINID) {
      cf_hotwalletsReceiveToken.map((asset) => {
        dispatch(
          WalletActions.contractCallMetamask({
            namespace: asset.assetContractNamespace,
            method: "balanceOf",
            params: [account],
          }),
        );
      });
    }
  };

  const loadData = () => {
    dispatchReload();
    dispatchGetBridgePools();
    if (account) {
      dispatchContractCallOnchainBalances();
    }
  };

  useEffect(() => {
    if (!route.params) return;
    const { data }: any = route.params;
    setData(data);
  }, [route]);

  useEffect(() => {
    if (data) {
      setSymbol(data.symbol);
    } else {
      setSymbol("NEMO");
    }
  }, [data]);

  useEffect(() => {
    setBridgePools(bridgePoolsReponse?.supporting_pools);
  }, [bridgePoolsReponse]);

  useEffect(() => {
    loadData();
    if (symbol) {
      setCoinSelected(
        cf_coins.find(
          (e) =>
            e.symbol.toLowerCase() === symbol.toString().toLowerCase() &&
            e.chainID === ClassWithStaticMethod.NEMO_WALLET_CHAINID,
        ),
      );
      setCoinSelectedETH(
        cf_coins.find(
          (e) =>
            e.symbol.toLowerCase() === symbol.toString().toLowerCase() &&
            e.chainID === ClassWithStaticMethod.STATIC_DEFAULT_CHAINID,
        ),
      );
    }
  }, [isFilter, symbol]);

  useEffect(() => {
    if (!coinSelected || !networkSelected) {
      setPoolSelected(null);
      return;
    }
    const coin = cf_coins.find(
      (e) =>
        e.symbol === coinSelected.symbol &&
        e.chainID === networkSelected?.chainId,
    );
    const pool = getPoolBridge_Deposit_V2(
      bridgePools,
      networkSelected?.chainId,
      coin?.contract,
    );
    setPoolSelected(pool);
    setCoinSelectedETH(coin);
  }, [coinSelected, networkSelected]);

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
      <View style={{ ...styles.content, paddingTop: 16 }}>
        <MyTextApp style={{ ...styles.titleContent, color: colors.title }}>
          {t("wallet.token")}
        </MyTextApp>
        <DropdownSelectCoinComponent
          chainID={chainID}
          coinSelected={coinSelected}
          setCoinSelected={setCoinSelected}
          type={TYPE_ACTION.RECECEIVE}
        />
      </View>

      <View style={styles.content}>
        <MyTextApp style={{ ...styles.titleContent, color: colors.title }}>
          {t("wallet.network")}
        </MyTextApp>
        <NetworkDropdownComponent
          bridgePools={bridgePools}
          coinSelected={coinSelected}
          networkSelected={networkSelected}
          setNetworkSelected={setNetworkSelected}
          type={TYPE_ACTION.SEND}
          type_deposit_withdraw={TYPE_DEPOSIT.DEPOSIT_AUTO}
        />
      </View>
      <View style={styles.content}>
        <MyTextApp
          style={{
            ...styles.titleContent,
            marginBottom: 8,
            position: "relative",
            color: colors.title,
          }}
        >
          {t("common.address")}
        </MyTextApp>

        <View style={{ position: "relative" }}>
          <InputComponent
            value={descyptNEMOWallet(accountWeb?.nemo_address)}
            style={{
              ...styles.textInput,
              backgroundColor: colors.input,
              color: colors.title,
              borderWidth: 0,
              height: 52,
            }}
            height={52}
            showClear={false}
          />
        </View>
      </View>
      <View
        style={[
          styles.content,
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          },
        ]}
      >
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexDirection: "row",
            columnGap: 12,
            flex: 1,
          }}
        >
          <View
            style={{
              alignItems: "flex-start",
              justifyContent: "center",
              flexWrap: "wrap",
              width: (SIZES.width - 56) / 3,
            }}
          >
            <MyTextApp
              style={{
                color: COLORS.descriptionText,
                ...FONTS.font,
                textTransform: "uppercase",
                fontWeight: "700",
                fontSize: 12,
              }}
            >
              {t("wallet.limit_deposit")}
            </MyTextApp>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: 8,
                // flexWrap: "wrap",
              }}
            >
              {coinSelected && (
                <Image
                  source={ICONS[coinSelected?.symbol?.toLowerCase()]}
                  alt=""
                  style={[styles.icon_2]}
                />
              )}
              <MyTextApp
                style={{ color: colors.title, ...FONTS.font, flex: 1 }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {currencyFormat(roundDownNumber(getMinDeposit(poolSelected))) +
                  " - " +
                  currencyFormat(
                    roundDownNumber(toEther(poolSelected?.max_in_wei ?? 0)),
                  )}
              </MyTextApp>
            </View>
          </View>

          <View
            style={{
              alignItems: "flex-start",
              justifyContent: "center",
              flexWrap: "wrap",
              width: (SIZES.width - 56) / 3,
            }}
          >
            <MyTextApp
              style={{
                color: COLORS.descriptionText,
                ...FONTS.font,
                textTransform: "uppercase",
                fontWeight: "700",
                fontSize: 12,
              }}
            >
              {t("wallet.network_fee")}
            </MyTextApp>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: 8,
                width: "100%",
                // flexWrap: "wrap",
              }}
            >
              <MyTextApp
                style={{
                  color: COLORS.warning,
                  ...FONTS.font,
                  fontWeight: "700",
                  flexDirection: "row",
                  alignItems: "center",

                  width: "100%",
                }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {(poolSelected?.receive?.received?.fees ?? 0) * 100}%
                <MyTextApp
                  style={{
                    fontWeight: 400,
                    color: colors.title,
                    ...FONTS.font,
                  }}
                >
                  ( {t("wallet.min")}:{" "}
                </MyTextApp>
                {coinSelected && (
                  <Image
                    source={ICONS[coinSelected?.symbol?.toLowerCase()]}
                    alt=""
                    style={[styles.icon_2]}
                  />
                )}
                <MyTextApp style={{ color: colors.title, fontWeight: "700" }}>
                  {currencyFormat(
                    roundDownNumber(
                      getFeeDeposit(poolSelected, coinSelectedETH?.decimals),
                    ),
                  )}
                </MyTextApp>
                <MyTextApp style={{ color: colors.title, fontWeight: "400" }}>
                  )
                </MyTextApp>
              </MyTextApp>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.line}></View>
      <View style={{}}>
        <View style={styles.textContainer}>
          <MyTextApp style={styles.dot}></MyTextApp>
          <MyTextApp style={styles.textWarning}>
            {t("wallet.deposit_wallet_address_notify_1")}{" "}
            <MyTextApp style={{ color: COLORS.warning }}>
              {networkSelected?.name}
            </MyTextApp>
            .
          </MyTextApp>
        </View>
        <View style={styles.textContainer}>
          <MyTextApp style={styles.dot}></MyTextApp>
          <MyTextApp style={styles.textWarning}>
            {t("wallet.deposit_wallet_address_notify_2", {
              coin: coinSelected?.symbol,
            })
              .split("{{coin}}")
              .map((e, i) =>
                e === coinSelected?.symbol ? (
                  <MyTextApp style={{ color: colors.text }} key={i}>
                    {e}
                  </MyTextApp>
                ) : (
                  e
                ),
              )}
          </MyTextApp>
        </View>
        <View>
          <View style={styles.textContainer}>
            <MyTextApp style={styles.dot}></MyTextApp>
            <MyTextApp style={styles.textWarning}>
              {t("wallet.cogi_address")}:
            </MyTextApp>
          </View>
          <MyTextApp
            style={{ color: colors.title, flex: 1, paddingLeft: 13 }}
            ellipsizeMode="tail"
          >
            {descyptNEMOWallet(accountWeb?.nemo_address)}
          </MyTextApp>
        </View>
        <View style={styles.textContainer}>
          <MyTextApp style={styles.dot}></MyTextApp>
          <MyTextApp style={styles.textWarning}>
            {t("wallet.deposit_wallet_address_notify_3")}
          </MyTextApp>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textTab: {
    color: "#fff",
    ...FONTS.font,
  },
  content: {
    width: "100%",
    flex: 1,
    marginBottom: 24,
    // marginTop: 16,
    paddingHorizontal: 4,
  },
  titleContent: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  icon_2: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  textInput: {
    color: COLORS.white,
    backgroundColor: COLORS.backgroundInput,
    paddingVertical: 13,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 8,
    ...FONTS.font,
    // marginTop: 8,
    width: "100%",
    flex: 1,
  },
  max: {
    position: "absolute",
    right: 16,
    top: 16,
    zIndex: 2,
    color: COLORS.warning,
    ...FONTS.font,
    textTransform: "uppercase",
  },
  line: {
    marginBottom: 32,
    height: 1,
    width: "100%",
    marginHorizontal: 4,
    backgroundColor: COLORS.borderColor,
  },
  textWarning: {
    color: COLORS.darkText,
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: COLORS.darkText,
    marginRight: 8,
  },
});
