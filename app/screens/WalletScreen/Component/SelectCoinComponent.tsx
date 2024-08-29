import { COLORS, FONTS, ICONS, MyTextApp } from "../../../themes/theme";
import { Image, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { TYPE_ACTION, TYPE_DEPOSIT_WITHDRAW } from "../../../common/enum";

import { ClassWithStaticMethod } from "../../../common/static";
import FeatherIcon from "react-native-vector-icons/Feather";
import { GlobalStyleSheet } from "../../../themes/styleSheet";
import SelectDropdown from "react-native-select-dropdown";
import { useTheme } from "@react-navigation/native";
import useTokens from "../../../hooks/useTokens";
import { useTranslation } from "react-i18next";

export default function DropdownSelectCoinComponent({
  chainID,
  coinSelected,
  setCoinSelected,
  type,
  backgroundColor,
}: {
  chainID: any;
  coinSelected: any;
  setCoinSelected: any;
  type: any;
  backgroundColor?: any;
}): JSX.Element {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const lstTokens = useTokens(
    type === TYPE_ACTION.SEND
      ? ClassWithStaticMethod.NEMO_WALLET_CHAINID
      : chainID,
  );

  const [lstCoin, setLstCoin] = useState<any[]>([]);
  // useEffect(() => {
  //   if (type === TYPE_ACTION.SEND) {
  //     setLstCoin(
  //       coins.filter(
  //         (e) => e.chainID === ClassWithStaticMethod.NEMO_WALLET_CHAINID
  //       )
  //     );
  //   } else {
  //     setLstCoin(coins.filter((e) => e.chainID === chainID));
  //   }
  // }, []);
  useEffect(() => {
    if (!lstTokens) return;
    if (type === TYPE_ACTION.SEND) {
      // withdraw
      setLstCoin(
        lstTokens.filter((e) =>
          e.typeDeposit_Withdraw.includes(TYPE_DEPOSIT_WITHDRAW._TYPE_WITHDRAW),
        ),
      );
    } else {
      // deposit
      setLstCoin(
        lstTokens.filter((e) =>
          e.typeDeposit_Withdraw?.includes(TYPE_DEPOSIT_WITHDRAW._TYPE_DEPOSIT),
        ),
      );
    }
  }, [lstTokens]);

  const handleChange = (e: any) => {
    const value = e;
    if (value !== null) {
      setCoinSelected(value);
    }
  };

  return (
    <View>
      <SelectDropdown
        data={lstCoin}
        onSelect={handleChange}
        defaultValue={coinSelected}
        buttonTextAfterSelection={coinSelected?.name}
        defaultButtonText={t("wallet.select_coin")}
        rowTextForSelection={(item) => {
          // text represented for each item in dropdown
          // if data array is an array of objects then return item.property to represent item in dropdown
          return item?.name;
        }}
        dropdownStyle={{
          shadowColor: "transparent",
          borderBottomRightRadius: 8,
          borderBottomLeftRadius: 8,
          paddingHorizontal: 8,
          paddingVertical: 10,
          backgroundColor: backgroundColor ?? colors.card,
          //   borderWidth: 1,
          //   borderColor: "red",
          marginTop: -20,
          minHeight: 160,
          ...GlobalStyleSheet,
        }}
        dropdownOverlayColor="transparent"
        rowStyle={{
          borderBottomColor: colors.background,
          backgroundColor: backgroundColor ?? colors.card,
          borderRadius: 4,
          width: "100%",
        }}
        rowTextStyle={{
          color: colors.title,
        }}
        selectedRowStyle={{
          backgroundColor: colors.primary,
        }}
        selectedRowTextStyle={{
          color: colors.title,
        }}
        buttonStyle={{
          height: 50,
          width: "100%",
          backgroundColor: backgroundColor ?? colors.card,
          borderRadius: 8,
          paddingHorizontal: 8,
          paddingVertical: 9,
          marginTop: 8,
        }}
        buttonTextStyle={{
          color: COLORS.white,
        }}
        renderDropdownIcon={() => (
          <FeatherIcon size={16} name="chevron-down" color={colors.text} />
        )}
        renderCustomizedButtonChild={(selected) => (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 8,
            }}
          >
            <Image
              source={ICONS[coinSelected?.symbol?.toLowerCase()]}
              style={styles.icon}
            />
            <MyTextApp style={{ ...styles.textTab, color: colors.title }}>
              {coinSelected?.name}
            </MyTextApp>
          </View>
        )}
        renderCustomizedRowChild={(selected, index, isSelected) => (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 8,
            }}
          >
            <Image
              source={ICONS[selected?.symbol?.toLowerCase()]}
              style={styles.icon}
            />
            <MyTextApp
              style={{
                ...styles.textTab,
                color: isSelected ? "#fff" : colors.title,
              }}
            >
              {selected?.name}
            </MyTextApp>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textTab: {
    color: "#fff",
    ...FONTS.font,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
});
