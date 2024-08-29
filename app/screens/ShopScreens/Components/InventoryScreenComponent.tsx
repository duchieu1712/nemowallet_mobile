import { View } from "react-native";
import { useCallback, useEffect, useState } from "react";

import Inventory from "../../../components/ShopComponents/InventoryComponent/inventory";
import KindFilterinventoryComponent from "../../../components/ShopComponents/KindFilterInventoryCompoent";
import ListGameComponent from "../../../components/ShopComponents/ListGameComponent";
import NFTFilters from "../../../modules/nft/filters";
import ScrollViewToTop from "../../../components/ScrollToTopComponent";
import SelectTypeFilterComponent from "../../../components/ShopComponents/SelectTypeFilterComponent";
import { includes } from "lodash";
import { isLogined } from "../../../common/utilities";
import { type cf_services } from "../../../config/services";
import { cf_typeFilter } from "../../../config/galix_type";

export default function InventoryScreen({
  game,
  setGame,
  filters,
  setFilters,
  setShowFilter,
  kindInventory,
  setKindInventory,
}: {
  game: (typeof cf_services)[0];
  setGame: any;
  filters: NFTFilters;
  setFilters: any;
  setShowFilter: any;
  kindInventory: any;
  setKindInventory: any;
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

  useEffect(() => {
    if (!isLogined() || !kindInventory || filters === null) return;
    filters.push("limit", 12);
    filters.push("offset", 0);
    setFilters({ ...filters.toInterface() });
  }, [kindInventory]);

  useEffect(() => {
    setShowFilter(false);
    if (!filters) return;
    const newfilters = new NFTFilters();
    newfilters.push("limit", 12);
    newfilters.push("offset", 0);
    setFilters(newfilters);
  }, [game, kindInventory]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  return (
    <ScrollViewToTop refreshing={refresh} onRefresh={onRefresh}>
      <ListGameComponent game={game} setGame={setGame} />
      <View
        style={{
          // flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingHorizontal: 19,
          marginVertical: 16,
        }}
      >
        <SelectTypeFilterComponent
          priceFilters={priceFilters}
          setPriceFilters={setPriceFilters}
        />

        <KindFilterinventoryComponent
          kindInventory={kindInventory}
          setKindInventory={setKindInventory}
        />

        <View>
          <Inventory
            kind={kindInventory}
            setKind={setKindInventory}
            orders={priceFilters}
            refreshing={refresh}
            setRefreshing={setRefreshing}
            filters={filters}
            setFilters={setFilters}
            serviceID={game.serviceID}
          />
        </View>
      </View>
    </ScrollViewToTop>
  );
}
