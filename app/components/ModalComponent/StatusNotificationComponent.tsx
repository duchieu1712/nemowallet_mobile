import * as AccountActions from "../../modules/account/actions";
import * as AccountReducers from "../../modules/account/reducers";

import { COLORS, IMAGES, MyTextApp } from "../../themes/theme";
import { Image, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import ActionModalsComponent from "./ActionModalsComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import React from "react";
import { isEmpty } from "lodash";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function StatusNotificationComponent() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const status = useSelector(AccountReducers.onStatusNotification);
  const dispatchStatus = (req: any) =>
    dispatch(AccountActions.setOnStatusNotification(req));

  return (
    <ActionModalsComponent
      modalVisible={status?.visible}
      closeModal={() =>
        dispatchStatus({ visible: false, errorMsg: "", txSuccess: "" })
      }
      iconClose
      positionIconClose={{
        right: 20,
        top: 0,
      }}
    >
      <View style={{ ...styles.modalContent, backgroundColor: colors.card }}>
        <Image
          source={status?.txSuccess ? IMAGES.success : IMAGES.error}
          style={{ width: 200, height: 200 }}
          resizeMode="contain"
        />
        <MyTextApp
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: status?.txSuccess ? COLORS.success : COLORS.orange,
            textAlign: "center",
          }}
        >
          {status?.txSuccess ? t("common.success") : t("common.error")}
        </MyTextApp>
        <View style={{ gap: 4 }}>
          {!isEmpty(status?.errorMsg) && status.errorMsg}
          {!isEmpty(status?.txSuccess) && status?.txSuccess}
        </View>
        <ButtonComponent
          title={status?.txSuccess ? t("common.done") : t("common.close")}
          color={COLORS.disbaledButton}
          borderColor={COLORS.disbaledButton}
          onPress={() =>
            dispatchStatus({ visible: false, errorMsg: "", txSuccess: "" })
          }
        />
      </View>
    </ActionModalsComponent>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 20,
    alignItems: "center",
    width: "90%",
    gap: 20,
  },
});
