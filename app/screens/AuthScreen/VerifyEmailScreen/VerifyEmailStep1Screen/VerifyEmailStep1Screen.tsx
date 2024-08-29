import * as AccountActions from "../../../../modules/account/actions";
import * as yup from "yup";

import { COLORS, FONTS, MyTextApp } from "../../../../themes/theme";
import {
  PROD,
  QUERY_DEFAULT_STATE_GID,
  URI_DIRECT,
} from "../../../../common/constants";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  getCodeChallenge,
  getCodeVerifier,
} from "../../../../modules/account/utilities";
import { useRoute, useTheme } from "@react-navigation/native";

import AuthLayout from "../../../../layout/AuthLayout";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import { Formik } from "formik";
import ImageFocusComponent from "../../../../components/ImageComponent/ImageFocusComponent";
import InputComponent from "../../../../components/InputComponent";
import Toast from "../../../../components/ToastInfo";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// import CheckBox from "@react-native-community/checkbox";
// import * as Animatable from "react-native-animatable";
// import { useTheme } from "@react-navigation/native";
// import FeatherIcon from "react-native-vector-icons/Feather";

// import ButtonComponent from "../../components/customButton";
// import { GlobalStyleSheet } from "../../constants/styleSheet";
// import LinearGradient from "react-native-linear-gradient";

// import { signIn } from '../../modules/account/utilities';

export default function VerifyEmailStep1Screen({
  navigation,
}: {
  navigation: any;
}) {
  const { t } = useTranslation();
  const route = useRoute();
  const { signup, username, isChangePW }: any = route?.params;
  // const [email, setEmail] = useState(username);
  // const [isEmpty, setIsEmpty] = useState(!email);
  const { colors } = useTheme();
  const [onProcessing, setOnProcessing] = useState(false);

  const dispatch = useDispatch();
  const dispatchSetProccessing = (pro: any) =>
    dispatch(AccountActions.setProccessing(pro));

  useEffect(() => {
    dispatchSetProccessing(onProcessing);
  }, [onProcessing]);

  const send_register_email_code = async (email: any) => {
    setOnProcessing(true);
    const codeVerifier = getCodeVerifier();
    const codeChallenge = await getCodeChallenge(codeVerifier);
    const url = `${process.env.LINK_OIDC}/auth?client_id=${
      process.env.AUTH0_ID
    }&response_type=code&redirect_uri=${
      process.env.DOMAIN_PUBLIC + URI_DIRECT
    }&scope=openid%20email%20profile&state=${QUERY_DEFAULT_STATE_GID}&code_challenge_method=${
      process.env.CHALLENGE_METHOD
    }&code_challenge=${codeChallenge}`;
    fetch(url)
      .then((res) => res.url)
      .then((response) => {
        const link = PROD
          ? "https://account.nemoverse.io/interaction/"
          : "https://account-uat.nemoverse.io/interaction/";
        let t = response.replace(link, "");
        t = t.replace("select-account?", "");
        t = t.replace("login?", "");
        const _gid_uat_interaction = t?.split("/client_id=nemo")[0];
        if (signup) {
          fetch(
            `${process.env.LINK_OIDC}/api/v1/interaction/${_gid_uat_interaction}/signup/send-register-email-code`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: email.trim().toLowerCase(),
              }),
            },
          )
            .then(async (res) => await res.json())
            .then((response) => {
              setOnProcessing(false);
              if (response?.error?.message) {
                Toast.error(response.error.message);
              } else {
                navigation.navigate("VerifyEmailStep2Screen", {
                  email: email.trim(),
                  _gid_uat_interaction,
                  signup,
                  isChangePW,
                });
              }
            })
            .catch((e) => {
              Toast.error(e.message);
            });
        }
        // Change Password
        else {
          setOnProcessing(false);
          fetch(
            `${process.env.LINK_OIDC}/api/v1/interaction/${_gid_uat_interaction}/forgot-password/send-verification-code`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: email.trim().toLowerCase(),
              }),
            },
          )
            .then(async (res) => await res.json())
            .then((response) => {
              if (response?.error?.message) {
                setOnProcessing(false);
                Toast.error(response.error.message);
              } else {
                setOnProcessing(false);
                navigation.navigate("VerifyEmailStep2Screen", {
                  email: email.trim(),
                  _gid_uat_interaction,
                  signup,
                  isChangePW,
                });
              }
            })
            .catch((e) => {
              Toast.error(e.message);
              setOnProcessing(false);
            });
        }
      })
      .catch((e) => {
        Toast.error(e.message);
        setOnProcessing(false);
      });
  };
  // const handleEmail = (e: any) => {
  //   setEmail(e);
  //   setIsEmpty(!e);
  // };
  const schema = yup.object().shape({
    email: yup
      .string()
      .email(t("auth.email_number_invalid"))
      .required(t("auth.is_required")),
  });

  return (
    <AuthLayout
      back={false}
      title={false}
      navigation={navigation}
      isChangePW={isChangePW}
    >
      <View style={styles.container}>
        <Formik
          initialValues={{
            email: username || "",
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            send_register_email_code(values.email);
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isValid,
            dirty,
          }) => (
            <View
              style={{
                flex: 1,
                width: "100%",
                alignItems: "center",
                marginTop: 40,
                gap: 20,
              }}
            >
              <ImageFocusComponent />
              <MyTextApp
                style={{ ...FONTS.h2, color: colors.title, marginBottom: 35 }}
              >
                {signup ? t("auth.sign_up") : t("auth.change_pw")}
              </MyTextApp>
              <View style={styles.formGroup}>
                <InputComponent
                  autoFocus
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  placeholder={t("auth.enter_email")}
                  onSubmitEditing={() => {
                    if (!isValid) {
                      return;
                    }
                    handleSubmit();
                  }}
                  editable={!isChangePW}
                />
                {errors.email && touched.email ? (
                  <MyTextApp style={{ color: COLORS.orange, fontSize: 12 }}>
                    {errors.email}
                  </MyTextApp>
                ) : null}
              </View>

              <ButtonComponent
                title={t("auth.send_verify")}
                style={styles.button}
                disabled={!(isValid && values.email)}
                onPress={handleSubmit}
                onProcessing={onProcessing}
              />
            </View>
          )}
        </Formik>
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
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  button: {
    width: "100%",
    marginBottom: 60,
  },
  disabledBtn: {
    width: "100%",
    marginBottom: 60,
    backgroundColor: COLORS.disabledBtn,
    color: COLORS.placeholder,
  },
  formGroup: {
    width: "100%",
    gap: 8,
  },
});
