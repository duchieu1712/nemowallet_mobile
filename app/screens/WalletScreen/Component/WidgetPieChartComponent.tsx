import { FONTS, IMAGES, MyTextApp, SIZES } from "../../../themes/theme";
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import {
  currencyFormat,
  isLogined,
  roundDownNumber,
} from "../../../common/utilities";

import AntdIcon from "react-native-vector-icons/AntDesign";
import FeatherIcon from "react-native-vector-icons/Feather";
import { GlobalStyleSheet } from "../../../themes/styleSheet";
import { useNavigation, useTheme } from "@react-navigation/native";

import { useTranslation } from "react-i18next";

const WalletWidgetComponent = (props: any) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

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
            paddingHorizontal: 16,
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
                  {t("wallet.total_value")}
                </MyTextApp>
                <MyTextApp
                  style={{
                    marginTop: 8,
                    color: "#fff",
                    fontSize: 20,
                    fontWeight: "700",
                  }}
                >
                  {props.total()
                    ? `$${currencyFormat(
                        roundDownNumber(props.total(), 2)?.toFixed(2),
                      )}`
                    : "$0"}
                </MyTextApp>
              </ImageBackground>
            </View>
            <View
              style={{
                marginBottom: 10,
                flexDirection: "row",
                justifyContent: "space-evenly",
                flexWrap: "wrap",
                marginTop: 10,

                // columnGap: 24,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("DepositScreen" as never);
                }}
                style={{
                  ...styles.item,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 16,
                    marginBottom: 6,
                  }}
                >
                  <FeatherIcon size={24} color={colors.title} name="anchor" />
                </View>
                <MyTextApp
                  style={{
                    ...FONTS.fontSm,
                    color: colors.title,
                  }}
                >
                  {t("wallet.deposit")}
                </MyTextApp>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("WithdrawScreen" as never);
                }}
                style={{
                  ...styles.item,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 16,
                    marginBottom: 6,
                  }}
                >
                  <FeatherIcon size={24} color={colors.title} name="share" />
                </View>
                <MyTextApp
                  style={{
                    ...FONTS.fontSm,
                    color: colors.title,
                  }}
                >
                  {t("wallet.withdraw")}
                </MyTextApp>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("SwapScreen" as never);
                }}
                style={{
                  ...styles.item,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 16,
                    marginBottom: 6,
                  }}
                >
                  {/* <FeatherIcon size={24} color={colors.title} name="book" /> */}
                  <FeatherIcon size={24} color={colors.title} name="repeat" />
                </View>
                <MyTextApp
                  style={{
                    ...FONTS.fontSm,
                    color: colors.title,
                  }}
                >
                  {t("menu.swap")}
                </MyTextApp>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  isLogined()
                    ? navigation.navigate("QRCodeScreen" as never)
                    : navigation.navigate("SignInScreen" as never);
                }}
                style={{
                  ...styles.item,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 16,
                    marginBottom: 6,
                  }}
                >
                  {/* <FeatherIcon size={24} color={colors.title} name="book" /> */}
                  <AntdIcon size={24} color={colors.title} name="qrcode" />
                </View>
                <MyTextApp
                  style={{
                    ...FONTS.fontSm,
                    color: colors.title,
                  }}
                >
                  {t("wallet.qr_code")}
                </MyTextApp>
              </TouchableOpacity>
              {/* <TouchableOpacity
                onPress={() => Linking.openURL("https://topup.nemoverse.io")}
                style={{
                  ...styles.item
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 16,
                    marginBottom: 6,
                  }}
                >
                  <MaterialIcons
                    size={24}
                    color={colors.title}
                    name="account-balance-wallet"
                  />
                </View>
                <MyTextApp
                  style={{
                    ...FONTS.fontSm,
                    color: colors.title,
                  }}
                >
                  {t("wallet.topup")}
                </MyTextApp>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: SIZES.radius,
    alignItems: "center",
    // width: (((SIZES.width - 15 - 15 + 24) / 4) - 24),
    // borderWidth: 1,
    // borderColor: "red",
  },
});

export default WalletWidgetComponent;
