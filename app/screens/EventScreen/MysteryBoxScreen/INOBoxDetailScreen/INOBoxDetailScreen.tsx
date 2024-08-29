import * as AccountReducers from "../../../../modules/account/reducers";
import * as BoxsActions from "../../../../modules/mysterybox/actions";
import * as BoxsReducers from "../../../../modules/mysterybox/reducers";
import * as HotwalletActions from "../../../../modules/hotwallet/actions";
import * as HotwalletReducers from "../../../../modules/hotwallet/reducers";

import {
  ActivityIndicator,
  Image,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  COLORS,
  FONTS,
  ICONS,
  MyTextApp,
  QUALITY,
  SIZES,
  TITLE_COLOR_QUALITY,
} from "../../../../themes/theme";
import React, { useCallback, useEffect, useState } from "react";
import {
  balancesFromHotwalletSaga,
  getMinusButton,
  getPlusButton,
  getTitle,
  getTotalBox,
} from "../../../../common/utilities_config";
import {
  currencyFormat,
  roundDownNumber,
  toEther,
} from "../../../../common/utilities";
import { useDispatch, useSelector } from "react-redux";
import { useRoute, useTheme } from "@react-navigation/native";

import AntDesignIcon from "react-native-vector-icons/AntDesign";
import { BuyMysteryBox } from "../../Component/component";
import DividerComponent from "../../../../components/DividerComponent/DividerComponent";
import FeatherIcon from "react-native-vector-icons/Feather";
import InputComponent from "../../../../components/InputComponent";
import { LINK_P2P } from "../../../../common/constants";
import { STAGE_MYSTERYBOX } from "../../../../common/enum";
import { cf_BOX_DATA_CONFIG } from "../../../../config/mysterybox/configMysteryBox";
import cf_info_INO from "../../../../config/mysterybox/info";
import dayjs from "dayjs";
import { getChainId } from "../../../../modules/wallet/utilities";
import { cf_hotwallets as hotwalletsConfig } from "../../../../config/kogi-api";
import { isEmpty } from "lodash";
import { onShare } from "../../../../components/OpenLinkComponent";
import { useTranslation } from "react-i18next";

export default function INOBoxDetailScreen({
  navigation,
}: {
  navigation: any;
}) {
  const { colors, dark } = useTheme();
  const { t } = useTranslation();
  const route = useRoute();
  const { id, gameServiceID }: any = route.params;
  const [item, setItem] = useState<any>();
  const [lstReward, setLstReward] = useState<any>([]);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [stage, setStage] = useState(STAGE_MYSTERYBOX.END);
  const [amount, setAmount] = useState<any>("1");
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const boxData: any = cf_BOX_DATA_CONFIG.find(
    (e: any) => e.serviceID === gameServiceID,
  );

  // Inventory
  const accountWeb = useSelector(AccountReducers.dataAccount);
  // reload data

  const [onRequestBoxs, setOnRequestBoxs] = useState(false);
  // const [onchainBalances, setOnchainBalances] = useState([])
  const dispatchGetDataBoxs = (gameServiceID: any, idBox: any) =>
    dispatch(BoxsActions.getData_Boxs_Detail(gameServiceID, idBox));
  const dataBoxsOnRequestDetail = useSelector(
    BoxsReducers.dataBoxsOnRequestDetail,
  );
  const dataBoxsDetailResponse = useSelector(
    BoxsReducers.dataBoxsDetailResponse,
  );

  // Balance
  const getBalancesResponse = useSelector(
    HotwalletReducers.getBalancesResponse,
  );
  const [balances, setBalances] = useState<any>([]);

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

  useEffect(() => {
    setBalances(balancesFromHotwalletSaga(getBalancesResponse));
  }, [getBalancesResponse]);

  useEffect(() => {
    setOnRequestBoxs(dataBoxsOnRequestDetail > 0);
  }, [dataBoxsOnRequestDetail]);

  useEffect(() => {
    if (onRequestBoxs) return;
    if (dataBoxsDetailResponse !== null) {
      setItem(dataBoxsDetailResponse);
      setRefreshing(false);
    } else {
      setItem(null);
    }
  }, [onRequestBoxs, dataBoxsDetailResponse]);

  const loadData = () => {
    if (id !== null) {
      dispatchGetDataBoxs(gameServiceID, id);
      setRefreshing(false);
    }
    if (accountWeb) {
      dispatchGetBalances();
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  useEffect(() => {
    if (refreshing) {
      loadData();
    }
  }, [refreshing]);

  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    if (!gameServiceID) return;
    dispatchGetDataBoxs(gameServiceID, id);
    setItem(dataBoxsDetailResponse);
  }, [gameServiceID, id]);

  useEffect(() => {
    if (!item) return;
    const rew = boxData.reward.find((e: any) => e.symbol === item?.symbol);
    setRefreshing(false);
    if (rew) {
      setLstReward(rew.reward);
    } else {
      setLstReward([]);
    }

    // Stage
    const now = Math.floor(dayjs().valueOf() / 1000);
    if (now < parseInt(item?.info[0]?.whitelistOpentime)) {
      setStage(STAGE_MYSTERYBOX.INIT_STAGE_1);
      // setTimeCountDownBox(
      //   Math.floor(parseInt(item?.info[0]?.whitelistOpentime) - now)
      // )
      setPrice(parseFloat(toEther(item?.info[0]?.whitelistPrice)));
      setStock(parseFloat(item?.info[0]?.whitelistAmount));
    } else if (
      (now >= parseInt(item?.info[0]?.whitelistOpentime) &&
        now <= parseInt(item?.info[0]?.whitelistClosetime)) ||
      (now >= parseInt(item?.info[0]?.whitelistOpentime) &&
        now < parseInt(item?.info[0]?.opentime) - 60 * 20)
    ) {
      setStage(STAGE_MYSTERYBOX.STAGE_1_PRIVATE);
      setPrice(parseFloat(toEther(item?.info[0]?.whitelistPrice)));
      // setTimeCountDownBox(
      //   Math.floor(parseInt(item?.info[0]?.whitelistClosetime) - now)
      // )
      setStock(parseFloat(item?.info[0]?.whitelistAmount));
    } else if (
      now >= parseInt(item?.info[0]?.whitelistOpentime) &&
      now < parseInt(item?.info[0]?.opentime)
    ) {
      setStage(STAGE_MYSTERYBOX.INIT_STAGE_2);
      setPrice(parseFloat(toEther(item?.info[0]?.price)));
      setStock(parseFloat(item?.info[0]?.amount));
      // setTimeCountDownBox(Math.floor(parseInt(item?.info[0]?.opentime) - now))
    } else if (
      now >= parseInt(item?.info[0]?.opentime) &&
      now <= parseInt(item?.info[0]?.closetime)
    ) {
      // ROUND 1
      if (
        cf_info_INO.find((e) => e.serviceID === gameServiceID)!.startRound2 >
        parseInt(item?.info[0]?.opentime)
      ) {
        setStage(STAGE_MYSTERYBOX.STAGE_1_PUBLIC);
      } else {
        setStage(STAGE_MYSTERYBOX.STAGE_2_PUBLIC);
      }
      setPrice(parseFloat(toEther(item?.info[0]?.price)));
      // setTimeCountDownBox(Math.floor(parseInt(item?.info[0]?.closetime) - now))
      setStock(parseFloat(item?.info[0]?.amount));
    } else {
      setStage(STAGE_MYSTERYBOX.END);
      setPrice(parseFloat(toEther(item?.info[0]?.price)));
      // setTimeCountDownBox(0)
      setStock(parseFloat(item?.info[0]?.amount));
    }
  }, [item]);

  const urlDetails = () => {
    return (
      LINK_P2P +
      boxData.linkDetail +
      "/" +
      item.symbol.toLowerCase() +
      "/" +
      `?chainID=${getChainId()}&serviceID=${gameServiceID}`
    );
  };

  const getImageBG = (symbol: any) => {
    return boxData?.box_bg[symbol];
  };
  const getImageBox = (symbol: any) => {
    return boxData?.image[symbol];
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          zIndex: 1,
          backgroundColor: colors.background,
          paddingBottom: 8,
        }}
      >
        <View
          style={{
            height: 48,
            backgroundColor: colors.background,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              height: 48,
              width: 48,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                height: "100%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FeatherIcon name="arrow-left" size={22} color={colors.title} />
            </TouchableOpacity>
          </View>
          <MyTextApp
            style={{
              flex: 1,
              textAlign: "left",
              ...FONTS.h5,
              ...FONTS.fontBold,
              color: colors.title,
            }}
          >
            {t("event.detail_box_nft")}
          </MyTextApp>
          <TouchableOpacity
            onPress={async () => {
              await onShare(urlDetails());
            }}
            style={{
              ...styles.rightHeader,
              width: 60,
              height: 60,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: dark ? "#1F222A" : "#fff",
              borderRadius: 30,
              bottom: 6,
              left: 5,
            }}
            activeOpacity={0.8}
          >
            <View
              style={{
                position: "absolute",
                width: 14,
                height: 14,
                zIndex: 1,
                backgroundColor: dark ? "#1F222A" : "#fff",
                left: -9,
                top: 12,
              }}
            >
              <View
                style={{
                  position: "absolute",
                  width: 28,
                  height: 28,
                  zIndex: 1,
                  backgroundColor: colors.background,
                  top: 0,
                  borderRadius: 14,
                  left: -19,
                }}
              ></View>
            </View>
            <AntDesignIcon name="sharealt" size={24} color={colors.title} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: colors.background,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {!item ? (
          <View style={{ flex: 1 }}>
            <ActivityIndicator size={"large"} color={colors.primary} />
          </View>
        ) : (
          <View
            style={{
              paddingHorizontal: 18,
              gap: 16,
              paddingBottom: 16,
              paddingTop: 8,
              alignItems: SIZES.width > 412 ? "center" : undefined,
            }}
          >
            <View
              style={{
                backgroundColor: colors.input,
                borderRadius: 12,
                alignItems: "center",
                padding: 16,
                gap: 16,
                maxWidth: 360,
              }}
            >
              <ImageBackground
                source={getImageBG(item?.symbol)}
                style={{
                  borderRadius: 12,
                  // width: SIZES.width - 64,
                  height: SIZES.width <= 412 ? SIZES.width - 40 - 30 : 330,
                  width: SIZES.width <= 412 ? SIZES.width - 40 - 30 : 330,
                  maxWidth: 325,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                borderRadius={12}
              >
                <Image
                  source={getImageBox(item?.symbol)}
                  style={{
                    width: 120,
                    height: 120,
                  }}
                />
              </ImageBackground>
              <View style={{ gap: 8, maxWidth: 360, alignItems: "center" }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: SIZES.width <= 412 ? SIZES.width - 40 - 30 : 330,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <MyTextApp style={{ color: colors.title }}>
                      {t("event.type")}:{" "}
                    </MyTextApp>
                    <MyTextApp
                      style={{ fontWeight: "bold", color: colors.title }}
                    >
                      {t("event.box")}
                    </MyTextApp>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <MyTextApp style={{ color: colors.title }}>
                      {t("event.stock")}:{" "}
                    </MyTextApp>
                    <MyTextApp
                      style={{ fontWeight: "bold", color: colors.title }}
                    >
                      {stock}/{getTotalBox(gameServiceID, item?.symbol, stage)}
                    </MyTextApp>
                  </View>
                </View>
                <DividerComponent />
                <View style={{ width: "100%" }}>
                  <MyTextApp style={{ color: colors.title, textAlign: "left" }}>
                    {t("event.contract_address")}:
                  </MyTextApp>
                  <MyTextApp
                    style={{ color: colors.title, fontWeight: "bold" }}
                  >
                    {item?.address}
                  </MyTextApp>
                </View>
              </View>
            </View>
            <View style={{ gap: 8 }}>
              <MyTextApp
                style={{
                  lineHeight: 22,
                  fontSize: 20,
                  fontWeight: "bold",
                  color: boxData.color_box(item?.symbol),
                  textAlign: "left",
                }}
              >
                {item?.name}
              </MyTextApp>
              <View>
                <MyTextApp style={{ fontWeight: "bold", color: colors.title }}>
                  {t("event.descrip")}:
                </MyTextApp>
                <MyTextApp style={{ color: colors.title }}>
                  {getTitle(gameServiceID, item?.symbol)}
                </MyTextApp>
              </View>
            </View>
            <View style={{ gap: 8 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <MyTextApp style={{ color: colors.text }}>
                  {t("event.balances")}
                </MyTextApp>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  {balances?.map((once: any, i: any) => (
                    <View
                      key={i}
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Image
                        source={ICONS[once?.assetData?.symbol?.toLowerCase()]}
                        style={{ width: 16, height: 16, marginRight: 4 }}
                      />
                      <MyTextApp style={{ color: colors.title }}>
                        {currencyFormat(
                          roundDownNumber(parseFloat(once.balance), 3),
                        )}
                      </MyTextApp>
                    </View>
                  ))}
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <MyTextApp style={{ color: colors.text }}>
                  {t("event.price")}
                </MyTextApp>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={ICONS.nemo}
                    style={{ width: 16, height: 16, marginRight: 4 }}
                  />
                  <MyTextApp style={{ color: colors.title }}>{price}</MyTextApp>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <MyTextApp style={{ color: colors.text }}>
                  {t("event.amount")}
                </MyTextApp>
                <View
                  style={{ ...styles.inputAmount, borderColor: COLORS.border }}
                >
                  <TouchableOpacity
                    style={{
                      borderRightWidth: 1,
                      paddingHorizontal: 10,
                      borderColor: COLORS.border,
                    }}
                    disabled
                    onPress={() => {
                      setAmount(getMinusButton(amount));
                    }}
                  >
                    <FeatherIcon name="minus" color={colors.text} size={20} />
                  </TouchableOpacity>
                  <View style={{ flex: 1 }}>
                    {/* <TextInput
                      onChangeText={setAmount}
                      value={amount}
                      style={{ color: colors.title, textAlign: "center" }}
                      editable={false}
                    /> */}
                    <InputComponent
                      onChangeText={(e: any) => {
                        setAmount(e);
                      }}
                      value={amount}
                      style={{
                        height: 38,
                        borderRadius: 0,
                        borderWidth: 0,
                      }}
                      editable={false}
                      height={38}
                      textAlign="center"
                      showClear={false}
                      inputPaddingRight={0}
                    />
                  </View>

                  <TouchableOpacity
                    style={{
                      borderLeftWidth: 1,
                      paddingHorizontal: 10,
                      borderColor: COLORS.border,
                    }}
                    disabled
                    onPress={() => {
                      setAmount(getPlusButton(amount));
                    }}
                  >
                    <FeatherIcon name="plus" color={colors.text} size={20} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <BuyMysteryBox
              title={t("event.buy_now")}
              item={item}
              amount={amount}
              price={price}
              balances={balances}
              stage={stage}
              onProcessing={() => {
                return false;
              }}
              onSuccessful={() => {
                loadData();
              }}
              onError={() => {
                return false;
              }}
              setAmount={setAmount}
              gameServiceID={gameServiceID}
            />
            <DividerComponent />
            <MyTextApp
              style={{ fontWeight: "bold", fontSize: 16, color: colors.title }}
            >
              {t("event.series_content")}:
            </MyTextApp>
            {!isEmpty(lstReward) && (
              <View style={{ gap: 8 }}>
                {lstReward?.map((e: any, i: any) => (
                  <View
                    style={{
                      ...styles.rewardsInfo,
                      backgroundColor: colors.card,
                    }}
                    key={i}
                  >
                    <ImageBackground
                      source={QUALITY[e.rarity]}
                      style={{
                        width: 80,
                        height: 80,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      borderRadius={4}
                    >
                      <Image
                        style={{ width: 60, height: 60 }}
                        source={e.image}
                        alt=""
                      />
                    </ImageBackground>
                    <View style={styles.containerRewardsInfo}>
                      <MyTextApp
                        style={{
                          marginBottom: 10,
                          color: TITLE_COLOR_QUALITY[e.rarity],
                          fontSize: 16,
                          fontWeight: "bold",
                        }}
                        ellipsizeMode="tail"
                        numberOfLines={2}
                      >
                        {e?.name}
                      </MyTextApp>
                      <View style={styles.infoContent}>
                        <MyTextApp style={{ color: colors.title }}>
                          {t("nfts.detail.probability")}
                        </MyTextApp>
                        <MyTextApp
                          style={{
                            ...FONTS.fontBold,
                            color: colors.title,
                          }}
                        >
                          {e?.ratio}
                        </MyTextApp>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rewardsInfo: {
    flexDirection: "row",
    gap: 16,
    padding: 12,
    borderRadius: 12,
  },
  containerRewardsInfo: {
    justifyContent: "space-evenly",
    width: SIZES.width - 40 - 16 - 80 - 24,
  },
  infoContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputAmount: {
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 38,
    width: "50%",
  },
  rightHeader: {
    width: 60,
    height: 60,
    borderRadius: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
