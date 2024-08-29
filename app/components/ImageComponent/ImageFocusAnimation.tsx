import React, { useEffect, useState } from "react";

import { Animated } from "react-native";
import { keyboardListener } from "../../common/utilities";
import { isEmpty } from "lodash";
import { IMAGES } from "../../themes/theme";

const MIN_HEIGHT = 80;
const MAX_HEIGHT = 140;
export default function ImageFocusAnimation({
  uri = "",
  local = "",
  style,
}: {
  uri?: any;
  local?: any;
  style?: any;
}) {
  const [size] = useState(new Animated.Value(MAX_HEIGHT));

  useEffect(() => {
    keyboardListener(size, MIN_HEIGHT, MAX_HEIGHT);
  }, []);

  if (!isEmpty(uri)) {
    return (
      <Animated.Image
        source={{ uri, cache: "default" }}
        style={{
          height: size,
          width: size,
          resizeMode: "contain",
          ...style,
        }}
      />
    );
  } else if (!isEmpty(local)) {
    return (
      <Animated.Image
        source={local}
        style={{
          height: size,
          width: size,
          resizeMode: "contain",
          ...style,
        }}
      />
    );
  } else {
    return (
      <Animated.Image
        source={IMAGES.defaultAvatart}
        style={{
          height: size,
          width: size,
          resizeMode: "contain",
          ...style,
        }}
      />
    );
  }
}
