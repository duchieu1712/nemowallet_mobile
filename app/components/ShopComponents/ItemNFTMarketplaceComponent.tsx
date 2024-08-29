import {
  COLORS,
  FONTS,
  ICONS,
  LAND_LEVEL,
  MyTextApp,
  SIZES,
} from "../../themes/theme";
import { ColorOfItemNameComponent, DetailNFTComponent } from "./components";
import { FILTER_NFT_TYPE_GALIX_MARKET, SERVICE_ID } from "../../common/enum";
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo, useState } from "react";
import { currencyFormat } from "../../common/utilities";

import { BuyNFT } from "../MarketComponent";
import { Dmetadata } from "../../modules/nft/market";
import FeatherIcon from "react-native-vector-icons/Feather";
import { type IMarket } from "../../common/types";
import ImageLoaderComponent from "../ImageComponent/ImageLoaderComponent";
import { type Nft } from "../../modules/graphql/types/generated";
import { getQualityNFT } from "./ultilities";
import { cf_services } from "../../config/services";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { toIpfsGatewayUrl } from "../../common/utilities_config";

export function ListItemMarketplace({
  market,
  callback,
  data,
  serviceID,
  navigation,
}: {
  market: IMarket;
  callback: any;
  data: any;
  serviceID: SERVICE_ID;
  navigation: any;
}) {
  const { colors, dark } = useTheme();
  // const navigation = useNavigation();
  const { t } = useTranslation();
  const game = cf_services.find((e) => e.serviceID == serviceID);

  const RenderItem = useMemo(() => {
    return ({ item, index }: { item: Nft; index: any }) => {
      const [successful, setSuccessful] = useState(false);

      const onSuccessful = () => {
        setSuccessful(true);
        callback();
      };

      if (!successful && item != null) {
        const imageItem = toIpfsGatewayUrl(item?.metadata?.image, serviceID);

        const itemDMetadata = Dmetadata.fromObject(item?.metadata);
        return (
          <View
            style={{
              // height: SIZES.width > 412 ? 500 : 320,
              // height: "auto",
              justifyContent: "flex-start",
            }}
            key={`${index}q`}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("DetailNFTScreen" as never, {
                  // item: item,
                  collectionID: item.collection.id,
                  tokenID: item.tokenId,
                  servicesID: serviceID,
                })
              }
              activeOpacity={0.8}
              style={{
                backgroundColor: colors.card,
                borderRadius: 8,
                padding: 8,
                width: SIZES.width / 2 - 20 - 6,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  // height: "100%",
                }}
              >
                <ImageBackground
                  source={getQualityNFT({
                    serviceID,
                    item,
                    itemDMetadata,
                  })}
                  style={{
                    width: SIZES.width / 2 - 20 - 6 - 16,
                    height: SIZES.width / 2 - 20 - 6 - 16,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  borderRadius={8}
                >
                  {imageItem ? (
                    <ImageLoaderComponent
                      source={imageItem}
                      style={{
                        width: serviceID == SERVICE_ID._MARSWAR ? "80%" : "40%",
                        height:
                          serviceID == SERVICE_ID._MARSWAR ? "80%" : "40%",
                        resizeMode: "cover",
                      }}
                    />
                  ) : (
                    item.metadataNftType == FILTER_NFT_TYPE_GALIX_MARKET.LAND &&
                    item.metadataLevel && (
                      <Image
                        source={LAND_LEVEL[item.metadataLevel]}
                        style={{
                          width: "40%",
                          height: "40%",
                        }}
                      />
                    )
                  )}
                  <DetailNFTComponent
                    serviceID={serviceID}
                    item={item}
                    itemDMetadata={itemDMetadata}
                  />
                </ImageBackground>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    width: "100%",
                    gap: 4,
                    marginTop: SIZES.width > 412 ? 12 : 8,
                  }}
                >
                  <Image
                    source={game?.logoGame}
                    style={{ width: 20, height: 20, borderRadius: 4 }}
                  />
                  <MyTextApp
                    style={{
                      color: colors.text,
                      fontSize: SIZES.width > 412 ? 16 : 14,
                    }}
                    numberOfLines={1}
                  >
                    {game?.serviceName}
                  </MyTextApp>
                </View>

                <View
                  style={{
                    ...styles.bottomPrice,
                    height: SIZES.width > 412 ? 80 : 65,
                    marginTop: 8,
                    overflow: "visible",
                    // borderWidth: 1,
                    // borderColor: "red",
                  }}
                >
                  <ColorOfItemNameComponent
                    colors={colors}
                    item={item}
                    itemDMetadata={itemDMetadata}
                    serviceID={serviceID}
                    name={item?.metadata.name}
                    fontSize={SIZES.width > 412 ? 18 : 14}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      gap: 4,
                    }}
                  >
                    <MyTextApp
                      style={{
                        color: colors.text,
                        fontSize: SIZES.width > 412 ? 14 : 11,
                      }}
                    >
                      #{item?.tokenId}
                    </MyTextApp>
                    <View style={styles.hagPrice}>
                      <Image
                        source={ICONS.nemo}
                        style={{
                          width: 12,
                          height: 12,
                        }}
                      />
                      <MyTextApp
                        style={{
                          fontSize: SIZES.width > 412 ? 16 : 14,
                          ...FONTS.fontBold,
                          color: colors.title,
                        }}
                        ellipsizeMode="tail"
                        numberOfLines={1}
                      >
                        {currencyFormat(item?.askPrice)}
                      </MyTextApp>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{ height: 36, width: "100%", marginVertical: 12 }}>
                <BuyNFT
                  item={item}
                  style={{
                    width: "100%",
                    alignItems: "center",

                    // position: "absolute",
                    // bottom: SIZES.width > 412 ? 12 : 8,
                  }}
                  market={market}
                  onProcessing={() => {
                    return false;
                  }}
                  onSuccessful={() => {
                    onSuccessful();
                  }}
                  onError={() => {
                    return false;
                  }}
                  serviceID={serviceID}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      borderRadius: 100,
                      backgroundColor: colors.primary,
                      paddingVertical: 10,
                      height: 40,
                      // position: "absolute",
                      width: "100%",
                      // bottom: 8,
                    }}
                  >
                    <FeatherIcon
                      name="shopping-bag"
                      color={COLORS.white}
                      size={16}
                    />
                    <MyTextApp
                      style={{
                        fontSize: 14,
                        fontWeight: "700",
                      }}
                    >
                      {t("wallet.buy")}
                    </MyTextApp>
                  </View>
                </BuyNFT>
              </View>
            </TouchableOpacity>
          </View>
        );
      } else {
        return <View></View>;
      }
    };
  }, [data, dark]);

  return (
    <FlatList
      nestedScrollEnabled={true}
      scrollEnabled={false}
      data={data}
      renderItem={({ item, index }: { item: Nft; index: any }) => (
        <RenderItem item={item} index={index} />
      )}
      keyExtractor={(index) => `${index}m`}
      numColumns={2}
      columnWrapperStyle={{
        gap: 12,
        marginBottom: 12,
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  itemMarket: {},
  itemData: {},
  thumb: {},
  hagPrice: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "flex-end",
    gap: 4,
  },
  price: {},
  listDataContainer: {},
  listMarket: {},
  listMainMarket: {},
  btnMarket: {},
  searchMarket: {},
  customInventory: {},
  itemPower: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    position: "absolute",
    bottom: 8,
    padding: 4,
    backgroundColor: "rgba(20, 20, 31, 0.50)",
    borderRadius: 4,
    overflow: "hidden",
    // maxWidth: "90%",
  },
  title: {
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  bottomPrice: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    overflow: "hidden",
    width: "100%",
  },
  btnAction: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
    // backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  pagination: {
    marginTop: 24,
    paddingBottom: 80,
  },
  page: {
    textAlign: "center",
    borderRadius: 8,
  },
  pageNumber: {
    textAlign: "center",
  },
  inputPageNumber: {
    borderWidth: 1,
    textAlign: "center",
    width: 60,
    height: 32,
    padding: 4,
    borderRadius: 8,
  },
});
