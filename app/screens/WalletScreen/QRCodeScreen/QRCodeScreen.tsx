import * as AccountReducers from "../../../modules/account/reducers";

import { COLORS, ICONS, MyTextApp, SIZES } from "../../../themes/theme";
import {
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";

import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import cf_Chains from "../../../config/chains";
import { ClassWithStaticMethod } from "../../../common/static";
import Collapsible from "react-native-collapsible";
import DropdownSelectCoinComponent from "../Component/SelectCoinComponent";
import FeatherIcon from "react-native-vector-icons/Feather";
import InputComponent from "../../../components/InputComponent";
import QRCode from "react-native-qrcode-svg";
import RNFS from "react-native-fs";
import ScrollViewToTop from "../../../components/ScrollToTopComponent";
import Share from "react-native-share";
import { TYPE_ACTION } from "../../../common/enum";
import cf_coins from "../../../config/coins";
import { descyptNEMOWallet } from "../../../common/utilities";
import { toast } from "@baronha/ting";
import { useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function QRCodeScreen({ navigation }: { navigation: any }) {
  const accountWeb = useSelector(AccountReducers.dataAccount);
  const { colors } = useTheme();
  const { t } = useTranslation();
  const tokens = cf_coins.filter(
    (e) => e.chainID === ClassWithStaticMethod.NEMO_WALLET_CHAINID,
  );
  let svgQR: any = null;

  const [refresh, setRefreshing] = useState(false);
  const [amount, setAmount] = useState("0");
  const [isCollapsed, setIsCollapsed] = useState(true);
  // const [networkSelected, setNetworkSelected] = useState<any>(
  //   cf_Chains.find(
  //     (e) =>
  //       e.shortName === "cogi" &&
  //       e.chainId === ClassWithStaticMethod.NEMO_WALLET_CHAINID,
  //   ),
  // );
  const networkSelected = cf_Chains.find(
    (e) =>
      e.shortName === "cogi" &&
      e.chainId === ClassWithStaticMethod.NEMO_WALLET_CHAINID,
  );
  const [token, setToken] = useState(
    tokens.find((e) => e.symbol === "NEMO") ?? null,
  );
  // const [bridgePools, setBridgePools] = useState<any>(null);

  // const bridgePoolsReponse = useSelector(HotwalletReducers.bridgePoolResponse);
  // const dispatchGetBridgePools = () =>
  //   dispatch(HotwalletActions.getBridgePools(TYPE_WITHDRAW.WITHDRAW));

  // useEffect(() => {
  //   dispatchGetBridgePools();
  // }, []);

  // useEffect(() => {
  //   setBridgePools(bridgePoolsReponse?.pools);
  // }, [bridgePoolsReponse]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  const shareQR = () => {
    if (svgQR) {
      svgQR?.toDataURL((data: any) => {
        if (Platform.OS === "android") {
          const shareImageBase64 = {
            title: "QR",
            url: `data:image/png;base64,${data}`,
            message: t("qr_code.request_send_token"),
            // state.currentLang === 'vi'
            //   ? 'QR Yêu cầu chuyển tiền'
            //   : 'QR for transfer request',
          };
          Share.open(shareImageBase64).catch((err) => {
            console.log(err);
          });
        } else {
          RNFS.writeFile(
            RNFS.CachesDirectoryPath +
              "/QR_withdraw_" +
              accountWeb?.name +
              "_" +
              amount +
              ".png",
            data,
            "base64",
          );
        }
      });
      if (Platform.OS === "ios") {
        const shareImageBase64 = {
          title: "QR",
          url:
            RNFS.CachesDirectoryPath +
            "/QR_withdraw_" +
            accountWeb?.name +
            "_" +
            amount +
            ".png",
          message: t("qr_code.request_send_token"),
        };
        Share.open(shareImageBase64).catch((error) => {
          console.log(error);
        });
      }
    }
  };

  const saveQrToDisk = async (): Promise<void> => {
    if (svgQR) {
      if (Platform.OS === "android") {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
      }

      svgQR?.toDataURL((data: any) => {
        RNFS?.writeFile(
          RNFS?.CachesDirectoryPath +
            "/requestQR" +
            accountWeb?.name +
            "_" +
            amount +
            ".png",
          data,
          "base64",
        );
      });
      // showMessage({
      //   message: '',
      //   type: 'success',
      //   color: 'transparent',
      //   duration: 5000,
      //   renderCustomContent: () => (
      //     <FlashMessageError
      //       message={props.t('requestScreenStep2:successText')}
      //     />
      //   ),
      // });
      toast({
        title: t("qr_code.save_success"),
        preset: "done",
      });
      CameraRoll.save(
        RNFS.CachesDirectoryPath +
          "/requestQR" +
          accountWeb?.name +
          "_" +
          amount +
          ".png",
      );
    }
  };

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: colors.background,
      }}
    >
      <View style={{ width: "100%" }}>
        <View style={styles.leftHeaderBack}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FeatherIcon size={24} name="arrow-left" color={colors.title} />
          </TouchableOpacity>
          <MyTextApp style={{ ...styles.titleHeaderleft, color: colors.title }}>
            {t("qr_code.qr_withdraw")}
          </MyTextApp>
        </View>
        <ScrollViewToTop
          refreshing={refresh}
          onRefresh={onRefresh}
          bottomIcon={50}
        >
          <View
            style={{
              paddingBottom: 80,
              paddingHorizontal: 15,
            }}
          >
            <View
              style={{
                borderRadius: 12,
                // marginTop: 12,
                width: "100%",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingBottom: 5,
                  paddingTop: 5,
                }}
              >
                <MyTextApp
                  style={{
                    color: colors.title,
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  {accountWeb?.name}
                </MyTextApp>
              </View>
              <QRCode
                value={JSON.stringify({
                  address: descyptNEMOWallet(accountWeb?.nemo_address),
                  amount:
                    !amount || amount === ""
                      ? "0"
                      : parseInt(amount).toString(),
                  token: token?.symbol,
                  network: networkSelected?.chainId,
                })}
                logo={ICONS.cogi}
                getRef={(ref) => (svgQR = ref)}
                logoBackgroundColor="transparent"
                size={SIZES.width <= 360 ? 200 : 0.5 * SIZES.width}
              />
              <View
                style={{
                  // borderWidth: 1,
                  // borderColor: colors.primary,
                  // borderStyle: "dashed",
                  alignItems: "flex-start",
                  padding: 6,
                  gap: 8,
                  marginTop: 12,
                  borderRadius: 6,
                  width: "100%",
                }}
                // onPress={() => setShowInputMoney(!showInputMoney)}
                // activeOpacity={0.8}
              >
                <View style={{ gap: 8, width: "100%" }}>
                  <MyTextApp
                    style={{ ...styles.titleContent, color: colors.title }}
                  >
                    {t("qr_code.nemo_address")}
                  </MyTextApp>
                  <View
                    style={{
                      borderRadius: 8,
                      backgroundColor: colors.input,
                      height: 52,
                      paddingHorizontal: 8,
                      justifyContent: "center",
                    }}
                  >
                    <MyTextApp style={{ color: colors.title }}>
                      {descyptNEMOWallet(accountWeb?.nemo_address)}
                    </MyTextApp>
                  </View>
                </View>
                <View style={{ gap: 8, width: "100%" }}>
                  <MyTextApp
                    style={{ ...styles.titleContent, color: colors.title }}
                  >
                    {t("qr_code.network")}
                  </MyTextApp>
                  <View
                    style={{
                      borderRadius: 8,
                      backgroundColor: colors.input,
                      height: 52,
                      paddingHorizontal: 8,
                      gap: 8,
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Image
                      source={ICONS[networkSelected?.chainId]}
                      style={{
                        width: 24,
                        height: 24,
                      }}
                    />
                    <MyTextApp style={{ color: colors.title }}>
                      {networkSelected?.name}
                    </MyTextApp>
                  </View>
                </View>
                {/* <View style={{ gap: 8, width: "100%" }}>
                  <MyTextApp
                    style={{ ...styles.titleContent, color: colors.title }}
                  >
                    Token
                  </MyTextApp>
                  <View
                    style={{
                      borderRadius: 8,
                      backgroundColor: colors.input,
                      height: 52,
                      paddingHorizontal: 8,
                      gap: 8,
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Image
                      source={ICONS[token!.symbol.toLowerCase()]}
                      style={{
                        width: 24,
                        height: 24,
                      }}
                    />
                    <MyTextApp style={{ color: colors.title }}>
                      {token?.name}
                    </MyTextApp>
                  </View>
                </View>
                <View style={{ width: "100%", gap: 8 }}>
                  <MyTextApp
                    style={{ ...styles.titleContent, color: colors.title }}
                  >
                    {t("qr_code.amount")}
                  </MyTextApp>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setShowInputMoney(!showInputMoney)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      width: "100%",
                      borderRadius: 8,
                      backgroundColor: colors.input,
                      height: 52,
                      paddingLeft: 8,
                      paddingRight: 50,
                      gap: 12,
                    }}
                  >
                    <MyTextApp style={{ fontSize: 16, color: colors.title }}>
                      {amount === "" ? 0 : amount}
                    </MyTextApp>
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        right: 5,
                        height: "100%",
                        padding: 8,
                        justifyContent: "center",
                      }}
                      onPress={() => setShowInputMoney(!showInputMoney)}
                    >
                      <MyTextApp
                        style={{
                          fontSize: 16,
                          color: colors.title,
                          fontWeight: "700",
                        }}
                      >
                        {t("qr_code.edit")}
                      </MyTextApp>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View> */}
                <TouchableOpacity
                  style={styles.collapse}
                  onPress={() => {
                    setIsCollapsed(!isCollapsed);
                  }}
                >
                  <MyTextApp
                    style={{ ...styles.titleContent, color: colors.title }}
                  >
                    {t("qr_code.info_code")}
                  </MyTextApp>
                  <FeatherIcon
                    name={isCollapsed ? "chevron-down" : "chevron-up"}
                    color={colors.title}
                    size={16}
                  />
                </TouchableOpacity>
                <Collapsible collapsed={isCollapsed} style={{ width: "100%" }}>
                  <View
                    style={{
                      width: SIZES.width - 42,
                      gap: 8,
                    }}
                  >
                    <View
                      style={{
                        width: "100%",
                      }}
                    >
                      <MyTextApp
                        style={{
                          ...styles.titleContent,
                          color: colors.title,
                        }}
                      >
                        Token
                      </MyTextApp>
                      <DropdownSelectCoinComponent
                        chainID={ClassWithStaticMethod.NEMO_WALLET_CHAINID}
                        coinSelected={token}
                        setCoinSelected={setToken}
                        type={TYPE_ACTION.SEND}
                        backgroundColor={colors.input}
                      />
                    </View>
                    <View style={{ width: "100%", gap: 8 }}>
                      <MyTextApp
                        style={{
                          ...styles.titleContent,
                          color: colors.title,
                        }}
                      >
                        {t("qr_code.amount")}
                      </MyTextApp>
                      <InputComponent
                        onChangeText={(e: string) => {
                          setAmount(e);
                        }}
                        keyboardType="numeric"
                        placeholder={t("qr_code.input_amount")}
                        value={amount}
                        style={{
                          borderWidth: 0,
                          backgroundColor: colors.input,
                          height: 48,
                        }}
                      />
                    </View>
                  </View>
                </Collapsible>
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  gap: 12,
                  marginTop: 16,
                }}
              >
                <ButtonComponent
                  titleJSX={
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <MyTextApp style={{ fontWeight: "bold" }}>
                        {t("qr_code.save")}
                      </MyTextApp>
                      <FeatherIcon name="save" size={20} color={COLORS.white} />
                    </View>
                  }
                  paddingVertical={0}
                  onPress={saveQrToDisk}
                />
                <ButtonComponent
                  titleJSX={
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <MyTextApp style={{ fontWeight: "bold" }}>
                        {t("qr_code.share")}
                      </MyTextApp>
                      <FeatherIcon
                        name="share"
                        size={20}
                        color={COLORS.white}
                      />
                    </View>
                  }
                  paddingVertical={0}
                  onPress={shareQR}
                />
              </View>
            </View>

            {/* <ActionModalsComponent
              modalVisible={showInputMoney}
              closeModal={() => setShowInputMoney(false)}
            >
              <TouchableOpacity
                onPress={() => setShowInputMoney(false)}
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "transparent",
                  borderRadius: 8,
                }}
              >
                <TouchableWithoutFeedback>
                  <View
                    style={{
                      width: "100%",
                      alignItems: "flex-end",
                      height: 300,
                      elevation: 4,
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                      position: "absolute",
                      bottom: 0,
                      backgroundColor: colors.card,
                    }}
                  >
                    <View
                      style={{
                        padding: 15,
                        borderBottomColor: colors.border,
                        borderBottomWidth: 1,
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          position: "absolute",
                          right: 15,
                          padding: 8,
                          // borderWidth: 1,
                          top: 5,
                        }}
                        onPress={() => setShowInputMoney(false)}
                        activeOpacity={0.6}
                      >
                        <FeatherIcon
                          color={colors.title}
                          size={24}
                          name="x-circle"
                        />
                      </TouchableOpacity>
                      <MyTextApp
                        style={{
                          fontSize: 16,
                          color: colors.title,
                          fontWeight: "bold",
                        }}
                      >
                        {t("qr_code.custom_amount")}
                      </MyTextApp>
                    </View>
                    <View
                      style={{
                        gap: 12,
                        width: "100%",
                        paddingHorizontal: 12,
                        marginTop: 16,
                        zIndex: 999,
                      }}
                    >
                      <View style={{ width: "100%" }}>
                      <MyTextApp
                        style={{ ...styles.titleContent, color: colors.title }}
                      >
                        {t("qr_code.network")}
                      </MyTextApp>
                      <NetworkDropdown
                        bridgePools={bridgePools}
                        networkSelected={networkSelected}
                        setNetworkSelected={setnetworkSelected}
                        coinSelected={token}
                        type={TYPE_ACTION.SEND}
                        type_deposit_withdraw={TYPE_WITHDRAW.WITHDRAW}
                        isDefault={true}
                      />
                    </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </TouchableOpacity>
            </ActionModalsComponent> */}
          </View>
        </ScrollViewToTop>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: COLORS.darkBackground,
  },
  leftHeaderBack: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    columnGap: 10,
    paddingHorizontal: 16,
  },
  titleHeaderleft: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
  },
  barcodeTextURL: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  titleContent: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
  collapse: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingTop: 10,
  },
});
