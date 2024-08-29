import * as AccountReducers from "../../../modules/account/reducers";
import * as ProfileActions from "../../../modules/profile/actions";

import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import AccountLayout from "../../../layout/AccountLayout";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import { FLAG_SECURITY } from "../../../common/enum";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { MyTextApp } from "../../../themes/theme";
import PINAuthenticator from "./Component/SecurityPINComponent";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function SecurityScreen({ navigation }: { navigation: any }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const account = useSelector(AccountReducers.dataAccount);
  const [onActionPINAuthenticator, setOnActionPINAuthenticator] =
    useState(false);
  const dispatchGetAuthenticatorsEnabled = () =>
    dispatch(ProfileActions.getAuthenticators_Enabled());
  useEffect(() => {
    if (account) {
      dispatchGetAuthenticatorsEnabled();
    }
  }, [account]);
  return (
    <AccountLayout title={t("account.security")}>
      <View style={styles.container}>
        <View style={{ gap: 16 }}>
          <MyTextApp style={{ color: colors.text }}>{t("auth.2fa")}</MyTextApp>
          <View style={styles.content}>
            <Icon
              name="key-variant"
              size={24}
              color={colors.title}
              style={{ marginTop: 10 }}
            />
            <View style={styles.groupText}>
              <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
                {t("auth.gg_auth")}
              </MyTextApp>
              <MyTextApp
                style={{ color: colors.text, fontSize: 12, lineHeight: 18 }}
              >
                {t("auth.gg_auth_descrip")}
              </MyTextApp>
            </View>
            {account.google_two_factor_authentication ? (
              <View style={{ gap: 8 }}>
                <ButtonComponent
                  title={t("common.change")}
                  width={108}
                  color="transparent"
                  borderColor={colors.title}
                  textColor={colors.title}
                  onPress={() =>
                    navigation.navigate("GoogleAuthenticatorScreen", {
                      flagSecurity: FLAG_SECURITY.CHANGE,
                    })
                  }
                />
                <ButtonComponent
                  title={t("common.delete")}
                  width={108}
                  color="transparent"
                  borderColor={colors.title}
                  textColor={colors.title}
                  onPress={() =>
                    navigation.navigate("GoogleAuthenticatorScreen", {
                      flagSecurity: FLAG_SECURITY.DELETE,
                    })
                  }
                />
              </View>
            ) : (
              <ButtonComponent
                title={t("common.active")}
                width={108}
                color="transparent"
                borderColor={colors.title}
                textColor={colors.title}
                onPress={() =>
                  navigation.navigate("GoogleAuthenticatorScreen", {
                    flagSecurity: FLAG_SECURITY.ACTIVE,
                  })
                }
              />
            )}
          </View>
        </View>
        <View style={{ gap: 16 }}>
          <MyTextApp style={{ color: colors.text }}>
            {t("account.advanced_secu")}
          </MyTextApp>
          <View style={styles.content}>
            <Icon
              name="form-textbox-password"
              size={24}
              color={colors.title}
              style={{ marginTop: 10 }}
            />
            <View style={styles.groupText}>
              <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
                {t("auth.pin_code")}
              </MyTextApp>
              <MyTextApp
                style={{ color: colors.text, fontSize: 12, lineHeight: 18 }}
              >
                {t("auth.pin_code_descrip")}
              </MyTextApp>
            </View>
            <ButtonComponent
              title={
                account.fund_password ? t("common.change") : t("common.active")
              }
              width={108}
              color="transparent"
              borderColor={colors.title}
              textColor={colors.title}
              onPress={() => {
                setOnActionPINAuthenticator(true);
              }}
            />
          </View>
        </View>
        <PINAuthenticator
          onAction={onActionPINAuthenticator}
          setOnAction={setOnActionPINAuthenticator}
          account={account}
          createPIN={!account?.fund_password}
        />
      </View>
    </AccountLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  content: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  groupText: {
    width: "60%",
    gap: 4,
  },
});
