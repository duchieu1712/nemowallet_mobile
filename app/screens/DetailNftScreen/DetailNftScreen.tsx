import * as NFTActions from "../../modules/nft/actions";
import * as NFTReducers from "../../modules/nft/reducers";

import {
  AcceptBidOrder,
  BuyNFT,
  CancelAskOrder,
  CancelBidOrder,
  CreateAskOrder,
  CreateOrUpdateBidOrder,
  SendNftOPS,
  UpdateAskOrder,
  ValidateOPS,
} from "../../components/MarketComponent";
import {
  type AskOrder,
  type BidOrder,
  type Nft,
  type Transaction,
} from "../../modules/graphql/types/generated";
import { COLORS, FONTS, ICONS, MyTextApp, SIZES } from "../../themes/theme";
import {
  ColorOfItemNameComponent,
  GetDetailNFTInfoComponent,
  GetValueGeneralInfoComponent,
  SeriesContentComponent,
} from "../../components/ShopComponents/components";
import { FILTER_NFT_TYPE_GALIX_MARKET, SERVICE_ID } from "../../common/enum";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  LINK_P2P,
  MARKET_OFFER_ENABLED,
  ZERO_ADDRESS,
} from "../../common/constants";
import OpenLinkComponent, { onShare } from "../../components/OpenLinkComponent";
import React, { useCallback, useEffect, useState } from "react";
import {
  currencyFormat,
  ellipseAddress,
  roundDownNumber,
  timestampToHuman,
} from "../../common/utilities";
import { useDispatch, useSelector } from "react-redux";
import { useRoute, useTheme } from "@react-navigation/native";

import AntDesignIcon from "react-native-vector-icons/AntDesign";
import { Dmetadata } from "../../modules/nft/market";
import FeatherIcon from "react-native-vector-icons/Feather";
import { type GetData } from "../../modules/nft/types";
import { IconLoadingDataComponent } from "../../components/LoadingComponent";
import ImageLoaderComponent from "../../components/ImageComponent/ImageLoaderComponent";
import { OpenMysteryBox } from "../EventScreen/Component/component";
import ScrollViewToTop from "../../components/ScrollToTopComponent";
import { getQualityNFT } from "../../components/ShopComponents/ultilities";
import cf_market from "../../config/market";
import { seriesContentRewards } from "../../components/ShopComponents/configs";
import { cf_services } from "../../config/services";
import { useTranslation } from "react-i18next";
import {
  collectionSlugFromAddress,
  collectionsAddressFromSlugs,
  toIpfsGatewayUrl,
} from "../../common/utilities_config";

export default function DetailNFTScreen(props: any) {
  const route = useRoute();
  const { collectionID, tokenID, servicesID }: any = route.params;
  const collection = collectionSlugFromAddress(collectionID);
  const { colors, dark } = useTheme();
  const { t } = useTranslation();

  const [_item, _setItem] = useState<any>(null);
  const [itemDMetadata, setItemDMetadata]: [v: Dmetadata | any, setV: any] =
    useState<any>(null);
  const [lstReward, setLstReward] = useState<any>([]);
  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch();
  const dispatchGetData = (request: GetData) =>
    dispatch(
      NFTActions.getData({
        ...request,
        serviceID: servicesID?.toString(),
      }),
    );
  const dispatchResetDataResponse = () =>
    dispatch(NFTActions.resetDataResponse());

  const dataResponse: Nft = useSelector(NFTReducers.dataResponse);

  const imageItem = toIpfsGatewayUrl(_item?.metadata?.image, servicesID);

  const cleanup = () => {
    _setItem(null);
  };

  const loadData = () => {
    const address = collectionsAddressFromSlugs(
      [collection as string],
      servicesID?.toString(),
    );

    dispatchGetData({
      collection: address[0],
      tokenId: tokenID as string,
    });
  };

  const reload = () => {
    dispatchResetDataResponse();
    cleanup();
    loadData();
  };

  useEffect(() => {
    reload();
  }, []);

  useEffect(() => {
    if (dataResponse == null) return;
    _setItem(dataResponse);
    setRefreshing(false);
    setItemDMetadata(Dmetadata.fromObject(dataResponse.metadata));
  }, [dataResponse]);

  useEffect(() => {
    if (!collection) return;
    // reward
    const rewardsContent = seriesContentRewards.find(
      (e) => e.serviceID === servicesID,
    );
    if (!rewardsContent) return;
    if (rewardsContent.boxs.includes(collection.toLowerCase())) {
      const rew = rewardsContent.rew.find(
        (e) => e.symbol.toLowerCase() === collection.toString().toLowerCase(),
      );
      if (rew) {
        setLstReward(rew.reward);
      } else {
        setLstReward([]);
      }
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  useEffect(() => {
    refreshing && reload();
  }, [refreshing]);

  const urlDetails = () => {
    return (
      LINK_P2P +
      "marketplace/" +
      collectionSlugFromAddress(collectionID) +
      "/" +
      tokenID +
      `/?serviceID=${servicesID}`
    );
  };

  return (
    <View
      style={{
        backgroundColor: colors.background,
        gap: 8,
        flex: 1,
      }}
    >
      <View
        style={{
          ...styles.topHeader,
          height: 48,
          paddingLeft: 16,
        }}
      >
        <View style={styles.leftHeaderBack}>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <FeatherIcon name="arrow-left" size={24} color={colors.title} />
          </TouchableOpacity>
          <MyTextApp style={{ ...styles.titleHeaderleft, color: colors.title }}>
            {t("nfts.detail_nft")}
          </MyTextApp>
        </View>
        <TouchableOpacity
          style={{
            ...styles.rightHeader,
            width: 60,
            height: 60,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: dark ? "#1F222A" : "#fff",
            borderRadius: 30,
            bottom: 6,
            left: 5,
          }}
          activeOpacity={0.8}
          onPress={async () => {
            await onShare(urlDetails());
            return null;
          }}
        >
          <View
            style={{
              position: "absolute",
              width: 14,
              height: 14,
              zIndex: 1,
              backgroundColor: dark ? "#1F222A" : "#fff",
              left: -9,
              top: 12,
            }}
          >
            <View
              style={{
                position: "absolute",
                width: 28,
                height: 28,
                zIndex: 1,
                backgroundColor: colors.background,
                top: 0,
                borderRadius: 14,
                left: -19,
              }}
            ></View>
          </View>
          <AntDesignIcon name="sharealt" size={24} color={colors.title} />
        </TouchableOpacity>
      </View>
      <ScrollViewToTop
        style={{
          ...styles.wrapper,
          backgroundColor: colors.background,
        }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        bottomIcon={50}
      >
        <View style={{ ...styles.container }}></View>
        {_item === null ? (
          <View
            style={{
              marginTop: 32,
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1, alignItems: "center", height: 64 }}>
              <IconLoadingDataComponent />
            </View>
          </View>
        ) : (
          <View
            style={{
              ...styles.content,
              backgroundColor: colors.background,
              alignItems: SIZES.width > 412 ? "center" : undefined,
              // flex: 1
            }}
          >
            <View
              style={{
                backgroundColor: dark ? "#252731" : colors.card,
                borderRadius: 12,
                paddingHorizontal: 13,
                paddingVertical: 16,
                gap: 10,
                maxWidth: 360,
              }}
            >
              <ImageBackground
                source={getQualityNFT({
                  serviceID: servicesID,
                  item: _item,
                  itemDMetadata,
                })}
                alt=""
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  // width: SIZES.width - 40 - 30,
                  height: SIZES.width <= 412 ? SIZES.width - 40 - 30 : 330,
                  maxWidth: 325,
                  // borderWidth: 1,
                  // borderColor: "red"
                }}
                borderRadius={8}
              >
                <View
                  style={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    backgroundColor: "rgba(20, 20, 31, 0.50)",
                    borderRadius: 8,
                    padding: 8,
                  }}
                >
                  <MyTextApp style={{ fontSize: 16, fontWeight: "bold" }}>
                    #{tokenID}
                  </MyTextApp>
                </View>
                <ImageLoaderComponent
                  source={imageItem}
                  alt=""
                  style={{
                    width: 120,
                    height: 120,
                  }}
                />
              </ImageBackground>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                <Image
                  source={
                    cf_services.find((e) => e.serviceID == servicesID)?.logoGame
                  }
                  style={{ width: 32, height: 32, borderRadius: 6 }}
                />
                <MyTextApp
                  style={{
                    color: colors.title,
                    fontSize: 18,
                    ...FONTS.fontBold,
                  }}
                >
                  {
                    cf_services.find((e) => e.serviceID == servicesID)
                      ?.serviceName
                  }
                </MyTextApp>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  // marginTop: 0,
                  columnGap: 32,
                  rowGap: 8,
                  alignItems: "center",
                }}
              >
                <GetValueGeneralInfoComponent
                  nft={_item}
                  itemDMetadata={itemDMetadata}
                  t={t}
                  colors={colors}
                  serviceID={servicesID}
                />
              </View>
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.text,
                  width: "100%",
                  marginVertical: 8,
                }}
              ></View>
              <View
                style={{
                  alignItems: "flex-start",
                  width: "100%",
                  marginTop: 8,
                  gap: 8,
                }}
              >
                <MyTextApp
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: colors.title,
                  }}
                >
                  {/* {t("nfts.detail.contract_address")} */}
                  Contract Address
                </MyTextApp>
                <OpenLinkComponent
                  address={collectionID}
                  style={{
                    color: colors.title,
                    borderBottomWidth: 1,
                    borderBottomColor: "#343444",
                  }}
                >
                  {collectionID}
                </OpenLinkComponent>
                <View style={{ width: "100%", marginTop: 16 }}>
                  {seriesContentRewards
                    .find((e) => e.serviceID === servicesID)
                    ?.boxs.includes(collection.toLowerCase()) && (
                    <OpenMysteryBox
                      item={_item}
                      onError={() => {
                        return false;
                      }}
                      onSuccess={() => {
                        reload();
                      }}
                      isAvailable={true}
                      onHideDetail={() => {
                        return false;
                      }}
                      onClose={() => {
                        return false;
                      }}
                      serviceID={servicesID}
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
                        <MyTextApp
                          style={{
                            fontSize: 16,
                            fontWeight: "700",
                            textAlign: "center",
                          }}
                        >
                          {/* {t("nfts.detail.open_box")} */}
                          Open Box
                        </MyTextApp>
                      </View>
                    </OpenMysteryBox>
                  )}
                </View>
              </View>
            </View>
            <View
              style={{
                width: "100%",
              }}
            >
              <View
                style={{
                  marginBottom: 16,
                }}
              >
                <ColorOfItemNameComponent
                  name={_item?.metadata.name}
                  serviceID={servicesID}
                  item={_item}
                  itemDMetadata={itemDMetadata}
                  colors={colors}
                  fontSize={SIZES.width <= 412 ? 18 : 22}
                />
              </View>
              {collectionSlugFromAddress(_item.collection.id) &&
                itemDMetadata?.description !== null &&
                itemDMetadata?.description?.length > 0 && (
                  <>
                    <MyTextApp
                      style={{
                        ...FONTS.fontBold,
                        color: colors.title,
                        fontSize: SIZES.width <= 412 ? 14 : 16,
                      }}
                    >
                      Description:{" \n"}
                      {itemDMetadata?.description
                        ?.split("\\n")
                        .map((v: string, i: any) => {
                          return (
                            <MyTextApp
                              style={{ fontWeight: "400", color: colors.title }}
                              key={i}
                            >
                              {v}
                              {"\n"}
                            </MyTextApp>
                          );
                        })}
                    </MyTextApp>
                    <View
                      style={{
                        height: 1,
                        width: "100%",
                        backgroundColor: "#343444",
                        marginTop: -8,
                      }}
                    ></View>
                  </>
                )}

              <GetDetailNFTInfoComponent
                serviceID={servicesID}
                item={_item}
                // itemDMetadata={itemDMetadata}
                colors={colors}
              />
            </View>
            {_item.metadataNftType ===
              FILTER_NFT_TYPE_GALIX_MARKET.MYSTERY_BOX && (
              <SeriesContentComponent
                serviceID={servicesID}
                item={_item}
                colors={colors}
                t={t}
                lstReward={lstReward}
                itemDMetadata={itemDMetadata}
              />
            )}
            {_item.isTradable === false ? (
              <View
                style={{
                  // marginTop: 12,
                  ...styles.owner,
                  backgroundColor: colors.card,
                  alignItems: "center",
                }}
              >
                <MyTextApp
                  style={{
                    fontSize: 16,
                    ...FONTS.fontBold,
                    color: dark ? COLORS.descriptionText : colors.text,
                  }}
                >
                  {t("nfts.detail.trade_marketplace")}
                </MyTextApp>
                <MyTextApp style={{ color: colors.title }}>
                  {t("nfts.detail.no_listing")}
                </MyTextApp>
              </View>
            ) : (
              _item.asks.map((ask: AskOrder, i: any) => (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: 18,
                      borderTopColor: dark ? "#343444" : colors.text,
                      borderTopWidth: 1,
                      width: "100%",
                    }}
                  >
                    <MyTextApp
                      style={{
                        fontSize: 16,
                        ...FONTS.fontBold,
                        color: dark ? COLORS.descriptionText : colors.text,
                      }}
                    >
                      {t("nfts.detail.trade_marketplace")}
                    </MyTextApp>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Image
                        source={ICONS.nemo}
                        style={{ width: 24, height: 24 }}
                      />
                      <MyTextApp
                        style={{
                          fontSize: 22,
                          ...FONTS.fontBold,
                          color: colors.title,
                        }}
                      >
                        {currencyFormat(roundDownNumber(ask.price, 3))}
                      </MyTextApp>
                    </View>
                  </View>
                </>
              ))
            )}
            {servicesID != SERVICE_ID._OPS_ALPHA && MARKET_OFFER_ENABLED && (
              <View style={{ gap: 16, width: "100%" }}>
                <BuyNFT
                  item={_item}
                  market={cf_market}
                  onProcessing={() => {
                    return false;
                  }}
                  onSuccessful={() => {
                    reload();
                  }}
                  onError={() => {
                    return false;
                  }}
                  serviceID={servicesID}
                  style={{}}
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
                      {t("wallet.buy")}
                    </MyTextApp>
                  </View>
                </BuyNFT>

                <CreateOrUpdateBidOrder
                  item={_item}
                  market={cf_market}
                  onProcessing={() => {
                    return false;
                  }}
                  onSuccessful={() => {
                    reload();
                  }}
                  onError={() => {
                    return false;
                  }}
                  serviceID={servicesID}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      borderRadius: 32,
                      width: "100%",
                      backgroundColor: dark ? "transparent" : colors.primary,
                      paddingVertical: 12,
                      borderWidth: 1,
                      borderColor: dark ? "#fff" : colors.primary,
                    }}
                  >
                    <MyTextApp style={{ fontSize: 16, fontWeight: "700" }}>
                      {t("nfts.detail.make_offer")}
                    </MyTextApp>
                  </View>
                </CreateOrUpdateBidOrder>
              </View>
            )}
            {servicesID != SERVICE_ID._OPS_ALPHA && (
              <View style={{ gap: 16, width: "100%" }}>
                <CreateAskOrder
                  item={_item}
                  market={cf_market}
                  onProcessing={() => {
                    return false;
                  }}
                  onSuccessful={() => {
                    return false;
                  }}
                  onError={() => {
                    return false;
                  }}
                  isAvailable={true}
                  onHideDetail={() => {
                    return false;
                  }}
                  onClose={() => {
                    return false;
                  }}
                  serviceID={servicesID}
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
                      {t("wallet.sell")}
                    </MyTextApp>
                  </View>
                </CreateAskOrder>

                <CancelAskOrder
                  item={_item}
                  market={cf_market}
                  onProcessing={() => {
                    return false;
                  }}
                  onSuccessful={() => {
                    reload();
                  }}
                  onError={() => {
                    return false;
                  }}
                  serviceID={servicesID}
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
                      {t("nfts.detail.btn_cancel_listing")}
                    </MyTextApp>
                  </View>
                </CancelAskOrder>

                <UpdateAskOrder
                  item={_item}
                  market={cf_market}
                  onProcessing={() => {
                    return false;
                  }}
                  onSuccessful={() => {
                    reload();
                  }}
                  onError={() => {
                    return false;
                  }}
                  serviceID={servicesID}
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
                      {t("wallet.edit_price")}
                    </MyTextApp>
                  </View>
                </UpdateAskOrder>
              </View>
            )}

            {servicesID == SERVICE_ID._OPS_ALPHA && (
              <View style={{ gap: 16, width: "100%" }}>
                <SendNftOPS
                  item={_item}
                  isAvailable={true}
                  onProcessing={() => {
                    return false;
                  }}
                  onSuccessful={() => {
                    reload();
                  }}
                  onError={() => {
                    return false;
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
                  item={_item}
                  isAvailable={true}
                  onProcessing={() => {
                    return false;
                  }}
                  onSuccessful={() => {
                    reload();
                  }}
                  onError={() => {
                    return false;
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

            {MARKET_OFFER_ENABLED && _item && _item.bids.length > 0 && (
              <View
                style={{
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: dark ? "#343444" : colors.text,
                  width: "100%",
                }}
              >
                <MyTextApp
                  style={{
                    ...FONTS.fontBold,
                    color: colors.title,
                    fontSize: 18,
                  }}
                >
                  {t("nfts.detail.offer")}
                </MyTextApp>

                <ScrollView
                  style={{ marginTop: 12, maxHeight: 280 }}
                  nestedScrollEnabled
                >
                  {_item.bids.map((bid: BidOrder, i: any) => (
                    <View
                      key={i}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        columnGap: 24,
                        paddingVertical: 8,
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderTopColor: dark
                          ? "rgba(52, 52, 68, 0.5)"
                          : colors.text,
                        borderBottomColor: dark
                          ? "rgba(52, 52, 68, 0.5)"
                          : colors.text,
                      }}
                    >
                      <View style={{ gap: 12 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <OpenLinkComponent
                            address={bid.buyer.id}
                            style={{
                              borderBottomColor: dark ? "#343444" : colors.text,
                              borderBottomWidth: 1,
                              color: colors.title,
                            }}
                          >
                            {ellipseAddress(bid.buyer.id)}
                          </OpenLinkComponent>
                          <MyTextApp
                            style={{
                              color: dark ? "#8A8AA0" : colors.text,
                            }}
                          >
                            {t("nfts.detail.place_a_bid")}
                          </MyTextApp>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Image
                            source={ICONS.nemo}
                            style={{ width: 16, height: 16 }}
                          />
                          <MyTextApp
                            style={{ color: colors.title, fontWeight: "bold" }}
                          >
                            {currencyFormat(roundDownNumber(bid.price, 3))}
                          </MyTextApp>
                        </View>
                      </View>
                      <View style={{ gap: 8 }}>
                        <CancelBidOrder
                          item={_item}
                          bidOrder={bid}
                          market={cf_market}
                          onProcessing={() => {
                            return false;
                          }}
                          onSuccessful={() => {
                            reload();
                          }}
                          onError={() => {
                            return false;
                          }}
                          serviceID={servicesID}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 4,
                              borderRadius: 32,
                              width: 80,
                              paddingVertical: 6,
                              backgroundColor: colors.primary,
                            }}
                          >
                            <MyTextApp
                              style={{ fontSize: 16, fontWeight: "700" }}
                            >
                              {t("nfts.detail.cancel")}
                            </MyTextApp>
                          </View>
                        </CancelBidOrder>
                        <AcceptBidOrder
                          item={_item}
                          bidOrder={bid}
                          market={cf_market}
                          onProcessing={() => {
                            return false;
                          }}
                          onSuccessful={() => {
                            reload();
                          }}
                          onError={() => {
                            return false;
                          }}
                          serviceID={servicesID}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 4,
                              borderRadius: 32,
                              width: 80,
                              paddingVertical: 6,
                              backgroundColor: colors.primary,
                            }}
                          >
                            <MyTextApp
                              style={{ fontSize: 16, fontWeight: "700" }}
                            >
                              {t("nfts.detail.accept")}
                            </MyTextApp>
                          </View>
                        </AcceptBidOrder>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
            <View
              style={{
                gap: 16,
                width: "100%",
              }}
            >
              <MyTextApp
                style={{
                  ...FONTS.fontBold,
                  color: colors.title,
                  fontSize: 18,
                }}
              >
                {t("nfts.detail.tx_history")}
              </MyTextApp>

              <View style={styles.table}>
                <View style={{ ...styles.tableRow, borderTopColor: "#343444" }}>
                  <View style={styles.column_1}>
                    <MyTextApp
                      style={{ ...styles.textTableHeader, color: colors.title }}
                    >
                      {t("nfts.detail.date")}
                    </MyTextApp>
                  </View>
                  <View style={styles.column_2}>
                    <MyTextApp
                      style={{ ...styles.textTableHeader, color: colors.title }}
                    >
                      {t("nfts.detail.event")}
                    </MyTextApp>
                  </View>
                  <View style={styles.column_3}>
                    <MyTextApp
                      style={{ ...styles.textTableHeader, color: colors.title }}
                    >
                      {t("nfts.detail.from")}
                    </MyTextApp>
                  </View>
                  <View style={styles.column_4}>
                    <MyTextApp
                      style={{ ...styles.textTableHeader, color: colors.title }}
                    >
                      {t("nfts.detail.to")}
                    </MyTextApp>
                  </View>
                  <View style={styles.column_5}>
                    <MyTextApp
                      style={{ ...styles.textTableHeader, color: colors.title }}
                    >
                      {t("nfts.detail.price")}
                    </MyTextApp>
                  </View>
                </View>
                <ScrollView>
                  {_item.transactionHistory.map((tx: Transaction, i: any) => (
                    <View
                      style={{
                        ...styles.tableRow,
                        borderTopColor: "rgba(52, 52, 68, 0.5)",
                      }}
                      key={i}
                    >
                      <View style={styles.column_1}>
                        <MyTextApp style={{ color: colors.title }}>
                          {timestampToHuman(tx.timestamp)}
                        </MyTextApp>
                      </View>
                      <View
                        style={{
                          ...styles.column_2,
                        }}
                      >
                        <View
                          style={{
                            width: SIZES.width < 412 ? "110%" : "100%",
                            padding: 4,
                            borderRadius: 4,
                            backgroundColor: dark
                              ? "rgba(65, 65, 83, 0.50)"
                              : "#fff",
                            marginLeft: SIZES.width < 412 ? -12 : 0,
                            alignItems: "center",
                          }}
                        >
                          <MyTextApp
                            style={{
                              ...FONTS.fontBold,
                              color: dark ? COLORS.white : colors.title,
                            }}
                            numberOfLines={2}
                          >
                            {tx.kind}
                          </MyTextApp>
                        </View>
                      </View>
                      <View style={styles.column_3}>
                        {tx.sender.id !== ZERO_ADDRESS && (
                          <OpenLinkComponent
                            address={tx.sender.id}
                            style={{ color: colors.title }}
                          >
                            {ellipseAddress(tx.sender.id)}
                          </OpenLinkComponent>
                        )}
                      </View>
                      <View style={styles.column_4}>
                        {tx.recipient.id !== ZERO_ADDRESS && (
                          <OpenLinkComponent
                            address={tx.recipient.id}
                            style={{ color: colors.title }}
                          >
                            {ellipseAddress(tx.recipient.id)}
                          </OpenLinkComponent>
                        )}
                      </View>
                      <View style={styles.column_5}>
                        {tx.price > 0 && (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              columnGap: 2,
                            }}
                          >
                            <Image
                              source={ICONS.nemo}
                              alt=""
                              style={{ width: 16, height: 16 }}
                            />
                            <MyTextApp
                              style={{ color: colors.title }}
                              ellipsizeMode="tail"
                              numberOfLines={1}
                            >
                              {currencyFormat(roundDownNumber(tx.price, 3))}
                            </MyTextApp>
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
        )}
      </ScrollViewToTop>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {},
  container: {
    flex: 1,
    paddingLeft: 16,
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftHeaderBack: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    columnGap: 10,
  },
  titleHeaderleft: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
  },

  //
  rightHeader: {
    width: 60,
    height: 60,
    borderRadius: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    bottom: 5,
  },
  content: {
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 100,
  },
  title: {},
  rewardsInfo: {
    flexDirection: "row",
    gap: 16,
    padding: 12,
    borderRadius: 12,
  },
  containerRewardsInfo: {
    justifyContent: "space-evenly",
    width: SIZES.width - 40 - 16 - 80 - 24,
  },
  infoContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  owner: {
    borderRadius: 12,
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 10,
    gap: 4,
  },
  table: {
    width: SIZES.width - 16,
    marginLeft: -10,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  textTableHeader: {},
  column_1: {
    width: "20%",
    alignItems: "center",
  },
  column_2: {
    width: "15%",
    alignItems: "center",
  },
  column_3: {
    width: "20%",
    alignItems: "center",
  },
  column_4: {
    width: "20%",
    alignItems: "center",
  },
  column_5: {
    width: "25%",
    alignItems: "center",
  },
});
