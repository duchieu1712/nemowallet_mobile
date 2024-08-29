import * as NFTActions from "../../modules/nft/actions";
import * as NFTReducers from "../../modules/nft/reducers";

import {
  AvatarLoginedComponent,
  RadiusLeft,
  RadiusRight,
} from "../../components/ButtonComponent/ButtonIconComponent";
import { COLORS, FONTS, ICONS, MyTextApp, SIZES } from "../../themes/theme";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ListInventory, TAB_NFTS } from "../../common/enum";
import React, { useEffect, useState } from "react";
import { TabBar, TabView } from "react-native-tab-view";
import { cf_notShowFilter, cf_services } from "../../config/services";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useRoute, useTheme } from "@react-navigation/native";

import DashboardScreen from "./Components/DashboardScreenComponent";
import FeatherIcon from "react-native-vector-icons/Feather";
import { type INFTFilters } from "../../modules/nft/types";
import InventoryScreen from "./Components/InventoryScreenComponent";
import ListTransaction_NFTScreen from "./Components/TxNFTScreenComponent";
import MarketplaceScreen from "./Components/MarketplaceScreenComponent";
import NFTFilters from "../../modules/nft/filters";
import { isEmpty } from "lodash";
import { cf_typeFilter } from "../../config/galix_type";
import { useTranslation } from "react-i18next";
import FilterComponent from "../../components/ShopComponents/FilterComponents";

export default function Shop({ navigation }: { navigation: any }) {
  const dispatch = useDispatch();
  const [game, setGame] = useState(cf_services[0]);
  const [priceFilters, setPriceFilters] = useState(cf_typeFilter[2]);
  const [itemName, setItemName] = useState<any>(null);
  const [showFilter, setShowFilter] = useState(false);

  const fromWallet = useSelector(NFTReducers.fromWallet);
  const dispatchSetFromWallet = (request: any) =>
    dispatch(NFTActions.setFromWallet(request));
  const [index, setIndex] = useState(fromWallet ? TAB_NFTS.INVENTORY : 0);
  const [kindInventory, setKindInventory] = useState(ListInventory.LIST_FULL);

  const getDefaultFilters = (): INFTFilters => {
    const _p: NFTFilters = new NFTFilters();
    _p.push("orders", {
      created: "desc",
    });
    _p.push("limit", 12);
    _p.push("offset", 0);
    return _p.toInterface();
  };

  useFocusEffect(() => {
    navigation.setOptions({
      tabBarVisible: true,
    });
  });

  const [filters, setFilters]: [filters: NFTFilters, setFilters: any] =
    useState<any>(getDefaultFilters());

  const { colors, dark } = useTheme();
  const { t } = useTranslation();

  const route: any = useRoute();
  const [routes] = useState([
    { key: "Marketplace", title: "Marketplace" },
    { key: "Dashboard", title: "Dashboard" },
    { key: "Inventory", title: "Inventory" },
    { key: "TxNFTs", title: "TxNFTs" },
  ]);

  useEffect(() => {
    dispatchSetFromWallet(false);
  }, []);

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
          // elevation: 4,
          borderBottomWidth: 1,
          borderBottomColor: colors.borderColor,
          marginBottom: 15,
          marginTop: -8,
        }}
        // indicatorContainerStyle={{
        //   marginHorizontal: 15,
        // }}
        tabStyle={{
          width: SIZES.width / 3 > 130.9 ? SIZES.width / 3 : 130.9,
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
              {t(`nfts.${route.title?.toLowerCase()}`)}
            </MyTextApp>
          );
        }}
      />
    );
  };

  useEffect(() => {
    if (!route.params) return;
    const { tab } = route.params;
    setIndex(tab);
  }, [route]);

  useEffect(() => {
    if (itemName === null || itemName === "" || !filters?.limit) {
      return;
    }
    if (isEmpty(itemName)) {
      filters.remove("metadataNames", undefined);
    } else {
      filters.push("metadataNames", itemName);
    }
    filters.push("offset", 0);
    filters.push("limit", 12);
    setFilters({ ...filters.toInterface() });
  }, [itemName]);

  return (
    <View style={{ width: "100%" }}>
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
            paddingTop: 4,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            width: SIZES.width - 96 - 32 - 24, //
          }}
        >
          <RadiusLeft />
          <RadiusRight />
          <TouchableOpacity
            onPress={
              () => {
                route.params = undefined;
                navigation.navigate("SearchScreen" as never, {
                  screen: "NFTs",
                  filters: priceFilters,
                  index,
                  game: game.serviceID,
                  kind: kindInventory,
                  initFilterName: itemName,
                  callback: (e: any) => {
                    setItemName(null);
                    setItemName(e?.metadata?.name ?? "");
                  },
                });
              }
              //
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
            activeOpacity={0.8}
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
              <MyTextApp
                style={{
                  color: COLORS.darkText,
                  width: SIZES.width - 96 - 32 - 24 - 40 - 16,
                }}
                numberOfLines={1}
              >
                {!isEmpty(itemName) ? itemName : t("common.search")}
              </MyTextApp>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => {
            if (!cf_notShowFilter.includes(index)) setShowFilter(!showFilter);
          }}
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: 42,
            // height: 42,
            // borderTopLeftRadius: 12,
            // borderWidth: 1,
            // borderColor: "red",
            opacity: kindInventory === ListInventory.LIST_SOLD ? 0.15 : 1,
          }}
          disabled={kindInventory === ListInventory.LIST_SOLD}
          activeOpacity={0.9}
        >
          {!cf_notShowFilter.includes(index) && (
            <FeatherIcon name="filter" size={24} color={colors.title} />
          )}
        </TouchableOpacity>
      </View>

      <View style={{ ...styles.tab }}>
        <TabView
          style={{
            minHeight: SIZES.height,
          }}
          lazy={true}
          animationEnabled
          overScrollMode={"auto"}
          navigationState={{
            index,
            routes,
          }}
          renderScene={({ route }) => {
            switch (route.key) {
              case "Marketplace":
                return (
                  <MarketplaceScreen
                    navigation={navigation}
                    game={game}
                    setGame={setGame}
                    filters={filters}
                    setFilters={setFilters}
                  />
                );
              case "Dashboard":
                return <DashboardScreen game={game} setGame={setGame} />;
              case "Inventory":
                return (
                  <InventoryScreen
                    game={game}
                    setGame={setGame}
                    filters={filters}
                    setFilters={setFilters}
                    setShowFilter={setShowFilter}
                    kindInventory={kindInventory}
                    setKindInventory={setKindInventory}
                  />
                );
              case "TxNFTs":
                return (
                  <ListTransaction_NFTScreen game={game} setGame={setGame} />
                );
              default:
                return (
                  <MarketplaceScreen
                    navigation={navigation}
                    game={game}
                    setGame={setGame}
                    filters={filters}
                    setFilters={setFilters}
                  />
                );
            }
          }}
          onIndexChange={(e) => {
            // route.params ? setItemName("") : setItemName(null);
            setFilters(null);
            setItemName("");
            setPriceFilters(cf_typeFilter[2]);
            setFilters(getDefaultFilters());
            setIndex(e);
          }}
          initialLayout={{ width: SIZES.width }}
          renderTabBar={renderTabBar}
          sceneContainerStyle={{
            flex: 1,
            justifyContent: "space-between",
          }}
        />
      </View>

      <ScrollView
        style={{ backgroundColor: colors.background, width: "100%" }}
        // onRefresh={onRefresh}
        // refreshing={refresh}
      >
        <FilterComponent
          index={index}
          serviceID={game.serviceID}
          filters={filters}
          setFilters={setFilters}
          showFilter={showFilter}
          setShowFilter={setShowFilter}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    padding: 19,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // flex: 1,
  },
  textTab: {
    // color: "#fff",
    ...FONTS.font,
  },

  dropDownFilter: {
    marginVertical: 16,
  },
});
