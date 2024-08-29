import * as ProfileActions from "../../../modules/profile/actions";
import * as ProfileReducers from "../../../modules/profile/reducers";

import { COLORS, ICONS, MyTextApp } from "../../../themes/theme";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  getRememberFundPassword,
  getRememberFundPasswordForApprove,
} from "../../../common/utilities";
import { useDispatch, useSelector } from "react-redux";

import ActionModalsComponent from "../../../components/ModalComponent/ActionModalsComponent";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import InputComponent from "../../../components/InputComponent";
import { RESPONSE } from "../../../common/enum";
import Toast from "../../../components/ToastInfo";
import { isEmpty } from "lodash";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function ConfirmGoogleAuthenticatorComponent({
  show,
}: {
  show: any;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [remember, setRemember] = useState(false);
  const [otpSaved, setOtpSave] = useState("");
  const [googleCode, setGoogleCode] = useState("");
  const [pinCode, setPinCode] = useState("");
  const confirm2fa = useSelector(ProfileReducers.confirm2FA);
  const dispatch = useDispatch();
  const dispatchSetConfirm2FA = (request: any) =>
    dispatch(ProfileActions.setConfirm2FA(request));
  useEffect(() => {
    if (!show) {
      setPinCode("");
      setGoogleCode("");
      setOtpSave("");
      return;
    }
    getRememberFundPassword().then((pPin: any) => {
      if (isEmpty(pPin)) {
        pPin = getRememberFundPasswordForApprove();
      }
      setOtpSave(pPin);
    });
  }, [show]);
  const handleConfirm = () => {
    const res: any = {
      otp: null,
      pin: null,
      save_fund_password: false,
    };
    const otp = googleCode;
    const pin = pinCode;
    if (confirm2fa?.action_2fa) {
      if (isEmpty(otp) || otp.length !== 6) {
        Toast.error(t("auth.gg_code_invalid"));
        return;
      }
      res.otp = otp;
    }
    if (confirm2fa?.action_pin) {
      if (isEmpty(otpSaved)) {
        if (isEmpty(pin)) {
          Toast.error(t("auth.pin_code_invalid"));
          return;
        }
        res.pin = pin;
        res.save_fund_password = remember;
      } else {
        res.pin = otpSaved;
      }
    }
    if (confirm2fa?.callbackConfirm2FA) {
      confirm2fa?.callbackConfirm2FA(res, RESPONSE.SUCCESS);
      dispatchSetConfirm2FA(null);
    }
  };

  const view = () => {
    return (
      confirm2fa?.fee_gas ||
      confirm2fa?.methodTx === "approve" ||
      (confirm2fa?.action_pin && isEmpty(otpSaved)) ||
      confirm2fa?.action_2fa
    );
  };

  return (
    <ActionModalsComponent
      modalVisible={show}
      closeModal={() => {
        dispatchSetConfirm2FA(null);
        if (confirm2fa?.callbackConfirm2FA) {
          confirm2fa?.callbackConfirm2FA(null, RESPONSE.ERROR);
        }
      }}
      iconClose
    >
      <View
        style={{
          ...styles.modalContent,
          backgroundColor: colors.card,
          gap: 24,
          width: "90%",
        }}
      >
        <View style={{ position: "relative", width: "100%" }}>
          <MyTextApp
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: colors.title,
              textAlign: "center",
            }}
          >
            {confirm2fa?.action_2fa || confirm2fa?.action_pin
              ? t("auth.authenticator")
              : t("auth.confirmination")}
          </MyTextApp>
        </View>
        {view() && (
          <View style={{ gap: 8, width: "100%" }}>
            {confirm2fa?.fee_gas && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <MyTextApp style={{ color: colors.title }}>
                  {t("wallet.fee_gas")}: 0.06879
                </MyTextApp>
                <Image source={ICONS.cogi} style={{ width: 20, height: 20 }} />
              </View>
            )}
            {confirm2fa?.methodTx === "approve" && (
              <MyTextApp
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  color: COLORS.info,
                  textAlign: "center",
                }}
              >
                {t("auth.approve_for_tx")}
              </MyTextApp>
            )}
            {confirm2fa?.action_pin && isEmpty(otpSaved) && (
              <View style={{ gap: 8 }}>
                <MyTextApp style={{ fontWeight: "bold", color: colors.text }}>
                  {t("auth.pin_code")}:
                </MyTextApp>
                <View
                  style={{
                    ...styles.input,
                    backgroundColor: colors.background,
                  }}
                >
                  <InputComponent
                    // secureTextEntry={!visible}
                    style={{ borderWidth: 0, height: 52, paddingLeft: 0 }}
                    placeholder={t("auth.enter_pin")}
                    placeholderTextColor={COLORS.placeholder}
                    onChangeText={(e: string) => {
                      setPinCode(e);
                    }}
                    height={52}
                    inputPaddingRight={30}
                    showClear={false}
                    type="password"
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setRemember(!remember);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                  }}
                  activeOpacity={0.8}
                >
                  <Icon
                    name={
                      remember ? "checkbox-outline" : "checkbox-blank-outline"
                    }
                    size={20}
                    color={colors.text}
                  />
                  <MyTextApp style={{ color: colors.title }}>
                    {t("auth.remember_pin")}
                  </MyTextApp>
                </TouchableOpacity>
              </View>
            )}
            {confirm2fa?.action_2fa && (
              <View style={{ gap: 8 }}>
                <MyTextApp style={{ fontWeight: "bold", color: colors.text }}>
                  {t("auth.gg_auth_code")}:
                </MyTextApp>
                <InputComponent
                  autoFocus
                  style={{ ...styles.input, borderWidth: 0, height: 52 }}
                  placeholder={t("auth.enter_gg_code")}
                  placeholderTextColor={COLORS.placeholder}
                  onChangeText={(e: string) => {
                    setGoogleCode(e);
                  }}
                  color={colors.text}
                  height={52}
                  maxLength={6}
                  inputPaddingRight={10}
                />
              </View>
            )}
          </View>
        )}
        <ButtonComponent
          title={t("common.confirm")}
          textWeight="bold"
          onPress={handleConfirm}
        />
      </View>
    </ActionModalsComponent>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#00000081",
    padding: 30,
  },
  modalContent: {
    margin: 20,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 20,
    alignItems: "center",
    width: "100%",
    // gap: 24,
  },
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
  },
  closeBtn: {
    position: "absolute",
    right: 0,
    top: 0,
  },
});
