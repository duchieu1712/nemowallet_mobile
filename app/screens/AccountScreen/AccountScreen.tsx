import * as AccountActions from "../../modules/account/actions";
import * as AccountReducers from "../../modules/account/reducers";

import { APP_VERSION, APP_VERSION_EXTENSION } from "../../common/constants";
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, IMAGES, MyTextApp } from "../../themes/theme";
import React, { useEffect, useState } from "react";
import { StackActions, useTheme } from "@react-navigation/native";
import ThemeButtonComponent, {
  ChangeLanguage,
} from "../../components/ButtonComponent/ThemeButtonComponent";
import { descyptNEMOWallet, ellipseText } from "../../common/utilities";
import { useDispatch, useSelector } from "react-redux";

import ActionModalsComponent from "../../components/ModalComponent/ActionModalsComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import Clipboard from "@react-native-clipboard/clipboard";
import ContactComponent from "../../components/ContactComponent";
import FeatherIcon from "react-native-vector-icons/Feather";
import HeaderBarComponent from "../../components/HeaderComponent/HeaderComponent";
import Icon from "react-native-vector-icons/AntDesign";
import ImageLoaderComponent from "../../components/ImageComponent/ImageLoaderComponent";
import { LOCALE_STORAGE } from "../../common/enum";
import LinkWalletButtonComponent from "../../components/ButtonComponent/LinkWalletButtonComponent";
import { SignOutCustom } from "../../modules/account/utilities";
import Toast from "../../components/ToastInfo";
import TouchID from "react-native-touch-id";
import WalletConnectButtonComponent from "../../components/ButtonComponent/WalletConnectButtonComponent";
import { isEmpty } from "lodash";
import { useTranslation } from "react-i18next";

export default function AccountScreen({ navigation }: { navigation: any }) {
  const accountWeb = useSelector(AccountReducers.dataAccount);
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [isAllowBio, setIsAllowBio] = useState(false);

  const dispatchAccount = (account: any) =>
    dispatch(AccountActions.dataAccountResponse(account));

  useEffect(() => {
    TouchID.isSupported()
      .then((_) => {
        // Success code
        setIsAllowBio(true);
      })
      .catch();
  });

  const configAccounts = [
    {
      group: "account",
      title: t("account.account"),
      groupLink: [
        {
          linkWeb: false,
          label: t("account.my_account"),
          link: "MyAccountScreen",
          isLogined: true,
        },
        {
          linkWeb: false,
          label: t("account.approval"),
          link: "ApprovalScreen",
          isLogined: true,
        },
        {
          linkWeb: true,
          label: t("account.top_up"),
          link: "https://topup.nemoverse.io/",
          isLogined: false,
        },
      ],
    },
    {
      group: "security",
      title: t("account.security"),
      groupLink: [
        {
          linkWeb: false,
          label: t("account.advanced_secu"),
          link: "SecurityScreen",
          isLogined: true,
        },
        {
          linkWeb: false,
          label: t("account.touchOrFace"),
          link: false,
          isLogined: true,
        },
      ],
    },
    {
      group: "support",
      title: t("account.support"),
      groupLink: [
        {
          linkWeb: true,
          label: t("account.support_center"),
          link: "https://care.nemoverse.io/en",
          isLogined: false,
        },
        {
          linkWeb: true,
          label: t("account.about_us"),
          link: "https://nemoverse.io/about-us/",
          isLogined: false,
        },
        {
          linkWeb: true,
          label: t("account.terms"),
          link: "https://nemoverse.io/terms/",
          isLogined: false,
        },
        {
          linkWeb: true,
          label: t("account.policy"),
          link: "https://nemoverse.io/privacy_policy/",
          isLogined: false,
        },
      ],
    },
  ];

  const closeModal = () => {
    setOpenModal(false);
  };

  const [touchOrFaceID, setTouchOrFaceID] = useState<any>(null);

  useEffect(() => {
    if (touchOrFaceID === null) return;
    AsyncStorage.setItem(LOCALE_STORAGE.ON_TOUCHID, touchOrFaceID.toString());
  }, [touchOrFaceID]);

  useEffect(() => {
    AsyncStorage.getItem(LOCALE_STORAGE.ON_TOUCHID).then((value) => {
      if (!value || value === "false") {
        setTouchOrFaceID(false);
      } else if (value === "true") {
        setTouchOrFaceID(true);
      }
    });
  }, []);

  return (
    <>
      <HeaderBarComponent leftIcon={"back"} title={t("account.account")} />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: colors.background,
        }}
      >
        <View style={styles.container}>
          {accountWeb ? (
            <View style={{ ...styles.card, backgroundColor: colors.card }}>
              <View style={{ alignItems: "center", gap: 10 }}>
                {accountWeb?.profile_picture ? (
                  <ImageLoaderComponent
                    source={accountWeb?.profile_picture}
                    style={{ width: 80, height: 80, borderRadius: 40 }}
                  />
                ) : (
                  <Image
                    source={IMAGES.defaultAvatart}
                    style={{ width: 80, height: 80, borderRadius: 40 }}
                  />
                )}

                <MyTextApp
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: colors.title,
                  }}
                >
                  {accountWeb?.name}
                </MyTextApp>
                <MyTextApp style={{ color: colors.text }}>
                  {accountWeb?.email}
                </MyTextApp>
              </View>
            </View>
          ) : (
            <View
              style={{
                ...styles.card,
                backgroundColor: colors.card,
                paddingVertical: 36,
              }}
            >
              <View style={{ alignItems: "center", gap: 24 }}>
                <MyTextApp
                  style={{
                    color: colors.title,
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  {t("account.welcome")}
                </MyTextApp>
                <View style={styles.groupBtn}>
                  <ButtonComponent
                    width="48%"
                    title={t("auth.sign_up")}
                    color="#34383F"
                    borderColor="transparent"
                    onPress={() =>
                      navigation.navigate("VerifyEmailStep1Screen" as never, {
                        signup: true,
                      })
                    }
                  />
                  <ButtonComponent
                    width="48%"
                    title={t("auth.sign_in")}
                    onPress={() => navigation.navigate("SignInScreen" as never)}
                  />
                </View>
              </View>
            </View>
          )}
          <View style={{ gap: 24, paddingTop: 16 }}>
            {accountWeb && (
              <View style={styles.block}>
                <View>
                  <MyTextApp style={{ color: colors.text, marginBottom: 4 }}>
                    {t("account.nemo_wallet")}
                  </MyTextApp>
                  <TouchableOpacity
                    style={styles.copy}
                    onPress={() => {
                      Clipboard.setString(
                        descyptNEMOWallet(accountWeb?.nemo_address),
                      );
                      // toast({
                      //   title: t("copied"),
                      //   message: 'czmnxbcmasbkedjqwheiqhdnaksdnaskndkndkjahsdiqwhieuqwieuqhwiueqwheiwqhei',
                      //   preset: "done",
                      // });
                      Toast.success(
                        `${t("common.copied")}: ${descyptNEMOWallet(
                          accountWeb?.nemo_address,
                        )}`,
                      );
                    }}
                  >
                    <MyTextApp style={{ color: colors.title }}>
                      {ellipseText(
                        descyptNEMOWallet(accountWeb?.nemo_address),
                        15,
                      )}
                    </MyTextApp>
                    <FeatherIcon name="copy" size={16} color={colors.title} />
                  </TouchableOpacity>
                </View>
                <View>
                  <MyTextApp style={{ color: colors.text, marginBottom: 4 }}>
                    {t("account.meta_wallet")}
                  </MyTextApp>
                  {accountWeb?.wallet_address?.length === 0 ? (
                    <View>
                      <ButtonComponent
                        title={t("account.link_wallet")}
                        onPress={() => {
                          setOpenModal(true);
                        }}
                        color="transparent"
                        textColor={colors.title}
                      />
                      <ActionModalsComponent
                        modalVisible={openModal}
                        closeModal={closeModal}
                        iconClose
                      >
                        <View
                          style={{
                            ...styles.modalContent,
                            backgroundColor: colors.card,
                          }}
                        >
                          <View style={{ position: "relative", width: "100%" }}>
                            <MyTextApp
                              style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                color: colors.title,
                                textAlign: "center",
                              }}
                            >
                              {t("account.link_address")}
                            </MyTextApp>
                          </View>
                          <MyTextApp
                            style={{
                              color: colors.text,
                              textAlign: "center",
                            }}
                          >
                            {t("account.link_address_content")}
                          </MyTextApp>
                          <View style={{ gap: 8, width: "100%" }}>
                            <WalletConnectButtonComponent
                              styleConnect={{ color: colors.title }}
                            />
                            <LinkWalletButtonComponent
                              navigation={navigation}
                            />
                          </View>
                        </View>
                      </ActionModalsComponent>
                    </View>
                  ) : (
                    <View style={{ gap: 8 }}>
                      {accountWeb.wallet_address.map((item: any, key: any) => (
                        <TouchableOpacity
                          key={`${key}a`}
                          style={styles.copy}
                          onPress={() => {
                            Clipboard.setString(descyptNEMOWallet(item));
                            Toast.success(t("copied"));
                          }}
                        >
                          <MyTextApp style={{ color: colors.title }}>
                            {ellipseText(descyptNEMOWallet(item), 15)}
                          </MyTextApp>
                          <FeatherIcon
                            name="copy"
                            size={16}
                            color={colors.title}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            )}
            {configAccounts
              .filter((t: any) =>
                t.groupLink.some(
                  (e: any) => (e.isLogined && accountWeb) || !e.isLogined,
                ),
              )
              .map((config: any, key: any) => (
                <View style={styles.block} key={`${key}b`}>
                  <MyTextApp style={{ color: colors.text }}>
                    {config.title}
                  </MyTextApp>
                  {config.groupLink
                    .filter(
                      (e: any) => (e.isLogined && accountWeb) || !e.isLogined,
                    )
                    .map((item: any, key: any) =>
                      item.linkWeb ? (
                        <TouchableOpacity
                          key={`${key}c`}
                          style={styles.link}
                          onPress={async () => await Linking.openURL(item.link)}
                        >
                          <MyTextApp
                            style={{ color: colors.title, fontWeight: "bold" }}
                          >
                            {item.label}
                          </MyTextApp>
                          <Icon name="right" color={colors.title} size={14} />
                        </TouchableOpacity>
                      ) : !item.link ? (
                        isAllowBio && (
                          <TouchableOpacity
                            style={styles.link}
                            activeOpacity={0.8}
                            onPress={() => {
                              TouchID.authenticate("")
                                .then(async (success: any) => {
                                  setTouchOrFaceID(!touchOrFaceID);
                                })
                                .catch((error: any) => {
                                  Alert.alert(
                                    "Authentication Failed",
                                    error.message,
                                  );
                                });
                            }}
                          >
                            <MyTextApp
                              style={{
                                color: colors.title,
                                fontWeight: "bold",
                              }}
                            >
                              {item.label}
                            </MyTextApp>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: colors.tabBar,
                                borderRadius: 10,
                                width: 50,
                                height: 20,
                              }}
                            >
                              <View
                                style={{
                                  width: 15,
                                  height: 15,
                                  backgroundColor: colors.primary,
                                  borderRadius: 8,
                                  position: "absolute",
                                  left: touchOrFaceID ? 30 : 4,
                                }}
                              ></View>
                            </View>
                          </TouchableOpacity>
                        )
                      ) : (
                        <TouchableOpacity
                          style={styles.link}
                          onPress={() =>
                            navigation.navigate(item.link, {
                              account: accountWeb,
                            })
                          }
                        >
                          <MyTextApp
                            style={{ color: colors.title, fontWeight: "bold" }}
                          >
                            {item.label}
                          </MyTextApp>
                          <Icon name="right" color={colors.title} size={14} />
                        </TouchableOpacity>
                      ),
                    )}
                </View>
              ))}

            <View style={styles.block}>
              <MyTextApp style={{ color: colors.text }}>
                {t("account.setting")}
              </MyTextApp>
              <View style={{ ...styles.link, height: 40 }}>
                <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
                  {t("account.theme")}
                </MyTextApp>
                <ThemeButtonComponent />
              </View>
              <View style={{ ...styles.link, height: 40 }}>
                <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
                  {t("account.language")}
                </MyTextApp>
                <ChangeLanguage />
              </View>
            </View>
            {accountWeb && (
              <View style={styles.block}>
                <ButtonComponent
                  title={t("account.logout")}
                  onPress={async () => {
                    SignOutCustom(dispatchAccount);
                    const popAction = StackActions.pop(2);
                    await navigation.dispatch(popAction);
                    navigation.replace("SignInScreen");
                  }}
                />
              </View>
            )}
          </View>
          <ContactComponent />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
              marginTop: 20,
            }}
          >
            <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
              {t("account.nemo_wallet")}
            </MyTextApp>
            <MyTextApp style={{ color: colors.title }}>
              {`${t("account.version")}: ${APP_VERSION}${
                isEmpty(APP_VERSION_EXTENSION)
                  ? ""
                  : `+${APP_VERSION_EXTENSION}`
              }`}
            </MyTextApp>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  card: {
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
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
    marginTop: 8,
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
