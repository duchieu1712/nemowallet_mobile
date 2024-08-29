import { ColorOfItemNameComponent, StarComponent } from "./components";
import { FILTER_NFT_TYPE_GALIX_MARKET, SERVICE_ID } from "../../common/enum";
import { FONTS, ICONS, MyTextApp, SIZES } from "../../themes/theme";
import {
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
} from "react-native";
import {
  type Nft,
  type Transaction,
} from "../../modules/graphql/types/generated";
import React, { useMemo } from "react";
import {
  currencyFormat,
  ellipseAddress,
  timestampToHumanDashaboard,
} from "../../common/utilities";

import { Dmetadata } from "../../modules/nft/market";
import { GlobalStyleSheet } from "../../themes/styleSheet";
import ImageLoaderComponent from "../ImageComponent/ImageLoaderComponent";
import OpenLinkComponent from "../OpenLinkComponent";
import { getQualityNFT } from "./ultilities";
import { useTheme } from "@react-navigation/native";
import { toIpfsGatewayUrl } from "../../common/utilities_config";

export function RenderItemListed({
  t,
  dataList,
  navigation,
  serviceID,
}: {
  dataList: any;
  t: any;
  navigation: any;
  serviceID: any;
}) {
  const { colors, dark } = useTheme();

  const RenderItem = useMemo(() => {
    return ({ nft, key, meta }: { nft: Nft; key: any; meta: Dmetadata }) => {
      return (
        <TouchableOpacity
          key={`o${key}`}
          onPress={() =>
            navigation.navigate("DetailNFTScreen" as never, {
              // item: nft,
              collectionID: nft.collection.id,
              tokenID: nft.tokenId,
              servicesID: serviceID,
            })
          }
          style={{
            alignItems: "center",
            width: "100%",
            marginBottom: 12,
          }}
          activeOpacity={0.8}
        >
          <View
            style={{
              backgroundColor: dark ? "#252731" : "#fff",
              paddingHorizontal: 10,
              paddingTop: 8,
              paddingBottom: 14,
              borderRadius: 8,
              gap: 8,
              width: "100%",
              flexDirection: "row",
              alignItems: "flex-start",
              ...GlobalStyleSheet,
            }}
          >
            <ImageBackground
              source={getQualityNFT({
                serviceID,
                item: nft,
                itemDMetadata: meta,
                isDashboard: true,
              })}
              style={{
                width: 56,
                height: 56,
                alignItems: "center",
                justifyContent: "center",
              }}
              borderRadius={4}
            >
              {serviceID == SERVICE_ID._GALIXCITY &&
                nft.metadataNftType == FILTER_NFT_TYPE_GALIX_MARKET.HERO && (
                  <View
                    style={{
                      position: "absolute",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                      bottom: 0,
                      padding: 4,
                      backgroundColor: "rgba(20, 20, 31, 0.50)",
                      borderRadius: 2,
                      overflow: "hidden",
                      zIndex: 2,
                      width: "100%",
                    }}
                  >
                    <StarComponent item={nft} isDashboard />
                  </View>
                )}
              <ImageLoaderComponent
                source={toIpfsGatewayUrl(nft?.metadata.image, serviceID)}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </ImageBackground>
            <View
              style={{
                width: SIZES.width - 56 - 40 - 8 - 20,
                gap: 4,
                alignItems: "flex-start",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  width: "100%",
                  flexWrap: "wrap",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    maxWidth: "65%",
                  }}
                >
                  <MyTextApp
                    style={{
                      color: colors.title,
                      ...FONTS.fontBold,
                    }}
                  >
                    {" "}
                    #{nft.tokenId}
                  </MyTextApp>

                  <ColorOfItemNameComponent
                    name={nft?.metadata?.name}
                    serviceID={serviceID}
                    item={nft}
                    colors={colors}
                    price={nft.askPrice}
                    isDashboard={true}
                    itemDMetadata={meta}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 4,
                    maxWidth: "20%",
                  }}
                >
                  <Image
                    source={ICONS.nemo}
                    style={{ width: 12, height: 12 }}
                  />
                  <MyTextApp
                    style={{
                      color: colors.title,
                      ...FONTS.fontBold,
                    }}
                    numberOfLines={1}
                  >
                    {currencyFormat(nft.askPrice)}
                  </MyTextApp>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <MyTextApp
                  style={{
                    fontSize: 12,
                    ...FONTS.fontBold,
                    color: colors.text,
                  }}
                >
                  {t("nfts.dashboard_tab.seller")}
                </MyTextApp>
                <OpenLinkComponent
                  address={nft.seller.id}
                  style={{
                    color: colors.title,
                    fontSize: 12,
                  }}
                >
                  {ellipseAddress(nft.seller.id)}
                </OpenLinkComponent>
              </View>
              <MyTextApp style={{ color: colors.text, fontSize: 12 }}>
                {timestampToHumanDashaboard(nft.updatedAt)}
              </MyTextApp>
            </View>
          </View>
        </TouchableOpacity>
      );
    };
  }, [dataList, dark]);

  return (
    <FlatList
      nestedScrollEnabled={true}
      scrollEnabled={false}
      data={dataList}
      renderItem={({ item, index }: { item: Nft; index: number }) => {
        const meta = Dmetadata.fromObject(item?.metadata);
        return <RenderItem nft={item} key={index} meta={meta} />;
      }}
    />
  );
}

export function RenderItemSold({
  dataTrans,
  navigation,
  t,
  serviceID,
}: {
  dataTrans: any;
  navigation: any;
  t: any;
  serviceID: any;
}) {
  const { colors, dark } = useTheme();

  const RenderItem = useMemo(() => {
    return ({
      trans,
      meta,
      key,
    }: {
      trans: Transaction;
      meta: any;
      key: any;
    }) => {
      return (
        <TouchableOpacity
          key={key}
          onPress={() =>
            navigation.navigate("DetailNFTScreen" as never, {
              // item: trans.nft,
              collectionID: trans.nft.collection.id,
              tokenID: trans.nft.tokenId,
              servicesID: serviceID,
            })
          }
          style={{ alignItems: "center", width: "100%", marginBottom: 12 }}
          activeOpacity={0.8}
        >
          <View
            style={{
              backgroundColor: dark ? "#252731" : "#fff",
              paddingHorizontal: 10,
              paddingTop: 8,
              paddingBottom: 14,
              borderRadius: 8,
              gap: 8,
              width: "100%",
              flexDirection: "row",
              alignItems: "flex-start",
              ...GlobalStyleSheet,
            }}
          >
            <ImageBackground
              source={getQualityNFT({
                serviceID,
                item: trans?.nft,
                itemDMetadata: meta,
                isDashboard: true,
              })}
              style={{
                width: 56,
                height: 56,
                alignItems: "center",
                justifyContent: "center",
              }}
              borderRadius={4}
            >
              {serviceID == SERVICE_ID._GALIXCITY &&
                trans.nft.metadataNftType ==
                  FILTER_NFT_TYPE_GALIX_MARKET.HERO && (
                  <View
                    style={{
                      position: "absolute",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                      bottom: 0,
                      padding: 4,
                      backgroundColor: "rgba(20, 20, 31, 0.50)",
                      borderRadius: 2,
                      overflow: "hidden",
                      zIndex: 2,
                      width: "100%",
                    }}
                  >
                    <StarComponent item={trans.nft} isDashboard />
                  </View>
                )}
              <ImageLoaderComponent
                source={toIpfsGatewayUrl(trans?.nft.metadata.image, serviceID)}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </ImageBackground>
            <View
              style={{
                width: SIZES.width - 56 - 40 - 8 - 20,
                gap: 4,
                alignItems: "flex-start",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  width: "100%",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    width: "65%",
                  }}
                >
                  <MyTextApp
                    style={{
                      color: colors.title,
                      ...FONTS.fontBold,
                    }}
                  >
                    {" "}
                    #{trans.nft.tokenId}
                  </MyTextApp>

                  <ColorOfItemNameComponent
                    name={trans?.nft?.metadata?.name}
                    serviceID={serviceID}
                    item={trans?.nft}
                    colors={colors}
                    isDashboard={true}
                    itemDMetadata={meta}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 4,
                    maxWidth: "20%",
                  }}
                >
                  <Image
                    source={ICONS.nemo}
                    style={{ width: 12, height: 12 }}
                  />
                  <MyTextApp
                    style={{
                      color: colors.title,
                      ...FONTS.fontBold,
                    }}
                    numberOfLines={1}
                  >
                    {currencyFormat(trans.price)}
                  </MyTextApp>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <MyTextApp
                  style={{
                    fontSize: 12,
                    ...FONTS.fontBold,
                    color: colors.text,
                  }}
                >
                  {t("nfts.dashboard_tab.buyer")}
                </MyTextApp>
                <OpenLinkComponent
                  address={trans.recipient.id}
                  style={{
                    color: colors.title,
                    fontSize: 12,
                  }}
                >
                  {ellipseAddress(trans.recipient.id)}
                </OpenLinkComponent>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <MyTextApp
                  style={{
                    fontSize: 12,
                    ...FONTS.fontBold,
                    color: colors.text,
                  }}
                >
                  {t("nfts.dashboard_tab.seller")}
                </MyTextApp>
                <OpenLinkComponent
                  address={trans.sender.id}
                  style={{
                    color: colors.title,
                    fontSize: 12,
                  }}
                >
                  {ellipseAddress(trans.sender.id)}
                </OpenLinkComponent>
              </View>
              <MyTextApp style={{ color: colors.text, fontSize: 12 }}>
                {timestampToHumanDashaboard(trans.timestamp)}
              </MyTextApp>
            </View>
          </View>
        </TouchableOpacity>
      );
    };
  }, [dataTrans, dark]);
  return (
    <FlatList
      nestedScrollEnabled={true}
      scrollEnabled={false}
      data={dataTrans}
      renderItem={({ item, index }: { item: any; index: number | string }) => {
        const meta = Dmetadata.fromObject(item.nft?.metadata);
        return <RenderItem trans={item} key={index} meta={meta} />;
      }}
    />
  );
}

// export default function ItemNFTDashboard({
//   item,
//   serviceID,
// }: {
//   item: any;
//   serviceID: any;
// }) {
//   const { t } = useTranslation();
//   const { colors, dark } = useTheme();
//   const navigation;
// }
