// Required to make BigInt work on Android with RN < 0.70
import * as AccountActions from "../../modules/account/actions";
import * as AccountReducers from "../../modules/account/reducers";
import * as JsonrpcActions from "../../modules/jsonrpc/actions";
import * as WalletActions from "../../modules/wallet/actions";
import * as WalletReducers from "../../modules/wallet/reducers";

import { COLORS, IMAGES, MyTextApp } from "../../themes/theme";
import { Image, StyleSheet, View } from "react-native";
import { LOCALE_STORAGE, RESPONSE } from "../../common/enum";
import React, { useEffect, useState } from "react";
import { decryptData, saveAccount } from "../../modules/account/utilities";
import { useDispatch, useSelector } from "react-redux";

import { API_LINK_WALLET } from "../../common/api";
import ActionModalsComponent from "../ModalComponent/ActionModalsComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ButtonComponent from "./ButtonComponent";
import { ClassWithStaticMethod } from "../../common/static";
import Toast from "../ToastInfo";
import { ellipseText } from "../../common/utilities";
import { endpointFromChainId } from "../../common/utilities_config";
import { rpcExecCogiChain } from "../RpcExec/toast_chain";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useWalletConnectModal } from "@walletconnect/modal-react-native";

if (typeof BigInt === "undefined") global.BigInt = require("big-integer");

const LinkWalletButtonComponent = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isConnected, address, provider } = useWalletConnectModal();
  const [openModal, setOpenModal] = useState(false);
  const accountWeb = useSelector(AccountReducers.dataAccount);
  const signature = useSelector(WalletReducers.selectedSignature);

  const dispatchSetProvider = (provider: any) =>
    dispatch(WalletActions.setProvider(provider));
  const dispatchAccount = (account: any) =>
    dispatch(AccountActions.dataAccountResponse(account));
  const closeModal = () => {
    setOpenModal(false);
  };
  useEffect(() => {
    dispatchSetProvider(provider);
  }, [provider]);

  // useEffect(() => {
  //   if (!jsonrpcConnected) {
  //     dispatchJsonrpcConnect();
  //   }
  //   if (jsonrpcConnected && onProcessLinkAccount) {
  //     linkMetamask()
  //     setOnProcessLinkAccount(false)
  //   }
  // }, [signature, jsonrpcConnected]);

  const dispatchJsonrpcConnect = () => {
    if (signature == null) {
      dispatch(WalletActions.accountToSignature());
    } else {
      dispatch(
        JsonrpcActions.connect(
          endpointFromChainId(ClassWithStaticMethod.STATIC_DEFAULT_CHAINID)
            .endpoint,
          signature,
        ),
      );
    }
  };

  const linkMetamask = () => {
    if (!signature) {
      dispatchJsonrpcConnect();
      // setOnRequestLinkAccount(false)
      return;
    }

    rpcExecCogiChain({
      method: API_LINK_WALLET,
      params: [signature],
      callback: async (e: any, flagResponse: any) => {
        if (flagResponse == RESPONSE.SUCCESS) {
          console.log("success link");
          setOpenModal(true);
          await AsyncStorage.setItem(LOCALE_STORAGE.FLAG_SIGNOUT, "true");
          // localStorage.setItem(LOCALE_STORAGE.FLAG_SIGNOUT, "true");
          // setOnActionStep_Link_Account(true)
          // setOnRequestLinkAccount(false)
          // setOnActionStep5(false)
          updateWallet_Address(address);
        } else {
          if (!e?.message) {
            if (e?.includes("Metamask wallet invalid")) {
              Toast.error("Metamask Address is linked with another account!");
            } else {
              Toast.error(e);
            }
          }
        }
        // setOnRequestLinkAccount(false)
      },
    });
  };

  const updateWallet_Address = async (address: any) => {
    if (accountWeb != null && accountWeb != null) {
      const temp = { ...accountWeb };
      temp.wallet_address = [address];
      dispatchAccount({
        account: temp,
        exist: true,
      });
      const getData = await AsyncStorage.getItem(LOCALE_STORAGE.ACCOUNT);
      const data = decryptData(getData);
      console.log("update", data);
      if (data && data != "") {
        const storageUser = JSON.parse(data);
        if (storageUser.user_id == temp.user_id) {
          saveAccount(temp);
        }
      }
    }
  };

  return (
    <View style={{ width: "100%" }}>
      {isConnected && (
        <ButtonComponent
          title={t("account.link_to_Metamask")}
          onPress={() => {
            linkMetamask();
          }}
          // onPress={() => setOpenModal(true)}
        />
      )}
      <ActionModalsComponent modalVisible={openModal} closeModal={closeModal}>
        <View style={{ ...styles.modalContent, backgroundColor: colors.card }}>
          <View style={{ position: "relative", width: "100%" }}>
            <MyTextApp
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: colors.title,
                textAlign: "center",
              }}
            >
              {t("account.link_wallet_success")}
            </MyTextApp>
          </View>
          <MyTextApp style={{ color: colors.text, textAlign: "center" }}>
            {t("account.link_success_content")} {ellipseText(address)}
          </MyTextApp>
          <Image source={IMAGES.success} />
          <MyTextApp
            style={{
              fontWeight: "bold",
              color: colors.title,
              textAlign: "center",
            }}
          >
            {t("account.resign_in")}
          </MyTextApp>
          <ButtonComponent
            title={t("account.ok")}
            onPress={() => navigation.navigate("SignInScreen" as never)}
          />
        </View>
      </ActionModalsComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  card: {
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
  },
  block: {
    gap: 8,
  },
  copy: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
  },
  link: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 22,
  },
  groupBtn: {
    flex: 1,
    columnGap: 16,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    // width: "100%",
    paddingHorizontal: 8,
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#00000081",
    padding: 30,
  },
  modalContent: {
    margin: 20,
    backgroundColor: COLORS.greyBackground,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 20,
    alignItems: "center",
    width: "90%",
    gap: 24,
  },
  closeBtn: {
    position: "absolute",
    right: 0,
    top: 0,
  },
});

export default LinkWalletButtonComponent;
