import { ICONS } from "../../themes/theme";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";

import Icon from "react-native-vector-icons/AntDesign";
import React from "react";
import { useTranslation } from "react-i18next";

export default function AuthHeaderComponent({
  back,
  title,
  close = true,
}: {
  back: any;
  title: any;
  close: any;
}) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const justifyContent = back || title ? "space-between" : "flex-end";
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { justifyContent }]}>
      {back && (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image source={ICONS.back} />
        </TouchableOpacity>
      )}
      {title == "signup" && (
        <Text style={{ ...styles.title, color: colors.title }}>
          {t("auth.sign_up")}
        </Text>
      )}
      {title == "resetpassword" && (
        <Text style={{ ...styles.title, color: colors.title }}>
          {t("auth.reset_password")}
        </Text>
      )}
      {close && (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Icon name="closecircleo" color={colors.title} size={20} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    height: 50,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  closeButton: {
    justifyContent: "flex-end",
  },
});
