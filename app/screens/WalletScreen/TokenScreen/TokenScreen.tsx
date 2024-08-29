import * as HotwalletActions from "../../../modules/hotwallet/actions";
import * as HotwalletReducers from "../../../modules/hotwallet/reducers";

import { COLORS, FONTS, ICONS, MyTextApp, SIZES } from "../../../themes/theme";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { TYPE_DEPOSIT, TYPE_DEPOSIT_WITHDRAW } from "../../../common/enum";
import {
  currencyFormat,
  isLogined,
  roundDownNumber,
} from "../../../common/utilities";
import { useDispatch, useSelector } from "react-redux";
import { useRoute, useTheme } from "@react-navigation/native";

import FeatherIcon from "react-native-vector-icons/Feather";
import ListTransactionAllComponent from "../Component/ListTransactionAllComponent";
import ListTransactionPendingComponent from "../Component/ListTransactionPendingComponent";
import ListTransactionReceiveComponent from "../Component/ListTransactionReceiveComponent";
import ListTransactionSendComponent from "../Component/ListTransactionSendComponent";
import ScrollViewToTop from "../../../components/ScrollToTopComponent";
import SelectDropdown from "react-native-select-dropdown";
import { useTranslation } from "react-i18next";

export default function TokenScreen({ navigation }: { navigation: any }) {
  const route = useRoute();
  const { data }: any = route.params;

  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const filter = [
    {
      key: 1,
      filterName: "All",
    },
    {
      key: 2,
      filterName: "IN",
    },
    {
      key: 3,
      filterName: "OUT",
    },
    {
      key: 4,
      filterName: "Pending",
    },
  ];

  const [refresh, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(filter[0]);
  const [transactions, setTransactions] = useState<any>([]);
  const [transactionsPending, setTransactionsPending] = useState<any>([]);
  const [bridgePools, setBridgePools] = useState(null);
  const bridgePoolsReponse = useSelector(HotwalletReducers.bridgePoolResponse);

  const dispatchGetBridgePools = () =>
    dispatch(HotwalletActions.getBridgePools(TYPE_DEPOSIT.DEPOSIT));

  const getTransactionsResponse = useSelector(
    HotwalletReducers.getTransactionsResponse,
  );
  const bridgeAvailableResponse = useSelector(
    HotwalletReducers.bridgeAvailableResponse,
  );

  const dispatchGetTransactions = (request: any) => {
    dispatch(
      HotwalletActions.getTransactions({
        tokenAddress: data?.contract,
        isNative: data?.native,
        next_page_params: request,
      }),
    );
  };

  useEffect(() => {
    bridgePoolsReponse?.pools && setBridgePools(bridgePoolsReponse?.pools);
  }, [bridgePoolsReponse]);

  const dispatchGetBridgeAvailable = () =>
    dispatch(HotwalletActions.getBridgeAvailable());

  useEffect(() => {
    setRefreshing(false);
    if (getTransactionsResponse) {
      setTransactions(getTransactionsResponse?.items ?? []);
    } else {
      setTransactions([]);
    }
  }, [getTransactionsResponse]);

  useEffect(() => {
    bridgeAvailableResponse &&
      setTransactionsPending(bridgeAvailableResponse ?? []);
    setRefreshing(false);
  }, [bridgeAvailableResponse]);

  const reloadData = () => {
    cleanup();
    if (selectedFilter.filterName === "Pending") {
      dispatchGetBridgeAvailable();
      dispatchGetBridgePools();
    } else {
      dispatchGetTransactions(transactions?.next_page_params);
    }
  };

  const cleanup = () => {
    setTransactions(null);
    setTransactionsPending(null);
    setBridgePools(null);
  };

  const initData = () => {
    setTransactions([]);
    setTransactionsPending([]);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  useEffect(() => {
    if (!refresh) return;
    if (isLogined()) {
      reloadData();
    } else {
      setRefreshing(false);
      initData();
    }
  }, [refresh]);

  useEffect(() => {
    if (isLogined()) {
      reloadData();
    } else {
      setRefreshing(false);
      initData();
    }
  }, [selectedFilter]);

  useEffect(() => {
    filter.length !== 0 && setSelectedFilter(filter[0]);
  }, []);

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: colors.background,
        height: SIZES.height,
      }}
    >
      <ScrollViewToTop
        refreshing={refresh}
        onRefresh={onRefresh}
        bottomIcon={50}
      >
        <View style={{ width: "100%" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <MyTextApp
              style={{
                fontSize: 18,
                ...FONTS.fontMedium,
                color: colors.title,
                fontWeight: "700",
                flex: 1,
                textAlign: "center",
                marginLeft: 25,
              }}
            >
              {data?.name}
            </MyTextApp>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              // onPress={() => navigation.navigate("SearchScreen" as never)}
              style={{
                height: 24,
                width: 24,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 48,
                borderWidth: 1,
                borderColor: colors.title,
              }}
            >
              <FeatherIcon size={16} color={colors.title} name="x" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
              width: "100%",
              paddingHorizontal: 15,
            }}
          >
            <View
              style={{
                width: "100%",
                borderRadius: 12,
                flex: 1,
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: "100%",
                  paddingVertical: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.card,
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  rowGap: 12,
                }}
              >
                <Image
                  source={data?.logo}
                  alt="coin"
                  style={{ width: 48, height: 48 }}
                />
                <View
                  style={{
                    marginTop: 8,
                    flex: 1,
                    alignItems: "center",
                    columnGap: 5,
                    flexDirection: "row",
                  }}
                >
                  <MyTextApp
                    style={{
                      fontSize: 18,
                      color: colors.title,
                      fontWeight: "700",
                    }}
                  >
                    {currencyFormat(
                      roundDownNumber(data?.amount.shortBalance, 6),
                    )}
                  </MyTextApp>
                  <MyTextApp style={{ color: colors.text, ...FONTS.font }}>
                    {data?.symbol}
                  </MyTextApp>
                </View>
              </View>
              <View
                style={{
                  marginBottom: 10,
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 10,
                  marginRight: 24,
                  columnGap: 24,
                }}
              >
                {data.typeDeposit_Withdraw?.map((e: any) =>
                  e === TYPE_DEPOSIT_WITHDRAW._TYPE_DEPOSIT ? (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("DepositScreen" as never, { data })
                      }
                      // onPress={() => {
                      //   setWalletRBSheet("DepositScreen"), refRBSheet.current.open()
                      // }}
                      key={e}
                      style={{
                        paddingHorizontal: 15,
                        paddingVertical: 8,
                        borderRadius: SIZES.radius,
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 16,
                          marginBottom: 6,
                        }}
                      >
                        <FeatherIcon
                          size={24}
                          color={colors.title}
                          name="anchor"
                        />
                      </View>
                      <MyTextApp
                        style={{
                          ...FONTS.fontSm,
                          color: colors.title,
                          // opacity: 0.6,
                        }}
                      >
                        {t("wallet.deposit")}
                      </MyTextApp>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("WithdrawScreen" as never, {
                          data,
                        });
                      }}
                      key={e}
                      style={{
                        paddingHorizontal: 15,
                        paddingVertical: 8,
                        borderRadius: SIZES.radius,
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 16,
                          marginBottom: 6,
                        }}
                      >
                        <FeatherIcon
                          size={24}
                          color={colors.title}
                          name="share"
                        />
                      </View>
                      <MyTextApp
                        style={{
                          ...FONTS.fontSm,
                          color: colors.title,
                          // opacity: 0.6,
                        }}
                      >
                        {t("wallet.withdraw")}
                      </MyTextApp>
                    </TouchableOpacity>
                  ),
                )}
                {data.allowSwap && (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("SwapScreen" as never, {
                        token: data,
                      })
                    }
                    style={{
                      paddingHorizontal: 15,
                      paddingVertical: 8,
                      borderRadius: SIZES.radius,
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        // backgroundColor: "rgba(255,255,255,.1)",
                        // height: 30,
                        // width: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 16,
                        marginBottom: 6,
                      }}
                    >
                      <FeatherIcon
                        size={24}
                        color={colors.title}
                        name="repeat"
                      />
                    </View>
                    <MyTextApp
                      style={{
                        ...FONTS.fontSm,
                        color: colors.title,
                        // opacity: 0.6,
                      }}
                    >
                      {t("wallet.swap")}
                    </MyTextApp>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>

        <View style={{ paddingBottom: 80 }}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
              paddingHorizontal: 15,
              marginBottom: 12,
            }}
          >
            <MyTextApp style={{ color: colors.text, ...FONTS.font }}>
              {t("wallet.transaction")}
            </MyTextApp>

            <SelectDropdown
              data={filter}
              onSelect={(item: any) => {
                setSelectedFilter(item);
              }}
              buttonTextAfterSelection={(_) =>
                t(`wallet.${selectedFilter.filterName.toLowerCase()}`)
              }
              defaultButtonText={t("wallet.select_filter")}
              defaultValue={selectedFilter}
              rowTextForSelection={(item) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return t(`wallet.${item?.filterName.toLowerCase()}`);
              }}
              dropdownStyle={{
                width: 120,
                shadowColor: "transparent",
                borderBottomRightRadius: 8,
                borderBottomLeftRadius: 8,
                paddingHorizontal: 4,
                paddingVertical: 10,
                backgroundColor: colors.card,
                marginTop: -35,
                elevation: 0,
                minHeight: 220,
              }}
              dropdownOverlayColor="transparent"
              rowStyle={{
                borderBottomColor: colors.background,
                backgroundColor: colors.card,
                borderRadius: 4,
              }}
              rowTextStyle={{
                color: colors.title,
              }}
              selectedRowStyle={{
                // backgroundColor: "#282C35",
                backgroundColor: colors.background,
              }}
              selectedRowTextStyle={{
                color: colors.title,
              }}
              buttonStyle={{
                //   height: 50,
                width: 120,
                backgroundColor: colors.card,
                borderRadius: 8,
                paddingHorizontal: 8,
                paddingVertical: 9,
              }}
              buttonTextStyle={{
                color: colors.title,
              }}
              renderDropdownIcon={() => (
                <Image
                  source={ICONS.dropDown}
                  style={{ width: 16, height: 16 }}
                />
              )}
            />
          </View>
          {selectedFilter.filterName === "All" && (
            <ListTransactionAllComponent
              coinSelected={data}
              transactions={transactions}
            />
          )}
          {selectedFilter.filterName === "IN" && (
            <ListTransactionReceiveComponent
              coinSelected={data}
              transactions={transactions}
            />
          )}
          {selectedFilter.filterName === "OUT" && (
            <ListTransactionSendComponent
              coinSelected={data}
              transactions={transactions}
            />
          )}
          {selectedFilter.filterName === "Pending" && (
            <ListTransactionPendingComponent
              data={data}
              transactions={transactionsPending}
              bridgePools={bridgePools}
            />
          )}
        </View>
      </ScrollViewToTop>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.darkBackground,
    flex: 1,
    borderTopWidth: 5,
    borderTopColor: COLORS.primary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  mainContainer: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
  },

  content: {
    flex: 1,
    paddingHorizontal: 15,
    color: COLORS.white,
    // borderWidth: 1,
    // borderColor: "red"
  },
  contentTitle: {
    color: COLORS.white,
    ...FONTS.font,
  },
  items: {
    marginTop: 12,
    width: "100%",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#35383F",
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  item: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
    overflow: "visible",
    minWidth: 40,
    maxWidth: 40,
    marginRight: 8,
  },
  in: {
    width: 40,
    height: 40,
    borderRadius: 50,
    position: "relative",
    backgroundColor: "rgba(71, 164, 50, 0.10)",
    color: "#48B62F",
    flex: 1,
    textAlignVertical: "center",
    textAlign: "center",
    fontWeight: "700",
    ...FONTS.font,
  },
  out: {
    width: 40,
    height: 40,
    borderRadius: 50,
    position: "relative",
    backgroundColor: "rgba(232, 168, 41, 0.1)",
    color: "#FFBD0C",
    flex: 1,
    textAlignVertical: "center",
    textAlign: "center",
    fontWeight: "700",
    ...FONTS.font,
  },

  pending: {
    width: 40,
    height: 40,
    borderRadius: 50,
    position: "relative",
    backgroundColor: "rgba(223, 73, 73, 0.10)",
    color: "#DF4949",
    flex: 1,
    textAlignVertical: "center",
    textAlign: "center",
    fontWeight: "700",
    ...FONTS.font,
  },

  checkIn: {
    position: "absolute",
    right: 0,
    bottom: -3,
    width: 16,
    height: 16,
    overflow: "visible",
  },

  titleTop: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: SIZES.width - 40 - 8 - 32,
    marginBottom: 8,
  },

  titleLeft: {
    fontFamily: "UTM-Daxline",
    fontWeight: "700",
    fontSize: 16,
    color: COLORS.white,
  },
  titleRight: {
    flex: 1,
    flexDirection: "row",
    columnGap: 8,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  rightImage: {
    width: 24,
    height: 24,
  },
  bottomPending: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonSend: {
    backgroundColor: "transparent",
    borderWidth: 1,
    bordercolor: "#fff",
    minWidth: 93,
    maxWidth: 93,
    maxHeight: 32,
    height: 32,
    borderRadius: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 4,
  },
  iconSend: {
    width: 16,
    height: 16,
  },
});
