import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, FONTS, MyTextApp, SIZES } from "../../../themes/theme";
import { currencyFormat, roundDownNumber } from "../../../common/utilities";

import React from "react";

export default function WalletBalanceComponent({
  props,
}: {
  props: {
    theme: any;
    index: any;
    coin: any;
    coinName: any;
    amount: any;
    trade: any;
    data: any;
    btc: any;
    tag: any;
    id: any;
    refreshing: any;
    tokenPressed: any;
  };
}) {
  return (
    <TouchableOpacity key={props.index} onPress={() => props.tokenPressed()}>
      <View
        style={[
          styles.coinList,
          { backgroundColor: props.theme.colors.background },
          {
            paddingTop: 16,
            paddingBottom: 16,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
          }}
        >
          <View
            style={[
              {
                height: 48,
                width: 48,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
                backgroundColor: props.theme.colors.background,
                borderWidth: 0,
                borderColor: props.theme.colors.borderColor,
                marginRight: 12,
              },
              props.theme.dark && {
                borderWidth: 0,
              },
            ]}
          >
            {props?.coin ? (
              <Image
                source={props.coin}
                style={{
                  height: 48,
                  width: 48,
                  borderRadius: 26,
                }}
              />
            ) : (
              <View
                style={{
                  height: 48,
                  width: 48,
                  borderRadius: 26,
                }}
              ></View>
            )}
          </View>
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 5,
              }}
            >
              <MyTextApp
                style={{
                  ...FONTS.font,
                  fontSize: 16,
                  ...FONTS.fontMedium,
                  color: props.theme.colors.title,
                  textTransform: "uppercase",
                }}
              >
                {props.coinName}
              </MyTextApp>
            </View>
            <MyTextApp
              style={{
                ...FONTS.font,
                color: COLORS.descriptionText,
              }}
            >
              ${props?.btc ? currencyFormat(roundDownNumber(props?.btc, 6)) : 0}
            </MyTextApp>
          </View>
        </View>
        {props.refreshing ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <View
            style={{
              alignItems: "flex-end",
            }}
          >
            <MyTextApp
              style={{
                fontSize: 16,
                ...FONTS.fontMedium,
                color: props.theme.colors.title,
                marginBottom: 5,
              }}
            >
              {props.amount.shortBalance
                ? currencyFormat(
                    roundDownNumber(props.amount.shortBalance, 2).toFixed(2),
                  )
                : 0}
            </MyTextApp>
            <MyTextApp
              style={{
                ...FONTS.font,
                ...FONTS.fontMedium,
                color: COLORS.descriptionText,
              }}
            >
              {props.trade
                ? isNaN(props.trade)
                  ? 0
                  : `$${currencyFormat(
                      roundDownNumber(props.trade, 2).toFixed(2),
                    )}`
                : 0}
            </MyTextApp>
          </View>
        )}
      </View>
      <View
        style={{
          backgroundColor: props.theme.dark
            ? "rgba(31, 34, 42, 0.75)"
            : "rgba(31, 34, 42, 0.1)",
          height: 1,
          width: SIZES.width - 32,
          flexDirection: "row",
          alignSelf: "center",
        }}
      ></View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  leftButtonContainer: {
    position: "absolute",
  },
  containerStyle: {
    flex: 1,
    flexDirection: "row",
  },
  coinList: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 15,
    marginVertical: 4,
  },
  textStyle: {
    fontSize: 12,
    ...FONTS.fontMedium,
    color: "#fff",
  },
  rightButtonContainer: {
    position: "absolute",
    right: 0,
  },
  swipeIcon: {
    height: 20,
    width: 20,
    marginBottom: 3,
    marginTop: 6,
    resizeMode: "contain",
    tintColor: "#fff",
  },
  swipeBtn: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  btnareaRight: {
    paddingVertical: 5,
    top: 4,
    borderTopLeftRadius: SIZES.radius,
    borderBottomLeftRadius: SIZES.radius,
  },
  btnareaLeft: {
    paddingVertical: 5,
    top: 4,
    flexDirection: "row",
    borderTopRightRadius: SIZES.radius,
    borderBottomRightRadius: SIZES.radius,
  },
});
