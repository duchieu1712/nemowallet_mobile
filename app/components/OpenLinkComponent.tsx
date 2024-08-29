import {
  Alert,
  Linking,
  Share,
  type StyleProp,
  type TextStyle,
} from "react-native";
import React, { useCallback } from "react";
import {
  explorerFromAddress,
  explorerFromTxCogiChain,
} from "../common/utilities_config";

import Clipboard from "@react-native-clipboard/clipboard";
import { MyTextApp } from "../themes/theme";
import Toast from "./ToastInfo";
import { useTranslation } from "react-i18next";

export default function OpenLinkComponent({
  address,
  chainID,
  children,
  style,
}: {
  address: any;
  chainID?: any;
  children: any;
  style?: StyleProp<TextStyle>;
}) {
  const { t } = useTranslation();

  const handlePress = useCallback(async () => {
    const url = explorerFromAddress(address, chainID);
    Clipboard.setString(address);
    Toast.success(t("common.address") + ": " + address, t("common.copied"));
    await Linking.openURL(url);
  }, [address]);
  return (
    <MyTextApp
      onPress={handlePress}
      style={style}
      ellipsizeMode="tail"
      numberOfLines={2}
    >
      {children}
    </MyTextApp>
  );
}

export function OpenTxIDLinkComponent({
  style,
  TxID,
  children,
}: {
  style?: StyleProp<TextStyle>;
  TxID: any;
  children: any;
}) {
  const { t } = useTranslation();
  const handlePress = useCallback(async () => {
    const url = explorerFromTxCogiChain(TxID);
    Clipboard.setString(TxID);
    Toast.success(t("common.address") + ": " + TxID, t("common.copied"));
    await Linking.openURL(url);
  }, [TxID]);

  return (
    <MyTextApp
      onPress={handlePress}
      style={style}
      ellipsizeMode="tail"
      numberOfLines={2}
    >
      {children}
    </MyTextApp>
  );
}

export const onShare = async (link: string) => {
  try {
    const result = await Share.share({
      message: link,
      url: link,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error: any) {
    Alert.alert(error.message);
  }
};
