import * as ProfileActions from "../../../../modules/profile/actions";

import { COLORS, IMAGES, MyTextApp } from "../../../../themes/theme";
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  getPinCode,
  saveRememberFundPassword,
  timeStampToTime,
} from "../../../../common/utilities";

import ActionModalsComponent from "../../../../components/ModalComponent/ActionModalsComponent";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import InputComponent from "../../../../components/InputComponent";
import { RESPONSE } from "../../../../common/enum";
import StepIndicator from "react-native-step-indicator";
import { TIME_OTP } from "../../../../common/constants";
import Toast from "../../../../components/ToastInfo";
import { customStyleStep } from "../../../../themes/styleSheet";
import { isEmpty } from "lodash";
import { rpcExecCogiChain } from "../../../../components/RpcExec/toast_chain";
import { useDispatch } from "react-redux";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function PINAuthenticatorComponent({
  onAction,
  setOnAction,
  account,
  createPIN,
  functionCallback = null,
}: {
  onAction: any;
  setOnAction: any;
  account: any;
  createPIN?: boolean;
  functionCallback?: any;
}) {
  const [step, setStep] = useState<any>(createPIN ? 1 : 0);
  // const [visible, setVisible] = useState(false);
  const visible = false;
  const [emailOTP, setEmailOTP] = useState("");
  const [OTP, setOTP] = useState("");
  const [OTPConfirm, setOTPConfirm] = useState("");
  // const [visibleConfirm, setVisibleConfirm] = useState(false);
  const visibleConfirm = false;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const dispatchGetAuthenticators_enabled = () =>
    dispatch(ProfileActions.getAuthenticators_Enabled());
  const listStep = createPIN
    ? [t("auth.login_success"), t("auth.create_pin"), t("auth.completed")]
    : [t("auth.change_pin"), t("auth.completed")];
  const [timeCountDown, setTimeCountDown] = useState<any>(null);
  const timeCDIns = useRef<any>(null);
  const timeout = () => {
    setTimeCountDown((prevTimer: any) => {
      if (prevTimer > 0) {
        return prevTimer - 1;
      } else if (prevTimer === 0) {
        return prevTimer;
      }
    });
  };
  useEffect(() => {
    if (timeCountDown === null) return;
    if (timeCountDown > 0) {
      timeCDIns.current = setTimeout(timeout, 1000);
    }
    return () => {
      clearTimeout(timeCDIns.current);
    };
  }, [timeCountDown]);

  const onGetOTPEmail = () => {
    rpcExecCogiChain({
      method: "account.send_email_otp",
      params: [],
    })
      .then((_) => {
        setTimeCountDown(TIME_OTP);
        Toast.success(t("auth.sent_otp") + account?.email);
      })
      .catch((error: any) => {
        Toast.error(error.message);
      });
  };
  const reset_fund_password = () => {
    if (isEmpty(OTP) || OTP.length < 6) {
      Toast.error(t("auth.min_pin"));
      return;
    }
    if (OTP !== OTPConfirm) {
      Toast.error(t("auth.pin_not_same"));
      return;
    }
    if (isEmpty(emailOTP) || emailOTP.length < 6) {
      Toast.error(t("auth.email_otp_invalid"));
      return;
    }
    const SECRET = getPinCode(OTP);
    rpcExecCogiChain({
      method: "account.reset_fund_password",
      params: [SECRET],
      options: {
        email_otp: emailOTP,
      },
      _2fa: account?.google_two_factor_authentication,
      _pin: false,
      callback: (res: any, flagResponse: any) => {
        if (flagResponse === RESPONSE.SUCCESS) {
          setStep(createPIN ? 2 : 1);
          setTimeCountDown(null);
          saveRememberFundPassword(null);
        } else {
          Toast.error(res.message);
        }
      },
      account,
    });
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
    <ActionModalsComponent
      modalVisible={onAction}
      closeModal={() => setOnAction(false)}
      iconClose
    >
      <View
        style={{
          ...styles.modalContent,
          backgroundColor: colors.card,
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
            {createPIN ? t("auth.create_pin") : t("auth.change_pin")}
          </MyTextApp>
        </View>
        <View style={{ width: "100%" }}>
          <StepIndicator
            stepCount={listStep.length}
            customStyles={customStyleStep}
            currentPosition={step}
            labels={listStep}
            renderLabel={renderLabel}
            // onPress={onStepPress}
          />
        </View>

        {((step === 1 && createPIN) || (step === 0 && !createPIN)) && (
          <View style={{ gap: 24, width: "100%" }}>
            <View style={{ width: "100%", gap: 8 }}>
              <MyTextApp style={{ fontWeight: "bold", color: colors.text }}>
                {createPIN ? t("auth.new_pin") : t("auth.change_pin")}{" "}
              </MyTextApp>
              <InputComponent
                autoFocus
                secureTextEntry={!visible}
                placeholder={t("auth.pin_code") + " (0-9,a-z,A-Z)"}
                placeholderTextColor={COLORS.placeholder}
                onChangeText={(e: string) => {
                  setOTP(e);
                }}
                onSubmitEditing={() => {
                  confirmPIN.focus();
                }}
                returnKeyType="next"
                color={colors.text}
                inputPaddingRight={0}
                type="password"
              />

              <InputComponent
                secureTextEntry={!visibleConfirm}
                placeholder={t("auth.confirm_pin_code") + " (0-9,a-z,A-Z)"}
                placeholderTextColor={COLORS.placeholder}
                onChangeText={(e: string) => {
                  setOTPConfirm(e);
                }}
                onSubmitEditing={() => {
                  OTPCode.focus();
                }}
                ref={(input) => {
                  confirmPIN = input;
                }}
                returnKeyType="next"
                color={colors.text}
                inputPaddingRight={0}
                type="password"
              />
            </View>
            <View style={{ width: "100%", gap: 8 }}>
              <MyTextApp style={{ fontWeight: "bold", color: colors.text }}>
                OTP
              </MyTextApp>
              <View style={styles.input}>
                <TextInput
                  secureTextEntry={!visible}
                  style={{ flex: 1, color: colors.text }}
                  placeholder={t("auth.enter_email_otp")}
                  placeholderTextColor={COLORS.placeholder}
                  keyboardType="numeric"
                  onChangeText={setEmailOTP}
                  ref={(input) => {
                    OTPCode = input;
                  }}
                  returnKeyType="next"
                  onSubmitEditing={reset_fund_password}
                />
                {/* <InputComponent
                  secureTextEntry={!visible}
                  placeholder={t("auth.enter_email_otp")}
                  placeholderTextColor={COLORS.placeholder}
                  keyboardType="numeric"
                  style={{
                    flex: 1,
                    color: colors.text,
                    borderwidth: 0,
                    height: 52,
                  }}
                  onChangeText={(e: string) => setEmailOTP(e)}
                  onSubmitEditing={reset_fund_password}
                  ref={(input) => {
                    OTPCode = input;
                  }}
                  returnKeyType="next"
                  color={colors.text}
                  height={52}
                  showClear={false}
                  inputPaddingRight={0}
                /> */}
                <TouchableOpacity onPress={onGetOTPEmail}>
                  <MyTextApp
                    style={{ fontWeight: "bold", color: colors.title }}
                  >
                    {t("auth.get_otp")}
                  </MyTextApp>
                </TouchableOpacity>
              </View>
              {timeCountDown !== 0 && timeCountDown !== null && (
                <MyTextApp style={{ color: colors.title }}>
                  {t("auth.get_otp_after")} {timeStampToTime(timeCountDown)}.
                </MyTextApp>
              )}
            </View>
            <ButtonComponent
              title={t("auth.next")}
              onPress={reset_fund_password}
            />
          </View>
        )}
        {((step === 2 && createPIN) || (step === 1 && !createPIN)) && (
          <View style={{ width: "100%", alignItems: "center", gap: 24 }}>
            <Image source={IMAGES.success} />
            <MyTextApp
              style={{
                fontWeight: "bold",
                fontSize: 20,
                color: COLORS.success,
                textAlign: "center",
              }}
            >
              {createPIN
                ? t("auth.create_pin_success")
                : t("auth.change_pin_success")}
            </MyTextApp>
            <MyTextApp
              style={{
                color: colors.title,
                textAlign: "center",
              }}
            >
              {t("auth.create_pin_success_descrip")}
            </MyTextApp>
            <ButtonComponent
              title={createPIN ? t("auth.next") : t("common.close")}
              onPress={() => {
                setOnAction(false);
                setStep(0);
                if (functionCallback) {
                  functionCallback({
                    ...account,
                    fund_password: true,
                  });
                }
                dispatchGetAuthenticators_enabled();
              }}
            />
          </View>
        )}
        {/* </ScrollView> */}
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
    width: "90%",
    gap: 24,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.border,
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
});
