import { FlatList } from "react-native";
import React, { useCallback, useMemo, useState } from "react";

import NoDataComponent from "../../../../components/NoDataComponent";
import { NotifyNewsItem } from "./NotifyItem";
import ScrollViewToTop from "../../../../components/ScrollToTopComponent";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const data: any = [];
export default function TabNews() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  const RenderItem = useMemo(() => {
    return ({ item, index }: { item: any; index: any }) => (
      <NotifyNewsItem
        key={item}
        item={index}
        tab="news"
        callback={() => {
          console.log("news");
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
      {data?.length ? (
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
