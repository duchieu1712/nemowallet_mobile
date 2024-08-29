import * as AccountReducers from "../../../modules/account/reducers";
import * as MysteryBoxActions from "../../../modules/mysterybox/actions";
import * as MysteryBoxReducers from "../../../modules/mysterybox/reducers";

import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  COLORS,
  FONTS,
  GradientText,
  ICONS,
  MyTextApp,
  SIZES,
  STAR,
  TITLE_COLOR_QUALITY,
} from "../../../themes/theme";
import {
  ContractFromAddressCogiChain,
  ContractFromNamespaceAllNetwork,
  NamespaceFromAddress,
} from "../../../modules/wallet/utilities";
import {
  FILTER_NFT_TYPE_GALIX_MARKET,
  SERVICE_ID,
  STAGE_MYSTERYBOX,
} from "../../../common/enum";
import {
  cf_LST_PACKAGE,
  cf_LST_RARITY,
} from "../../../config/filters/filters_Galix";
import {
  checkStarGalix,
  currencyFormat,
  getRarerityForFlashPoint,
  getRarerityForGalixCity,
  getRarerityForMarswar,
  roundDownNumber,
  toAddress,
  toWei,
} from "../../../common/utilities";
import {
  contractCallWithToast,
  contractCallWithToastCogiChain,
} from "../../../components/RpcExec/toast";
import {
  generalInfo,
  powerOrStar,
  qualityNFTbyColorText,
} from "../../../components/ShopComponents/configs";
import {
  getMinusButton,
  getOwnerAccount,
  getPlusButton,
  getTitle,
  toIpfsGatewayUrl,
} from "../../../common/utilities_config";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigation, useTheme } from "@react-navigation/native";

import ActionModalsComponent from "../../../components/ModalComponent/ActionModalsComponent";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import { ClassWithStaticMethod } from "../../../common/static";
import DividerComponent from "../../../components/DividerComponent/DividerComponent";
import { Dmetadata } from "../../../modules/nft/market";
import FeatherIcon from "react-native-vector-icons/Feather";
import Fireworks from "react-native-fireworks";
import { type IApprove } from "../../../common/types";
import INOBuySuccessComponent from "../../../components/ModalComponent/INOBuySuccessComponent";
import { IconLoadingDataComponent } from "../../../components/LoadingComponent";
import ImageLoaderComponent from "../../../components/ImageComponent/ImageLoaderComponent";
import { type Nft } from "../../../modules/graphql/types/generated";
import Toast from "../../../components/ToastInfo";
import { cf_BOX_DATA_CONFIG } from "../../../config/mysterybox/configMysteryBox";
import { cf_LST_RARITY_MECHA_WARFARE } from "../../../config/filters/filters_Mecha";
import { getQualityNFT } from "../../../components/ShopComponents/ultilities";
import { isEmpty } from "lodash";
import { rpcExecCogiChain_Signer } from "../../../components/RpcExec/toast_chain";
import { useTranslation } from "react-i18next";

// import { generalInfo, powerOrStar, qualityNFTbyColorText } from "./config";

export function BuyMysteryBox({
  item,
  onProcessing,
  onSuccessful,
  onError,
  price,
  stage,
  balances,
  _width,
  amount,
  setAmount,
  isDisabled,
  title,
  gameServiceID,
}: {
  item?: any;
  onProcessing?: any;
  onSuccessful?: any;
  onError?: any;
  price?: any;
  stage?: any;
  balances?: any;
  _width?: any | string;
  amount?: string | any;
  setAmount?: any;
  isDisabled?: boolean;
  title?: string | any;
  gameServiceID?: any;
}): any {
  const [processing, setProcessing] = useState(false);
  const [onAction, setOnAction] = useState(false);
  const [valueDiscount, setValueDiscount] = useState<any>(0);
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [onActionSuccess, setOnActionSuccess] = useState(false);
  const boxData: any = cf_BOX_DATA_CONFIG.find(
    (e: any) => e.serviceID === gameServiceID,
  );

  const checkDiscount = (e: any) => {
    if (!isEmpty(e)) {
      setValueDiscount(parseFloat(item?.info[0]?.rateDiscount) / 100);
    } else {
      setValueDiscount(0);
    }
  };

  async function perform() {
    try {
      if (
        stage === STAGE_MYSTERYBOX.INIT_STAGE_1 ||
        stage === STAGE_MYSTERYBOX.INIT_STAGE_2
      ) {
        Toast.error("The event hasn't happened yet!");
        return;
      }
      if (stage === STAGE_MYSTERYBOX.END) {
        Toast.error("Event has ended!");
        return;
      }
      if (
        stage === STAGE_MYSTERYBOX.STAGE_1_PRIVATE ||
        stage === STAGE_MYSTERYBOX.STAGE_2_PRIVATE
      ) {
        if (parseInt(item?.info[0]?.whitelistAmount) <= 0) {
          Toast.error("Box remaining is not enough!");
          return;
        }
      }
      if (
        stage === STAGE_MYSTERYBOX.STAGE_1_PUBLIC ||
        stage === STAGE_MYSTERYBOX.STAGE_2_PUBLIC
      ) {
        if (parseInt(item?.info[0]?.amount) <= 0) {
          Toast.error("Box remaining is not enough!");
          return;
        }
      }
      onProcessing();
      setProcessing(true);
      const contract = ContractFromNamespaceAllNetwork(boxData.contract);
      const currencyContract = ContractFromNamespaceAllNetwork("nemo_coin");
      const approve: IApprove = {
        contract: currencyContract,
        owner: getOwnerAccount(),
        spender: contract.address,
        amount: toWei(price.toString()),
      };
      let method = "";
      let params: any = [];
      if (
        stage === STAGE_MYSTERYBOX.STAGE_1_PRIVATE ||
        stage === STAGE_MYSTERYBOX.STAGE_2_PRIVATE
      ) {
        method = "whitelistBuy";
        params = [toAddress(item?.address)];
      } else {
        if (item?.info[0]?.isDiscountCode && valueDiscount > 0) {
          method = "discountBuy";
          params = [toAddress(item?.address), valueDiscount];
        } else {
          method = "buy";
          params = [toAddress(item?.address)];
        }
      }
      contractCallWithToast(contract, method, params, approve)
        .then(async () => {
          onSuccessful();
          setProcessing(false);
          setOnAction(false);
          setValueDiscount(0);
          setOnActionSuccess(true);
          // Toast.success("Buy Box is success!");
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.log(`Failed buy ${item} ${e}`);
          onError(e);
          setProcessing(false);
        });
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.log(e);
      Toast.error(e.message);
      setProcessing(false);
    }
  }

  const checkEnableButton = () => {
    if (
      stage === STAGE_MYSTERYBOX.INIT_STAGE_1 ||
      stage === STAGE_MYSTERYBOX.INIT_STAGE_2
    ) {
      return false;
    }
    if (stage === STAGE_MYSTERYBOX.END) {
      return false;
    }
    if (
      stage === STAGE_MYSTERYBOX.STAGE_1_PRIVATE ||
      stage === STAGE_MYSTERYBOX.STAGE_2_PRIVATE
    ) {
      if (parseInt(item?.info[0]?.whitelistAmount) <= 0) {
        return false;
      }
    }
    if (
      stage === STAGE_MYSTERYBOX.STAGE_1_PUBLIC ||
      stage === STAGE_MYSTERYBOX.STAGE_2_PUBLIC
    ) {
      if (parseInt(item?.info[0]?.amount) <= 0) {
        return false;
      }
    }
    if (parseInt(item?.info[0]?.amount) <= 0) {
      return false;
    }
    return true;
  };

  const getImageBG = (symbol: any) => {
    return boxData?.box_bg[symbol];
  };
  const getImageBox = (symbol: any) => {
    return boxData?.image[symbol];
  };

  return (
    <>
      <ButtonComponent
        onPress={() => {
          setOnAction(true);
        }}
        style={{ width: _width }}
        disabled={!checkEnableButton()}
        title={title}
      />
      <ActionModalsComponent
        modalVisible={onAction}
        closeModal={() => {
          setOnAction(false);
        }}
        iconClose
      >
        <View
          style={{
            ...styles.modalContent,
            backgroundColor: colors.card,
          }}
        >
          <View
            style={{
              position: "relative",
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <MyTextApp
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: colors.title,
                textAlign: "center",
              }}
            >
              {t("event.confirm_payment")}
            </MyTextApp>
          </View>
          <View style={{ gap: 16, width: "100%" }}>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <ImageBackground
                source={getImageBG(item?.symbol)}
                style={{
                  borderRadius: 12,
                  width: 96,
                  height: 96,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={getImageBox(item?.symbol)}
                  style={{ width: 60, height: 60 }}
                />
              </ImageBackground>
              <View style={{ flex: 1, gap: 8 }}>
                <MyTextApp
                  style={{
                    lineHeight: 22,
                    fontSize: 20,
                    fontWeight: "bold",
                    color: boxData.color_box(item?.symbol),
                  }}
                >
                  {item?.name}
                </MyTextApp>
                <MyTextApp style={{ color: colors.title }}>
                  {getTitle(gameServiceID, item?.symbol)}
                </MyTextApp>
                <View
                  style={{
                    ...styles.inputAmount,
                    borderColor: COLORS.border,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      borderRightWidth: 1,
                      paddingHorizontal: 10,
                      borderColor: COLORS.border,
                    }}
                    disabled
                    onPress={() => setAmount(getMinusButton(amount))}
                  >
                    <FeatherIcon name="minus" color={colors.text} size={20} />
                  </TouchableOpacity>
                  <View style={{ flex: 1 }}>
                    <TextInput
                      onChangeText={setAmount}
                      value={amount}
                      style={{ color: colors.title, textAlign: "center" }}
                      editable={false}
                    />
                  </View>
                  <TouchableOpacity
                    style={{
                      borderLeftWidth: 1,
                      paddingHorizontal: 10,
                      borderColor: COLORS.border,
                    }}
                    disabled
                    onPress={() => setAmount(getPlusButton(amount))}
                  >
                    <FeatherIcon name="plus" color={colors.text} size={20} />
                  </TouchableOpacity>
                </View>
                {item?.info[0]?.isDiscountCode && (
                  <View style={{ ...styles.input, flexDirection: "row" }}>
                    <MyTextApp>Code</MyTextApp>
                    <TextInput
                      onChangeText={checkDiscount}
                      value={valueDiscount}
                    />
                  </View>
                )}
              </View>
            </View>
            <View
              style={{
                backgroundColor: colors.background,
                borderRadius: 8,
                padding: 8,
                gap: 8,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <MyTextApp style={{ color: colors.title }}>
                  {t("event.price")}
                </MyTextApp>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={ICONS.nemo}
                    style={{ width: 16, height: 16, marginRight: 4 }}
                  />
                  <MyTextApp style={{ color: colors.title }}>{price}</MyTextApp>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <MyTextApp style={{ color: colors.title }}>
                  {t("event.amount")}
                </MyTextApp>
                <MyTextApp style={{ color: colors.title }}>x{amount}</MyTextApp>
              </View>
              <DividerComponent />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <MyTextApp
                  style={{
                    color: colors.title,
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  {t("event.total")}
                </MyTextApp>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={ICONS.nemo}
                    style={{ width: 16, height: 16, marginRight: 4 }}
                  />
                  <MyTextApp style={{ color: colors.title }}>
                    {(parseInt(amount) * price * (100 - valueDiscount)) / 100}
                  </MyTextApp>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <MyTextApp
                  style={{
                    color: colors.title,
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  {t("event.balances")}
                </MyTextApp>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  {balances?.map((once: any, i: any) => (
                    <View
                      key={i}
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Image
                        source={ICONS[once?.assetData?.symbol?.toLowerCase()]}
                        style={{ width: 16, height: 16, marginRight: 4 }}
                      />
                      <MyTextApp style={{ color: COLORS.white }}>
                        {currencyFormat(
                          roundDownNumber(parseFloat(once.balance), 3),
                        )}
                      </MyTextApp>
                    </View>
                  ))}
                </View>
              </View>
            </View>
            <ButtonComponent
              title={t("event.buy_now")}
              onPress={async () => {
                await perform();
              }}
              onProcessing={processing}
            />
          </View>
        </View>
      </ActionModalsComponent>
      <ActionModalsComponent
        modalVisible={onActionSuccess}
        closeModal={() => {
          setOnActionSuccess(false);
        }}
        iconClose
        positionIconClose={{
          right: 20,
          top: 0,
        }}
      >
        <INOBuySuccessComponent item={item?.name} />
      </ActionModalsComponent>
    </>
  );
}

export function OpenMysteryBox({
  item,
  onError,
  onSuccess,
  children,
  onClose,
  serviceID,
}: {
  item: Nft;
  onSuccess: any;
  onError: any;
  children: JSX.Element | string;
  isAvailable: boolean;
  onHideDetail?: any;
  onClose?: any;
  serviceID?: any;
}): any {
  const [isOwner, setIsOwner] = useState(false);
  const [onAction, setOnAction] = useState(false);
  const [onActionRewards, setOnActionRewards] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [lstRewards, setLstRewards] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const boxData = cf_BOX_DATA_CONFIG.find((e) => e.serviceID === serviceID);

  useEffect(() => {
    setIsOwner(
      getOwnerAccount() === item?.owner.id ||
        getOwnerAccount() === item?.seller.id,
    );
  }, []);

  useEffect(() => {
    setIsOwner(
      getOwnerAccount() === item?.owner.id ||
        getOwnerAccount() === item?.seller.id,
    );
  }, [item]);

  async function perform() {
    // Claim Token
    try {
      setProcessing(true);
      const contract = ContractFromAddressCogiChain(item?.collection.id);
      contractCallWithToastCogiChain(contract, "burn", [item?.tokenId])
        .then(async () => {
          try {
            const params = {
              cid: item.metadata.id,
            };
            const namespace = NamespaceFromAddress(item?.collection.id);
            rpcExecCogiChain_Signer({
              method: `${namespace}.request_openbox`,
              params,
              endpoint: boxData?.endpoint,
            })
              .then((res: any) => {
                setLstRewards(res?.box_relay);
                setOnAction(false);
                setOnActionRewards(true);
                setProcessing(false);
                setIsVisible(true);
              })
              .catch((e) => {
                Toast.error(e.message);
                setProcessing(false);
              });
          } catch (e: any) {
            onError(e);
            Toast.error(e.message);
            setProcessing(false);
          }
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          // console.log(`Failed burn ${item} ${e}`);
          onError(e);
          setProcessing(false);
        });
    } catch (e: any) {
      Toast.error(e.message);
      setProcessing(false);
    }
  }
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <>
      {isOwner && !item?.isTradable && (
        <>
          {isVisible && (
            <>
              {!processing ? (
                <TouchableOpacity
                  onPress={() => {
                    setOnAction(true);
                  }}
                  activeOpacity={0.8}
                >
                  {children}
                </TouchableOpacity>
              ) : (
                <ActivityIndicator size="large" color={COLORS.primary} />
              )}
            </>
          )}

          <ActionModalsComponent
            modalVisible={onAction}
            closeModal={() => {
              setOnAction(false);
              if (onClose !== null) {
                onClose();
              }
            }}
            iconClose
            positionIconClose={{
              right: 20,
              top: 0,
            }}
          >
            <View
              style={{
                width: 0.9 * SIZES.width,
                backgroundColor: colors.card,
                paddingVertical: 24,
                paddingHorizontal: 16,
                borderRadius: 8,
              }}
            >
              <MyTextApp
                style={{
                  ...FONTS.fontBold,
                  fontSize: 22,
                  color: colors.title,
                  textAlign: "center",
                }}
              >
                {t("nfts.detail.open_mysterybox")}
              </MyTextApp>
              <View style={{ alignItems: "center", marginVertical: 16 }}>
                <MyTextApp style={{ color: colors.title, textAlign: "center" }}>
                  {t("nfts.detail.do_you_want_open")}
                  {" " + item.metadata.name + " #" + item.tokenId + " ?"}
                </MyTextApp>
              </View>
              <ButtonComponent
                title={t("common.confirm")}
                onPress={() => {
                  perform();
                }}
                onProcessing={processing}
              />
            </View>
          </ActionModalsComponent>

          <ActionModalsComponent
            modalVisible={onActionRewards}
            closeModal={() => {
              onSuccess();
              setOnActionRewards(false);
            }}
            iconClose
            positionIconClose={{
              right: 10,
              top: 0,
            }}
          >
            <View
              style={{
                width: "95%",
                backgroundColor: colors.card,
                paddingVertical: 24,
                paddingHorizontal: 0,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <View>
                <View style={{ width: "100%", alignItems: "center" }}>
                  <Fireworks
                    speed={3}
                    density={8}
                    colors={["#ff0", "#ff3", "#cc0", "#ff4500", "#ff6347"]}
                    iterations={10}
                    height={150}
                    width={100}
                    zIndex={2}
                    circular={true}
                  />
                </View>
                <MyTextApp
                  style={{
                    ...FONTS.fontBold,
                    fontSize: 22,
                    color: colors.title,
                    textAlign: "center",
                  }}
                >
                  {t("nfts.detail.list_rewards")}
                </MyTextApp>
                <View
                  style={{
                    alignItems: "center",
                    marginVertical: 16,
                    width: "100%",
                  }}
                >
                  {(lstRewards === null || lstRewards.length === 0) && (
                    <ActivityIndicator size={"large"} color={colors.primary} />
                  )}
                  <ScrollView
                    style={{
                      maxHeight: 500,
                      paddingHorizontal: 12,
                      width: "100%",
                    }}
                  >
                    <View
                      style={{
                        width: "100%",
                        alignItems: "center",
                        marginTop: 16,
                        flexDirection: "row",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        gap: 12,
                      }}
                    >
                      {lstRewards.map((e: any, i) => {
                        const detail = Dmetadata.fromObject(e);
                        return (
                          <View
                            style={{
                              backgroundColor: colors.background,
                              borderRadius: 8,
                              padding: 8,
                              // maxWidth: 164,
                              width: (0.95 * SIZES.width) / 2 - 20,
                              alignItems: "center",
                              gap: 8,
                            }}
                            key={i}
                          >
                            <ImageBackground
                              source={getQualityNFT({
                                serviceID,
                                item: e,
                                itemDMetadata: detail,
                              })}
                              borderRadius={8}
                              style={{
                                height: 148,
                                width: 148,
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Image
                                style={{
                                  // maxWidth: 80,
                                  // maxHeight: 80,
                                  width: "50%",
                                  height: "50%",
                                }}
                                source={{
                                  uri: e?.image,
                                }}
                              />
                            </ImageBackground>
                            <View
                              style={{
                                alignItems: "flex-start",
                                width: "100%",
                              }}
                            >
                              {/* <MyTextApp
                                style={{
                                  ...styles.title,
                                  ...FONTS.fontBold,
                                  color:
                                    TITLE_COLOR_QUALITY[detail?.quality?.value],
                                  ...FONTS.font,
                                }}
                              >
                                {detail.name}
                              </MyTextApp> */}
                              <View style={{ flexDirection: "row", gap: 5 }}>
                                <Image
                                  source={boxData?.logo}
                                  style={{ width: 20, height: 20 }}
                                />
                                <MyTextApp
                                  style={{
                                    fontSize: 16,
                                    fontWeight: "bold",
                                    color: colors.title,
                                  }}
                                >
                                  {boxData?.serviceName}
                                </MyTextApp>
                              </View>
                              <ColorOfItemName
                                colors={colors}
                                item={e}
                                itemDMetadata={detail}
                                serviceID={serviceID}
                                name={e?.name}
                              />
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </ScrollView>
                </View>
              </View>
            </View>
          </ActionModalsComponent>
        </>
      )}
    </>
  );
}

export function OpenMysteryBoxFail_9DNFT({
  item,
  // namespace,
  children,
  isAvailableOpenBoxFail,
  setIsAvailableOpenBoxFail,
  setLstRewards,
  setOnActionRewards,
  setOnActionBoxFail,
  serviceID,
}: {
  item?: any;
  namespace?: any;
  onError?: any;
  children?: JSX.Element | string;
  isAvailable?: boolean;
  onHideDetail?: any;
  onClose?: any;
  isAvailableOpenBoxFail: any;
  setIsAvailableOpenBoxFail: any;
  setLstRewards: any;
  setOnActionRewards: any;
  setOnActionBoxFail: any;
  serviceID?: any;
}): any {
  const [processing, setProcessing] = useState(false);
  const boxData = cf_BOX_DATA_CONFIG.find((e) => e.serviceID === serviceID);
  async function perform() {
    // Claim Token
    try {
      setProcessing(true);
      setIsAvailableOpenBoxFail(false);
      try {
        const params = {
          cid: item.cid,
        };
        const namespace = NamespaceFromAddress(item?.address);
        rpcExecCogiChain_Signer({
          method: `${namespace}.request_openbox`,
          params,
          endpoint: boxData?.endpoint,
        })
          .then((res: any) => {
            setLstRewards(res.box_relay);
            setOnActionRewards(true);
            setProcessing(false);
            setIsAvailableOpenBoxFail(true);
            setOnActionBoxFail(false);
          })
          .catch((e: any) => {
            Toast.error(e.message);
            setIsAvailableOpenBoxFail(true);
            setProcessing(false);
          });
      } catch (e: any) {
        Toast.error(e.message);
        setProcessing(false);
        setIsAvailableOpenBoxFail(true);
      }
    } catch (e: any) {
      Toast.error(e.message);
      setProcessing(false);
      setIsAvailableOpenBoxFail(true);
    }
  }

  return (
    <>
      {!processing ? (
        <>
          <TouchableOpacity
            disabled={!isAvailableOpenBoxFail}
            onPress={() => {
              perform();
            }}
            activeOpacity={0.8}
          >
            {children}
          </TouchableOpacity>
        </>
      ) : (
        <ActivityIndicator size="large" color={COLORS.primary} />
      )}
    </>
  );
}

// export function OpenMysteryBoxFail({
//   item,
//   // namespace,
//   children,
//   isAvailableOpenBoxFail,
//   setIsAvailableOpenBoxFail,
//   setLstRewards,
//   setOnActionRewards,
//   setOnActionBoxFail,
// }: {
//   item?: any;
//   namespace?: any;
//   onError?: any;
//   children?: JSX.Element | string;
//   isAvailable?: boolean;
//   onHideDetail?: any;
//   onClose?: any;
//   isAvailableOpenBoxFail: any;
//   setIsAvailableOpenBoxFail: any;
//   setLstRewards: any;
//   setOnActionRewards: any;
//   setOnActionBoxFail: any;
// }): any {
//   const [processing, setProcessing] = useState(false);

//   async function perform() {
//     //
//     // Claim Token
//     try {
//       setProcessing(true);
//       setIsAvailableOpenBoxFail(false);
//       try {
//         const params = {
//           cid: item.cid,
//         };
//         const namespace = NamespaceFromAddress(item?.address);
//         rpcExecCogiChain_Signer({
//           method: `${namespace}.request_openbox`,
//           params: params,
//           endpoint: ENUM_ENDPOINT_RPC._9DNFT,
//         })
//           .then((res: any) => {
//             setLstRewards(res.box_relay);
//             setOnActionRewards(true);
//             setProcessing(false);
//             setIsAvailableOpenBoxFail(true);
//             setOnActionBoxFail(false);
//           })
//           .catch((e: any) => {
//             Toast.error(e.message);
//             setIsAvailableOpenBoxFail(true);
//             setProcessing(false);
//           });
//       } catch (e: any) {
//         Toast.error(e.message);
//         setProcessing(false);
//         setIsAvailableOpenBoxFail(true);
//       }
//     } catch (e: any) {
//       Toast.error(e.message);
//       setProcessing(false);
//       setIsAvailableOpenBoxFail(true);
//     }
//   }

//   return (
//     <>
//       {!processing ? (
//         <>
//           <TouchableOpacity
//             disabled={!isAvailableOpenBoxFail}
//             onPress={() => {
//               perform();
//             }}
//             activeOpacity={0.8}
//           >
//             {children}
//           </TouchableOpacity>
//         </>
//       ) : (
//         <ActivityIndicator size="large" color={COLORS.primary} />
//       )}
//     </>
//   );
// }

export function ComponentDetailNFT({
  item,
  itemDMetadata,
  serviceID,
}: {
  item?: Nft;
  itemDMetadata?: any;
  serviceID?: any;
}): any {
  const field = powerOrStar.find((e) => e.serviceID === serviceID)?.field;
  const { t } = useTranslation();
  if (field?.valueType === "text") {
    return (
      itemDMetadata[field.key]?.value && (
        <View
          style={{
            ...styles2.itemPower,
            width: "85%",
            justifyContent: "flex-start",
          }}
        >
          <Image
            source={require("../../../assets/images/images_n69/component/fire.png")}
            alt=""
            style={{
              width: 16,
              height: 16,
            }}
          />
          <MyTextApp
            style={{
              ...FONTS.fontBold,
              fontSize: 12,
              textTransform: "uppercase",
              width: SIZES.width / 2 - 19 - 6 - 16 - 50,
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
  } else if (field?.valueType === "icon") {
    return (
      item?.metadataNftType === FILTER_NFT_TYPE_GALIX_MARKET.HERO && (
        <View
          style={{
            ...styles2.itemPower,
            maxWidth: "85%",
            justifyContent: "center",
            paddingHorizontal: 8,
          }}
        >
          <Star item={item} />
        </View>
      )
    );
  }
}

export function ColorOfItemName({
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

    return quality === "Platinum" ? (
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
      serviceID === SERVICE_ID._GALIXCITY
        ? getRarerityForGalixCity(item)
        : serviceID === SERVICE_ID._FLASHPOINT
          ? getRarerityForFlashPoint(item)
          : getRarerityForMarswar(itemDMetadata?.rarity?.value);

    return quality === "7-big" ? (
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

export function Star({
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

export function GetValueGeneralInfo({
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
  const item = generalInfo.find((e) => e.serviceID === serviceID);

  if (!item) return <></>;

  return item.fields.map((e, i) => {
    const key = e.key;
    const value = itemDMetadata[key]?.value;
    if (!value) return null;

    if (
      key === "star" &&
      nft?.metadataNftType === FILTER_NFT_TYPE_GALIX_MARKET.HERO
    ) {
      return (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
          key={i}
        >
          <MyTextApp style={{ fontSize: 16, color: colors.title }}>
            {t(`nfts.detail.${key}`)}:{" "}
          </MyTextApp>
          <Star item={nft} size={32} />
        </View>
      );
    } else if (key === "rarity") {
      const rarityList =
        serviceID === SERVICE_ID._GALIXCITY
          ? cf_LST_RARITY
          : cf_LST_RARITY_MECHA_WARFARE;
      const metadataRarity = rarityList.find((k) =>
        k.value.includes(Number(value)),
      )?.metadataRarity;

      return (
        <MyTextApp style={{ fontSize: 16, color: colors.title }} key={i}>
          {t(`nfts.detail.${key}`)}:{" "}
          <MyTextApp style={{ fontWeight: "bold", color: colors.title }}>
            {metadataRarity}
          </MyTextApp>
        </MyTextApp>
      );
    } else if (nft?.metadataNftType === FILTER_NFT_TYPE_GALIX_MARKET.RESOURCE) {
      <MyTextApp style={{ fontSize: 16, color: colors.title }} key={i}>
        {t(`nfts.detail.${key}`)}:{" "}
        <MyTextApp style={{ fontWeight: "bold", color: colors.title }}>
          {
            cf_LST_PACKAGE.find((e) => e.metadataIndex === nft?.metadataIndex)
              ?.categories
          }
        </MyTextApp>
      </MyTextApp>;
    } else {
      return (
        <MyTextApp style={{ fontSize: 16, color: colors.title }} key={i}>
          {t(`nfts.detail.${key}`)}:{" "}
          <MyTextApp style={{ fontWeight: "bold", color: colors.title }}>
            {key === "power" ? roundDownNumber(value, 2) : value}
          </MyTextApp>
        </MyTextApp>
      );
    }
  });
}

export function ViewListBoxFail({
  children,
  gameServiceID,
  refreshing,
  setRefreshing,
}: {
  children: JSX.Element | string;
  gameServiceID: any;
  refreshing: any;
  setRefreshing?: any;
}): any {
  const dispatch = useDispatch();

  const [onActionBoxFail, setOnActionBoxFail] = useState(false);
  const dataBoxsFailResponse = useSelector(
    MysteryBoxReducers.dataBoxsFailResponse,
  );
  const dataBoxsFailOnRequest = useSelector(
    MysteryBoxReducers.dataBoxsFailOnRequest,
  );
  const [onRequestBoxFail, setOnRequestBoxFail] = useState(false);
  const [assetsBoxFail, setAssetsBoxFail] = useState([]);
  // AN TODO
  const [isAvailableOpenBoxFail, setIsAvailableOpenBoxFail] = useState(true);
  // AN TODO
  const [isViewButtonFailBox, setIsViewButtonFailBox] = useState(false);
  const [clickCheckBoxFail, setClickCheckBoxFail] = useState(false);
  const [onActionRewards, setOnActionRewards] = useState(false);
  const [lstRewards, setLstRewards] = useState([]);
  const boxData: any = cf_BOX_DATA_CONFIG?.find(
    (e: any) => e.serviceID === gameServiceID,
  );
  const accountWeb = useSelector(AccountReducers.dataAccount);

  const dispatchDataBoxsFail = (gameServiceID: any, request: any) =>
    dispatch(MysteryBoxActions.getDataBoxsFail(gameServiceID, request));

  useEffect(() => {
    if (!accountWeb || !boxData) {
      setIsViewButtonFailBox(false);
      setAssetsBoxFail([]);
      return;
    }
    setIsViewButtonFailBox(false);
    setAssetsBoxFail([]);
    getDataBoxsFail();
  }, [accountWeb, boxData]);

  useEffect(() => {
    if (refreshing) {
      getDataBoxsFail();
    }
  }, [refreshing]);

  const getDataBoxsFail = () => {
    dispatchDataBoxsFail(
      gameServiceID,
      boxData?.assets.filter(
        (e: any) => e.chainID === ClassWithStaticMethod.NEMO_WALLET_CHAINID,
      ),
    );
  };

  useEffect(() => {
    setOnRequestBoxFail(dataBoxsFailOnRequest > 0);
  }, [dataBoxsFailOnRequest]);

  useEffect(() => {
    if (onRequestBoxFail || dataBoxsFailResponse === null) return;
    if (!dataBoxsFailResponse?.some((e: any) => e?.data?.length !== 0)) {
      if (clickCheckBoxFail) {
        setClickCheckBoxFail(false);
        // toast.error("You don't have Error Box")
        setIsViewButtonFailBox(false);
        setAssetsBoxFail([]);
      } else {
        setIsViewButtonFailBox(false);
        setAssetsBoxFail([]);
      }
    } else {
      if (clickCheckBoxFail) {
        setClickCheckBoxFail(false);
        setOnActionBoxFail(true);
        setAssetsBoxFail(dataBoxsFailResponse);
      }
      setIsViewButtonFailBox(true);
    }
    setRefreshing(false);
  }, [onRequestBoxFail]);

  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <>
      {isViewButtonFailBox && (
        <TouchableOpacity
          onPress={() => {
            getDataBoxsFail();
            setClickCheckBoxFail(true);
          }}
          activeOpacity={0.8}
        >
          {children}
        </TouchableOpacity>
      )}

      <ActionModalsComponent
        modalVisible={onActionRewards}
        closeModal={() => {
          setOnActionRewards(false);
          setClickCheckBoxFail(true);
          getDataBoxsFail();
        }}
        iconClose
        positionIconClose={{
          right: 10,
          top: 0,
        }}
      >
        <View
          style={{
            width: "95%",
            backgroundColor: colors.card,
            paddingVertical: 16,
            paddingHorizontal: 0,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "100%",
            }}
          >
            {/* {FIREWORK_CONFIG.map((item, index) => (
              <Firework item={item} key={`firework${index}`} />
            ))} */}
            <View style={{ width: "100%", alignItems: "center" }}>
              <Fireworks
                speed={3}
                density={8}
                colors={["#ff0", "#ff3", "#cc0", "#ff4500", "#ff6347"]}
                iterations={10}
                height={SIZES.height}
                width={SIZES.width}
                zIndex={2}
                circular={true}
              />
            </View>
          </View>
          <MyTextApp
            style={{
              ...FONTS.fontBold,
              fontSize: 22,
              color: colors.title,
              textAlign: "center",
            }}
          >
            {t("nfts.detail.list_rewards")}
          </MyTextApp>
          <View
            style={{
              alignItems: "center",
              // marginVertical: 16,
              width: "100%",
            }}
          >
            {(lstRewards === null || lstRewards.length === 0) && (
              <IconLoadingDataComponent />
            )}
            <ScrollView
              style={{ maxHeight: 500, paddingHorizontal: 12, width: "100%" }}
            >
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  marginTop: 16,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                {lstRewards.map((e: any, i) => {
                  const detail = Dmetadata.fromObject(e);
                  return (
                    <View
                      style={{
                        backgroundColor: colors.background,
                        borderRadius: 8,
                        padding: 8,
                        // maxWidth: 164,
                        width: (0.95 * SIZES.width) / 2 - 20,
                        alignItems: "center",
                        gap: 8,
                      }}
                      key={i}
                    >
                      <ImageBackground
                        source={getQualityNFT({
                          serviceID: gameServiceID,
                          item: e,
                          itemDMetadata: detail,
                        })}
                        borderRadius={8}
                        style={{
                          height: 148,
                          width: 148,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ImageLoaderComponent
                          style={{
                            maxWidth: 60,
                            maxHeight: 60,
                            width: 60,
                            height: 60,
                          }}
                          source={e?.image}
                        />
                      </ImageBackground>
                      <View
                        style={{
                          alignItems: "flex-start",
                          width: "100%",
                        }}
                      >
                        <View style={{ flexDirection: "row", gap: 5 }}>
                          <Image
                            source={boxData?.logo}
                            style={{ width: 20, height: 20 }}
                          />
                          <MyTextApp
                            style={{
                              fontSize: 16,
                              fontWeight: "bold",
                              color: colors.title,
                            }}
                          >
                            {boxData?.serviceName}
                          </MyTextApp>
                        </View>
                        <ColorOfItemName
                          colors={colors}
                          item={e}
                          itemDMetadata={detail}
                          serviceID={gameServiceID}
                          name={e?.name}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </ActionModalsComponent>

      <ActionModalsComponent
        modalVisible={onActionBoxFail}
        closeModal={() => {
          setOnActionBoxFail(false);
        }}
        iconClose
        positionIconClose={{
          right: 20,
          top: 0,
        }}
      >
        <View
          style={{
            width: SIZES.width * 0.9,
            backgroundColor: colors.card,
            paddingVertical: 24,
            paddingHorizontal: 10,
            borderRadius: 8,
          }}
        >
          <MyTextApp
            style={{
              ...FONTS.fontBold,
              fontSize: 22,
              color: colors.title,
              textAlign: "center",
            }}
          >
            {t("nfts.inventory_tab.list_error_box")}
          </MyTextApp>
          <ScrollView style={{ maxHeight: 500 }}>
            <View
              style={{
                width: "100%",
                alignItems: "center",
                marginTop: 16,
                gap: 16,
              }}
            >
              {assetsBoxFail.map((a: any) => {
                return a.data.map((e: any, i: any) => {
                  return (
                    <ItemBoxFail
                      item={e}
                      key={i}
                      namespace={a.namespace}
                      isAvailableOpenBoxFail={isAvailableOpenBoxFail}
                      setIsAvailableOpenBoxFail={setIsAvailableOpenBoxFail}
                      setLstRewards={setLstRewards}
                      setOnActionRewards={setOnActionRewards}
                      setOnActionBoxFail={setOnActionBoxFail}
                      serviceID={gameServiceID}
                    />
                  );
                });
              })}
            </View>
          </ScrollView>
        </View>
      </ActionModalsComponent>
    </>
  );
}

export function ItemBoxFail({
  item,
  namespace,
  isAvailableOpenBoxFail,
  setIsAvailableOpenBoxFail,
  setLstRewards,
  setOnActionRewards,
  setOnActionBoxFail,
  serviceID,
}: {
  item: any;
  namespace: any;
  isAvailableOpenBoxFail: any;
  setIsAvailableOpenBoxFail: any;
  setLstRewards: any;
  setOnActionRewards: any;
  setOnActionBoxFail: any;
  serviceID: any;
}): any {
  const [data, setData] = useState<any>(null);

  const { colors } = useTheme();
  const { t } = useTranslation();
  const boxData = cf_BOX_DATA_CONFIG.find((e) => e.serviceID === serviceID);

  useEffect(() => {
    fetch(toIpfsGatewayUrl("ipfs://" + item?.cid, serviceID))
      .then(async (response) => await response.json())
      .then((data) => {
        if (data !== null) {
          setData(Dmetadata.fromObject(data));
        } else {
          setData(null);
        }
      })
      .catch(() => {
        setData(null);
      });
  }, [item]);

  const navigation = useNavigation();

  const viewInfoBox = () => {
    navigation.navigate("DetailNFTScreen", {
      collectionID: item.address,
      tokenID: item.token_id,
      servicesID: serviceID,
    });
  };

  return (
    data !== null && (
      <View
        style={{
          width: "100%",
          paddingVertical: 16,
          // borderBottomColor: dark ? "rgba(52, 52, 68, 0.5)" : colors.text,
          // borderBottomWidth: 1,
          paddingHorizontal: 8,
          backgroundColor: colors.background,
          borderRadius: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 8,
          }}
        >
          <ImageLoaderComponent
            style={{ width: 120, height: 120 }}
            source={toIpfsGatewayUrl(data?.image, serviceID)}
          ></ImageLoaderComponent>
          <View style={{ flex: 1 }}>
            <MyTextApp
              style={{
                color: boxData?.color_box(namespace?.split("_")[2]),
                fontSize: 22,
                fontWeight: "bold",
              }}
              onPress={viewInfoBox}
            >
              {data?.name}
            </MyTextApp>
            <MyTextApp
              style={{
                color: colors.text,
                fontSize: 16,
              }}
            >
              #{item?.token_id}
            </MyTextApp>
          </View>
        </View>
        <OpenMysteryBoxFail_9DNFT
          item={item}
          namespace={namespace}
          isAvailableOpenBoxFail={isAvailableOpenBoxFail}
          setIsAvailableOpenBoxFail={setIsAvailableOpenBoxFail}
          setLstRewards={setLstRewards}
          setOnActionRewards={setOnActionRewards}
          setOnActionBoxFail={setOnActionBoxFail}
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
            <MyTextApp
              style={{
                fontSize: 16,
                fontWeight: "700",
                textAlign: "center",
              }}
            >
              {t("nfts.detail.open_box")}
            </MyTextApp>
          </View>
        </OpenMysteryBoxFail_9DNFT>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  title: {
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#00000081",
    padding: 30,
  },
  modalContent: {
    margin: 20,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    gap: 24,
  },
  input: {
    height: 42,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.divider,
    width: "100%",
    paddingHorizontal: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  closeBtn: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  stepLabel: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
    color: COLORS.descriptionText,
  },
  stepLabelSelected: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
    color: COLORS.primary,
  },
  inputAmount: {
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 38,
    width: "100%",
  },
});

const styles2 = StyleSheet.create({
  itemPower: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
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
});
