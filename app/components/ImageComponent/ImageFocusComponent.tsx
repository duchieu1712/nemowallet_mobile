import React, { useEffect, useState } from "react";

import { Animated } from "react-native";
import { IMAGES } from "../../themes/theme";
import { keyboardListener } from "../../common/utilities";

export default function ImageFocusComponent() {
  const [imageHeight] = useState(new Animated.Value(160));

  useEffect(() => {
    keyboardListener(imageHeight);
  }, []);

  return (
    <Animated.Image
      source={IMAGES.logo160x160}
      style={{
        height: imageHeight,
        resizeMode: "contain",
      }}
    />
  );
}
