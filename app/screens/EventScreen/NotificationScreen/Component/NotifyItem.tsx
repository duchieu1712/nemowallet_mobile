import {
  COLORS,
  FONTS,
  ICONS,
  MyTextApp,
  SIZES,
} from "../../../../themes/theme";
import { Image, ImageBackground, TouchableOpacity, View } from "react-native";
import {
  ellipseAddress,
  timestampToHuman_v2,
} from "../../../../common/utilities";
import { useNavigation, useTheme } from "@react-navigation/native";

import AntIcon from "react-native-vector-icons/AntDesign";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import { TYPE_NOTIFY } from "../../../../common/enum";

export default function NotifyItem({ item, tab }: { item: any; tab: any }) {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingVertical: 8,
        width: "100%",
      }}
      activeOpacity={0.8}
      onPress={() => {
        if (item.seen === false) {
          item.seen = true;
        }
        navigation.navigate("DetailNotifyScreen" as never, { item });
      }}
    >
      <View
        style={{
          backgroundColor: colors.card,
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          opacity: item.seen ? 0.7 : 1,
        }}
      >
        {item.type === TYPE_NOTIFY.CHANGE ? (
          <Icon name="bell" color={COLORS.yellow} size={24} />
        ) : (
          <View
            style={{
              backgroundColor: COLORS.success_5,
              width: 24,
              height: 24,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AntIcon name="swap" color={"#1f1f2c"} size={20} />
          </View>
        )}
        {!item.seen && (
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: COLORS.red,
              position: "absolute",
              right: 0,
              top: 0,
            }}
          ></View>
        )}
      </View>
      <View
        style={{
          minHeight: item.type === TYPE_NOTIFY.SWAP ? 60 : 40,
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          width: SIZES.width - 40 - 8 - 32,
        }}
      >
        <View style={{ gap: 4 }}>
          <MyTextApp
            style={{
              fontWeight: "bold",
              color: item.seen ? colors.text : colors.title,
            }}
          >
            {item.title}
          </MyTextApp>
          {/* {tab === "transactions" && (
          <MyTextApp>
            {t("notifications.address")}: {item.address}
          </MyTextApp>
        )} */}
          {item.type === TYPE_NOTIFY.SWAP && (
            <MyTextApp style={{ color: colors.text, fontSize: 12 }}>
              Address: {ellipseAddress(item.address)}
            </MyTextApp>
          )}
          <MyTextApp style={{ color: colors.text, fontSize: 12 }}>
            {timestampToHuman_v2(item.date)}
          </MyTextApp>
        </View>
        {item.type === TYPE_NOTIFY.SWAP && (
          <View
            style={{
              alignItems: "flex-end",
              justifyContent: "flex-start",
              gap: 8,
              // borderWidth: 1,
              // borderColor: "red",
              flex: 1,
              height: 60,
              paddingLeft: 30,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <MyTextApp
                style={{ ...FONTS.fontBold, color: COLORS.success_5 }}
                numberOfLines={1}
              >
                + {item.from.amount}
              </MyTextApp>
              <Image
                source={ICONS[item.from.symbol.toLowerCase()]}
                style={{ width: 16, height: 16 }}
              />
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <MyTextApp
                style={{
                  ...FONTS.fontBold,
                  color: COLORS.danger,
                  // textAlign: "right",
                  // borderWidth: 1,
                  // borderColor: "red"
                }}
                numberOfLines={1}
              >
                - {item.to.amount}
              </MyTextApp>
              <Image
                source={ICONS[item.to.symbol.toLowerCase()]}
                style={{ width: 16, height: 16 }}
              />
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export function NotifyTxItem({
  item,
  tab,
  key,
  callback,
}: {
  item: any;
  tab: any;
  key: any;
  callback: any;
}) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      key={key}
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingVertical: 8,
        width: "100%",
      }}
      activeOpacity={0.8}
      onPress={() => callback(item)}
    >
      <ImageBackground
        source={ICONS[item.symbol.toLowerCase()]}
        style={{
          // backgroundColor: colors.card,
          width: 32,
          height: 32,
          // borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          // opacity: item.seen ? 0.7 : 1,
        }}
      >
        {!item.seen && (
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: COLORS.red,
              position: "absolute",
              right: 0,
              top: 0,
            }}
          ></View>
        )}
      </ImageBackground>
      <View
        style={{
          minHeight: item.type === TYPE_NOTIFY.SWAP ? 60 : 40,
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          width: SIZES.width - 40 - 8 - 32,
          gap: 8,
        }}
      >
        <View style={{ gap: 4, width: "60%" }}>
          <MyTextApp
            style={{
              fontWeight: "bold",
              color: item.seen ? colors.text : colors.title,
            }}
          >
            {item.title}
          </MyTextApp>
          <MyTextApp style={{ color: colors.text, fontSize: 12 }}>
            Address: {ellipseAddress(item.address)}
          </MyTextApp>
          <MyTextApp style={{ color: colors.text, fontSize: 12 }}>
            {timestampToHuman_v2(item.date)}
          </MyTextApp>
        </View>
        {item.type === TYPE_NOTIFY.WITHDRAW && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 4,
              width: "40%",
            }}
          >
            <MyTextApp
              style={{
                color: COLORS.success_5,
                ...FONTS.fontBold,
                fontSize: 16,
              }}
              numberOfLines={1}
            >
              + {item.amount}
            </MyTextApp>
            <Image
              source={ICONS[item.symbol.toLowerCase()]}
              style={{ width: 16, height: 16 }}
            />
          </View>
        )}
        {item.type === TYPE_NOTIFY.DEPOSIT && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              width: "40%",
              justifyContent: "flex-end",
            }}
          >
            <MyTextApp
              style={{ color: COLORS.danger, ...FONTS.fontBold, fontSize: 16 }}
              numberOfLines={1}
            >
              - {item.amount}
              1111111111111 222222222222 44444444 ddddddddddd eeeeeeeeeeee
              wwwwwwwwww
            </MyTextApp>
            <Image
              source={ICONS[item.symbol.toLowerCase()]}
              style={{ width: 16, height: 16 }}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export function NotifyNewsItem({
  item,
  tab,
  callback,
}: {
  item: any;
  tab: any;
  callback: any;
}) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingVertical: 8,
        width: "100%",
      }}
      activeOpacity={0.8}
      onPress={() => {
        if (item.seen === false) {
          item.seen = true;
        }
      }}
    >
      <View
        style={{
          backgroundColor: colors.card,
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          opacity: item.seen ? 0.7 : 1,
        }}
      >
        <Image source={item.thumbnail} resizeMode="cover" />
        {!item.seen && (
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: COLORS.red,
              position: "absolute",
              right: 0,
              top: 0,
            }}
          ></View>
        )}
      </View>
      <View
        style={{
          minHeight: 40,
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          width: SIZES.width - 40 - 8 - 32,
        }}
      >
        <View style={{ gap: 4 }}>
          <MyTextApp
            style={{
              fontWeight: "bold",
              color: item.seen ? colors.text : colors.title,
            }}
          >
            {item.title}
          </MyTextApp>
          <MyTextApp
            style={{ color: colors.text, fontSize: 12 }}
            numberOfLines={2}
          >
            {item?.descript}
          </MyTextApp>
          <MyTextApp style={{ color: colors.text, fontSize: 12 }}>
            {timestampToHuman_v2(item.date)}
          </MyTextApp>
        </View>
        {item.type === TYPE_NOTIFY.SWAP && (
          <View
            style={{
              alignItems: "flex-end",
              justifyContent: "flex-start",
              gap: 8,
              // borderWidth: 1,
              // borderColor: "red",
              flex: 1,
              height: 60,
              paddingLeft: 30,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <MyTextApp
                style={{ ...FONTS.fontBold, color: COLORS.success_5 }}
                numberOfLines={1}
              >
                + {item.from.amount}
              </MyTextApp>
              <Image
                source={ICONS[item.from.symbol.toLowerCase()]}
                style={{ width: 16, height: 16 }}
              />
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <MyTextApp
                style={{
                  ...FONTS.fontBold,
                  color: COLORS.danger,
                  // textAlign: "right",
                  // borderWidth: 1,
                  // borderColor: "red"
                }}
                numberOfLines={1}
              >
                - {item.to.amount}
              </MyTextApp>
              <Image
                source={ICONS[item.to.symbol.toLowerCase()]}
                style={{ width: 16, height: 16 }}
              />
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
