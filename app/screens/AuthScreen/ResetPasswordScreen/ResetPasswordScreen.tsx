import * as AccountActions from "../../../modules/account/actions";

import { COLORS, MyTextApp } from "../../../themes/theme";
import React, { createRef, useState, useEffect } from "react";
import { StyleSheet, type TextInput, View } from "react-native";

import AuthLayout from "../../../layout/AuthLayout";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import InputComponent from "../../../components/InputComponent";
import Toast from "../../../components/ToastInfo";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { useRoute, useTheme } from "@react-navigation/native";

import { useTranslation } from "react-i18next";
import { Formik } from "formik";

const ResetPasswordScreen = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();
  const route = useRoute();
  const { email, _gid_uat_interaction, isChangePW }: any = route.params;
  const [onProcessing, setOnProcessing] = useState(false);
  // const [formValues, setFormValues] = useState({
  //   password: "",
  //   confirmPassword: "",
  // });
  const { colors } = useTheme();
  // const [isEmpty, setIsEmpty] = useState(true);

  const dispatch = useDispatch();
  const dispatchSetInitAccountSignIn = (account: any) =>
    dispatch(AccountActions.setInitAccountSignIn(account));
  const dispatchSetProccessing = (pro: any) =>
    dispatch(AccountActions.setProccessing(pro));

  useEffect(() => {
    dispatchSetProccessing(onProcessing);
  }, [onProcessing]);

  // const handleChangeText = (field: any, value: any) => {
  //   setFormValues((obj) => ({
  //     ...obj,
  //     [field]: value,
  //   }));
  //   setIsEmpty(!(formValues.password && formValues.confirmPassword));
  // };
  const submitReset = (formValues: any) => {
    setOnProcessing(true);
    fetch(
      `${process.env.LINK_OIDC}/api/v1/interaction/${_gid_uat_interaction}/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
          Toast.success(t("auth.change_pw_success"));
          if (!isChangePW) {
            dispatchSetInitAccountSignIn({
              emailOrPhone: email,
              pw: formValues.password.trim(),
            });
          }
          navigation.pop(2);
        }
      })
      .catch((e) => {
        setOnProcessing(false);
        Toast.error(e.message);
      });
  };

  const conFirmPwRef = createRef<TextInput>();
  const schema = yup.object().shape({
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
    <AuthLayout
      back={true}
      title="resetpassword"
      navigation={navigation}
      isChangePW={isChangePW}
    >
      <View style={styles.container}>
        <View>
          <MyTextApp style={{ ...styles.label, color: colors.title }}>
            {t("auth.your_email")}
          </MyTextApp>
          <InputComponent
            style={{ ...styles.input }}
            value={email}
            editable={false}
            color={COLORS.darkText}
          />
        </View>
        <Formik
          initialValues={{
            password: "",
            confirmPassword: "",
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            submitReset(values);
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
            <View style={{ gap: 20 }}>
              <View>
                <MyTextApp style={{ ...styles.label, color: colors.title }}>
                  {t("auth.new_password")}
                </MyTextApp>
                <InputComponent
                  autoFocus
                  secureTextEntry={true}
                  placeholder={t("auth.new_password")}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  onSubmitEditing={() => {
                    conFirmPwRef.current?.focus();
                  }}
                  value={values.password}
                  type="password"
                  returnKeyType="next"
                />
                {errors.password && touched.password ? (
                  <MyTextApp style={{ color: COLORS.orange, fontSize: 12 }}>
                    {errors.password}
                  </MyTextApp>
                ) : null}
              </View>
              <View>
                <MyTextApp style={{ ...styles.label, color: colors.title }}>
                  {t("auth.confirm_password")}
                </MyTextApp>
                <InputComponent
                  ref={conFirmPwRef}
                  secureTextEntry={true}
                  placeholder={t("auth.confirm_password")}
                  onChangeText={handleChange("confirmPassword")}
                  value={values.confirmPassword}
                  onBlur={handleBlur("confirmPassword")}
                  onSubmitEditing={() => {
                    if (!isValid) {
                      return;
                    }
                    handleSubmit();
                  }}
                  type="password"
                />
                {errors.confirmPassword && touched.confirmPassword ? (
                  <MyTextApp style={{ color: COLORS.orange, fontSize: 12 }}>
                    {errors.confirmPassword}
                  </MyTextApp>
                ) : null}
              </View>
              <ButtonComponent
                title={t("auth.update_password")}
                style={styles.button}
                disabled={
                  !(isValid && values.password && values.confirmPassword)
                }
                onPress={handleSubmit}
                onProcessing={onProcessing}
              />
            </View>
          )}
        </Formik>
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
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.border,
    width: "100%",
    paddingHorizontal: 16,
  },
  button: {
    width: "100%",
    marginTop: 10,
    marginBottom: 60,
  },
});

export default ResetPasswordScreen;
