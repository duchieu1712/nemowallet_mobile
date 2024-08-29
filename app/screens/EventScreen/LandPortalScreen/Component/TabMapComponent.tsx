import * as AccountReducers from "../../../../modules/account/reducers";

import { COLORS, LANDS, MAP, MyTextApp, SIZES } from "../../../../themes/theme";
import {
  ENUM_ENDPOINT_RPC,
  FILTER_LANDING,
  STATUS_LAND,
  STATUS_LAND_SALE,
} from "../../../../common/enum";
import { type IApprove, type IContractRelay } from "../../../../common/types";
import { Image, ImageBackground, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  descyptNEMOWallet,
  ellipseAddress,
  formatTokenNumber,
  getImageTokenMarketplace_9DNFT,
  getLocationView,
  getRandomLandImage,
  toWei,
} from "../../../../common/utilities";
import {
  rpcExecCogiChainNotEncodeParam,
  rpcExecCogiChain_Signer,
} from "../../../../components/RpcExec/toast_chain";

import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import Canvas from "react-native-canvas";
import Collapsible from "react-native-collapsible";
import { ContractFromNamespace } from "../../../../modules/wallet/utilities";
import Detail from "./detail";
import FeatherIcon from "react-native-vector-icons/Feather";
import Game from "./game";
import InputComponent from "../../../../components/InputComponent";
import ScrollViewToTop from "../../../../components/ScrollToTopComponent";
import Toast from "../../../../components/ToastInfo";
import { contractCallWithToast } from "../../../../components/RpcExec/toast";
import { isEmpty } from "lodash";
import { useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function TabMapComponent({
  filterTagLanding,
  landidView,
}: {
  filterTagLanding: any;
  landidView: any;
}) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [saleInfo, setSaleInfo] = useState<any>([]);
  const [landIDSearch, setLandIDSearch] = useState("");
  const [indexSelectedDetail, setIndexSelectedDetail] = useState(-1);
  const [landSelected, setLandSelected] = useState<any>(null);
  const [landSelectedIndex, setLandIdSelected] = useState("");
  const [zoneland, setZoneland] = useState<any>(null);
  const [zonelandIndex, setZonelandIndex] = useState(["", ""]);
  const [mapZone, setMapZone] = useState<any>(null);
  const [detailZonde, setDetailZone] = useState<any>(null);
  // const [initLoad, setInitLoad] = useState(false);
  const initLoad = false;
  const [onRequestBuyLand, setOnRequestBuyLand] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [onActionModalViewDetail, setOnActionModalViewDetail] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const accountWeb = useSelector(AccountReducers.dataAccount);

  useEffect(() => {
    if (!mapZone) return;
    getZoneLandSell();
    setTimeout(initSelected, 2000);
    // initSelected()
  }, [mapZone]);

  const initSelected = async () => {
    if ((mapZone && landSelected === null) || refreshing) {
      try {
        // focusZone(1, 0, SIZES.width - 35, 1)
        if (landidView === null) {
          focusZone(1, 0, 0, 1);
          setZonelandIndex(["0", "0"]);
        } else {
          showInfoByLandId();
        }
        setRefreshing(false);
      } catch {
        setZoneland([]);
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    if (refreshing) {
      initSelected();
    }
  }, [refreshing]);

  const showInfoByLandId = () => {
    const landID = parseInt(landidView);
    if (landID >= 1 && landID <= 7744) {
      setLandIDSearch(landidView);
      const rowLand = Math.floor((landID - 1) / 88) + 1;
      const yIndexZone = Math.floor((rowLand - 1) / 8);
      const xIndexZone = Math.floor((landID - 1 - (rowLand - 1) * 88) / 8);
      const indexZone = yIndexZone * 11 + xIndexZone + 1;
      focusZone(indexZone, xIndexZone, yIndexZone, landID);
      setOnActionModalViewDetail(true);
    }
  };

  useEffect(() => {
    showInfoByLandId();
  }, [landidView, refreshing]);

  const onFilterLandId = () => {
    if (!isEmpty(landIDSearch)) {
      const landID = parseInt(landIDSearch);
      if (landID >= 1 && landID <= 7744) {
        const rowLand = Math.floor((landID - 1) / 88) + 1;
        const yIndexZone = Math.floor((rowLand - 1) / 8);
        const xIndexZone = Math.floor((landID - 1 - (rowLand - 1) * 88) / 8);
        const indexZone = yIndexZone * 11 + xIndexZone + 1;
        focusZone(indexZone, xIndexZone, yIndexZone, landID);
        setOnActionModalViewDetail(true);
      } else {
        Toast.error("Land Id is between 1 and 7744!");
      }
    }
  };

  const focusZone = async (
    indexZone: any,
    xIndexZone: any,
    yIndexZone: any,
    landid: any,
  ) => {
    try {
      mapZone.setSelectedCell(xIndexZone, yIndexZone);
      // mapZone.setBorderCellSelected(xIndexZone, yIndexZone);
      setLandSelected(null);
      detailZonde?.resetCellSelectd();
      detailZonde?.setSelectedCell(landid);
      setLandIdSelected(landid);
      if (isEmpty(indexZone.toString())) return;
      if (indexZone < 0) return;
      setZonelandIndex([xIndexZone.toString(), yIndexZone.toString()]);
      rpcExecCogiChainNotEncodeParam({
        method: "erc721_galix_land.get_zonelands",
        params: [
          {
            zoneid: indexZone.toString(),
          },
        ],
        endpoint: ENUM_ENDPOINT_RPC._GALIXCITY,
      }).then((res: any) => {
        const lst = res?.zonelands ?? [];
        lst.sort((a: any, b: any) => a.landid - b.landid);
        setZoneland(lst);
      });
      if (!landid) return;
      // land info
      setLandIdSelected(landid.toString());
      rpcExecCogiChainNotEncodeParam({
        method: "erc721_galix_land.get_landinfoid",
        params: [
          {
            landid: landid.toString(),
          },
        ],
        endpoint: ENUM_ENDPOINT_RPC._GALIXCITY,
      }).then((res: any) => {
        setLandSelected(res.landinfo);
      });
      //
    } catch {
      setZoneland([]);
    }
  };

  useEffect(() => {
    if (filterTagLanding === FILTER_LANDING.MAP && !initLoad) initSelected();
  }, [filterTagLanding]);

  useEffect(() => {
    if (!zoneland) return;
    const lstLayer = zoneland.map((e: any, i: any) => getLayerForLand(e, i));
    detailZonde?.setLayers(lstLayer ?? []);
    detailZonde?.render();
  }, [zoneland]);

  // useEffect(() => {
  //   if (!onActionModalViewDetail) return;
  //   console.log('annnnn detailZonde', detailZonde);
  //   const lstLayer = zoneland.map((e: any, i: any) => getLayerForLand(e, i));
  //   detailZonde?.setLayers(lstLayer ?? [])
  //   detailZonde?.render();
  //   // let temp = zoneland
  //   // setZoneland(null)
  //   // setTimeout(() => {
  //   //   setZoneland(temp)
  //   // }, 1000)
  // }, [onActionModalViewDetail]);

  const performBuyLand = (response: any) => {
    const contractRelay: IContractRelay = response.contract_relay;
    const namespace = contractRelay.namespace;
    const params: any = contractRelay.params;
    const hwContract = ContractFromNamespace(namespace);

    const currencyContract = ContractFromNamespace("nemo_coin");
    const approve: IApprove = {
      contract: currencyContract,
      owner: descyptNEMOWallet(accountWeb?.nemo_address),
      spender: hwContract?.address,
      amount: toWei(params.price),
    };
    contractCallWithToast(
      hwContract,
      contractRelay.method,
      [
        params.cid,
        params.deadline,
        params.x,
        params.y,
        params.landLv,
        toWei(params.price),
        params.signature,
      ],
      approve,
    )
      .then(async () => {
        setOnRequestBuyLand(false);
        Toast.success(t("event.buy_land_success"));
        loadDataland();
        getZoneLandSell();
        // set color sold
        const lstLayer = detailZonde.map.layers;
        if (lstLayer && indexSelectedDetail !== -1) {
          lstLayer[0][indexSelectedDetail - 1] = 3;
          detailZonde.map.setLayers(lstLayer[0] ?? []);
        }
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log(response, e);
        setOnRequestBuyLand(false);
        // setFlagPendingClaimToken(false)
      });
  };

  const buyLand = async () => {
    try {
      if (isEmpty(landSelected.cid.toString())) {
        Toast.error(t("event.staking_error"));
        return;
      }
      setOnRequestBuyLand(true);
      rpcExecCogiChain_Signer({
        method: "erc721_galix_land.request_buyland",
        params: {
          cid: landSelected.cid.toString(),
        },
        endpoint: ENUM_ENDPOINT_RPC._GALIXCITY,
      })
        .then((res) => {
          performBuyLand(res);
        })
        .catch((e) => {
          Toast.error(e.message);
          setOnRequestBuyLand(false);
        });
      // Buy Land
    } catch (e) {
      setOnRequestBuyLand(false);
      Toast.error(t("event.staking_error"));
    }
  };

  const getZoneLandSell = async () => {
    try {
      const res: any = await rpcExecCogiChainNotEncodeParam({
        method: "erc721_galix_land.get_zoneopen",
        params: [{}],
        endpoint: ENUM_ENDPOINT_RPC._GALIXCITY,
      });
      setSaleInfo(res?.zoneopen?.sale_info);
      const lst = res?.zoneopen?.map ?? [];
      mapZone?.setZoneOpenToSell(lst);
      mapZone?._drawGridNotSell();
    } catch (e) {
      mapZone?.setZoneOpenToSell([]);
    }
  };

  const handleCanvasZone = (canvas: any) => {
    if (canvas) {
      canvas.width = SIZES.width - 32;
      canvas.height = SIZES.width - 32;
      const _game = new Game(canvas);
      _game.init();
      mapZone === null && setMapZone(_game);
      _game?.render();
    }
  };

  const handleCanvasDetailZone = (canvas: any) => {
    if (canvas) {
      canvas.width = SIZES.width - 64;
      canvas.height = SIZES.width - 64;
      const _detail = new Detail(canvas);
      _detail.init();
      detailZonde === null && setDetailZone(_detail);
      // console.log('annnnn _detail', _detail);
      // _detail?.render();
    }
  };

  const clickCanvas = async (event: any) => {
    try {
      mapZone.setBorderCellSelected(
        event.nativeEvent.locationX,
        event.nativeEvent.locationY,
      );
      setLandSelected(null);
      detailZonde.resetCellSelectd();
      setLandIdSelected("");
      const indexZone = mapZone.getSelectedCell();
      setZonelandIndex([
        ((indexZone - 1) % mapZone.map.columns).toString(),
        Math.floor((indexZone - 1) / mapZone.map.columns).toString(),
      ]);
      if (isEmpty(indexZone.toString())) return;
      if (indexZone < 0) return;
      rpcExecCogiChainNotEncodeParam({
        method: "erc721_galix_land.get_zonelands",
        params: [
          {
            zoneid: indexZone.toString(),
          },
        ],
        endpoint: ENUM_ENDPOINT_RPC._GALIXCITY,
      }).then((res: any) => {
        const lst = res?.zonelands ?? [];
        lst.sort((a: any, b: any) => a.landid - b.landid);
        setZoneland(lst);
      });
    } catch (e) {
      setZoneland([]);
    }
  };

  const getLayerForLand = (land: any, i: any) => {
    // find index land.png
    if (land.status === STATUS_LAND.LANDSTATUS_DISABLED) {
      if (i % 2 === 0) {
        return 1;
      } else {
        return 2;
      }
    } else if (land.status === STATUS_LAND.LANDSTATUS_SOLD) {
      return 3;
    } else if (land.status === STATUS_LAND.LANDSTATUS_LOCKED) {
      return 3;
    } else if (
      land.status === STATUS_LAND.LANDSTATUS_NOTONSAL ||
      land.status === STATUS_LAND.LANDSTATUS_ONSALE
    ) {
      if (land.level <= 8) {
        return land.level + 3;
      } else {
        return 11;
      }
    }
  };

  const getStatusSell = (status: any) => {
    // find index land.png
    switch (status) {
      case STATUS_LAND_SALE.LANDSTATUS_AVAILABLE: {
        return "Available";
      }
      case STATUS_LAND_SALE.LANDSTATUS_CONFIRM: {
        return "Confirming";
      }
      case STATUS_LAND_SALE.LANDSTATUS_NOTONSAL: {
        return "Not Sell";
      }
      default: {
        return "";
      }
    }
  };

  const clickCanvasDetail = useCallback(
    (event: any) => {
      try {
        setOnRequestBuyLand(false);
        detailZonde.setBorderCellSelected(
          event.nativeEvent.locationX,
          event.nativeEvent.locationY,
        );
        loadDataland();
      } catch {
        setLandSelected(null);
        setLandIdSelected("");
      }
    },
    [zoneland],
  );

  const loadDataland = () => {
    const indexSelectedDetail = detailZonde.getSelectedCell().toString();
    if (indexSelectedDetail >= 1 && indexSelectedDetail <= zoneland?.length) {
      setIndexSelectedDetail(indexSelectedDetail);
      const land = zoneland[indexSelectedDetail - 1];
      setLandIdSelected(land.landid.toString());
      rpcExecCogiChainNotEncodeParam({
        method: "erc721_galix_land.get_landinfoid",
        params: [
          {
            landid: land.landid.toString(),
          },
        ],
        endpoint: ENUM_ENDPOINT_RPC._GALIXCITY,
      }).then((res: any) => {
        setLandSelected(res.landinfo);
        setRefreshing(false);
        // setOnRequestZone(false)
      });
    } else {
      setIndexSelectedDetail(-1);
      setLandSelected(null);
      setLandIdSelected("");
      // setOnRequestZone(false)
      setRefreshing(false);
    }
  };

  const getView = (status: any) => {
    let total = 0;
    let avai = 0;
    let sold = 0;
    if (saleInfo && saleInfo.length !== 0) {
      const inf = saleInfo.find((e: any) => e.level === status);
      if (inf) {
        total = inf.total;
        avai = (inf?.available ?? 0) + (inf?.confirm ?? 0);
        sold = inf.total - avai;
      }
    }
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <MyTextApp style={{ fontWeight: "bold", color: colors.title }}>
          {total}/
        </MyTextApp>
        <MyTextApp style={{ fontWeight: "bold", color: colors.title }}>
          {avai}/
        </MyTextApp>
        <MyTextApp style={{ fontWeight: "bold", color: colors.title }}>
          {sold}
        </MyTextApp>
      </View>
    );
  };

  const mapZoneMemo = useMemo(
    () => (
      <View
        style={{
          width: SIZES.width - 30,
          height: SIZES.width - 30,
        }}
        onTouchStart={clickCanvas}
      >
        <ImageBackground
          source={MAP.zone_unit}
          resizeMode="contain"
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <Canvas
            ref={handleCanvasZone}
            style={{
              borderWidth: 1,
              borderColor: "#5EE2FE",
            }}
          ></Canvas>
        </ImageBackground>
      </View>
    ),
    [mapZone],
  );

  const mapZoneDetail = useMemo(
    () => (
      <View
        style={{
          width: SIZES.width - 64,
          height: SIZES.width - 64,
        }}
        onTouchStart={clickCanvasDetail}
      >
        <ImageBackground
          source={MAP.zone_unit}
          resizeMode="contain"
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <Canvas ref={handleCanvasDetailZone}></Canvas>
        </ImageBackground>
      </View>
    ),
    [detailZonde, zoneland],
  );

  return (
    <ScrollViewToTop
      style={{ paddingHorizontal: 16, paddingVertical: 8 }}
      refreshing={refreshing}
      onRefresh={onRefresh}
    >
      <View
        style={{
          height: 46,
          borderWidth: 1,
          borderRadius: 8,
          borderColor: COLORS.divider,
          width: "100%",
          paddingHorizontal: 16,
          paddingRight: 0,
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <InputComponent
          style={{
            flex: 1,
            color: colors.title,
            height: 48,
            borderWidth: 0,
            paddingHorizontal: 0,
          }}
          placeholder={t("event.search_land")}
          placeholderTextColor={COLORS.placeholder}
          value={landIDSearch}
          onChangeText={setLandIDSearch}
          onSubmitEditing={onFilterLandId}
          returnKeyType="search"
          inputPaddingRight={16}
          height={48}
          showClear={false}
        />
        <TouchableOpacity onPress={onFilterLandId}>
          <View
            style={{
              backgroundColor: COLORS.primary,
              width: 46,
              height: 46,
              borderTopRightRadius: 8,
              borderBottomRightRadius: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FeatherIcon name="search" color={colors.title} size={20} />
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          gap: 16,
          height: onActionModalViewDetail ? 0 : undefined,
          left: onActionModalViewDetail ? -SIZES.width : undefined,
        }}
      >
        {mapZoneMemo}
        <View
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.card,
            borderRadius: 8,
          }}
        >
          <View
            style={{
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.card2,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          >
            <MyTextApp
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: colors.title,
              }}
            >
              {t("event.sell")}/{t("event.availability")}/{t("event.sold")}
            </MyTextApp>
          </View>
          <View
            style={{
              backgroundColor: colors.card,
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((e, i) => (
              <View
                key={i}
                style={{
                  width: (SIZES.width - 34) / 3,
                  height: 40,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <MyTextApp style={{ color: colors.title }}>Lv. {e}</MyTextApp>
                {getView(e)}
              </View>
            ))}
          </View>
        </View>
        <ButtonComponent
          title={
            t("event.go_to_zone") +
            " [" +
            zonelandIndex[0] +
            "," +
            zonelandIndex[1] +
            "]"
          }
          onPress={() => {
            setOnActionModalViewDetail(true);
          }}
        />
      </View>
      <View
        style={{
          left: !onActionModalViewDetail ? -SIZES.width : undefined,
          height: !onActionModalViewDetail ? 0 : undefined,
        }}
      >
        <View
          style={{
            gap: 16,
            backgroundColor: colors.background,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <FeatherIcon name="chevron-left" size={20} color={colors.title} />
            <MyTextApp
              style={{
                color: colors.title,
                fontWeight: "bold",
                fontSize: 16,
              }}
              onPress={() => {
                setOnActionModalViewDetail(false);
              }}
            >
              {t("event.back_to_map")}
            </MyTextApp>
          </TouchableOpacity>
          <View
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
            }}
          >
            <View
              style={{
                height: 40,
                backgroundColor: colors.card2,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                justifyContent: "center",
              }}
            >
              <MyTextApp
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: colors.title,
                  textAlign: "center",
                }}
              >
                {t("event.zone") +
                  " [" +
                  zonelandIndex[0] +
                  "," +
                  zonelandIndex[1] +
                  "]"}
              </MyTextApp>
            </View>
            <View
              style={{
                padding: 16,
                backgroundColor: colors.card,
                alignItems: "center",
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
              }}
            >
              {mapZoneDetail}
            </View>
          </View>

          <View style={{ gap: 12 }}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                backgroundColor: colors.card,
                height: 40,
                paddingHorizontal: 16,
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: 8,
              }}
              onPress={() => {
                setIsCollapsed(!isCollapsed);
              }}
            >
              <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
                {t("event.map_explanation")}
              </MyTextApp>
              <FeatherIcon
                name={isCollapsed ? "chevron-down" : "chevron-up"}
                color={colors.title}
                size={24}
              />
            </TouchableOpacity>
            <Collapsible collapsed={isCollapsed}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                  borderRadius: 8,
                }}
              >
                <View
                  style={{
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: colors.card2,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                >
                  <MyTextApp
                    style={{ fontWeight: "bold", color: colors.title }}
                  >
                    {t("event.land_status")}
                  </MyTextApp>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Image
                      source={MAP.land_unlocked}
                      style={{ width: 32, height: 32 }}
                    />
                    <MyTextApp style={{ color: colors.title }}>
                      {t("event.land_sold_out")}
                    </MyTextApp>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Image
                      source={MAP.land_locked_1}
                      style={{ width: 32, height: 32 }}
                    />
                    <Image
                      source={MAP.land_locked_2}
                      style={{ width: 32, height: 32 }}
                    />
                    <MyTextApp style={{ color: colors.title }}>
                      {t("event.land_locked")}
                    </MyTextApp>
                  </View>
                </View>
                <View
                  style={{
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: colors.card2,
                  }}
                >
                  <MyTextApp
                    style={{ fontWeight: "bold", color: colors.title }}
                  >
                    {t("event.land_level")}
                  </MyTextApp>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Image
                      source={MAP.land_lv1}
                      style={{ width: 32, height: 32 }}
                    />
                    <MyTextApp style={{ color: colors.title }}>
                      {t("event.land")} {t("event.level")} 1
                    </MyTextApp>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Image
                      source={MAP.land_lv2}
                      style={{ width: 32, height: 32 }}
                    />
                    <MyTextApp style={{ color: colors.title }}>
                      {t("event.land")} {t("event.level")} 2
                    </MyTextApp>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Image
                      source={MAP.land_lv3}
                      style={{ width: 32, height: 32 }}
                    />
                    <MyTextApp style={{ color: colors.title }}>
                      {t("event.land")} {t("event.level")} 3
                    </MyTextApp>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Image
                      source={MAP.land_lv4}
                      style={{ width: 32, height: 32 }}
                    />
                    <MyTextApp style={{ color: colors.title }}>
                      {t("event.land")} {t("event.level")} 4
                    </MyTextApp>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Image
                      source={MAP.land_lv5}
                      style={{ width: 32, height: 32 }}
                    />
                    <MyTextApp style={{ color: colors.title }}>
                      {t("event.land")} {t("event.level")} 5
                    </MyTextApp>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Image
                      source={MAP.land_lv6}
                      style={{ width: 32, height: 32 }}
                    />
                    <MyTextApp style={{ color: colors.title }}>
                      {t("event.land")} {t("event.level")} 6
                    </MyTextApp>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Image
                      source={MAP.land_lv7}
                      style={{ width: 32, height: 32 }}
                    />
                    <MyTextApp style={{ color: colors.title }}>
                      {t("event.land")} {t("event.level")} 7
                    </MyTextApp>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Image
                      source={MAP.land_lv8}
                      style={{ width: 32, height: 32 }}
                    />
                    <MyTextApp style={{ color: colors.title }}>
                      {t("event.land")} {t("event.level")} 8
                    </MyTextApp>
                  </View>
                </View>
              </View>
            </Collapsible>
          </View>

          <Image
            source={
              LANDS[
                getRandomLandImage(landSelected?.landid, landSelected?.level)
              ]
            }
            style={{ width: SIZES.width - 32, height: SIZES.width - 32 }}
          />
          <View
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.card,
              borderRadius: 8,
              marginBottom: 120,
            }}
          >
            <View
              style={{
                height: 40,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.card2,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}
            >
              <MyTextApp style={{ fontWeight: "bold", color: colors.title }}>
                {t("event.land")} {landSelectedIndex && `#${landSelectedIndex}`}
              </MyTextApp>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <MyTextApp style={{ color: colors.title }}>
                {t("event.land")} {t("event.level")}
              </MyTextApp>
              <MyTextApp style={{ color: colors.title }}>
                {landSelected?.level}
              </MyTextApp>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <MyTextApp style={{ color: colors.title }}>
                {t("event.name")}
              </MyTextApp>
              <MyTextApp style={{ color: colors.title }}>
                {landSelected?.name}
              </MyTextApp>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <MyTextApp style={{ color: colors.title }}>
                {t("event.sell_status")}
              </MyTextApp>
              <MyTextApp style={{ color: colors.title }}>
                {landSelected?.status === STATUS_LAND.LANDSTATUS_ONSALE
                  ? getStatusSell(landSelected?.sale_info?.status)
                  : t("event.not_onsale")}
              </MyTextApp>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <MyTextApp style={{ color: colors.title }}>
                {t("event.owner")}
              </MyTextApp>
              <MyTextApp style={{ color: colors.title }}>
                {landSelected?.owner
                  ? ellipseAddress(descyptNEMOWallet(landSelected?.owner))
                  : t("event.no_owner")}
              </MyTextApp>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <MyTextApp style={{ color: colors.title }}>
                {t("event.dev_point")}
              </MyTextApp>
              <MyTextApp style={{ color: colors.title }}>
                {landSelected?.devpoints}
              </MyTextApp>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <MyTextApp style={{ color: colors.title }}>
                {t("event.location")} X
              </MyTextApp>
              <MyTextApp style={{ color: colors.title }}>
                {landSelected?.location_x}
              </MyTextApp>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <MyTextApp style={{ color: colors.title }}>
                {t("event.location")} Y
              </MyTextApp>
              <MyTextApp style={{ color: colors.title }}>
                {landSelected?.location_y}
              </MyTextApp>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <MyTextApp style={{ color: colors.title }}>
                {t("event.comment")}
              </MyTextApp>
              <MyTextApp style={{ color: colors.title }}>
                {landSelected?.comment}
              </MyTextApp>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <MyTextApp style={{ color: colors.title }}>
                {t("event.color")}
              </MyTextApp>
              <View
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: landSelected?.color,
                }}
              ></View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <MyTextApp style={{ color: colors.title }}>
                {t("event.reward_cumulative")}
              </MyTextApp>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 4,
                }}
              >
                <MyTextApp style={{ color: colors.title }}>
                  {formatTokenNumber(landSelected?.reward_cumulative ?? 0)}
                </MyTextApp>
                <Image
                  source={getImageTokenMarketplace_9DNFT()}
                  style={{ width: 18, height: 18 }}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <MyTextApp style={{ color: colors.title }}>
                {t("event.reward_unclaimed")}
              </MyTextApp>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 4,
                }}
              >
                <MyTextApp style={{ color: colors.title }}>
                  {formatTokenNumber(landSelected?.reward_unclaimed ?? 0)}
                </MyTextApp>
                <Image
                  source={getImageTokenMarketplace_9DNFT()}
                  style={{ width: 18, height: 18 }}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <MyTextApp style={{ color: colors.title }}>
                {t("event.resources_cumulative")}
              </MyTextApp>
              <MyTextApp style={{ color: colors.title }}>
                {formatTokenNumber(landSelected?.resource_cumulative)}
              </MyTextApp>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <MyTextApp style={{ color: colors.title }}>
                {t("event.resources_unclaimed")}
              </MyTextApp>
              <MyTextApp style={{ color: colors.title }}>
                {formatTokenNumber(landSelected?.resources_unclaimed)}
              </MyTextApp>
            </View>
            {landSelected?.status === STATUS_LAND.LANDSTATUS_ONSALE && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <MyTextApp style={{ color: colors.title }}>
                  {t("event.price")}
                </MyTextApp>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 4,
                  }}
                >
                  <MyTextApp style={{ color: colors.title }}>
                    {formatTokenNumber(landSelected?.sale_info?.price ?? 0)}
                  </MyTextApp>
                  <Image
                    source={getImageTokenMarketplace_9DNFT()}
                    style={{ width: 18, height: 18 }}
                  />
                </View>
              </View>
            )}
            <View
              style={{
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
            >
              <MyTextApp style={{ color: COLORS.success, fontWeight: "bold" }}>
                {t("event.location")}{" "}
                {getLocationView(
                  landSelected?.location_x,
                  landSelected?.location_y,
                )}
              </MyTextApp>
            </View>
          </View>
          {landSelected &&
            landSelected?.status === STATUS_LAND.LANDSTATUS_ONSALE && (
              <ButtonComponent
                title={t("common.buy")}
                onProcessing={onRequestBuyLand}
                onPress={buyLand}
              />
            )}
        </View>
      </View>
    </ScrollViewToTop>
  );
}
