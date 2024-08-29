import React, { useCallback, useMemo, useState } from "react";

import { FlatList } from "react-native";
import NoDataComponent from "../../../../components/NoDataComponent";
import { NotifyTxItem } from "./NotifyItem";
import ScrollViewToTop from "../../../../components/ScrollToTopComponent";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const data: any = [];

export default function TabTransactions() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [dataTransaction, setDataTransaction] = useState(data.transactions);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  const RenderItem = useMemo(() => {
    return ({ item, index }: { item: any; index: any }) => (
      <NotifyTxItem
        key={index}
        item={item}
        tab="transactions"
        callback={(e: any) => {
          const exist = dataTransaction.findIndex((j: any) => j === e);
          if (exist) {
            if (dataTransaction[exist].seen === true) {
              dataTransaction[exist].seen = false;
              setDataTransaction(dataTransaction);
            }
          }
        }}
      />
    );
  }, [data]);
  return (
    <ScrollViewToTop
      style={{ paddingHorizontal: 16, backgroundColor: colors.background }}
      refreshing={refreshing}
      onRefresh={onRefresh}
    >
      {data?.length > 0 ? (
        <FlatList
          nestedScrollEnabled
          scrollEnabled={false}
          data={data}
          renderItem={RenderItem}
        />
      ) : (
        <NoDataComponent text={t("common.its_empty")} />
      )}
    </ScrollViewToTop>
  );
}
