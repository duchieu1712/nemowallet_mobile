import * as AccountActions from "../modules/account/actions";
import * as AccountReducers from "../modules/account/reducers";

import { FONTS, MyTextApp } from "../themes/theme";
import { Image, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import ActionModalsComponent from "./ModalComponent/ActionModalsComponent";
import ButtonComponent from "./ButtonComponent/ButtonComponent";
import { SignOutCustom } from "../modules/account/utilities";
import { StackActions, useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export function RequestSignOutComponent({
  navigation,
}: {
  navigation: any;
}): any {
  const dispatch = useDispatch();
  const requestSignOut = useSelector(AccountReducers.requestSignOut);
  const dispatchAccount = (account: any) =>
    dispatch(AccountActions.dataAccountResponse(account));
  const dispatchSetRequestSignOut = (flag: any) =>
    dispatch(AccountActions.setRequestSignOut(flag));

  const { t } = useTranslation();
  const { colors } = useTheme();

  const handleClose = () => {};

  return (
    <>
      <ActionModalsComponent
        modalVisible={requestSignOut}
        closeModal={handleClose}
      >
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 16,
            alignItems: "center",
            gap: 16,
            width: "90%",
          }}
        >
          <MyTextApp
            style={{
              fontSize: 22,
              textAlign: "center",
              ...FONTS.fontBold,
              marginTop: 16,
              textTransform: "uppercase",
              color: colors.title,
            }}
          >
            {t("common.notification")}
          </MyTextApp>
          <View style={{ alignItems: "center" }}>
            <MyTextApp
              style={{
                fontSize: 16,
                textAlign: "center",
                marginBottom: 16,
                color: colors.title,
              }}
            >
              {t("common.session_ended")}
            </MyTextApp>
            <Image
              source={require("../assets/images/images_n69/component/pwarning.png")}
              alt=""
              style={{ maxWidth: 200, maxHeight: 200 }}
            />
            <MyTextApp
              style={{
                textAlign: "center",
                color: colors.title,
                marginTop: 16,
                fontSize: 16,
              }}
            >
              {t("common.please_resign_in")}
            </MyTextApp>
          </View>
          <ButtonComponent
            title={"OK"}
            onPress={() => {
              SignOutCustom(dispatchAccount);
              dispatchSetRequestSignOut(false);
              const stackLength = navigation.getState().routes.length;
              const popAction = StackActions.pop(stackLength);
              navigation.dispatch(popAction);
              const replaceAction = StackActions.replace(
                "SignInScreen" as never,
              );
              navigation.dispatch(replaceAction);
            }}
          />
        </View>
      </ActionModalsComponent>
    </>
  );
}
