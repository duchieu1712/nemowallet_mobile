import { COLORS, MyTextApp, SIZES } from "../../themes/theme";
import {
  Image,
  ImageBackground,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";

import ActionModalsComponent from "./ActionModalsComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import CheckBox from "@react-native-community/checkbox";
import Icon from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import { LINK_WALLET } from "../../common/constants";
import { LOCALE_STORAGE } from "../../common/enum";
import { cf_homepage } from "../../config/homepage";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function AdvertisementComponent(): any {
  const [onAction, setOnAction] = useState(false);
  const [showAgain, setShowAgain] = useState(false);
  const { t } = useTranslation();
  const { colors } = useTheme();

  useEffect(() => {
    //
    async function OnAction() {
      const timeView = await AsyncStorage.getItem(
        LOCALE_STORAGE.SHOW_AGAIN_BANNER,
      );
      if (!timeView) {
        setOnAction(true);
      } else {
        const time = dayjs().valueOf();
        if (time > parseInt(timeView)) {
          setOnAction(true);
        }
      }
    }
    OnAction();
  }, []);

  return (
    // onAction &&
    // false && (

    <>
      {/* modal for testnet */}
      <ActionModalsComponent
        closeModal={() => {
          setOnAction(false);
          if (showAgain) {
            const time = dayjs().valueOf() + 3600 * 24 * 1000;
            AsyncStorage.setItem(
              LOCALE_STORAGE.SHOW_AGAIN_BANNER,
              time.toString(),
            );
          }
        }}
        modalVisible={onAction && false}
        iconClose
        positionIconClose={{
          top: 0,
          right: 20,
        }}
      >
        <View style={{ ...styles.modalContent, backgroundColor: colors.card }}>
          <Image
            source={require("../../assets/images/images_n69/component/pwarning.png")}
            style={{
              marginTop: 50,
            }}
          />
          <View
            style={{
              alignItems: "center",
            }}
          >
            <MyTextApp
              style={{
                marginVertical: 16,
                fontSize: 30,
                textTransform: "uppercase",
                fontWeight: "bold",
              }}
            >
              {t("warning")}
            </MyTextApp>
            <MyTextApp style={{ color: colors.title, fontSize: 16 }}>
              {t("common.testnet_cogi")}
            </MyTextApp>
          </View>
          <View style={{ marginBottom: 16, marginTop: 4 }}>
            <MyTextApp style={{ color: colors.title, fontSize: 16 }}>
              {t("common.mainnet_cogi")}
              <MyTextApp
                style={{ color: COLORS.blue }}
                onPress={async () => await Linking.openURL(LINK_WALLET)}
              >
                {" "}
                {LINK_WALLET}
              </MyTextApp>
            </MyTextApp>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              // borderWidth: 1, borderColor: "red"
            }}
          >
            <CheckBox
              onChange={() => {
                setShowAgain(!showAgain);
                return false;
              }}
              value={showAgain}
              style={{ backfaceVisibility: "visible" }}
              tintColors={{
                // true: isRemember,
                // false: !isRemember
                true: COLORS.primary,
                false: COLORS.descriptionText,
              }} // Android only - true = backgroundcolor value of checkbox; false = border color value of checkbox
              // iOS only
              tintColor={COLORS.descriptionText} // color of line when checkbox off
              onCheckColor={COLORS.white} // color of check mark when checkbox on
              onFillColor={COLORS.primary} // background checkbox when on
              onTintColor={COLORS.primary} // color of line when checkbox on
            />
            <MyTextApp
              onPress={() => {
                setShowAgain(!showAgain);
                return false;
              }}
              style={{ color: colors.title }}
            >
              {t("common.do_not_show_24h")}
            </MyTextApp>
          </View>
        </View>
      </ActionModalsComponent>

      {/* modal for PROD */}

      <ActionModalsComponent
        closeModal={() => {
          setOnAction(false);
          if (showAgain) {
            const time = dayjs().valueOf() + 3600 * 24 * 1000;
            AsyncStorage.setItem(
              LOCALE_STORAGE.SHOW_AGAIN_BANNER,
              time.toString(),
            );
          }
        }}
        modalVisible={onAction}
      >
        <View
          style={{
            width: SIZES.width > 320 ? "85%" : "90%",
            alignItems: "flex-start",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              style={{
                width: "100%",
              }}
            >
              <ImageBackground
                source={require("../../assets/images/images_n69/component/banner.png")}
                style={{
                  width: "100%",
                  height: 420,
                }}
                borderRadius={12}
                resizeMode="cover"
                resizeMethod="resize"
              />
            </TouchableOpacity>

            <View style={{ marginTop: 8 }}>
              {!isEmpty(cf_homepage.BannerAdvertisment.textButton) && (
                <ButtonComponent
                  title={cf_homepage.BannerAdvertisment?.textButton}
                  onPress={async () =>
                    await Linking.openURL(
                      cf_homepage.BannerAdvertisment.linkPlayNow,
                    )
                  }
                />
              )}
              {cf_homepage.BannerAdvertisment.isLinkDownload && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    marginTop: 8,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    activeOpacity={0.9}
                    disabled={isEmpty(cf_homepage.BannerAdvertisment.linkPC)}
                    onPress={async () =>
                      await Linking.openURL(
                        cf_homepage.BannerAdvertisment.linkPC,
                      )
                    }
                  >
                    <Icon name="windows" color={COLORS.white} size={24} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    disabled={isEmpty(cf_homepage.BannerAdvertisment.linkIOS)}
                    onPress={async () =>
                      await Linking.openURL(
                        cf_homepage.BannerAdvertisment.linkIOS,
                      )
                    }
                  >
                    <Icon name="apple-o" color={COLORS.white} size={24} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    disabled={isEmpty(
                      cf_homepage.BannerAdvertisment.linkAndroid,
                    )}
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={async () =>
                      await Linking.openURL(
                        cf_homepage.BannerAdvertisment.linkAndroid,
                      )
                    }
                  >
                    <Ionicons
                      name="ios-logo-google-playstore"
                      color={COLORS.white}
                      size={24}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <View
            style={{
              // marginTop: 2,
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                // width: "100%",
                gap: 2,
              }}
            >
              <CheckBox
                onChange={() => {
                  setShowAgain(!showAgain);
                  return false;
                }}
                value={showAgain}
                style={{ backfaceVisibility: "visible" }}
                tintColors={{
                  true: COLORS.primary,
                  false: COLORS.descriptionText,
                }} // Android only - true = backgroundcolor value of checkbox; false = border color value of checkbox
                // iOS only
                tintColor={COLORS.descriptionText} // color of line when checkbox off
                onCheckColor={COLORS.white} // color of check mark when checkbox on
                onFillColor={COLORS.primary} // background checkbox when on
                onTintColor={COLORS.primary} // color of line when checkbox on
              />
              <MyTextApp
                style={{
                  fontSize: 16,
                  color: COLORS.white,
                  fontWeight: "bold",
                }}
                onPress={() => {
                  setShowAgain(!showAgain);
                  return false;
                }}
              >
                {t("common.do_not_show_24h")}
              </MyTextApp>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setOnAction(false);
                if (showAgain) {
                  const time = dayjs().valueOf() + 3600 * 24 * 1000;
                  AsyncStorage.setItem(
                    LOCALE_STORAGE.SHOW_AGAIN_BANNER,
                    time.toString(),
                  );
                }
              }}
            >
              <Icon name="close" color={COLORS.white} size={24} />
            </TouchableOpacity>
          </View>
        </View>
      </ActionModalsComponent>
    </>

    // )
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
