// Required to make BigInt work on Android with RN < 0.70
import * as WalletReducers from "../../modules/wallet/reducers";

import { COLORS, MyTextApp } from "../../themes/theme";
import { TouchableOpacity, View } from "react-native";
import {
  WalletConnectModal,
  useWalletConnectModal,
} from "@walletconnect/modal-react-native";
import { descyptNEMOWallet, ellipseText } from "../../common/utilities";

import ButtonComponent from "./ButtonComponent";
import Clipboard from "@react-native-clipboard/clipboard";
import FeatherIcon from "react-native-vector-icons/Feather";
import React from "react";
import Toast from "../ToastInfo";
import cf_Chains from "../../config/chains";
import { useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

if (typeof BigInt === "undefined") global.BigInt = require("big-integer");

const WalletConnectButtonComponent = (props: any) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { open, isConnected, address, provider } = useWalletConnectModal();
  const PROJECT_ID = process.env.WALLET_CONNECTION_PROJECTID;

  const chainID = useSelector(WalletReducers.selectedChainId);

  return isConnected ? (
    <View
      style={{
        gap: 20,
        width: "100%",
        marginVertical: 5,
      }}
    >
      <View style={{ gap: 5 }}>
        <MyTextApp
          style={{
            color: colors.title,
            fontWeight: "bold",
            display: props.hiddenAddress,
          }}
        >
          {t("account.your_wallet")}:
        </MyTextApp>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 8,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 8,
            width: "100%",
          }}
          onPress={() => {
            Clipboard.setString(descyptNEMOWallet(address));
            Toast.success(t("common.copied"));
          }}
          activeOpacity={0.8}
        >
          <MyTextApp style={{ color: colors.title }}>
            {ellipseText(descyptNEMOWallet(address), 15)}
          </MyTextApp>
          <FeatherIcon name="copy" size={16} color={colors.title} />
        </TouchableOpacity>
      </View>
      <View style={{ gap: 5 }}>
        <MyTextApp
          style={{
            color: colors.title,
            fontWeight: "bold",
            display: props.hiddenAddress,
          }}
        >
          {t("wallet.network")}:
        </MyTextApp>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 8,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 8,
            width: "100%",
          }}
          activeOpacity={0.8}
        >
          <MyTextApp style={{ color: colors.title }}>
            {cf_Chains.find((e) => e.chainId == chainID)?.name ?? chainID}
          </MyTextApp>
        </TouchableOpacity>
      </View>
      <ButtonComponent
        title={t("account.disconnect")}
        color="transparent"
        textColor={colors.title}
        onPress={() => {
          provider?.disconnect();
          if (props.hideModalWhenDisconnect) {
            props.hideModalWhenDisconnect();
          }
        }}
        style={props.styleDisconnect}
      />
    </View>
  ) : (
    <View
      style={{
        ...props.styleButton,
        width: props.styleButton?.width ?? "100%",
        marginVertical: 12,
      }}
    >
      <ButtonComponent
        title={t("wallet.connect")}
        onPress={open}
        // color="transparent"
        textColor={props.styleConnect?.color ?? colors.title}
        style={props.styleConnect}
        width={props.styleConnect?.width ? props.styleConnect?.width : "100%"}
        height={props.styleConnect?.height}
        color={props.styleConnect?.backgroundColor ?? "transparent"}
        borderColor={props.styleConnect?.borderColor}
        paddingVertical={props.styleConnect?.paddingVertical}
        paddingHorizontal={props.styleConnect?.paddingHorizontal}
      />
      <WalletConnectModal
        projectId={PROJECT_ID ?? ""}
        providerMetadata={{
          name: "WalletConnect",
          description: "Scan qrcode to connect",
          url: "https://walletconnect.org",
          icons: ["https://walletconnect.org/walletconnect-logo.png"],
          redirect: {
            native: "walletconnect://",
          },
        }}
        sessionParams={{
          namespaces: {
            eip155: {
              methods: [
                "eth_sendTransaction",
                "personal_sign",
                "eth_signTypedData_v4",
              ],
              chains: ["eip155:1"],
              events: ["chainChanged", "accountsChanged"],
              rpcMap: {},
            },
          },
        }}
      />
    </View>
  );
};

export default WalletConnectButtonComponent;
