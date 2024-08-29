import * as DashboardActions from "../../../modules/dashboard/actions";
import * as DashboardReducers from "../../../modules/dashboard/reducers";
import * as NFTActions from "../../../modules/nft/actions";
import * as NFTReducers from "../../../modules/nft/reducers";
import * as TransactionReducers from "../../../modules/transaction/reducers";
import * as TransactiondActions from "../../../modules/transaction/actions";

import {
  COLORS,
  FONTS,
  ICONS,
  IMAGES,
  MyTextApp,
  SIZES,
} from "../../../themes/theme";
import { FILTER_DASHBOARD, ListDashboard } from "../../../common/enum";
import {
  type GetMarketDatas,
  type INFTFilters,
} from "../../../modules/nft/types";
import {
  type GetTransactionDatas,
  type ITransFilters,
} from "../../../modules/transaction/types";
import {
  Image,
  ImageBackground,
  type NativeSyntheticEvent,
  type TextInputSubmitEditingEventData,
  TouchableOpacity,
  View,
} from "react-native";
import {
  type Nft,
  type Transaction,
} from "../../../modules/graphql/types/generated";
import { RenderItemListed, RenderItemSold } from "../ItemNFTDashboardComponent";
import {
  currencyFormat,
  isAddress,
  roundNumber,
} from "../../../common/utilities";
import { isEmpty, isNumber } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useTheme } from "@react-navigation/native";

import ButtonComponent from "../../ButtonComponent/ButtonComponent";
import { type DashboardStatistics } from "../../../modules/dashboard/types";
import FeatherIcon from "react-native-vector-icons/Feather";
import { IconLoadingDataComponent } from "../../LoadingComponent";
import InputComponent from "../../InputComponent";
import ListGameComponent from "../ListGameComponent";
import NFTFilters from "../../../modules/nft/filters";
import { type PageInfo } from "../../../modules/graphql/types";
import ScrollViewToTop from "../../ScrollToTopComponent";
import Toast from "../../ToastInfo";
import TransFilters from "../../../modules/transaction/filters";
import { type cf_services } from "../../../config/services";
import { useTranslation } from "react-i18next";

export default function DashboardComponent({
  serviceID,
  game,
  setGame,
}: {
  serviceID: any;
  game: (typeof cf_services)[0];
  setGame: any;
}) {
  const [itemDMetadata, setItemDMetadata] = useState<any>(null);
  const [linkTime, setLinkTime] = useState(FILTER_DASHBOARD.DAY);
  const [onRequest, setOnRequest] = useState(false);
  const [onRequestTrans, setOnRequestTrans] = useState(false);
  const [onRequestDashboard, setOnRequestDashboard] = useState(false);
  const [filters, setFilters]: [filters: NFTFilters | any, setFilters: any] =
    useState(null);
  const [filtersTrans, setFiltersTrans]: [
    filters: TransFilters | any,
    setFilters: any,
  ] = useState(null);
  const [refresh, setRefreshing] = useState(false);
  const [assets, setAssets] = useState<any[]>([]);
  const [assetsTrans, setAssetsTrans] = useState<any[]>([]);
  const [pageInfo, setPageInfo]: [pageInfo: PageInfo, setPageInfo: any] =
    useState<any>(null);
  const [pageInfoList, setPageInfoList]: [
    pageInfo: PageInfo,
    setPageInfo: any,
  ] = useState<any>(null);
  const [numberPageCurrent, setNumberPageCurrent] = useState("1");
  const [numberPageCurrentList, setNumberPageCurrentList] = useState("1");
  const [kind, setKind]: [v: string, setV: any] = useState(
    ListDashboard.RECENTLY_LIST,
  );

  const dispatch = useDispatch();
  const dispatchGetData = (time?: number) =>
    dispatch(DashboardActions.getData(time, serviceID));
  const dispatchGetMarketDatas = (request: GetMarketDatas) =>
    dispatch(NFTActions.getMarketDatas({ ...request, serviceID }));

  const getDataTransaction = (request: GetTransactionDatas) =>
    dispatch(
      TransactiondActions.getDataTransaction({
        ...request,
        serviceID,
      }),
    );

  const marketDatasOnRequest = useSelector(NFTReducers.marketDatasOnRequest);
  const marketDatasResponse = useSelector(NFTReducers.marketDatasResponse);

  const dataTransactionOnRequest = useSelector(
    TransactionReducers.dataTransactionOnRequest,
  );
  const dataResponseTransactions = useSelector(
    TransactionReducers.dataResponseTransactions,
  );

  const dataResponse: DashboardStatistics = useSelector(
    DashboardReducers.dataResponse,
  );
  const dataOnRequest = useSelector(DashboardReducers.dataOnRequest);

  const [addressSearch, setAddressSearch] = useState("");
  const [addressSearchTemp, setAddressSearchTemp] = useState("");

  useEffect(() => {
    isAddress(addressSearchTemp) && setAddressSearch(addressSearchTemp);
  }, [addressSearchTemp]);

  const reload = () => {
    setFilters(getDefaultFilters());
    setFiltersTrans(getCurrentTransactionFilters());
  };

  // Market
  const getDefaultFilters = (): INFTFilters => {
    const _p: NFTFilters = new NFTFilters();
    _p.push("orders", {
      created: "desc",
    });
    _p.push("limit", 9);
    _p.push("offset", 0);
    return _p.toInterface();
  };

  useEffect(() => {
    reload();
    loadData();
  }, [serviceID]);

  useEffect(() => {
    setOnRequest(marketDatasOnRequest > 0);
  }, [marketDatasOnRequest]);

  useEffect(() => {
    if (filters == null) return;

    // perform listing
    dispatchGetMarketDatas({
      account: addressSearch,
      filters,
    });
    setNumberPageCurrentList(
      (Math.floor(filters.offset / filters.limit) + 1).toString(),
    );
  }, [filters]);

  useEffect(() => {
    if (onRequest) return;
    let ret: Nft[] = [];
    if (marketDatasResponse != null) {
      ret = [...ret, ...marketDatasResponse.nfts];
      setPageInfoList(marketDatasResponse.pageInfo);
    }
    setAssets(ret);
    setRefreshing(false);
  }, [onRequest]);

  /// ///

  /// / Transaction
  const getCurrentTransactionFilters = (): ITransFilters => {
    return getDefaultFiltersTrans();
  };
  const getDefaultFiltersTrans = (): ITransFilters => {
    const _p: TransFilters = new TransFilters();
    _p.push("limit", 9);
    _p.push("offset", 0);
    return _p.toInterface();
  };

  useEffect(() => {
    setOnRequestTrans(dataTransactionOnRequest > 0);
  }, [dataTransactionOnRequest]);

  useEffect(() => {
    if (filtersTrans == null) return;
    // perform listing
    getDataTransaction({
      account: addressSearch,
      filters: filtersTrans,
    });
    setNumberPageCurrent(
      (Math.floor(filtersTrans.offset / filtersTrans.limit) + 1).toString(),
    );
  }, [filtersTrans]);

  useEffect(() => {
    if (kind == ListDashboard.RECENTLY_SOLD) {
      if (!filtersTrans) return;
      const temp = { ...filtersTrans };
      setFiltersTrans(null);
      setFiltersTrans(temp);
    } else {
      if (!filters) return;
      const temp = { ...filters };
      setFilters(null);
      setFilters(temp);
    }
  }, [kind]);

  useEffect(() => {
    if (dataTransactionOnRequest) return;
    let ret: Transaction[] = [];
    if (dataResponseTransactions != null) {
      ret = [...ret, ...dataResponseTransactions.trans];
      setPageInfo(dataResponseTransactions.pageInfo);
    }
    setAssetsTrans(ret);
    setRefreshing(false);
  }, [onRequestTrans]);

  const onPrevPage = () => {
    const offset =
      filtersTrans.offset > filtersTrans.limit
        ? filtersTrans.offset - filtersTrans.limit
        : 0;
    filtersTrans.push("offset", offset);
    setNumberPageCurrent(
      Math.floor(filtersTrans.offset / filtersTrans.limit).toString(),
    );
    setFiltersTrans((prevFilters: any) => ({
      ...prevFilters,
      ...filtersTrans.toInterface(),
    }));
  };

  const onNextPage = () => {
    setNumberPageCurrent(
      Math.floor(
        (filtersTrans.offset + filtersTrans.limit) / filtersTrans.limit + 1,
      ).toString(),
    );
    filtersTrans.push("offset", filtersTrans.offset + filtersTrans.limit);
    setFiltersTrans((prevFilters: any) => ({
      ...prevFilters,
      ...filtersTrans.toInterface(),
    }));
  };
  const keyDownPageCurrent = (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (isNumber(parseInt(numberPageCurrent))) {
      if (parseInt(numberPageCurrent) > 0) {
        filtersTrans.push(
          "offset",
          (parseInt(numberPageCurrent) - 1) * filtersTrans.limit,
        );
        setFiltersTrans((prevFilters: any) => ({
          ...prevFilters,
          ...filtersTrans.toInterface(),
        }));
      } else {
        Toast.error(t("wallet.page_invalid"));
      }
    } else {
      Toast.error(t("wallet.page_invalid"));
    }
  };

  const changePageCurrent = (e: any) => {
    if (isEmpty(e)) {
      setNumberPageCurrent("");
    } else {
      setNumberPageCurrent(e);
    }
  };

  /// / List

  const onPrevPageList = () => {
    const offset =
      filters.offset > filters.limit ? filters.offset - filters.limit : 0;
    filters.push("offset", offset);
    setNumberPageCurrentList(
      Math.floor(filters.offset / filters.limit).toString(),
    );
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      ...filters.toInterface(),
    }));
  };

  const onNextPageList = () => {
    setNumberPageCurrentList(
      Math.floor(
        (filters.offset + filters.limit) / filters.limit + 1,
      ).toString(),
    );
    filters.push("offset", filters.offset + filters.limit);
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      ...filters.toInterface(),
    }));
  };

  const keyDownPageCurrentList = (e: any) => {
    if (e.key === "Enter") {
      let value = e.target.value;
      if (value == "" || isEmpty(value)) value = 1;
      if (isNumber(parseInt(value)) && Number.isInteger(Number(value))) {
        if (value > 0) {
          filters.push("offset", (value - 1) * filters.limit);
          setFilters((prevFilters: any) => ({
            ...prevFilters,
            ...filters.toInterface(),
          }));
        } else {
          Toast.error(t("wallet.page_invalid"));
        }
      } else {
        Toast.error(t("wallet.page_invalid"));
      }
    }
  };

  const changePageCurrentList = (e: any) => {
    if (isEmpty(e)) {
      setNumberPageCurrentList("");
    } else {
      setNumberPageCurrentList(e);
    }
  };

  /// /

  const loadData = () => {
    const currrentTime = new Date();
    currrentTime.setMinutes(0);
    currrentTime.setSeconds(0);
    // get mốc thời gian
    if (linkTime == FILTER_DASHBOARD.DAY) {
      currrentTime.setDate(currrentTime.getDate() - 1);
    } else if (linkTime == FILTER_DASHBOARD.WEEK) {
      currrentTime.setDate(currrentTime.getDate() - 7);
    } else if (linkTime == FILTER_DASHBOARD.MONTH) {
      currrentTime.setDate(currrentTime.getDate() - 30);
    } else if (linkTime == FILTER_DASHBOARD.TOTAL) {
      dispatchGetData(null);
      return;
    }
    const filterDashboard = Math.round(currrentTime.getTime() / 1000);
    dispatchGetData(filterDashboard);
  };

  useEffect(() => {
    if (!linkTime) return;
    loadData();
  }, [linkTime]);

  useEffect(() => {
    if (isEmpty(addressSearch)) return;
    {
      const temp = filters;
      setFilters(null);
      setFilters({ ...temp });
    }
    {
      const temp = filtersTrans;
      setFiltersTrans(null);
      setFiltersTrans({ ...temp });
    }
  }, [addressSearch]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  useEffect(() => {
    refresh && reload();
  }, [refresh]);

  useEffect(() => {
    setOnRequestDashboard(dataOnRequest > 0);
  }, [dataOnRequest]);

  useEffect(() => {
    if (onRequestDashboard) return;
    if (dataResponse == null) return;
    setItemDMetadata(dataResponse);
  }, [onRequestDashboard]);

  const changeKindNft = (pKind: ListDashboard) => {
    setKind(pKind);
  };

  const { t } = useTranslation();
  const { colors, dark } = useTheme();
  const navigation = useNavigation();

  return (
    <ScrollViewToTop onRefresh={onRefresh} refreshing={refresh}>
      <ListGameComponent game={game} setGame={setGame} />
      <View
        style={{
          flex: 1,
          marginTop: 16,
          paddingHorizontal: 20,
          paddingBottom: 220,
          gap: 8,
        }}
      >
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 40,
            paddingHorizontal: 16,
            height: 40,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FeatherIcon name="clock" size={24} color={colors.text} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 16,
            }}
          >
            <TouchableOpacity
              style={{
                paddingHorizontal: 16,
                paddingVertical: 9,
                backgroundColor:
                  linkTime == FILTER_DASHBOARD.DAY
                    ? colors.primary
                    : "transparent",
              }}
              activeOpacity={0.8}
              onPress={() => {
                setLinkTime(FILTER_DASHBOARD.DAY);
              }}
            >
              <MyTextApp
                style={{
                  color:
                    linkTime == FILTER_DASHBOARD.DAY ? "#fff" : colors.text,
                }}
              >
                {t("nfts.dashboard_tab.last")} 24h
              </MyTextApp>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingHorizontal: 16,
                paddingVertical: 9,
                backgroundColor:
                  linkTime == FILTER_DASHBOARD.WEEK
                    ? colors.primary
                    : "transparent",
              }}
              activeOpacity={0.8}
              onPress={() => {
                setLinkTime(FILTER_DASHBOARD.WEEK);
              }}
            >
              <MyTextApp
                style={{
                  color:
                    linkTime == FILTER_DASHBOARD.WEEK ? "#fff" : colors.text,
                }}
              >
                7 {t("nfts.dashboard_tab.days")}
              </MyTextApp>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingHorizontal: 16,
                paddingVertical: 9,
                backgroundColor:
                  linkTime == FILTER_DASHBOARD.MONTH
                    ? colors.primary
                    : "transparent",
              }}
              activeOpacity={0.8}
              onPress={() => {
                setLinkTime(FILTER_DASHBOARD.MONTH);
              }}
            >
              <MyTextApp
                style={{
                  color:
                    linkTime == FILTER_DASHBOARD.MONTH ? "#fff" : colors.text,
                }}
              >
                30 {t("nfts.dashboard_tab.days")}
              </MyTextApp>
            </TouchableOpacity>
          </View>
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
            <View style={{ gap: 5, minWidth: 100 }}>
              <MyTextApp
                style={{
                  ...FONTS.fontBold,
                  color: colors.title,
                }}
              >
                {t("nfts.dashboard_tab.total_sale")}
              </MyTextApp>
              <MyTextApp
                style={{
                  fontSize: 20,
                  ...FONTS.fontBold,
                  color: colors.title,
                }}
              >
                {onRequestDashboard
                  ? 0
                  : currencyFormat(itemDMetadata?.numTransaction)}
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
            <View style={{ gap: 5, minWidth: 100 }}>
              <MyTextApp
                style={{
                  ...FONTS.fontBold,
                  color: colors.title,
                }}
              >
                {t("nfts.dashboard_tab.total_volume")}
              </MyTextApp>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <Image source={ICONS.nemo} style={{ width: 20, height: 20 }} />
                <MyTextApp
                  style={{
                    fontSize: 20,
                    ...FONTS.fontBold,
                    color: colors.title,
                  }}
                >
                  {onRequestDashboard
                    ? 0
                    : currencyFormat(
                        roundNumber(itemDMetadata?.totalPriceTransaction, 3),
                      )}
                </MyTextApp>
              </View>
            </View>
          </ImageBackground>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <ButtonComponent
            titleJSX={<FeatherIcon name="search" size={24} color={"#fff"} />}
            onPress={() => {
              isAddress(addressSearchTemp) &&
                setAddressSearch(addressSearchTemp);
            }}
            borderRadius={8}
            width={60}
            height={48}
            style={{
              position: "absolute",
              right: 0,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              paddingVertical: 20,
              zIndex: 22,
            }}
            disabled={!addressSearch}
          />
          <InputComponent
            onChangeText={(e: string) => {
              setAddressSearchTemp(e);
            }}
            value={addressSearchTemp}
            style={{
              height: 48,
              paddingRight: 60,
              color: colors.title,
              fontSize: 16,
            }}
            placeholder={t("nfts.dashboard_tab.search_placeholder")}
            placeholderTextColor={colors.text}
            onSubmitEditing={() => {
              if (isAddress(addressSearchTemp))
                setAddressSearch(addressSearchTemp);
            }}
            showClear={false}
            inputPaddingRight={10}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 16,
          }}
        >
          <TouchableOpacity
            style={{
              paddingHorizontal: 30,
              paddingVertical: 8,
              height: 45,
              alignItems: "center",
              justifyContent: "center",
            }}
            activeOpacity={0.8}
            onPress={() => {
              changeKindNft(ListDashboard.RECENTLY_LIST);
            }}
          >
            {kind == ListDashboard.RECENTLY_LIST && (
              <View
                style={{
                  height: 3,
                  backgroundColor: colors.primary,
                  position: "absolute",
                  zIndex: 2,
                  bottom: 0,
                  width: SIZES.width / 2 - 40,
                }}
              ></View>
            )}
            <MyTextApp
              style={{ color: colors.title, fontSize: 16, ...FONTS.fontBold }}
            >
              {t("nfts.dashboard_tab.recently_listed")}
            </MyTextApp>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingHorizontal: 30,
              paddingVertical: 8,
              height: 45,
              alignItems: "center",
              justifyContent: "center",
            }}
            activeOpacity={0.8}
            onPress={() => {
              changeKindNft(ListDashboard.RECENTLY_SOLD);
            }}
          >
            {kind == ListDashboard.RECENTLY_SOLD && (
              <View
                style={{
                  height: 3,
                  backgroundColor: colors.primary,
                  position: "absolute",
                  zIndex: 2,
                  bottom: 0,
                  width: SIZES.width / 2 - 40,
                }}
              ></View>
            )}
            <MyTextApp
              style={{ color: colors.title, fontSize: 16, ...FONTS.fontBold }}
            >
              {t("nfts.dashboard_tab.recently_sold")}
            </MyTextApp>
          </TouchableOpacity>
        </View>
        {kind == ListDashboard.RECENTLY_LIST && (
          <View
            style={{
              gap: 8,
              alignItems: "center",
              width: "100%",
            }}
          >
            <View
              style={{
                width: "100%",
                marginTop: 24,
                alignItems: "center",
                maxWidth: 460,
                gap: 8,
              }}
            >
              {onRequest ? (
                <View style={{ height: 60 }}>
                  <IconLoadingDataComponent />
                </View>
              ) : (
                <>
                  <RenderItemListed
                    t={t}
                    navigation={navigation}
                    dataList={assets}
                    serviceID={serviceID}
                  />
                </>
              )}
            </View>
            <View
              style={{
                alignItems: "center",
              }}
            >
              {!onRequest &&
                pageInfoList != null &&
                (pageInfoList?.hasNextPage ||
                  pageInfoList?.hasPrevPage ||
                  parseInt(numberPageCurrent) > 1) && (
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        marginTop: 16,
                      }}
                    >
                      {pageInfoList?.hasPrevPage && (
                        <TouchableOpacity
                          onPress={() => {
                            onPrevPageList();
                          }}
                          activeOpacity={0.8}
                          style={{
                            width: 32,
                            height: 32,
                            alignItems: "center",
                            justifyContent: "center",
                            borderWidth: 1,
                            borderColor: dark ? "#fff" : "#1f1f2c",
                            backgroundColor: dark ? "#1f1f2c" : "#fff",
                            borderRadius: 4,
                          }}
                        >
                          <FeatherIcon
                            name="chevron-left"
                            size={24}
                            color={colors.title}
                          />
                        </TouchableOpacity>
                      )}
                      <View>
                        <InputComponent
                          value={numberPageCurrentList}
                          onSubmitEditing={keyDownPageCurrentList}
                          onChangeText={(text: any) => {
                            changePageCurrentList(text);
                          }}
                          keyboardType="numeric"
                          returnKeyType="go"
                          returnKeyLabel="Go"
                          style={{
                            fontSize: 18,
                            color: colors.title,
                            textAlign: "center",
                            borderWidth: 1,
                            borderColor: dark
                              ? "#303241"
                              : "rgba(52, 52, 68, 0.5)",
                            backgroundColor: dark ? "#171822" : "#ebebeb",
                            paddingVertical: 4,
                            borderRadius: 4,
                            width: 72,
                            height: 32,
                            paddingHorizontal: 8,
                          }}
                          height={32}
                          paddingVeritcal={0}
                          inputPaddingRight={0}
                          showClear={false}
                          width={72}
                          textAlign="center"
                          fontWeight="bold"
                          fontSize={18}
                        />
                      </View>
                      {pageInfoList?.hasNextPage && (
                        <TouchableOpacity
                          onPress={() => {
                            onNextPageList();
                          }}
                          activeOpacity={0.8}
                          style={{
                            width: 32,
                            height: 32,
                            alignItems: "center",
                            justifyContent: "center",
                            borderWidth: 1,
                            borderColor: dark ? "#fff" : "#1f1f2c",
                            backgroundColor: dark ? "#1f1f2c" : "#fff",
                            borderRadius: 4,
                          }}
                        >
                          <FeatherIcon
                            name="chevron-right"
                            size={24}
                            color={colors.title}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
            </View>
          </View>
        )}

        {kind == ListDashboard.RECENTLY_SOLD && (
          <View
            style={{
              gap: 8,
              alignItems: "center",
              width: "100%",
            }}
          >
            <View
              style={{
                width: "100%",
                marginTop: 24,
                alignItems: "center",
                maxWidth: 460,
                gap: 8,
              }}
            >
              {onRequestTrans ? (
                <View style={{ height: 60 }}>
                  <IconLoadingDataComponent />
                </View>
              ) : (
                <RenderItemSold
                  navigation={navigation}
                  dataTrans={assetsTrans}
                  t={t}
                  serviceID={serviceID}
                />
              )}
            </View>
            <View
              style={{
                alignItems: "center",
              }}
            >
              {!onRequestTrans &&
                pageInfo != null &&
                (pageInfo?.hasNextPage ||
                  pageInfo?.hasPrevPage ||
                  parseInt(numberPageCurrent) > 1) && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      marginTop: 16,
                    }}
                  >
                    {pageInfo?.hasPrevPage && (
                      <TouchableOpacity
                        onPress={() => {
                          onPrevPage();
                        }}
                        activeOpacity={0.8}
                        style={{
                          width: 32,
                          height: 32,
                          alignItems: "center",
                          justifyContent: "center",
                          borderWidth: 1,
                          borderColor: dark ? "#fff" : "#1f1f2c",
                          backgroundColor: dark ? "#1f1f2c" : "#fff",
                          borderRadius: 4,
                        }}
                      >
                        <FeatherIcon
                          name="chevron-left"
                          size={24}
                          color={colors.title}
                        />
                      </TouchableOpacity>
                    )}
                    <View>
                      <InputComponent
                        value={numberPageCurrent}
                        onSubmitEditing={keyDownPageCurrent}
                        onChangeText={(text: any) => {
                          changePageCurrent(text);
                        }}
                        keyboardType="numeric"
                        returnKeyType="go"
                        returnKeyLabel="Go"
                        style={{
                          fontSize: 18,
                          color: colors.title,
                          textAlign: "center",
                          borderWidth: 1,
                          borderColor: dark
                            ? "#303241"
                            : "rgba(52, 52, 68, 0.5)",
                          backgroundColor: dark ? "#171822" : "#ebebeb",
                          paddingVertical: 4,
                          borderRadius: 4,
                          width: 72,
                          height: 32,
                          paddingHorizontal: 8,
                        }}
                        height={32}
                        paddingVeritcal={0}
                        inputPaddingRight={0}
                        showClear={false}
                        width={72}
                        textAlign="center"
                        fontWeight="bold"
                        fontSize={18}
                      />
                    </View>
                    {pageInfo?.hasNextPage && (
                      <TouchableOpacity
                        onPress={() => {
                          onNextPage();
                        }}
                        activeOpacity={0.8}
                        style={{
                          width: 32,
                          height: 32,
                          alignItems: "center",
                          justifyContent: "center",
                          borderWidth: 1,
                          borderColor: dark ? "#fff" : "#1f1f2c",
                          backgroundColor: dark ? "#1f1f2c" : "#fff",
                          borderRadius: 4,
                        }}
                      >
                        <FeatherIcon
                          name="chevron-right"
                          size={24}
                          color={colors.title}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
            </View>
          </View>
        )}
      </View>
    </ScrollViewToTop>
  );
}
