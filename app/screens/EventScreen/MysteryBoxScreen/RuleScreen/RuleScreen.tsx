import * as ruleEN from "../../../../assets/locales/en.json";

import { FONTS, MyTextApp } from "../../../../themes/theme";
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useRoute, useTheme } from "@react-navigation/native";

import FeatherIcon from "react-native-vector-icons/Feather";
import { SERVICE_ID } from "../../../../common/enum";
import { useTranslation } from "react-i18next";

export default function RuleScreen({ navigation }: { navigation: any }) {
  const { colors, dark } = useTheme();
  const { t } = useTranslation();
  const route = useRoute();
  const { itemID }: any = route.params;
  const [ruleArray, setRuleArray] = useState<any>(null);
  const [rule, setRule] = useState<any>(null);

  useEffect(() => {
    if (itemID === SERVICE_ID._GALIXCITY) {
      setRuleArray(Object.keys(ruleEN.event.rule_galiX));
      setRule("rule_galiX");
    } else if (itemID === SERVICE_ID._9DNFT) {
      setRuleArray(Object.keys(ruleEN.event.rule_9dnft));
      setRule("rule_9dnft");
    } else {
      setRuleArray(Object.keys(ruleEN.event.rule_mecha));
      setRule("rule_mecha");
    }
  }, [itemID]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          zIndex: 1,
          paddingHorizontal: 16,
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
          {t("event.rule")}
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
            // left: 5,
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
        {itemID && (
          <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
            {ruleArray?.map((key: any) => (
              <MyTextApp
                key={key}
                style={{ lineHeight: 20, color: colors.title }}
              >
                {t(`event.${rule}.${key}`)}
              </MyTextApp>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
