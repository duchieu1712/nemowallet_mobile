import React from "react";
import {
  type ColorValue,
  type FlexAlignType,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  type ViewStyle,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import { useTheme } from "@react-navigation/native";

const ActionModalsComponent = ({
  children,
  modalVisible,
  setModalVisible,
  closeModal,
  isAllowCloseClickOutSide = true,
  backgroundOutside,
  iconClose,
  positionIconClose,
  iconCloseSize,
  animation,
  childrenPosition = "center",
}: {
  children?: any;
  modalVisible: any;
  setModalVisible?: any;
  closeModal?: any;
  isAllowCloseClickOutSide?: any;
  backgroundOutside?: ColorValue | undefined;
  iconClose?:
    | boolean
    | {
        icon?: JSX.Element | React.ReactNode;
        styleIcon?: ViewStyle;
      };
  positionIconClose?: {
    top: number | undefined;
    right: number | undefined;
    left?: number | undefined;
    bottom?: number | undefined;
  };
  animation?: "slide" | "fade";
  childrenPosition?: FlexAlignType;
  iconCloseSize?: number /* Only active with typeof property iconClose is boolean */;
}) => {
  const { colors } = useTheme();
  return (
    <Modal
      animationType={animation ?? "slide"}
      transparent={true}
      visible={modalVisible}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => isAllowCloseClickOutSide && closeModal?.()}
        style={{
          justifyContent: "center",
          height: "100%",
          width: "100%",
          backgroundColor: backgroundOutside ?? "rgba(0,0,0,.5)",
          zIndex: 1,
        }}
      >
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: childrenPosition,
            position: "relative",
          }}
        >
          {iconClose && typeof iconClose === "boolean" && (
            <TouchableOpacity
              onPress={() => closeModal()}
              activeOpacity={0.8}
              style={{
                position: "absolute",
                right: positionIconClose?.right ?? 20,
                top: positionIconClose?.top ?? 20,
                left: positionIconClose?.left ?? undefined,
                bottom: positionIconClose?.bottom ?? undefined,
                zIndex: 1,
                width: 50,
                height: 50,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FeatherIcon
                name="x"
                color={colors.title}
                size={iconCloseSize ?? 24}
              />
            </TouchableOpacity>
          )}
          {iconClose &&
            typeof iconClose === "object" &&
            !Array.isArray(iconClose) && (
              <TouchableOpacity
                onPress={() => closeModal()}
                activeOpacity={0.8}
                style={{ width: 40, ...iconClose.styleIcon }}
              >
                {iconClose.icon}
              </TouchableOpacity>
            )}
          <TouchableWithoutFeedback>{children}</TouchableWithoutFeedback>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ActionModalsComponent;
