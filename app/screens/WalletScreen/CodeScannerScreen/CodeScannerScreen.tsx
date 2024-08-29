import { FONTS, MyTextApp } from "../../../themes/theme";
import { TouchableOpacity, View } from "react-native";

import FeatherIcon from "react-native-vector-icons/Feather";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import React from "react";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const CodeScannerScreen = ({ navigation }: { navigation: any }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const onSuccess = (e: any) => {
    navigation.navigate("WithdrawScreen", { dataQr: JSON.parse(e.data) });
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          zIndex: 1,
          backgroundColor: colors.background,
        }}
      >
        <View
          style={{
            height: 48,
            backgroundColor: colors.background,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              height: 48,
              width: 48,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                height: "100%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FeatherIcon name="arrow-left" size={22} color={colors.title} />
            </TouchableOpacity>
          </View>
          <MyTextApp
            style={{
              flex: 1,
              textAlign: "left",
              ...FONTS.h5,
              ...FONTS.fontBold,
              color: colors.title,
            }}
          >
            {t("wallet.scan_qr")}
          </MyTextApp>
        </View>
      </View>
      <QRCodeScanner
        onRead={onSuccess}
        flashMode={RNCamera.Constants.FlashMode.off}
        showMarker={true}
        reactivate={false}
        // topContent={
        //   <MyTextApp style={styles.centerText}>
        //     Go to{' '}
        //     <MyTextApp style={styles.textBold}>wikipedia.org/wiki/QR_code</MyTextApp> on
        //     your computer and scan the QR code.
        //   </MyTextApp>
        // }
        // bottomContent={
        //   <TouchableOpacity style={styles.buttonTouchable}>
        //     <MyTextApp style={styles.buttonText}>OK. Got it!</MyTextApp>
        //   </TouchableOpacity>
        // }
        // reactivate={false}
        //   showMarker={true}
        //   ref={node => {
        //     this.scanner = node;
        //   }}
        //   onRead={onSuccess}
      />
    </View>
  );
};

export default CodeScannerScreen;
