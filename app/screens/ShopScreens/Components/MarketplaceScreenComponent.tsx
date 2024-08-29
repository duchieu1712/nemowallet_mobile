import { View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import ListGameComponent from "../../../components/ShopComponents/ListGameComponent";
import MarketplaceComponent from "../../../components/ShopComponents/MarketplaceComponent/MarketplaceComponent";
import type NFTFilters from "../../../modules/nft/filters";
import ScrollViewToTop from "../../../components/ScrollToTopComponent";
import SelectTypeFilterComponent from "../../../components/ShopComponents/SelectTypeFilterComponent";
import { includes } from "lodash";
import { type cf_services } from "../../../config/services";
import { cf_typeFilter } from "../../../config/galix_type";

export default function MarketplaceScreenComponent({
  game,
  setGame,
  navigation,
  filters,
  setFilters,
}: {
  game: (typeof cf_services)[0];
  setGame: any;
  filters: NFTFilters;
  setFilters: any;
  navigation: any;
}) {
  const [priceFilters, setPriceFilters] = useState(cf_typeFilter[2]);
  const [refresh, setRefreshing] = useState(false);

  useEffect(() => {
    if (!priceFilters || !filters?.limit) return;
    const value = priceFilters.value;
    if (!includes(value, "-")) return;
    filters.remove("orders", "");
    const [k, v] = value.split("-");
    const _o: any = {};
    _o[k] = v;
    filters.push("orders", _o);
    filters.push("offset", 0);
    filters.push("limit", 12);
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      ...filters.toInterface(),
    }));
  }, [priceFilters]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  return (
    <ScrollViewToTop
      refreshing={refresh}
      onRefresh={onRefresh}
      bottomIcon={200}
    >
      <ListGameComponent game={game} setGame={setGame} />
      <View
        style={{
          paddingHorizontal: 20,
          marginTop: 8,
        }}
      >
        <SelectTypeFilterComponent
          priceFilters={priceFilters}
          setPriceFilters={setPriceFilters}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 12,
          marginVertical: 16,
          paddingHorizontal: 20,
          paddingBottom: 120,
        }}
      >
        <MarketplaceComponent
          refresh={refresh}
          setRefresh={setRefreshing}
          filters={filters}
          setFilters={setFilters}
          serviceID={game.serviceID}
          navigation={navigation}
        />
      </View>
    </ScrollViewToTop>
  );
}
