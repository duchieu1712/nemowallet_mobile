import {
  AvatarLoginedComponent,
  IconButtonQRComponent,
  RadiusLeft,
  RadiusRight,
} from "../../components/ButtonComponent/ButtonIconComponent";
import { COLORS, ICONS, MyTextApp, SIZES } from "../../themes/theme";
import { Image, LogBox, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";

import { ChainsWallet } from "../../config/chains";
import { DEFAULT_CHAINID } from "../../common/constants";
import FeatherIcon from "react-native-vector-icons/Feather";
import { GlobalStyleSheet } from "../../themes/styleSheet";
import SelectDropdown from "react-native-select-dropdown";
import TabNFTsComponent from "./Component/NftsTabComponent";
import TokensTabComponent from "./Component/TokensTabComponent";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);
const WalletScreen = (props: any) => {
  const { colors, dark } = useTheme();
  const { t } = useTranslation();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "Token", title: t("wallet.tokens") },
    { key: "NFT", title: t("wallet.nfts") },
  ]);

  const renderScene = SceneMap({
    Token: () => <TokensTabComponent props={props} />,
    NFT: () => <TabNFTsComponent />,
  });

  const renderTabBar = (props: any) => {
    return (
      <TabBar
        scrollEnabled
        {...props}
        indicatorStyle={{
          height: 3,
          backgroundColor: COLORS.white,
          borderRadius: 5,
        }}
        style={{
          backgroundColor: colors.background,
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.borderColor,
          marginBottom: 15,
          marginTop: -8,
        }}
        // indicatorContainerStyle={{
        //   marginHorizontal: 15,
        // }}
        tabStyle={{
          width: SIZES.width / 2,
        }}
        renderLabel={({ focused, route }) => {
          return (
            <MyTextApp
              style={{
                fontSize: 16,
                color: focused ? colors.title : colors.text,
                numberOfLine: 1,
              }}
            >
              {route.title}
            </MyTextApp>
          );
        }}
      />
    );
  };

  return (
    <>
      <View style={{ ...styles.container, backgroundColor: colors.background }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            position: "relative",
            paddingHorizontal: 16,
            paddingBottom: 16,
          }}
        >
          <AvatarLoginedComponent />
          <View
            style={{
              height: "100%",
              backgroundColor: colors.card,
              padding: 8,
              paddingTop: 4,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              width: SIZES.width - 96 - 32 - 24, //
            }}
          >
            <RadiusLeft />
            <RadiusRight />

            <View
              style={{
                height: 32,
                width: "100%", //
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                borderRadius: 15,
              }}
            >
              <SelectDropdown
                // disabled
                data={ChainsWallet.filter((e) => e.chainId === DEFAULT_CHAINID)}
                defaultValue={
                  ChainsWallet.filter((e) => e.chainId === DEFAULT_CHAINID)[0]
                }
                onSelect={() => {
                  console.log("");
                }}
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
                  minHeight: 70,
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
                  height: 32,
                  width: SIZES.width > 500 ? "90%" : "100%",
                  // borderWidth: 1,
                  // borderColor: "red",
                  backgroundColor: dark ? colors.card : "#F3F4F6",
                  borderRadius: 100,
                  paddingHorizontal: 2,
                  // paddingVertical: 9,
                  // marginTop: 4,
                }}
                buttonTextStyle={{
                  color: COLORS.white,
                }}
                renderDropdownIcon={() => (
                  // <Image source={ICONS.dropDown} style={{ width: 16, height: 16 }} />
                  <FeatherIcon
                    size={16}
                    name="chevron-down"
                    color={colors.text}
                  />
                )}
                renderCustomizedButtonChild={(selected) => {
                  if (!selected) {
                    return (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          paddingHorizontal: 8,
                        }}
                      >
                        <MyTextApp
                          style={{ ...styles.textTab, color: colors.title }}
                        >
                          {t("wallet.select_network")}
                        </MyTextApp>
                      </View>
                    );
                  }

                  return (
                    <View
                      style={{
                        // flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: 4,
                        width: "100%",
                      }}
                    >
                      <Image
                        source={ICONS[selected?.chainId]}
                        style={styles.icon}
                      />
                      <MyTextApp
                        style={{ ...styles.textTab, color: colors.title }}
                      >
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
                    <Image
                      source={ICONS[selected?.chainId]}
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
          </View>
          {/* <IconButtonNotifyComponent navigation={props.navigation} /> */}
          <IconButtonQRComponent navigation={props.navigation} />
        </View>

        <TabView
          lazy={true}
          overScrollMode={"auto"}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: SIZES.width }}
          renderTabBar={renderTabBar}
          sceneContainerStyle={{
            flex: 1,
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: "red"
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: 18,
  },
  textTab: {
    fontSize: SIZES.width > 412 ? 16 : 13,
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
});

export default WalletScreen;
