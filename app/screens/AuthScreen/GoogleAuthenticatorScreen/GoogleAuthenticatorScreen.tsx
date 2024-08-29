import * as ProfileActions from "../../../modules/profile/actions";

import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, IMAGES, MyTextApp } from "../../../themes/theme";
import React, { useEffect, useState } from "react";
import { useRoute, useTheme } from "@react-navigation/native";

import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import Clipboard from "@react-native-clipboard/clipboard";
import { FLAG_SECURITY } from "../../../common/enum";
import FeatherIcon from "react-native-vector-icons/Feather";
import HeaderBarComponent from "../../../components/HeaderComponent/HeaderComponent";
import Icon from "react-native-vector-icons/Ionicons";
import InputComponent from "../../../components/InputComponent";
import QRCode from "react-native-qrcode-svg";
import StepIndicator from "react-native-step-indicator";
import Toast from "../../../components/ToastInfo";
import { customStyleStep } from "../../../themes/styleSheet";
import { descyptNEMOWallet } from "../../../common/utilities";
import { isEmpty } from "lodash";
import { rpcExecCogiChain } from "../../../components/RpcExec/toast_chain";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

export default function GoogleAuthenticatorScreen({
  navigation,
}: {
  navigation: any;
}) {
  const dispatch = useDispatch();
  const route = useRoute();
  const { flagSecurity }: any = route.params;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [listName, setListName] = useState<any>([]);
  const [step, setStep] = useState<any>(0);
  const [getOtpSecretKey, setGetOtpSecretKey] = useState<any>(null);
  const [qrcodeUrl, setqrCodeUrl] = useState<any>("");
  const [isEmptyVerifyCode, setIsEmptyVerifyCode] = useState(true);
  const [verifyCodeGg, setVerifyCodeGg] = useState<any>("");
  const [titleScreen, setTitleScreen] = useState<any>("");
  const dispatchGetAuthenticators_enabled = () =>
    dispatch(ProfileActions.getAuthenticators_Enabled());

  useEffect(() => {
    if (flagSecurity === FLAG_SECURITY.ACTIVE) {
      setTitleScreen(t("auth.activate_gg_auth"));
      setListName([
        t("auth.download_app"),
        t("auth.scan_qr"),
        t("auth.backup_key"),
        t("auth.activate_gg_auth"),
        t("auth.completed"),
      ]);
    } else if (flagSecurity === FLAG_SECURITY.CHANGE) {
      setTitleScreen(t("auth.change_gg_auth"));
      setListName([
        t("auth.delete_gg_auth"),
        t("auth.scan_qr"),
        t("auth.backup_key"),
        t("auth.activate_gg_auth"),
        t("auth.completed"),
      ]);
    } else {
      setTitleScreen(t("auth.delete_gg_auth"));
      setListName([t("auth.delete_gg_auth"), t("auth.completed")]);
    }
  }, [flagSecurity]);

  useEffect(() => {
    if (step === 1) {
      if (!getOtpSecretKey) {
        rpcExecCogiChain({ method: "account.get_otp_secret_key", params: [] })
          .then((res: any) => {
            setGetOtpSecretKey(res);
            setqrCodeUrl(res.provisioning_uri);
          })
          .catch(() => {
            setGetOtpSecretKey("");
            Toast.error("Get Code is error! Please try again");
          });
      }
    }
  }, [step]);

  const handleChangeVerifyCode = (e: any) => {
    setIsEmptyVerifyCode(!e);
    setVerifyCodeGg(e);
  };

  const update_google_authenticator = (otp_code: any, flag: any) => {
    if (isEmpty(otp_code) || otp_code.length < 6) {
      Toast.error("Google Authenticator Code is invalid!");
      return;
    }
    if (flag === FLAG_SECURITY.DELETE) {
      rpcExecCogiChain({
        method: "account.update_google_authenticator",
        options: { otp_code },
      })
        .then((_) => {
          dispatchGetAuthenticators_enabled();
          flagSecurity === FLAG_SECURITY.DELETE && setStep(4);
          flagSecurity === FLAG_SECURITY.CHANGE && setStep(1);
        })
        .catch((e) => {
          Toast.error(e.message);
        });
    }
    if (flag === FLAG_SECURITY.ACTIVE) {
      rpcExecCogiChain({
        method: "account.update_google_authenticator",
        params: [getOtpSecretKey.secret_key, otp_code],
        // options: { otp_code: otp_code },
      })
        .then((_) => {
          dispatchGetAuthenticators_enabled();
          setStep(4);
        })
        .catch((e) => {
          Toast.error(e.message);
        });
    }
  };

  const renderLabel = ({
    position,
    label,
    currentPosition,
  }: {
    position: number;
    stepStatus: string;
    label: string;
    currentPosition: number;
  }) => {
    return (
      <MyTextApp
        style={
          position === currentPosition
            ? styles.stepLabelSelected
            : styles.stepLabel
        }
      >
        {label}
      </MyTextApp>
    );
  };

  return (
    <>
      <HeaderBarComponent leftIcon={"back"} title={titleScreen} />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: colors.background,
        }}
      >
        <View style={{ flex: 1, gap: 40, padding: 16 }}>
          <View style={{ width: "100%" }}>
            <StepIndicator
              stepCount={listName.length}
              customStyles={customStyleStep}
              currentPosition={step}
              labels={listName}
              renderLabel={renderLabel}
            />
          </View>
          {step === 0 &&
            (flagSecurity === FLAG_SECURITY.CHANGE ||
              flagSecurity === FLAG_SECURITY.DELETE) && (
              <View style={{ gap: 40 }}>
                <View style={{ gap: 24 }}>
                  <MyTextApp
                    style={{
                      color: colors.title,
                      fontSize: 16,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {t("auth.delete_gg_auth")}
                  </MyTextApp>
                  <View>
                    <MyTextApp style={{ color: colors.title }}>
                      {t("auth.verification_codes")}:
                    </MyTextApp>
                    <View
                      style={{
                        ...styles.input,
                        backgroundColor: colors.background,
                      }}
                    >
                      {/* <TextInput
                        style={{ flex: 1, color: colors.title }}
                        placeholder={t("auth.verify_code_gg")}
                        placeholderTextColor={COLORS.placeholder}
                        keyboardType="numeric"
                        onChangeText={setVerifyCodeGg}
                      /> */}
                      <InputComponent
                        style={{
                          flex: 1,
                          color: colors.title,
                          height: 52,
                          borderWidth: 0,
                        }}
                        placeholder={t("auth.verify_code_gg")}
                        placeholderTextColor={COLORS.placeholder}
                        keyboardType="numeric"
                        onChangeText={setVerifyCodeGg}
                        height={52}
                      />
                    </View>
                    <MyTextApp style={{ color: colors.title }}>
                      {t("auth.enter_code_gg")}
                    </MyTextApp>
                  </View>
                </View>
                <ButtonComponent
                  title={t("auth.next")}
                  onPress={() => {
                    update_google_authenticator(
                      verifyCodeGg,
                      FLAG_SECURITY.DELETE,
                    );
                  }}
                />
              </View>
            )}
          {step === 0 && flagSecurity === FLAG_SECURITY.ACTIVE && (
            <View style={{ gap: 40 }}>
              <View style={{ gap: 24 }}>
                <MyTextApp
                  style={{
                    color: colors.title,
                    fontSize: 16,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {t("auth.download_install_app")}
                </MyTextApp>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    style={styles.downloadItem}
                    onPress={async () =>
                      await Linking.openURL(
                        "https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8",
                      )
                    }
                  >
                    <Icon name="logo-apple" size={36} color={colors.title} />
                    <MyTextApp
                      style={{
                        color: colors.title,
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {t("auth.download_from")}
                      {"\n"}Apple Store
                    </MyTextApp>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.downloadItem}
                    onPress={async () =>
                      await Linking.openURL(
                        "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2",
                      )
                    }
                  >
                    <Icon
                      name="logo-google-playstore"
                      size={36}
                      color={colors.title}
                    />
                    <MyTextApp
                      style={{
                        color: colors.title,
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {t("auth.download_from")}
                      {"\n"}Google Play
                    </MyTextApp>
                  </TouchableOpacity>
                </View>
              </View>
              <ButtonComponent
                title={t("auth.next")}
                onPress={() => {
                  setStep(+1);
                }}
              />
            </View>
          )}
          {step === 1 && (
            <View style={{ gap: 40 }}>
              <View style={{ gap: 24 }}>
                <MyTextApp
                  style={{
                    color: colors.title,
                    fontSize: 16,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {t("auth.scan_qr_auth")}
                </MyTextApp>
                <View style={{ alignItems: "center", gap: 24 }}>
                  {qrcodeUrl ? (
                    <View
                      style={{
                        width: 200,
                        height: 200,
                        backgroundColor: COLORS.white,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <QRCode
                        value={qrcodeUrl}
                        size={180}
                        color="black"
                        backgroundColor="white"
                      />
                    </View>
                  ) : (
                    <View style={{ flex: 1 }}>
                      <ActivityIndicator
                        size={"large"}
                        color={colors.primary}
                      />
                    </View>
                  )}
                  <View style={{ gap: 8, width: "100%" }}>
                    <TouchableOpacity
                      style={styles.copy}
                      onPress={() => {
                        Clipboard.setString(
                          descyptNEMOWallet(getOtpSecretKey?.secret_key),
                        );
                        Toast.success(t("copied"));
                      }}
                    >
                      <MyTextApp style={{ color: colors.title }}>
                        {descyptNEMOWallet(getOtpSecretKey?.secret_key)}
                      </MyTextApp>
                      <FeatherIcon name="copy" size={16} color={colors.title} />
                    </TouchableOpacity>
                    <MyTextApp
                      style={{ color: colors.text, textAlign: "center" }}
                    >
                      {t("auth.cannot_scan")}
                    </MyTextApp>
                  </View>
                </View>
              </View>
              <View style={{ gap: 16 }}>
                <ButtonComponent
                  title={t("auth.next")}
                  onPress={() => {
                    setStep(step + 1);
                  }}
                  color={getOtpSecretKey === null && COLORS.disabledBtn}
                  textColor={getOtpSecretKey === null && COLORS.descriptionText}
                  disabled={getOtpSecretKey === null}
                />
                <ButtonComponent
                  title={t("common.back")}
                  color={COLORS.disabledBtn}
                  borderColor={COLORS.disabledBtn}
                  onPress={() => {
                    setStep(step - 1);
                  }}
                />
              </View>
            </View>
          )}
          {step === 2 && (
            <View style={{ gap: 40 }}>
              <View style={{ gap: 24 }}>
                <MyTextApp
                  style={{
                    color: colors.title,
                    fontSize: 16,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {t("auth.store_key_safe")}
                </MyTextApp>
                <View style={{ alignItems: "center", gap: 24 }}>
                  <Image
                    source={IMAGES.processing}
                    style={{ width: 200, height: 200 }}
                    resizeMode="contain"
                  />
                  <View style={{ gap: 8, width: "100%" }}>
                    <TouchableOpacity
                      style={styles.copy}
                      onPress={() => {
                        Clipboard.setString(
                          descyptNEMOWallet(getOtpSecretKey?.secret_key),
                        );
                        Toast.success(t("copied"));
                      }}
                    >
                      <MyTextApp style={{ color: colors.title }}>
                        {descyptNEMOWallet(getOtpSecretKey?.secret_key)}
                      </MyTextApp>
                      <FeatherIcon name="copy" size={16} color={colors.title} />
                    </TouchableOpacity>
                    <MyTextApp style={{ color: colors.text }}>
                      {t("auth.key_safe_descrip")}
                    </MyTextApp>
                  </View>
                </View>
              </View>
              <View style={{ gap: 16 }}>
                <ButtonComponent
                  title={t("auth.next")}
                  onPress={() => {
                    setStep(step + 1);
                  }}
                />
                <ButtonComponent
                  title={t("common.back")}
                  color={COLORS.disabledBtn}
                  borderColor={COLORS.disabledBtn}
                  onPress={() => {
                    setStep(step - 1);
                  }}
                />
              </View>
            </View>
          )}
          {step === 3 && (
            <View style={{ gap: 40 }}>
              <View style={{ gap: 24 }}>
                <MyTextApp
                  style={{
                    color: colors.title,
                    fontSize: 16,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {t("auth.active_auth_verify")}
                </MyTextApp>
                <View>
                  <MyTextApp style={{ color: colors.title }}>
                    {t("auth.verification_codes")}:
                  </MyTextApp>
                  <View
                    style={{
                      ...styles.input,
                      backgroundColor: colors.background,
                    }}
                  >
                    {/* <TextInput
                      style={{ flex: 1, color: colors.title }}
                      placeholder={t("auth.verify_code_gg")}
                      placeholderTextColor={COLORS.placeholder}
                      keyboardType="numeric"
                      onChangeText={handleChangeVerifyCode}
                    /> */}
                    <InputComponent
                      style={{ flex: 1, height: 52, borderWidth: 0 }}
                      placeholder={t("auth.verify_code_gg")}
                      placeholderTextColor={COLORS.placeholder}
                      keyboardType="numeric"
                      onChangeText={handleChangeVerifyCode}
                      height={52}
                    />
                  </View>
                  <MyTextApp style={{ color: colors.title }}>
                    {t("auth.enter_code_gg")}
                  </MyTextApp>
                </View>
              </View>
              <View style={{ gap: 16 }}>
                <ButtonComponent
                  title={t("auth.next")}
                  color={isEmptyVerifyCode && COLORS.disabledBtn}
                  textColor={isEmptyVerifyCode && COLORS.descriptionText}
                  disabled={isEmptyVerifyCode}
                  onPress={() => {
                    update_google_authenticator(
                      verifyCodeGg,
                      FLAG_SECURITY.ACTIVE,
                    );
                  }}
                />
                <ButtonComponent
                  title={t("common.back")}
                  color={COLORS.disabledBtn}
                  borderColor={COLORS.disabledBtn}
                  onPress={() => {
                    setStep(step - 1);
                  }}
                />
              </View>
            </View>
          )}
          {(step === 4 ||
            (step === 4 && flagSecurity === FLAG_SECURITY.DELETE)) && (
            <View style={{ width: "100%", alignItems: "center", gap: 24 }}>
              <Image
                source={IMAGES.success}
                style={{ width: 200, height: 200 }}
                resizeMode="contain"
              />
              <MyTextApp
                style={{
                  fontWeight: "bold",
                  fontSize: 20,
                  color: COLORS.success,
                  textAlign: "center",
                }}
              >
                {t("success")}
              </MyTextApp>
              <MyTextApp
                style={{
                  color: colors.title,
                  textAlign: "center",
                }}
              >
                {flagSecurity === FLAG_SECURITY.DELETE
                  ? t("auth.delete_auth_success_descrip")
                  : t("auth.create_auth_success_descrip")}
              </MyTextApp>
              <ButtonComponent
                title={t("common.close")}
                onPress={() => navigation.navigate("SecurityScreen")}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.divider,
    width: "100%",
    paddingHorizontal: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 8,
  },
  copy: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: 8,
    width: "100%",
  },
  stepLabel: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
    color: COLORS.descriptionText,
  },
  stepLabelSelected: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
    color: COLORS.primary,
  },
  downloadItem: {
    width: "47%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.divider,
    paddingVertical: 30,
    borderRadius: 20,
    gap: 10,
  },
});
