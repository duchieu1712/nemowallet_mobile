import * as AccountReducers from "../modules/account/reducers";

import {
  BackHandler,
  Image,
  ImageBackground,
  StyleSheet,
  View,
} from "react-native";

import { ICONS } from "../themes/theme";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";

export function FullscreenLoading() {
  const onProccessingGlobal = useSelector(AccountReducers.onProccessing);

  const { colors } = useTheme();

  useEffect(() => {
    // Prevent back
    const backAction = () => {
      return onProccessingGlobal;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    onProccessingGlobal && (
      <View style={styles.modalContainer}>
        <View
          style={{
            width: 110,
            height: 110,
            backgroundColor: colors.card,
            opacity: 0.6,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 12,
          }}
        >
          <ImageBackground
            source={ICONS.nemo}
            style={{
              width: 24,
              height: 24,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("../assets/images/images_n69/loading_dot.gif")}
              style={{ width: 60, height: 60 }}
            />
          </ImageBackground>
        </View>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#00000050",
    position: "absolute",
    height: "100%",
    width: "100%",
    padding: 30,
  },
  modalContent: {
    margin: 20,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 20,
    alignItems: "center",
    width: "100%",
    gap: 24,
  },
});
