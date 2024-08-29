// Required to make BigInt work on Android with RN < 0.70
import * as WalletActions from "../../modules/wallet/actions";

import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  WalletConnectModal,
  useWalletConnectModal,
} from "@walletconnect/modal-react-native";

import { MyTextApp } from "../../themes/theme";
import { useDispatch } from "react-redux";

if (typeof BigInt === "undefined") global.BigInt = require("big-integer");

const WalletConnectModalApp = () => {
  const dispatch = useDispatch();
  const { open, isConnected, address, provider } = useWalletConnectModal();
  const PROJECT_ID = process.env.WALLET_CONNECTION_PROJECTID;
  // const PROJECT_ID = "7df138699f4be6a5abd5f67a225dde0d"

  const dispatchSetProvider = (provider: any) =>
    dispatch(WalletActions.setProvider(provider));

  useEffect(() => {
    dispatchSetProvider(provider);
  }, [provider]);

  return (
    <SafeAreaView style={styles.container}>
      {isConnected ? (
        <View>
          <MyTextApp>Connected to {address}</MyTextApp>
          <TouchableOpacity
            onPress={async () => {
              await provider?.disconnect();
            }}
          >
            <MyTextApp>Disconnect</MyTextApp>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={open}>
          <MyTextApp>Connect</MyTextApp>
        </TouchableOpacity>
      )}
      <WalletConnectModal
        projectId={PROJECT_ID}
        providerMetadata={{
          name: "WalletConnect",
          description: "Scan qrcode to connect",
          url: "https://walletconnect.org",
          icons: ["https://walletconnect.org/walletconnect-logo.png"],
          redirect: {
            native: "walletconnect://",
          },
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default WalletConnectModalApp;
