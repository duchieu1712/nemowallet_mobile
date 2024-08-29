import { FONTS, IMAGES, MyTextApp } from "../themes/theme";
import { Image, View } from "react-native";

import React from "react";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function NoDataComponent({
  text,
  image,
  flagOption = "",
}: {
  text?: string;
  image?: React.ReactNode | JSX.Element;
  flagOption?: string;
}) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return flagOption == "" ? (
    <View style={{ flex: 1, alignItems: "center", gap: 8 }}>
      {image ?? (
        <Image
          source={require("../assets/images/empty-box.png")}
          alt="no-data"
        />
      )}
      <MyTextApp
        style={{ fontSize: 18, ...FONTS.fontBold, color: colors.title }}
      >
        {text ?? t("wallet.no_data")}
      </MyTextApp>
    </View>
  ) : (
    <View style={{ width: "100%", alignItems: "center", gap: 20 }}>
      <Image
        source={IMAGES.no_data}
        resizeMode="contain"
        style={{ width: "80%", height: 200 }}
      />
      <MyTextApp
        style={{
          color: colors.title,
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        {t("event.no_data")}
      </MyTextApp>
    </View>
  );
}
