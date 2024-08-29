import { Text, View } from "react-native";

import React from "react";
import { useTheme } from "@react-navigation/native";

const DividerIconComponent = (props) => {
  const { colors } = useTheme();
  return (
    <>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {Platform.OS === "ios" ? (
          <View
            style={{
              overflow: "hidden",
              marginTop: 15,
              marginBottom: 15,
              flex: 1,
            }}
          >
            <View
              style={{
                borderStyle: props.dashed ? "dashed" : "solid",
                borderWidth: 1,
                borderColor: props.color ? props.color : colors.borderColor,
                margin: -2,
                marginTop: 0,
              }}
            >
              <View style={{ height: 2 }} />
            </View>
          </View>
        ) : (
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: props.color ? props.color : colors.borderColor,
              borderStyle: props.dashed ? "dashed" : "solid",
              marginTop: 15,
              marginBottom: 15,
              flex: 1,
              ...props.style,
            }}
          />
        )}
        {props.icon && (
          <View style={{ paddingHorizontal: 10 }}>{props.icon}</View>
        )}
        {props.text && (
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={{ color: props.colorText, fontSize: 16 }}>
              {props.text}
            </Text>
          </View>
        )}
        {Platform.OS === "ios" ? (
          <View
            style={{
              overflow: "hidden",
              marginTop: 15,
              marginBottom: 15,
              flex: 1,
            }}
          >
            <View
              style={{
                borderStyle: props.dashed ? "dashed" : "solid",
                borderWidth: 1,
                borderColor: props.color ? props.color : colors.borderColor,
                margin: -2,
                marginTop: 0,
              }}
            >
              <View style={{ height: 2 }} />
            </View>
          </View>
        ) : (
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: props.color ? props.color : colors.borderColor,
              borderStyle: props.dashed ? "dashed" : "solid",
              marginTop: 15,
              marginBottom: 15,
              flex: 1,
              ...props.style,
            }}
          />
        )}
      </View>
    </>
  );
};

export default DividerIconComponent;
