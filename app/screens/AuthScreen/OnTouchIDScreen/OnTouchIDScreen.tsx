import * as AccountActions from "../../../modules/account/actions";
import * as AccountReducers from "../../../modules/account/reducers";
import * as WalletActions from "../../../modules/wallet/actions";
import * as yup from "yup";

import { COLORS, MyTextApp } from "../../../themes/theme";
import { LOCALE_STORAGE, RESPONSE, SIGN_IN_ERROR } from "../../../common/enum";
import React, { useEffect, useState } from "react";
import {
  SignOutCustom,
  getKey,
  saveAccount,
} from "../../../modules/account/utilities";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  customBase64Encode,
  descyptNEMOWallet,
  ellipseText,
} from "../../../common/utilities";
import { useDispatch, useSelector } from "react-redux";

import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthLayout from "../../../layout/AuthLayout";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import { ClassWithStaticMethod } from "../../../common/static";
import ContactComponent from "../../../components/ContactComponent";
import { Formik } from "formik";
import Icon from "react-native-vector-icons/Ionicons";
import ImageFocusAnimation from "../../../components/ImageComponent/ImageFocusAnimation";
import InputComponent from "../../../components/InputComponent";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "../../../components/ToastInfo";
import TouchID from "react-native-touch-id";
import dayjs from "dayjs";
import { rpcExecCogiChainNotEncodeParam } from "../../../components/RpcExec/toast_chain";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { navigationReplaceAll } from "../../../Navigations/Routes";

export default function OnTouchIDScreen({ navigation }: { navigation: any }) {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatchAccount = (account: any) =>
    dispatch(AccountActions.dataAccountResponse(account));
  const accountWeb = useSelector(AccountReducers.dataAccount);

  const [onProcessing, setOnProcessing] = useState(false);
  const [isAllowBio, setIsAllowBio] = useState(false);

  // const [formValues, setFormValues] = useState<any>({
  //   password: "Gihot@123",
  // });

  // const handleChangeText = (field: any, value: any) => {
  //   setFormValues((obj: any) => ({
  //     ...obj,
  //     [field]: value,
  //   }));
  //   setIsEmpty(!(formValues.emailOrPhoneNumber && formValues.password));
  // };

  const dispatchConnect = () => dispatch(WalletActions.connect());

  const dispatchSetProccessing = (pro: any) =>
    dispatch(AccountActions.setProccessing(pro));

  useEffect(() => {
    TouchID.isSupported()
      .then((_) => {
        // Success code
        AsyncStorage.getItem(LOCALE_STORAGE.ON_TOUCHID).then((onTouch) => {
          if (onTouch == "true") {
            setIsAllowBio(true);
            TouchID.authenticate("").then(() => {
              navigationReplaceAll("DrawerNavigation");
            });
          }
        });
      })
      .catch();
  }, []);

  useEffect(() => {
    dispatchSetProccessing(onProcessing);
  }, [onProcessing]);

  // useEffect(() => {
  //   if (formValues.password) {
  //     setIsEmpty(false);
  //   } else {
  //     setIsEmpty(true);
  //   }
  // }, [formValues]);

  const submitSignIn = (values: any) => {
    signIn(values);
  };

  const signIn = async (formValues: any): Promise<any> => {
    setOnProcessing(true);
    const data: any = {
      grant_type: "password",
      client_id: process.env.AUTH0_ID,
      username: accountWeb?.email,
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

  const schema = yup.object().shape({
    password: yup
      .string()
      .min(8, t("auth.min_password"))
      .required(t("auth.is_required")),
  });

  return (
    <AuthLayout
      back={false}
      close={false}
      title=""
      navigation={navigation}
      isChangePW={true}
    >
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            width: "100%",
            alignItems: "center",
          }}
        >
          {accountWeb?.profile_picture ? (
            <ImageFocusAnimation
              uri={accountWeb?.profile_picture}
              style={{ borderRadius: 70 }}
            />
          ) : (
            <ImageFocusAnimation style={{ borderRadius: 70 }} />
          )}
          <View style={styles.infoContainer}>
            <MyTextApp style={{ color: colors.text, textAlign: "center" }}>
              {t("common.hello")},
            </MyTextApp>
            <MyTextApp
              style={{
                color: colors.title,
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {accountWeb?.name}
            </MyTextApp>
            <MyTextApp style={{ color: colors.text, textAlign: "center" }}>
              {ellipseText(descyptNEMOWallet(accountWeb?.email))}
            </MyTextApp>
          </View>
          <Formik
            initialValues={{
              // password: "Gihot@123",
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
            }) => (
              <View style={{ gap: 30, width: "100%" }}>
                <View style={styles.formGroup}>
                  <InputComponent
                    style={{ marginTop: 15 }}
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
                <View style={styles.buttonGroup}>
                  <ButtonComponent
                    width={isAllowBio ? "80%" : "100%"}
                    title={t("auth.sign_in")}
                    onPress={handleSubmit}
                    disabled={!(isValid && values.password)}
                    paddingVertical={10}
                  />
                  {isAllowBio && (
                    <ButtonComponent
                      width={70}
                      titleJSX={
                        <Icon
                          name="finger-print"
                          color={COLORS.white}
                          size={24}
                        />
                      }
                      onPress={() => {
                        TouchID.authenticate("").then(() => {
                          navigation.replace("DrawerNavigation");
                        });
                      }}
                      paddingVertical={0}
                    />
                  )}
                </View>
              </View>
            )}
          </Formik>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              width: "100%",
            }}
            onPress={() => {
              navigationReplaceAll("SignInScreen");
              SignOutCustom(dispatchAccount);
            }}
          >
            <MyTextApp
              style={{
                fontWeight: "bold",
                color: colors.title,
              }}
            >
              {" "}
              {t("auth.sign_in_other_account")}
            </MyTextApp>
            <MaterialIcon
              name="account-sync-outline"
              size={20}
              color={colors.title}
            />
          </TouchableOpacity>
        </View>
        <ContactComponent />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  infoContainer: {
    flexDirection: "column",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
    marginBottom: 40,
  },
  formGroup: {
    width: "100%",
    gap: 8,
  },
});
