import { COLORS, IMAGES, MyTextApp } from "../../themes/theme";
import { Image, StyleSheet, View } from "react-native";

import ActionModalsComponent from "./ActionModalsComponent";
import { GlobalStyleSheet } from "../../themes/styleSheet";
import React from "react";
import WalletConnectButtonComponent from "../ButtonComponent/WalletConnectButtonComponent";
import { ellipseAddress } from "../../common/utilities";
import { isEmpty } from "lodash";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export function SwitchAccountComponent({
  switchToAccount,
  setSwitchToAccount,
  backgroundModal,
}: {
  switchToAccount: any;
  setSwitchToAccount: any;
  backgroundModal?: string;
}) {
  const { t } = useTranslation();
  return (
    <ActionModalsComponent
      modalVisible={!isEmpty(switchToAccount)}
      closeModal={() => {
        setSwitchToAccount(null);
      }}
    >
      <View
        style={{
          justifyContent: "center",
          flex: 1,
          backgroundColor: backgroundModal || "#00000081",
        }}
      >
        <View style={styles.modalView}>
          <MyTextApp
            style={{
              color: "#fe8e16",
              fontSize: 28,
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            {t("wallet.warning")}
          </MyTextApp>

          <Image source={IMAGES.metamask} style={{ width: 100, height: 100 }} />

          <MyTextApp
            style={{
              fontSize: 16,
              textAlign: "center",
            }}
          >
            {t("wallet.connect_metamask_description")}
          </MyTextApp>
          <MyTextApp
            style={{
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            {t("wallet.please_connect")}
          </MyTextApp>
          <MyTextApp
            style={{
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            {ellipseAddress(switchToAccount)}
          </MyTextApp>
          <WalletConnectButtonComponent
            hiddenAddress="none"
            styleDisconnect={{
              marginTop: 16,
            }}
            styleConnect={{
              marginTop: 16,
            }}

            // hideModalWhenDisconnect={setSwitchToAccount(null)}
          />
        </View>
      </View>
    </ActionModalsComponent>
  );
}

export function SwitchChainComponent({
  switchToChain,
  setSwitchToChain,
  backgroundModal,
}: {
  switchToChain: any;
  setSwitchToChain: any;
  backgroundModal?: any;
}) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <ActionModalsComponent
      modalVisible={switchToChain != null}
      closeModal={() => {
        setSwitchToChain(null);
      }}
    >
      <View
        style={{
          justifyContent: "center",
          // flex: 1,
          width: "100%",
          backgroundColor: backgroundModal || "#00000081",
        }}
      >
        <View
          style={{
            ...styles.modalView,
            backgroundColor: colors.card,
            ...GlobalStyleSheet,
          }}
        >
          <MyTextApp
            style={{
              color: "#fe8e16",
              fontSize: 28,
              fontWeight: "bold",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            {t("wallet.wrong_network")}
          </MyTextApp>

          <Image
            source={IMAGES.wrong_network}
            style={{ width: 100, height: 100 }}
          />

          <MyTextApp
            style={{
              fontSize: 16,
              textAlign: "center",
              marginVertical: 16,
              color: colors.title,
            }}
          >
            {t("wallet.wrong_network_description", {
              chainName: switchToChain?.name,
            })}
          </MyTextApp>

          {/* <Button
                title={t("wallet.switch")}
                onPress={async () => {
                  ClassWithStaticMethod.SET_STATIC_DEFAULT_CHAINID(
                    switchToChain.chainId
                  );
                  open();
                  setSwitchToChain(null);
                }}
              /> */}
          <WalletConnectButtonComponent
            hiddenAddress="none"
            styleConnect={{
              color: colors.title,
            }}
            styleButton={
              {
                // width: "100%"
              }
            }
          />
        </View>
      </View>
    </ActionModalsComponent>
  );
}

const styles = StyleSheet.create({
  buttonClose: {
    flexDirection: "row",
    justifyContent: "flex-end",
    maxWidth: 30,
    borderWidth: 1,
    borderRadius: 18,
    padding: 5,
  },
  modalView: {
    margin: 20,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: 12,
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 24,
    paddingTop: 16,
    width: "90%",
  },
});
