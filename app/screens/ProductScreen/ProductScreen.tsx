import { COLORS, FONTS, ICONS, MyTextApp, SIZES } from "../../themes/theme";
import {
  Image,
  ImageBackground,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { useRoute, useTheme } from "@react-navigation/native";
import FeatherIcon from "react-native-vector-icons/Feather";
import Slick from "react-native-slick";
import { cf_services } from "../../config/services";
import { useTranslation } from "react-i18next";

export default function ProductScreen({ navigation }: { navigation: any }) {
  const route = useRoute();
  const { colors, dark } = useTheme();
  const params: any = route.params;
  useEffect(() => {
    if (!params?.item) return;
    scrollToService(params.item.serviceID);
  }, [route]);

  const scrollToService = (serviceID: any) => {
    const index1 = cf_services
      .filter((e) => e.isActive)
      ?.findIndex((e) => e.serviceID === serviceID);
    if (ref.current) {
      ref.current.scrollTo(index1 + 1); // Cuộn sang phần tử tiếp theo
    }
  };
  const ref = useRef<any | null>(null);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          ...styles.rightHeader,
          width: 60,
          height: 60,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: dark ? "#1F222A" : "#fff",
          borderRadius: 30,
          top: -10,
          right: -8,
          position: "absolute",
          zIndex: 2222,
          // borderWidth: 1,
          // borderColor: "red"
        }}
        activeOpacity={1}
        onPress={() =>
          navigation.navigate("SearchScreen" as never, {
            screen: "Product",
            callback: (e: any) => {
              e && scrollToService(e?.serviceID);
            },
          })
        }
      >
        <FeatherIcon
          name="search"
          size={24}
          color={colors.title}
          style={{ position: "absolute", bottom: 16, zIndex: 2 }}
        />
      </TouchableOpacity>

      <Slick
        ref={ref}
        // showsButtons
        style={styles.slick}
        autoplay
        autoplayTimeout={5}
        bounces
        centerContent
        showsPagination={false}
        buttonWrapperStyle={{
          alignItems: "flex-end",
          height: 80,
          top: SIZES.height / 2 + 15,
          paddingHorizontal: 35,
        }}
      >
        {cf_services
          .filter((e) => e.isActive)
          ?.map((e, i) => {
            return <ReturnData key={i} item={e} />;
          })}
      </Slick>
    </View>
  );
}

const ReturnData = ({ item, key }: { item: any; key: any }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <ScrollView key={key}>
      <ImageBackground source={item.productBG} style={{ height: SIZES.height }}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "flex-end",
            position: "absolute",
            width: "100%",
            top: SIZES.height / 2 + 16,
          }}
          key={key}
        >
          <View
            style={{
              position: "relative",
              width: 192,
              height: 96,
              borderRadius: 12,
              borderColor: "rgba(0,0,0,0.6)",
              borderWidth: 1,
            }}
          >
            <Image
              source={item.logoGame}
              alt=""
              style={{
                width: 64,
                height: 64,
                position: "absolute",
                zIndex: 1,
                top: 16,
                left: 16,
                borderRadius: 12,
              }}
            />
            <Image
              source={item.image_select}
              style={{
                width: 192,
                height: 96,
                borderRadius: 12,
              }}
            />
          </View>
          <View
            style={{
              marginTop: 16,
              marginBottom: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {item?.desciption !== "" &&
              item?.desciption.split(",").map((t: any, i: any) => {
                if (i !== item?.desciption.split(",").length - 1) {
                  return (
                    <View
                      key={i}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MyTextApp>{t}</MyTextApp>
                      <MyTextApp style={styles.dot}></MyTextApp>
                    </View>
                  );
                } else return <MyTextApp key={i}>{t}</MyTextApp>;
              })}
          </View>
          {!item?.isComingSoon ? (
            <View style={[{ ...styles.grBtn }]}>
              <TouchableOpacity
                style={[styles.btnHome]}
                activeOpacity={0.8}
                disabled={item?.linkHomePage === ""}
                onPress={async () => await Linking.openURL(item?.linkHomePage)}
              >
                <Image
                  source={ICONS.homeWhite}
                  style={{ width: 24, height: 24 }}
                />
                <MyTextApp style={{ ...FONTS.fontBold, ...FONTS.font }}>
                  {t("wallet.homepage")}
                </MyTextApp>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnMarket}
                disabled={item?.linkCHPlay === ""}
                onPress={async () => await Linking.openURL(item.linkCHPlay)}
              >
                <Image source={ICONS.chplay} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnMarket}
                disabled={item?.linkIOS === ""}
                onPress={async () => await Linking.openURL(item.linkIOS)}
              >
                <Image source={ICONS.appstore} />
              </TouchableOpacity>
            </View>
          ) : (
            <MyTextApp style={{ color: colors.title, ...FONTS.font }}>
              {t("wallet.comming_soon")}
            </MyTextApp>
          )}
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: SIZES.width,
    minHeight: SIZES.height - 80,
    // borderWidth: 1,
    // borderColor: "red",
  },
  background: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    // alignItems: "flex-end",
  },
  rightHeader: {
    width: 60,
    height: 60,
    borderRadius: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    bottom: 5,
  },
  slick: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  grBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
  },
  btnHome: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(122, 121, 138, 0.50)",
    backgroundColor: "rgba(122, 121, 138, 0.25)",
  },
  btnMarket: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(122, 121, 138, 0.50)",
    backgroundColor: "rgba(122, 121, 138, 0.25)",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 3,
    color: COLORS.white,
    backgroundColor: COLORS.white,
    marginLeft: 4,
    marginRight: 4,
  },
});
