import * as AccountActions from "../../../modules/account/actions";
import * as WalletActions from "../../../modules/wallet/actions";
import * as yup from "yup";

import { COLORS, FONTS, MyTextApp } from "../../../themes/theme";
import { LOCALE_STORAGE, RESPONSE, SIGN_IN_ERROR } from "../../../common/enum";
import React, { createRef, useEffect, useState } from "react";
import {
  StyleSheet,
  type TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getKey, saveAccount } from "../../../modules/account/utilities";

import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthLayout from "../../../layout/AuthLayout";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import { ClassWithStaticMethod } from "../../../common/static";
import { Formik } from "formik";
import ImageFocusComponent from "../../../components/ImageComponent/ImageFocusComponent";
import InputComponent from "../../../components/InputComponent";
import Toast from "../../../components/ToastInfo";
import { customBase64Encode } from "../../../common/utilities";
import dayjs from "dayjs";
import { rpcExecCogiChainNotEncodeParam } from "../../../components/RpcExec/toast_chain";
import { useDispatch } from "react-redux";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { navigationReplaceAll } from "../../../Navigations/Routes";

export default function SignInScreen({ navigation }: { navigation: any }) {
  const { t } = useTranslation();
  // const [isEmpty, setIsEmpty] = useState(true);
  // const [formValues, setFormValues] = useState<any>();
  // const [formValues, setFormValues] = useState({
  //   emailOrPhoneNumber: "tienhuynhvinhan1999@gmail.com",
  //   password: "12345678",
  // });
  const [onProcessing, setOnProcessing] = useState(false);

  const { colors } = useTheme();
  // const handleChangeText = (field: any, value: any) => {
  //   setFormValues((obj: any) => ({
  //     ...obj,
  //     [field]: value,
  //   }));
  //   setIsEmpty(
  //     formValues.emailOrPhoneNumber && formValues.password ? false : true
  //   );
  // };

  const dispatch = useDispatch();
  const dispatchSetProccessing = (pro: any) =>
    dispatch(AccountActions.setProccessing(pro));
  const dispatchAccount = (account: any) =>
    dispatch(AccountActions.dataAccountResponse(account));
  const dispatchConnect = () => dispatch(WalletActions.connect());

  // useEffect(() => {
  //   if (!initAccountSignIn) return;
  //   setFormValues({
  //     emailOrPhoneNumber: initAccountSignIn.emailOrPhone,
  //     password: initAccountSignIn.pw,
  //   });
  // }, [initAccountSignIn]);

  // useEffect(() => {
  //   if (!initAccountSignIn || !formValues) return;
  //   dispatchSetInitAccountSignIn(null);
  //   signIn();
  // }, [formValues]);

  useEffect(() => {
    dispatchSetProccessing(onProcessing);
  }, [onProcessing]);

  const submitSignIn = (values: any) => {
    signIn(values);
  };

  const schema = yup.object().shape({
    emailOrPhoneNumber: yup
      .string()
      .matches(/^(?:\d{10}|\S+@\S+\.\S+)$/, t("auth.email_number_invalid"))
      .required(t("auth.is_required")),
    password: yup
      .string()
      .min(8, t("auth.min_password"))
      .required(t("auth.is_required")),
  });

  const signIn = async (formValues: any): Promise<any> => {
    setOnProcessing(true);
    const data: any = {
      grant_type: "password",
      client_id: process.env.AUTH0_ID,
      username: formValues.emailOrPhoneNumber.trim(),
      password: formValues.password.trim(),
      scope: process.env.SCOPE,
    };
    fetch(`${process.env.LINK_OIDC}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          customBase64Encode(
            process.env.AUTH0_ID + ":" + process.env.AUTH0_SECRET,
          ),
      },
      body: new URLSearchParams(data).toString(),
    })
      .then(async (data) => await data.json())
      .then(function (response) {
        if (response.error_description) {
          setOnProcessing(false);
          if (response.code == SIGN_IN_ERROR.UNVERIFIED_EMAIL) {
            Toast.error(t("auth.unverified_email"));
            navigation.navigate("VerifyEmailStep1Screen", {
              signup: true,
              username: formValues.emailOrPhoneNumber.trim(),
            });
            return;
          }
          if (response.code == SIGN_IN_ERROR.MISSING_PHONE_EMAIL) {
            Toast.error(t("auth.missing_phone_call"));
            return;
          }
          if (response.code == SIGN_IN_ERROR.MISSING_PASSWORD) {
            Toast.error(t("auth.missing_password"));
            return;
          }
          if (response.code == SIGN_IN_ERROR.INVALID_EMAIL_PASSWORD) {
            Toast.error(t("auth.invalid_email_password"));
            return;
          }
          if (response.code == SIGN_IN_ERROR.INVALID_EMAIL_PHONE) {
            Toast.error(t("auth.invalid_email_phone"));
            return;
          }
          if (response.code == SIGN_IN_ERROR.UNVERIFIED_PHONE) {
            Toast.error(t("auth.unverified_phone"));
            return;
          }
          if (response.code == SIGN_IN_ERROR.SCHEDULE_DELETION) {
            Toast.error(t("auth.schedule_deletion"));
            return;
          }
          Toast.error(response.error_description);
          return;
        }
        makeTokenRequest(response);
      })
      .catch(function (error) {
        setOnProcessing(false);
        Toast.error(error.message);
        console.log(error);
      });
    return true;
  };

  const makeTokenRequest = async (response: any) => {
    try {
      const keyLogin = await getKey();
      const content: any = await rpcExecCogiChainNotEncodeParam({
        method: "nemo_id.login_mb",
        params: [
          {
            public_key: keyLogin?.publicKeyBytes,
            access_token: response.access_token,
            token_type: "Bearer",
          },
        ],
      });
      if (!content.error) {
        if (content.google_two_factor_authentication) {
          rpcExecCogiChainNotEncodeParam({
            method: "nemo_id.signature",
            params: [
              {
                public_key: keyLogin?.publicKeyBytes,
                account: content.nemo_address,
                sub: content.sub,
              },
            ],
            _2fa: content.google_two_factor_authentication,
            callback: (contentAuth_info: any, flagResponse: any) => {
              setOnProcessing(false);
              if (flagResponse == RESPONSE.ERROR) {
                Toast.error(contentAuth_info.message);
                return;
              }
              const ress = {
                ...content,
                ...contentAuth_info,
                accessTokenExpires:
                  dayjs().valueOf() + response.expires_in * 1000,
                publicKeyBytes: keyLogin?.publicKeyBytes,
                privateKeyBytes: keyLogin?.privateKeyBytes,
                // code_verifier: codeLogin.codeVerifier,
                // code: codeGID,
              };

              saveAccount(ress);
              dispatchAccount(ress);
              ClassWithStaticMethod.SET_USER_INFO(ress);
              dispatchConnect();
              AsyncStorage.setItem(LOCALE_STORAGE.IS_LOGINED, "true");
              navigationReplaceAll("DrawerNavigation");
              // Navigation
              // navigation.pop();
            },
          });
        } else {
          setOnProcessing(false);
          const ress = {
            ...content,
            accessTokenExpires: dayjs().valueOf() + response.expires_in * 1000,
            publicKeyBytes: keyLogin?.publicKeyBytes,
            privateKeyBytes: keyLogin?.privateKeyBytes,
            // code_verifier: codeLogin.codeVerifier,
            // code: codeGID,
          };
          saveAccount(ress);
          dispatchAccount(ress);
          ClassWithStaticMethod.SET_USER_INFO(ress);
          dispatchConnect();
          AsyncStorage.setItem(LOCALE_STORAGE.IS_LOGINED, "true");
          navigationReplaceAll("DrawerNavigation");
          // Navigation
          // navigation.pop();
        }
      } else {
        setOnProcessing(false);
        AsyncStorage.setItem(LOCALE_STORAGE.ACCOUNT, "");
        dispatchAccount(null);
        Toast.error(content.error_description);
        ClassWithStaticMethod.SET_USER_INFO(null);
      }
    } catch (e: any) {
      setOnProcessing(false);
      Toast.error(e.message);
      ClassWithStaticMethod.SET_USER_INFO(null);
    }
  };

  const pwRef = createRef<TextInput>();

  return (
    <AuthLayout back={false} close={false} title="" navigation={navigation}>
      <View style={styles.container}>
        <Formik
          // initialValues={{
          //   emailOrPhoneNumber: "annemagrath@mphaotu.com",
          //   password: "Gihot@123",
          // }}
          initialValues={{
            emailOrPhoneNumber: "",
            password: "",
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            submitSignIn(values);
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
          }) => {
            return (
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  alignItems: "center",
                  marginTop: 40,
                  gap: 16,
                }}
              >
                <ImageFocusComponent />
                <MyTextApp
                  style={{ ...FONTS.h2, color: colors.title, marginBottom: 35 }}
                >
                  {t("auth.sign_in")}
                </MyTextApp>
                <View style={{ gap: 24 }}>
                  <View style={styles.formGroup}>
                    <InputComponent
                      autoFocus
                      placeholder={t("auth.enter_email_phone")}
                      // value={formValues?.emailOrPhoneNumber}
                      // onChangeText={(e: any) =>
                      //   handleChangeText("emailOrPhoneNumber", e)
                      // }
                      onChangeText={handleChange("emailOrPhoneNumber")}
                      onBlur={handleBlur("emailOrPhoneNumber")}
                      value={values.emailOrPhoneNumber}
                      onSubmitEditing={() => {
                        pwRef.current?.focus();
                      }}
                      returnKeyType="next"
                    />
                    {errors.emailOrPhoneNumber && touched.emailOrPhoneNumber ? (
                      <MyTextApp style={{ color: COLORS.orange, fontSize: 12 }}>
                        {errors.emailOrPhoneNumber}
                      </MyTextApp>
                    ) : null}
                  </View>
                  <View style={styles.formGroup}>
                    <InputComponent
                      ref={pwRef}
                      type="password"
                      placeholder={t("auth.enter_password")}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      onSubmitEditing={() => {
                        if (!isValid) {
                          return;
                        }
                        handleSubmit();
                      }}
                    />
                    {errors.password && touched.password ? (
                      <MyTextApp style={{ color: COLORS.orange, fontSize: 12 }}>
                        {errors.password}
                      </MyTextApp>
                    ) : null}
                  </View>
                </View>
                <TouchableOpacity
                  style={{ width: "100%" }}
                  onPress={() =>
                    navigation.navigate("VerifyEmailStep1Screen", {
                      signup: false,
                    })
                  }
                >
                  <MyTextApp
                    style={{
                      ...FONTS.font,
                      color: colors.title,
                      textAlign: "left",
                    }}
                  >
                    {t("auth.forgot_password")}
                  </MyTextApp>
                </TouchableOpacity>
                <ButtonComponent
                  title={t("auth.sign_in")}
                  style={styles.button}
                  disabled={
                    !(isValid && values.emailOrPhoneNumber && values.password)
                  }
                  onPress={handleSubmit}
                  onProcessing={onProcessing}
                />
              </View>
            );
          }}
        </Formik>
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
            {t("auth.not_member")}
          </MyTextApp>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("VerifyEmailStep1Screen", { signup: true })
            }
          >
            <MyTextApp
              style={{
                fontWeight: "bold",
                color: colors.title,
              }}
            >
              {" "}
              {t("auth.sign_up")}
            </MyTextApp>
          </TouchableOpacity>
        </View>
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
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    width: "100%",
    marginBottom: 50,
    marginTop: 16,
  },
  formGroup: {
    width: "100%",
    gap: 8,
  },
});
