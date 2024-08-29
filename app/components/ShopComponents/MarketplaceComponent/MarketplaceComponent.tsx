import * as NFTActions from "../../../modules/nft/actions";
import * as NFTReducers from "../../../modules/nft/reducers";

import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { isEmpty, isNumber } from "lodash";
import { useDispatch, useSelector } from "react-redux";

import FeatherIcon from "react-native-vector-icons/Feather";
import { type GetMarketDatas } from "../../../modules/nft/types";
import InputComponent from "../../InputComponent";
import { ListItemMarketplace } from "../ItemNFTMarketplaceComponent";
import type NFTFilters from "../../../modules/nft/filters";
import { type Nft } from "../../../modules/graphql/types/generated";
import NoDataComponent from "../../NoDataComponent";
import { type PageInfo } from "../../../modules/graphql/types";
import { SIZES } from "../../../themes/theme";
import { SkeletonComponent } from "../../LoadingComponent";
import Toast from "../../ToastInfo";
import cf_market from "../../../config/market";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function MarketplaceComponent({
  refresh,
  setRefresh,
  filters,
  setFilters,
  serviceID,
  navigation,
}: {
  refresh: boolean;
  setRefresh: any;
  filters: NFTFilters;
  setFilters: any;
  serviceID: any;
  navigation: any;
}): JSX.Element {
  const { colors, dark } = useTheme();
  const { t } = useTranslation();

  const [onRequest, setOnRequest] = useState(false);
  const [assets, setAssets] = useState<any>([]);
  const [pageInfo, setPageInfo]: [pageInfo: PageInfo, setPageInfo: any] =
    useState<any>(null);
  const [numberPageCurrent, setNumberPageCurrent] = useState("1");

  const dispatch = useDispatch();

  const dispatchGetMarketDatas = (request: GetMarketDatas) =>
    dispatch(
      NFTActions.getMarketDatas({
        ...request,
        serviceID,
      }),
    );

  const marketDatasOnRequest = useSelector(NFTReducers.marketDatasOnRequest);
  const marketDatasResponse = useSelector(NFTReducers.marketDatasResponse);

  const cleanup = () => {
    setOnRequest(false);
    setAssets([]);
    setPageInfo(null);
  };

  const reload = () => {
    cleanup();
    const temp = { ...filters };
    setFilters(null);
    setFilters(temp);
  };

  useEffect(() => {
    setOnRequest(marketDatasOnRequest > 0);
  }, [marketDatasOnRequest]);

  useEffect(() => {
    if (!filters?.limit) return;
    // perform listing
    dispatchGetMarketDatas({
      filters,
    });
    setNumberPageCurrent(
      (Math.floor(filters.offset / filters.limit) + 1).toString(),
    );
  }, [filters, serviceID]);

  useEffect(() => {
    // if (!isReady) return;
    let ret: Nft[] = [];
    if (marketDatasResponse != null) {
      ret = [...ret, ...marketDatasResponse.nfts];
      setPageInfo(marketDatasResponse.pageInfo);
      setRefresh(false);
    }
    setAssets(ret);
  }, [marketDatasResponse]);

  const onPrevPage = () => {
    if (filters == null) return;
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
    if (filters == null) return;
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
    // console.log(e)
    // if (e.key === "Enter") {
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
    // }
  };

  useEffect(() => {
    if (refresh) {
      reload();
    }
  }, [refresh]);

  return (
    <>
      <View
        style={{
          ...styles.container,
          paddingBottom: !pageInfo?.hasNextPage ? 50 : 0,
        }}
      >
        {onRequest ? (
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
        ) : assets.length == 0 ? (
          <View
            style={{
              width: "100%",
              alignItems: "center",
            }}
          >
            <NoDataComponent />
          </View>
        ) : (
          <ListItemMarketplace
            data={assets}
            callback={() => {
              return false;
            }}
            market={cf_market}
            serviceID={serviceID}
            navigation={navigation}
          />
        )}
      </View>
      {!onRequest &&
        pageInfo != null &&
        (pageInfo.hasNextPage ||
          pageInfo.hasPrevPage ||
          parseInt(numberPageCurrent) > 1) && (
          <View style={styles.pagination}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                // marginTop: 16,
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
                    // flex: 1,
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
                    width: 31,
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  itemMarket: {},
  itemData: {},
  thumb: {},
  hagPrice: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "flex-end",
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
    // maxWidth: "90%",
  },
  title: {
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  bottomPrice: {
    // flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    overflow: "hidden",
    // marginBottom: 8,
    width: "100%",
  },
  btnAction: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
    // backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  pagination: {
    marginTop: 24,
    paddingBottom: 80,
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
