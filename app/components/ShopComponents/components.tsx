import {
  FONTS,
  GradientText,
  MyTextApp,
  SIZES,
  STAR,
  TITLE_COLOR_QUALITY,
} from "../../themes/theme";
import {
  ENUM_ENDPOINT_RPC,
  FILTER_NFT_TYPE_GALIX_MARKET,
  SERVICE_ID,
} from "../../common/enum";
import { Image, ImageBackground, StyleSheet, View } from "react-native";
import {
  cf_LST_PACKAGE,
  cf_LST_RARITY,
} from "../../config/filters/filters_Galix";
import {
  type Nft,
  type Transaction,
  TransactionKind,
} from "../../modules/graphql/types/generated";
import {
  TypeNFTNotSameHeroGalix,
  attributes_info,
  generalInfo,
  powerOrStar,
  qualityNFTbyColorText,
} from "./configs";
import {
  checkStarGalix,
  currencyFormat,
  formatTokenNumber,
  getAddressOwnerNFT,
  getRarerityForFlashPoint,
  getRarerityForGalixCity,
  getRarerityForMarswar,
  roundDownNumber,
  roundNumber,
} from "../../common/utilities";
import { general_display_color, getQualityNFT } from "./ultilities";
import { isArray, isEmpty } from "lodash";
import { useEffect, useState } from "react";

import { Dmetadata } from "../../modules/nft/market";
import { cf_LST_RARITY_MECHA_WARFARE } from "../../config/filters/filters_Mecha";
import OpenLinkComponent from "../OpenLinkComponent";
import { rpcExecCogiChainNotEncodeParam } from "../RpcExec/toast_chain";
import { useTranslation } from "react-i18next";

export function DetailNFTComponent({
  item,
  itemDMetadata,
  serviceID,
}: {
  item?: Nft;
  itemDMetadata?: any;
  serviceID?: any;
}): any {
  const field = powerOrStar.find((e) => e.serviceID == serviceID)?.field;
  const { t } = useTranslation();
  if (field?.valueType == "text") {
    return (
      itemDMetadata[field.key]?.value && (
        <View
          style={{
            ...styles2.itemPower,
            width: SIZES.width > 412 ? "70%" : "85%",
            // paddingHorizontal: 10,
            justifyContent: SIZES.width > 412 ? "center" : "flex-start",
          }}
        >
          <Image
            source={require("../../assets/images/images_n69/component/fire.png")}
            alt=""
            style={{
              width: 16,
              height: 16,
            }}
          />
          <MyTextApp
            style={{
              ...FONTS.fontBold,
              fontSize: SIZES.width > 412 ? 16 : 12,
              textTransform: "uppercase",
              // width: SIZES.width / 2 - 19 - 6 - 16 - 50,
              //   borderWidth: 1,
              // borderColor: "red"
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {t(`wallet.${field.key}`)}:{" "}
            {currencyFormat(itemDMetadata[field.key]?.value)}
          </MyTextApp>
        </View>
      )
    );
  } else if (field?.valueType == "icon") {
    return (
      item?.metadataNftType == FILTER_NFT_TYPE_GALIX_MARKET.HERO && (
        <View
          style={{
            ...styles2.itemPower,
            maxWidth: "85%",
            justifyContent: "center",
            paddingHorizontal: 8,
          }}
        >
          <StarComponent item={item} />
        </View>
      )
    );
  }
}

export function ColorOfItemNameComponent({
  name,
  serviceID,
  item,
  itemDMetadata,
  colors,
  isDashboard = false,
  fontSize,
}: {
  name: string;
  serviceID: SERVICE_ID;
  item?: Nft | any;
  itemDMetadata?: any;
  colors: any;
  isDashboard?: boolean;
  fontSize?: number;
}) {
  if (qualityNFTbyColorText.includes(serviceID)) {
    const quality = itemDMetadata?.quality?.value;

    return quality == "Platinum" ? (
      <View
        style={{
          // paddingTop: isDashboard ? 0 : 8,
          width: "100%",
          alignItems: "flex-start",
        }}
      >
        <GradientText
          colors={["#6888FF", "#FF77BC", "#FFB342", "#80E64E", "#1ECAF7"]}
          style={{
            ...FONTS.fontBold,
            // ...FONTS.font,
            color: "#fff",
            width: isDashboard ? 140 : undefined,
            fontSize: fontSize ?? 14,
          }}
          numberOfLines={isDashboard ? 1 : 2}
        >
          {name}
        </GradientText>
      </View>
    ) : (
      <MyTextApp
        style={{
          // ...styles2.title,
          // marginVertical: isDashboard ? undefined : 8,
          flexDirection: "row",
          justifyContent: "flex-start",
          ...FONTS.fontBold,
          color: quality ? TITLE_COLOR_QUALITY[quality] : colors.title,
          // ...FONTS.font,
          width: "100%",
          textAlign: "left",
          fontSize: fontSize ?? 14,
        }}
        numberOfLines={isDashboard ? 1 : 2}
      >
        {name}
      </MyTextApp>
    );
  } else {
    const quality =
      serviceID == SERVICE_ID._GALIXCITY
        ? getRarerityForGalixCity(item)
        : serviceID == SERVICE_ID._FLASHPOINT
          ? getRarerityForFlashPoint(item)
          : getRarerityForMarswar(itemDMetadata?.rarity?.value);

    return quality == "7-big" ? (
      <View
        style={{
          // paddingTop: isDashboard ? 0 : 8,
          width: "100%",
          alignItems: "flex-start",
        }}
      >
        <GradientText
          colors={["#6888FF", "#FF77BC", "#FFB342", "#80E64E", "#1ECAF7"]}
          style={{
            ...FONTS.fontBold,
            ...FONTS.font,
            color: "#fff",
            width: isDashboard ? 140 : undefined,
            fontSize: fontSize ?? 14,
          }}
          numberOfLines={isDashboard ? 1 : 2}
        >
          {name}
        </GradientText>
      </View>
    ) : (
      <MyTextApp
        style={{
          // ...styles2.title,
          // marginVertical: isDashboard ? undefined : 8,
          flexDirection: "row",
          justifyContent: "flex-start",
          ...FONTS.fontBold,
          color: quality ? TITLE_COLOR_QUALITY[quality] : colors.title,
          ...FONTS.font,
          width: "100%",
          textAlign: "left",
          fontSize: fontSize ?? 14,
        }}
        numberOfLines={isDashboard ? 1 : 2}
      >
        {name}
      </MyTextApp>
    );
  }
}

export function StarComponent({
  item,
  isDashboard = false,
  size,
}: {
  item: any;
  isDashboard?: boolean;
  size?: number;
}) {
  const d = Dmetadata.fromObject(item.metadata);

  const data = checkStarGalix(d?.star?.value, d?.grade?.value);

  if (data?.number > 1) {
    const list = [];
    for (let i = 1; i <= data?.number; i++) {
      list.push(
        <>
          <Image
            alt=""
            source={STAR[data.image.toLowerCase()]}
            style={{
              width: isDashboard ? 10 : size ?? 20,
              height: isDashboard ? 10 : size ?? 20,
            }}
          />
        </>,
      );
    }

    return list;
  } else {
    return (
      <Image
        alt=""
        source={STAR[data.image.toLowerCase()]}
        style={{
          width: isDashboard ? 10 : size ?? 20,
          height: isDashboard ? 10 : size ?? 20,
        }}
      />
    );
  }
}

export function GetValueGeneralInfoComponent({
  itemDMetadata,
  serviceID,
  colors,
  t,
  nft,
}: {
  itemDMetadata: any;
  serviceID: SERVICE_ID;
  colors: any;
  nft: Nft;
  t: any;
}) {
  const item = generalInfo.find((e) => e.serviceID == serviceID);

  if (!item) return <></>;

  return item.fields.map((e, i) => {
    const key = e.key;
    const value = itemDMetadata[key]?.value;
    if (!value) return null;
    if (
      key == "rarity" &&
      nft?.metadataNftType == FILTER_NFT_TYPE_GALIX_MARKET.MYSTERY_BOX
    )
      return;
    if (nft?.metadataNftType == FILTER_NFT_TYPE_GALIX_MARKET.HERO) {
      if (key == "star") {
        return (
          <View
            key={i}
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MyTextApp style={{ fontSize: 16, color: colors.title }}>
              {t(`nfts.detail.${key}`)}:{" "}
            </MyTextApp>
            <StarComponent item={nft} size={32} />
          </View>
        );
      } else if (key == "rarity") {
        const rarityList =
          serviceID == SERVICE_ID._GALIXCITY
            ? cf_LST_RARITY
            : cf_LST_RARITY_MECHA_WARFARE;
        const metadataRarity = rarityList.find((k) =>
          k.value.includes(Number(value)),
        )?.metadataRarity;

        return (
          <MyTextApp key={i} style={{ fontSize: 16, color: colors.title }}>
            {e.title}:{" "}
            <MyTextApp style={{ fontWeight: "bold", color: colors.title }}>
              {metadataRarity}
            </MyTextApp>
          </MyTextApp>
        );
      }
    } else if (nft?.metadataNftType == FILTER_NFT_TYPE_GALIX_MARKET.RESOURCE) {
      <MyTextApp key={i} style={{ fontSize: 16, color: colors.title }}>
        {e.title}:{" "}
        <MyTextApp style={{ fontWeight: "bold", color: colors.title }}>
          {
            cf_LST_PACKAGE.find((e) => e.metadataIndex == nft?.metadataIndex)
              ?.categories
          }
        </MyTextApp>
      </MyTextApp>;
    } else
      return (
        <MyTextApp key={i} style={{ fontSize: 16, color: colors.title }}>
          {e.title}:{" "}
          <MyTextApp style={{ fontWeight: "bold", color: colors.title }}>
            {key == "power" ? roundDownNumber(value, 2) : value}
          </MyTextApp>
        </MyTextApp>
      );
  });
}

export function GetDetailNFTInfoComponent({
  serviceID,
  item,
  // itemDMetadata,
  colors,
}: {
  serviceID: SERVICE_ID;
  item: any;
  // itemDMetadata?: any;
  colors: any;
}) {
  const [itemDMetadataLand, setItemDMetadataLand] = useState(null);
  const [itemDMetadata, setItemDMetadata]: [v: Dmetadata | any, setV: any] =
    useState<any>(null);

  const config: any = attributes_info.find((e) => e.serviceID == serviceID);

  useEffect(() => {
    if (item == null) return;
    setItemDMetadata(Dmetadata.fromObject(item.metadata));
  }, [item]);

  useEffect(() => {
    if (item.metadataNftType != FILTER_NFT_TYPE_GALIX_MARKET.LAND) return;
    setItemDMetadataLand(null);
    rpcExecCogiChainNotEncodeParam({
      method: "erc721_galix_land.get_landinfoid",
      params: [
        {
          landid: item.tokenId,
        },
      ],
      endpoint: ENUM_ENDPOINT_RPC._GALIXCITY,
    })
      .then((res: any) => {
        setItemDMetadataLand(res?.landinfo);
      })
      .catch(() => {
        setItemDMetadataLand(null);
      });
  }, []);

  if (config?.isType == SERVICE_ID._9DNFT) {
    if (config && itemDMetadata) {
      return config?.fields.map((el: any, index: any) => {
        if (
          !el.keys.some(
            (e: any) =>
              itemDMetadata &&
              ((!isArray(itemDMetadata[e.key]) && itemDMetadata[e.key]) ||
                (isArray(itemDMetadata[e.key]) &&
                  itemDMetadata[e.key]?.length != 0)),
          )
        )
          return;

        return (
          <View style={{ marginTop: 8 }} key={index}>
            <MyTextApp
              style={{
                ...FONTS.fontBold,
                color: colors.title,
                fontSize: SIZES.width <= 412 ? 16 : 18,
              }}
            >
              {el.title}
            </MyTextApp>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                rowGap: 4,
                columnGap: 32,
                flexWrap: "wrap",
                alignItems: "center",
                marginTop: 4,
              }}
            >
              {el.keys.map((elKey: any) => {
                return itemDMetadata[elKey.key].map((v: any, i: any) => {
                  const renderBasicAttributePet = (val: any) => {
                    return (
                      <View
                        key={i}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <MyTextApp
                          style={{
                            color:
                              typeof val.toHuman === "undefined" ||
                              val.toHuman("color") == undefined
                                ? colors.title
                                : val.toHuman("color"),
                            fontSize: SIZES.width <= 412 ? 14 : 16,
                          }}
                        >
                          {" "}
                          {val?.type}
                          {" : "}
                        </MyTextApp>
                        <MyTextApp
                          style={{
                            color: "#75A14C",
                            fontSize: SIZES.width <= 412 ? 14 : 16,
                          }}
                        >
                          {val?.final?.value}
                        </MyTextApp>

                        <MyTextApp
                          style={{
                            color: colors.title,
                            fontSize: SIZES.width <= 412 ? 14 : 16,
                          }}
                        >
                          {" ("}
                          {val?.basic?.value}
                          {")"}
                        </MyTextApp>
                      </View>
                    );
                  };

                  const renderAttr = (val: any) => {
                    return (
                      <View
                        key={i}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <MyTextApp
                          style={{
                            color:
                              typeof val.toHuman === "undefined" ||
                              val.toHuman("color") == undefined
                                ? colors.title
                                : val.toHuman("color"),
                            fontSize: SIZES.width <= 412 ? 14 : 16,
                          }}
                        >
                          {" "}
                          {val.trait_type?.replace("_", " ")}
                          {" : "}
                        </MyTextApp>
                        <MyTextApp
                          style={{
                            color: elKey.checkColorForField
                              ? general_display_color(val.value)
                              : colors.title,
                            fontSize: SIZES.width <= 412 ? 14 : 16,
                          }}
                        >
                          {typeof val.toHuman === "undefined" ||
                          !elKey?.checkToHuman
                            ? val?.value
                            : val?.toHuman("value")}
                        </MyTextApp>
                      </View>
                    );
                  };
                  const renderSkill = (val: any) => {
                    return (
                      <View
                        key={i}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <MyTextApp
                          style={{
                            color: colors.title,
                            fontSize: SIZES.width <= 412 ? 14 : 16,
                          }}
                        >
                          {" "}
                          {v?.title?.value}
                          {" : "}
                        </MyTextApp>
                        <MyTextApp
                          style={{
                            color: colors.title,
                            fontSize: SIZES.width <= 412 ? 14 : 16,
                          }}
                        >
                          {v?.value?.value}
                        </MyTextApp>
                      </View>
                    );
                  };
                  if (elKey.isSkill) {
                    return renderSkill(v);
                  } else if (elKey.isAttributePet) {
                    return renderBasicAttributePet(v);
                  } else {
                    return renderAttr(v);
                  }
                });
              })}
            </View>
          </View>
        );
      });
    } else return <></>;
  }
  if (config?.isType == SERVICE_ID._GALIXCITY) {
    const lstFields = config?.list_of_type?.filter(
      (e: any) => e.type == item.metadataNftType,
    );
    for (let i = 0; i < lstFields?.length; i++) {
      const fields = lstFields[i]?.fields;
      if (!TypeNFTNotSameHeroGalix.includes(lstFields[i]?.type)) {
        return fields.map((field: any, j: any) => {
          if (
            !field.keys.some(
              (e: any) =>
                itemDMetadata &&
                ((!isArray(itemDMetadata[e.key]) && itemDMetadata[e.key]) ||
                  (isArray(itemDMetadata[e.key]) &&
                    itemDMetadata[e.key]?.length != 0)),
            )
          )
            return;
          if (field.isSkill) {
            return (
              <View style={{ marginTop: 8 }} key={i}>
                <MyTextApp
                  style={{
                    ...FONTS.fontBold,
                    color: colors.title,
                    fontSize: SIZES.width <= 412 ? 16 : 18,
                  }}
                >
                  {field.title}
                </MyTextApp>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    rowGap: 4,
                    columnGap: 32,
                    flexWrap: "wrap",
                    alignItems: "center",
                    marginTop: 4,
                  }}
                >
                  {field.keys.map((e: any) => {
                    if (itemDMetadata && itemDMetadata[e.key]?.length > 0) {
                      return itemDMetadata[e.key]?.map((v: any, i: any) => (
                        <View
                          key={i}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <MyTextApp
                            style={{
                              color: colors.title,
                              fontSize: SIZES.width <= 412 ? 14 : 16,
                            }}
                          >
                            {v?.title}:{" "}
                            <MyTextApp
                              style={{
                                color: colors.title,
                                fontSize: SIZES.width <= 412 ? 14 : 16,
                              }}
                            >
                              {v?.value}
                            </MyTextApp>
                          </MyTextApp>
                        </View>
                      ));
                    }
                  })}
                </View>
              </View>
            );
          } else {
            return (
              <View style={{ marginTop: 8 }} key={j}>
                <MyTextApp
                  style={{
                    ...FONTS.fontBold,
                    color: colors.title,
                    fontSize: SIZES.width <= 412 ? 16 : 18,
                  }}
                >
                  {field.title}
                </MyTextApp>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    rowGap: 4,
                    columnGap: 32,
                    flexWrap: "wrap",
                    alignItems: "center",
                    marginTop: 4,
                  }}
                >
                  {field.keys.map((e: any, i: any) => {
                    if (itemDMetadata?.[e.key]?.value) {
                      return (
                        <View
                          key={i}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          {e.name && (
                            <MyTextApp
                              style={{
                                color: colors.title,
                                fontSize: SIZES.width <= 412 ? 14 : 16,
                              }}
                            >
                              {e.name}:{" "}
                            </MyTextApp>
                          )}
                          <MyTextApp
                            style={{
                              color: colors.title,
                              fontSize: SIZES.width <= 412 ? 14 : 16,
                            }}
                          >
                            {field.title == "Campaign Skill"
                              ? itemDMetadata.ability?.value
                              : roundNumber(itemDMetadata[e.key]?.value, 1)}
                          </MyTextApp>
                        </View>
                      );
                    }
                  })}
                </View>
              </View>
            );
          }
        });
      } else {
        for (const field of fields) {
          return (
            <View style={{ marginTop: 8 }}>
              <MyTextApp
                style={{
                  ...FONTS.fontBold,
                  color: colors.title,
                  fontSize: SIZES.width <= 412 ? 16 : 18,
                }}
              >
                {field.title}
              </MyTextApp>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  rowGap: 4,
                  columnGap: 32,
                  flexWrap: "wrap",
                  alignItems: "center",
                  marginTop: 4,
                }}
              >
                {field.keys.map((e: any, i: any) => {
                  if (itemDMetadata) {
                    return (
                      <View
                        key={i}
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <MyTextApp
                          style={{
                            color: colors.title,
                            fontSize: SIZES.width <= 412 ? 14 : 16,
                          }}
                        >
                          {e.name}:{" "}
                        </MyTextApp>
                        <MyTextApp
                          style={{
                            color: colors.title,
                            fontSize: SIZES.width <= 412 ? 14 : 16,
                          }}
                        >
                          {e.twoKey
                            ? itemDMetadataLand
                              ? e.isLocation
                                ? itemDMetadataLand[e.key]
                                : roundNumber(itemDMetadataLand[e.key])
                              : e.isLocation
                                ? itemDMetadata[e.key2]?.value
                                : roundNumber(itemDMetadata[e.key2]?.value)
                            : itemDMetadataLand
                              ? formatTokenNumber(itemDMetadataLand[e.key])
                              : 0}
                        </MyTextApp>
                      </View>
                    );
                  }
                })}
              </View>
            </View>
          );
        }
      }
    }
  }
}

export function SeriesContentComponent({
  serviceID,
  item,
  colors,
  t,
  lstReward,
  itemDMetadata,
}: {
  serviceID: SERVICE_ID;
  item: any;
  colors: any;
  t: any;
  lstReward: any;
  itemDMetadata: any;
}) {
  return (
    <View
      style={{
        gap: 8,
      }}
    >
      <MyTextApp
        style={{
          ...FONTS.fontBold,
          color: colors.title,
          fontSize: 18,
        }}
      >
        {/* {t("nfts.detail.series_content")} */}
        Series Contents
      </MyTextApp>
      {!isEmpty(lstReward) && (
        <View style={{ gap: 8 }}>
          {lstReward?.map((e: any, i: any) => (
            <View
              style={{
                ...styles2.rewardsInfo,
                backgroundColor: colors.card,
              }}
              key={i}
            >
              <ImageBackground
                source={getQualityNFT({
                  serviceID,
                  item,
                  itemDMetadata,
                })}
                style={{
                  width: 80,
                  height: 80,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                borderRadius={4}
              >
                <Image
                  style={{ width: 60, height: 60 }}
                  source={e.image}
                  alt=""
                />
              </ImageBackground>
              <View style={styles2.containerRewardsInfo}>
                <MyTextApp
                  style={{
                    marginBottom: 10,
                    color:
                      serviceID == SERVICE_ID._GALIXCITY
                        ? "#ff5735"
                        : TITLE_COLOR_QUALITY[e.rarity],
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                  ellipsizeMode="tail"
                  numberOfLines={2}
                >
                  {serviceID == SERVICE_ID._GALIXCITY
                    ? e?.name + " " + e?.rarity
                    : e?.name}
                </MyTextApp>
                <View style={styles2.infoContent}>
                  <MyTextApp style={{ color: colors.title }}>
                    {t("nfts.detail.probability")}
                  </MyTextApp>
                  <MyTextApp
                    style={{
                      ...FONTS.fontBold,
                      color: colors.title,
                    }}
                  >
                    {e?.ratio}
                  </MyTextApp>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      <View
        style={{
          marginTop: 12,
          gap: 12,
        }}
      >
        <View style={{ ...styles2.owner, backgroundColor: colors.card }}>
          <MyTextApp style={{ color: colors.text }}>
            {t("nfts.detail.owner")}
          </MyTextApp>
          <OpenLinkComponent
            address={getAddressOwnerNFT(item)}
            style={{
              fontWeight: "bold",
              color: colors.title,
              borderBottomColor: colors.title,
              borderBottomWidth: 1,
            }}
          >
            {getAddressOwnerNFT(item)}
          </OpenLinkComponent>
        </View>
        {item?.transactionHistory.find(
          (tx: Transaction) => tx.kind == TransactionKind.Mint,
        )?.recipient?.id && (
          <View style={{ ...styles2.owner, backgroundColor: colors.card }}>
            <MyTextApp style={{ color: colors.text }}>
              {t("nfts.detail.created")}
            </MyTextApp>
            <OpenLinkComponent
              address={
                item.transactionHistory.find(
                  (tx: Transaction) => tx.kind == TransactionKind.Mint,
                )?.recipient?.id
              }
              style={{
                fontWeight: "bold",
                color: colors.title,
                borderBottomColor: colors.title,
                borderBottomWidth: 1,
              }}
            >
              {
                item.transactionHistory.find(
                  (tx: Transaction) => tx.kind == TransactionKind.Mint,
                )?.recipient?.id
              }
            </OpenLinkComponent>
          </View>
        )}
      </View>
    </View>
  );
}

const styles2 = StyleSheet.create({
  itemPower: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    position: "absolute",
    bottom: SIZES.width > 412 ? "10%" : 8,
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
});
