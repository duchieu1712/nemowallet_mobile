import { COLORS, FONTS, IMAGES, MyTextApp } from "../../../themes/theme";
import { Image, View } from "react-native";

import ActionModalsComponent from "../../../components/ModalComponent/ActionModalsComponent";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import { OpenTxIDLinkComponent } from "../../../components/OpenLinkComponent";
import { StepByStep } from "./StepByStepComponent";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function ConfirmSendTokenComponent({
  tx,
  onAction,
  setOnAction,
  valueStep,
  setValueStep,
  navigation,
}: {
  tx: any;
  onAction: any;
  setOnAction: any;
  valueStep: any;
  setValueStep: any;
  navigation: any;
}): JSX.Element {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const listName = [
    t("wallet.withdraw_screen.withdraw_token"),
    t("common.processing"),
    t("wallet.withdraw_screen.receive_token"),
    t("common.complete"),
  ];

  return (
    <>
      <ActionModalsComponent
        isAllowCloseClickOutSide={false}
        modalVisible={onAction}
        closeModal={() => {
          if (valueStep !== 2 || valueStep !== 3) {
            setOnAction(false);
            setValueStep(1);
          }
        }}
        iconClose={valueStep !== 1 && valueStep !== 2}
        // positionIconClose={{
        //   right: 30,
        //   top: 10,
        // }}
      >
        <View
          style={{
            width: "90%",
            maxWidth: 350,
            backgroundColor: colors.card,
            paddingVertical: 24,
            paddingHorizontal: 16,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <StepByStep value={valueStep} listName={listName} />
          {valueStep === 0 && (
            <View style={{ width: "100%", alignItems: "center", gap: 16 }}>
              <MyTextApp
                style={{
                  color: colors.title,
                  ...FONTS.fontBold,
                  fontSize: 18,
                }}
              >
                {t("common.waiting_confirm")}
              </MyTextApp>
              <Image source={IMAGES.processing} />
              <View style={{ alignItems: "center" }}>
                <MyTextApp
                  style={{
                    color: colors.title,
                    textAlign: "center",
                    fontSize: 16,
                  }}
                >
                  {t("wallet.withdraw_screen.tx_initiated")}
                </MyTextApp>
                <MyTextApp
                  style={{
                    color: colors.title,
                    textAlign: "center",
                    fontSize: 16,
                  }}
                >
                  {t("wallet.withdraw_screen.waiting_confirmation")}
                </MyTextApp>
              </View>
            </View>
          )}
          {valueStep === 1 && (
            <View style={{ width: "100%", alignItems: "center", gap: 16 }}>
              <Image source={IMAGES.processing} style={{ marginTop: 16 }} />
              <MyTextApp
                style={{
                  color: COLORS.blue,
                  ...FONTS.fontBold,
                  fontSize: 18,
                }}
              >
                {t("common.processing")}
              </MyTextApp>
              <MyTextApp
                style={{
                  color: colors.title,
                  textAlign: "center",
                  fontSize: 16,
                }}
              >
                {t("wallet.withdraw_screen.dont_leave_page")}
              </MyTextApp>
            </View>
          )}
          {valueStep === 2 && (
            <View style={{ width: "100%", alignItems: "center", gap: 16 }}>
              <Image source={IMAGES.processing} style={{ marginTo: 16 }} />
              <MyTextApp
                style={{
                  color: COLORS.blue,
                  ...FONTS.fontBold,
                  fontSize: 18,
                }}
              >
                {t("common.processing")}
              </MyTextApp>
              <MyTextApp
                style={{
                  color: colors.title,
                  textAlign: "center",
                  fontSize: 16,
                }}
              >
                {t("wallet.withdraw_screen.confirm_account_receive_token")}
              </MyTextApp>
              {tx && (
                <View>
                  <MyTextApp
                    style={{
                      color: colors.title,
                      ...FONTS.fontBold,
                      fontSize: 18,
                    }}
                  >
                    {t("wallet.withdraw_screen.tx_hash")}
                  </MyTextApp>
                  <OpenTxIDLinkComponent TxID={tx}>{tx}</OpenTxIDLinkComponent>
                </View>
              )}
            </View>
          )}
          {valueStep === 3 && (
            <View style={{ width: "100%", alignItems: "center", gap: 16 }}>
              <Image
                source={IMAGES.success}
                style={{
                  marginTop: 16,
                }}
              />
              <MyTextApp
                style={{
                  color: COLORS.success_2,
                  ...FONTS.fontBold,
                  fontSize: 18,
                }}
              >
                {t("common.success")}
              </MyTextApp>
              <View
                style={{
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <MyTextApp
                  style={{
                    color: colors.title,
                    textAlign: "center",
                    fontSize: 16,
                  }}
                >
                  {t("common.congrates")} !
                </MyTextApp>
                <MyTextApp
                  style={{
                    color: colors.title,
                    textAlign: "center",
                    fontSize: 16,
                  }}
                >
                  {t("wallet.withdraw_screen.token_sent")}
                </MyTextApp>
              </View>
              <ButtonComponent
                title={t("wallet.nemo_wallet")}
                style={{ marginTop: 16 }}
                onPress={() => {
                  navigation.replace("DrawerNavigation");
                }}
              />
            </View>
          )}
          {valueStep === 4 && (
            <View style={{ width: "100%", alignItems: "center", gap: 16 }}>
              <Image
                source={IMAGES.error}
                style={{
                  marginTop: 16,
                }}
              />
              <MyTextApp
                style={{
                  color: COLORS.offer,
                  ...FONTS.fontBold,
                  fontSize: 18,
                }}
              >
                {t("common.error")}
              </MyTextApp>
              <MyTextApp
                style={{
                  color: colors.title,
                  textAlign: "center",
                  fontSize: 16,
                }}
              >
                {t("wallet.withdraw_screen.error_processing")}
              </MyTextApp>
            </View>
          )}
        </View>
      </ActionModalsComponent>
    </>
  );
}
