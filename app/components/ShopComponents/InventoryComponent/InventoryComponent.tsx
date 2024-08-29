import {
  type BidOrder,
  type Nft,
} from "../../../modules/graphql/types/generated";
import {
  Burn,
  CancelAskOrder,
  CancelBidOrder,
  CreateAskOrder,
  SendNft,
  SendNftOPS,
  ValidateOPS,
} from "../../MarketComponent";
import {
  COLORS,
  FONTS,
  ICONS,
  LAND_LEVEL,
  MyTextApp,
  SIZES,
} from "../../../themes/theme";
import { ColorOfItemNameComponent, DetailNFTComponent } from "../components";
import {
  FILTER_NFT_TYPE_GALIX_MARKET,
  ListInventory,
  SERVICE_ID,
} from "../../../common/enum";
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { currencyFormat } from "../../../common/utilities";
import { useMemo, useState } from "react";

import { ClassWithStaticMethod } from "../../../common/static";
import { Dmetadata } from "../../../modules/nft/market";
import FeatherIcon from "react-native-vector-icons/Feather";
import { type IMarket } from "../../../common/types";
import ImageLoaderComponent from "../../ImageComponent/ImageLoaderComponent";
import { getQualityNFT } from "../ultilities";
import { cf_services } from "../../../config/services";
import { useTheme } from "@react-navigation/native";
import { toIpfsGatewayUrl } from "../../../common/utilities_config";

export function RenderListItemSoldComponent({
  dataSold,
  t,
  navigation,
  serviceID,
}: {
  dataSold: any;
  t: any;
  navigation: any;
  serviceID: SERVICE_ID;
}): JSX.Element {
  const { colors, dark } = useTheme();

  const RenderItem = useMemo(() => {
    return ({ item, key }: { item: any; key: any }) => {
      if (item != null) {
        const itemDMetadata = Dmetadata.fromObject(item?.nft?.metadata);
        const imageItem = toIpfsGatewayUrl(item?.metadata?.image, serviceID);

        return (
          <View
            style={{
              // height: SIZES.width > 412 ? 450 : 270,
              justifyContent: "flex-start",
            }}
            key={key}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("DetailNFTScreen" as never, {
                  // item: item.nft,
                  collectionID: item.nft.collection.id,
                  tokenID: item.nft.tokenId,
                  servicesID: serviceID,
                })
              }
              style={{
                backgroundColor: colors.card,
                borderRadius: 8,
                padding: 8,
                width: SIZES.width / 2 - 20 - 8,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    zIndex: 2,
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                    backgroundColor: COLORS.sell,
                    borderRadius: 4,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <MyTextApp>{t("nfts.inventory_tab.sold")}</MyTextApp>
                </View>
                <ImageBackground
                  style={{
                    height: SIZES.width / 2 - 20 - 8 - 16,
                    width: SIZES.width / 2 - 20 - 8 - 16,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  source={getQualityNFT({
                    serviceID,
                    item: item.nft,
                    itemDMetadata,
                  })}
                >
                  <ImageLoaderComponent
                    source={toIpfsGatewayUrl(
                      item?.nft.metadata.image,
                      serviceID,
                    )}
                    alt=""
                    style={{
                      width: "40%",
                      height: "40%",
                    }}
                  />
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
                        source={LAND_LEVEL[item.nft.metadataLevel]}
                        style={{
                          width: "40%",
                          height: "40%",
                        }}
                      />
                    )
                  )}
                  <DetailNFTComponent
                    serviceID={serviceID}
                    item={item.nft}
                    itemDMetadata={itemDMetadata}
                  />
                </ImageBackground>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    marginTop: SIZES.width > 412 ? 12 : 8,
                    width: "100%",
                  }}
                >
                  <Image
                    source={
                      cf_services.find((e) => e.serviceID == serviceID)
                        ?.logoGame
                    }
                    style={{ width: 20, height: 20, borderRadius: 4 }}
                  />
                  <MyTextApp
                    style={{
                      color: colors.text,
                      flex: 1,
                      fontSize: SIZES.width > 412 ? 16 : 14,
                    }}
                  >
                    {
                      cf_services.find((e) => e.serviceID == serviceID)
                        ?.serviceName
                    }
                  </MyTextApp>
                </View>
                <View
                  style={{
                    ...styles.bottomPrice,

                    height: SIZES.width > 412 ? 80 : 65,
                    marginTop: 8,
                    overflow: "visible",
                  }}
                >
                  <ColorOfItemNameComponent
                    colors={colors}
                    item={item?.nft}
                    itemDMetadata={itemDMetadata}
                    serviceID={serviceID}
                    name={item?.nft.metadata.name}
                    fontSize={SIZES.width > 412 ? 18 : 14}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <MyTextApp
                      style={{
                        color: colors.text,
                        fontSize: SIZES.width > 412 ? 14 : 11,
                      }}
                    >
                      #{item?.nft.tokenId}
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
                          color: colors.title,
                          ...FONTS.fontBold,
                          fontSize: SIZES.width > 412 ? 16 : 14,
                        }}
                      >
                        {currencyFormat(item.price)}
                      </MyTextApp>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        );
      } else return <View key={key}></View>;
    };
  }, [dataSold, dark]);

  return (
    <FlatList
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled={true}
      scrollEnabled={false}
      data={dataSold}
      renderItem={({ item, index }: { item: any; index: any }) => (
        <RenderItem key={index} item={item} />
      )}
      numColumns={2}
      columnWrapperStyle={{
        gap: 12,
        marginBottom: 12,
      }}
    />
  );
}

export function RenderListItemComponent({
  market,
  callback,
  kind,
  t,
  navigation,
  dataItem,
  serviceID,
}: {
  callback: any;
  market: IMarket;
  kind?: ListInventory;
  t: any;
  navigation: any;
  dataItem: any;
  serviceID: SERVICE_ID;
}): JSX.Element {
  const { colors, dark } = useTheme();

  const RenderItem = useMemo(() => {
    return ({
      item,
      key,
      isAvailable,
    }: {
      item: Nft;
      key: any;
      isAvailable: boolean;
    }) => {
      const [successful, setSuccessful] = useState(false);
      const [isShown, setIsShown] = useState(false);
      const [processing, setProcessing] = useState(false);
      if (!successful && item != null) {
        const itemDMetadata = Dmetadata.fromObject(item?.metadata);
        const imageItem = toIpfsGatewayUrl(item?.metadata?.image, serviceID);
        return (
          <View
            style={{
              justifyContent: "flex-start",
            }}
            key={key}
          >
            {isShown && (
              <TouchableOpacity
                style={{
                  paddingHorizontal: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  zIndex: 10,
                  top: 0,
                  left: 0,
                  width: SIZES.width / 2 - 20 - 8,
                  height: "100%",
                  borderRadius: 8,
                  backgroundColor: dark
                    ? "rgba(31, 34, 42, 0.85)"
                    : "rgba(31, 34, 42, 0.5)",
                }}
                onPress={() => {
                  setIsShown(false);
                }}
              >
                {serviceID != SERVICE_ID._OPS_ALPHA && (
                  <View
                    style={{
                      gap: 16,
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <CancelAskOrder
                      item={item}
                      market={market}
                      onProcessing={() => {
                        setProcessing(true);
                      }}
                      onSuccessful={() => {
                        setSuccessful(true);
                        setProcessing(false);
                        callback();
                      }}
                      onError={() => {
                        setProcessing(false);
                      }}
                      serviceID={serviceID}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 4,
                          borderRadius: 20,
                          backgroundColor: colors.primary,
                          paddingVertical: 8,
                        }}
                      >
                        <FeatherIcon name="x" color={COLORS.white} size={16} />
                        <MyTextApp
                          style={{
                            fontSize: 14,
                            fontWeight: "700",
                          }}
                        >
                          {t("common.cancel")}
                        </MyTextApp>
                      </View>
                    </CancelAskOrder>

                    <Burn
                      item={item}
                      disabled={!isAvailable || processing}
                      onProcessing={() => {
                        setProcessing(true);
                      }}
                      onSuccessful={() => {
                        setSuccessful(true);
                        setProcessing(false);
                        callback();
                      }}
                      onError={() => {
                        setProcessing(false);
                      }}
                      isAvailable={isAvailable}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 4,
                          borderRadius: 32,
                          width: "100%",
                          backgroundColor: colors.primary,
                          paddingVertical: 12,
                        }}
                      >
                        <FeatherIcon
                          name="unlock"
                          color={COLORS.white}
                          size={16}
                        />
                        <MyTextApp style={{ fontSize: 16, fontWeight: "700" }}>
                          {t("nfts.inventory_tab.unlock")}
                        </MyTextApp>
                      </View>
                    </Burn>

                    <CreateAskOrder
                      item={item}
                      disabled={!isAvailable || processing}
                      market={market}
                      onProcessing={() => {
                        setProcessing(true);
                      }}
                      onSuccessful={() => {
                        setSuccessful(true);
                        setProcessing(false);
                        callback();
                      }}
                      onError={() => {
                        setProcessing(false);
                      }}
                      isAvailable={isAvailable}
                      serviceID={serviceID}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 4,
                          borderRadius: 32,
                          width: "100%",
                          backgroundColor: colors.primary,
                          paddingVertical: 12,
                        }}
                      >
                        <FeatherIcon
                          name="dollar-sign"
                          color={COLORS.white}
                          size={16}
                        />
                        <MyTextApp style={{ fontSize: 16, fontWeight: "700" }}>
                          {t("nfts.inventory_tab.sell")}
                        </MyTextApp>
                      </View>
                    </CreateAskOrder>

                    <SendNft
                      item={item}
                      disabled={!isAvailable || processing}
                      onProcessing={() => {
                        setProcessing(true);
                      }}
                      onSuccessful={() => {
                        setSuccessful(true);
                        setProcessing(false);
                        callback();
                      }}
                      onError={() => {
                        setProcessing(false);
                      }}
                      isAvailable={isAvailable}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 4,
                          borderRadius: 20,
                          backgroundColor: colors.primary,
                          paddingVertical: 12,
                        }}
                      >
                        <FeatherIcon
                          name="send"
                          color={COLORS.white}
                          size={16}
                        />
                        <MyTextApp
                          style={{
                            fontSize: 16,
                            fontWeight: "700",
                          }}
                        >
                          {t("common.send")}
                        </MyTextApp>
                      </View>
                    </SendNft>
                  </View>
                )}
                {serviceID == SERVICE_ID._OPS_ALPHA && (
                  <View
                    style={{
                      gap: 16,
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <SendNftOPS
                      item={item}
                      isAvailable={true}
                      onProcessing={() => {
                        setProcessing(true);
                      }}
                      onSuccessful={() => {
                        setSuccessful(true);
                        setProcessing(false);
                        callback();
                      }}
                      onError={() => {
                        setProcessing(false);
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 4,
                          borderRadius: 32,
                          width: "100%",
                          backgroundColor: colors.primary,
                          paddingVertical: 12,
                        }}
                      >
                        <MyTextApp style={{ fontSize: 16, fontWeight: "700" }}>
                          {t("common.send")}
                        </MyTextApp>
                      </View>
                    </SendNftOPS>
                    <ValidateOPS
                      item={item}
                      isAvailable={true}
                      onProcessing={() => {
                        setProcessing(true);
                      }}
                      onSuccessful={() => {
                        setSuccessful(true);
                        setProcessing(false);
                        callback();
                      }}
                      onError={() => {
                        setProcessing(false);
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 4,
                          borderRadius: 32,
                          width: "100%",
                          backgroundColor: colors.primary,
                          paddingVertical: 12,
                        }}
                      >
                        <MyTextApp style={{ fontSize: 16, fontWeight: "700" }}>
                          {/* multi-languagez */}
                          {t("nfts.detail.check_owner")}
                        </MyTextApp>
                      </View>
                    </ValidateOPS>
                  </View>
                )}
              </TouchableOpacity>
            )}
            {kind != ListInventory.LIST_SELLING && (
              <TouchableOpacity
                style={{
                  backgroundColor: colors.card,
                  width: 34,
                  height: 34,
                  borderRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  zIndex: 2,
                  right: 0,
                }}
                onPress={() => {
                  setIsShown(true);
                }}
              >
                <View
                  style={{
                    backgroundColor: dark ? "#14141F" : "#fff",
                    width: 26,
                    height: 26,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 12,
                  }}
                >
                  <FeatherIcon name="menu" size={12} color={colors.title} />
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("DetailNFTScreen" as never, {
                  collectionID: item.collection.id,
                  tokenID: item.tokenId,
                  servicesID: serviceID,
                })
              }
              style={{
                backgroundColor: colors.card,
                borderRadius: 8,
                padding: 8,
                width: SIZES.width / 2 - 20 - 8,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    zIndex: 2,
                    rowGap: 4,
                  }}
                >
                  {item?.isTradable && (
                    <View
                      style={{
                        backgroundColor: COLORS.sell,
                        paddingHorizontal: 4,
                        paddingVertical: 2,
                        borderRadius: 4,
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                      }}
                    >
                      <MyTextApp>{t("nfts.inventory_tab.selling")}</MyTextApp>
                    </View>
                  )}
                  {item?.bids != null && item?.bids.length != 0 && (
                    <View
                      style={{
                        paddingHorizontal: 4,
                        paddingVertical: 2,
                        backgroundColor: COLORS.offer,
                        borderRadius: 4,
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                      }}
                    >
                      <MyTextApp>{t("nfts.inventory_tab.offered")}</MyTextApp>
                    </View>
                  )}
                </View>

                <ImageBackground
                  source={getQualityNFT({
                    serviceID,
                    item,
                    itemDMetadata,
                  })}
                  style={{
                    height: SIZES.width / 2 - 20 - 8 - 16,
                    width: SIZES.width / 2 - 20 - 8 - 16,
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
                    gap: 4,
                    marginTop: SIZES.width > 412 ? 12 : 8,
                  }}
                >
                  <Image
                    source={
                      cf_services.find((e) => e.serviceID == serviceID)
                        ?.logoGame
                    }
                    style={{ width: 20, height: 20, borderRadius: 4 }}
                  />
                  <MyTextApp
                    style={{
                      color: colors.text,
                      flex: 1,
                      fontSize: SIZES.width > 412 ? 16 : 14,
                    }}
                  >
                    {
                      cf_services.find((e) => e.serviceID == serviceID)
                        ?.serviceName
                    }
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
                      gap: 4,
                      width: "100%",
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
                    {item?.isTradable && item?.askPrice != null && (
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
                          {currencyFormat(item.askPrice)}
                        </MyTextApp>
                      </View>
                    )}
                  </View>
                </View>
                {kind == ListInventory.LIST_SELLING && (
                  <View
                    style={{
                      marginVertical: 8,
                      width: "100%",
                    }}
                  >
                    <CancelAskOrder
                      item={item}
                      market={market}
                      onProcessing={() => {
                        setProcessing(true);
                      }}
                      onSuccessful={() => {
                        setSuccessful(true);
                        setProcessing(false);
                        callback();
                      }}
                      onError={() => {
                        setProcessing(false);
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
                          paddingVertical: SIZES.width <= 412 ? 10 : 12,
                        }}
                      >
                        <FeatherIcon name="x" color={COLORS.white} size={16} />
                        <MyTextApp
                          style={{
                            fontSize: 14,
                            fontWeight: "700",
                          }}
                        >
                          {t("common.cancel")}
                        </MyTextApp>
                      </View>
                    </CancelAskOrder>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        );
      } else
        return (
          <View
            key={key}
            style={{
              width: SIZES.width / 2 - 20 - 8,
              height: kind == ListInventory.LIST_SELLING ? 320 : 270,
            }}
          ></View>
        );
    };
  }, [dataItem, dark]);

  return (
    <FlatList
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled={true}
      scrollEnabled={false}
      data={dataItem}
      renderItem={({ item, index }: { item: any; index: any }) => (
        <RenderItem
          item={item}
          key={index}
          isAvailable={
            item?.isAvailable ||
            ClassWithStaticMethod.STATIC_DEFAULT_CHAINID ==
              ClassWithStaticMethod.NEMO_WALLET_CHAINID
          }
        />
      )}
      numColumns={2}
      columnWrapperStyle={{
        gap: 12,
        marginBottom: 12,
      }}
    />
  );
}

export function RenderItemMyListingComponent({
  dataItem,
  market,
  callback,
  kind,
  t,
  navigation,
  serviceID,
}: {
  dataItem: any;
  callback: any;
  market: IMarket;
  kind: any;
  t: any;
  navigation: any;
  serviceID: any;
}): JSX.Element {
  return (
    <RenderListItemComponent
      dataItem={dataItem}
      market={market}
      callback={callback}
      kind={kind}
      t={t}
      navigation={navigation}
      serviceID={serviceID}
    />
  );
}

export function RenderItemBidComponent({
  market,
  callback,
  dataBid,
  navigation,
  t,
  serviceID,
}: {
  dataBid: any;
  callback: any;
  market: IMarket;
  navigation: any;
  t: any;
  serviceID: SERVICE_ID;
}): JSX.Element {
  const [successful, setSuccessful] = useState(false);

  const { colors, dark } = useTheme();

  const RenderItem = useMemo(() => {
    return ({ item, key }: { item: BidOrder; key: any }) => {
      if (!successful && item != null) {
        const itemDMetadata = Dmetadata.fromObject(item?.nft?.metadata);
        const imageItem = toIpfsGatewayUrl(
          item?.nft.metadata?.image,
          serviceID,
        );
        return (
          <View
            style={{
              // height: SIZES.width > 412 ? 500 : 350,
              justifyContent: "flex-start",
            }}
            key={key}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("DetailNFTScreen" as never, {
                  // item: item.nft,
                  collectionID: item.nft.collection.id,
                  tokenID: item.nft.tokenId,
                  servicesID: serviceID,
                })
              }
              style={{
                position: "relative",
                backgroundColor: colors.card,
                borderRadius: 8,
                padding: 8,
                width: SIZES.width / 2 - 20 - 8,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    zIndex: 2,
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                    backgroundColor: COLORS.offer,
                    borderRadius: 4,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <MyTextApp>{t("nfts.inventory_tab.offering")}</MyTextApp>
                </View>
                <ImageBackground
                  source={getQualityNFT({
                    serviceID,
                    item: item.nft,
                    itemDMetadata,
                  })}
                  style={{
                    height: SIZES.width / 2 - 20 - 8 - 16,
                    width: SIZES.width / 2 - 20 - 8 - 16,
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
                    item.nft.metadataNftType ==
                      FILTER_NFT_TYPE_GALIX_MARKET.LAND &&
                    item.nft.metadataLevel && (
                      <Image
                        source={LAND_LEVEL[item.nft.metadataLevel]}
                        style={{
                          width: "40%",
                          height: "40%",
                        }}
                      />
                    )
                  )}
                  <DetailNFTComponent
                    serviceID={serviceID}
                    item={item.nft}
                    itemDMetadata={itemDMetadata}
                  />
                </ImageBackground>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    marginTop: SIZES.width > 412 ? 12 : 8,
                    width: "100%",
                  }}
                >
                  <Image
                    source={
                      cf_services.find((e) => e.serviceID == serviceID)
                        ?.logoGame
                    }
                    style={{ width: 20, height: 20, borderRadius: 4 }}
                  />
                  <MyTextApp
                    style={{
                      color: colors.text,
                      fontSize: SIZES.width > 412 ? 16 : 14,
                    }}
                  >
                    {
                      cf_services.find((e) => e.serviceID == serviceID)
                        ?.serviceName
                    }
                  </MyTextApp>
                </View>

                <View
                  style={{
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      ...styles.bottomPrice,
                      height: SIZES.width > 412 ? 80 : 65,
                      marginTop: 8,
                      overflow: "visible",
                    }}
                  >
                    <ColorOfItemNameComponent
                      colors={colors}
                      item={item.nft}
                      itemDMetadata={itemDMetadata}
                      serviceID={serviceID}
                      name={item?.nft.metadata.name}
                      fontSize={SIZES.width > 412 ? 18 : 14}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <MyTextApp
                        style={{
                          color: colors.text,
                          fontSize: SIZES.width > 412 ? 14 : 11,
                        }}
                      >
                        #{item?.nft.tokenId}
                      </MyTextApp>
                      <View style={styles.hagPrice}>
                        <Image
                          source={ICONS.nemo}
                          style={{
                            width: 12,
                            height: 12,
                          }}
                        />
                        {item?.isTradable && item?.nft.askPrice != null && (
                          <MyTextApp
                            style={{
                              ...FONTS.fontBold,
                              color: colors.title,
                              textDecorationLine: "line-through",
                              fontSize: SIZES.width > 412 ? 16 : 14,
                            }}
                            ellipsizeMode="tail"
                            numberOfLines={1}
                          >
                            {currencyFormat(item?.nft.askPrice)}
                          </MyTextApp>
                        )}
                        <MyTextApp
                          style={{ color: colors.title, ...FONTS.fontBold }}
                        >
                          {currencyFormat(item.price)}
                        </MyTextApp>
                      </View>
                    </View>
                  </View>
                  <CancelBidOrder
                    item={item?.nft}
                    bidOrder={item}
                    market={market}
                    onProcessing={() => {
                      return false;
                    }}
                    onSuccessful={() => {
                      setSuccessful(true);

                      callback();
                    }}
                    onError={() => {}}
                    serviceID={serviceID}
                  >
                    <View
                      style={{
                        width: "100%",
                        alignItems: "center",
                        backgroundColor: colors.primary,
                        borderRadius: 100,
                        // height: 40,
                        padding: 0,
                        paddingVertical: SIZES.width <= 412 ? 10 : 12,
                        marginVertical: 12,
                        justifyContent: "center",
                      }}
                    >
                      <MyTextApp style={{ ...FONTS.fontBold }}>
                        {t("common.cancel")}
                      </MyTextApp>
                    </View>
                  </CancelBidOrder>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        );
      } else {
        return <View key={key}></View>;
      }
    };
  }, [dataBid, dark]);

  return (
    <FlatList
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled={true}
      scrollEnabled={false}
      data={dataBid}
      renderItem={({ item, index }: { item: any; index: any }) => (
        <RenderItem item={item} key={index} />
      )}
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
    justifyContent: "center",
    gap: 12,
  },
  itemMarket: {},
  itemData: {},
  thumb: {},
  hagPrice: {
    flexDirection: "row",
    alignItems: "center",
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
    justifyContent: "flex-start",
    gap: 4,
    position: "absolute",
    bottom: 8,
    padding: 4,
    backgroundColor: "rgba(20, 20, 31, 0.50)",
    borderRadius: 4,
    width: "90%",
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
    alignItems: "center",
    justifyContent: "center",
  },
  pagination: {
    marginTop: 40,
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
