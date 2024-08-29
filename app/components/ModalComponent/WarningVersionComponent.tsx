import {
  APP_VERSION,
  APP_VERSION_EXTENSION,
  PROD,
} from "../../common/constants";
import { COLORS, IMAGES, MyTextApp } from "../../themes/theme";
import { Image, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";

import ActionModalsComponent from "./ActionModalsComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { LOCALE_STORAGE } from "../../common/enum";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export const API_VERSION = PROD
  ? "https://api.nemoverse.io/mobile/mainnet/config"
  : "https://api.nemoverse.io/mobile/testnet/config";

export default function WarningVersionComponent() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [onWarningVersion, setOnWarningVersion] = useState(false);
  const [tooOld, setTooOld] = useState(false);

  const checkVersion = (versionUpdate: any, versionWarning: any) => {
    if (
      !versionUpdate ||
      !versionWarning ||
      versionUpdate.length == 0 ||
      versionWarning.length == 0
    )
      return;
    if (
      APP_VERSION < versionUpdate[0] ||
      APP_VERSION_EXTENSION < versionUpdate[1]
    ) {
      setOnWarningVersion(true);
      setTooOld(true);
    } else if (
      APP_VERSION < versionWarning[0] ||
      APP_VERSION_EXTENSION < versionWarning[1]
    ) {
      setOnWarningVersion(true);
      setTooOld(false);
    }
  };

  useEffect(() => {
    fetch(API_VERSION)
      .then(async (res) => await res.json())
      .then((res) => {
        AsyncStorage.setItem(LOCALE_STORAGE._VERSION, JSON.stringify(res));
        const versionWarning = res.result
          .find((resultItem: any) => resultItem.key === "version_warning")
          ?.value?.split("+");
        const versionUpdate = res.result
          .find((resultItem: any) => resultItem.key === "version_update")
          ?.value?.split("+");
        checkVersion(versionUpdate, versionWarning);
      })
      .catch(async (err) => {
        let version: any = await AsyncStorage.getItem(LOCALE_STORAGE._VERSION);
        if (!version) return;
        version = JSON.parse(version);
        const versionWarning = version.result
          .find((resultItem: any) => resultItem.key === "version_warning")
          ?.value?.split("+");
        const versionUpdate = version.result
          .find((resultItem: any) => resultItem.key === "version_update")
          ?.value?.split("+");
        checkVersion(versionUpdate, versionWarning);
      });
  }, []);

  return (
    <ActionModalsComponent
      modalVisible={onWarningVersion}
      // modalVisible={false}
      closeModal={() => {
        setOnWarningVersion(!!tooOld);
      }}
      iconClose={!tooOld}
      positionIconClose={{
        right: 20,
        top: 0,
      }}
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
            {t("common.warning_version")}
          </MyTextApp>
        </View>
        <Image
          source={IMAGES.error_pc}
          style={{ width: 250, height: 150 }}
          resizeMode="contain"
        />
        <MyTextApp
          style={{
            color: COLORS.yellow,
            fontWeight: "bold",
            lineHeight: 18,
            fontSize: 16,
          }}
        >
          {tooOld
            ? t("common.version_too_old")
            : t("common.warning_version_content")}
        </MyTextApp>
        <ButtonComponent title={t("common.download_latest_version")} />
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
    gap: 16,
  },
});
