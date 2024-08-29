import { COLORS, FONTS, ICONS, MyTextApp } from "../../../themes/theme";
import { Image, StyleSheet, View } from "react-native";
import {
  NETWORK_TYPE,
  TYPE_ACTION,
  TYPE_DEPOSIT,
  TYPE_WITHDRAW,
} from "../../../common/enum";
import React, { useEffect, useState } from "react";

import { ClassWithStaticMethod } from "../../../common/static";
import FeatherIcon from "react-native-vector-icons/Feather";
import { GlobalStyleSheet } from "../../../themes/styleSheet";
import { PROD } from "../../../common/constants";
import SelectDropdown from "react-native-select-dropdown";
import cf_Chains from "../../../config/chains";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function NetworkDropdownComponent({
  bridgePools,
  coinSelected,
  networkSelected,
  setNetworkSelected,
  type,
  type_deposit_withdraw,
  isDefault = false,
}: {
  bridgePools: any;
  coinSelected: any;
  networkSelected: any;
  setNetworkSelected: any;
  type: any;
  type_deposit_withdraw: any;
  isDefault?: boolean;
}) {
  const [lstChainComponent, setLstChainComponent] = useState<any>([]);
  const { colors } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    let lstChain: any = [];
    if (type === TYPE_ACTION.SEND) {
      if (type_deposit_withdraw === TYPE_WITHDRAW.WITHDRAW) {
        lstChain = cf_Chains.filter(
          (e) =>
            // e.chainId !== ClassWithStaticMethod.NEMO_WALLET_CHAINID &&
            e.network ===
              (PROD ? NETWORK_TYPE.MAINNET : NETWORK_TYPE.TESTNET) &&
            bridgePools?.some(
              (bridge: any) =>
                (bridge?.tokens?.some(
                  (b: any) =>
                    b.toLowerCase() === coinSelected?.contract?.toLowerCase(),
                ) &&
                  bridge.chain_id_whitelist.includes(e.chainId)) ||
                (e.chainId === ClassWithStaticMethod.NEMO_WALLET_CHAINID &&
                  type === TYPE_ACTION.SEND),
            ),
        );
      } else {
        lstChain = cf_Chains.filter(
          (e) =>
            e.chainId !== ClassWithStaticMethod.NEMO_WALLET_CHAINID &&
            e.network ===
              (PROD ? NETWORK_TYPE.MAINNET : NETWORK_TYPE.TESTNET) &&
            bridgePools?.some(
              (bridge: any) =>
                bridge.chain_id === ClassWithStaticMethod.NEMO_WALLET_CHAINID &&
                bridge?.destinations?.some(
                  (b: any) =>
                    b?.destination?.chain_id === e?.chainId &&
                    b?.token?.toLowerCase() ===
                      coinSelected?.contract?.toLowerCase(),
                ),
            ),
        );
      }
    } else if (type === TYPE_ACTION.RECECEIVE) {
      if (type_deposit_withdraw === TYPE_DEPOSIT.DEPOSIT) {
        lstChain = cf_Chains.filter(
          (e) =>
            e.network ===
              (PROD ? NETWORK_TYPE.MAINNET : NETWORK_TYPE.TESTNET) &&
            e.chainId !== ClassWithStaticMethod.NEMO_WALLET_CHAINID &&
            bridgePools?.some(
              (bridge: any) =>
                // bridge.tokens.includes(coinSelected?.contract) &&
                bridge.chain_id_whitelist.includes(
                  ClassWithStaticMethod.NEMO_WALLET_CHAINID,
                ) && bridge.chain_id === e?.chainId,
            ),
        );
      } else {
        lstChain = cf_Chains.filter(
          (e) =>
            e.network ===
              (PROD ? NETWORK_TYPE.MAINNET : NETWORK_TYPE.TESTNET) &&
            e.chainId !== ClassWithStaticMethod.NEMO_WALLET_CHAINID &&
            bridgePools?.some((bridge: any) =>
              bridge?.received?.some(
                (b: any) =>
                  b?.chain_id === e?.chainId &&
                  b?.received?.chain_id ===
                    ClassWithStaticMethod.NEMO_WALLET_CHAINID &&
                  b?.received?.token?.toLowerCase() ===
                    coinSelected?.contract?.toLowerCase(),
              ),
            ),
        );
      }
    }
    // Init Cogi Chain
    if (
      type_deposit_withdraw == TYPE_WITHDRAW.WITHDRAW &&
      type == TYPE_ACTION.SEND
    ) {
      const initNw = lstChain.find(
        (e: any) => e?.chainId === ClassWithStaticMethod.NEMO_WALLET_CHAINID,
      );
      setNetworkSelected(initNw);
      setLstChainComponent([initNw]);
    } else {
      setLstChainComponent(lstChain);
    }
  }, [coinSelected, bridgePools]);

  const handleChange = (e: any) => {
    const value = e;
    if (value !== null) {
      setNetworkSelected(value);
    }
    //
    ClassWithStaticMethod.SET_STATIC_DEFAULT_CHAINID(e.chainId);
  };

  return (
    <View>
      <SelectDropdown
        data={isDefault ? [networkSelected] : lstChainComponent}
        defaultValue={networkSelected}
        disabled={isDefault}
        onSelect={handleChange}
        dropdownStyle={{
          shadowColor: "transparent",
          borderBottomRightRadius: 8,
          borderBottomLeftRadius: 8,
          paddingHorizontal: 8,
          paddingVertical: 10,
          backgroundColor: colors.card,
          //   borderWidth: 1,
          //   borderColor: "red",
          marginTop: -20,
          minHeight: 120,
          ...GlobalStyleSheet,
        }}
        dropdownOverlayColor="transparent"
        rowStyle={{
          borderBottomColor: colors.background,
          backgroundColor: colors.card,
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
          backgroundColor: colors.card,
          borderRadius: 8,
          paddingHorizontal: 8,
          paddingVertical: 9,
          marginTop: 8,
        }}
        buttonTextStyle={{
          color: COLORS.white,
        }}
        renderDropdownIcon={() => (
          // <Image source={ICONS.dropDown} style={{ width: 16, height: 16 }} />
          <FeatherIcon size={16} name="chevron-down" color={colors.text} />
        )}
        renderCustomizedButtonChild={(selected) => {
          if (networkSelected) {
            return (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 8,
                }}
              >
                <Image
                  source={ICONS[networkSelected?.chainId]}
                  style={styles.icon}
                />
                <MyTextApp style={{ ...styles.textTab, color: colors.title }}>
                  {networkSelected?.name}
                </MyTextApp>
              </View>
            );
          }

          if (!selected) {
            return (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 8,
                }}
              >
                <MyTextApp style={{ ...styles.textTab, color: colors.title }}>
                  {t("wallet.select_network")}
                </MyTextApp>
              </View>
            );
          }

          return (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 8,
              }}
            >
              <Image source={ICONS[selected?.chainId]} style={styles.icon} />
              <MyTextApp style={{ ...styles.textTab, color: colors.title }}>
                {selected?.name}
              </MyTextApp>
            </View>
          );
        }}
        renderCustomizedRowChild={(selected, index, isSelected) => (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 8,
            }}
          >
            <Image source={ICONS[selected?.chainId]} style={styles.icon} />
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
