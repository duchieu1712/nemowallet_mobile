import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { COLORS } from "../themes/theme";
import React, { useEffect, useState } from "react";

import { TouchableOpacity } from "react-native";

const ToggleStyle1 = (props: any) => {
  const [active, setActive] = useState(false);

  const offset = useSharedValue(0);
  const toggleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: offset.value,
        },
      ],
    };
  });
  useEffect(() => {
    if (props.active) {
      setActive(false);
      offset.value = withSpring(props.size - 2);
    }
  }, [props.active]);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          props.onToggle?.(active);
          setActive(!active);
          if (active) {
            offset.value = withSpring(0);
          } else {
            offset.value = withSpring(props.size - 3);
          }
        }}
        style={[
          {
            height: props.size,
            width: props.size * 2 - 2,
            backgroundColor: active ? COLORS.primary : "#e8e9ea",
            borderRadius: (props.size * 2 - 2) / 2,
          },
        ]}
      >
        <Animated.View
          style={[
            toggleStyle,
            {
              height: props.size - 4,
              width: props.size - 4,
              backgroundColor: "#fff",
              borderRadius: (props.size * 2 - 2) / 2,
              top: 2,
              left: 2,
            },
          ]}
        />
      </TouchableOpacity>
    </>
  );
};

export default ToggleStyle1;
