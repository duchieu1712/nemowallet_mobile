import { COLORS, FONTS, ICONS, MyTextApp, SIZES } from "../themes/theme";
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";

import LinearGradient from "react-native-linear-gradient";

import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const CustomTabBar = ({
  state,
  navigation,
  descriptors,
}: {
  state?: any;
  navigation?: any;
  descriptors?: any;
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        borderRadius: SIZES.radius,
      }}
    >
      <View
        style={{
          height: 70 + (Platform.OS === "ios" ? 20 : 0),
          backgroundColor: colors.tabBar,
          borderWidth: 0,
          flexDirection: "row",
          zIndex: 3,
          // paddingBottom: Platform.OS === 'ios' ? 20 : 0,
        }}
        // intensity={8}
      >
        {state.routes.map((route: any, index: any) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate({ name: route.name, merge: true });
            }
          };
          if (label === "SwapScreen") {
            return (
              <View
                style={[
                  styles.tabItem,
                  { paddingHorizontal: 10 },
                  {
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "flex-end",
                    height: "100%",
                    display: "flex",
                    position: "relative",
                  },
                ]}
                key={index}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={onPress}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  <LinearGradient
                    colors={["#AA42FC", "#5243FC"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      height: 50,
                      width: 50,
                      backgroundColor: COLORS.primary,
                      borderRadius: 8,
                      marginTop: 0,
                      bottom: 44,
                      alignItems: "center",
                      justifyContent: "center",
                      transform: [{ rotate: isFocused ? "90deg" : "45deg" }],
                    }}
                  >
                    <Image
                      source={ICONS.trade}
                      style={{
                        height: 28,
                        width: 28,
                        transform: [
                          { rotate: isFocused ? "-90deg" : "-45deg" },
                        ],
                      }}
                    />
                  </LinearGradient>
                  <MyTextApp
                    style={{
                      ...FONTS.fontSm,
                      color: colors.title,
                      opacity: isFocused ? 1 : 0.45,
                      position: "absolute",
                      bottom: 12,
                      textAlign: "center",
                      justifyContent: "center",
                      alignItems: "center",
                      flex: 1,
                      minWidth: 50,
                      width: "100%",
                    }}
                  >
                    {/* {label} */}
                    {t(`menu.${label.toLowerCase()}`)}
                  </MyTextApp>
                </TouchableOpacity>
              </View>
            );
          } else {
            return (
              <View style={styles.tabItem} key={index}>
                <TouchableOpacity style={styles.tabLink} onPress={onPress}>
                  <Image
                    source={
                      label === "Home"
                        ? ICONS.home
                        : label === "Wallet"
                          ? ICONS.wallet
                          : label === "Shop"
                            ? ICONS.nfts
                            : label === "GameFi"
                              ? ICONS.event
                              : label === "Product"
                                ? ICONS.product
                                : null
                    }
                    style={{
                      height: isFocused ? 26 : 18,
                      width: isFocused ? 26 : 18,
                      marginBottom: 6,
                      marginTop: 1,
                      tintColor: colors.title,
                      opacity: isFocused ? 1 : 0.45,
                    }}
                  />
                  <MyTextApp
                    style={{
                      ...FONTS.fontSm,
                      color: colors.title,
                      opacity: isFocused ? 1 : 0.45,
                    }}
                  >
                    {t(`menu.${label.toLowerCase()}`)}
                  </MyTextApp>
                </TouchableOpacity>
              </View>
            );
          }
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabLink: {
    alignItems: "center",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    ...FONTS.fontSm,
  },
});

export default CustomTabBar;
