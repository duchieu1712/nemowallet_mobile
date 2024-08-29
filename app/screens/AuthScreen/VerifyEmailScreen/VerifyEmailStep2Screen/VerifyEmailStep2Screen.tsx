import * as AccountActions from "../../../../modules/account/actions";

import { COLORS, FONTS, MyTextApp } from "../../../../themes/theme";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useRoute, useTheme } from "@react-navigation/native";

import AuthLayout from "../../../../layout/AuthLayout";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import ImageFocusComponent from "../../../../components/ImageComponent/ImageFocusComponent";
import InputComponent from "../../../../components/InputComponent";
import Toast from "../../../../components/ToastInfo";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

export default function VerifyEmailStep2Screen({
  navigation,
}: {
  navigation: any;
}) {
  const { t } = useTranslation();
  const timeDown = 60 * 3;
  const route = useRoute();
  const { email, _gid_uat_interaction, signup, isChangePW }: any = route.params;
  const [isEmpty, setIsEmpty] = useState(true);
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(timeDown);
  const [onProcessing, setOnProcessing] = useState(false);
  const { colors } = useTheme();

  const dispatch = useDispatch();
  const dispatchSetProccessing = (pro: any) =>
    dispatch(AccountActions.setProccessing(pro));

  useEffect(() => {
    dispatchSetProccessing(onProcessing);
  }, [onProcessing]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    if (timer === 0) {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  const handleCode = (e: any) => {
    setIsEmpty(!e);
    setCode(e);
  };

  const handleNext = () => {
    setOnProcessing(true);
    if (signup) {
      fetch(
        `${process.env.LINK_OIDC}/api/v1/interaction/${_gid_uat_interaction}/signup/verify-register-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            verification_code: code.trim(),
          }),
        },
      )
        .then(async (res) => await res.json())
        .then((response) => {
          setOnProcessing(false);
          if (response?.error?.message) {
            Toast.error(response.error.message);
          } else {
            navigation.replace("SignUpScreen", {
              email,
              _gid_uat_interaction,
            });
          }
        })
        .catch((e) => {
          setOnProcessing(false);
          Toast.error(e.message);
        });
    } else {
      fetch(
        `${process.env.LINK_OIDC}/api/v1/interaction/${_gid_uat_interaction}/forgot-password/verify-verification-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            verification_code: code.trim(),
          }),
        },
      )
        .then(async (res) => await res.json())
        .then((response) => {
          setOnProcessing(false);
          if (response?.error?.message) {
            Toast.error(response.error.message);
          } else {
            navigation.replace("ResetPasswordScreen", {
              email,
              _gid_uat_interaction,
              isChangePW,
            });
          }
        })
        .catch((e) => {
          setOnProcessing(false);
          Toast.error(e.message);
        });
    }
  };

  const resendVerify = () => {
    if (signup) {
      fetch(
        `${process.env.LINK_OIDC}/api/v1/interaction/${_gid_uat_interaction}/signup/send-register-email-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.toLowerCase(),
          }),
        },
      )
        .then(async (res) => await res.json())
        .then((response) => {
          if (response?.error?.message) {
            Toast.error(response.error.message);
          } else {
            Toast.success(t("auth.resend_otp_success"));
          }
        });
    } else {
      fetch(
        `${process.env.LINK_OIDC}/api/v1/interaction/${_gid_uat_interaction}/forgot-password/send-verification-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.toLowerCase(),
          }),
        },
      )
        .then(async (res) => await res.json())
        .then((response) => {
          if (response?.error?.message) {
            Toast.error(response.error.message);
          } else {
            Toast.success(t("auth.resend_otp_success"));
          }
        });
    }
  };

  const formatTime = (time: any) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <AuthLayout
      back={true}
      title={false}
      navigation={navigation}
      isChangePW={isChangePW}
    >
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            width: "100%",
            alignItems: "center",
            marginTop: 40,
          }}
        >
          <ImageFocusComponent />
          <MyTextApp
            style={{ ...FONTS.h2, color: colors.title, marginBottom: 35 }}
          >
            {t("auth.verification")}
          </MyTextApp>
          <View style={{ gap: 24 }}>
            <InputComponent
              value={email}
              editable={false}
              color={colors.text}
            />
            <View style={{ width: "100%" }}>
              <View style={styles.input}>
                {/* <TextInput
                  style={{ flex: 1, color: colors.text }}
                  placeholder={t("auth.enter_verify")}
                  placeholderTextColor={COLORS.placeholder}
                  onChangeText={handleCode}
                  value={code}
                  keyboardType="numeric"
                  onSubmitEditing={() => handleNext()}
                /> */}
                <InputComponent
                  style={{ flex: 1, height: 52, borderWidth: 0 }}
                  color={colors.text}
                  height={52}
                  placeholder={t("auth.enter_verify")}
                  placeholderTextColor={COLORS.placeholder}
                  onChangeText={handleCode}
                  value={code}
                  keyboardType="numeric"
                  onSubmitEditing={() => {
                    if (isEmpty) {
                      handleNext();
                    }
                  }}
                />
                <MyTextApp style={{ color: colors.text }}>
                  {formatTime(timer)}
                </MyTextApp>
              </View>

              <TouchableOpacity
                onPress={() => {
                  resendVerify();
                  setTimer(timeDown);
                }}
                disabled={timer > 0}
              >
                <MyTextApp
                  style={{
                    ...FONTS.font,
                    color: timer > 0 ? colors.text : colors.title,
                    textAlign: "center",
                    marginBottom: 35,
                    textDecorationLine: "underline",
                    lineHeight: 18,
                  }}
                >
                  {t("auth.resend_verify")}
                </MyTextApp>
              </TouchableOpacity>
            </View>
          </View>

          <ButtonComponent
            title={t("auth.next")}
            style={{ ...styles.button, marginBottom: 50 }}
            color={isEmpty && COLORS.disabledBtn}
            textColor={isEmpty && COLORS.descriptionText}
            disabled={isEmpty}
            onPress={() => {
              handleNext();
            }}
            onProcessing={onProcessing}
          />
        </View>
        {!isChangePW && (
          <View
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <MyTextApp
              style={{
                ...FONTS.font,
                color: colors.title,
              }}
            >
              {t("auth.have_account")}
            </MyTextApp>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignInScreen")}
            >
              <MyTextApp
                style={{
                  fontWeight: "bold",
                  color: colors.title,
                }}
              >
                {" "}
                {t("auth.sign_in")}
              </MyTextApp>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.border,
    color: COLORS.white,
    width: "100%",
    marginBottom: 18,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 16,
  },
  button: {
    width: "100%",
  },
});
