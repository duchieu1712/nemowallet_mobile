import * as AccountReducers from "../../../modules/account/reducers";
import * as BoxsActions from "../../../modules/mysterybox/actions";
import * as BoxsReducers from "../../../modules/mysterybox/reducers";
import * as HotwalletActions from "../../../modules/hotwallet/actions";
import * as HotwalletReducers from "../../../modules/hotwallet/reducers";

import { COLORS, ICONS, MyTextApp, SIZES } from "../../../themes/theme";
import { Image, ImageBackground, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconLoadingDataComponent } from "../../../components/LoadingComponent";
import MysteryBoxComponent from "./MysteryBoxComponent";
import { STAGE_MYSTERYBOX } from "../../../common/enum";
import { balancesFromHotwalletSaga } from "../../../common/utilities_config";
import { cf_BOX_DATA_CONFIG } from "../../../config/mysterybox/configMysteryBox";
import dayjs from "dayjs";
import { cf_hotwallets as hotwalletsConfig } from "../../../config/kogi-api";
import cf_info_INO from "../../../config/mysterybox/info";
import Carousel from "react-native-snap-carousel";
import { timeStampToTime } from "../../../common/utilities";
import { useNavigation } from "@react-navigation/native";

export default function INO({
  refreshing,
  setRefreshing,
  itemServiceID,
}: {
  setRefreshing: any;
  refreshing: any;
  itemServiceID: any;
}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const timeCDIns = useRef<any>(null);
  const [item, setItem] = useState<any>(null);
  const [stage, setStage] = useState(STAGE_MYSTERYBOX.END);
  const [assets, setAssets] = useState<any>([]);
  const [onRequestBoxs, setOnRequestBoxs] = useState<any>(false);
  const [timeCountDownBox, setTimeCountDownBox] = useState<any>(null);
  const [indexAssets, setIndexAssets] = useState<any>(0);
  const [balances, setBalances] = useState<any>([]);
  const boxData: any = cf_BOX_DATA_CONFIG.find(
    (e: any) => e.serviceID === itemServiceID,
  );

  const dispatchGetDataBoxs = (itemServiceID: any) =>
    dispatch(BoxsActions.getDataBoxs(itemServiceID));

  const dispatchGetBalances = () => {
    const res: any = [];
    for (let i = 0; i < hotwalletsConfig.length; i++) {
      res.push(hotwalletsConfig[i].namespace);
    }
    dispatch(
      HotwalletActions.getBalances({
        namespaces: res,
      }),
    );
  };

  const accountWeb = useSelector(AccountReducers.dataAccount);
  const dataBoxsOnRequest: any = useSelector(BoxsReducers.dataBoxsOnRequest);
  const dataBoxsResponse: any = useSelector(BoxsReducers.dataBoxsResponse);
  const getBalancesResponse = useSelector(
    HotwalletReducers.getBalancesResponse,
  );

  useEffect(() => {
    setBalances(balancesFromHotwalletSaga(getBalancesResponse));
  }, [getBalancesResponse]);

  useEffect(() => {
    if (accountWeb) {
      dispatchGetBalances();
    }
  }, [accountWeb]);

  useEffect(() => {
    if (!itemServiceID) return;
    dispatchGetDataBoxs(itemServiceID);
  }, [itemServiceID]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (refreshing) {
      loadData();
    }
  }, [refreshing]);

  useEffect(() => {
    if (timeCountDownBox > 0) {
      timeCDIns.current = setTimeout(timeout, 1000);
    }
    if (timeCountDownBox === 0) {
      setTimeCountDownBox(0);
      clearTimeout(timeCDIns.current);
      loadData();
    }
    return () => {
      clearTimeout(timeCDIns.current);
    };
  }, [timeCountDownBox]);

  useEffect(() => {
    setOnRequestBoxs(dataBoxsOnRequest > 0);
  }, [dataBoxsOnRequest]);

  useEffect(() => {
    // if (!isReady) return
    if (onRequestBoxs === true) return;
    let ret: any = [];
    if (dataBoxsResponse !== null) {
      setRefreshing(false);
      ret = [...ret, ...dataBoxsResponse];
      if (dataBoxsResponse.length !== 1) {
        // Stage
        const item = dataBoxsResponse[0];
        setItem(item);
        const now = Math.floor(dayjs().valueOf() / 1000);
        if (now < parseInt(item?.info[0]?.whitelistOpentime)) {
          setStage(STAGE_MYSTERYBOX.INIT_STAGE_1);
          setTimeCountDownBox(
            Math.floor(parseInt(item?.info[0]?.whitelistOpentime) - now),
          );
        } else if (
          (now >= parseInt(item?.info[0]?.whitelistOpentime) &&
            now <= parseInt(item?.info[0]?.whitelistClosetime)) ||
          (now >= parseInt(item?.info[0]?.whitelistOpentime) &&
            now < parseInt(item?.info[0]?.opentime) - 60 * 20)
        ) {
          setStage(STAGE_MYSTERYBOX.STAGE_1_PRIVATE);
          setTimeCountDownBox(
            Math.floor(parseInt(item?.info[0]?.whitelistClosetime) - now),
          );
        } else if (
          now >= parseInt(item?.info[0]?.whitelistOpentime) &&
          now < parseInt(item?.info[0]?.opentime)
        ) {
          setStage(STAGE_MYSTERYBOX.INIT_STAGE_2);
          setTimeCountDownBox(
            Math.floor(parseInt(item?.info[0]?.opentime) - now),
          );
        } else if (
          now >= parseInt(item?.info[0]?.opentime) &&
          now <= parseInt(item?.info[0]?.closetime)
        ) {
          // public ROUND 1 or ROUND 2
          // ROUND 1
          if (
            cf_info_INO.find((e: any) => e.serviceID === itemServiceID)!
              .startRound2 > parseInt(item?.info[0]?.opentime)
          ) {
            setStage(STAGE_MYSTERYBOX.STAGE_1_PUBLIC);
            setTimeCountDownBox(
              Math.floor(parseInt(item?.info[0]?.closetime) - now),
            );
          } else {
            setStage(STAGE_MYSTERYBOX.STAGE_2_PUBLIC);
            setTimeCountDownBox(
              Math.floor(parseInt(item?.info[0]?.closetime) - now),
            );
          }
        } else {
          setStage(STAGE_MYSTERYBOX.END);
        }
      }
    }
    setAssets(ret);
  }, [onRequestBoxs, dataBoxsResponse]);

  const timeout = () => {
    setTimeCountDownBox((prevTimer: any) => {
      if (prevTimer > 0) {
        return prevTimer - 1;
      } else if (prevTimer === 0) {
        return prevTimer;
      }
    });
  };
  const loadData = () => {
    setAssets([]);
    setBalances([]);
    dispatchGetDataBoxs(itemServiceID);
    if (accountWeb) {
      dispatchGetBalances();
    }
  };
  const clickStakeBox = () => {
    navigation.navigate("INOBoxDetail", {
      id: assets[indexAssets]?.symbol?.toLowerCase(),
      gameServiceID: itemServiceID,
    });
  };

  const getImageBG = (symbol: any) => {
    return boxData?.box_bg[symbol];
  };
  const getImageBox = (symbol: any) => {
    return boxData?.image[symbol];
  };

  const _renderItem = ({ item, index }: { item: any; index: any }) => {
    return (
      <ImageBackground
        source={getImageBG(item.symbol)}
        style={{
          borderRadius: 12,
          height: 330,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={getImageBox(item.symbol)}
          style={{ width: 150, height: 150 }}
        />
      </ImageBackground>
    );
  };

  return (
    <View style={{ gap: 24 }}>
      <View style={{ paddingHorizontal: 20 }}>
        <View
          style={{
            backgroundColor: COLORS.backgroundInput,
            borderWidth: 1,
            borderColor: COLORS.primary,
            borderRadius: 12,
            height: 64,
            justifyContent: "center",
            gap: 4,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Image
              source={ICONS.polygon_left}
              style={{ width: 16, height: 16 }}
            />
            <MyTextApp
              style={{
                color: COLORS.yellow,
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {stage === STAGE_MYSTERYBOX.END && "ROUND 1: END"}
              {stage === STAGE_MYSTERYBOX.INIT_STAGE_1 && "Round 1"}
              {stage === STAGE_MYSTERYBOX.STAGE_1_PRIVATE && "ROUND 1: PRIVATE"}
              {stage === STAGE_MYSTERYBOX.INIT_STAGE_2 &&
                (cf_info_INO.find((e: any) => e.serviceID === itemServiceID)!
                  .startRound2 > parseInt(item?.info[0]?.opentime ?? 0)
                  ? "ROUND 1: PUBLIC"
                  : "ROUND 2: PUBLIC")}
              {stage === STAGE_MYSTERYBOX.STAGE_1_PUBLIC && "ROUND 1: PUBLIC"}
              {stage === STAGE_MYSTERYBOX.STAGE_2_PRIVATE && "ROUND 2: PRIVATE"}
              {stage === STAGE_MYSTERYBOX.STAGE_2_PUBLIC && "ROUND 2: PUBLIC"}
            </MyTextApp>
            <Image
              source={ICONS.polygon_right}
              style={{ width: 16, height: 16 }}
            />
          </View>
          {stage !== STAGE_MYSTERYBOX.END &&
            stage !== STAGE_MYSTERYBOX.INIT_STAGE_1 &&
            stage !== STAGE_MYSTERYBOX.INIT_STAGE_2 && (
              <MyTextApp
                style={{
                  color: COLORS.white,
                  fontSize: 16,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                END: {timeStampToTime(timeCountDownBox)}
              </MyTextApp>
            )}
          {(stage === STAGE_MYSTERYBOX.INIT_STAGE_1 ||
            stage === STAGE_MYSTERYBOX.INIT_STAGE_2) && (
            <MyTextApp
              style={{
                color: COLORS.white,
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Open After: {timeStampToTime(timeCountDownBox)}
            </MyTextApp>
          )}
        </View>
      </View>

      {!assets ? (
        <View style={{ flex: 1 }}>
          <IconLoadingDataComponent />
        </View>
      ) : (
        <View style={{ flex: 1, alignItems: "center", gap: 16 }}>
          <Carousel
            layout={"default"}
            // ref={(ref:any) => (this.carousel = ref)}
            data={assets}
            sliderWidth={SIZES.width}
            itemWidth={330}
            inactiveSlideScale={0.9}
            inactiveSlideOpacity={1}
            renderItem={_renderItem}
            onSnapToItem={(index: any) => {
              setIndexAssets(index);
            }}
            hasParallaxImages={true}
            activeSlideAlignment="center"
          />

          <MysteryBoxComponent
            item={assets[indexAssets]}
            event={() => {
              clickStakeBox();
            }}
            onchainBalances={balances}
            loadData={loadData}
            itemServiceID={itemServiceID}
          />
        </View>
      )}
    </View>
  );
}
