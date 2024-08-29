import * as AccountReducers from "../../../../modules/account/reducers";
import * as PoolsActions from "../../../../modules/stakes/actions";
import * as PoolsReducers from "../../../../modules/stakes/reducers";
import * as WalletActions from "../../../../modules/wallet/actions";
import * as WalletReducers from "../../../../modules/wallet/reducers";

import { FlatList, Image, View } from "react-native";
import { IMAGES, MyTextApp } from "../../../../themes/theme";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { API_GET_PRICE_COGI } from "../../../../common/api";
import { IconLoadingDataComponent } from "../../../../components/LoadingComponent";
import { type PoolSimpleEarn } from "../../../../modules/graphql/types/generated";
import ScrollViewToTop from "../../../../components/ScrollToTopComponent";
import StackingHistoryComponent from "./StackingHistoryComponent";
import { isLogined } from "../../../../common/utilities";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function TabStakingHistoryComponent() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // Inventory
  // filter pool
  const [pools, setPools] = useState<any>(null);
  const [priceCogi, setPriceCogi] = useState(0);
  // reload data
  const reloadData: boolean = useSelector(WalletReducers.reloadData);
  const accountWeb = useSelector(AccountReducers.dataAccount);
  const dispatchReloadData = (flag: boolean) =>
    dispatch(WalletActions.reloadData(flag));

  const [onRequestPools, setOnRequestPools] = useState(false);
  //
  const dispatchGetDataPoolsStaked = () =>
    dispatch(PoolsActions.getDataPoolsStaked());
  const dataPoolsStakedOnRequest = useSelector(
    PoolsReducers.dataPoolsStakedOnRequest,
  );
  const dataPoolsStakedResponse: PoolSimpleEarn[] = useSelector(
    PoolsReducers.dataPoolsStakedResponse,
  );
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  const loadData = () => {
    if (isLogined()) {
      dispatchGetDataPoolsStaked();
    } else {
      setPools(null);
    }
    setRefreshing(false);
    getPriceCogi();
  };

  const getPriceCogi = () => {
    fetch(API_GET_PRICE_COGI)
      .then(async (data) => await data.json())
      .then((res: any) => {
        setPriceCogi(res);
      });
  };

  useEffect(() => {
    if (refreshing) {
      loadData();
    }
  }, [refreshing]);

  useEffect(() => {
    if (reloadData) return;
    loadData();
  }, [accountWeb]);

  useEffect(() => {
    if (!reloadData) return;
    dispatchReloadData(false);
    loadData();
  }, []);

  // Pools
  useEffect(() => {
    setOnRequestPools(dataPoolsStakedOnRequest > 0);
    setRefreshing(false);
  }, [dataPoolsStakedOnRequest]);

  useEffect(() => {
    if (onRequestPools) return;
    let ret: any = [];
    if (dataPoolsStakedResponse !== null) {
      ret = [...ret, ...dataPoolsStakedResponse];
      setRefreshing(false);
    }
    setPools(null);
    setPools(ret);
  }, [onRequestPools]);

  const RenderItem = useMemo(() => {
    return ({ item, index }: { item: any; index: any }) => {
      return (
        <StackingHistoryComponent
          value={item}
          index={index}
          priceCogi={priceCogi}
        />
      );
    };
  }, [pools, priceCogi]);

  return (
    <>
      {onRequestPools ? (
        <View style={{ flex: 1, alignItems: "center" }}>
          <IconLoadingDataComponent />
        </View>
      ) : (
        <ScrollViewToTop
          style={{
            paddingHorizontal: 16,
            gap: 16,
            paddingVertical: 16,
            paddingBottom: 150,
          }}
          refreshing={refreshing}
          onRefresh={onRefresh}
        >
          {pools && pools?.length !== 0 && isLogined() ? (
            <FlatList
              scrollEnabled={false}
              nestedScrollEnabled
              data={pools}
              renderItem={RenderItem}
            />
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
                {t("event.no_transaction_yet")}
              </MyTextApp>
            </View>
          )}
        </ScrollViewToTop>
      )}
    </>
  );
}
