import { Image, StyleSheet, View } from "react-native";
import { MyTextApp, SIZES } from "../../../themes/theme";
import { useNavigation, useTheme } from "@react-navigation/native";

import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import React from "react";
import { useTranslation } from "react-i18next";

export default function RequiredSignInScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            position: "relative",
            height: SIZES.height,
            justifyContent: "center",
          }}
        >
          <View style={styles.centerContent}>
            <View style={styles.images}>
              <Image
                source={require("../../../assets/images/images_n69/homepage/requiredSigin.png")}
                alt=""
              />
            </View>
            <MyTextApp style={{ ...styles.textContent, color: colors.title }}>
              {t("common.welcome_nemoverse")}
            </MyTextApp>
          </View>
          <View style={styles.bottomButton}>
            <ButtonComponent
              height={48}
              width={(SIZES.width - 50) / 2}
              title={t("auth.sign_up")}
              color="#34383F"
              borderColor="transparent"
              onPress={() => {
                navigation.navigate("VerifyEmailStep1Screen" as never, {
                  signup: true,
                });
              }}
            />
            <ButtonComponent
              height={48}
              width={(SIZES.width - 50) / 2}
              title={t("auth.sign_in")}
              onPress={() => {
                navigation.navigate("SignInScreen" as never);
              }}
            />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    height: SIZES.height - 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    columnGap: 12,
    backgroundColor: "transparent",
    minHeight: 40,
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -150,
  },
  images: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#282C35",
  },
  textContent: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
  },
  bottomButton: {
    // flex: 1,
    columnGap: 16,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 180,
  },
});
