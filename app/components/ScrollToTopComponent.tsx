import {
  type FlexStyle,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  type ScrollViewProps,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState } from "react";

import { COLORS } from "../themes/theme";
import FeatherIcon from "react-native-vector-icons/Feather";
import { useTheme } from "@react-navigation/native";

export default function ScrollViewToTop({
  children,
  refreshing = false,
  onRefresh,
  style,
  bottomIcon,
  rightIcon,
  keyboardShouldPersistTaps,
}: {
  children: any;
  refreshing: any;
  onRefresh?: any;
  style?: ScrollViewProps["style"];
  bottomIcon?: FlexStyle["bottom"];
  rightIcon?: FlexStyle["right"];
  keyboardShouldPersistTaps?:
    | boolean
    | "always"
    | "never"
    | "handled"
    | undefined;
}) {
  const { colors, dark } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  const [showToTopButton, setShowToTopButton] = useState(false);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    if (y > 200) {
      setShowToTopButton(true);
    } else {
      setShowToTopButton(false);
    }
  };

  const goToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps={keyboardShouldPersistTaps ?? "handled"}
        ref={scrollViewRef}
        onScroll={handleScroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={style}
      >
        {children}
      </ScrollView>
      {showToTopButton && (
        <TouchableOpacity
          style={{
            position: "absolute",
            width: 40,
            height: 40,
            backgroundColor: dark ? "#fff" : COLORS.blue, // Màu của FAB
            borderRadius: 30,
            justifyContent: "center",
            alignItems: "center",
            right: rightIcon ?? 20,
            bottom: bottomIcon ?? 220,
            elevation: 5, // Độ nâng của FAB
            zIndex: 9999,
            flex: 1,
          }}
          onPress={goToTop}
          activeOpacity={0.6}
        >
          <FeatherIcon
            name="arrow-up"
            color={dark ? colors.primary : "#fff"}
            size={24}
          />
        </TouchableOpacity>
      )}
    </>
  );
}
