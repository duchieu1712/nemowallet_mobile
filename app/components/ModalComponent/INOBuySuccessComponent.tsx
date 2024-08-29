import { COLORS, FONTS, IMAGES, MyTextApp } from "../../themes/theme";
import { Image, View } from "react-native";

import ButtonComponent from "../ButtonComponent/ButtonComponent";
import React from "react";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function INOBuySuccessComponent({ item }: { item: any }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <View
      style={{
        width: "90%",
        maxWidth: 350,
        backgroundColor: colors.card,
        paddingVertical: 24,
        paddingHorizontal: 16,
        borderRadius: 12,
        gap: 8,
        alignItems: "center",
      }}
    >
      <Image source={IMAGES.success} alt="" />
      <MyTextApp
        style={{
          fontSize: 20,
          ...FONTS.fontBold,
          color: COLORS.success_2,
        }}
      >
        {t("common.success")}
      </MyTextApp>
      <MyTextApp style={{ color: colors.title }}>
        {t("common.congrates")} !
      </MyTextApp>
      <MyTextApp style={{ color: colors.title }}>
        {t("event.your_buy")} {item} {t("event.successfully")}
      </MyTextApp>
      <ButtonComponent title={t("nfts.inventory")} style={{ marginTop: 16 }} />
      <ButtonComponent
        title={t("event.mystery_box")}
        style={{ marginTop: 16 }}
        color={COLORS.disabledBtn}
        textColor={COLORS.white}
        borderColor={"transparent"}
      />
    </View>
  );
}
