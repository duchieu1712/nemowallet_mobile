import { COLORS, FONTS, MyTextApp, SIZES } from "../../../themes/theme";
import { FILTER_LANDING, TAB_LANDPORTAL } from "../../../common/enum";
import React, { useState } from "react";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useFocusEffect, useTheme } from "@react-navigation/native";

import FeatherIcon from "react-native-vector-icons/Feather";
import TabLandComponent from "./Component/TabLandComponent";
import TabMapComponent from "./Component/TabMapComponent";
import TabMysteryHouseComponent from "./Component/TabMysteryHouseComponent";
import { useTranslation } from "react-i18next";

export default function LandPortalScreen({ navigation }: { navigation: any }) {
  const { colors, dark } = useTheme();
  const { t } = useTranslation();
  const [filterTagLanding, setFilterTagLanding] = useState(FILTER_LANDING.MAP);
  const [landidView, setLandidView] = useState<any>(null);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "Land", title: t("event.land") },
    { key: "Map", title: t("event.map") },
    { key: "MysteryHouse", title: t("event.mystery_house") },
  ]);

  const renderScene = SceneMap({
    Land: () => <TabLandComponent changeTagFocus={changeTagFocus} />,
    Map: () => (
      <TabMapComponent
        filterTagLanding={filterTagLanding}
        landidView={landidView}
      />
    ),
    MysteryHouse: () => (
      <TabMysteryHouseComponent
        changeTagFocusLandPortal={changeTagFocusLandPortal}
      />
    ),
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
          width: SIZES.width / 3,
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
  const changeTagFocus = (landid: any) => {
    setFilterTagLanding(FILTER_LANDING.MAP);
    setIndex(1);
    setLandidView(landid);
  };

  const changeTagFocusLandPortal = () => {
    setFilterTagLanding(FILTER_LANDING.MAP);
    setIndex(TAB_LANDPORTAL.LAND);
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
            height: 48,
            backgroundColor: colors.background,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
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
            {t("event.land_portal")}
          </MyTextApp>
          {(index === TAB_LANDPORTAL.MAP ||
            index === TAB_LANDPORTAL.MYSTERY_HOUSE) && (
            <TouchableOpacity
              style={{
                width: 60,
                height: 60,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: dark ? "#1F222A" : "#fff",
                borderRadius: 30,
                bottom: 6,
                left: 5,
              }}
              onPress={() => {
                if (index === TAB_LANDPORTAL.MYSTERY_HOUSE) {
                  navigation.navigate("MysteryHouseGuideScreen");
                } else navigation.navigate("MapDescriptionScreen");
              }}
              activeOpacity={0.8}
            >
              <View
                style={{
                  position: "absolute",
                  width: 14,
                  height: 14,
                  zIndex: 1,
                  backgroundColor: dark ? "#1F222A" : "#fff",
                  left: -9,
                  top: 12,
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    width: 28,
                    height: 28,
                    zIndex: 1,
                    backgroundColor: colors.background,
                    top: 0,
                    borderRadius: 14,
                    left: -19,
                  }}
                ></View>
              </View>
              <FeatherIcon name="help-circle" color={colors.title} size={20} />
            </TouchableOpacity>
          )}
        </View>
      </View>

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
