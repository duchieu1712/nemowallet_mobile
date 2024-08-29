import { COLORS, FONTS, MyTextApp } from "../../themes/theme";

import { IconProcessingButton } from "../LoadingComponent";
import React from "react";
import { TouchableOpacity } from "react-native";

const ButtonComponent = (props: any) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        if (props.onProcessing != null && props.onProcessing == true) return;
        props.onPress?.();
      }}
      style={[
        {
          ...props.style,
          backgroundColor: props.disabled
            ? props.backgroundDisabled ?? COLORS.disbaledButton
            : props.color
              ? props.color
              : COLORS.primary,
          paddingHorizontal: props.paddingHorizontal
            ? props.paddingHorizontal
            : 16,
          paddingVertical: props.paddingVertical ?? 12,
          borderRadius: props?.borderRadius ?? 32,
          alignItems: "center",
          borderWidth: props.borderWidth ?? 1,
          borderColor: props.disabled
            ? COLORS.disbaledButton
            : props.borderColor
              ? props.borderColor
              : COLORS.primary,
          width: props.width ?? "100%",
          height: props.height ?? 45,
          justifyContent: "center",
          opacity: props.opacity ?? 1,
        },
      ]}
      disabled={props.disabled ?? false}
    >
      {props.onProcessing ? (
        <IconProcessingButton />
      ) : (
        props.titleJSX ?? (
          <MyTextApp
            style={{
              ...FONTS.h6,
              color: props.disabled
                ? COLORS.descriptionText
                : props.textColor
                  ? props.textColor
                  : COLORS.white,
              fontWeight: props.textWeight ?? "bold",
              fontSize: props.textSize ?? 14,
              textAlign: "center",
            }}
          >
            {props.title}
          </MyTextApp>
        )
      )}
    </TouchableOpacity>
  );
};

export default ButtonComponent;
