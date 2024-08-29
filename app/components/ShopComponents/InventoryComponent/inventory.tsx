import * as AccountReducers from "../../../modules/account/reducers";
import * as NFTActions from "../../../modules/nft/actions";
import * as NFTReducers from "../../../modules/nft/reducers";
import * as TransactionActions from "../../../modules/transaction/actions";
import * as TransactionReducers from "../../../modules/transaction/reducers";
import * as WalletReducers from "../../../modules/wallet/reducers";

import { COLORS, MyTextApp, SIZES } from "../../../themes/theme";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { type GetDatas, type INFTFilters } from "../../../modules/nft/types";
import { ListInventory, type SERVICE_ID } from "../../../common/enum";
import { type NftsData, type PageInfo } from "../../../modules/graphql/types";
import React, { useEffect, useState } from "react";
import {
  RenderItemBidComponent,
  RenderItemMyListingComponent,
  RenderListItemComponent,
  RenderListItemSoldComponent,
} from "./InventoryComponent";
import { isEmpty, isNumber, includes } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute, useTheme } from "@react-navigation/native";

import { ClassWithStaticMethod } from "../../../common/static";
import { Collections } from "../../../config/collections";
import FeatherIcon from "react-native-vector-icons/Feather";
import { type GetTransactionDatas } from "../../../modules/transaction/types";
import InputComponent from "../../InputComponent";
import NFTFilters from "../../../modules/nft/filters";
import NoDataComponent from "../../NoDataComponent";
import { STATUS_AVAILABLE_NFT } from "../../../common/constants";
import { SkeletonComponent } from "../../LoadingComponent";
import Toast from "../../ToastInfo";
import { ViewListBoxFail } from "../../../screens/EventScreen/Component/component";
import { descyptNEMOWallet } from "../../../common/utilities";
import cf_market from "../../../config/market";
import { useTranslation } from "react-i18next";

export default function Inventory({
  kind,
  setKind,
  orders,
  refreshing,
  setRefreshing,
  filters,
  setFilters,
  serviceID,
}: {
  kind: any;
  setKind: any;
  orders: any;
  refreshing: boolean;
  setRefreshing: any;
  filters: NFTFilters;
  setFilters: any;
  serviceID: SERVICE_ID;
}): JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<any>();

  const accountWeb = useSelector(AccountReducers.dataAccount);
  const [onRequest, setOnRequest] = useState(false);
  const [assets, setAssets] = useState<any[] | any>([]);
  const [assetBids, setAssetBids] = useState<any[] | any>([]);
  const [assetsTrans, setAssetsTrans] = useState<any[] | any>([]);

  const [pageInfo, setPageInfo]: [pageInfo: PageInfo, setPageInfo: any] =
    useState<any>(null);

  const [numberPageCurrent, setNumberPageCurrent] = useState("1");
  const [queryAccount, setQueryAccount]: [v: string, setV: any] = useState("");

  const { colors, dark } = useTheme();

  const dispatch = useDispatch();

  const signature = useSelector(WalletReducers.selectedSignature);

  const dispatchGetDatas = (request: GetDatas) =>
    dispatch(NFTActions.getDatas({ ...request, serviceID }));
  const datasOnRequest = useSelector(NFTReducers.datasOnRequest);
  const datasResponse: NftsData = useSelector(NFTReducers.datasResponse);

  const dispatchMarketDatas = (request: GetDatas) =>
    dispatch(NFTActions.getMarketDatas({ ...request, serviceID }));
  const marketDatasOnRequest = useSelector(NFTReducers.marketDatasOnRequest);
  const marketDatasResponse: NftsData = useSelector(
    NFTReducers.marketDatasResponse,
  );

  const dispatchOfferingDatas = (request: GetDatas) =>
    dispatch(
      NFTActions.getOfferingDatas({
        ...request,
        serviceID,
      }),
    );

  const dataTransactionOnRequest = useSelector(
    TransactionReducers.dataTransactionOnRequest,
  );
  const dataResponseTransactions = useSelector(
    TransactionReducers.dataResponseTransactions,
  );
  const dispatchGetDataTransaction = (request: GetTransactionDatas) =>
    dispatch(
      TransactionActions.getDataTransaction({
        ...request,
        serviceID,
      }),
    );

  const offeringDatasOnRequest = useSelector(
    NFTReducers.offeringDatasOnRequest,
  );
  const offeringDatasResponse = useSelector(NFTReducers.offeringDatasResponse);
  const availablesResponse = useSelector(NFTReducers.availablesResponse);

  const dispatchGetAvailables = () => {
    if (
      ClassWithStaticMethod.STATIC_DEFAULT_CHAINID !=
      ClassWithStaticMethod.NEMO_WALLET_CHAINID
    ) {
      const res = [];
      for (let i = 0; i < Collections.length; i++) {
        if (Collections[i].serviceID == serviceID) {
          res.push(Collections[i].contractNamespace);
        }
      }
      dispatch(
        NFTActions.getAvailables({
          namespaces: res,
        }),
      );
    }
  };

  const isGetMyItem = (): boolean => {
    return kind == ListInventory.LIST_FULL;
  };

  const isGetSelling = (): boolean => {
    return kind == ListInventory.LIST_SELLING;
  };

  const isGetOffering = (): boolean => {
    return kind == ListInventory.LIST_OFFERING;
  };

  const isGetSold = (): boolean => {
    return kind == ListInventory.LIST_SOLD;
  };

  const getDefaultFilters = (): INFTFilters => {
    const _p: NFTFilters = new NFTFilters();
    _p.push("orders", {
      created: "desc",
    });
    _p.push("limit", 12);
    _p.push("offset", 0);
    return _p.toInterface();
  };

  const cleanup = () => {
    setOnRequest(false);
    setFilters(null);
    setAssets([]);
    setAssetBids([]);
    setPageInfo(null);
  };

  useEffect(() => {
    if (accountWeb) {
      setQueryAccount(descyptNEMOWallet(accountWeb?.nemo_address));
      setFilters(getDefaultFilters());
    } else {
      setAssetBids([]);
      setAssets([]);
      setAssetsTrans([]);
    }
  }, [accountWeb]);

  useEffect(() => {
    if (!route.params) return;
    const { kind } = route.params;

    if (!kind) return;
    setKind(kind);
  }, [route]);

  useEffect(() => {
    if (isGetSelling()) {
      setOnRequest(marketDatasOnRequest > 0);
    } else if (isGetOffering()) {
      setOnRequest(offeringDatasOnRequest > 0);
    } else if (isGetSold()) {
      setOnRequest(dataTransactionOnRequest > 0);
    } else {
      setOnRequest(datasOnRequest > 0);
    }
  }, [
    datasOnRequest,
    marketDatasOnRequest,
    offeringDatasOnRequest,
    dataTransactionOnRequest,
    kind,
  ]);

  useEffect(() => {
    if (onRequest) return;
    let ret: any[] = [];
    if (isGetSelling()) {
      if (marketDatasResponse != null) {
        ret = [...ret, ...marketDatasResponse.nfts];
        if (ret.some((e) => e?.bids?.length != 0)) {
          // setShowIconWarning(true)
        } else {
          // setShowIconWarning(false)
        }
        setPageInfo(marketDatasResponse.pageInfo);
        setAssets([]);
        setAssets(ret);
        setRefreshing(false);
      } else {
        setAssets(null);
      }
    } else if (isGetOffering()) {
      if (offeringDatasResponse != null) {
        ret = [...ret, ...offeringDatasResponse.bids];
        setPageInfo(offeringDatasResponse.pageInfo);
        setAssetBids([]);
        setAssetBids(ret);
        setRefreshing(false);
      } else {
        setAssetBids(null);
      }
    } else if (isGetSold()) {
      if (
        dataResponseTransactions !== null &&
        dataResponseTransactions !== undefined
      ) {
        ret = [...ret, ...dataResponseTransactions?.trans];
        setPageInfo(dataResponseTransactions.pageInfo);
        setAssetsTrans([]);
        setAssetsTrans(ret);
        setRefreshing(false);
      } else {
        setAssetsTrans(null);
      }
    } else {
      if (datasResponse != null) {
        ret = [...ret, ...datasResponse.nfts];
        setPageInfo(datasResponse.pageInfo);
        setAssets([]);
        setAssets(ret);
        setRefreshing(false);
        dispatchGetAvailables();
      } else {
        setAssets(null);
      }
    }
  }, [onRequest]);

  useEffect(() => {
    if (signature) {
      dispatchGetAvailables();
    }
  }, [signature]);

  useEffect(() => {
    if (availablesResponse == null) return;
    const _asset = [...assets];
    for (let i = 0; i < _asset.length; i++) {
      if (_asset[i]) {
        const itemInAsset = availablesResponse.find(
          (e: any) => e.cid == _asset[i]?.metadata?.id,
        );
        if (itemInAsset != null && itemInAsset.status == STATUS_AVAILABLE_NFT) {
          _asset[i].isAvailable = true;
        } else {
          _asset[i].isAvailable = false;
        }
      }
    }
    setAssets(_asset);
  }, [availablesResponse]);

  useEffect(() => {
    if (filters == null) return;
    if (!accountWeb) return;

    if (isGetSelling()) {
      dispatchMarketDatas({
        account: queryAccount,
        filters,
      });
    } else if (isGetOffering()) {
      dispatchOfferingDatas({
        account: queryAccount,
        filters,
      });
    } else if (isGetSold()) {
      if (!isEmpty(queryAccount)) {
        dispatchGetDataTransaction({
          account: queryAccount,
          filters,
        });
      }
    } else {
      dispatchGetDatas({
        account: queryAccount,
        filters,
      });
    }
    setNumberPageCurrent(
      (Math.floor(filters.offset / filters.limit) + 1).toString(),
    );
  }, [filters, serviceID]);

  useEffect(() => {
    const value = orders?.value;
    if (!includes(value, "-")) return;
    filters.remove("orders", "");
    const [k, v] = value?.split("-");
    const _o: any = {};
    _o[k] = v;
    filters.push("orders", _o);
    filters.push("offset", 0);
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      ...filters.toInterface(),
    }));
  }, [orders]);

  const onPrevPage = () => {
    const offset =
      filters.offset > filters.limit ? filters.offset - filters.limit : 0;
    filters.push("offset", offset);
    setNumberPageCurrent(Math.floor(filters.offset / filters.limit).toString());
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      ...filters.toInterface(),
    }));
  };

  const onNextPage = () => {
    filters.push("offset", filters.offset + filters.limit);
    setNumberPageCurrent(Math.floor(filters.offset / filters.limit).toString());
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      ...filters.toInterface(),
    }));
  };

  const changePageCurrent = (e: any) => {
    if (isEmpty(e)) {
      setNumberPageCurrent("");
    } else {
      setNumberPageCurrent(e);
    }
  };

  const keyDownPageCurrent = (e: any) => {
    if (isNumber(parseInt(numberPageCurrent))) {
      if (parseInt(numberPageCurrent) > 0) {
        filters.push(
          "offset",
          (parseInt(numberPageCurrent) - 1) * filters.limit,
        );
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
  };

  useEffect(() => {
    if (refreshing && accountWeb) {
      cleanup();
      const temp = { ...filters };
      setFilters(null);
      setFilters(temp);
    }
  }, [refreshing]);

  return (
    <>
      <View style={{ paddingBottom: 180, width: "100%", alignItems: "center" }}>
        {isGetMyItem() && (
          <View style={{ width: "100%", marginVertical: 8 }}>
            <ViewListBoxFail
              gameServiceID={serviceID}
              refreshing={refreshing}
              setRefreshing={() => setRefreshing()}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  borderRadius: 30,
                  backgroundColor: dark ? COLORS.white : colors.primary,
                  paddingVertical: 12,
                  width: SIZES.width - 40,
                }}
              >
                <MyTextApp
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: dark ? "#1f1f2c" : COLORS.white,
                  }}
                >
                  {t("nfts.inventory_tab.list_error_box")}
                </MyTextApp>
              </View>
            </ViewListBoxFail>
          </View>
        )}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 15,
            justifyContent: "space-between",
            // borderWidth: 1, borderColor: 'red'
          }}
        >
          {!accountWeb ? (
            <View style={{ width: "100%" }}>
              <NoDataComponent />
            </View>
          ) : (
            <>
              {onRequest && (
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    gap: 12,
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                >
                  {[1, 2, 3, 4, 5, 6].map((e) => (
                    <SkeletonComponent
                      key={e}
                      width={SIZES.width / 2 - 20 - 6}
                      style={{ borderRadius: 8 }}
                    />
                  ))}
                </View>
              )}
              {!onRequest &&
                isGetOffering() &&
                (assetBids?.length == 0 ? (
                  <View
                    style={{
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <NoDataComponent />
                  </View>
                ) : (
                  <RenderItemBidComponent
                    dataBid={assetBids}
                    market={cf_market}
                    callback={() => false}
                    t={t}
                    navigation={navigation}
                    serviceID={serviceID}
                  />
                ))}
              {!onRequest &&
                isGetMyItem() &&
                (assets?.length == 0 ? (
                  <View
                    style={{
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <NoDataComponent />
                  </View>
                ) : (
                  <RenderListItemComponent
                    t={t}
                    navigation={navigation}
                    dataItem={assets}
                    kind={kind}
                    callback={() => false}
                    market={cf_market}
                    serviceID={serviceID}
                  />
                ))}
              {!onRequest &&
                isGetSelling() &&
                (assets?.length == 0 ? (
                  <View
                    style={{
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <NoDataComponent />
                  </View>
                ) : (
                  <RenderItemMyListingComponent
                    market={cf_market}
                    kind={kind}
                    callback={() => false}
                    t={t}
                    navigation={navigation}
                    dataItem={assets}
                    serviceID={serviceID}
                  />
                ))}
              {!onRequest &&
                isGetSold() &&
                (assetsTrans?.length == 0 ? (
                  <View
                    style={{
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <NoDataComponent />
                  </View>
                ) : (
                  <RenderListItemSoldComponent
                    dataSold={assetsTrans}
                    navigation={navigation}
                    t={t}
                    serviceID={serviceID}
                  />
                ))}
            </>
          )}
        </View>
        {accountWeb &&
          !onRequest &&
          pageInfo != null &&
          (pageInfo?.hasNextPage ||
            pageInfo?.hasPrevPage ||
            parseInt(numberPageCurrent) > 1) && (
            <View style={styles.pagination}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    onPrevPage();
                  }}
                  activeOpacity={0.8}
                  style={[
                    {
                      width: 32,
                      height: 32,
                    },
                    pageInfo?.hasPrevPage && {
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderColor: dark ? "#fff" : "#1f1f2c",
                      backgroundColor: dark ? "#1f1f2c" : "#fff",
                      borderRadius: 4,
                    },
                  ]}
                >
                  {pageInfo?.hasPrevPage && (
                    <FeatherIcon
                      name="chevron-left"
                      size={24}
                      color={colors.title}
                    />
                  )}
                </TouchableOpacity>

                <View>
                  <InputComponent
                    value={numberPageCurrent}
                    keyboardType="numeric"
                    returnKeyType="go"
                    returnKeyLabel="Go"
                    onSubmitEditing={keyDownPageCurrent}
                    onChangeText={(text: string) => {
                      changePageCurrent(text);
                    }}
                    style={{
                      fontSize: 18,
                      color: colors.title,
                      textAlign: "center",
                      borderWidth: 1,
                      borderColor: dark ? "#303241" : "rgba(52, 52, 68, 0.5)",
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
                {pageInfo.hasNextPage && (
                  <TouchableOpacity
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
                    onPress={() => {
                      onNextPage();
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  itemMarket: {},
  itemData: {},
  thumb: {},
  hagPrice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  price: {},
  listDataContainer: {},
  listMarket: {},
  listMainMarket: {},
  btnMarket: {},
  searchMarket: {},
  customInventory: {},
  itemPower: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    position: "absolute",
    bottom: 8,
    padding: 4,
    backgroundColor: "rgba(20, 20, 31, 0.50)",
    borderRadius: 4,
    overflow: "hidden",
  },
  title: {
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  bottomPrice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    overflow: "hidden",
    marginBottom: 8,
  },
  btnAction: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pagination: {
    marginTop: 24,
    paddingVertical: 24,
  },
  page: {
    textAlign: "center",
    borderRadius: 8,
  },
  pageNumber: {
    textAlign: "center",
  },
  inputPageNumber: {
    borderWidth: 1,
    textAlign: "center",
    width: 60,
    height: 32,
    padding: 4,
    borderRadius: 8,
  },
});
