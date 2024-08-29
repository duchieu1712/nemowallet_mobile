import * as AccountReducers from "../../../../modules/account/reducers";
import * as HotwalletActions from "../../../../modules/hotwallet/actions";
import * as HotwalletReducers from "../../../../modules/hotwallet/reducers";
import * as LandActions from "../../../../modules/landing/actions";
import * as LandReducers from "../../../../modules/landing/reducers";
import * as WalletActions from "../../../../modules/wallet/actions";
import * as WalletReducers from "../../../../modules/wallet/reducers";

import {
  COLORS,
  FONTS,
  ICONS,
  IMAGES,
  MyTextApp,
} from "../../../../themes/theme";
import { FlatList, Image, ImageBackground, View } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { formatTokenNumber } from "../../../../common/utilities";
import { useDispatch, useSelector } from "react-redux";

import { IconLoadingDataComponent } from "../../../../components/LoadingComponent";
import LandComponent from "./LandComponent";
import NoDataComponent from "../../../../components/NoDataComponent";
import ScrollViewToTop from "../../../../components/ScrollToTopComponent";
import { cf_hotwallets as hotwalletsConfig } from "../../../../config/kogi-api";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { balancesFromHotwalletSaga } from "../../../../common/utilities_config";

export default function TabLandComponent({
  changeTagFocus,
}: {
  changeTagFocus: any;
}) {
  const { colors, dark } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // Inventory
  // Account
  const accountWeb = useSelector(AccountReducers.dataAccount);
  const dataLandingOnRequest = useSelector(LandReducers.dataLandingOnRequest);
  const dataLandingResponse: any = useSelector(
    LandReducers.dataLandingResponse,
  );
  // reload data
  const reloadData: boolean = useSelector(WalletReducers.reloadData);
  // balances
  const [assets, setAssets] = useState<any>(null);
  const [isPendingNemo, setIsPendingNemo] = useState(true);
  const [isPendingResource, setIsPendingResource] = useState(true);
  // const [onRequestClaimToken, setonRequestClaimToken] = useState(false)
  const [flagPendingClaimToken, setFlagPendingClaimToken] = useState(false);
  const [flagPendingClaimResource, setFlagPendingClaimResource] =
    useState(false);
  const [hasWhiteList, setHasWhiteList] = useState<any>(null);
  const [onchainBalances, setOnchainBalances] = useState<any>([]);
  const [balanceNemo, setBalanceNemo] = useState("0");

  const dispatchReloadData = (flag: boolean) =>
    dispatch(WalletActions.reloadData(flag));
  const [onRequestLanding, setOnRequestLanding] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);
  //
  const dispatchGetDataLanding = () => dispatch(LandActions.getDataLanding());

  useEffect(() => {
    if (reloadData || !accountWeb) return;
    loadData();
  }, [accountWeb]);

  useEffect(() => {
    if (refreshing && accountWeb) {
      loadData();
    } else {
      setRefreshing(false);
    }
  }, [refreshing]);

  useEffect(() => {
    if (!reloadData) return;
    dispatchReloadData(false);
    loadData();
  }, []);

  useEffect(() => {
    setOnRequestLanding(dataLandingOnRequest > 0);
  }, [dataLandingOnRequest]);

  useEffect(() => {
    if (onRequestLanding) return;
    setAssets(dataLandingResponse?.landinfo);
    setIsPendingNemo(dataLandingResponse?.nemo_hotwallet_pendingonchain);
    setIsPendingResource(
      dataLandingResponse?.erc721_galix_resource_pendingonchain,
    );
    setRefreshing(false);
  }, [onRequestLanding]);

  const loadData = () => {
    dispatchGetDataLanding();
    getHasWhiteList();
    dispatchContractCallOnchainBalances();
  };

  const getHasWhiteList = async () => {
    try {
      setHasWhiteList([]);
      // const contract = ContractFromNamespace('erc721_galixnft_rentland')
      // if (contract) {
      //   const temp = await contract.hasWhitelist()
      //   setHasWhiteList(temp)
      // }
    } catch (e: any) {
      throw new Error(e);
    }
  };

  // balance NEMO
  const getBalancesResponse = useSelector(
    HotwalletReducers.getBalancesResponse,
  );
  const dispatchContractCallOnchainBalances = () => {
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

  useEffect(() => {
    setOnchainBalances(balancesFromHotwalletSaga(getBalancesResponse));
  }, [getBalancesResponse]);

  useEffect(() => {
    if (!onchainBalances) {
      setBalanceNemo("0");
      return;
    }
    // onchain Balances
    setBalanceNemo(getBalancesNEMO());
  }, [onchainBalances]);

  const getBalancesNEMO = (): string => {
    if (!onchainBalances) return "0";
    const temp = onchainBalances.find(
      (e: any) => e.assetData.contractNamespace === "nemo_coin",
    );
    return temp?.balance;
  };

  const RenderItem = useMemo(() => {
    return ({ item, index }: { item: any; index: any }) => (
      <LandComponent
        key={index}
        land={item}
        reload={loadData}
        flagPendingClaimToken={flagPendingClaimToken}
        setFlagPendingClaimToken={setFlagPendingClaimToken}
        flagPendingClaimResource={flagPendingClaimResource}
        setFlagPendingClaimResource={setFlagPendingClaimResource}
        isPendingNemo={isPendingNemo}
        balanceNemo={balanceNemo}
        isPendingResource={isPendingResource}
        changeTagFocus={changeTagFocus}
        hasWhiteList={hasWhiteList}
        dispatchContractCallOnchainBalances={
          dispatchContractCallOnchainBalances
        }
      />
    );
  }, [assets, dark]);

  return (
    <>
      {onRequestLanding ? (
        <View style={{ flex: 1, alignItems: "center" }}>
          <IconLoadingDataComponent />
        </View>
      ) : (
        <>
          {assets && assets.length !== 0 ? (
            <ScrollViewToTop
              refreshing={refreshing}
              onRefresh={onRefresh}
              style={{ paddingHorizontal: 16, gap: 16, paddingVertical: 16 }}
              bottomIcon={80}
            >
              <View
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                }}
              >
                <ImageBackground
                  style={{
                    height: 85,
                    // padding: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                  }}
                  borderRadius={12}
                  source={IMAGES.chart1_bg}
                >
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: dark
                        ? "rgba(0, 0, 0, 0.4)"
                        : "rgba(255, 255, 255, 0.4)",
                      borderRadius: 12,
                    }}
                  ></View>
                  <View
                    style={{
                      backgroundColor: COLORS.danger,
                      borderRadius: 12,
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 4,
                      width: 40,
                      height: 40,
                    }}
                  >
                    <Image
                      source={IMAGES.chart1}
                      alt=""
                      style={{
                        width: 32,
                        height: 32,
                      }}
                    />
                  </View>
                  <View style={{ gap: 5, minWidth: 80 }}>
                    <MyTextApp
                      style={{
                        // fontSize: 12,
                        ...FONTS.fontBold,
                        color: colors.title,
                      }}
                    >
                      {t("event.total_land")}
                    </MyTextApp>
                    <MyTextApp
                      style={{
                        fontSize: 20,
                        ...FONTS.fontBold,
                        color: colors.title,
                      }}
                    >
                      {dataLandingOnRequest > 0 ? 0 : assets?.length}
                    </MyTextApp>
                  </View>
                </ImageBackground>
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                }}
              >
                <ImageBackground
                  style={{
                    height: 85,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                  }}
                  borderRadius={12}
                  source={IMAGES.chart2_bg}
                >
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: dark
                        ? "rgba(0, 0, 0, 0.4)"
                        : "rgba(255, 255, 255, 0.4)",
                      borderRadius: 12,
                    }}
                  ></View>
                  <View
                    style={{
                      backgroundColor: COLORS.primary,
                      borderRadius: 12,
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 4,
                      width: 40,
                      height: 40,
                    }}
                  >
                    <Image
                      source={IMAGES.chart2}
                      alt=""
                      style={{
                        width: 32,
                        height: 32,
                      }}
                    />
                  </View>
                  <View style={{ gap: 5, minWidth: 80 }}>
                    <MyTextApp
                      style={{
                        // fontSize: 12,
                        ...FONTS.fontBold,
                        color: colors.title,
                      }}
                    >
                      {t("event.total_volume")}
                    </MyTextApp>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <Image
                        source={ICONS.nemo}
                        style={{ width: 20, height: 20 }}
                      />
                      <MyTextApp
                        style={{
                          fontSize: 20,
                          ...FONTS.fontBold,
                          color: colors.title,
                        }}
                      >
                        {dataLandingOnRequest > 0
                          ? 0
                          : formatTokenNumber(
                              assets?.reduce(
                                (previousValue: any, e: any) =>
                                  previousValue +
                                  parseFloat(e.unclaimed_tokens),
                                0,
                              ),
                            )}
                      </MyTextApp>
                    </View>
                  </View>
                </ImageBackground>
              </View>
              <View style={{ gap: 16, paddingBottom: 150 }}>
                <FlatList
                  nestedScrollEnabled
                  scrollEnabled={false}
                  data={assets}
                  renderItem={RenderItem}
                />
                {/* {assets?.map((e: LandInfo, i: any) => (
                  <LandComponent
                    key={i}
                    land={e}
                    reload={loadData}
                    flagPendingClaimToken={flagPendingClaimToken}
                    setFlagPendingClaimToken={setFlagPendingClaimToken}
                    flagPendingClaimResource={flagPendingClaimResource}
                    setFlagPendingClaimResource={setFlagPendingClaimResource}
                    isPendingNemo={isPendingNemo}
                    balanceNemo={balanceNemo}
                    isPendingResource={isPendingResource}
                    changeTagFocus={changeTagFocus}
                    hasWhiteList={hasWhiteList}
                    dispatchContractCallOnchainBalances={
                      dispatchContractCallOnchainBalances
                    }
                  />
                ))} */}
              </View>
            </ScrollViewToTop>
          ) : (
            <NoDataComponent />
          )}
        </>
      )}
    </>
  );
}
