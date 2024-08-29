import { COLORS, FONTS, MyTextApp, SIZES } from "../../../../themes/theme";
import {
  ImageBackground,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useRoute, useTheme } from "@react-navigation/native";

import FeatherIcon from "react-native-vector-icons/Feather";
import INO from "../../Component/INOComponent";
import { useTranslation } from "react-i18next";

export default function MysteryBoxDetailScreen({
  navigation,
}: {
  navigation: any;
}) {
  const { colors, dark } = useTheme();
  const { t } = useTranslation();
  const route = useRoute();
  const { item }: any = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          zIndex: 1,
          backgroundColor: colors.background,
          gap: 8,
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
              onPress={() => navigation.pop()}
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
            {t("event.mystery_box")}
          </MyTextApp>
          <TouchableOpacity
            style={{
              width: 60,
              height: 60,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: dark ? "#1F222A" : "#fff",
              borderRadius: 30,
              bottom: 6,
              left: 5,
            }}
            onPress={() =>
              navigation.navigate("RuleScreen", { itemID: item.serviceID })
            }
            activeOpacity={0.8}
          >
            <View
              style={{
                position: "absolute",
                width: 14,
                height: 14,
                zIndex: 1,
                backgroundColor: dark ? "#1F222A" : "#fff",
                left: -9,
                top: 12,
              }}
            >
              <View
                style={{
                  position: "absolute",
                  width: 28,
                  height: 28,
                  zIndex: 1,
                  backgroundColor: colors.background,
                  top: 0,
                  borderRadius: 14,
                  left: -19,
                }}
              ></View>
            </View>

            <FeatherIcon name="help-circle" color={colors.title} size={20} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: colors.background,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ImageBackground
          source={item.productBG}
          style={{ minHeight: SIZES.height }}
        >
          <View
            style={{
              width: "100%",
              minHeight: SIZES.height,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <View style={{ paddingVertical: 24, gap: 16 }}>
              <View style={{ gap: 8, paddingHorizontal: 20 }}>
                <MyTextApp
                  style={{
                    fontWeight: "bold",
                    color: COLORS.white,
                    fontSize: 24,
                    textAlign: "center",
                  }}
                >
                  {item.name}
                </MyTextApp>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <MyTextApp
                    style={{
                      fontWeight: "bold",
                      color: COLORS.white,
                      fontSize: 16,
                    }}
                  >
                    {item.launch_date}
                  </MyTextApp>
                  <MyTextApp
                    style={{
                      fontWeight: "bold",
                      color: COLORS.white,
                      fontSize: 16,
                    }}
                  >
                    {item.launch_time}
                  </MyTextApp>
                </View>
                <MyTextApp
                  style={{
                    color: COLORS.white,
                  }}
                >
                  {item.description}
                </MyTextApp>
              </View>
              <INO
                refreshing={refreshing}
                setRefreshing={setRefreshing}
                itemServiceID={item.serviceID}
              />
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
}
