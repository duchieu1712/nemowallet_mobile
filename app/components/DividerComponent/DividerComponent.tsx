import { Platform, View } from "react-native";

import React from "react";
import { useTheme } from "@react-navigation/native";

const DividerComponent = (props) => {
  const { colors } = useTheme();
  return (
    <>
      {Platform.OS === "ios" ? (
        <View
          style={{
            overflow: "hidden",
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
            ...props.style,
          }}
        />
      )}
    </>
  );
};

export default DividerComponent;
