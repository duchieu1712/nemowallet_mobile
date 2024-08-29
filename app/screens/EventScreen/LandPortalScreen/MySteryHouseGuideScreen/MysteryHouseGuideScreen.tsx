import { FONTS, MyTextApp } from "../../../../themes/theme";
import { ScrollView, TouchableOpacity, View } from "react-native";

import FeatherIcon from "react-native-vector-icons/Feather";
import React from "react";
import cf_rules_mysteryinfo from "../../../../config/rule_mysteryhouse";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function MysteryHouseGuideScreen({
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
        paddingHorizontal: 16,
        backgroundColor: colors.background,
        gap: 8,
      }}
    >
      <View
        style={{
          zIndex: 1,
          height: 48,
          flexDirection: "row",
          alignItems: "center",
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
          {t("event.mystery_house_guide")}
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
          <MyTextApp style={{ color: colors.title, lineHeight: 20 }}>
            {t("event.guide_1")} {"\n"}
            {t("event.guide_example")} {"\n"}
            {t("event.guide_2")}
          </MyTextApp>
          <ScrollView horizontal={true}>
            <View
              style={{
                borderWidth: 1,
                borderColor: colors.card,
                borderRadius: 8,
              }}
            >
              <View
                style={{
                  backgroundColor: colors.card,
                  flexDirection: "row",
                  alignItems: "center",
                  height: 52,
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
              >
                <MyTextApp
                  style={{
                    fontWeight: "bold",
                    color: colors.title,
                    width: 88,
                    textAlign: "center",
                    lineHeight: 20,
                  }}
                >
                  {t("event.mystery_house")}
                </MyTextApp>
                <MyTextApp
                  style={{
                    fontWeight: "bold",
                    color: colors.title,
                    width: 88,
                    textAlign: "center",
                    lineHeight: 20,
                  }}
                >
                  {t("event.total_land_level")}
                </MyTextApp>
                <MyTextApp
                  style={{
                    fontWeight: "bold",
                    color: colors.title,
                    width: 88,
                    textAlign: "center",
                    lineHeight: 20,
                  }}
                >
                  {t("event.hero")} SSS
                </MyTextApp>
                <MyTextApp
                  style={{
                    fontWeight: "bold",
                    color: colors.title,
                    width: 88,
                    textAlign: "center",
                    lineHeight: 20,
                  }}
                >
                  {t("event.hero")} S
                </MyTextApp>
                <MyTextApp
                  style={{
                    fontWeight: "bold",
                    color: colors.title,
                    width: 88,
                    textAlign: "center",
                    lineHeight: 20,
                  }}
                >
                  {t("event.hero")} A
                </MyTextApp>
                <MyTextApp
                  style={{
                    fontWeight: "bold",
                    color: colors.title,
                    width: 88,
                    textAlign: "center",
                    lineHeight: 20,
                  }}
                >
                  {t("event.hero")} B
                </MyTextApp>
                <MyTextApp
                  style={{
                    fontWeight: "bold",
                    color: colors.title,
                    width: 88,
                    textAlign: "center",
                    lineHeight: 20,
                  }}
                >
                  {t("event.hero")} C
                </MyTextApp>
                <MyTextApp
                  style={{
                    fontWeight: "bold",
                    color: colors.title,
                    width: 88,
                    textAlign: "center",
                    lineHeight: 20,
                  }}
                >
                  {t("event.hero")} D
                </MyTextApp>
                <MyTextApp
                  style={{
                    fontWeight: "bold",
                    color: colors.title,
                    width: 88,
                    textAlign: "center",
                    lineHeight: 20,
                  }}
                >
                  {t("event.cooldown")}
                </MyTextApp>
              </View>
              {cf_rules_mysteryinfo?.map((rule, i) => (
                <View
                  style={{
                    backgroundColor:
                      i % 2 === 0 ? colors.background : colors.card,
                    flexDirection: "row",
                    alignItems: "center",
                    height: 40,
                    borderBottomLeftRadius:
                      i === cf_rules_mysteryinfo.length - 1 ? 8 : 0,
                    borderBottomRightRadius:
                      i === cf_rules_mysteryinfo.length - 1 ? 8 : 0,
                  }}
                  key={i}
                >
                  <MyTextApp
                    style={{
                      fontWeight: "bold",
                      color: colors.title,
                      width: 88,
                      textAlign: "center",
                      lineHeight: 20,
                    }}
                  >
                    {rule.levelMys}
                  </MyTextApp>
                  <MyTextApp
                    style={{
                      fontWeight: "bold",
                      color: colors.title,
                      width: 88,
                      textAlign: "center",
                      lineHeight: 20,
                    }}
                  >
                    {rule.totalLevelLand}
                  </MyTextApp>
                  <MyTextApp
                    style={{
                      fontWeight: "bold",
                      color: colors.title,
                      width: 88,
                      textAlign: "center",
                      lineHeight: 20,
                    }}
                  >
                    {rule.rate_SSS}
                  </MyTextApp>
                  <MyTextApp
                    style={{
                      fontWeight: "bold",
                      color: colors.title,
                      width: 88,
                      textAlign: "center",
                      lineHeight: 20,
                    }}
                  >
                    {rule.rate_S}
                  </MyTextApp>
                  <MyTextApp
                    style={{
                      fontWeight: "bold",
                      color: colors.title,
                      width: 88,
                      textAlign: "center",
                      lineHeight: 20,
                    }}
                  >
                    {rule.rate_A}
                  </MyTextApp>
                  <MyTextApp
                    style={{
                      fontWeight: "bold",
                      color: colors.title,
                      width: 88,
                      textAlign: "center",
                      lineHeight: 20,
                    }}
                  >
                    {rule.rate_B}
                  </MyTextApp>
                  <MyTextApp
                    style={{
                      fontWeight: "bold",
                      color: colors.title,
                      width: 88,
                      textAlign: "center",
                      lineHeight: 20,
                    }}
                  >
                    {rule.rate_C}
                  </MyTextApp>
                  <MyTextApp
                    style={{
                      fontWeight: "bold",
                      color: colors.title,
                      width: 88,
                      textAlign: "center",
                      lineHeight: 20,
                    }}
                  >
                    {rule.rate_D}
                  </MyTextApp>
                  <MyTextApp
                    style={{
                      fontWeight: "bold",
                      color: colors.title,
                      width: 88,
                      textAlign: "center",
                      lineHeight: 20,
                    }}
                  >
                    {rule.cooldown}
                  </MyTextApp>
                </View>
              ))}
            </View>
          </ScrollView>
          <MyTextApp style={{ color: colors.title, lineHeight: 20 }}>
            {t("event.guide_3")} {"\n"}
            {t("event.guide_4")} {"\n"}
            {t("event.guide_5")}
          </MyTextApp>
        </View>
      </ScrollView>
    </View>
  );
}
