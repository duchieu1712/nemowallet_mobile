import { FONTS, MyTextApp } from "../../themes/theme";
import { TouchableOpacity, View } from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";

import DropShadow from "react-native-drop-shadow";
import FeatherIcon from "react-native-vector-icons/Feather";
import React from "react";

const HeaderBarComponent = ({
  title,
  leftIcon,
  ...props
}: {
  title: any;
  leftIcon: any;
  props?: any;
}) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <DropShadow
      style={{
        zIndex: 1,
        backgroundColor: colors.background,
      }}
    >
      <View
        style={{
          height: 48,
          backgroundColor: colors.background,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: 48,
            width: 48,
          }}
        >
          {leftIcon == "back" && (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={{
                height: "100%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FeatherIcon name="arrow-left" size={22} color={colors.title} />
            </TouchableOpacity>
          )}
        </View>
        <MyTextApp
          style={{
            flex: 1,
            textAlign: "left",
            ...FONTS.h5,
            ...FONTS.fontBold,
            color: colors.title,
          }}
        >
          {title}
        </MyTextApp>
        <View
          style={{
            height: 48,
            width: 48,
          }}
        ></View>
      </View>
    </DropShadow>
  );
};

export default HeaderBarComponent;
