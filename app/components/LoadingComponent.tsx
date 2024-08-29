import { Animated, Image, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";

import { ICONS } from "../themes/theme";
import LinearGradient from "react-native-linear-gradient";
import Loader from "react-native-three-dots-loader";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { useTheme } from "@react-navigation/native";

export function IconLoadingDataComponent() {
  return (
    <View
      style={{
        ...styles.container,
        justifyContent: "center",
        alignItems: "center",
        height: 60,
      }}
    >
      <Image
        source={ICONS.nemo}
        alt=""
        style={{
          width: 24,
          height: 24,
        }}
      />
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
        }}
      >
        <Image
          source={require("../assets/images/images_n69/loading_dot.gif")}
          style={{ width: 60, height: 60 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  small: {
    alignContent: "center",
    justifyContent: "center",
    width: 12,
    height: 12,
  },
  large: {
    alignContent: "center",
    justifyContent: "center",
    width: 20,
    height: 20,
  },
});

export function IconProcessingButton({ size = 7 }: { size?: any }) {
  const { colors } = useTheme();
  return (
    <View style={stylesProcessingButton.container}>
      <Loader size={size} activeBackground={colors.primary} />
    </View>
  );
}

const stylesProcessingButton = StyleSheet.create({
  container: {},
});

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
export function SkeletonComponent({
  width = 100,
  height = 200,
  style,
  children,
  visibleChildren = false,
}: {
  width?: any;
  height?: any;
  style?: any;
  children?: any;
  visibleChildren?: boolean;
}) {
  // Handle animation
  const avatarRef = React.createRef<any>();

  useEffect(() => {
    const shimmerAnimated = Animated.stagger(400, [
      avatarRef?.current?.getAnimated(),
    ]);
    Animated.loop(shimmerAnimated).start();
  }, []);

  return (
    <View>
      <View style={{ flexDirection: "row", width, height }}>
        <ShimmerPlaceholder
          ref={avatarRef}
          width={width}
          height={height}
          visible={visibleChildren}
          stopAutoRun
          style={{
            ...style,
          }}
          duration={2000}
          // location={[0.3, 0.5, 0.7]}
          // shimmerColors={['#8c8c8c', '#b3b3b3', '#8c8c8c']}
        >
          {children}
        </ShimmerPlaceholder>
      </View>
    </View>
  );
}
