import * as AccountActions from "../modules/account/actions";
import * as AccountReducers from "../modules/account/reducers";

import { FONTS, ICONS, IMAGES, MyTextApp } from "../themes/theme";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useTheme } from "@react-navigation/native";

import ButtonComponent from "./ButtonComponent/ButtonComponent";
import FeatherIcon from "react-native-vector-icons/Feather";
import React from "react";
import { SignOutCustom } from "../modules/account/utilities";
import ThemeButtonComponent from "./ThemeButtonComponent";
import { ellipseText } from "../common/utilities";
import { useTranslation } from "react-i18next";

function SidebarComponent() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const accountWeb = useSelector(AccountReducers.dataAccount);

  const dispatchAccount = (account: any) =>
    dispatch(AccountActions.dataAccountResponse(account));

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.card,
      }}
    >
      <View
        style={{
          paddingHorizontal: 15,
          paddingVertical: 20,
          alignItems: "flex-start",
          backgroundColor: colors.background,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <View
            style={{
              marginBottom: 15,
              padding: 4,
              borderRadius: 70,
              backgroundColor: "rgba(255,255,255,.1)",
            }}
          >
            {accountWeb?.profile_picture ? (
              <Image
                source={{ uri: accountWeb?.profile_picture }}
                style={{
                  height: 70,
                  width: 70,
                  borderRadius: 70,
                }}
              />
            ) : (
              <Image
                source={IMAGES.defaultAvatart}
                style={{
                  height: 70,
                  width: 70,
                  borderRadius: 70,
                }}
              />
            )}
          </View>
          <View style={{ marginTop: 5 }}>
            <ThemeButtonComponent />
          </View>
        </View>
        {accountWeb ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("AccountScreen");
            }}
          >
            <MyTextApp
              style={{ ...FONTS.h6, color: colors.title, marginBottom: 3 }}
            >
              {accountWeb?.name}
            </MyTextApp>
            <MyTextApp
              style={{ ...FONTS.fontSm, color: colors.text, opacity: 0.7 }}
            >
              {ellipseText(accountWeb?.email)}
            </MyTextApp>
          </TouchableOpacity>
        ) : (
          <ButtonComponent
            title="Sign in"
            onPress={() => {
              navigation.navigate("SignInScreen");
            }}
            color="transparent"
            width="60%"
            textColor={colors.title}
          />
        )}
      </View>
      <View style={{ flex: 1, paddingVertical: 15 }}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            navigation.navigate("Wallet" as never);
          }}
        >
          <Image
            source={ICONS.home}
            style={{
              height: 18,
              width: 18,
              tintColor: colors.text,
              marginRight: 12,
            }}
          />
          <MyTextApp
            style={{
              ...FONTS.font,
              ...FONTS.fontMedium,
              color: colors.title,
              flex: 1,
            }}
          >
            {t("menu.wallet")}
          </MyTextApp>
          <FeatherIcon size={16} color={colors.text} name={"chevron-right"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            navigation.navigate("Components" as never);
          }}
        >
          <Image
            source={ICONS.grid}
            style={{
              height: 20,
              width: 20,
              tintColor: colors.text,
              left: -1,
              marginRight: 10,
            }}
          />
          <MyTextApp
            style={{
              ...FONTS.font,
              ...FONTS.fontMedium,
              color: colors.title,
              flex: 1,
            }}
          >
            {t("components")}
          </MyTextApp>
          <FeatherIcon size={16} color={colors.text} name={"chevron-right"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            navigation.navigate("NFTs" as never);
          }}
        >
          <Image
            source={ICONS.setting}
            style={{
              height: 18,
              width: 18,
              tintColor: colors.text,
              marginRight: 12,
            }}
          />
          <MyTextApp
            style={{
              ...FONTS.font,
              ...FONTS.fontMedium,
              color: colors.title,
              flex: 1,
            }}
          >
            NFTs
          </MyTextApp>
          <FeatherIcon size={16} color={colors.text} name={"chevron-right"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            navigation.navigate("SwapScreen" as never);
          }}
        >
          <Image
            source={ICONS.logout}
            style={{
              height: 18,
              width: 18,
              tintColor: colors.text,
              marginRight: 12,
            }}
          />
          <MyTextApp
            style={{
              ...FONTS.font,
              ...FONTS.fontMedium,
              color: colors.title,
              flex: 1,
            }}
          >
            {t("menu.swap")}
          </MyTextApp>
          <FeatherIcon size={16} color={colors.text} name={"chevron-right"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            navigation.navigate("Product" as never);
          }}
        >
          <Image
            source={ICONS.logout}
            style={{
              height: 18,
              width: 18,
              tintColor: colors.text,
              marginRight: 12,
            }}
          />
          <MyTextApp
            style={{
              ...FONTS.font,
              ...FONTS.fontMedium,
              color: colors.title,
              flex: 1,
            }}
          >
            {t("menu.product")}
          </MyTextApp>
          <FeatherIcon size={16} color={colors.text} name={"chevron-right"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            navigation.navigate("Connect" as never);
          }}
        >
          <Image
            source={ICONS.logout}
            style={{
              height: 18,
              width: 18,
              tintColor: colors.text,
              marginRight: 12,
            }}
          />
          <MyTextApp
            style={{
              ...FONTS.font,
              ...FONTS.fontMedium,
              color: colors.title,
              flex: 1,
            }}
          >
            {t("menu.connect")}
          </MyTextApp>
          <FeatherIcon size={16} color={colors.text} name={"chevron-right"} />
        </TouchableOpacity>
        {accountWeb && (
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              SignOutCustom(dispatchAccount);
            }}
          >
            <Image
              source={ICONS.logout}
              style={{
                height: 18,
                width: 18,
                tintColor: colors.text,
                marginRight: 12,
              }}
            />
            <MyTextApp
              style={{
                ...FONTS.font,
                ...FONTS.fontMedium,
                color: colors.title,
                flex: 1,
              }}
            >
              {t("logout")}
            </MyTextApp>
            <FeatherIcon size={16} color={colors.text} name={"chevron-right"} />
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          paddingHorizontal: 15,
          paddingVertical: 20,
        }}
      >
        <MyTextApp
          style={{ ...FONTS.h6, color: colors.title, marginBottom: 5 }}
        >
          Nemo Wallet
        </MyTextApp>
        <MyTextApp style={{ ...FONTS.font, color: colors.text }}>
          App Version 1.0
        </MyTextApp>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navItem: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default SidebarComponent;
