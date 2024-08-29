import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { COLORS, FONTS, ICONS, MyTextApp } from "../../themes/theme";
import { Image, TouchableOpacity, View } from "react-native";
import { LANGUAGE, LOCALE_STORAGE } from "../../common/enum";
import React, { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import themeContext from "../../themes/themeContext";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const ThemeButtonComponent = () => {
  const { colors } = useTheme();
  const theme = useTheme();

  const { setDarkTheme, setLightTheme } = React.useContext<any>(themeContext);

  const offset = useSharedValue(0);
  const opacityDark = useSharedValue(0);
  const opacityLight = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  if (theme.dark) {
    offset.value = withSpring(34);
    opacityDark.value = withTiming(1);
    opacityLight.value = withTiming(0);
  } else {
    offset.value = withSpring(0);
    opacityLight.value = withTiming(1);
    opacityDark.value = withTiming(0);
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        if (theme.dark) {
          setLightTheme();
        } else {
          setDarkTheme();
        }
      }}
      style={{
        height: 34,
        width: 68,
        borderRadius: 17,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.tabBar,
      }}
    >
      <Animated.View
        style={[
          animatedStyles,
          {
            height: 28,
            width: 28,
            borderRadius: 14,
            backgroundColor: COLORS.primary,
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: 3,
            left: 3,
          },
        ]}
      ></Animated.View>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Image
          source={ICONS.sun}
          style={{
            height: 18,
            width: 18,
            tintColor: COLORS.white,
          }}
        />
      </View>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Image
          source={ICONS.moon}
          style={{
            height: 18,
            width: 18,
            tintColor: colors.title,
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ThemeButtonComponent;

export function ChangeLanguage() {
  const { colors } = useTheme();
  const theme = useTheme();

  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);

  useEffect(() => {
    i18n.changeLanguage(lang);
    AsyncStorage.setItem(LOCALE_STORAGE.LANGUAGE, lang);
  }, [lang]);

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: colors.tabBar,
        // paddingVertical: 4,
        // paddingHorizontal: 10,
        borderRadius: 28,
        height: 36,
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        style={{
          borderRadius: 28,
          backgroundColor:
            lang == LANGUAGE._ENGLAND ? colors.primary : COLORS.transparent,
          paddingVertical: 4,
          // paddingHorizontal: 6,
          width: 40,
          height: 32,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => {
          setLang(LANGUAGE._ENGLAND);
        }}
      >
        <MyTextApp
          style={{
            ...FONTS.fontBold,
            color:
              !theme.dark && lang == LANGUAGE._ENGLAND
                ? COLORS.white
                : colors.title,
            fontSize: 12,
          }}
        >
          ENG
        </MyTextApp>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setLang(LANGUAGE._VIETNAM);
        }}
        style={{
          borderRadius: 28,
          backgroundColor:
            lang == LANGUAGE._VIETNAM ? colors.primary : COLORS.transparent,
          paddingVertical: 4,
          // paddingHorizontal: 6,
          width: 40,
          height: 32,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MyTextApp
          style={{
            ...FONTS.fontBold,
            color:
              !theme.dark && lang == LANGUAGE._VIETNAM
                ? COLORS.white
                : colors.title,
            fontSize: 12,
          }}
        >
          VI
        </MyTextApp>
      </TouchableOpacity>
    </View>
  );
}
