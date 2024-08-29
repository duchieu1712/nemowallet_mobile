import { Linking, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS } from "../themes/theme";
import BrandFA from "react-native-vector-icons/FontAwesome";
import { useTheme } from "@react-navigation/native";

function ContactComponent() {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        marginTop: 20,
      }}
    >
      <TouchableOpacity
        style={{
          width: 50,
          height: 50,
          backgroundColor: colors.card,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={async () =>
          await Linking.openURL("https://twitter.com/COGI_NETWORK")
        }
        activeOpacity={0.7}
      >
        <BrandFA name="twitter" size={30} color={COLORS.blue} />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: 50,
          height: 50,
          backgroundColor: colors.card,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={async () =>
          await Linking.openURL(
            "https://www.facebook.com/COGI.NetworkChannel.Gosu",
          )
        }
        activeOpacity={0.7}
      >
        <BrandFA name="facebook" size={30} color={COLORS.dark_blue} />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: 50,
          height: 50,
          backgroundColor: colors.card,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={async () => await Linking.openURL("https://t.me/COGI_Network")}
        activeOpacity={0.7}
      >
        <BrandFA name="telegram" size={30} color={"rgba(34, 158, 217, 1)"} />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: 50,
          height: 50,
          backgroundColor: colors.card,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={async () =>
          await Linking.openURL("https://www.youtube.com/@COGINetwork")
        }
        activeOpacity={0.7}
      >
        <BrandFA name="youtube-play" size={30} color={COLORS.danger} />
      </TouchableOpacity>
    </View>
  );
}

export default ContactComponent;
