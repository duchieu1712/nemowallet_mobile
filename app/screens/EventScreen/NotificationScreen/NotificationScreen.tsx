import { COLORS, FONTS, MyTextApp, SIZES } from "../../../themes/theme";
import React, { useState } from "react";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useFocusEffect, useTheme } from "@react-navigation/native";

import FeatherIcon from "react-native-vector-icons/Feather";
import { TYPE_NOTIFY } from "../../../common/enum";
import TabAnnouncement from "./Component/Tab_Announcement";
import TabNews from "./Component/Tab_News";
import TabTransactions from "./Component/Tab_Transactions";
import { useTranslation } from "react-i18next";

const data: any = {
  announcement: [
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
    // {
    //   title: "Change password successfully",
    //   date: 1692417180,
    //   seen: false,
    //   type: TYPE_NOTIFY.CHANGE,
    // },
    // {
    //   title: "Change password successfully",
    //   date: 1692673560,
    //   seen: true,
    //   type: TYPE_NOTIFY.CHANGE,
    // },
    // {
    //   title: "Change password successfully",
    //   date: 1672963200,
    //   seen: true,
    //   type: TYPE_NOTIFY.CHANGE,
    // },
    // {
    //   title: "Change password successfully",
    //   date: 1672963200,
    //   seen: false,
    //   type: TYPE_NOTIFY.CHANGE,
    // },
    // {
    //   title: "Change password successfully",
    //   date: 1672963200,
    //   seen: false,
    //   type: TYPE_NOTIFY.CHANGE,
    // },
    // {
    //   title: "Change password successfully",
    //   date: 1672963200,
    //   seen: false,
    //   type: TYPE_NOTIFY.UPDATE_APP,
    // },
    // {
    //   title: "Swap successfully",
    //   date: 1672963200,
    //   seen: false,
    //   type: TYPE_NOTIFY.SWAP,
    //   address: "0xa458cb3461d7da9c8908637afcdb172f7ae80489",
    //   from: {
    //     symbol: "COGI",
    //     amount: 10000,
    //   },
    //   to: {
    //     symbol: "NEMO",
    //     amount: 1000,
    //   },
    // },
  ],
  transactions: [],
  news: [],
};

export default function NotificationScreen({
  navigation,
}: {
  navigation: any;
}) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "Announcement", title: t("notifications.announcement") },
    { key: "Transactions", title: t("notifications.transactions") },
    { key: "News", title: t("notifications.news") },
  ]);

  const renderScene = SceneMap({
    Announcement: () => <TabAnnouncement />,
    Transactions: () => <TabTransactions />,
    News: () => <TabNews />,
  });

  useFocusEffect(() => {
    navigation.setOptions({
      tabBarVisible: true,
    });
  });

  const renderTabBar = (props: any) => {
    return (
      <TabBar
        scrollEnabled
        {...props}
        indicatorStyle={{
          height: 3,
          backgroundColor: COLORS.white,
          borderRadius: 5,
        }}
        style={{
          backgroundColor: colors.background,
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.borderColor,
        }}
        // indicatorContainerStyle={{
        //   marginHorizontal: 15,
        // }}
        tabStyle={{
          width: SIZES.width > 375 ? SIZES.width / 3 : 125,
        }}
        renderLabel={({ focused, route }) => {
          return (
            <View
              style={{
                width: SIZES.width / 3,
                position: "relative",
              }}
            >
              <MyTextApp
                style={{
                  fontSize: 16,
                  color: focused ? colors.title : colors.text,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {route.title}
              </MyTextApp>

              {data[route.title?.toLowerCase()]?.find(
                (e: any) => e.seen === true,
              ) && (
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: COLORS.red,
                    position: "absolute",
                    right: 5,
                    top: 0,
                  }}
                ></View>
              )}
            </View>
          );
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          zIndex: 1,
          backgroundColor: colors.background,
        }}
      >
        <View
          style={{
            // height: 25,
            backgroundColor: colors.background,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              height: 48,
              width: 48,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.pop()}
              style={{
                height: "100%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FeatherIcon name="arrow-left" size={22} color={colors.title} />
            </TouchableOpacity>
          </View>
          <MyTextApp
            style={{
              flex: 1,
              textAlign: "left",
              ...FONTS.h5,
              ...FONTS.fontBold,
              color: colors.title,
            }}
          >
            {t("notifications.notifications")}
          </MyTextApp>
        </View>
      </View>
      <View style={styles.tab}>
        <TabView
          lazy={true}
          overScrollMode={"auto"}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: SIZES.width }}
          renderTabBar={renderTabBar}
          sceneContainerStyle={{
            flex: 1,
            // justifyContent: "space-between",
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZES.width,
    minHeight: SIZES.height,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  textTab: {
    ...FONTS.font,
  },
});
