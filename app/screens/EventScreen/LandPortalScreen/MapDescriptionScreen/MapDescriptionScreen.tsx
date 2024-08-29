import { FONTS, MyTextApp } from "../../../../themes/theme";
import { ScrollView, TouchableOpacity, View } from "react-native";

import DividerComponent from "../../../../components/DividerComponent/DividerComponent";
import FeatherIcon from "react-native-vector-icons/Feather";
import React from "react";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function MapDescriptionScreen({
  navigation,
}: {
  navigation: any;
}) {
  const { colors, dark } = useTheme();
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
          zIndex: 1,
          height: 48,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
        }}
      >
        <MyTextApp
          style={{
            flex: 1,
            textAlign: "left",
            ...FONTS.h5,
            ...FONTS.fontBold,
            color: colors.title,
          }}
        >
          {t("event.map_description")}
        </MyTextApp>
        <TouchableOpacity
          style={{
            width: 60,
            height: 60,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: dark ? "#1F222A" : "#fff",
            borderRadius: 30,
            bottom: 6,
            right: -20,
          }}
          onPress={() => navigation.goBack()}
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
          <FeatherIcon name="x-circle" color={colors.title} size={20} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={{ paddingVertical: 8, gap: 8 }}>
          <MyTextApp
            style={{
              color: colors.title,
              lineHeight: 22,
              paddingHorizontal: 16,
            }}
          >
            {t("event.descrip_1")} {"\n"}
            {t("event.descrip_2")} {"\n"}
            {t("event.descrip_3")}
          </MyTextApp>
          <View
            style={{
              height: 40,
              width: "100%",
              backgroundColor: colors.card,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MyTextApp
              style={{ fontWeight: "bold", fontSize: 16, color: colors.title }}
            >
              {t("event.land_wiki")}
            </MyTextApp>
          </View>
          <MyTextApp
            style={{
              color: colors.title,
              lineHeight: 22,
              paddingHorizontal: 16,
            }}
          >
            {t("event.land_level_descrip")}
          </MyTextApp>
          <DividerComponent />
          <MyTextApp
            style={{
              color: colors.title,
              lineHeight: 22,
              paddingHorizontal: 16,
            }}
          >
            {t("event.owner_descrip")}
          </MyTextApp>
          <DividerComponent />
          <MyTextApp
            style={{
              color: colors.title,
              lineHeight: 22,
              paddingHorizontal: 16,
            }}
          >
            {t("event.dev_reward_descrip")}
          </MyTextApp>
          <DividerComponent />
          <MyTextApp
            style={{
              color: colors.title,
              lineHeight: 22,
              paddingHorizontal: 16,
            }}
          >
            {t("event.resource_reward_descrip")}
          </MyTextApp>
        </View>
      </ScrollView>
    </View>
  );
}
