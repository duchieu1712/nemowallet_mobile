import { IMAGES, MyTextApp } from "../../../themes/theme";
import { ImageBackground, View } from "react-native";

import { GlobalStyleSheet } from "../../../themes/styleSheet";
import React from "react";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const WidgetTotalComponent = ({ total }: { total: any }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <View style={{ width: "100%" }}>
        <View
          style={{
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            width: "100%",
            paddingHorizontal: 18,
          }}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: colors.card,
              ...GlobalStyleSheet.shadow,
              borderRadius: 12,
              display: "flex",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <View style={{ width: "100%", height: 72 }}>
              <ImageBackground
                source={IMAGES.backgroundWallet}
                style={{
                  width: "100%",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                resizeMode="cover"
                resizeMethod="scale"
                imageStyle={{ borderRadius: 12 }}
              >
                <MyTextApp
                  style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}
                >
                  {t("wallet.total_assets")}
                </MyTextApp>
                <MyTextApp
                  style={{
                    marginTop: 8,
                    color: "#fff",
                    fontSize: 20,
                    fontWeight: "700",
                  }}
                >
                  {total ?? 0}
                </MyTextApp>
              </ImageBackground>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default WidgetTotalComponent;
