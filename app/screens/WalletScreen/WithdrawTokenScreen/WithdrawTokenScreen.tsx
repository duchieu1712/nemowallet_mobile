import * as AccountReducers from "../../../modules/account/reducers";

import { COLORS, FONTS, MyTextApp, SIZES } from "../../../themes/theme";
import React, { useEffect, useState } from "react";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useRoute, useTheme } from "@react-navigation/native";

import FeatherIcon from "react-native-vector-icons/Feather";
import RequiredSigin from "../../AuthScreen/RequiredSignInScreen/RequiredSignInScreen";
import WithdrawV1Component from "./Component/WithdrawV1Component";
import WithdrawV2Component from "./Component/WithdrawV2Component";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export default function WithdrawScreen({ navigation }: { navigation?: any }) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const route = useRoute();
  const [data, setData] = useState<any>(null);

  const [routes] = useState([
    { key: "Send", title: "Send" },
    { key: "Bridge", title: "Bridge" },
  ]);
  const { colors } = useTheme();
  const renderScene = SceneMap({
    Send: () => (
      <WithdrawV1Component
        isFilter={index}
        navigation={navigation}
        dataQr={data}
      />
    ),
    Bridge: () => (
      <WithdrawV2Component isFilter={index} navigation={navigation} />
    ),
  });

  const accountWeb = useSelector(AccountReducers.dataAccount);

  useEffect(() => {
    if (!route.params) return;
    const { dataQr }: any = route.params;
    setData(dataQr);
  }, [route]);

  const renderTabBar = (props: any) => {
    return (
      <TabBar
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
          marginTop: -8,
        }}
        tabStyle={{
          width: SIZES.width / 2,
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
              {t(`wallet.withdraw_screen.${route.title?.toLowerCase()}`)}
            </MyTextApp>
          );
        }}
      />
    );
  };

  return (
    <>
      <View
        style={{
          ...styles.topHeader,
          backgroundColor: colors.background,
          padding: 16,
        }}
      >
        <View style={styles.leftHeaderBack}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FeatherIcon size={24} color={colors.title} name="arrow-left" />
          </TouchableOpacity>
          <MyTextApp style={{ ...styles.titleHeaderleft, color: colors.title }}>
            {t("wallet.transfer_token")}
          </MyTextApp>
        </View>
      </View>
      {!accountWeb ? (
        <RequiredSigin />
      ) : (
        <View style={{ ...styles.tab, backgroundColor: colors.background }}>
          <TabView
            lazy={true}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: SIZES.width }}
            renderTabBar={renderTabBar}
            sceneContainerStyle={{
              flex: 1,
              justifyContent: "space-between",
            }}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: COLORS.darkBackground,
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftHeaderBack: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    columnGap: 10,
  },
  titleHeaderleft: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  textTab: {
    color: "#fff",
    ...FONTS.font,
  },
  content: {
    width: "100%",
    flex: 1,
    marginBottom: 24,
  },
  titleContent: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  icon_2: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  textInput: {
    color: COLORS.white,
    backgroundColor: COLORS.backgroundInput,
    // paddingVertical: 13,
    paddingLeft: 16,
    paddingRight: 60,
    borderRadius: 8,
    ...FONTS.font,
    // marginTop: 8,
    width: "100%",
    flex: 1,
  },
  max: {
    position: "absolute",
    right: 16,
    top: 16,
    zIndex: 2,
    textTransform: "uppercase",
    color: COLORS.warning,
    ...FONTS.font,
  },
  line: {
    marginBottom: 32,
    height: 1,
    width: "100%",
    backgroundColor: COLORS.borderColor,
  },
});
