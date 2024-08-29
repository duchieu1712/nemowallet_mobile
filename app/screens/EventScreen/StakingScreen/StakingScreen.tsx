import { COLORS, FONTS, MyTextApp, SIZES } from "../../../themes/theme";
import React, { useState } from "react";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { StyleSheet, View } from "react-native";
import { useFocusEffect, useTheme } from "@react-navigation/native";

import HeaderBarComponent from "../../../components/HeaderComponent/HeaderComponent";
import TabStakingHistoryComponent from "./StakingComponent/TabStakingHistoryComponent";
import TabStakingPackComponent from "./StakingComponent/TabStakingPackComponent";
import { useTranslation } from "react-i18next";

export default function Staking({ navigation }: { navigation: any }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "StakingPack", title: t("event.staking_pack") },
    { key: "History", title: t("event.history") },
  ]);

  const renderScene = SceneMap({
    StakingPack: () => <TabStakingPackComponent />,
    History: () => <TabStakingHistoryComponent />,
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
          marginBottom: 15,
          marginTop: -8,
        }}
        // indicatorContainerStyle={{
        //   marginHorizontal: 15,
        // }}
        tabStyle={{
          width: SIZES.width / 2 - 18,
        }}
        renderLabel={({ focused, route }) => {
          return (
            <MyTextApp
              style={{
                fontSize: 16,
                color: focused ? colors.title : colors.text,
                numberOfLine: 1,
              }}
            >
              {route.title}
            </MyTextApp>
          );
        }}
      />
    );
  };
  return (
    <View style={styles.container}>
      <HeaderBarComponent leftIcon="back" title={t("event.staking")} />
      <View style={{ ...styles.tab, backgroundColor: colors.background }}>
        <TabView
          lazy={true}
          overScrollMode={"always"}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: SIZES.width }}
          renderTabBar={renderTabBar}
          sceneContainerStyle={{
            flex: 1,
            justifyContent: "space-between",
          }}
          swipeEnabled={false}
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
    paddingHorizontal: 18,
  },
  textTab: {
    ...FONTS.font,
  },
});
