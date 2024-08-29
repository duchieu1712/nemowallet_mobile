import { FlatList, View } from "react-native";
import React, { useCallback, useMemo, useState } from "react";

import NoDataComponent from "../../../../components/NoDataComponent";
import NotifyItem from "./NotifyItem";
import ScrollViewToTop from "../../../../components/ScrollToTopComponent";
import { TYPE_NOTIFY } from "../../../../common/enum";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const data = [
  {
    title: "Welcome new member",
    date: 1672963200,
    seen: false,
    type: TYPE_NOTIFY.CHANGE,
    html: `
    <p style='color:#fff'>
    COGI Network, formerly an NFT MMORPG game project, was developed by a group of experts in the fields of gaming, Blockchain, finance and technology, who share a strong passion for games. The project launched in Q4.2021 with the initial goal of building a "Blockchain-based RPG community" in the SEA market.
    </p>`,
  },
];

export default function TabAnnouncement() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  const RenderItem = useMemo(() => {
    return ({ item, index }: { item: any; index: any }) => (
      <View style={{ paddingHorizontal: 16 }} key={index}>
        <NotifyItem key={index} item={item} tab="annoucement" />
      </View>
    );
  }, [data]);

  return (
    <ScrollViewToTop
      style={{ backgroundColor: colors.background, width: "100%" }}
      refreshing={refreshing}
      onRefresh={onRefresh}
    >
      {data ? (
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
