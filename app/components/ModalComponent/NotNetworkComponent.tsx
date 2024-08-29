import { Image, StyleSheet, View } from "react-native";
import { useState } from "react";

import ActionModalsComponent from "./ActionModalsComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { MyTextApp } from "../../themes/theme";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

// import NetInfo from "@react-native-community/netinfo";
export default function ModalCheckNetworkComponent(): any {
  const [onAction, setOnAction] = useState(false);
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <ActionModalsComponent
      closeModal={() => {
        setOnAction(false);
      }}
      modalVisible={onAction}
      iconClose
      positionIconClose={{
        top: 0,
        right: 20,
      }}
    >
      <View style={{ ...styles.modalContent, backgroundColor: colors.card }}>
        <Image
          source={require("../../assets/images/images_n69/component/offline.png")}
          style={{
            width: 150,
            height: 120,
            marginTop: 50,
          }}
        />

        <View>
          <MyTextApp
            style={{
              color: colors.title,
              marginVertical: 16,
              fontSize: 18,
            }}
          >
            {t("common.no_internet")}
          </MyTextApp>
        </View>
        <ButtonComponent
          title={"OK"}
          onPress={() => {
            setOnAction(false);
          }}
        />
      </View>
    </ActionModalsComponent>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    padding: 16,
    borderRadius: 12,
    width: "90%",
    alignItems: "center",
  },
});
