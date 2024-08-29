import { ScrollView, StyleSheet, View } from "react-native";

import AuthFooterComponent from "../components/FooterComponent/AuthFooterComponent";
import AuthHeaderComponent from "../components/HeaderComponent/AuthHeaderComponent";
import { COLORS } from "../themes/theme";
import React from "react";
import { useTheme } from "@react-navigation/native";

// import AuthFooterComponent from "./Footers/authFooter";

export default function AuthLayout({
  children,
  back,
  close,
  title,
  navigation,
  isChangePW,
}: {
  children?: any;
  back?: any;
  close?: any;
  title?: any;
  navigation?: any;
  isChangePW?: any;
}) {
  const { colors } = useTheme();
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="always"
    >
      <View style={{ ...styles.container, backgroundColor: colors.background }}>
        <AuthHeaderComponent back={back} title={title} close={close} />
        {children}
        {!isChangePW && <AuthFooterComponent navigation={navigation} />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    borderTopWidth: 5,
    borderColor: COLORS.primary,
    borderRadius: 30,
  },
});
