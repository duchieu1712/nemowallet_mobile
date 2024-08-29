import * as NFTActions from "../../../modules/nft/actions";

import { FlatList, Image, TouchableOpacity, View } from "react-native";
import React, { useMemo } from "react";
import { useNavigation, useTheme } from "@react-navigation/native";

import { MyTextApp } from "../../../themes/theme";
import { appDispatch } from "../../../modules";
import { useTranslation } from "react-i18next";

export default function ListNFTsComponent({
  game,
  collection,
  nftAmount,
}: {
  game: any;
  collection: any;
  nftAmount: any;
}) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const RenderItem = useMemo(() => {
    return ({ item, index }: { item: any; index: any }) => (
      <TouchableOpacity
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          gap: 12,
          borderBottomWidth: 1,
          borderColor: colors.borderColor,
        }}
        key={index}
        onPress={() => {
          appDispatch(NFTActions.setFromWallet(true));
          navigation.navigate("Shop" as Never);
        }}
      >
        <Image source={game.logoGame} style={{ width: 30, height: 30 }} />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <MyTextApp style={{ color: colors.title }}>{item.name}</MyTextApp>
          <MyTextApp style={{ color: colors.title }}>
            {t("common.amount")}: {nftAmount[index] ?? 0}
          </MyTextApp>
        </View>
      </TouchableOpacity>
    );
  }, [nftAmount, collection]);
  return (
    <View style={{ paddingHorizontal: 18 }}>
      <FlatList
        nestedScrollEnabled
        scrollEnabled={false}
        data={collection}
        renderItem={RenderItem}
      />
    </View>
  );
}
