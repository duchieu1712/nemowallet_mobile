import * as AccountActions from "../../../modules/account/actions";
import * as yup from "yup";
import { COLORS, FONTS, MyTextApp } from "../../../themes/theme";
import React, { createRef, useState, useEffect } from "react";
import {
  StyleSheet,
  type TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AuthLayout from "../../../layout/AuthLayout";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import InputComponent from "../../../components/InputComponent";
import Toast from "../../../components/ToastInfo";
import { useDispatch } from "react-redux";

import { useRoute, useTheme } from "@react-navigation/native";

import { useTranslation } from "react-i18next";
import { Formik } from "formik";

const SignUpScreen = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();
  const route = useRoute();
  const { email, _gid_uat_interaction }: any = route.params;
  // const [formValues, setFormValues] = useState<any>({
  //   fullName: "",
  //   email: "",
  //   password: "",
  //   confirmPassword: "",
  // });
  const { colors } = useTheme();
  // const [isEmpty, setIsEmpty] = useState(true);
  const [onProcessing, setOnProcessing] = useState(false);

  const dispatch = useDispatch();
  const dispatchSetInitAccountSignIn = (account: any) =>
    dispatch(AccountActions.setInitAccountSignIn(account));
  const dispatchSetProccessing = (pro: any) =>
    dispatch(AccountActions.setProccessing(pro));

  useEffect(() => {
    dispatchSetProccessing(onProcessing);
  }, [onProcessing]);

  // const handleChangeText = (field: any, value: any) => {
  //   setFormValues((obj: any) => ({
  //     ...obj,
  //     [field]: value,
  //   }));
  //   if (
  //     formValues.fullName !== "" &&
  //     formValues.password !== "" &&
  //     formValues.confirmPassword !== ""
  //   ) {
  //     setIsEmpty(false);
  //   } else {
  //     setIsEmpty(true);
  //   }
  // };

  const submitSignUp = (formValues: any) => {
    setOnProcessing(true);
    fetch(
      `${process.env.LINK_OIDC}/api/v1/interaction/${_gid_uat_interaction}/signup/register-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formValues.fullName.trim(),
          password: formValues.password.trim(),
          confirm_password: formValues.confirmPassword.trim(),
        }),
      },
    )
      .then(async (res) => await res.json())
      .then((response) => {
        setOnProcessing(false);
        if (response?.error?.message) {
          Toast.error(response.error.message);
        } else {
          Toast.success(t("auth.sign_up_success"));
          dispatchSetInitAccountSignIn({
            emailOrPhone: email,
            pw: formValues.password.trim(),
          });
          navigation.pop(2);
        }
      })
      .catch((e) => {
        setOnProcessing(false);
        Toast.error(e.message);
      });
  };

  const pwRef = createRef<TextInput>();
  const conFirmPwRef = createRef<TextInput>();

  const schema = yup.object().shape({
    fullName: yup.string().required(t("auth.is_required")),
    password: yup
      .string()
      .min(8, t("auth.min_password"))
      .required(t("auth.is_required")),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], t("auth.confirm_password_invalid"))
      .min(8, t("auth.min_password"))
      .required(t("auth.is_required")),
  });

  return (
    <AuthLayout back={true} title="signup" navigation={navigation}>
      <View style={styles.container}>
        <Formik
          initialValues={{
            fullName: "",
            email: email || "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            submitSignUp(values);
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
            <View style={{ width: "100%", gap: 20 }}>
              <View style={{ gap: 4 }}>
                <MyTextApp style={{ ...styles.label, color: colors.title }}>
                  {t("auth.your_email")}
                </MyTextApp>
                <InputComponent
                  style={{ ...styles.input, color: COLORS.darkText }}
                  value={email}
                  editable={false}
                />
              </View>
              <View style={{ gap: 4 }}>
                <MyTextApp style={{ ...styles.label, color: colors.title }}>
                  {t("auth.full_name")}
                </MyTextApp>
                <View style={styles.formGroup}>
                  <InputComponent
                    placeholder={t("auth.enter_name")}
                    onChangeText={handleChange("fullName")}
                    onBlur={handleBlur("fullName")}
                    onSubmitEditing={() => {
                      pwRef.current?.focus();
                    }}
                    returnKeyType="next"
                    value={values.fullName}
                  />
                  {errors.fullName && touched.fullName ? (
                    <MyTextApp style={{ color: COLORS.orange, fontSize: 12 }}>
                      {errors.fullName}
                    </MyTextApp>
                  ) : null}
                </View>
              </View>
              <View style={{ gap: 4 }}>
                <MyTextApp style={{ ...styles.label, color: colors.title }}>
                  {t("auth.password")}
                </MyTextApp>
                <View style={styles.formGroup}>
                  <InputComponent
                    secureTextEntry={true}
                    style={{ ...styles.input, color: colors.text }}
                    placeholder={t("auth.password")}
                    placeholderTextColor={COLORS.placeholder}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    onSubmitEditing={() => {
                      conFirmPwRef.current?.focus();
                    }}
                    ref={pwRef}
                    returnKeyType="next"
                    type="password"
                    value={values.password}
                  />
                  {errors.password && touched.password ? (
                    <MyTextApp style={{ color: COLORS.orange, fontSize: 12 }}>
                      {errors.password}
                    </MyTextApp>
                  ) : null}
                </View>
              </View>
              <View style={{ gap: 4 }}>
                <MyTextApp style={{ ...styles.label, color: colors.title }}>
                  {t("auth.confirm_password")}
                </MyTextApp>
                <View style={styles.formGroup}>
                  <InputComponent
                    ref={conFirmPwRef}
                    secureTextEntry={true}
                    style={{ ...styles.input, color: colors.text }}
                    placeholder={t("auth.confirm_password")}
                    placeholderTextColor={COLORS.placeholder}
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    onSubmitEditing={() => {
                      if (!isValid) {
                        return;
                      }
                      handleSubmit();
                    }}
                    type="password"
                    value={values.confirmPassword}
                  />
                  {errors.confirmPassword && touched.confirmPassword ? (
                    <MyTextApp style={{ color: COLORS.orange, fontSize: 12 }}>
                      {errors.confirmPassword}
                    </MyTextApp>
                  ) : null}
                </View>
              </View>
              <ButtonComponent
                title={t("auth.sign_up")}
                style={styles.button}
                disabled={
                  !(
                    isValid &&
                    values.email &&
                    values.fullName &&
                    values.password &&
                    values.confirmPassword
                  )
                }
                onPress={handleSubmit}
                onProcessing={onProcessing}
              />
            </View>
          )}
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
            {t("auth.have_account")}
          </MyTextApp>
          <TouchableOpacity onPress={() => navigation.navigate("SignInScreen")}>
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
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    paddingTop: 10,
    gap: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    height: 56,
    width: "100%",
  },
  button: {
    width: "100%",
    marginTop: 10,
    marginBottom: 60,
  },
  formGroup: {
    width: "100%",
    gap: 8,
  },
});

export default SignUpScreen;
