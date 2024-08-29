import { FONTS, MyTextApp, SIZES } from "../../../../themes/theme";
import { TouchableOpacity, View } from "react-native";
import { useRoute, useTheme } from "@react-navigation/native";

import FeatherIcon from "react-native-vector-icons/Feather";
import React from "react";
import RenderHtml from "react-native-render-html";
import { timestampToHuman_v2 } from "../../../../common/utilities";
import { useTranslation } from "react-i18next";

export default function DetailNotify({ navigation }: { navigation: any }) {
  const route = useRoute();
  const { item }: any = route.params;
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <View
        style={{
          height: 48,
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
            onPress={() => navigation.goBack()}
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
          {t("notifications.detail_notification")}
        </MyTextApp>
      </View>
      <View style={{ padding: 16 }}>
        <MyTextApp
          style={{ fontSize: 18, fontWeight: "bold", color: colors.title }}
        >
          {item.title}
        </MyTextApp>
        <MyTextApp style={{ color: colors.title, marginVertical: 8 }}>
          {timestampToHuman_v2(item.date)}
        </MyTextApp>
        <View style={{ width: "100%", alignItems: "center" }}>
          <RenderHtml contentWidth={SIZES.width - 32} source={item} />
        </View>
      </View>
    </View>
  );
}
