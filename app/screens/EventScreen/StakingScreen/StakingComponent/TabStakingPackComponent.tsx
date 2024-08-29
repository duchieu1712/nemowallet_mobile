import * as AccountReducers from "../../../../modules/account/reducers";
import * as PoolsActions from "../../../../modules/stakes/actions";
import * as PoolsReducers from "../../../../modules/stakes/reducers";
import * as WalletActions from "../../../../modules/wallet/actions";
import * as WalletReducers from "../../../../modules/wallet/reducers";

import {
  COLORS,
  ICONS,
  IMAGES,
  MyTextApp,
  SIZES,
  STAKING_BG,
} from "../../../../themes/theme";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  currencyFormat,
  descyptNEMOWallet,
  isLogined,
  roundDownNumber,
  timestampToHuman,
  toWei,
} from "../../../../common/utilities";
import { useDispatch, useSelector } from "react-redux";

import { API_GET_PRICE_COGI } from "../../../../common/api";
import ActionModalsComponent from "../../../../components/ModalComponent/ActionModalsComponent";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import Collapsible from "react-native-collapsible";
import { ContractFromAddressCogiChain } from "../../../../modules/wallet/utilities";
import DividerComponent from "../../../../components/DividerComponent/DividerComponent";
import FeatherIcon from "react-native-vector-icons/Feather";
import { type IApprove } from "../../../../common/types";
import { IconLoadingDataComponent } from "../../../../components/LoadingComponent";
import { PACKAGE_STAKING } from "../../../../common/enum";
import { type PoolSimpleEarn } from "../../../../modules/graphql/types/generated";
import ScrollViewToTop from "../../../../components/ScrollToTopComponent";
import Toast from "../../../../components/ToastInfo";
import { contractCallWithToastCogiChain } from "../../../../components/RpcExec/toast";
import dayjs from "dayjs";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Carousel from "react-native-snap-carousel";

export default function TabStakingPackComponent() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [onProcessing, setOnProcessing] = useState(false);
  const [onAction, setOnAction] = useState(false);
  // Inventory
  // filter pool
  const [pools, setPools] = useState<any>(null);
  const [indexAssets, setIndexAssets] = useState<any>(0);
  // reload data
  const reloadData: boolean = useSelector(WalletReducers.reloadData);
  const accountWeb = useSelector(AccountReducers.dataAccount);
  const contracts = useSelector(PoolsReducers.contracts);
  const dispatchReloadData = (flag: boolean) =>
    dispatch(WalletActions.reloadData(flag));
  const [onRequestPools, setOnRequestPools] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [priceCogi, setPriceCogi] = useState(0);
  //
  const dispatchGetData_Pools = () => dispatch(PoolsActions.getDataPools());
  const dataPoolsOnRequest = useSelector(PoolsReducers.dataPoolsOnRequest);
  const dataPoolsResponse: PoolSimpleEarn[] = useSelector(
    PoolsReducers.dataPoolsResponse,
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const getPriceCogi = () => {
    fetch(API_GET_PRICE_COGI)
      .then(async (data) => await data.json())
      .then((res: any) => {
        setPriceCogi(res);
      });
  };

  const loadData = () => {
    dispatchGetData_Pools();
    getPriceCogi();
  };

  useEffect(() => {
    if (reloadData) return;
    loadData();
  }, [accountWeb]);

  useEffect(() => {
    if (!reloadData) return;
    dispatchReloadData(false);
    loadData();
  }, []);

  useEffect(() => {
    if (refreshing) {
      loadData();
    }
  }, [refreshing]);

  // Pools
  useEffect(() => {
    setOnRequestPools(dataPoolsOnRequest > 0);
  }, [dataPoolsOnRequest]);

  useEffect(() => {
    if (onRequestPools) return;
    let ret: any = [];
    if (dataPoolsResponse !== null) {
      ret = [...ret, ...dataPoolsResponse];
      setRefreshing(false);
    }
    setPools(null);
    setPools(ret);
  }, [onRequestPools]);

  const getBackground = (item: any) => {
    switch (parseInt(item?.price)) {
      case PACKAGE_STAKING._DIAMOND:
        return STAKING_BG.diamond;
      case PACKAGE_STAKING._PLATINUM:
        return STAKING_BG.platinum;
      case PACKAGE_STAKING._GOLD:
        return STAKING_BG.gold;
      case PACKAGE_STAKING._SILVER:
        return STAKING_BG.silver;
      case PACKAGE_STAKING._BRONZE:
        return STAKING_BG.bronze;
      default:
        return STAKING_BG.bronze;
    }
  };
  const getEstAPR = (rewardRate: any, volume: any) => {
    if (priceCogi) {
      return roundDownNumber(
        ((rewardRate * 365 * 0.1) / (volume * priceCogi)) * 100,
        2,
      );
    } else {
      return 0;
    }
  };
  const getLockPeriod = (lockPeriod: any, roundDate: any) => {
    if (lockPeriod === 0) {
      return "Flexible";
    } else {
      if (roundDate === 60) {
        return roundDownNumber(lockPeriod / roundDate, 2) + " Minutes";
      } else if (roundDate === 3600) {
        return roundDownNumber(lockPeriod / roundDate, 2) + " Hours";
      }
      return roundDownNumber(lockPeriod / roundDate, 2) + " Days";
    }
  };
  const getValueDate = (value: any) => {
    if (parseInt(value?.limitPerUser) - value?.subscriptions?.length === 0) {
      return timestampToHuman(
        value.subscriptions[value.subscriptions.length - 1].valueDate,
      );
    } else {
      const now = dayjs().valueOf() / 1000;
      if (now < value?.startDate) {
        const temp = new Date(parseInt(value?.startDate) * 1000);
        temp.setDate(temp.getDate() + 1);
        return timestampToHuman(temp.getTime() / 1000);
      } else {
        const tempSecond = roundDownNumber(
          (now - value?.startDate) / value?.roundDate,
          0,
        );
        const temp = new Date(parseInt(value?.startDate) * 1000);
        if (value?.roundDate === 60) {
          temp.setMinutes(temp.getMinutes() + tempSecond + 1);
        } else if (value?.roundDate === 3600) {
          temp.setHours(temp.getHours() + tempSecond + 1);
        } else if (value?.roundDate === 86400) {
          temp.setDate(temp.getDate() + tempSecond + 1);
        }
        return timestampToHuman(temp.getTime() / 1000);
      }
    }
  };
  const getInterestEndDate = (value: any) => {
    if (value.lockPeriod === 0) return "";
    if (parseInt(value?.limitPerUser) - value?.subscriptions?.length === 0) {
      if (
        value.subscriptions[value.subscriptions.length - 1].interestEndDate ===
        0
      ) {
        return "";
      } else {
        return timestampToHuman(
          value.subscriptions[value.subscriptions.length - 1].interestEndDate,
        );
      }
    } else {
      const now = dayjs().valueOf() / 1000;
      if (now < value?.startDate) {
        if (value?.lockPeriod === 0) {
          return timestampToHuman(value?.endDate);
        } else {
          let temp =
            new Date(parseInt(value?.startDate) * 1000).getTime() / 1000;
          temp += parseInt(value?.lockPeriod);
          return timestampToHuman(temp);
        }
      } else {
        const tempSecond = roundDownNumber(
          (now - value?.startDate) / value?.roundDate,
          0,
        );
        const temp = new Date(parseInt(value?.startDate) * 1000);
        if (value?.roundDate === 60) {
          temp.setMinutes(temp.getMinutes() + tempSecond + 1);
        } else if (value?.roundDate === 3600) {
          temp.setHours(temp.getHours() + tempSecond + 1);
        } else if (value?.roundDate === 86400) {
          temp.setDate(temp.getDate() + tempSecond + 1);
        }
        const timestampStart =
          temp.getTime() / 1000 + parseInt(value?.lockPeriod);
        if (timestampStart > value?.endDate) {
          return timestampToHuman(value?.endDate);
        } else {
          return timestampToHuman(timestampStart);
        }
      }
    }
  };
  const get_Total_Pending_Reward = (value: any) => {
    if (parseInt(value?.price) === PACKAGE_STAKING._BRONZE) return "0";
    const res =
      value?.rewardRate *
        value?.limit *
        (value?.lockPeriod / value?.roundDate) -
      value?.paid;
    if (res > 0) {
      return currencyFormat(roundDownNumber(res));
    } else {
      return "0";
    }
  };
  const get_Total_Deposit = (value: any) => {
    const res = (value?.sold - value?.redeemed) * value?.price;
    if (res > 0) {
      return currencyFormat(res);
    } else {
      return "0";
    }
  };
  const onStaking = (value: any) => {
    let method = "subscribe";
    if (value?.pool?.nativeTokenAllowed) {
      method = "subscribeETH";
    }
    const contract = contracts?.find((e: any) => e.address === value?.pool?.id);
    if (contract) {
      const currencyContract = ContractFromAddressCogiChain(
        value?.pool?.stakingToken,
      );
      let approve: IApprove | IApprove[] = [];
      if (!value?.pool?.nativeTokenAllowed) {
        const _amount: any = toWei(value?.price, 18);
        approve = {
          contract: currencyContract,
          owner: descyptNEMOWallet(accountWeb?.nemo_address),
          spender: contract.address,
          amount: _amount,
        };
      }
      contractCallWithToastCogiChain(
        contract.contract,
        method,
        [value?.productId, 1],
        approve,
        { value: toWei(value?.price)?.toString() },
      )
        .then(async () => {
          setOnProcessing(false);
          Toast.success(t("event.staking_success"));
        })
        .catch((e: any) => {
          // eslint-disable-next-line no-console
          console.log(t("event.fail_zap") + e);
          setOnProcessing(false);
        });
    } else {
      setOnProcessing(false);
      Toast.error(t("event.staking_error"));
    }
  };

  const _renderItem = ({ item, index }: { item: any; index: any }) => {
    return (
      <ImageBackground
        source={getBackground(item)}
        style={{
          borderRadius: 12,
          height: 152,
        }}
        borderRadius={12}
        resizeMode="contain"
      >
        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 20,
            width: "100%",
            gap: 8,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <MyTextApp
              style={{ fontWeight: "bold", fontSize: 18, color: COLORS.white }}
            >
              {t("event.stake")} {currencyFormat(item?.price)}
            </MyTextApp>
            <Image source={ICONS.cogi} style={{ width: 18, height: 18 }} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <MyTextApp style={{ fontWeight: "bold", color: COLORS.white }}>
              Est.APR:{" "}
            </MyTextApp>
            <MyTextApp style={{ fontWeight: "bold", color: COLORS.neon }}>
              {getEstAPR(item?.rewardRate, item?.price)} %
            </MyTextApp>
          </View>
          <MyTextApp style={{ fontWeight: "bold", color: COLORS.white }}>
            {t("event.quantity")}: {currencyFormat(item?.sold)} /
            {currencyFormat(item?.limit)}
          </MyTextApp>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <MyTextApp style={{ fontWeight: "bold", color: COLORS.white }}>
              {t("event.chances_wallet")}:{" "}
            </MyTextApp>
            <MyTextApp style={{ fontWeight: "bold", color: COLORS.neon }}>
              {parseInt(item?.limitPerUser) - item?.subscriptions?.length}
            </MyTextApp>
          </View>
        </View>
      </ImageBackground>
    );
  };

  return (
    <>
      {onRequestPools ? (
        <View style={{ flex: 1, alignItems: "center" }}>
          <IconLoadingDataComponent />
        </View>
      ) : (
        <ScrollViewToTop
          style={{ height: SIZES.height }}
          refreshing={refreshing}
          onRefresh={onRefresh}
        >
          {pools && pools.length !== 0 ? (
            pools?.map((pool: any, i: any) => {
              const item = pool.products[indexAssets];
              return (
                <>
                  <Carousel
                    layout={"default"}
                    // ref={(ref:any) => (this.carousel = ref)}
                    data={pool?.products}
                    sliderWidth={SIZES.width - 38}
                    itemWidth={298}
                    inactiveSlideScale={0.9}
                    inactiveSlideOpacity={1}
                    renderItem={_renderItem}
                    onSnapToItem={(index: any) => {
                      setIndexAssets(index);
                    }}
                    hasParallaxImages={true}
                    activeSlideAlignment="center"
                  />
                  <View
                    style={{
                      alignItems: "center",
                      marginVertical: 16,
                    }}
                  >
                    <View style={{ width: 298, gap: 16 }}>
                      <View style={{ gap: 8 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <MyTextApp style={{ color: colors.text }}>
                            {t("event.duration")}:
                          </MyTextApp>
                          <MyTextApp
                            style={{ color: COLORS.neon, fontWeight: "bold" }}
                          >
                            {getLockPeriod(item?.lockPeriod, item?.roundDate)}
                          </MyTextApp>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <MyTextApp style={{ color: colors.text }}>
                            {t("event.value_date")}:
                          </MyTextApp>
                          <MyTextApp
                            style={{ color: colors.title, fontWeight: "bold" }}
                          >
                            {getValueDate(item)}
                          </MyTextApp>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <MyTextApp style={{ color: colors.text }}>
                            {t("event.interest_end_date")}:
                          </MyTextApp>
                          <MyTextApp
                            style={{ color: colors.title, fontWeight: "bold" }}
                          >
                            {getInterestEndDate(item)}
                          </MyTextApp>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <MyTextApp style={{ color: colors.text }}>
                            {t("event.interest")}:
                          </MyTextApp>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <MyTextApp
                              style={{
                                color: colors.title,
                                fontSize: 18,
                                fontWeight: "bold",
                              }}
                            >
                              {currencyFormat(
                                roundDownNumber(item?.rewardRate, 3),
                              )}
                            </MyTextApp>
                            <Image
                              source={ICONS.nemo}
                              style={{ width: 16, height: 16 }}
                            />
                          </View>
                        </View>
                      </View>
                      {item?.limit === item?.sold ? (
                        <ButtonComponent
                          title={t("event.sold_out")}
                          color={COLORS.red}
                        />
                      ) : (
                        <>
                          {parseInt(item?.limitPerUser) -
                            item?.subscriptions?.length ===
                          0 ? (
                            <ButtonComponent
                              title={t("event.staking_limit")}
                              disabled
                            />
                          ) : (
                            <ButtonComponent
                              title={t("event.stake_now")}
                              onProcessing={onProcessing}
                              onPress={() => {
                                if (
                                  parseInt(item?.limitPerUser) -
                                    item?.subscriptions?.length ===
                                  0
                                ) {
                                  return;
                                }
                                if (isLogined()) {
                                  setOnAction(true);
                                } else {
                                  Toast.error("Please Login to stake!");
                                }
                              }}
                            />
                          )}
                        </>
                      )}
                      <DividerComponent />
                      <View style={{ gap: 8, alignItems: "center" }}>
                        <TouchableOpacity
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 8,
                          }}
                          onPress={() => {
                            setIsCollapsed(!isCollapsed);
                          }}
                        >
                          <MyTextApp style={{ color: colors.title }}>
                            {isCollapsed ? t("event.details") : t("event.hide")}
                          </MyTextApp>
                          <FeatherIcon
                            name={isCollapsed ? "chevron-down" : "chevron-up"}
                            color={colors.title}
                            size={24}
                          />
                        </TouchableOpacity>
                        <Collapsible
                          collapsed={isCollapsed}
                          style={{ width: 298 }}
                        >
                          <ScrollView style={{ height: 200 }}>
                            <View style={{ gap: 8, width: "100%" }}>
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  width: "100%",
                                }}
                              >
                                <MyTextApp style={{ color: colors.text }}>
                                  {t("event.total_deposit")}:
                                </MyTextApp>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 5,
                                  }}
                                >
                                  <MyTextApp
                                    style={{
                                      color: colors.title,
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {get_Total_Deposit(item)}
                                  </MyTextApp>
                                  <Image
                                    source={ICONS.cogi}
                                    style={{ width: 16, height: 16 }}
                                  />
                                </View>
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  width: "100%",
                                }}
                              >
                                <MyTextApp style={{ color: colors.text }}>
                                  {t("event.total_pending")}:
                                </MyTextApp>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 5,
                                  }}
                                >
                                  <MyTextApp
                                    style={{
                                      color: colors.title,
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {get_Total_Pending_Reward(item)}
                                  </MyTextApp>
                                  <Image
                                    source={ICONS.nemo}
                                    style={{ width: 16, height: 16 }}
                                  />
                                </View>
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  width: "100%",
                                }}
                              >
                                <MyTextApp style={{ color: colors.text }}>
                                  {t("event.withdraw")}:
                                </MyTextApp>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 5,
                                  }}
                                >
                                  <MyTextApp
                                    style={{
                                      color: colors.title,
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {currencyFormat(
                                      roundDownNumber(item?.paid),
                                    )}
                                  </MyTextApp>
                                  <Image
                                    source={ICONS.nemo}
                                    style={{ width: 16, height: 16 }}
                                  />
                                </View>
                              </View>
                            </View>
                          </ScrollView>
                        </Collapsible>
                      </View>
                    </View>
                  </View>
                  <ActionModalsComponent
                    modalVisible={onAction}
                    closeModal={() => {
                      setOnAction(false);
                    }}
                    iconClose
                  >
                    <View
                      style={{
                        ...styles.modalContent,
                        backgroundColor: colors.card,
                      }}
                    >
                      <View style={{ position: "relative", width: "100%" }}>
                        <MyTextApp
                          style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            color: colors.title,
                            textAlign: "center",
                          }}
                        >
                          {t("event.staking")}
                        </MyTextApp>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <MyTextApp
                          style={{
                            color: colors.title,
                            fontWeight: "bold",
                          }}
                        >
                          {t("event.do_u_want_stake")}{" "}
                          {currencyFormat(item?.price)}
                        </MyTextApp>
                        <Image
                          source={ICONS.cogi}
                          style={{ width: 16, height: 16 }}
                        />
                      </View>
                      <ButtonComponent
                        title={t("common.confirm")}
                        onPress={() => {
                          setOnProcessing(true);
                          setOnAction(false);
                          onStaking(item);
                        }}
                      />
                    </View>
                  </ActionModalsComponent>
                </>
              );
            })
          ) : (
            <View style={{ width: "100%", alignItems: "center", gap: 20 }}>
              <Image
                source={IMAGES.no_data}
                resizeMode="contain"
                style={{ width: "80%", height: 200 }}
              />
              <MyTextApp
                style={{
                  color: colors.title,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                {t("event.no_pool_staking")}
              </MyTextApp>
            </View>
          )}
        </ScrollViewToTop>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#00000081",
    padding: 30,
  },
  modalContent: {
    margin: 20,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 20,
    alignItems: "center",
    width: "90%",
    gap: 24,
  },
  closeBtn: {
    position: "absolute",
    right: 0,
    top: 0,
  },
});
