import * as AccountReducers from "../../modules/account/reducers";
import * as NFTActions from "../../modules/nft/actions";
import * as NFTReducers from "../../modules/nft/reducers";

import {
  BackHandler,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import {
  DEFAULT_CHAINID,
  DEFAULT_NUM_NFT_FILTER_BY_NAME,
} from "../../common/constants";
import {
  FONTS,
  GradientText,
  ICONS,
  MyTextApp,
  QUALITY,
  TITLE_COLOR_QUALITY,
} from "../../themes/theme";
import {
  type GetDatas,
  type GetMarketDatas,
  type INFTFilters,
} from "../../modules/nft/types";
import {
  LOCALE_STORAGE,
  ListInventory,
  NFTS_INDEX,
  SERVICE_ID,
} from "../../common/enum";
import {
  type NavigationProp,
  useRoute,
  useTheme,
} from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { cf_services, events } from "../../config/services";
import { useDispatch, useSelector } from "react-redux";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dmetadata } from "../../modules/nft/market";
import FeatherIcon from "react-native-vector-icons/Feather";
import { IconLoadingDataComponent } from "../../components/LoadingComponent";
import InputComponent from "../../components/InputComponent";
import NFTFilters from "../../modules/nft/filters";
import { type Nft } from "../../modules/graphql/types/generated";
import NoDataComponent from "../../components/NoDataComponent";
import { RadiusLeft } from "../../components/ButtonComponent/ButtonIconComponent";
import { type TokenInfo } from "../../config/coins";
import { descyptNEMOWallet } from "../../common/utilities";
import { isEmpty } from "lodash";
import { toIpfsGatewayUrl } from "../../common/utilities_config";
import useTokens from "../../hooks/useTokens";
import { useTranslation } from "react-i18next";

export default function SearchScreen({
  navigation,
}: {
  navigation: NavigationProp<ReactNavigation.RootParamList>;
}) {
  const { colors, dark } = useTheme();
  const { t } = useTranslation();
  const route = useRoute<any>();

  const { screen, callback, initFilterName, index }: any = route.params;

  const [nameSearch, setNameSearch] = useState("");
  const [valueText, setValueText] = useState("");

  useEffect(() => {
    if (!screen) return;
    if (!initFilterName) return;
    setValueText(initFilterName);
  }, [initFilterName]);

  useEffect(() => {
    // Prevent back
    const backAction = () => {
      callback?.(null);
      return false;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: colors.background, flex: 1 }}>
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
        <TouchableOpacity
          onPress={() => {
            !nameSearch && callback?.(null);
            navigation.goBack();
          }}
          style={{
            padding: 12,
            zIndex: 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FeatherIcon name="arrow-left" size={24} color={colors.title} />
        </TouchableOpacity>

        <View
          style={{
            width: "100%",
            flex: 1,
            height: "100%",
            backgroundColor: dark ? "#1F222A" : "#fff",
            padding: 8,
            paddingTop: 4,
            borderBottomLeftRadius: 20,
          }}
        >
          <RadiusLeft />

          <TouchableOpacity
            style={{
              position: "absolute",
              right: 16,
              top: 12,
              zIndex: 10,
            }}
            activeOpacity={0.5}
            onPress={() => {
              setValueText("");
              setNameSearch("");
            }}
          >
            {screen !== "Shop" && nameSearch && (
              <FeatherIcon color={colors.text} size={18} name="x-circle" />
            )}
            {screen === "Shop" && valueText && (
              <FeatherIcon color={colors.text} size={18} name="x-circle" />
            )}
          </TouchableOpacity>
          {screen !== "Shop" ? (
            <InputComponent
              autoFocus={true}
              style={{
                ...FONTS.font,
                paddingHorizontal: 10,
                paddingRight: nameSearch ? 26 : 10,
                top: 1,
                paddingVertical: 8,
                height: 32,
                borderWidth: 0,
                borderRadius: 30,
                backgroundColor: "rgba(122, 121, 138, 0.25)",
                color: colors.title,
              }}
              placeholder={
                screen === "Wallet"
                  ? t("common.search_token")
                  : screen === "GameFi"
                    ? t("common.search_events")
                    : t("common.search_product")
              }
              placeholderTextColor={colors.text}
              defaultValue={nameSearch}
              onChangeText={(text: string) => {
                setNameSearch(text);
              }}
              showClear={false}
            />
          ) : (
            <InputComponent
              autoFocus={true}
              style={{
                ...FONTS.font,
                paddingHorizontal: 10,
                paddingRight: nameSearch ? 26 : 10,
                top: 1,
                paddingVertical: 8,
                height: 32,
                borderWidth: 0,
                borderRadius: 30,
                backgroundColor: "rgba(122, 121, 138, 0.25)",
                color: colors.title,
              }}
              placeholder={t("common.search_items")}
              placeholderTextColor={colors.text}
              value={valueText}
              onChangeText={(e: string) => {
                setValueText(e);
              }}
              onSubmitEditing={() => {
                setNameSearch(valueText);
              }}
              returnKeyType="search"
              returnKeyLabel={t("wallet.search")}
              showClear={false}
            />
          )}
        </View>

        <TouchableOpacity
          onPress={() => {
            const isShop = screen === "Shop";
            if (isShop) {
              setNameSearch(valueText);
            }
          }}
          style={{
            padding: 12,
            height: "100%",
            width: 60,
            backgroundColor: colors.card,
            marginRight: -16,
            borderBottomRightRadius: 16,
          }}
          activeOpacity={0.7}
        >
          <FeatherIcon name="search" size={24} color={colors.title} />
        </TouchableOpacity>
      </View>
      <ScrollView keyboardShouldPersistTaps="always">
        {screen === "Product" && (
          <SearchProduct
            navigation={navigation}
            nameSearch={nameSearch}
            t={t}
            screen={screen}
            colors={colors}
            route={route}
          />
        )}

        {screen === "GameFi" && (
          <SearchEvent
            screen={screen}
            colors={colors}
            navigation={navigation}
            t={t}
            nameSearch={nameSearch}
          />
        )}

        {screen === "Wallet" && (
          <SearchWallet
            t={t}
            colors={colors}
            screen={screen}
            nameSearch={nameSearch}
            navigation={navigation}
            route={route}
          />
        )}
        {/* {!topSearchItems && <NoDataComponent />} */}
        {screen === "Shop" &&
          (index === NFTS_INDEX._MARKETPLACE ||
            index === NFTS_INDEX._DASHBOARD) && (
            <SearchMaketplace
              colors={colors}
              route={route}
              navigation={navigation}
              nameSearch={nameSearch}
              screen={screen}
            />
          )}
        {screen === "Shop" && index === NFTS_INDEX._INVENVTORY && (
          <SearchInventory
            colors={colors}
            route={route}
            navigation={navigation}
            nameSearch={nameSearch}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export function SearchProduct({
  nameSearch,
  route,
  screen,
  t,
  navigation,
  colors,
}: {
  nameSearch: any;
  route: any;
  screen: any;
  t: any;
  navigation: any;
  colors: any;
}) {
  const { callback } = route.params;
  const [assetsFilterName, setAssetsFilterName] = useState<any>(null);

  const [topSearchItems, setTopSearchItems] = useState<any[]>([]);

  const lstServices = cf_services.filter((e) => e.isActive);

  useEffect(() => {
    if (!screen) return;
    if (isEmpty(nameSearch)) {
      setAssetsFilterName([]);
      return;
    }
    const temp = cf_services
      .filter((e) => e.isActive)
      .filter((item) => {
        const a = item.serviceName
          .toLowerCase()
          .includes(nameSearch.toLowerCase());
        if (a) return item;
      });

    if (temp) setAssetsFilterName(temp);
    else setAssetsFilterName([]);
  }, [nameSearch]);

  useEffect(() => {
    if (!screen) return;
    AsyncStorage.getItem(LOCALE_STORAGE._TOP_SEARCH)
      .then((value: any) => {
        value !== null
          ? setTopSearchItems(
              JSON.parse(value)?.sort((a: any, b: any) => b?.count - a?.count),
            )
          : setTopSearchItems(
              lstServices.map((e) => {
                return {
                  item: e,
                  count: 1,
                };
              }),
            );
      })
      .catch(() => {
        setTopSearchItems([]);
      });
  }, []);

  return (
    <>
      {!nameSearch && (
        <>
          <MyTextApp
            style={{
              ...FONTS.fontBold,
              fontSize: 16,
              paddingHorizontal: 24,
              color: colors.title,
            }}
          >
            {topSearchItems.length === 0
              ? t("common.options")
              : t("common.top_search")}
          </MyTextApp>
        </>
      )}
      {topSearchItems && !nameSearch && (
        <>
          {topSearchItems.length > 0 &&
            topSearchItems.map(
              (e: any, i: any) =>
                e && (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      marginHorizontal: 20,
                      paddingVertical: 8,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                    }}
                    key={i}
                    activeOpacity={0.8}
                    onPress={async () => {
                      e.count = e.count + 1;
                      await AsyncStorage.setItem(
                        LOCALE_STORAGE._TOP_SEARCH,
                        JSON.stringify(topSearchItems),
                      );
                      navigation.goBack();
                      callback?.(e.item);
                      // navigation.navigate("Products", { item: e });
                    }}
                  >
                    <View
                      style={{
                        height: 24,
                        width: 24,
                        alignItems: "center",
                      }}
                    >
                      {i <= 1 ? (
                        <Image source={ICONS.top_search} />
                      ) : (
                        <MyTextApp
                          style={{
                            color: colors.text,
                            ...FONTS.fontBold,
                          }}
                        >
                          {i + 1}
                        </MyTextApp>
                      )}
                    </View>
                    <Image
                      source={e?.item?.logoGame}
                      style={{ width: 40, height: 40, borderRadius: 8 }}
                    />
                    <View style={{ gap: 4, width: "75%" }}>
                      <MyTextApp
                        style={{ ...FONTS.fontBold, color: colors.title }}
                        numberOfLines={1}
                      >
                        {e?.item?.serviceName}
                      </MyTextApp>
                    </View>
                  </TouchableOpacity>
                ),
            )}
        </>
      )}

      {nameSearch &&
        assetsFilterName &&
        screen === "Product" &&
        assetsFilterName.map((e: any, i: any) => (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginHorizontal: 20,
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
            key={i}
            onPress={async () => {
              const search_items = await AsyncStorage.getItem(
                LOCALE_STORAGE._TOP_SEARCH,
              );

              if (search_items) {
                const arr: any[] = JSON.parse(search_items);
                const item: any = arr.find(
                  (a: any) => a.item.serviceID === e.serviceID,
                );

                if (item) {
                  callback(item.item);
                  item.count = item.count + 1;
                  await AsyncStorage.setItem(
                    LOCALE_STORAGE._TOP_SEARCH,
                    JSON.stringify(arr),
                  );
                } else {
                  arr.push({
                    count: 1,
                    item: e,
                  });
                  callback(e);

                  await AsyncStorage.setItem(
                    LOCALE_STORAGE._TOP_SEARCH,
                    JSON.stringify(arr),
                  );
                }
              } else {
                const s = [
                  {
                    count: 1,
                    item: e,
                  },
                ];
                await AsyncStorage.setItem(
                  LOCALE_STORAGE._TOP_SEARCH,
                  JSON.stringify(s),
                );
                callback?.(e);
              }
              navigation.goBack();
            }}
          >
            <Image source={e.logoGame} style={{ width: 40, height: 40 }} />
            <View style={{ gap: 4, width: "75%" }}>
              <MyTextApp
                style={{ ...FONTS.fontBold, color: colors.title }}
                numberOfLines={1}
              >
                {e.serviceName}
              </MyTextApp>
            </View>
          </TouchableOpacity>
        ))}

      {!nameSearch &&
        (!topSearchItems || topSearchItems.length === 0) &&
        lstServices?.map((e, i) => (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginHorizontal: 20,
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
            key={i}
            onPress={async () => {
              navigation.navigate("Products", { item: e });
              const search_items = await AsyncStorage.getItem(
                LOCALE_STORAGE._TOP_SEARCH,
              );

              if (search_items) {
                const arr: any[] = JSON.parse(search_items);
                const item: any = arr.find(
                  (a: any) => a.item.serviceID === e.serviceID,
                );

                if (item) {
                  item.count = item.count + 1;
                  await AsyncStorage.setItem(
                    LOCALE_STORAGE._TOP_SEARCH,
                    JSON.stringify(arr),
                  );
                } else {
                  arr.push({
                    count: 1,
                    item: e,
                  });
                  await AsyncStorage.setItem(
                    LOCALE_STORAGE._TOP_SEARCH,
                    JSON.stringify(arr),
                  );
                }
              } else {
                const s = [
                  {
                    count: 1,
                    item: e,
                  },
                ];
                await AsyncStorage.setItem(
                  LOCALE_STORAGE._TOP_SEARCH,
                  JSON.stringify(s),
                );
              }
            }}
          >
            <Image source={e.logoGame} style={{ width: 40, height: 40 }} />
            <View style={{ gap: 4, width: "75%" }}>
              <MyTextApp
                style={{ ...FONTS.fontBold, color: colors.title }}
                numberOfLines={1}
              >
                {e.serviceName}
              </MyTextApp>
            </View>
          </TouchableOpacity>
        ))}
    </>
  );
}

export function SearchEvent({
  colors,
  screen,
  navigation,
  t,
  nameSearch,
}: {
  colors: any;
  screen: string;
  navigation: any;
  t: any;
  nameSearch: any;
}) {
  const [assetsFilterName, setAssetsFilterName] = useState<any>(null);

  const [topSearchItems, setTopSearchItems] = useState<any>([]);

  useEffect(() => {
    if (!screen) return;
    if (isEmpty(nameSearch)) {
      setAssetsFilterName([]);
      return;
    }
    const temp = events.filter((item) => {
      const a = item.fullName.toLowerCase().includes(nameSearch.toLowerCase());
      if (a) return item;
    });

    if (temp) setAssetsFilterName(temp);
    else setAssetsFilterName([]);
  }, [nameSearch]);

  useEffect(() => {
    if (!screen) return;
    AsyncStorage.getItem(LOCALE_STORAGE._EVENTS)
      .then((value: any) => {
        value !== null
          ? setTopSearchItems(
              JSON.parse(value)?.sort((a: any, b: any) => b?.count - a?.count),
            )
          : setTopSearchItems(
              events?.map((e) => {
                return {
                  item: e,
                  count: 1,
                };
              }),
            );
      })
      .catch(() => {
        setTopSearchItems([]);
      });
  }, []);

  return (
    <>
      {!nameSearch && (
        <>
          <MyTextApp
            style={{
              ...FONTS.fontBold,
              fontSize: 16,
              paddingHorizontal: 24,
              color: colors.title,
            }}
          >
            {topSearchItems.length === 0
              ? t("common.options")
              : t("common.top_search")}
          </MyTextApp>
        </>
      )}
      {!nameSearch && topSearchItems && (
        <>
          {topSearchItems.length > 0 &&
            topSearchItems.map(
              (e: any, i: any) =>
                e && (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      marginHorizontal: 20,
                      paddingVertical: 8,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                    }}
                    key={i}
                    activeOpacity={0.8}
                    onPress={async () => {
                      navigation.navigate(e.item.linkNavigation);
                      e.count = e.count + 1;
                      await AsyncStorage.setItem(
                        LOCALE_STORAGE._EVENTS,
                        JSON.stringify(topSearchItems),
                      );
                    }}
                  >
                    <View
                      style={{
                        height: 24,
                        width: 24,
                        alignItems: "center",
                      }}
                    >
                      {i <= 1 ? (
                        <Image source={ICONS.top_search} />
                      ) : (
                        <MyTextApp
                          style={{
                            color: colors.text,
                            ...FONTS.fontBold,
                          }}
                        >
                          {i + 1}
                        </MyTextApp>
                      )}
                    </View>
                    <Image
                      source={e?.item?.image}
                      style={{ width: 40, height: 40, borderRadius: 8 }}
                    />
                    <View style={{ gap: 4, width: "75%" }}>
                      <MyTextApp
                        style={{ ...FONTS.fontBold, color: colors.title }}
                        numberOfLines={1}
                      >
                        {t(e?.item?.title)}
                      </MyTextApp>
                    </View>
                  </TouchableOpacity>
                ),
            )}
        </>
      )}
      {nameSearch &&
        assetsFilterName &&
        screen === "GameFi" &&
        assetsFilterName.map((e: any, i: any) => (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginHorizontal: 20,
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
            key={i}
            onPress={async () => {
              if (topSearchItems) {
                const arr: any[] = topSearchItems;
                const item: any = arr.find(
                  (a: any) => a.item.title === e.title,
                );
                if (item) {
                  item.count = item.count + 1;
                  await AsyncStorage.setItem(
                    LOCALE_STORAGE._EVENTS,
                    JSON.stringify(arr),
                  );
                } else {
                  arr.push({
                    count: 1,
                    item: e,
                  });
                  await AsyncStorage.setItem(
                    LOCALE_STORAGE._EVENTS,
                    JSON.stringify(arr),
                  );
                }
              } else {
                const s = [
                  {
                    count: 1,
                    item: e,
                  },
                ];
                await AsyncStorage.setItem(
                  LOCALE_STORAGE._EVENTS,
                  JSON.stringify(s),
                );
              }
              navigation.navigate(e.linkNavigation as never);
            }}
          >
            <Image source={e.image} style={{ width: 40, height: 40 }} />
            <View style={{ gap: 4, width: "75%" }}>
              <MyTextApp
                style={{ ...FONTS.fontBold, color: colors.title }}
                numberOfLines={1}
              >
                {t(e.title)}
              </MyTextApp>
            </View>
          </TouchableOpacity>
        ))}
    </>
  );
}

export function SearchWallet({
  colors,
  screen,
  navigation,
  t,
  nameSearch,
  route,
}: {
  colors: any;
  screen: string;
  navigation: any;
  t: any;
  nameSearch: any;
  route: any;
}) {
  const { balances, getBalance } = route.params;

  const [assetsFilterName, setAssetsFilterName] = useState<any>(null);

  const [topSearchItems, setTopSearchItems] = useState<any>([]);
  const lstToken = useTokens(DEFAULT_CHAINID);

  useEffect(() => {
    if (!screen) return;
    if (!nameSearch) return;
    const { lstToken } = route.params;
    const temp = lstToken.filter((item: TokenInfo) => {
      const a = item.symbol.toLowerCase().includes(nameSearch.toLowerCase());
      if (a) return item;
    });

    if (temp) setAssetsFilterName(temp);
    else setAssetsFilterName(null);
  }, [nameSearch]);

  useEffect(() => {
    if (!screen) return;
    AsyncStorage.getItem(LOCALE_STORAGE._WALLET)
      .then((value: any) => {
        value !== null
          ? setTopSearchItems(
              JSON.parse(value)?.sort((a: any, b: any) => b?.count - a?.count),
            )
          : setTopSearchItems(
              lstToken.map((e) => {
                return {
                  item: e,
                  count: 1,
                };
              }),
            );
      })
      .catch(() => {
        setTopSearchItems([]);
      });
  }, [lstToken]);

  return (
    <>
      {!nameSearch && (
        <>
          <MyTextApp
            style={{
              ...FONTS.fontBold,
              fontSize: 16,
              paddingHorizontal: 24,
              color: colors.title,
            }}
          >
            {t("common.top_search")}
          </MyTextApp>
        </>
      )}
      {nameSearch &&
        assetsFilterName &&
        screen === "Wallet" &&
        assetsFilterName.map((e: any, i: any) => (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginHorizontal: 20,
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
            key={i}
            onPress={async () => {
              navigation.navigate("TokenScreen", {
                data: {
                  ...e,
                  amount: getBalance(e, balances),
                },
              });
              const search_items = await AsyncStorage.getItem(
                LOCALE_STORAGE._WALLET,
              );

              if (search_items) {
                const arr: any[] = JSON.parse(search_items);
                const item: any = arr.find(
                  (a: any) => a.item.symbol === e.symbol,
                );

                if (item) {
                  item.count = item.count + 1;
                  await AsyncStorage.setItem(
                    LOCALE_STORAGE._WALLET,
                    JSON.stringify(arr),
                  );
                } else {
                  arr.push({
                    count: 1,
                    item: e,
                  });
                  await AsyncStorage.setItem(
                    LOCALE_STORAGE._WALLET,
                    JSON.stringify(arr),
                  );
                }
              } else {
                const s = [
                  {
                    count: 1,
                    item: e,
                  },
                ];
                await AsyncStorage.setItem(
                  LOCALE_STORAGE._WALLET,
                  JSON.stringify(s),
                );
              }
            }}
          >
            <Image
              source={ICONS[e.symbol.toLowerCase()]}
              style={{ width: 40, height: 40 }}
            />
            <View style={{ gap: 4, width: "75%" }}>
              <MyTextApp
                style={{ ...FONTS.fontBold, color: colors.title }}
                numberOfLines={1}
              >
                {t(e.symbol)}
              </MyTextApp>
            </View>
          </TouchableOpacity>
        ))}

      {!nameSearch &&
        topSearchItems &&
        topSearchItems.length > 0 &&
        topSearchItems?.map((e: any, i: any) => (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginHorizontal: 20,
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
            key={i}
            onPress={async () => {
              navigation.navigate("TokenScreen", {
                data: {
                  ...e.item,
                  amount: getBalance(e.item, balances),
                },
              });
              e.count = e.count + 1;
              await AsyncStorage.setItem(
                LOCALE_STORAGE._WALLET,
                JSON.stringify(topSearchItems),
              );
            }}
          >
            <View
              style={{
                height: 24,
                width: 24,
                alignItems: "center",
              }}
            >
              {i <= 1 ? (
                <Image source={ICONS.top_search} />
              ) : (
                <MyTextApp
                  style={{
                    color: colors.text,
                    ...FONTS.fontBold,
                  }}
                >
                  {i + 1}
                </MyTextApp>
              )}
            </View>
            <Image
              source={ICONS[e?.item?.symbol?.toLowerCase()]}
              style={{ width: 40, height: 40 }}
            />
            <View style={{ gap: 4, width: "75%" }}>
              <MyTextApp
                style={{ ...FONTS.fontBold, color: colors.title }}
                numberOfLines={1}
              >
                {t(e?.item?.symbol)}
              </MyTextApp>
            </View>
          </TouchableOpacity>
        ))}
    </>
  );
}

export function SearchMaketplace({
  colors,
  route,
  navigation,
  nameSearch,
  screen,
}: {
  colors: any;
  route: any;
  navigation: any;
  nameSearch: string;
  screen: any;
}) {
  const { index, serviceID, callback } = route.params;
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const servicesID = serviceID ?? SERVICE_ID._9DNFT;
  const [filtersName, setFiltersName]: [filters: NFTFilters, setFilters: any] =
    useState<any>(null);

  const [assetsFilterName, setAssetsFilterName] = useState<any>(null);
  const [topSearchItems, setTopSearchItems] = useState([]);

  useEffect(() => {
    if (!screen) return;
    if (!nameSearch) return;
    onSuggestNameNft(nameSearch);
  }, [nameSearch]);

  const onSuggestNameNft = (e: string) => {
    setAssetsFilterName([]);
    const nameNFTFilter = e?.trim();
    if (nameNFTFilter && nameNFTFilter.length !== 0) {
      const mFilter = NFTFilters.fromString(filtersName.toString());
      mFilter.remove("metadataNames", undefined);
      mFilter.push("metadataNames", e?.trim());
      mFilter.push("offset", 0);
      mFilter.push("limit", DEFAULT_NUM_NFT_FILTER_BY_NAME);
      setFiltersName({ ...mFilter.toInterface() });
    }
  };

  const dispatchFilterNameDatas = (request: GetMarketDatas) =>
    dispatch(
      NFTActions.getFilterNameDatas({
        ...request,
        serviceID: servicesID,
      }),
    );

  const filterNameDatasResponse = useSelector(
    NFTReducers.filterNameDatasResponse,
  );

  useEffect(() => {
    if (screen === "Shop") {
      const { filters }: any = route.params;
      if (!filters) return;
      setFiltersName(filters);
    }
  }, [screen]);

  useEffect(() => {
    if (filtersName === null) return;

    dispatchFilterNameDatas({
      filters: filtersName,
    });
    setAssetsFilterName(null);
  }, [filtersName]);

  useEffect(() => {
    if (!screen) return;
    setTopSearchItems([]);
    setAssetsFilterName(null);
    const { index, game } = route.params;

    AsyncStorage.getItem(LOCALE_STORAGE._NFTS)
      .then((value: any) => {
        value !== null
          ? setTopSearchItems(
              JSON.parse(value)?.filter(
                (e: any) => e.index === index && e.game === game, // serviceID
              ) ?? [],
            )
          : setTopSearchItems([]);
      })
      .catch(() => {
        setTopSearchItems([]);
      });
  }, []);

  useEffect(() => {
    let ret: Nft[] = [];

    if (filterNameDatasResponse !== null) {
      ret = [...filterNameDatasResponse];
      setAssetsFilterName(ret);
    } else {
      setAssetsFilterName([]);
    }
  }, [filterNameDatasResponse]);

  return (
    <>
      {!nameSearch && (
        <>
          <MyTextApp
            style={{
              ...FONTS.fontBold,
              fontSize: 16,
              paddingHorizontal: 24,
              color: colors.title,
            }}
          >
            {t("common.top_search")}
          </MyTextApp>
        </>
      )}
      {!nameSearch &&
        topSearchItems &&
        topSearchItems.length > 0 &&
        topSearchItems.map((e: any, i: any) => {
          if (e) {
            const meta = Dmetadata.fromObject(e?.item?.metadata);
            return (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginHorizontal: 20,
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
                key={i}
                activeOpacity={0.8}
                onPress={async () => {
                  callback(e.item);
                  e.count = e.count + 1;
                  await AsyncStorage.setItem(
                    LOCALE_STORAGE._NFTS,
                    JSON.stringify(topSearchItems),
                  );

                  e.index === NFTS_INDEX._DASHBOARD
                    ? navigation.navigate("Shop", {
                        tab: NFTS_INDEX._MARKETPLACE,
                      })
                    : navigation.goBack();
                  return null;
                }}
              >
                <View
                  style={{
                    height: 24,
                    width: 24,
                    alignItems: "center",
                  }}
                >
                  {i <= 1 ? (
                    <Image source={ICONS.top_search} />
                  ) : (
                    <MyTextApp
                      style={{
                        color: colors.text,
                        ...FONTS.fontBold,
                      }}
                    >
                      {i + 1}
                    </MyTextApp>
                  )}
                </View>
                <ImageBackground
                  source={QUALITY[meta?.quality?.value]}
                  alt=""
                  borderRadius={8}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                  }}
                >
                  <Image
                    source={{
                      uri: toIpfsGatewayUrl(e.item.metadata.image, e.game),
                    }}
                    style={{
                      width: 38,
                      height: 38,
                      // borderRadius: 8
                    }}
                  />
                </ImageBackground>
                <View>
                  {meta?.quality?.value === "Platinum" ? (
                    <View
                      style={
                        {
                          // marginBottom: 16,
                        }
                      }
                    >
                      <GradientText
                        colors={[
                          "#6888FF",
                          "#FF77BC",
                          "#FFB342",
                          "#80E64E",
                          "#1ECAF7",
                        ]}
                        style={{
                          ...FONTS.fontBold,
                          color: "#fff",
                        }}
                      >
                        {e.item?.metadata.name}
                      </GradientText>
                    </View>
                  ) : (
                    <MyTextApp
                      style={{
                        ...FONTS.fontBold,
                        color: meta?.quality?.value
                          ? TITLE_COLOR_QUALITY[meta?.quality?.value]
                          : colors.title,
                      }}
                    >
                      {e.item?.metadata.name}
                    </MyTextApp>
                  )}
                  <MyTextApp style={{ color: colors.text, ...FONTS.fontXs }}>
                    {cf_services.find((j) => j.serviceID === e?.game)
                      ?.serviceName ?? ""}
                  </MyTextApp>
                </View>
              </TouchableOpacity>
            );
          }
        })}

      <View style={{ marginTop: 0, paddingBottom: 24 }}>
        {nameSearch &&
          screen === "Shop" &&
          (index === NFTS_INDEX._MARKETPLACE ||
            index === NFTS_INDEX._DASHBOARD) &&
          (assetsFilterName === null ? (
            <View style={{ flex: 1, alignItems: "center" }}>
              <IconLoadingDataComponent />
            </View>
          ) : assetsFilterName?.length !== 0 ? (
            assetsFilterName?.map((item: Nft, i: any) => {
              const meta = Dmetadata.fromObject(item?.metadata);
              return (
                item && (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      paddingVertical: 8,
                      borderBottomColor: "#343444",
                      borderBottomWidth: 1,
                      marginHorizontal: 20,
                    }}
                    activeOpacity={0.8}
                    onPress={async () => {
                      callback(item);

                      index === NFTS_INDEX._MARKETPLACE
                        ? navigation.goBack()
                        : navigation.navigate("Shop", {
                            tab: NFTS_INDEX._MARKETPLACE,
                          });
                      const search_items = await AsyncStorage.getItem(
                        LOCALE_STORAGE._NFTS,
                      );

                      if (search_items) {
                        const arr: any[] = JSON.parse(search_items);
                        const _item: any = arr.find(
                          (a: any) =>
                            a.item.metadata.name.toLowerCase() ===
                            item.metadata.name.toLowerCase(),
                        );

                        if (_item) {
                          _item.count = _item.count + 1;
                          await AsyncStorage.setItem(
                            LOCALE_STORAGE._NFTS,
                            JSON.stringify(arr),
                          );
                        } else {
                          arr.push({
                            count: 1,
                            item,
                            game: route.params.game, // serviceID
                            index: route.params.index, // index of tab bar menu
                          });
                          await AsyncStorage.setItem(
                            LOCALE_STORAGE._NFTS,
                            JSON.stringify(arr),
                          );
                        }
                      } else {
                        const s = [
                          {
                            count: 1,
                            item,
                            game: route.params.game,
                            index: route.params.index,
                          },
                        ];
                        await AsyncStorage.setItem(
                          LOCALE_STORAGE._NFTS,
                          JSON.stringify(s),
                        );
                      }
                      return null;
                    }}
                  >
                    <ImageBackground
                      source={QUALITY[meta?.quality?.value]}
                      alt=""
                      borderRadius={8}
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        width: 40,
                        height: 40,
                      }}
                    >
                      <Image
                        source={{
                          uri: toIpfsGatewayUrl(
                            item?.metadata.image,
                            SERVICE_ID._9DNFT,
                          ),
                        }}
                        style={{
                          width: 38,
                          height: 38,
                          // borderRadius: 8
                        }}
                      />
                    </ImageBackground>
                    <View>
                      {meta?.quality?.value === "Platinum" ? (
                        <View
                          style={
                            {
                              // marginBottom: 16,
                            }
                          }
                        >
                          <GradientText
                            colors={[
                              "#6888FF",
                              "#FF77BC",
                              "#FFB342",
                              "#80E64E",
                              "#1ECAF7",
                            ]}
                            style={{
                              ...FONTS.fontBold,
                              color: "#fff",
                            }}
                          >
                            {item?.metadata.name}
                          </GradientText>
                        </View>
                      ) : (
                        <MyTextApp
                          style={{
                            ...FONTS.fontBold,
                            color: meta?.quality?.value
                              ? TITLE_COLOR_QUALITY[meta?.quality?.value]
                              : colors.title,
                          }}
                        >
                          {item?.metadata.name}
                        </MyTextApp>
                      )}
                      <MyTextApp style={{ color: colors.text }}>
                        {
                          cf_services.find(
                            (e) => e?.serviceID === route.params?.game,
                          )?.serviceName
                        }
                      </MyTextApp>
                    </View>
                  </TouchableOpacity>
                )
              );
            })
          ) : (
            <View style={{ flex: 1, alignItems: "center" }}>
              <NoDataComponent />
            </View>
          ))}
      </View>
    </>
  );
}

export function SearchInventory({
  route,
  nameSearch,
  colors,
  navigation,
}: {
  route: any;
  nameSearch: any;
  colors: any;
  navigation: any;
}) {
  const dispatch = useDispatch();
  const accountWeb = useSelector(AccountReducers.dataAccount);
  const { kind, index, screen, callback, game } = route.params;

  const [filtersName, setFiltersName]: [filters: NFTFilters, setFilters: any] =
    useState<any>(null);
  const [queryAccount, setQueryAccount]: [v: string, setV: any] = useState("");

  const [assetsFilterName, setAssetsFilterName] = useState<any>(null);
  const [topSearchItems, setTopSearchItems] = useState([]);

  const dispatchFilterNameSellingDatas = (request: GetDatas) =>
    dispatch(
      NFTActions.getFilterNameSellingDatas({
        ...request,
        serviceID: game,
      }),
    );

  const dispatchFilterNameOfferingDatas = (request: GetDatas) =>
    dispatch(
      NFTActions.getFilterNameOfferingDatas({
        ...request,
        serviceID: game,
      }),
    );

  const dispatchFilterNameListingDatas = (request: GetDatas) =>
    dispatch(
      NFTActions.getFilterNameDatas({
        ...request,
        serviceID: game,
      }),
    );

  const onSuggestNameNft = (e: string) => {
    const nameNFTFilter = e?.trim();
    if (nameNFTFilter && nameNFTFilter.length !== 0) {
      const mFilter = NFTFilters?.fromString(filtersName?.toString());
      mFilter.remove("metadataNames", undefined);
      mFilter.push("metadataNames", e?.trim());
      mFilter.push("offset", 0);
      mFilter.push("limit", DEFAULT_NUM_NFT_FILTER_BY_NAME);
      setFiltersName({ ...mFilter.toInterface() });
    }
  };

  useEffect(() => {
    if (!screen) return;
    if (!nameSearch) return;
    onSuggestNameNft(nameSearch);
  }, [nameSearch]);

  const filterNameListingDatasResponse = useSelector(
    NFTReducers.filterNameDatasResponse,
  );

  const filterNameSellingDatasResponse = useSelector(
    NFTReducers.filterNameSellingDatasResponse,
  );

  const filterNameOfferingDatasResponse = useSelector(
    NFTReducers.filterNameOfferingDatasResponse,
  );

  const isGetSelling = (): boolean => {
    return kind === ListInventory.LIST_SELLING;
  };

  const isGetOffering = (): boolean => {
    return kind === ListInventory.LIST_OFFERING;
  };

  const getDefaultFilters = (): INFTFilters => {
    const _p: NFTFilters = new NFTFilters();
    _p.push("orders", {
      created: "desc",
    });
    _p.push("limit", 12);
    _p.push("offset", 0);
    return _p.toInterface();
  };

  useEffect(() => {
    if (accountWeb) {
      setQueryAccount(descyptNEMOWallet(accountWeb?.nemo_address));
      setFiltersName(getDefaultFilters());
    }
  }, [accountWeb]);

  useEffect(() => {
    if (filtersName === null) return;
    setAssetsFilterName(null);
    if (isGetSelling()) {
      dispatchFilterNameSellingDatas({
        account: queryAccount,
        filters: filtersName,
      });
    } else if (isGetOffering()) {
      dispatchFilterNameOfferingDatas({
        account: queryAccount,
        filters: filtersName,
      });
    } else {
      dispatchFilterNameListingDatas({
        account: queryAccount,
        filters: filtersName,
      });
    }
  }, [filtersName]);

  useEffect(() => {
    if (!screen) return;
    setTopSearchItems([]);
    setAssetsFilterName(null);
    const { index, game, kind } = route.params;
    AsyncStorage.getItem(LOCALE_STORAGE._NFTS)
      .then((value: any) => {
        value !== null
          ? setTopSearchItems(
              JSON.parse(value)?.filter(
                (e: any) =>
                  e.index === index && // tab index
                  e.game === game && // serviceID
                  e.kind.toLowerCase().trim() === kind.toLowerCase().trim(), // kind of ineventory
              ) ?? [],
            )
          : setTopSearchItems([]);
      })
      .catch(() => {
        setTopSearchItems([]);
      });
  }, []);

  useEffect(() => {
    if (isGetSelling()) {
      if (filterNameSellingDatasResponse !== null) {
        setAssetsFilterName(filterNameSellingDatasResponse);
      } else {
        setAssetsFilterName([]);
      }
    } else if (isGetOffering()) {
      if (filterNameOfferingDatasResponse !== null) {
        setAssetsFilterName(filterNameOfferingDatasResponse);
      } else {
        setAssetsFilterName([]);
      }
    } else {
      if (filterNameListingDatasResponse !== null) {
        setAssetsFilterName(filterNameListingDatasResponse);
      } else {
        setAssetsFilterName([]);
      }
    }
  }, [
    filterNameListingDatasResponse,
    filterNameSellingDatasResponse,
    filterNameOfferingDatasResponse,
  ]);

  const { t } = useTranslation();

  return (
    <>
      {!nameSearch && (
        <>
          <MyTextApp
            style={{
              ...FONTS.fontBold,
              fontSize: 16,
              paddingHorizontal: 24,
              color: colors.title,
            }}
          >
            {t("common.top_search")}
          </MyTextApp>
        </>
      )}
      {!nameSearch &&
        topSearchItems &&
        topSearchItems.length > 0 &&
        topSearchItems.map((e: any, i: any) => {
          if (e) {
            const meta = Dmetadata.fromObject(e?.item?.metadata);
            return (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginHorizontal: 20,
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
                key={i}
                activeOpacity={0.8}
                onPress={async () => {
                  callback(e.item);
                  e.count = e.count + 1;
                  await AsyncStorage.setItem(
                    LOCALE_STORAGE._NFTS,
                    JSON.stringify(topSearchItems),
                  );
                  navigation.goBack();
                  return null;
                }}
              >
                <View
                  style={{
                    height: 24,
                    width: 24,
                    alignItems: "center",
                  }}
                >
                  {i <= 1 ? (
                    <Image source={ICONS.top_search} />
                  ) : (
                    <MyTextApp
                      style={{
                        color: colors.text,
                        ...FONTS.fontBold,
                      }}
                    >
                      {i + 1}
                    </MyTextApp>
                  )}
                </View>
                <ImageBackground
                  source={QUALITY[meta?.quality?.value]}
                  alt=""
                  borderRadius={8}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                  }}
                >
                  <Image
                    source={{
                      uri: toIpfsGatewayUrl(e.item.metadata.image, e.game),
                    }}
                    style={{
                      width: 38,
                      height: 38,
                      // borderRadius: 8
                    }}
                  />
                </ImageBackground>
                <View>
                  {meta?.quality?.value === "Platinum" ? (
                    <View
                      style={
                        {
                          // marginBottom: 16,
                        }
                      }
                    >
                      <GradientText
                        colors={[
                          "#6888FF",
                          "#FF77BC",
                          "#FFB342",
                          "#80E64E",
                          "#1ECAF7",
                        ]}
                        style={{
                          ...FONTS.fontBold,
                          color: "#fff",
                        }}
                      >
                        {e.item?.metadata.name}
                      </GradientText>
                    </View>
                  ) : (
                    <MyTextApp
                      style={{
                        ...FONTS.fontBold,
                        color: meta?.quality?.value
                          ? TITLE_COLOR_QUALITY[meta?.quality?.value]
                          : colors.title,
                      }}
                    >
                      {e.item?.metadata.name}
                    </MyTextApp>
                  )}
                  <MyTextApp style={{ color: colors.text, ...FONTS.fontXs }}>
                    {cf_services.find((j) => j.serviceID === e?.game)
                      ?.serviceName ?? ""}
                  </MyTextApp>
                </View>
              </TouchableOpacity>
            );
          }
        })}

      <View style={{ marginTop: 0, paddingBottom: 24 }}>
        {nameSearch &&
          screen === "Shop" &&
          index === NFTS_INDEX._INVENVTORY &&
          (assetsFilterName === null ? (
            <View style={{ flex: 1, alignItems: "center" }}>
              <IconLoadingDataComponent />
            </View>
          ) : assetsFilterName?.length !== 0 ? (
            assetsFilterName?.map((item: Nft, i: any) => {
              const meta = Dmetadata.fromObject(item?.metadata);
              return (
                item && (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      paddingVertical: 8,
                      borderBottomColor: "#343444",
                      borderBottomWidth: 1,
                      marginHorizontal: 20,
                    }}
                    activeOpacity={0.8}
                    onPress={async () => {
                      callback(item);
                      navigation.goBack();
                      const searchItems = await AsyncStorage.getItem(
                        LOCALE_STORAGE._NFTS,
                      );

                      if (searchItems) {
                        const arr: any[] = JSON.parse(searchItems);
                        const _item: any = arr.find(
                          (a: any) =>
                            a.item.metadata.name.toLowerCase() ===
                            item.metadata.name.toLowerCase(),
                        );

                        if (_item) {
                          _item.count = _item.count + 1;
                          await AsyncStorage.setItem(
                            LOCALE_STORAGE._NFTS,
                            JSON.stringify(arr),
                          );
                        } else {
                          arr.push({
                            count: 1,
                            kind,
                            item,
                            game, // serviceID
                            index, // index of tab bar menu
                          });
                          await AsyncStorage.setItem(
                            LOCALE_STORAGE._NFTS,
                            JSON.stringify(arr),
                          );
                        }
                      } else {
                        const s = [
                          {
                            count: 1,
                            kind,
                            item,
                            game,
                            index,
                          },
                        ];
                        await AsyncStorage.setItem(
                          LOCALE_STORAGE._NFTS,
                          JSON.stringify(s),
                        );
                      }
                      return null;
                    }}
                  >
                    <ImageBackground
                      source={QUALITY[meta?.quality?.value]}
                      alt=""
                      borderRadius={8}
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        width: 40,
                        height: 40,
                      }}
                    >
                      <Image
                        source={{
                          uri: toIpfsGatewayUrl(
                            item?.metadata.image,
                            SERVICE_ID._9DNFT,
                          ),
                        }}
                        style={{
                          width: 38,
                          height: 38,
                          // borderRadius: 8
                        }}
                      />
                    </ImageBackground>
                    <View>
                      {meta?.quality?.value === "Platinum" ? (
                        <View
                          style={
                            {
                              // marginBottom: 16,
                            }
                          }
                        >
                          <GradientText
                            colors={[
                              "#6888FF",
                              "#FF77BC",
                              "#FFB342",
                              "#80E64E",
                              "#1ECAF7",
                            ]}
                            style={{
                              ...FONTS.fontBold,
                              color: "#fff",
                            }}
                          >
                            {item?.metadata.name}
                          </GradientText>
                        </View>
                      ) : (
                        <MyTextApp
                          style={{
                            ...FONTS.fontBold,
                            color: meta?.quality?.value
                              ? TITLE_COLOR_QUALITY[meta?.quality?.value]
                              : colors.title,
                          }}
                        >
                          {item?.metadata.name}
                        </MyTextApp>
                      )}
                      <MyTextApp style={{ color: colors.text }}>
                        {
                          cf_services.find(
                            (e) => e?.serviceID === route.params?.game,
                          )?.serviceName
                        }
                      </MyTextApp>
                    </View>
                  </TouchableOpacity>
                )
              );
            })
          ) : (
            <View style={{ flex: 1, alignItems: "center" }}>
              <NoDataComponent />
            </View>
          ))}
      </View>
    </>
  );
}
