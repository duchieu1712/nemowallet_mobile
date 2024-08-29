import { COLORS, MyTextApp, SIZES } from "../../../themes/theme";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import HeaderBarComponent from "../../../components/HeaderComponent/HeaderComponent";
import React from "react";
import Slick from "react-native-slick";
import dayjs from "dayjs";
import cf_info_INO from "../../../config/mysterybox/info";
import { useTranslation } from "react-i18next";

export default function MysteryBoxScreen({ navigation }: { navigation: any }) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <HeaderBarComponent leftIcon="back" title={t("event.mystery_box")} />
      <Slick
        // showsButtons
        loop
        style={styles.slick}
        //   horizontal
        autoplay
        autoplayTimeout={5}
        bounces
        centerContent
        showsPagination={false}
        buttonWrapperStyle={{
          alignItems: "flex-end",
          height: 80,
          top: 270,
          paddingHorizontal: 35,
        }}
      >
        {cf_info_INO.map((e: any, i: any) => {
          return (
            <ScrollView key={i}>
              <ReturnData item={e} nav={navigation} />
            </ScrollView>
          );
        })}
      </Slick>
    </View>
  );
}

const ReturnData = ({ item, nav }: { item: any; nav: any }) => {
  const { t } = useTranslation();

  const getRoundINOEvent = () => {
    const now = Math.floor(dayjs().valueOf() / 1000);
    const res = item?.round?.find(
      (e: any) => e.startTime <= now && e.endTime >= now,
    );
    return res;
  };

  return (
    <ScrollView>
      <ImageBackground
        source={item.productBG}
        style={{ minHeight: SIZES.height }}
      >
        <View
          style={{
            width: "100%",
            minHeight: SIZES.height,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            paddingTop: 20,
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "flex-end",
              width: "100%",
              paddingHorizontal: 16,
              gap: 30,
            }}
          >
            <View style={{ width: "100%" }}>
              <Image
                source={item.character_image}
                style={{ width: "100%", height: 250 }}
                resizeMode="contain"
              />
            </View>
            <Image
              source={item.image_select}
              style={{
                width: 192,
                height: 96,
                borderRadius: 12,
              }}
            />
            <View style={{ gap: 16, width: "100%" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <MyTextApp
                  style={{
                    fontWeight: "bold",
                    color: COLORS.white,
                    fontSize: 24,
                  }}
                >
                  {item.name}
                </MyTextApp>
                <View
                  style={{
                    backgroundColor: COLORS.success_4,
                    paddingHorizontal: 14,
                    paddingVertical: 9,
                    borderRadius: 8,
                  }}
                >
                  <MyTextApp
                    style={{
                      fontWeight: "bold",
                      color: COLORS.success_3,
                      fontSize: 16,
                    }}
                  >
                    {getRoundINOEvent()?.name}
                  </MyTextApp>
                </View>
              </View>
              <MyTextApp
                style={{
                  color: COLORS.white,
                }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.description}
              </MyTextApp>
              <View
                style={{
                  height: 1,
                  width: "100%",
                  backgroundColor: COLORS.divider,
                }}
              ></View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <MyTextApp
                  style={{
                    color: COLORS.white,
                    fontSize: 16,
                  }}
                >
                  {t("event.launch_date")}
                </MyTextApp>
                <MyTextApp
                  style={{
                    fontWeight: "bold",
                    color: COLORS.white,
                    fontSize: 16,
                  }}
                >
                  {item.launch_date}
                </MyTextApp>
              </View>
              <ButtonComponent
                title={t("event.go_mystery_event")}
                onPress={() => nav.navigate("MysteryBoxDetailScreen", { item })}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SIZES.width,
    minHeight: SIZES.height,
  },
  background: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    // alignItems: "flex-end",
  },
  slick: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    position: "relative",
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
