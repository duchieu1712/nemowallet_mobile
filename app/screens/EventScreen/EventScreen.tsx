import {
  AvatarLoginedComponent,
  IconButtonNotifyComponent,
  RadiusLeft,
  RadiusRight,
} from "../../components/ButtonComponent/ButtonIconComponent";
import { COLORS, ICONS, MyTextApp, SIZES } from "../../themes/theme";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import React from "react";
import { events } from "../../config/services";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function EventScreen({ navigation }: { navigation: any }) {
  const { colors, dark } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          position: "relative",
          paddingHorizontal: 16,
          marginBottom: 16,
        }}
      >
        <AvatarLoginedComponent />
        <View
          style={{
            height: "100%",
            backgroundColor: dark ? "#1F222A" : "#fff",
            padding: 8,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            width: SIZES.width - 96 - 32 - 24, //
          }}
        >
          <RadiusLeft />
          <RadiusRight />

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("SearchScreen" as never, { screen: "Events" })
            }
            style={{
              height: 32,
              width: "100%", //
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              backgroundColor: "rgba(122, 121, 138, 0.25)",
              borderRadius: 15,
            }}
          >
            <View
              style={{
                position: "absolute",
                left: 10,
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Image
                source={ICONS.search}
                style={{
                  width: 20,
                  height: 20,
                  marginRight: 8,
                }}
              />

              <MyTextApp style={{ color: COLORS.darkText }}>
                {t("common.search")}
              </MyTextApp>
            </View>
          </TouchableOpacity>
        </View>

        <IconButtonNotifyComponent navigation={navigation} />
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <View style={styles.contentContainer}>
          {events.map((event: any, key: any) => (
            <View
              key={key}
              style={{ ...styles.eventItem, backgroundColor: colors.card }}
            >
              <View style={{ gap: 8 }}>
                <MyTextApp
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    color: colors.title,
                  }}
                >
                  {t(event.title)}
                </MyTextApp>
                <MyTextApp style={{ color: colors.title, textAlign: "left" }}>
                  {t(event.description)}
                </MyTextApp>
              </View>
              <View
                style={{
                  position: "absolute",
                  bottom: 16,
                  width: "100%",
                  left: 16,
                  gap: 16,
                }}
              >
                <View style={{ alignItems: "center", width: "100%" }}>
                  <Image
                    source={event.image}
                    style={{ width: 88, height: 88 }}
                  />
                </View>
                <View
                  style={{
                    width: "100%",
                  }}
                >
                  <ButtonComponent
                    title={t(event.textButton)}
                    onPress={() => {
                      event.url
                        ? Linking.openURL(event.url)
                        : navigation.navigate(event.linkNavigation);
                    }}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingTop: 0,
    gap: 16,
  },
  eventItem: {
    width: "47%",
    padding: 16,
    paddingBottom: 150,
    borderRadius: 8,
    gap: 32,
  },
});
