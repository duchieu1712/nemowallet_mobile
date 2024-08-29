import * as AccountReducers from "../../../../modules/account/reducers";
import * as WalletActions from "../../../../modules/wallet/actions";
import * as WalletReducers from "../../../../modules/wallet/reducers";

import {
  COLORS,
  ICONS,
  IMAGES,
  MyTextApp,
  SIZES,
  STAR,
} from "../../../../themes/theme";
import { ENUM_ENDPOINT_RPC, SERVICE_ID } from "../../../../common/enum";
import { type IApprove, type IContractRelay } from "../../../../common/types";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  checkStar,
  descyptNEMOWallet,
  formatTokenNumber,
  roundNumber,
  timeStampToTime,
  toWei,
} from "../../../../common/utilities";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";

import ActionModalsComponent from "../../../../components/ModalComponent/ActionModalsComponent";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import { ContractFromNamespaceCogiChain } from "../../../../modules/wallet/utilities";
import { Dmetadata } from "../../../../modules/nft/market";
import Fireworks from "react-native-fireworks";
import { IPFS_ORIGIN_GALIX } from "../../../../config/ipfs";
import { IconLoadingDataComponent } from "../../../../components/LoadingComponent";
import ScrollViewToTop from "../../../../components/ScrollToTopComponent";
import Toast from "../../../../components/ToastInfo";
import { cf_LST_RARITY } from "../../../../config/filters/filters_Galix";
import { contractCallWithToast } from "../../../../components/RpcExec/toast";
import { rpcExecCogiChain_Signer } from "../../../../components/RpcExec/toast_chain";
import { toIpfsGatewayUrl } from "../../../../common/utilities_config";
import { useTranslation } from "react-i18next";

export default function TabMysteryHouseComponent({
  changeTagFocusLandPortal,
}: {
  changeTagFocusLandPortal: any;
}) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // Inventory
  // const dataLandingOnRequest = useSelector(LandReducers.dataLandingOnRequest)
  // reload data
  const accountWeb = useSelector(AccountReducers.dataAccount);
  const reloadData: boolean = useSelector(WalletReducers.reloadData);
  // balances
  const dispatchReloadData = (flag: boolean) =>
    dispatch(WalletActions.reloadData(flag));
  const [onActionViewItemHeroMint, setOnActionViewItemHeroMint] =
    useState(false);
  const [itemHeroMint, setItemHeroMint] = useState<any>(null);
  const [itemHeroMintDetail, setItemHeroMintDetail]: [v: Dmetadata, setV: any] =
    useState<any>(null);
  const [mysteryinfo, setMysteryinfo] = useState<any>(null);
  const [viewCooldown, setViewCooldown] = useState(false);
  const [timeCountDown, setTimeCountDown] = useState<any>(null);
  const [onRequestSummon, setOnRequestSummon] = useState(false);
  const [rarity, setRarity] = useState<any>(null);
  const timeCDIns = useRef<any>(null);
  const [onRequestData, setOnRequestData] = useState(false);
  //
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  const timeout = () => {
    setTimeCountDown((prevTimer: any) => {
      if (prevTimer > 0) {
        return prevTimer - 1;
      } else if (prevTimer === 0) {
        return prevTimer;
      }
    });
  };
  useEffect(() => {
    if (timeCountDown === null) return;
    if (timeCountDown > 0) {
      timeCDIns.current = setTimeout(timeout, 1000);
    }
    if (timeCountDown === 0) {
      loadData();
    }
    return () => {
      clearTimeout(timeCDIns.current);
    };
  }, [timeCountDown]);

  useEffect(() => {
    if (refreshing) {
      loadData();
    }
  }, [refreshing]);

  useEffect(() => {
    if (!accountWeb) return;
    if (reloadData) return;
    loadData();
  }, [accountWeb]);

  useEffect(() => {
    if (!reloadData) return;
    dispatchReloadData(false);
    loadData();
  }, []);

  // Stakes
  const loadData = async () => {
    setOnRequestData(true);
    try {
      rpcExecCogiChain_Signer({
        method: "erc721_galix_land.get_mysteryinfo",
        params: {
          namespace: "erc721_galix_hero",
        },
        endpoint: ENUM_ENDPOINT_RPC._GALIXCITY,
      })
        .then((res: any) => {
          setRefreshing(false);
          setOnRequestData(false);
          if (res.mysteryinfo) {
            setMysteryinfo(res.mysteryinfo);
            if (res.mysteryinfo.cd_time > 0) {
              setViewCooldown(true);
              setTimeCountDown(res.mysteryinfo.cd_time);
            } else {
              setTimeCountDown(null);
              setViewCooldown(false);
            }
          } else {
            setTimeCountDown(null);
            setMysteryinfo(null);
            setViewCooldown(false);
          }
        })
        .catch((e) => {
          Toast.error(e.message);
          setTimeCountDown(null);
          setMysteryinfo(null);
          setViewCooldown(false);
          setRefreshing(false);
          setOnRequestData(false);
        });
    } catch {
      setTimeCountDown(null);
      setMysteryinfo(null);
      setViewCooldown(false);
      setRefreshing(false);
      setOnRequestData(false);
    }
  };

  async function performSummon(response: any) {
    const contractRelay: IContractRelay = response.contract_relay;
    const namespace = contractRelay.namespace;
    const params: any = contractRelay.params;
    const hwContract = ContractFromNamespaceCogiChain(namespace);
    // approve
    const currencyContract = ContractFromNamespaceCogiChain("nemo_coin");
    const approve: IApprove = {
      contract: currencyContract,
      owner: descyptNEMOWallet(accountWeb?.nemo_address),
      spender: hwContract?.address,
      amount: toWei(params.fee),
    };
    await contractCallWithToast(
      hwContract,
      contractRelay.method,
      [params.cid, params.deadline, toWei(params.fee), params.signature],
      approve,
    )
      .then(async () => {
        setOnRequestSummon(false);
        Toast.success("Summon Hero is successful");
        setItemHeroMint(null);
        setItemHeroMintDetail(null);
        loadHeroMint(params.cid);
        loadData();
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log(response, e);
        setOnRequestSummon(false);
      });
  }

  const loadHeroMint = (cid: any) => {
    // load hero
    fetch(IPFS_ORIGIN_GALIX + cid)
      .then(async (response) => await response.json())
      .then((res) => {
        setItemHeroMint(res);
        const detail: any = Dmetadata.fromObject(res);
        const rare = cf_LST_RARITY.find((e: any) =>
          e.value.includes(parseInt(detail?.rarity?.value)),
        );
        if (rare) {
          setRarity(rare);
        } else {
          setRarity(null);
        }
        setItemHeroMintDetail(detail);
        setOnActionViewItemHeroMint(true);
      })
      .catch(() => {
        setRarity(null);
        Toast.error("Load Item fail. Please to Inventory to view Hero");
      });
  };

  const requestSummon = async () => {
    // setOnActionViewItemHeroMint(true);
    // speedup
    // loadHeroMint("QmVfLEhijVRy7U7Xm9ZafsNG5mdnXXpZS9p1nxwKWTqqTe");
    // return;
    try {
      if (mysteryinfo?.is_pening) {
        Toast.error("Please try again later!");
        return;
      }
      if (mysteryinfo.cd_time > 0) {
        Toast.error("Please wait until the cooldown is over!");
        return;
      }
      // Request Summon
      setOnRequestSummon(true);
      rpcExecCogiChain_Signer({
        method: "erc721_galix_land.request_summon",
        params: {
          namespace: "erc721_galix_hero",
        },
        endpoint: ENUM_ENDPOINT_RPC._GALIXCITY,
      })
        .then((res: any) => {
          performSummon(res);
        })
        .catch((e) => {
          Toast.error(e.message);
          setOnRequestSummon(false);
        });
    } catch (e: any) {
      Toast.error(e.message);
      setOnRequestSummon(false);
    }
  };

  const star = () => {
    const data = checkStar(
      itemHeroMintDetail?.star?.value,
      itemHeroMintDetail?.grade?.value,
    );
    if (data?.number > 1) {
      const list = [];
      for (let i = 1; i <= data?.number; i++) {
        list.push(
          <Image
            source={STAR[data?.image]}
            style={{ width: 20, height: 20 }}
          />,
        );
      }
      return list;
    } else {
      return (
        <>
          <Image source={STAR[data?.image]} style={{ width: 20, height: 20 }} />
        </>
      );
    }
  };

  const starLg = () => {
    const data = checkStar(
      itemHeroMintDetail?.star?.value,
      itemHeroMintDetail?.grade?.value,
    );
    if (data?.number > 1) {
      const list = [];
      for (let i = 1; i <= data?.number; i++) {
        list.push(
          <Image
            source={STAR[data?.image]}
            style={{ width: 30, height: 30 }}
          />,
        );
      }
      return list;
    } else {
      return (
        <Image source={STAR[data?.image]} style={{ width: 30, height: 30 }} />
      );
    }
  };

  return (
    <>
      {onRequestData ? (
        <View style={{ flex: 1, alignItems: "center" }}>
          <IconLoadingDataComponent />
        </View>
      ) : (
        <>
          <ScrollViewToTop
            style={{
              flex: 1,
              gap: 30,
              paddingVertical: 20,
            }}
            refreshing={refreshing}
            onRefresh={onRefresh}
          >
            <View style={{ alignItems: "center", flex: 1 }}>
              <View style={{ width: "70%", gap: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <MyTextApp
                    style={{
                      fontWeight: "bold",
                      fontSize: 18,
                      color: colors.title,
                    }}
                  >
                    {t("event.mystery_house_lv")}:{" "}
                    {mysteryinfo?.current_mystery_level ?? 0}
                  </MyTextApp>
                  <Image
                    source={IMAGES.arrow_up}
                    style={{ width: 16, height: 16 }}
                  />
                </View>
                <View
                  style={{
                    width: "100%",
                    height: 18,
                    borderWidth: 1,
                    borderColor: COLORS.dark_blue,
                    // borderColor: 'red',
                    backgroundColor: COLORS.progress_bg,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: COLORS.neon2,
                      position: "absolute",
                      height: 16,
                      width: `${
                        mysteryinfo
                          ? (mysteryinfo?.current_land_level /
                              mysteryinfo?.next_land_level) *
                            100
                          : 0
                      }%`,
                    }}
                  ></View>
                  <MyTextApp
                    style={{
                      color: COLORS.dark,
                      fontSize: 12,
                      fontWeight: "bold",
                      textAlign: "center",
                      lineHeight: 16,
                    }}
                  >
                    {mysteryinfo
                      ? `${mysteryinfo?.current_land_level}/${mysteryinfo?.next_land_level}`
                      : ""}
                  </MyTextApp>
                </View>
                {mysteryinfo?.land_locked_lv > 0 && (
                  <View style={{ alignItems: "center", gap: 8 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <View
                        style={{
                          width: 30,
                          height: 30,
                          backgroundColor: COLORS.neon2,
                        }}
                      ></View>
                      <TouchableOpacity onPress={changeTagFocusLandPortal}>
                        <MyTextApp
                          style={{ color: colors.title, fontWeight: "bold" }}
                        >
                          {t("event.actived_land")}
                        </MyTextApp>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <View
                        style={{
                          width: 30,
                          height: 30,
                          backgroundColor: colors.text,
                        }}
                      ></View>
                      <TouchableOpacity onPress={changeTagFocusLandPortal}>
                        <MyTextApp
                          style={{ color: colors.title, fontWeight: "bold" }}
                        >
                          {t("event.locked_land")}
                        </MyTextApp>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                {/* {mysteryinfo?.land_locked_lv > 0 && (
                <View
                  style={{
                    width: "100%",
                    height: 18,
                    borderWidth: 1,
                    borderColor: COLORS.dark_blue,
                    backgroundColor: COLORS.progress_bg,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: COLORS.neon2,
                      position: "absolute",
                      height: 16,
                      width: `${
                        mysteryinfo
                          ? (mysteryinfo?.current_land_level === 0 &&
                            mysteryinfo?.land_locked_lv > 0
                              ? 100
                              : (mysteryinfo?.next_land_level -
                                  mysteryinfo?.current_land_level) /
                                mysteryinfo?.next_land_level) * 100
                          : 0
                      }%`,
                    }}
                  ></View>
                  <MyTextApp
                    style={{
                      color: COLORS.dark,
                      fontSize: 12,
                      fontWeight: "bold",
                      textAlign: "center",
                      lineHeight: 16,
                    }}
                  >
                    {mysteryinfo
                      ? `${
                          mysteryinfo?.next_land_level -
                          mysteryinfo?.current_land_level
                        }/${mysteryinfo?.next_land_level}`
                      : ""}
                  </MyTextApp>
                </View>
              )} */}
              </View>
              <ImageBackground
                source={IMAGES.earth}
                style={{
                  width: "100%",
                  height: 280,
                  paddingVertical: 60,
                  gap: 30,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: "40%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      width: "35%",
                      height: "100%",
                    }}
                  >
                    <ImageBackground
                      source={IMAGES.common_bg}
                      style={{
                        flex: 1,
                        marginLeft: "-40%",
                        justifyContent: "center",
                      }}
                      resizeMode="contain"
                    >
                      <MyTextApp
                        style={{
                          textAlign: "right",
                          fontWeight: "bold",
                          lineHeight: 26,
                          marginRight: "25%",
                        }}
                      >
                        {t("event.common")}
                        {"\n"}
                        {mysteryinfo?.summon_rate !== null
                          ? mysteryinfo?.summon_rate[0]
                          : "0%"}
                      </MyTextApp>
                    </ImageBackground>
                  </View>
                  <View
                    style={{
                      width: "35%",
                      height: "100%",
                    }}
                  >
                    <ImageBackground
                      source={IMAGES.epic_bg}
                      style={{
                        flex: 1,
                        marginRight: "-40%",
                        justifyContent: "center",
                      }}
                      resizeMode="contain"
                    >
                      <MyTextApp
                        style={{
                          textAlign: "left",
                          fontWeight: "bold",
                          lineHeight: 22,
                          marginLeft: "25%",
                        }}
                      >
                        {t("event.epic")}
                        {"\n"}
                        {mysteryinfo?.summon_rate !== null
                          ? mysteryinfo?.summon_rate[2]
                          : "0%"}
                      </MyTextApp>
                    </ImageBackground>
                  </View>
                </View>
                <View
                  style={{
                    width: "100%",
                    height: "40%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      width: "35%",
                      height: "100%",
                    }}
                  >
                    <ImageBackground
                      source={IMAGES.rare_bg}
                      style={{
                        flex: 1,
                        marginLeft: "-40%",
                        justifyContent: "center",
                      }}
                      resizeMode="contain"
                    >
                      <MyTextApp
                        style={{
                          textAlign: "right",
                          fontWeight: "bold",
                          lineHeight: 26,
                          marginRight: "25%",
                        }}
                      >
                        {t("event.rare")}
                        {"\n"}
                        {mysteryinfo?.summon_rate !== null
                          ? mysteryinfo?.summon_rate[1]
                          : "0%"}
                      </MyTextApp>
                    </ImageBackground>
                  </View>
                  <View
                    style={{
                      width: "35%",
                      height: "100%",
                    }}
                  >
                    <ImageBackground
                      source={IMAGES.legend_bg}
                      style={{
                        flex: 1,
                        marginRight: "-40%",
                        justifyContent: "center",
                      }}
                      resizeMode="contain"
                    >
                      <MyTextApp
                        style={{
                          textAlign: "left",
                          fontWeight: "bold",
                          lineHeight: 22,
                          marginLeft: "25%",
                        }}
                      >
                        {t("event.legend")}
                        {"\n"}
                        {mysteryinfo?.summon_rate !== null
                          ? mysteryinfo?.summon_rate[3]
                          : "0%"}
                      </MyTextApp>
                    </ImageBackground>
                  </View>
                </View>
              </ImageBackground>
              <View style={{ width: "50%", alignItems: "center", gap: 10 }}>
                {mysteryinfo?.is_pening ? (
                  <MyTextApp
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      color: colors.title,
                    }}
                  >
                    {t("event.try_again")}
                  </MyTextApp>
                ) : viewCooldown ? (
                  <MyTextApp
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      color: colors.title,
                    }}
                  >
                    {t("event.cooldown")}: {timeStampToTime(timeCountDown)}
                  </MyTextApp>
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Image
                      source={ICONS.nemo}
                      style={{ width: 18, height: 18 }}
                    />
                    <MyTextApp
                      style={{
                        fontWeight: "bold",
                        fontSize: 18,
                        color: colors.title,
                      }}
                    >
                      {formatTokenNumber(mysteryinfo?.summon_fee ?? 0)}
                    </MyTextApp>
                  </View>
                )}
                <ButtonComponent
                  title={t("event.summon")}
                  onProcessing={onRequestSummon}
                  onPress={requestSummon}
                  color={colors.title}
                  borderColor="transparent"
                  textColor={colors.background}
                  disabled={mysteryinfo?.is_pening}
                />
              </View>
            </View>
          </ScrollViewToTop>
          <ActionModalsComponent
            modalVisible={onActionViewItemHeroMint}
            closeModal={() => {
              setOnActionViewItemHeroMint(false);
              setItemHeroMint(null);
              setItemHeroMintDetail(null);
            }}
            iconClose
            positionIconClose={{
              top: 0,
              right: 20,
            }}
          >
            <ScrollView>
              <View
                style={{
                  ...styles.modalContent,
                  backgroundColor: colors.card,
                }}
              >
                <Fireworks
                  speed={2}
                  density={8}
                  colors={["#ff0", "#ff3", "#cc0", "#ff4500", "#ff6347"]}
                  iterations={50}
                  height={SIZES.height}
                  width={SIZES.width - 32}
                  zIndex={2}
                  circular={false}
                />
                <View style={{ position: "relative", width: "100%" }}>
                  <MyTextApp
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      color: colors.title,
                      textAlign: "center",
                    }}
                  >
                    Hero {itemHeroMint?.name}
                  </MyTextApp>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Image
                    source={{
                      uri: toIpfsGatewayUrl(
                        itemHeroMint?.image,
                        SERVICE_ID._GALIXCITY,
                      ),
                    }}
                    style={{ width: 100, height: 100 }}
                  />
                  {starLg()}
                </View>
                <View style={{ flexDirection: "row", gap: 16 }}>
                  <MyTextApp
                    style={{
                      color: colors.title,
                      fontWeight: "bold",
                      borderWidth: 1,
                      borderColor: colors.title,
                      padding: 8,
                      borderRadius: 8,
                    }}
                  >
                    {itemHeroMintDetail?.type?.value}
                  </MyTextApp>
                  <MyTextApp
                    style={{
                      color: colors.title,
                      fontWeight: "bold",
                      borderWidth: 1,
                      borderColor: colors.title,
                      padding: 8,
                      borderRadius: 8,
                    }}
                  >
                    {rarity?.metadataRarity}
                  </MyTextApp>
                </View>
                <View style={{ width: "100%", gap: 8 }}>
                  <View style={{ width: "100%" }}>
                    <MyTextApp style={{ color: colors.text }}>
                      {t("event.basic_stat")}:
                    </MyTextApp>
                    <MyTextApp style={{ color: colors.title }}>
                      {t("event.growth")}:{" "}
                      {roundNumber(itemHeroMintDetail?.growth?.value)}
                    </MyTextApp>
                    <MyTextApp style={{ color: colors.title }}>
                      {t("event.power")}:{" "}
                      {roundNumber(itemHeroMintDetail?.power?.value)}
                    </MyTextApp>
                    <MyTextApp style={{ color: colors.title }}>
                      {t("event.level")}:{" "}
                      {roundNumber(itemHeroMintDetail?.level?.value)}
                    </MyTextApp>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MyTextApp style={{ color: colors.title }}>
                        {t("event.star")}:{" "}
                      </MyTextApp>
                      {star()}
                    </View>
                    <MyTextApp style={{ color: colors.title }}>
                      {t("event.morale")}:{" "}
                      {roundNumber(itemHeroMintDetail?.morale?.value)}
                    </MyTextApp>
                    <MyTextApp style={{ color: colors.title }}>
                      {t("event.physique")}:{" "}
                      {roundNumber(itemHeroMintDetail?.physique?.value)}
                    </MyTextApp>
                    <MyTextApp style={{ color: colors.title }}>
                      {t("event.support")}:{" "}
                      {roundNumber(itemHeroMintDetail?.support?.value)}
                    </MyTextApp>
                    <MyTextApp style={{ color: colors.title }}>
                      {t("event.develop")}:{" "}
                      {roundNumber(itemHeroMintDetail?.develop?.value)}
                    </MyTextApp>
                  </View>
                  <View style={{ width: "100%" }}>
                    <MyTextApp style={{ color: colors.text }}>
                      {t("event.card_info")}:
                    </MyTextApp>
                    <MyTextApp style={{ color: colors.title }}>
                      {t("event.battle_point")}:{" "}
                      {roundNumber(itemHeroMintDetail?.battlepoint?.value)}
                    </MyTextApp>
                    <MyTextApp style={{ color: colors.title }}>
                      {t("event.atk")}:{" "}
                      {roundNumber(itemHeroMintDetail?.atk?.value)}
                    </MyTextApp>
                    <MyTextApp style={{ color: colors.title }}>
                      {t("event.hp")}:{" "}
                      {roundNumber(itemHeroMintDetail?.hp?.value)}
                    </MyTextApp>
                    <MyTextApp style={{ color: colors.title }}>
                      {t("event.number_unit")}:{" "}
                      {roundNumber(itemHeroMintDetail?.units?.value)}
                    </MyTextApp>
                    <MyTextApp style={{ color: colors.title }}>
                      {t("event.atk_speed")}:{" "}
                      {roundNumber(itemHeroMintDetail?.speed?.value)}
                    </MyTextApp>
                    <MyTextApp style={{ color: colors.title }}>
                      {t("event.range")}:{" "}
                      {roundNumber(itemHeroMintDetail?.range?.value)}
                    </MyTextApp>
                  </View>
                  <View style={{ width: "100%" }}>
                    <MyTextApp style={{ color: colors.text }}>
                      {t("event.ability")}:
                    </MyTextApp>
                    <MyTextApp style={{ color: colors.title }}>
                      {itemHeroMintDetail?.ability?.value}
                    </MyTextApp>
                  </View>
                  <View style={{ width: "100%" }}>
                    <MyTextApp style={{ color: colors.text }}>
                      {t("event.passive_skill")}:
                    </MyTextApp>
                    {itemHeroMintDetail?.passiveSkills.length > 0 &&
                      itemHeroMintDetail?.passiveSkills.map(
                        (v: any, i: any) => (
                          <MyTextApp style={{ color: colors.title }} key={i}>
                            {v?.title} : {v?.value}
                          </MyTextApp>
                        ),
                      )}
                  </View>
                  <View style={{ width: "100%" }}>
                    <MyTextApp style={{ color: colors.text }}>
                      {t("event.passive_skill")}:
                    </MyTextApp>
                    {itemHeroMintDetail?.PVPSkills.length > 0 &&
                      itemHeroMintDetail?.PVPSkills.map((v: any, i: any) => (
                        <MyTextApp style={{ color: colors.title }} key={i}>
                          {v?.title} : {v?.value}
                        </MyTextApp>
                      ))}
                  </View>
                </View>
              </View>
            </ScrollView>
          </ActionModalsComponent>
        </>
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
    position: "relative",
  },
  modalContent: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 20,
    alignItems: "center",
    width: SIZES.width * 0.9,
    gap: 16,
  },
  closeBtn: {
    position: "absolute",
    right: 0,
    top: 0,
  },
});
