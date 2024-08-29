import { COLORS, FONTS, MyTextApp, SIZES } from "../../themes/theme";
import {
  FILTER_NFT_TYPE_GALIX_MARKET,
  FILTER_NFT_TYPE_MARSWAR_MARKET,
  type FILTER_NFT_TYPE_RICHWORK_FARM_FAMILY_MARKET,
  NFTS_INDEX,
  SERVICE_ID,
} from "../../common/enum";
import {
  cf_LST_FILTER_LEVEL,
  cf_LST_PACKAGE,
  cf_LST_RARITY,
  cf_LST_TYPES,
} from "../../config/filters/filters_Galix";
import {
  cf_LST_FILTER_LEVEL_MECHA,
  cf_LST_FILTER_STAR_MECHA,
  cf_LST_RARITY_MECHA_WARFARE,
  cf_LST_TYPES_MECHA,
} from "../../config/filters/filters_Mecha";
import {
  cf_Marswar_NFTType,
  galixNFTType,
  richWorkFarmFamilyNFTType,
} from "../../config/galix_type";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import {
  cf_listFilterEquipment,
  cf_listFilterGrade,
  cf_listFilterPet,
  cf_listFitlers_9DNFT,
} from "../../config/filters/filters9D";
import {
  cf_listFilterEquipment_SoulRealm,
  cf_listFilterGrade_SoulRealm,
  cf_listFilterPet_SoulRealm,
  cf_listFitlers_SoulRealm,
} from "../../config/filters/filters_SoulRealm";
import {
  cf_listFilter_Flashpoint,
  cf_listQuality,
} from "../../config/filters/filters_Flashpoint";

import Accordion from "react-native-collapsible/Accordion";
import CheckBox from "@react-native-community/checkbox";
import FeatherIcon from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { isEmpty } from "lodash";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import NFTFilters from "../../modules/nft/filters";
import ActionModalsComponent from "../ModalComponent/ActionModalsComponent";
import Toast from "../ToastInfo";
import { checkIsNumber } from "../../common/utilities";
import { DEFAULT_MAX_VALUE_FILTER } from "../../common/constants";
import InputComponent from "../InputComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import {
  SliderQualityComponent,
  SliderScrolls9DComponent,
  SliderScrollsGalixComponent,
  SlidersPetComponent,
} from "../SliderScrollComponent";
import { cf_notShowFilter } from "../../config/services";

export function Filter9DComponent({
  filters,
  setFilters,
  showFilter,
  setShowFilter,
  index,
}: {
  filters: NFTFilters;
  setFilters: any;
  showFilter: boolean;
  setShowFilter: any;
  index: number;
}) {
  const { t } = useTranslation();
  const { colors, dark } = useTheme();
  const [priceMax, setPriceMax] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [isVisibleSliderEquipment, setIsVisibleSliderEquipment] =
    useState(false);

  const [isVisibleSliderPet, setIsVisibleSliderPet] = useState(false);
  const [sliderEquipment, setSliderEquipment]: [
    sliderEquipment: [number, number],
    setSliderEquipment: any,
  ] = useState([0, cf_listFilterEquipment.length - 1]);

  const [sliderGrade, setSliderGrade]: [
    slidergrade: [number, number],
    setSliderGrade: any,
  ] = useState([0, cf_listFilterGrade[cf_listFilterGrade.length - 1].grade]);

  const [sliderPet, setSliderPet]: [
    sliderPet: [number, number],
    setSliderPet: any,
  ] = useState([0, cf_listFilterPet.length - 1]);

  const initFilterPriceAndName = () => {
    setPriceMax("");
    setPriceMin("");
  };

  const onFilterPrices = (e: any) => {
    // price
    if (!checkIsNumber(priceMin) || !checkIsNumber(priceMax)) {
      filters.remove("prices", undefined);
      Toast.error(t("nfts.inventory_tab.price_invalid"));
    } else {
      let minFilter = priceMin;
      let maxFilter = priceMax;
      if (minFilter == "") {
        minFilter = "0";
      }
      if (maxFilter == "") maxFilter = DEFAULT_MAX_VALUE_FILTER.toString();
      const min = parseInt(minFilter);
      const max = parseInt(maxFilter);
      if (min < 0 || max < 0 || min > max) {
        filters.remove("prices", undefined);
        if (min > max && min > 0 && max > 0) {
          Toast.error(t("nfts.inventory_tab.max_price_greater_than_min"));
        }
      } else {
        const _p: any = {};
        _p.min = min;
        _p.max = max;
        filters.push("prices", _p);
      }
    }
    filters.push("offset", 0);
    setFilters({ ...filters.toInterface() });
  };

  const removeFilterSilderEquipment = () => {
    for (let i = 0; i < cf_listFilterEquipment.length; i++) {
      filters.remove("collections", cf_listFilterEquipment[i].slug);
    }
  };

  const addFilterSilderEquipment = (value: any) => {
    const step = 1;
    const min = Math.round(value[0] / step);
    const max = Math.round(value[1] / step);
    filters.push("collections", cf_listFilterEquipment[min].slug);
    filters.push("collections", cf_listFilterEquipment[max].slug);
    if (max - min > 1) {
      for (let i = min + 1; i < max; i++) {
        filters.push("collections", cf_listFilterEquipment[i].slug);
      }
    }
  };

  const onFilterTraitType = (e: any, filterNft: any, mfilter: any) => {
    const isChecked = e;
    console.log("annnnnn e", e);

    if (isChecked) {
      if (filterNft.type == "Equipment") {
        setIsVisibleSliderEquipment(true);
        filters.push("metadataTypes", mfilter.metadataType.split(","));
        addFilterSilderEquipment(sliderEquipment);
      } else if (filterNft.type == "Hero/Pet" && mfilter.slug == "petn") {
        setIsVisibleSliderPet(true);
        // Not push metadat of PetN
        // filters.push('metadataTypes', filter.metadataType)
        filters.push("collections", mfilter.slug);
        addFilterSilderPet(sliderPet);
      } else {
        filters.push("collections", mfilter.slug);
        filters.push("metadataTypes", mfilter.metadataType.split(","));
      }
    } else {
      // exist trait type in slug no remove filter.slug
      let flagRemoveCollection = true;
      let flagRemoveMetaTypes = true;
      for (let j = 0; j < cf_listFitlers_9DNFT.length; j++) {
        const lst = cf_listFitlers_9DNFT[j];
        if (
          !lst.lstFilter.some(
            (e) =>
              e.slug == mfilter.slug && e.metadataType == mfilter.metadataType,
          )
        )
          continue;
        for (let i = 0; i < lst.lstFilter.length; i++) {
          if (
            lst.lstFilter[i].slug == mfilter.slug &&
            lst.lstFilter[i].metadataType != mfilter.metadataType &&
            filters.includes("metadataTypes", lst.lstFilter[i].metadataType)
          ) {
            flagRemoveCollection = false;
          }
          if (
            lst.lstFilter[i].slug != mfilter.slug &&
            lst.lstFilter[i].metadataType == mfilter.metadataType &&
            filters.includes("collections", lst.lstFilter[i].slug)
          ) {
            flagRemoveMetaTypes = false;
          }
        }
      }
      if (flagRemoveMetaTypes) {
        filters.remove("metadataTypes", mfilter.metadataType.split(","));
      }
      if (flagRemoveCollection) {
        if (filterNft.type == "Equipment") {
          setIsVisibleSliderEquipment(false);
          removeFilterSilderEquipment();
          removeFilterSilderGrade();
        } else if (filterNft.type == "Hero/Pet" && mfilter.slug == "petn") {
          setIsVisibleSliderPet(false);
          removeFilterSilderPet();
          filters.remove("collections", mfilter.slug);
        } else {
          filters.remove("collections", mfilter.slug);
        }
      }
    }
    filters.push("offset", 0);
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      ...filters.toInterface(),
    }));
  };

  const onChangeSliderGrade = (value: any) => {
    setSliderGrade(value);
  };

  const removeFilterSilderGrade = () => {
    filters.remove("metadataGrades", undefined);
    // setSliderGrade([0, 100]);
    setSliderGrade([
      0,
      cf_listFilterGrade[cf_listFilterGrade.length - 1].grade,
    ]);
  };

  const onChangeSliderPet = (value: any) => {
    // remove
    removeFilterSilderPet();
    // change slider value
    setSliderPet(value);
    // push
    addFilterSilderPet(value);
    filters.push("offset", 0);
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      ...filters.toInterface(),
    }));
  };

  const addFilterSilderPet = (value: any) => {
    const min = value[0];
    const max = value[1];
    filters.push(
      "metadataTypes",
      cf_listFilterPet[value[0]].metadataType.split(","),
    );
    filters.push(
      "metadataTypes",
      cf_listFilterPet[value[1]].metadataType.split(","),
    );
    if (max - min > 1) {
      for (let i = min + 1; i < max; i++) {
        filters.push(
          "metadataTypes",
          cf_listFilterPet[i].metadataType.split(","),
        );
      }
    }
  };

  const onChangeSliderEquipment = (value: any) => {
    // remove
    removeFilterSilderEquipment();
    // change slider value
    setSliderEquipment(value);
    // push
    addFilterSilderEquipment(value);
    filters.push("offset", 0);
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      ...filters.toInterface(),
    }));
  };

  const removeFilterSilderPet = () => {
    for (let i = 0; i < cf_listFilterPet.length; i++) {
      filters.remove(
        "metadataTypes",
        cf_listFilterPet[i].metadataType.split(","),
      );
    }
  };

  const [activeSections, setActiveSections] = useState([7]);
  const setSections = (sections: any) => {
    setActiveSections(sections.includes(undefined) ? [] : sections);
  };

  const cleanup = () => {
    setFilters(new NFTFilters());
    setIsVisibleSliderEquipment(false);
    setSliderEquipment([0, 0]);
    setSliderGrade([0, 100]);
    setIsVisibleSliderPet(false);
    setSliderPet([0, 100]);
    // initFilterPriceAndName()
  };

  const AccordionHeader = (item: any, _: any, isActive: boolean) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          justifyContent: "space-between",
        }}
      >
        <MyTextApp
          style={{
            fontWeight: "bold",
            fontSize: 20,
            ...styles.nameFilters,
            color: colors.title,
          }}
        >
          {item.type}
        </MyTextApp>
        <FontAwesome
          name={isActive ? "angle-up" : "angle-down"}
          size={20}
          color={colors.title}
        />
      </View>
    );
  };

  const AccordionBody = (
    item: (typeof cf_listFitlers_9DNFT)[0],
    index: any,
    isActive: boolean,
  ) => {
    return (
      <View style={{ overflow: "visible" }}>
        <View style={styles.itemFilterDashboard}>
          {item.lstFilter.map((filter, j) => (
            <View
              key={`a${j}`}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
              accessible={true}
            >
              <CheckBox
                accessibilityLabelledBy={"list" + index + "_" + j}
                accessibilityLabel="input"
                value={
                  filter.slug == "petn"
                    ? filters?.includes("collections", "petn")
                    : filters?.includes("metadataTypes", filter.metadataType) &&
                      filters?.includes("collections", filter.slug)
                }
                onChange={() => {}}
                onValueChange={(e) => {
                  onFilterTraitType(e, item, filter);
                }}
                tintColors={{
                  true: COLORS.primary,
                  false: COLORS.descriptionText,
                }} // Android only - true = backgroundcolor value of checkbox; false = border color value of checkbox
                // iOS only
                tintColor={COLORS.descriptionText} // color of line when checkbox off
                onCheckColor={COLORS.white} // color of check mark when checkbox on
                onFillColor={COLORS.primary} // background checkbox when on
                onTintColor={COLORS.primary} // color of line when checkbox on
              />
              <MyTextApp
                onPress={() => {
                  onFilterTraitType(
                    !(filter.slug == "petn"
                      ? filters?.includes("collections", "petn")
                      : filters?.includes(
                          "metadataTypes",
                          filter.metadataType,
                        ) && filters?.includes("collections", filter.slug)),
                    item,
                    filter,
                  );
                }}
                style={{
                  ...styles.nameCheckbox,
                  color: colors.title,
                }}
                nativeID={"list" + index + "_" + j}
              >
                {filter.categories}
              </MyTextApp>
            </View>
          ))}
        </View>
        {item.type == "Hero/Pet" && isVisibleSliderPet && (
          <View
            style={{
              justifyContent: "center",
              marginTop: 8,
            }}
          >
            <MyTextApp
              style={{
                ...styles.titleSlider,
                color: colors.title,
                ...FONTS.fontBold,
                fontSize: 16,
              }}
            >
              {t("nfts.detail.type")}
            </MyTextApp>
            <SlidersPetComponent
              onChangeSlider={onChangeSliderPet}
              value={sliderPet}
              list={cf_listFilterPet}
            />
          </View>
        )}
        {item.type == "Equipment" && isVisibleSliderEquipment && (
          <>
            <View
              style={{
                justifyContent: "center",
                marginTop: 8,
              }}
            >
              <MyTextApp
                style={{
                  ...styles.titleSlider,
                  color: colors.title,
                  ...FONTS.fontBold,
                  fontSize: 16,
                }}
              >
                {t("nfts.quality")}
              </MyTextApp>
              <SliderQualityComponent
                onChangeSlider={onChangeSliderEquipment}
                value={sliderEquipment}
                list={cf_listFilterEquipment}
              />
            </View>
            <View
              style={{
                marginTop: 25,
                paddingBottom: 16,
                justifyContent: "center",
              }}
            >
              <MyTextApp
                style={{
                  ...styles.titleSlider,
                  color: colors.title,
                  ...FONTS.fontBold,
                  fontSize: 16,
                }}
              >
                {t("nfts.grade")}
              </MyTextApp>
              <SliderScrolls9DComponent
                onChangeSliderCallBack={onChangeSliderGrade}
                value={sliderGrade}
                list={cf_listFilterGrade}
              />
            </View>
          </>
        )}
      </View>
    );
  };

  return (
    <>
      <ActionModalsComponent
        modalVisible={showFilter}
        closeModal={() => setShowFilter(false)}
        childrenPosition="flex-end"
        animation="fade"
      >
        <View
          style={{
            width: 320,
            height: SIZES.width < 390 ? SIZES.height - 70 : SIZES.height - 40,
            paddingVertical: 20,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: dark ? "#282C35" : colors.background,
              padding: 20,
              height: 80,
              marginTop: -20,
            }}
          >
            <View style={styles.titleFilterLeft}>
              <MyTextApp
                style={{
                  color: colors.title,
                  fontSize: 24,
                  ...FONTS.fontBold,
                }}
              >
                {t("nfts.filters")}
              </MyTextApp>
            </View>
            <TouchableOpacity
              style={{
                alignItems: "center",
              }}
              activeOpacity={0.8}
              onPress={() => setShowFilter(false)}
            >
              <FeatherIcon name="x" size={24} color={colors.title} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <View
              style={{
                minHeight: SIZES.height - 160 - 75,
                backgroundColor: colors.background,
              }}
            >
              {index == NFTS_INDEX._MARKETPLACE && (
                <View
                  style={{
                    ...styles.titleFilters,
                    backgroundColor: colors.background,
                  }}
                >
                  <View
                    style={{
                      ...styles.searchPrice,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <InputComponent
                      style={{
                        ...styles.inputSp,
                        color: colors.title,
                        borderWidth: 1,
                        borderColor: "rgba(122, 121, 138, 0.50)",
                        width: 130,
                        height: 48,
                        textAlign: "center",
                      }}
                      placeholder={t("wallet.min")}
                      placeholderTextColor={colors.text}
                      cursorColor={colors.primary}
                      id="price-min"
                      keyboardType="numeric"
                      onChangeText={(text: any) => {
                        setPriceMin(text);
                      }}
                      defaultValue={(() => {
                        if (
                          isEmpty(filters?.prices) ||
                          isEmpty(filters?.prices?.min)
                        )
                          return;
                        return filters?.prices?.min;
                      })()}
                      showClear={false}
                      height={48}
                    />
                    <MyTextApp
                      style={{
                        fontSize: 16,
                        width: 10,
                        backgroundColor: colors.title,
                        height: 1,
                        marginHorizontal: 8,
                      }}
                    ></MyTextApp>
                    <InputComponent
                      style={{
                        ...styles.inputSp,
                        color: colors.title,
                        borderWidth: 1,
                        borderColor: "rgba(122, 121, 138, 0.50)",
                        width: 130,
                        height: 48,
                        textAlign: "center",
                      }}
                      placeholderTextColor={colors.text}
                      placeholder={t("wallet.max")}
                      cursorColor={colors.primary}
                      id="price-max"
                      keyboardType="numeric"
                      onChangeText={(text: string) => {
                        setPriceMax(text);
                      }}
                      defaultValue={(() => {
                        if (
                          isEmpty(filters?.prices) ||
                          isEmpty(filters?.prices?.max)
                        )
                          return;
                        return filters?.prices?.max;
                      })()}
                      height={48}
                      showClear={false}
                    />
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 20,
                      alignItems: "center",
                    }}
                  >
                    <ButtonComponent
                      title={t("nfts.apply")}
                      onPress={(e: any) => {
                        onFilterPrices(e);
                      }}
                      style={{
                        maxWidth: 180,
                      }}
                    />
                  </View>
                </View>
              )}
              <View style={{ ...styles.groupFilter, marginTop: 24 }}>
                <View style={styles.listCheckboxFilter}>
                  <Accordion
                    touchableComponent={TouchableOpacity}
                    onChange={setSections}
                    sections={cf_listFitlers_9DNFT}
                    activeSections={activeSections}
                    renderContent={AccordionBody}
                    renderHeader={AccordionHeader}
                    duration={300}
                    expandMultiple
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: 20,
              height: 80,
              backgroundColor: dark ? "#282C35" : colors.background,
              marginBottom: -20,
            }}
          >
            <View style={styles.btnClearFilter}>
              <ButtonComponent
                title={t("nfts.reset")}
                onPress={() => {
                  cleanup();
                  initFilterPriceAndName();
                  const f = new NFTFilters();
                  f.push("limit", 12);
                  f.push("offset", 0);
                  setFilters(f);
                }}
              />
            </View>
          </View>
        </View>
      </ActionModalsComponent>
    </>
  );
}

export function FilterSoulRealmComponent({
  filters,
  setFilters,
  showFilter,
  setShowFilter,
  index,
}: {
  filters: NFTFilters;
  setFilters: any;
  showFilter: boolean;
  setShowFilter: any;
  index: number;
}) {
  const { t } = useTranslation();
  const { colors, dark } = useTheme();
  const [priceMax, setPriceMax] = useState("");

  const [priceMin, setPriceMin] = useState("");
  const [isVisibleSliderEquipment, setIsVisibleSliderEquipment] =
    useState(false);

  const [isVisibleSliderPet, setIsVisibleSliderPet] = useState(false);
  const [sliderEquipment, setSliderEquipment]: [
    sliderEquipment: [number, number],
    setSliderEquipment: any,
  ] = useState([0, cf_listFilterEquipment_SoulRealm.length - 1]);

  const [sliderGrade, setSliderGrade]: [
    slidergrade: [number, number],
    setSliderGrade: any,
  ] = useState([
    0,
    cf_listFilterGrade_SoulRealm[cf_listFilterGrade_SoulRealm.length - 1].grade,
  ]);

  const [sliderPet, setSliderPet]: [
    sliderPet: [number, number],
    setSliderPet: any,
  ] = useState([0, cf_listFilterPet_SoulRealm.length - 1]);

  const initFilterPriceAndName = () => {
    setPriceMax("");
    setPriceMin("");
  };

  const onFilterPrices = (e: any) => {
    // price
    if (!checkIsNumber(priceMin) || !checkIsNumber(priceMax)) {
      filters.remove("prices", undefined);
      Toast.error(t("nfts.inventory_tab.price_invalid"));
    } else {
      let minFilter = priceMin;
      let maxFilter = priceMax;
      if (minFilter == "") {
        minFilter = "0";
      }
      if (maxFilter == "") maxFilter = DEFAULT_MAX_VALUE_FILTER.toString();
      const min = parseInt(minFilter);
      const max = parseInt(maxFilter);
      if (min < 0 || max < 0 || min > max) {
        filters.remove("prices", undefined);
        if (min > max && min > 0 && max > 0) {
          Toast.error(t("nfts.inventory_tab.max_price_greater_than_min"));
        }
      } else {
        const _p: any = {};
        _p.min = min;
        _p.max = max;
        filters.push("prices", _p);
      }
    }
    filters.push("offset", 0);
    setFilters({ ...filters.toInterface() });
  };

  const removeFilterSilderEquipment = () => {
    for (let i = 0; i < cf_listFilterEquipment_SoulRealm.length; i++) {
      filters.remove("collections", cf_listFilterEquipment_SoulRealm[i].slug);
    }
  };

  const addFilterSilderEquipment = (value: any) => {
    const step = 1;
    const min = Math.round(value[0] / step);
    const max = Math.round(value[1] / step);
    filters.push("collections", cf_listFilterEquipment_SoulRealm[min].slug);
    filters.push("collections", cf_listFilterEquipment_SoulRealm[max].slug);
    if (max - min > 1) {
      for (let i = min + 1; i < max; i++) {
        filters.push("collections", cf_listFilterEquipment_SoulRealm[i].slug);
      }
    }
  };

  const onFilterTraitType = (e: any, filterNft: any, mfilter: any) => {
    const isChecked = e;

    if (isChecked) {
      if (filterNft.type == "Equipment") {
        setIsVisibleSliderEquipment(true);
        filters.push("metadataTypes", mfilter.metadataType.split(","));
        addFilterSilderEquipment(sliderEquipment);
      } else if (filterNft.type == "Hero/Pet" && mfilter.slug == "petn") {
        setIsVisibleSliderPet(true);
        // Not push metadat of PetN
        // filters.push('metadataTypes', filter.metadataType)
        filters.push("collections", mfilter.slug);
        addFilterSilderPet(sliderPet);
      } else {
        filters.push("collections", mfilter.slug);
        filters.push("metadataTypes", mfilter.metadataType.split(","));
      }
    } else {
      // exist trait type in slug no remove filter.slug
      let flagRemoveCollection = true;
      let flagRemoveMetaTypes = true;
      for (let j = 0; j < cf_listFitlers_SoulRealm.length; j++) {
        const lst = cf_listFitlers_SoulRealm[j];
        if (
          !lst.lstFilter.some(
            (e) =>
              e.slug == mfilter.slug && e.metadataType == mfilter.metadataType,
          )
        )
          continue;
        for (let i = 0; i < lst.lstFilter.length; i++) {
          if (
            lst.lstFilter[i].slug == mfilter.slug &&
            lst.lstFilter[i].metadataType != mfilter.metadataType &&
            filters.includes("metadataTypes", lst.lstFilter[i].metadataType)
          ) {
            flagRemoveCollection = false;
          }
          if (
            lst.lstFilter[i].slug != mfilter.slug &&
            lst.lstFilter[i].metadataType == mfilter.metadataType &&
            filters.includes("collections", lst.lstFilter[i].slug)
          ) {
            flagRemoveMetaTypes = false;
          }
        }
      }
      if (flagRemoveMetaTypes) {
        filters.remove("metadataTypes", mfilter.metadataType.split(","));
      }
      if (flagRemoveCollection) {
        if (filterNft.type == "Equipment") {
          setIsVisibleSliderEquipment(false);
          removeFilterSilderEquipment();
          removeFilterSilderGrade();
        } else if (filterNft.type == "Hero/Pet" && mfilter.slug == "petn") {
          setIsVisibleSliderPet(false);
          removeFilterSilderPet();
          filters.remove("collections", mfilter.slug);
        } else {
          filters.remove("collections", mfilter.slug);
        }
      }
    }
    filters.push("offset", 0);
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      ...filters.toInterface(),
    }));
  };

  const onChangeSliderGrade = (value: any) => {
    setSliderGrade(value);
    // push
    addFilterSilderGrade(value);
    filters.push("offset", 0);
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      ...filters.toInterface(),
    }));
  };

  const addFilterSilderGrade = (value: any) => {
    const min = value[0];
    const max = value[1];
    filters.push("metadataGrades", cf_listFilterGrade[min].grade);
    filters.push("metadataGrades", cf_listFilterGrade[max].grade);
    const _p: any = {};
    _p.min = cf_listFilterGrade[min].grade;
    _p.max = cf_listFilterGrade[max].grade;
    filters.push("metadataGrades", _p);
  };

  const removeFilterSilderGrade = () => {
    filters.remove("metadataGrades", undefined);
    setSliderGrade([
      0,
      cf_listFilterGrade_SoulRealm[cf_listFilterGrade_SoulRealm.length - 1]
        .grade,
    ]);
  };

  const onChangeSliderPet = (value: any) => {
    // remove
    removeFilterSilderPet();
    // change slider value
    setSliderPet(value);
    // push
    addFilterSilderPet(value);
    filters.push("offset", 0);
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      ...filters.toInterface(),
    }));
  };

  const addFilterSilderPet = (value: any) => {
    const min = value[0];
    const max = value[1];
    filters.push(
      "metadataTypes",
      cf_listFilterPet_SoulRealm[value[0]].metadataType.split(","),
    );
    filters.push(
      "metadataTypes",
      cf_listFilterPet_SoulRealm[value[1]].metadataType.split(","),
    );
    if (max - min > 1) {
      for (let i = min + 1; i < max; i++) {
        filters.push(
          "metadataTypes",
          cf_listFilterPet_SoulRealm[i].metadataType.split(","),
        );
      }
    }
  };

  const onChangeSliderEquipment = (value: any) => {
    // remove
    removeFilterSilderEquipment();
    // change slider value
    setSliderEquipment(value);
    // push
    addFilterSilderEquipment(value);
    filters.push("offset", 0);
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      ...filters.toInterface(),
    }));
  };

  const removeFilterSilderPet = () => {
    for (let i = 0; i < cf_listFilterPet_SoulRealm.length; i++) {
      filters.remove(
        "metadataTypes",
        cf_listFilterPet_SoulRealm[i].metadataType.split(","),
      );
    }
  };

  const [activeSections, setActiveSections] = useState([7]);
  const setSections = (sections: any) => {
    setActiveSections(sections.includes(undefined) ? [] : sections);
  };

  const cleanup = () => {
    setFilters(new NFTFilters());
    setIsVisibleSliderEquipment(false);
    setSliderEquipment([0, 0]);
    setSliderGrade([0, 100]);
    setIsVisibleSliderPet(false);
    setSliderPet([0, 100]);
    // initFilterPriceAndName()
  };

  const AccordionHeader = (item: any, _: any, isActive: boolean) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          justifyContent: "space-between",
        }}
      >
        <MyTextApp
          style={{
            fontWeight: "bold",
            fontSize: 20,
            ...styles.nameFilters,
            color: colors.title,
          }}
        >
          {item.type}
        </MyTextApp>
        <FontAwesome
          name={isActive ? "angle-up" : "angle-down"}
          size={20}
          color={colors.title}
        />
      </View>
    );
  };

  const AccordionBody = (
    item: (typeof cf_listFitlers_SoulRealm)[0],
    index: any,
    isActive: boolean,
  ) => {
    return (
      <View style={{ overflow: "visible" }}>
        <View style={styles.itemFilterDashboard}>
          {item.lstFilter.map((filter, j) => (
            <View
              key={j}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
              accessible={true}
            >
              <CheckBox
                accessibilityLabelledBy={"list" + index + "_" + j}
                accessibilityLabel="input"
                value={
                  filter.slug == "petn"
                    ? filters?.includes("collections", "petn")
                    : filters?.includes("metadataTypes", filter.metadataType) &&
                      filters?.includes("collections", filter.slug)
                }
                onChange={() => {}}
                onValueChange={(e) => {
                  onFilterTraitType(e, item, filter);
                }}
                tintColors={{
                  true: COLORS.primary,
                  false: COLORS.descriptionText,
                }} // Android only - true = backgroundcolor value of checkbox; false = border color value of checkbox
                // iOS only
                tintColor={COLORS.descriptionText} // color of line when checkbox off
                onCheckColor={COLORS.white} // color of check mark when checkbox on
                onFillColor={COLORS.primary} // background checkbox when on
                onTintColor={COLORS.primary} // color of line when checkbox on
              />
              <MyTextApp
                onPress={() => {
                  onFilterTraitType(
                    !(filter.slug == "petn"
                      ? filters?.includes("collections", "petn")
                      : filters?.includes(
                          "metadataTypes",
                          filter.metadataType,
                        ) && filters?.includes("collections", filter.slug)),
                    item,
                    filter,
                  );
                }}
                style={{
                  ...styles.nameCheckbox,
                  color: colors.title,
                }}
                nativeID={"list" + index + "_" + j}
              >
                {filter.categories}
              </MyTextApp>
            </View>
          ))}
        </View>
        {item.type == "Hero/Pet" && isVisibleSliderPet && (
          <View
            style={{
              justifyContent: "center",
              marginTop: 8,
            }}
          >
            <MyTextApp
              style={{
                ...styles.titleSlider,
                color: colors.title,
                ...FONTS.fontBold,
                fontSize: 16,
              }}
            >
              {t("nfts.detail.type")}
            </MyTextApp>
            <SlidersPetComponent
              onChangeSlider={onChangeSliderPet}
              value={sliderPet}
              list={cf_listFilterPet}
            />
          </View>
        )}
        {item.type == "Equipment" && isVisibleSliderEquipment && (
          <>
            <View
              style={{
                justifyContent: "center",
                marginTop: 8,
              }}
            >
              <MyTextApp
                style={{
                  ...styles.titleSlider,
                  color: colors.title,
                  ...FONTS.fontBold,
                  fontSize: 16,
                }}
              >
                {t("nfts.quality")}
              </MyTextApp>
              <SliderQualityComponent
                onChangeSlider={onChangeSliderEquipment}
                value={sliderEquipment}
                list={cf_listFilterEquipment}
              />
            </View>
            <View
              style={{
                marginTop: 25,
                paddingBottom: 16,
                justifyContent: "center",
              }}
            >
              <MyTextApp
                style={{
                  ...styles.titleSlider,
                  color: colors.title,
                  ...FONTS.fontBold,
                  fontSize: 16,
                }}
              >
                {t("nfts.grade")}
              </MyTextApp>
              <SliderScrolls9DComponent
                onChangeSliderCallBack={onChangeSliderGrade}
                value={sliderGrade}
                list={cf_listFilterGrade}
              />
            </View>
          </>
        )}
      </View>
    );
  };

  return (
    <>
      <ActionModalsComponent
        modalVisible={showFilter}
        closeModal={() => setShowFilter(false)}
        childrenPosition="flex-end"
        animation="fade"
      >
        <View
          style={{
            width: 320,
            height: SIZES.height - 75,
            paddingVertical: 20,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: dark ? "#282C35" : colors.background,
              padding: 20,
              height: 80,
              marginTop: -20,
            }}
          >
            <View style={styles.titleFilterLeft}>
              <MyTextApp
                style={{
                  color: colors.title,
                  fontSize: 24,
                  ...FONTS.fontBold,
                }}
              >
                {t("nfts.filters")}
              </MyTextApp>
            </View>
            <TouchableOpacity
              style={{
                alignItems: "center",
              }}
              activeOpacity={0.8}
              onPress={() => setShowFilter(false)}
            >
              <FeatherIcon name="x" size={24} color={colors.title} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <View
              style={{
                minHeight: SIZES.height - 160 - 75,
                backgroundColor: colors.background,
              }}
            >
              {index == NFTS_INDEX._MARKETPLACE && (
                <View
                  style={{
                    ...styles.titleFilters,
                    backgroundColor: colors.background,
                  }}
                >
                  <View
                    style={{
                      ...styles.searchPrice,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <InputComponent
                      style={{
                        ...styles.inputSp,
                        color: colors.title,
                        borderWidth: 1,
                        borderColor: "rgba(122, 121, 138, 0.50)",
                        width: 130,
                        height: 48,
                        textAlign: "center",
                      }}
                      placeholder={t("wallet.min")}
                      placeholderTextColor={colors.text}
                      cursorColor={colors.primary}
                      id="price-min"
                      keyboardType="numeric"
                      onChangeText={(text: any) => {
                        setPriceMin(text);
                      }}
                      defaultValue={(() => {
                        if (
                          isEmpty(filters?.prices) ||
                          isEmpty(filters?.prices?.min)
                        )
                          return;
                        return filters?.prices?.min;
                      })()}
                      showClear={false}
                      height={48}
                    />
                    <MyTextApp
                      style={{
                        fontSize: 16,
                        width: 10,
                        backgroundColor: colors.title,
                        height: 1,
                        marginHorizontal: 8,
                      }}
                    ></MyTextApp>
                    <InputComponent
                      style={{
                        ...styles.inputSp,
                        color: colors.title,
                        borderWidth: 1,
                        borderColor: "rgba(122, 121, 138, 0.50)",
                        width: 130,
                        height: 48,
                        textAlign: "center",
                      }}
                      placeholderTextColor={colors.text}
                      placeholder={t("wallet.max")}
                      cursorColor={colors.primary}
                      id="price-max"
                      keyboardType="numeric"
                      onChangeText={(text: string) => {
                        setPriceMax(text);
                      }}
                      defaultValue={(() => {
                        if (
                          isEmpty(filters?.prices) ||
                          isEmpty(filters?.prices?.max)
                        )
                          return;
                        return filters?.prices?.max;
                      })()}
                      height={48}
                      showClear={false}
                    />
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 20,
                      alignItems: "center",
                    }}
                  >
                    <ButtonComponent
                      title={t("nfts.apply")}
                      onPress={(e: any) => {
                        onFilterPrices(e);
                      }}
                      style={{
                        maxWidth: 180,
                      }}
                    />
                  </View>
                </View>
              )}
              <View style={{ ...styles.groupFilter, marginTop: 24 }}>
                <View style={styles.listCheckboxFilter}>
                  <Accordion
                    touchableComponent={TouchableOpacity}
                    onChange={setSections}
                    sections={cf_listFitlers_SoulRealm}
                    activeSections={activeSections}
                    renderContent={AccordionBody}
                    renderHeader={AccordionHeader}
                    duration={300}
                    expandMultiple
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: 20,
              height: 80,
              backgroundColor: dark ? "#282C35" : colors.background,
              marginBottom: -20,
            }}
          >
            <View style={styles.btnClearFilter}>
              <ButtonComponent
                title={t("nfts.reset")}
                onPress={() => {
                  cleanup();
                  initFilterPriceAndName();
                  const f = new NFTFilters();
                  f.push("limit", 12);
                  f.push("offset", 0);
                  setFilters(f);
                }}
              />
            </View>
          </View>
        </View>
      </ActionModalsComponent>
    </>
  );
}

export function FilterGalixCityComponent({
  filters,
  setFilters,
  showFilter,
  setShowFilter,
  index,
}: {
  filters: NFTFilters;
  setFilters: any;
  showFilter: boolean;
  setShowFilter: any;
  index: number;
}) {
  const { t } = useTranslation();
  const { colors, dark } = useTheme();
  const [priceMax, setPriceMax] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [filterNftType, setFilterNftType] = useState(null);

  const [activeSections, setActiveSections] = useState([7]);
  const setSections = (sections: any) => {
    setActiveSections(sections.includes(undefined) ? [] : sections);
  };

  const [sliderGrade, setSliderLevel]: [
    slidergrade: [number, number],
    setSliderGrade: any,
  ] = useState([0, cf_LST_FILTER_LEVEL[cf_LST_FILTER_LEVEL.length - 1].grade]);

  const initFilterPriceAndName = () => {
    setPriceMax("");
    setPriceMin("");
  };

  const onFilterPrices = (e: any) => {
    // price
    if (!checkIsNumber(priceMin) || !checkIsNumber(priceMax)) {
      filters.remove("prices", undefined);
      Toast.error(t("nfts.inventory_tab.price_invalid"));
    } else {
      let minFilter = priceMin;
      let maxFilter = priceMax;
      if (minFilter == "") {
        minFilter = "0";
      }
      if (maxFilter == "") maxFilter = DEFAULT_MAX_VALUE_FILTER.toString();
      const min = parseInt(minFilter);
      const max = parseInt(maxFilter);
      if (min < 0 || max < 0 || min > max) {
        filters.remove("prices", undefined);
        if (min > max && min > 0 && max > 0) {
          Toast.error(t("nfts.inventory_tab.max_price_greater_than_min"));
        }
      } else {
        const _p: any = {};
        _p.min = min;
        _p.max = max;
        filters.push("prices", _p);
      }
    }
    filters.push("offset", 0);
    setFilters({ ...filters.toInterface() });
  };

  const removeFilterSilderLevel = () => {
    filters.remove("metadataLevels", undefined);
    // setSliderGrade([0, 100]);
    setSliderLevel([
      0,
      cf_LST_FILTER_LEVEL[cf_LST_FILTER_LEVEL.length - 1].grade,
    ]);
  };
  const onChangeSliderLevel = (value: any) => {
    removeFilterSilderLevel();
    setSliderLevel(value);

    filters.push("metadataLevels", value[0]);
    filters.push("metadataLevels", value[1]);
    const _p: any = {};
    _p.min = value[0];
    _p.max = value[1];
    filters.push("metadataLevels", _p);
    filters.push("offset", 0);
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      ...filters.toInterface(),
    }));
  };

  const onFilterNFTType = (filterNftType: any) => {
    setFilterNftType(filterNftType);
    filters.remove("metadataIndexs", "");
    filters.remove("metadataLevels", undefined);
    filters.remove("metadataRaritys", "");
    filters.remove("metadataTypes", "");
    filters.remove("metadataNftType", "");
    filters.push("metadataNftType", filterNftType);
    filters.push("offset", 0);

    setFilters((prevFilters: any) => ({
      ...prevFilters,
      ...filters.toInterface(),
    }));
  };

  const checkSelectRarity = (item: any) => {
    if (!filters?.metadataRaritys) return false;
    let res = true;
    for (let i = 0; i < item.value.length; i++) {
      if (!filters.metadataRaritys.includes(item.value[i])) {
        res = false;
        break;
      }
    }
    return res;
  };

  const clickItemRarity = (item: any) => {
    if (checkSelectRarity(item)) {
      filters.remove("metadataRaritys", item.value);
    } else {
      filters.push("metadataRaritys", item.value);
    }

    filters.push("offset", 0);
    setFilters({ ...filters.toInterface() });
  };

  const clickItemNFTType = (item: any) => {
    if (checkSelectNFTType(item)) {
      filters.remove("metadataTypes", item.metadataType);
    } else {
      filters.push("metadataTypes", item.metadataType);
    }

    filters.push("offset", 0);
    setFilters({ ...filters.toInterface() });
  };

  const checkSelectNFTType = (item: any) => {
    if (!filters?.metadataTypes) return false;
    let res = true;
    if (!filters.metadataTypes.includes(item.metadataType)) {
      res = false;
    }
    return res;
  };

  const clickItemPackage = (item: any) => {
    if (checkSelectPackage(item)) {
      filters.remove("metadataIndexs", item.metadataIndex);
    } else {
      filters.push("metadataIndexs", item.metadataIndex);
    }

    filters.push("offset", 0);
    setFilters({ ...filters.toInterface() });
  };

  const checkSelectPackage = (item: any) => {
    if (!filters?.metadataIndexs) return false;
    let res = true;
    if (!filters.metadataIndexs.includes(item.metadataIndex)) {
      res = false;
    }
    return res;
  };

  const cleanup = () => {
    setFilters(new NFTFilters());
    setFilterNftType(null);
    setSliderLevel([0, 999]);
  };

  const [listFilter, setListFilter] = useState<any[]>([]);

  useEffect(() => {
    if (!filterNftType) return;
    setListFilter([]);
    let lst: any[] = [];

    if (filterNftType == FILTER_NFT_TYPE_GALIX_MARKET.HERO) {
      const res = cf_LST_TYPES.find((e) => e.type == filterNftType);
      lst = [
        { lstFilter: res?.lstFilter, name: "Type" },
        {
          lstFilter: cf_LST_RARITY,
          name: "Rarerity",
        },
        { lstFilter: cf_LST_FILTER_LEVEL, name: "Level Range" },
      ];
    }
    if (filterNftType == FILTER_NFT_TYPE_GALIX_MARKET.RESOURCE) {
      const res = cf_LST_TYPES.find((e) => e.type == filterNftType);
      lst = [
        {
          lstFilter: cf_LST_PACKAGE,
          name: "Package",
        },
        {
          lstFilter: res?.lstFilter,
          name: "Type",
        },
      ];
    }

    setListFilter(lst);
  }, [filterNftType]);

  const AccordionHeader = (item: any, _: any, isActive: boolean) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          justifyContent: "space-between",
        }}
      >
        <MyTextApp
          style={{
            fontWeight: "bold",
            fontSize: 20,
            ...styles.nameFilters,
            color: colors.title,
          }}
        >
          {item.name}
        </MyTextApp>
        <FontAwesome
          name={isActive ? "angle-up" : "angle-down"}
          size={20}
          color={colors.title}
        />
      </View>
    );
  };

  const AccordionBody = (item: any, index: any, isActive: boolean) => {
    return (
      // <></>
      <View style={{ overflow: "visible" }} key={index}>
        {filterNftType == FILTER_NFT_TYPE_GALIX_MARKET.HERO && (
          <>
            {item.name == "Rarerity" &&
              item?.lstFilter?.map((e: any, index: any) => (
                <View
                  key={index}
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <CheckBox
                    accessibilityLabel="input"
                    value={checkSelectRarity(e)}
                    onChange={() => {
                      return false;
                    }}
                    onValueChange={() => {
                      clickItemRarity(e);
                    }}
                    tintColors={{
                      true: COLORS.primary,
                      false: COLORS.descriptionText,
                    }} // Android only - true = backgroundcolor value of checkbox; false = border color value of checkbox
                    // iOS only
                    tintColor={COLORS.descriptionText} // color of line when checkbox off
                    onCheckColor={COLORS.white} // color of check mark when checkbox on
                    onFillColor={COLORS.primary} // background checkbox when on
                    onTintColor={COLORS.primary} // color of line when checkbox on
                  />
                  <MyTextApp style={{ color: colors.title, fontSize: 16 }}>
                    {e.metadataRarity}
                  </MyTextApp>
                </View>
              ))}
            {item.name == "Type" &&
              item?.lstFilter?.map((e: any, index: any) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  onPress={() => {
                    clickItemNFTType(e);
                  }}
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <CheckBox
                    accessibilityLabel="input"
                    value={checkSelectNFTType(e)}
                    onChange={() => {
                      return false;
                    }}
                    onValueChange={() => false}
                    tintColors={{
                      true: COLORS.primary,
                      false: COLORS.descriptionText,
                    }} // Android only - true = backgroundcolor value of checkbox; false = border color value of checkbox
                    // iOS only
                    tintColor={COLORS.descriptionText} // color of line when checkbox off
                    onCheckColor={COLORS.white} // color of check mark when checkbox on
                    onFillColor={COLORS.primary} // background checkbox when on
                    onTintColor={COLORS.primary} // color of line when checkbox on
                  />
                  <MyTextApp style={{ color: colors.title, fontSize: 16 }}>
                    {e.metadataType}
                  </MyTextApp>
                </TouchableOpacity>
              ))}
            {item.name == "Level Range" && (
              <SliderScrollsGalixComponent
                value={sliderGrade}
                list={cf_LST_FILTER_LEVEL}
                onChangeSliderCallBack={onChangeSliderLevel}
              />
            )}
            {/* <View
              style={{
                justifyContent: "center",
                marginTop: 8,
              }}
            >
              <MyTextApp
                style={{
                  ...styles.titleSlider,
                  color: colors.title,
                  ...FONTS.fontBold,
                  fontSize: 16,
                }}
              >
                {item.name}
              </MyTextApp>
              <SlidersPetComponent
                onChangeSlider={onChangeSliderPet}
                value={sliderPet}
                list={cf_listFilterPet}
              />
            </View> */}
          </>
        )}
        {filterNftType == FILTER_NFT_TYPE_GALIX_MARKET.RESOURCE && (
          <>
            {item.name == "Package" &&
              item?.lstFilter?.map((e: any, index: any) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  onPress={() => {
                    clickItemPackage(e);
                  }}
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <CheckBox
                    accessibilityLabel="input"
                    value={checkSelectPackage(e)}
                    onChange={() => {
                      return false;
                    }}
                    onValueChange={() => {
                      clickItemPackage(e);
                    }}
                    tintColors={{
                      true: COLORS.primary,
                      false: COLORS.descriptionText,
                    }} // Android only - true = backgroundcolor value of checkbox; false = border color value of checkbox
                    // iOS only
                    tintColor={COLORS.descriptionText} // color of line when checkbox off
                    onCheckColor={COLORS.white} // color of check mark when checkbox on
                    onFillColor={COLORS.primary} // background checkbox when on
                    onTintColor={COLORS.primary} // color of line when checkbox on
                  />
                  <MyTextApp style={{ color: colors.title, fontSize: 16 }}>
                    {e.categories}
                  </MyTextApp>
                </TouchableOpacity>
              ))}
            {item.name == "Type" &&
              item?.lstFilter?.map((e: any, index: any) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  onPress={() => {
                    clickItemNFTType(e);
                  }}
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <CheckBox
                    accessibilityLabel="input"
                    value={checkSelectNFTType(e)}
                    onChange={() => {
                      return false;
                    }}
                    onValueChange={() => false}
                    tintColors={{
                      true: COLORS.primary,
                      false: COLORS.descriptionText,
                    }} // Android only - true = backgroundcolor value of checkbox; false = border color value of checkbox
                    // iOS only
                    tintColor={COLORS.descriptionText} // color of line when checkbox off
                    onCheckColor={COLORS.white} // color of check mark when checkbox on
                    onFillColor={COLORS.primary} // background checkbox when on
                    onTintColor={COLORS.primary} // color of line when checkbox on
                  />
                  <MyTextApp style={{ color: colors.title, fontSize: 16 }}>
                    {e.metadataType}
                  </MyTextApp>
                </TouchableOpacity>
              ))}
          </>
        )}
      </View>
    );
  };

  return (
    <>
      <ActionModalsComponent
        modalVisible={showFilter}
        closeModal={() => setShowFilter(false)}
        childrenPosition="flex-end"
        animation="fade"
      >
        <View
          style={{
            width: 320,
            height: SIZES.height - 75,
            paddingVertical: 20,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: dark ? "#282C35" : colors.background,
              padding: 20,
              height: 80,
              marginTop: -20,
            }}
          >
            <View style={styles.titleFilterLeft}>
              <MyTextApp
                style={{
                  color: colors.title,
                  fontSize: 24,
                  ...FONTS.fontBold,
                }}
              >
                {t("nfts.filters")}
              </MyTextApp>
            </View>
            <TouchableOpacity
              style={{
                alignItems: "center",
              }}
              activeOpacity={0.8}
              onPress={() => setShowFilter(false)}
            >
              <FeatherIcon name="x" size={24} color={colors.title} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <View
              style={{
                minHeight: SIZES.height - 160 - 75,
                backgroundColor: colors.background,
              }}
            >
              {index == NFTS_INDEX._MARKETPLACE && (
                <View
                  style={{
                    ...styles.titleFilters,
                    backgroundColor: colors.background,
                  }}
                >
                  <View
                    style={{
                      ...styles.searchPrice,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <InputComponent
                      style={{
                        ...styles.inputSp,
                        color: colors.title,
                        borderWidth: 1,
                        borderColor: "rgba(122, 121, 138, 0.50)",
                        width: 130,
                        height: 48,
                        textAlign: "center",
                      }}
                      placeholder={t("wallet.min")}
                      placeholderTextColor={colors.text}
                      cursorColor={colors.primary}
                      id="price-min"
                      keyboardType="numeric"
                      onChangeText={(text: any) => {
                        setPriceMin(text);
                      }}
                      defaultValue={(() => {
                        if (
                          isEmpty(filters?.prices) ||
                          isEmpty(filters?.prices?.min)
                        )
                          return;
                        return filters?.prices?.min;
                      })()}
                      showClear={false}
                      height={48}
                    />
                    <MyTextApp
                      style={{
                        fontSize: 16,
                        width: 10,
                        backgroundColor: colors.title,
                        height: 1,
                        marginHorizontal: 8,
                      }}
                    ></MyTextApp>
                    <InputComponent
                      style={{
                        ...styles.inputSp,
                        color: colors.title,
                        borderWidth: 1,
                        borderColor: "rgba(122, 121, 138, 0.50)",
                        width: 130,
                        height: 48,
                        textAlign: "center",
                      }}
                      placeholderTextColor={colors.text}
                      placeholder={t("wallet.max")}
                      cursorColor={colors.primary}
                      id="price-max"
                      keyboardType="numeric"
                      onChangeText={(text: string) => {
                        setPriceMax(text);
                      }}
                      defaultValue={(() => {
                        if (
                          isEmpty(filters?.prices) ||
                          isEmpty(filters?.prices?.max)
                        )
                          return;
                        return filters?.prices?.max;
                      })()}
                      height={48}
                      showClear={false}
                    />
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 20,
                      alignItems: "center",
                    }}
                  >
                    <ButtonComponent
                      title={t("nfts.apply")}
                      onPress={(e: any) => {
                        onFilterPrices(e);
                      }}
                      style={{
                        maxWidth: 180,
                      }}
                    />
                  </View>
                </View>
              )}
              <View
                style={{
                  paddingBottom: 8,
                  // borderBottomColor: "#343444",
                  // borderBottomWidth: 1,
                  paddingHorizontal: 20,
                  paddingTop: 16,
                }}
              >
                <MyTextApp
                  style={{
                    ...FONTS.fontBold,
                    fontSize: 18,
                    color: colors.title,
                  }}
                >
                  NFT
                </MyTextApp>
                {galixNFTType.map((e, i) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                    key={i}
                    onPress={() => {
                      if (filterNftType == e.nftType) {
                        onFilterNFTType(null);
                      } else {
                        onFilterNFTType(
                          e.nftType as FILTER_NFT_TYPE_GALIX_MARKET,
                        );
                      }
                    }}
                    activeOpacity={0.8}
                  >
                    <CheckBox
                      accessibilityLabelledBy={"list" + index + "_" + i}
                      accessibilityLabel="input"
                      value={filterNftType == e.nftType}
                      onChange={() => {
                        return false;
                      }}
                      onValueChange={() => {
                        if (filterNftType == e.nftType) {
                          onFilterNFTType(null);
                        } else {
                          onFilterNFTType(
                            e.nftType as FILTER_NFT_TYPE_GALIX_MARKET,
                          );
                        }
                      }}
                      tintColors={{
                        true: COLORS.primary,
                        false: COLORS.descriptionText,
                      }} // Android only - true = backgroundcolor value of checkbox; false = border color value of checkbox
                      // iOS only
                      tintColor={COLORS.descriptionText} // color of line when checkbox off
                      onCheckColor={COLORS.white} // color of check mark when checkbox on
                      onFillColor={COLORS.primary} // background checkbox when on
                      onTintColor={COLORS.primary} // color of line when checkbox on
                    />
                    <MyTextApp style={{ color: colors.title, fontSize: 16 }}>
                      {e.name}
                    </MyTextApp>
                  </TouchableOpacity>
                ))}
              </View>
              {filterNftType && (
                <View style={{ ...styles.groupFilter }}>
                  <View style={styles.listCheckboxFilter}>
                    <Accordion
                      touchableComponent={TouchableOpacity}
                      onChange={setSections}
                      sections={listFilter}
                      activeSections={activeSections}
                      renderContent={AccordionBody}
                      renderHeader={AccordionHeader}
                      duration={300}
                      expandMultiple
                    />
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: 20,
              height: 80,
              backgroundColor: dark ? "#282C35" : colors.background,
              marginBottom: -20,
            }}
          >
            <View style={styles.btnClearFilter}>
              <ButtonComponent
                title={t("nfts.reset")}
                onPress={() => {
                  cleanup();
                  initFilterPriceAndName();
                  const f = new NFTFilters();
                  f.push("limit", 12);
                  f.push("offset", 0);
                  setFilters(f);
                }}
              />
            </View>
          </View>
        </View>
      </ActionModalsComponent>
    </>
  );
}

export function FilterMechaComponent({
  filters,
  setFilters,
  showFilter,
  setShowFilter,
  index,
}: {
  filters: NFTFilters;
  setFilters: any;
  showFilter: boolean;
  setShowFilter: any;
  index: number;
}) {
  const { t } = useTranslation();
  const { colors, dark } = useTheme();
  const [priceMax, setPriceMax] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [filterNftType, setFilterNftType] = useState(null);

  const [activeSections, setActiveSections] = useState([7]);
  const setSections = (sections: any) => {
    setActiveSections(sections.includes(undefined) ? [] : sections);
  };

  const [sliderGrade, setSliderLevel]: [
    slidergrade: [number, number],
    setSliderGrade: any,
  ] = useState([
    0,
    cf_LST_FILTER_LEVEL_MECHA[cf_LST_FILTER_LEVEL_MECHA.length - 1].grade,
  ]);

  const [sliderStar, setSliderStar]: [
    sliderStar: [number, number],
    setSliderStar: any,
  ] = useState([
    0,
    cf_LST_FILTER_STAR_MECHA[cf_LST_FILTER_STAR_MECHA.length - 1].grade,
  ]);

  const initFilterPriceAndName = () => {
    setPriceMax("");
    setPriceMin("");
  };

  const onFilterPrices = (e: any) => {
    // price
    if (!checkIsNumber(priceMin) || !checkIsNumber(priceMax)) {
      filters.remove("prices", undefined);
      Toast.error(t("nfts.inventory_tab.price_invalid"));
    } else {
      let minFilter = priceMin;
      let maxFilter = priceMax;
      if (minFilter == "") {
        minFilter = "0";
      }
      if (maxFilter == "") maxFilter = DEFAULT_MAX_VALUE_FILTER.toString();
      const min = parseInt(minFilter);
      const max = parseInt(maxFilter);
      if (min < 0 || max < 0 || min > max) {
        filters.remove("prices", undefined);
        if (min > max && min > 0 && max > 0) {
          Toast.error(t("nfts.inventory_tab.max_price_greater_than_min"));
        }
      } else {
        const _p: any = {};
        _p.min = min;
        _p.max = max;
        filters.push("prices", _p);
      }
    }
    filters.push("offset", 0);
    setFilters({ ...filters.toInterface() });
  };

  const removeFilterSilderLevel = () => {
    filters.remove("metadataLevels", undefined);
    // setSliderGrade([0, 100]);
    setSliderLevel([
      0,
      cf_LST_FILTER_LEVEL[cf_LST_FILTER_LEVEL.length - 1].grade,
    ]);
  };

  const onChangeSliderLevel = (value: any) => {
    console.log("annnn", value);

    removeFilterSilderLevel();
    setSliderLevel(value);

    filters.push("metadataLevels", value[0]);
    filters.push("metadataLevels", value[1]);
    const _p: any = {};
    _p.min = value[0];
    _p.max = value[1];
    filters.push("metadataLevels", _p);
    filters.push("offset", 0);
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      ...filters.toInterface(),
    }));
  };

  const removeFilterSilderStar = () => {
    filters.remove("metadataStar", undefined);
    setSliderStar([0, 5]);
  };

  const onChangeSliderStar = (value: any) => {
    // remove
    removeFilterSilderStar();
    // change slider value
    setSliderStar(value);
    // push
    filters.push("metadataStar", value[0]);
    filters.push("metadataStar", value[1]);
    const _p: any = {};
    _p.min = value[0];
    _p.max = value[1];
    filters.push("metadataStar", _p);
    filters.push("offset", 0);
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      ...filters.toInterface(),
    }));
  };

  const onFilterNFTType = (filterNftType: any) => {
    setFilterNftType(filterNftType);
    filters.remove("metadataIndexs", "");
    filters.remove("metadataLevels", undefined);
    filters.remove("metadataRaritys", "");
    filters.remove("metadataTypes", "");
    filters.remove("metadataNftType", "");
    filters.push("metadataNftType", filterNftType);
    filters.push("offset", 0);

    setFilters((prevFilters: any) => ({
      ...prevFilters,
      ...filters.toInterface(),
    }));
  };

  const checkSelectRarity = (item: any) => {
    if (!filters?.metadataRaritys) return false;
    let res = true;
    for (let i = 0; i < item.value.length; i++) {
      if (!filters.metadataRaritys.includes(item.value[i])) {
        res = false;
        break;
      }
    }
    return res;
  };

  const clickItemRarity = (item: any) => {
    if (checkSelectRarity(item)) {
      filters.remove("metadataRaritys", item.value);
    } else {
      filters.push("metadataRaritys", item.value);
    }

    filters.push("offset", 0);
    setFilters({ ...filters.toInterface() });
  };

  const clickItemNFTType = (item: any) => {
    if (checkSelectNFTType(item)) {
      filters.remove("metadataTypes", item.metadataType);
    } else {
      filters.push("metadataTypes", item.metadataType);
    }

    filters.push("offset", 0);
    setFilters({ ...filters.toInterface() });
  };

  const checkSelectNFTType = (item: any) => {
    if (!filters?.metadataTypes) return false;
    let res = true;
    if (!filters.metadataTypes.includes(item.metadataType)) {
      res = false;
    }
    return res;
  };

  const cleanup = () => {
    setFilters(new NFTFilters());
    setFilterNftType(null);
    setSliderLevel([0, 999]);
    setSliderStar([0, 5]);
  };

  const [listFilter, setListFilter] = useState<any[]>([]);

  useEffect(() => {
    if (!filterNftType) return;
    setListFilter([]);
    let lst: any[] = [];
    if (filterNftType != FILTER_NFT_TYPE_MARSWAR_MARKET.MYSTERY_BOX) {
      const res = cf_LST_TYPES_MECHA.find((e) => e.type == filterNftType);
      lst = [
        {
          lstFilter: cf_LST_RARITY_MECHA_WARFARE,
          name: "Rarerity",
        },
        { lstFilter: res?.lstFilter, name: "Type" },
        {
          lstFilter: cf_LST_FILTER_LEVEL_MECHA,
          name: "Level Range",
        },
      ];
      if (filterNftType == FILTER_NFT_TYPE_MARSWAR_MARKET.HERO) {
        lst = [
          ...lst,
          {
            lstFilter: cf_LST_FILTER_STAR_MECHA,
            name: "Star",
            isHero: true,
          },
        ];
      }
    }

    setListFilter(lst);
  }, [filterNftType]);

  const AccordionHeader = (item: any, _: any, isActive: boolean) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          justifyContent: "space-between",
        }}
      >
        <MyTextApp
          style={{
            fontWeight: "bold",
            fontSize: 20,
            ...styles.nameFilters,
            color: colors.title,
          }}
        >
          {item.name}
        </MyTextApp>
        <FontAwesome
          name={isActive ? "angle-up" : "angle-down"}
          size={20}
          color={colors.title}
        />
      </View>
    );
  };

  const AccordionBody = (item: any, index: any, isActive: boolean) => {
    return (
      // <></>
      <View style={{ overflow: "visible" }} key={index}>
        <>
          {item.name == "Rarerity" &&
            item?.lstFilter?.map((e: any, index: any) => (
              <View
                key={index}
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <CheckBox
                  accessibilityLabel="input"
                  value={checkSelectRarity(e)}
                  onChange={() => {
                    return false;
                  }}
                  onValueChange={() => {
                    clickItemRarity(e);
                  }}
                  tintColors={{
                    true: COLORS.primary,
                    false: COLORS.descriptionText,
                  }} // Android only - true = backgroundcolor value of checkbox; false = border color value of checkbox
                  // iOS only
                  tintColor={COLORS.descriptionText} // color of line when checkbox off
                  onCheckColor={COLORS.white} // color of check mark when checkbox on
                  onFillColor={COLORS.primary} // background checkbox when on
                  onTintColor={COLORS.primary} // color of line when checkbox on
                />
                <MyTextApp style={{ color: colors.title, fontSize: 16 }}>
                  {e.metadataRarity}
                </MyTextApp>
              </View>
            ))}
          {item.name == "Type" &&
            item?.lstFilter?.map((e: any, index: any) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => {
                  clickItemNFTType(e);
                }}
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <CheckBox
                  accessibilityLabel="input"
                  value={checkSelectNFTType(e)}
                  onChange={() => {
                    return false;
                  }}
                  onValueChange={() => false}
                  tintColors={{
                    true: COLORS.primary,
                    false: COLORS.descriptionText,
                  }} // Android only - true = backgroundcolor value of checkbox; false = border color value of checkbox
                  // iOS only
                  tintColor={COLORS.descriptionText} // color of line when checkbox off
                  onCheckColor={COLORS.white} // color of check mark when checkbox on
                  onFillColor={COLORS.primary} // background checkbox when on
                  onTintColor={COLORS.primary} // color of line when checkbox on
                />
                <MyTextApp style={{ color: colors.title, fontSize: 16 }}>
                  {e.metadataType}
                </MyTextApp>
              </TouchableOpacity>
            ))}
          {item.name == "Level Range" && (
            <SliderScrollsGalixComponent
              value={sliderGrade}
              list={cf_LST_FILTER_LEVEL_MECHA}
              onChangeSliderCallBack={onChangeSliderLevel}
            />
          )}
          {item.name == "Star" && (
            <SliderScrollsGalixComponent
              value={sliderStar}
              list={cf_LST_FILTER_STAR_MECHA}
              onChangeSliderCallBack={onChangeSliderStar}
            />
          )}
        </>
      </View>
    );
  };

  return (
    <>
      <ActionModalsComponent
        modalVisible={showFilter}
        closeModal={() => setShowFilter(false)}
        childrenPosition="flex-end"
        animation="fade"
      >
        <View
          style={{
            width: 320,
            height: SIZES.height - 75,
            paddingVertical: 20,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: dark ? "#282C35" : colors.background,
              padding: 20,
              height: 80,
              marginTop: -20,
            }}
          >
            <View style={styles.titleFilterLeft}>
              <MyTextApp
                style={{
                  color: colors.title,
                  fontSize: 24,
                  ...FONTS.fontBold,
                }}
              >
                {t("nfts.filters")}
              </MyTextApp>
            </View>
            <TouchableOpacity
              style={{
                alignItems: "center",
              }}
              activeOpacity={0.8}
              onPress={() => setShowFilter(false)}
            >
              <FeatherIcon name="x" size={24} color={colors.title} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <View
              style={{
                minHeight: SIZES.height - 160 - 75,
                backgroundColor: colors.background,
              }}
            >
              {index == NFTS_INDEX._MARKETPLACE && (
                <View
                  style={{
                    ...styles.titleFilters,
                    backgroundColor: colors.background,
                  }}
                >
                  <View
                    style={{
                      ...styles.searchPrice,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <InputComponent
                      style={{
                        ...styles.inputSp,
                        color: colors.title,
                        borderWidth: 1,
                        borderColor: "rgba(122, 121, 138, 0.50)",
                        width: 130,
                        height: 48,
                        textAlign: "center",
                      }}
                      placeholder={t("wallet.min")}
                      placeholderTextColor={colors.text}
                      cursorColor={colors.primary}
                      id="price-min"
                      keyboardType="numeric"
                      onChangeText={(text: any) => {
                        setPriceMin(text);
                      }}
                      defaultValue={(() => {
                        if (
                          isEmpty(filters?.prices) ||
                          isEmpty(filters?.prices?.min)
                        )
                          return;
                        return filters?.prices?.min;
                      })()}
                      showClear={false}
                      height={48}
                    />
                    <MyTextApp
                      style={{
                        fontSize: 16,
                        width: 10,
                        backgroundColor: colors.title,
                        height: 1,
                        marginHorizontal: 8,
                      }}
                    ></MyTextApp>
                    <InputComponent
                      style={{
                        ...styles.inputSp,
                        color: colors.title,
                        borderWidth: 1,
                        borderColor: "rgba(122, 121, 138, 0.50)",
                        width: 130,
                        height: 48,
                        textAlign: "center",
                      }}
                      placeholderTextColor={colors.text}
                      placeholder={t("wallet.max")}
                      cursorColor={colors.primary}
                      id="price-max"
                      keyboardType="numeric"
                      onChangeText={(text: string) => {
                        setPriceMax(text);
                      }}
                      defaultValue={(() => {
                        if (
                          isEmpty(filters?.prices) ||
                          isEmpty(filters?.prices?.max)
                        )
                          return;
                        return filters?.prices?.max;
                      })()}
                      height={48}
                      showClear={false}
                    />
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 20,
                      alignItems: "center",
                    }}
                  >
                    <ButtonComponent
                      title={t("nfts.apply")}
                      onPress={(e: any) => {
                        onFilterPrices(e);
                      }}
                      style={{
                        maxWidth: 180,
                      }}
                    />
                  </View>
                </View>
              )}
              <View
                style={{
                  paddingBottom: 8,
                  // borderBottomColor: "#343444",
                  // borderBottomWidth: 1,
                  paddingHorizontal: 20,
                  paddingTop: 16,
                }}
              >
                <MyTextApp
                  style={{
                    ...FONTS.fontBold,
                    fontSize: 18,
                    color: colors.title,
                  }}
                >
                  NFT
                </MyTextApp>
                {cf_Marswar_NFTType.map((e, i) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                    key={i}
                    onPress={() => {
                      if (filterNftType == e.nftType) {
                        onFilterNFTType(null);
                      } else {
                        onFilterNFTType(
                          e.nftType as FILTER_NFT_TYPE_GALIX_MARKET,
                        );
                      }
                    }}
                    activeOpacity={0.8}
                  >
                    <CheckBox
                      accessibilityLabelledBy={"list" + index + "_" + i}
                      accessibilityLabel="input"
                      value={filterNftType == e.nftType}
                      onChange={() => {
                        return false;
                      }}
                      onValueChange={() => {
                        if (filterNftType == e.nftType) {
                          onFilterNFTType(null);
                        } else {
                          onFilterNFTType(
                            e.nftType as FILTER_NFT_TYPE_GALIX_MARKET,
                          );
                        }
                      }}
                      tintColors={{
                        true: COLORS.primary,
                        false: COLORS.descriptionText,
                      }} // Android only - true = backgroundcolor value of checkbox; false = border color value of checkbox
                      // iOS only
                      tintColor={COLORS.descriptionText} // color of line when checkbox off
                      onCheckColor={COLORS.white} // color of check mark when checkbox on
                      onFillColor={COLORS.primary} // background checkbox when on
                      onTintColor={COLORS.primary} // color of line when checkbox on
                    />
                    <MyTextApp style={{ color: colors.title, fontSize: 16 }}>
                      {e.name}
                    </MyTextApp>
                  </TouchableOpacity>
                ))}
              </View>
              {filterNftType && (
                <View style={{ ...styles.groupFilter }}>
                  <View style={styles.listCheckboxFilter}>
                    <Accordion
                      touchableComponent={TouchableOpacity}
                      onChange={setSections}
                      sections={listFilter}
                      activeSections={activeSections}
                      renderContent={AccordionBody}
                      renderHeader={AccordionHeader}
                      duration={300}
                      expandMultiple
                    />
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: 20,
              height: 80,
              backgroundColor: dark ? "#282C35" : colors.background,
              marginBottom: -20,
            }}
          >
            <View style={styles.btnClearFilter}>
              <ButtonComponent
                title={t("nfts.reset")}
                onPress={() => {
                  cleanup();
                  initFilterPriceAndName();
                  const f = new NFTFilters();
                  f.push("limit", 12);
                  f.push("offset", 0);
                  setFilters(f);
                }}
              />
            </View>
          </View>
        </View>
      </ActionModalsComponent>
    </>
  );
}

export function FilterFlashpointComponent({
  filters,
  setFilters,
  showFilter,
  setShowFilter,
  index,
}: {
  filters: NFTFilters;
  setFilters: any;
  showFilter: boolean;
  setShowFilter: any;
  index: number;
}) {
  const { t } = useTranslation();
  const { colors, dark } = useTheme();
  const lstFilter = [
    ...cf_listFilter_Flashpoint,
    { type: "Quality", lstFilter: cf_listQuality },
  ];
  const [priceMax, setPriceMax] = useState("");
  const [priceMin, setPriceMin] = useState("");

  const [sliderQuality, setSliderQuality]: [
    sliderQuality: [number, number],
    setSliderQuality: any,
  ] = useState([0, cf_listQuality.length - 1]);

  const initFilterPriceAndName = () => {
    setPriceMax("");
    setPriceMin("");
  };

  const onFilterPrices = (e: any) => {
    // price
    if (!checkIsNumber(priceMin) || !checkIsNumber(priceMax)) {
      filters.remove("prices", undefined);
      Toast.error(t("nfts.inventory_tab.price_invalid"));
    } else {
      let minFilter = priceMin;
      let maxFilter = priceMax;
      if (minFilter == "") {
        minFilter = "0";
      }
      if (maxFilter == "") maxFilter = DEFAULT_MAX_VALUE_FILTER.toString();
      const min = parseInt(minFilter);
      const max = parseInt(maxFilter);
      if (min < 0 || max < 0 || min > max) {
        filters.remove("prices", undefined);
        if (min > max && min > 0 && max > 0) {
          Toast.error(t("nfts.inventory_tab.max_price_greater_than_min"));
        }
      } else {
        const _p: any = {};
        _p.min = min;
        _p.max = max;
        filters.push("prices", _p);
      }
    }
    filters.push("offset", 0);
    setFilters({ ...filters.toInterface() });
  };

  const removeFilterSilderQuality = () => {
    for (let i = 0; i < cf_listQuality.length; i++) {
      filters.remove("metadataQualitys", cf_listQuality[i].metadataQuality);
    }
  };

  const addFilterSilderQuality = (value: any) => {
    const min = Math.round(value[0]);
    const max = Math.round(value[1]);
    filters.push("metadataQualitys", cf_listQuality[min].metadataQuality);
    filters.push("metadataQualitys", cf_listQuality[max].metadataQuality);
    if (max - min > 1) {
      for (let i = min + 1; i < max; i++) {
        filters.push("metadataQualitys", cf_listQuality[i].metadataQuality);
      }
    }
  };

  const onFilterTraitType = (e: any, filterNft: any, filter: any) => {
    const isChecked = e;

    if (isChecked) {
      if (filterNft.type == "Weapon") {
        addFilterSilderQuality(sliderQuality);
        filters.push("collections", filter.slug);
        filters.push("metadataTypes", filter.metadataType.split(","));
      } else {
        filters.push("collections", filter.slug);

        filters.push("metadataTypes", filter.metadataType.split(","));
      }
      filters.push("metadataTypes", filter.metadataType.split(","));
      filters.push("collections", filter.slug);
    } else {
      // exist trait type in slug no remove filter.slug
      let flagRemoveCollection = true;
      let flagRemoveMetaTypes = true;
      for (let j = 0; j < cf_listFilter_Flashpoint.length; j++) {
        const lst = cf_listFilter_Flashpoint[j];
        if (
          !lst.lstFilter.some(
            (e) =>
              e.slug == filter.slug && e.metadataType == filter.metadataType,
          )
        )
          continue;
        for (let i = 0; i < lst.lstFilter.length; i++) {
          if (
            lst.lstFilter[i].slug == filter.slug &&
            lst.lstFilter[i].metadataType != filter.metadataType &&
            filters.includes("metadataTypes", lst.lstFilter[i].metadataType)
          ) {
            flagRemoveCollection = false;
          }
          if (
            lst.lstFilter[i].slug != filter.slug &&
            lst.lstFilter[i].metadataType == filter.metadataType &&
            filters.includes("collections", lst.lstFilter[i].slug)
          ) {
            flagRemoveMetaTypes = false;
          }
        }
      }
      if (flagRemoveMetaTypes) {
        filters.remove("metadataTypes", filter.metadataType.split(","));
      }
      if (flagRemoveCollection) {
        if (filterNft.type == "Weapon") {
          removeFilterSilderQuality();
        } else {
          filters.remove("collections", filter.slug);
        }
      }
    }
    filters.push("offset", 0);
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      ...filters.toInterface(),
    }));
  };

  // console.log('hehehee', filters);

  const onChangeSliderQuality = (value: any) => {
    // remove
    removeFilterSilderQuality();
    // change slider value
    setSliderQuality(value);
    // push
    addFilterSilderQuality(value);
    filters.push("offset", 0);
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      ...filters.toInterface(),
    }));
  };

  const [activeSections, setActiveSections] = useState([7]);
  const setSections = (sections: any) => {
    setActiveSections(sections.includes(undefined) ? [] : sections);
  };

  const cleanup = () => {
    setFilters(new NFTFilters());
    initFilterPriceAndName();
    setSliderQuality([0, cf_listQuality.length - 1]);
  };

  const AccordionHeader = (item: any, _: any, isActive: boolean) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          justifyContent: "space-between",
        }}
      >
        <MyTextApp
          style={{
            fontWeight: "bold",
            fontSize: 20,
            ...styles.nameFilters,
            color: colors.title,
          }}
        >
          {item.type}
        </MyTextApp>
        <FontAwesome
          name={isActive ? "angle-up" : "angle-down"}
          size={20}
          color={colors.title}
        />
      </View>
    );
  };

  const AccordionBody = (item: any, index: any, isActive: boolean) => {
    return (
      <View style={{ overflow: "visible" }}>
        <View style={styles.itemFilterDashboard}>
          {item.type == "Quality" ? (
            <>
              <View
                style={{
                  justifyContent: "center",
                }}
              >
                <SliderQualityComponent
                  onChangeSlider={onChangeSliderQuality}
                  value={sliderQuality}
                  list={item.lstFilter}
                  paddingBottom={80}
                />
              </View>
            </>
          ) : (
            item.lstFilter.map((filter: any, j: any) => (
              <View
                key={j}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
                accessible={true}
              >
                <CheckBox
                  accessibilityLabelledBy={"list" + index + "_" + j}
                  accessibilityLabel="input"
                  value={
                    filter.slug == "petn"
                      ? filters?.includes("collections", "petn")
                      : filters?.includes(
                          "metadataTypes",
                          filter.metadataType,
                        ) && filters?.includes("collections", filter.slug)
                  }
                  onChange={() => {}}
                  onValueChange={(e) => {
                    onFilterTraitType(e, item, filter);
                  }}
                  tintColors={{
                    true: COLORS.primary,
                    false: COLORS.descriptionText,
                  }} // Android only - true = backgroundcolor value of checkbox; false = border color value of checkbox
                  // iOS only
                  tintColor={COLORS.descriptionText} // color of line when checkbox off
                  onCheckColor={COLORS.white} // color of check mark when checkbox on
                  onFillColor={COLORS.primary} // background checkbox when on
                  onTintColor={COLORS.primary} // color of line when checkbox on
                />
                <MyTextApp
                  onPress={() => {
                    onFilterTraitType(
                      !(filter.slug == "petn"
                        ? filters?.includes("collections", "petn")
                        : filters?.includes(
                            "metadataTypes",
                            filter.metadataType,
                          ) && filters?.includes("collections", filter.slug)),
                      item,
                      filter,
                    );
                  }}
                  style={{
                    ...styles.nameCheckbox,
                    color: colors.title,
                  }}
                  nativeID={"list" + index + "_" + j}
                >
                  {filter.categories}
                </MyTextApp>
              </View>
            ))
          )}
        </View>
      </View>
    );
  };

  return (
    <>
      <ActionModalsComponent
        modalVisible={showFilter}
        closeModal={() => setShowFilter(false)}
        childrenPosition="flex-end"
        animation="fade"
      >
        <View
          style={{
            width: 320,
            height: SIZES.height - 75,
            paddingVertical: 20,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: dark ? "#282C35" : colors.background,
              padding: 20,
              height: 80,
              marginTop: -20,
            }}
          >
            <View style={styles.titleFilterLeft}>
              <MyTextApp
                style={{
                  color: colors.title,
                  fontSize: 24,
                  ...FONTS.fontBold,
                }}
              >
                {t("nfts.filters")}
              </MyTextApp>
            </View>
            <TouchableOpacity
              style={{
                alignItems: "center",
              }}
              activeOpacity={0.8}
              onPress={() => setShowFilter(false)}
            >
              <FeatherIcon name="x" size={24} color={colors.title} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <View
              style={{
                minHeight: SIZES.height - 160 - 75,
                backgroundColor: colors.background,
              }}
            >
              {index == NFTS_INDEX._MARKETPLACE && (
                <View
                  style={{
                    ...styles.titleFilters,
                    backgroundColor: colors.background,
                  }}
                >
                  <View
                    style={{
                      ...styles.searchPrice,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <InputComponent
                      style={{
                        ...styles.inputSp,
                        color: colors.title,
                        borderWidth: 1,
                        borderColor: "rgba(122, 121, 138, 0.50)",
                        width: 130,
                        height: 48,
                        textAlign: "center",
                      }}
                      placeholder={t("wallet.min")}
                      placeholderTextColor={colors.text}
                      cursorColor={colors.primary}
                      id="price-min"
                      keyboardType="numeric"
                      onChangeText={(text: any) => {
                        setPriceMin(text);
                      }}
                      defaultValue={(() => {
                        if (
                          isEmpty(filters?.prices) ||
                          isEmpty(filters?.prices?.min)
                        )
                          return;
                        return filters?.prices?.min;
                      })()}
                      showClear={false}
                      height={48}
                    />
                    <MyTextApp
                      style={{
                        fontSize: 16,
                        width: 10,
                        backgroundColor: colors.title,
                        height: 1,
                        marginHorizontal: 8,
                      }}
                    ></MyTextApp>
                    <InputComponent
                      style={{
                        ...styles.inputSp,
                        color: colors.title,
                        borderWidth: 1,
                        borderColor: "rgba(122, 121, 138, 0.50)",
                        width: 130,
                        height: 48,
                        textAlign: "center",
                      }}
                      placeholderTextColor={colors.text}
                      placeholder={t("wallet.max")}
                      cursorColor={colors.primary}
                      id="price-max"
                      keyboardType="numeric"
                      onChangeText={(text: string) => {
                        setPriceMax(text);
                      }}
                      defaultValue={(() => {
                        if (
                          isEmpty(filters?.prices) ||
                          isEmpty(filters?.prices?.max)
                        )
                          return;
                        return filters?.prices?.max;
                      })()}
                      height={48}
                      showClear={false}
                    />
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 20,
                      alignItems: "center",
                    }}
                  >
                    <ButtonComponent
                      title={t("nfts.apply")}
                      onPress={(e: any) => {
                        onFilterPrices(e);
                      }}
                      style={{
                        maxWidth: 180,
                      }}
                    />
                  </View>
                </View>
              )}
              <View style={{ ...styles.groupFilter, marginTop: 24 }}>
                <View style={styles.listCheckboxFilter}>
                  <Accordion
                    touchableComponent={TouchableOpacity}
                    onChange={setSections}
                    sections={lstFilter}
                    activeSections={activeSections}
                    renderContent={AccordionBody}
                    renderHeader={AccordionHeader}
                    duration={300}
                    expandMultiple
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: 20,
              height: 80,
              backgroundColor: dark ? "#282C35" : colors.background,
              marginBottom: -20,
            }}
          >
            <View style={styles.btnClearFilter}>
              <ButtonComponent
                title={t("nfts.reset")}
                onPress={() => {
                  cleanup();
                  initFilterPriceAndName();
                  const f = new NFTFilters();
                  f.push("limit", 12);
                  f.push("offset", 0);
                  setFilters(f);
                }}
              />
            </View>
          </View>
        </View>
      </ActionModalsComponent>
    </>
  );
}

export function FilterRichWorkFarmFamilyComponent({
  filters,
  setFilters,
  showFilter,
  setShowFilter,
  index,
}: {
  filters: NFTFilters;
  setFilters: any;
  showFilter: boolean;
  setShowFilter: any;
  index: number;
}) {
  const { t } = useTranslation();
  const { colors, dark } = useTheme();
  const [priceMax, setPriceMax] = useState("");

  const [priceMin, setPriceMin] = useState("");
  const [filterNftType, setFilterNftType] = useState(null);

  const initFilterPriceAndName = () => {
    setPriceMax("");
    setPriceMin("");
  };

  const onFilterPrices = (e: any) => {
    // price
    if (!checkIsNumber(priceMin) || !checkIsNumber(priceMax)) {
      filters.remove("prices", undefined);
      Toast.error(t("nfts.inventory_tab.price_invalid"));
    } else {
      let minFilter = priceMin;
      let maxFilter = priceMax;
      if (minFilter == "") {
        minFilter = "0";
      }
      if (maxFilter == "") maxFilter = DEFAULT_MAX_VALUE_FILTER.toString();
      const min = parseInt(minFilter);
      const max = parseInt(maxFilter);
      if (min < 0 || max < 0 || min > max) {
        filters.remove("prices", undefined);
        if (min > max && min > 0 && max > 0) {
          Toast.error(t("nfts.inventory_tab.max_price_greater_than_min"));
        }
      } else {
        const _p: any = {};
        _p.min = min;
        _p.max = max;
        filters.push("prices", _p);
      }
    }
    filters.push("offset", 0);
    setFilters({ ...filters.toInterface() });
  };

  const onFilterNFTType = (filterNftType: any) => {
    setFilterNftType(filterNftType);
    filters.remove("metadataIndexs", "");
    filters.remove("metadataLevels", undefined);
    filters.remove("metadataRaritys", "");
    filters.remove("metadataTypes", "");
    filters.remove("metadataNftType", "");
    filters.push("metadataNftType", filterNftType);
    filters.push("offset", 0);
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      ...filters.toInterface(),
    }));
  };

  const cleanup = () => {
    setFilters(new NFTFilters());
    setFilterNftType(null);
  };

  return (
    <>
      <ActionModalsComponent
        modalVisible={showFilter}
        closeModal={() => setShowFilter(false)}
        childrenPosition="flex-end"
        animation="fade"
      >
        <View
          style={{
            width: 320,
            height: SIZES.height - 75,
            paddingVertical: 20,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: dark ? "#282C35" : colors.background,
              padding: 20,
              height: 80,
              marginTop: -20,
            }}
          >
            <View style={styles.titleFilterLeft}>
              <MyTextApp
                style={{
                  color: colors.title,
                  fontSize: 24,
                  ...FONTS.fontBold,
                }}
              >
                {t("nfts.filters")}
              </MyTextApp>
            </View>
            <TouchableOpacity
              style={{
                alignItems: "center",
              }}
              activeOpacity={0.8}
              onPress={() => setShowFilter(false)}
            >
              <FeatherIcon name="x" size={24} color={colors.title} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <View
              style={{
                minHeight: SIZES.height - 160 - 75,
                backgroundColor: colors.background,
              }}
            >
              {index == NFTS_INDEX._MARKETPLACE && (
                <View
                  style={{
                    ...styles.titleFilters,
                    backgroundColor: colors.background,
                  }}
                >
                  <View
                    style={{
                      ...styles.searchPrice,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <InputComponent
                      style={{
                        ...styles.inputSp,
                        color: colors.title,
                        borderWidth: 1,
                        borderColor: "rgba(122, 121, 138, 0.50)",
                        width: 130,
                        height: 48,
                        textAlign: "center",
                      }}
                      placeholder={t("wallet.min")}
                      placeholderTextColor={colors.text}
                      cursorColor={colors.primary}
                      id="price-min"
                      keyboardType="numeric"
                      onChangeText={(text: any) => {
                        setPriceMin(text);
                      }}
                      defaultValue={(() => {
                        if (
                          isEmpty(filters?.prices) ||
                          isEmpty(filters?.prices?.min)
                        )
                          return;
                        return filters?.prices?.min;
                      })()}
                      showClear={false}
                      height={48}
                    />
                    <MyTextApp
                      style={{
                        fontSize: 16,
                        width: 10,
                        backgroundColor: colors.title,
                        height: 1,
                        marginHorizontal: 8,
                      }}
                    ></MyTextApp>
                    <InputComponent
                      style={{
                        ...styles.inputSp,
                        color: colors.title,
                        borderWidth: 1,
                        borderColor: "rgba(122, 121, 138, 0.50)",
                        width: 130,
                        height: 48,
                        textAlign: "center",
                      }}
                      placeholderTextColor={colors.text}
                      placeholder={t("wallet.max")}
                      cursorColor={colors.primary}
                      id="price-max"
                      keyboardType="numeric"
                      onChangeText={(text: string) => {
                        setPriceMax(text);
                      }}
                      defaultValue={(() => {
                        if (
                          isEmpty(filters?.prices) ||
                          isEmpty(filters?.prices?.max)
                        )
                          return;
                        return filters?.prices?.max;
                      })()}
                      height={48}
                      showClear={false}
                    />
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 20,
                      alignItems: "center",
                    }}
                  >
                    <ButtonComponent
                      title={t("nfts.apply")}
                      onPress={(e: any) => {
                        onFilterPrices(e);
                      }}
                      style={{
                        maxWidth: 180,
                      }}
                    />
                  </View>
                </View>
              )}
              <View
                style={{
                  paddingBottom: 8,
                  borderBottomColor: "#343444",
                  borderBottomWidth: 1,
                  paddingHorizontal: 20,
                  paddingTop: 16,
                }}
              >
                <MyTextApp
                  style={{
                    ...FONTS.fontBold,
                    fontSize: 18,
                    color: colors.title,
                  }}
                >
                  NFT
                </MyTextApp>
                {richWorkFarmFamilyNFTType.map((e, i) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                    key={i}
                    onPress={() => {
                      if (filterNftType == e.nftType) {
                        onFilterNFTType(null);
                      } else {
                        onFilterNFTType(
                          e.nftType as FILTER_NFT_TYPE_RICHWORK_FARM_FAMILY_MARKET,
                        );
                      }
                    }}
                    activeOpacity={0.8}
                  >
                    <CheckBox
                      accessibilityLabelledBy={"list" + index + "_" + i}
                      accessibilityLabel="input"
                      value={filterNftType == e.nftType}
                      onChange={() => {
                        return false;
                      }}
                      onValueChange={() => {
                        if (filterNftType == e.nftType) {
                          onFilterNFTType(null);
                        } else {
                          onFilterNFTType(
                            e.nftType as FILTER_NFT_TYPE_GALIX_MARKET,
                          );
                        }
                      }}
                      tintColors={{
                        true: COLORS.primary,
                        false: COLORS.descriptionText,
                      }} // Android only - true = backgroundcolor value of checkbox; false = border color value of checkbox
                      // iOS only
                      tintColor={COLORS.descriptionText} // color of line when checkbox off
                      onCheckColor={COLORS.white} // color of check mark when checkbox on
                      onFillColor={COLORS.primary} // background checkbox when on
                      onTintColor={COLORS.primary} // color of line when checkbox on
                    />
                    <MyTextApp style={{ color: colors.title, fontSize: 16 }}>
                      {e.name}
                    </MyTextApp>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: 20,
              height: 80,
              backgroundColor: dark ? "#282C35" : colors.background,
              marginBottom: -20,
            }}
          >
            <View style={styles.btnClearFilter}>
              <ButtonComponent
                title={t("nfts.reset")}
                onPress={() => {
                  cleanup();
                  initFilterPriceAndName();
                  const f = new NFTFilters();
                  f.push("limit", 12);
                  f.push("offset", 0);
                  setFilters(f);
                }}
              />
            </View>
          </View>
        </View>
      </ActionModalsComponent>
    </>
  );
}

export default function FilterComponent({
  index,
  serviceID,
  filters,
  setFilters,
  showFilter,
  setShowFilter,
}: {
  index: number;
  serviceID: SERVICE_ID;
  filters: NFTFilters;
  setFilters: any;
  showFilter: boolean;
  setShowFilter: any;
}) {
  return (
    <>
      {!cf_notShowFilter.includes(index) && (
        <>
          {serviceID == SERVICE_ID._9DNFT && (
            <Filter9DComponent
              filters={filters}
              setFilters={setFilters}
              showFilter={showFilter}
              setShowFilter={setShowFilter}
              index={index}
            />
          )}
          {serviceID == SERVICE_ID._SOUL_REALM && (
            <FilterSoulRealmComponent
              filters={filters}
              setFilters={setFilters}
              showFilter={showFilter}
              setShowFilter={setShowFilter}
              index={index}
            />
          )}
          {serviceID == SERVICE_ID._GALIXCITY && (
            <FilterGalixCityComponent
              filters={filters}
              setFilters={setFilters}
              showFilter={showFilter}
              setShowFilter={setShowFilter}
              index={index}
            />
          )}
          {serviceID == SERVICE_ID._MARSWAR && (
            <FilterMechaComponent
              filters={filters}
              setFilters={setFilters}
              showFilter={showFilter}
              setShowFilter={setShowFilter}
              index={index}
            />
          )}
          {serviceID == SERVICE_ID._FLASHPOINT && (
            <FilterFlashpointComponent
              filters={filters}
              setFilters={setFilters}
              showFilter={showFilter}
              setShowFilter={setShowFilter}
              index={index}
            />
          )}
          {serviceID == SERVICE_ID._RICHWORK_FARM_FAMILY && (
            <FilterRichWorkFarmFamilyComponent
              filters={filters}
              setFilters={setFilters}
              showFilter={showFilter}
              setShowFilter={setShowFilter}
              index={index}
            />
          )}
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  listFilterSearch: {
    width: "100%",
  },
  titleFilters: {},
  btnClearFilter: {
    width: "100%",
  },
  titleFilterLeft: {},
  searchPrice: {
    paddingHorizontal: 20,
  },
  inputSp: {
    padding: 4,
    width: 80,
    textAlign: "center",
    marginVertical: 16,
    borderRadius: 8,
  },
  groupFilter: {
    paddingHorizontal: 20,
  },
  listCheckboxFilter: {},
  btnToggle: {},
  nameFilters: {},
  iconToggle: {},
  itemFilterDashboard: {},
  titleSlider: {},
  nameCheckbox: {
    fontSize: 16,
    width: "100%",
  },
});
