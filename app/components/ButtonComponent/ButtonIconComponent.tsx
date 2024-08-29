import * as AccountReducers from "../../modules/account/reducers";

import { Image, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useTheme } from "@react-navigation/native";

import AntdIcon from "react-native-vector-icons/AntDesign";
import FeatherIcon from "react-native-vector-icons/Feather";
import ImageLoaderComponent from "../ImageComponent/ImageLoaderComponent";
import { useSelector } from "react-redux";

export function AvatarLoginedComponent() {
  const accountWeb = useSelector(AccountReducers.dataAccount);
  const [isAccount, setIsAccount] = useState(false);

  const { colors } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    if (!accountWeb) {
      setIsAccount(false);
      return;
    }
    setIsAccount(true);
  }, [accountWeb]);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("AccountScreen" as never);
      }}
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: 42,
        height: 42,
        borderRadius: 20,
        zIndex: 3,
      }}
      activeOpacity={0.8}
    >
      {isAccount ? (
        accountWeb?.profile_picture ? (
          <ImageLoaderComponent
            source={accountWeb?.profile_picture}
            style={{ width: 32, height: 32, borderRadius: 20 }}
          />
        ) : (
          <Image
            source={require("../../assets/images/images_n69/profile/default_avatar.png")}
            style={{ width: 32, height: 32, borderRadius: 20 }}
          />
        )
      ) : (
        <FeatherIcon name="user" size={24} color={colors.title} />
      )}
    </TouchableOpacity>
  );
}

export function IconButtonNotifyComponent({ navigation }: { navigation: any }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("NotificationScreen" as never)}
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: 42,
        borderRadius: 20,
        height: 42,
      }}
      activeOpacity={0.5}
    >
      <FeatherIcon size={24} color={colors.title} name="bell" />
    </TouchableOpacity>
  );
}

export function IconButtonQRComponent({ navigation }: { navigation: any }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("CodeScannerScreen" as never)}
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: 42,
        borderRadius: 20,
        height: 42,
      }}
      activeOpacity={0.5}
    >
      <AntdIcon size={24} color={colors.title} name="scan1" />
    </TouchableOpacity>
  );
}

export function RadiusLeft() {
  const { colors, dark } = useTheme();
  return (
    <>
      <View
        style={{
          position: "absolute",
          width: 14,
          height: 14,
          zIndex: 1,
          backgroundColor: dark ? "#1F222A" : "#fff",
          left: -14,
        }}
      ></View>
      <View
        style={{
          position: "absolute",
          backgroundColor: colors.background,
          zIndex: 1,
          width: 28,
          height: 28,
          borderRadius: 28,
          left: -28,
        }}
      ></View>
    </>
  );
}

export function RadiusRight() {
  const { colors, dark } = useTheme();
  return (
    <>
      <View
        style={{
          position: "absolute",
          width: 14,
          height: 14,
          zIndex: 1,
          backgroundColor: dark ? "#1F222A" : "#fff",
          right: -14,
        }}
      ></View>
      <View
        style={{
          position: "absolute",
          backgroundColor: colors.background,
          zIndex: 1,
          width: 28,
          height: 28,
          borderRadius: 28,
          right: -28,
        }}
      ></View>
    </>
  );
}
