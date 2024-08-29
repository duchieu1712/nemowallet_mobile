import { useTheme } from "@react-navigation/native";
import FeatherIcon from "react-native-vector-icons/Feather";
import React, { forwardRef, useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

import { COLORS, FONTS } from "../themes/theme";

const InputComponent = forwardRef((props: any, ref: any) => {
  const { colors } = useTheme();

  const [passwordShow, setPasswordShow] = useState(true);
  const [inputValue, setInputValue] = useState<any>(props.value);
  const [isFocus, setIsFocus] = useState<any>(false);

  useEffect(() => {
    setInputValue(props.value);
  }, [props.value]);

  const handleShowPassword = () => {
    setPasswordShow(!passwordShow);
  };

  const handleClearInput = () => {
    setInputValue("");
    if (props.onChangeText) {
      props.onChangeText("");
    }
  };

  return (
    <View
      style={{
        ...styles.input,
        borderWidth: props?.border ?? 1,
        ...props.style,
      }}
      // pointerEvents="box-none"
    >
      <TextInput
        onFocus={() => {
          setIsFocus(true);
        }}
        onEndEditing={() => {
          setIsFocus(false);
        }}
        autoFocus={props.autoFocus}
        maxLength={props?.maxLength}
        inputMode={props.inputMode}
        keyboardType={props.keyboardType ?? undefined}
        secureTextEntry={props.type === "password" ? passwordShow : false}
        style={[
          {
            ...FONTS.font,
            fontSize: props.fontSize ?? 14,
            color: props.color ?? colors.title,
            flex: 1,
            width: props.width ?? "100%",
            paddingRight: props.inputPaddingRight ?? 30,
            height: props.multiline ? "auto" : props.height ?? 56,
            textAlign: props.textAlign ?? "left",
            fontWeight: props.fontWeight ?? "400",
            paddingVertical: props.paddingVeritcal ?? undefined,
            paddingLeft: 0,
            // ...props.inputStyle
          },
          props.inputLg && {
            paddingVertical: 18,
          },

          props.inputSm && {
            paddingVertical: 8,
          },
          // props.inputRounded && {
          //   borderRadius: 30,
          // },
          props.inputBorder && {
            borderWidth: 0,
            borderBottomWidth: 1,
            borderRadius: 0,
          },
          props.inputPaddingBottom && {
            paddingBottom: props.inputPaddingBottom,
          },
          props.type == "password" && {
            paddingRight: props.inputPaddingRight ?? 50,
          },
        ]}
        placeholderTextColor={colors.text}
        placeholder={props.placeholder}
        onChangeText={(text) => {
          setInputValue(text);
          if (props.onChangeText) {
            props.onChangeText(text);
          }
        }}
        value={(props.value || props.defaultValue) ?? inputValue}
        onSubmitEditing={props.onSubmitEditing}
        ref={ref}
        returnKeyType={props.returnKeyType}
        editable={props.editable}
        onBlur={props?.onBlur}
        multiline={props.multiline ?? false}
        numberOfLines={props.numberOfLines ?? undefined}
        textAlignVertical={props.textAlignVertical ?? "center"}
        textAlign={props.textAlign ?? "left"}
        // pointerEvents="box-none"
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          position: "absolute",
          top: 0,
          right: 0,
          height: props.height ?? "100%",
          zIndex: 10,
        }}
      >
        {(props.editable == true || props.editable == null) &&
          isFocus &&
          inputValue &&
          (props.showClear ?? true) && (
            <TouchableOpacity
              onPress={handleClearInput}
              style={
                props.type === "password"
                  ? styles.closeIconFocusEyeIcon
                  : styles.closeIcon
              }
              activeOpacity={0.8}
            >
              <FeatherIcon color={colors.text} size={18} name="x-circle" />
            </TouchableOpacity>
          )}
        {props.type === "password" && (
          <TouchableOpacity
            accessibilityLabel="Password"
            accessibilityHint="Password show and hidden"
            onPress={() => {
              handleShowPassword();
            }}
            style={styles.eyeIcon}
            activeOpacity={0.8}
          >
            <FeatherIcon
              color={colors.text}
              size={18}
              name={!passwordShow ? "eye-off" : "eye"}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  input: {
    // height: 56,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.border,
    width: "100%",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIcon: {
    // position: "absolute",
    // height: 54,
    width: 32,
    alignItems: "center",
    justifyContent: "center",
    right: 8,
    // zIndex: 100,
    // top: 0,
  },
  closeIcon: {
    // position: "absolute",
    // height: 54,
    width: 32,
    alignItems: "center",
    justifyContent: "center",
    right: 8,
    // zIndex: 111,
    // top: 0,
  },
  closeIconFocusEyeIcon: {
    // position: "absolute",
    // height: 54,
    // width: 36,
    alignItems: "center",
    justifyContent: "center",
    // right: 28,
    // zIndex: 1,
    // top: 0,
  },
});

export default InputComponent;
