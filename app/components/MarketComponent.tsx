import * as AccountReducers from "../modules/account/reducers";

import { type BidOrder, type Nft } from "../modules/graphql/types/generated";
import {
  COLORS,
  FONTS,
  ICONS,
  IMAGES,
  MyTextApp,
  SIZES,
} from "../themes/theme";
import {
  ContractFromAddressAllNetwork,
  ContractFromAddressCogiChain,
  ContractFromNamespaceAllNetwork,
} from "../modules/wallet/utilities";
import { type IApprove, type IMarket } from "../common/types";
import {
  IconLoadingDataComponent,
  IconProcessingButton,
} from "./LoadingComponent";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  type ViewStyle,
} from "react-native";
import {
  checkIsNumber,
  descyptNEMOWallet,
  getMaximumPriceFormat,
  isLessMaximumPrice,
  toAddress,
  toWei,
} from "../common/utilities";
import {
  collectionFromAddress,
  getContractNamespace,
  getMarketCurrencyNamespace,
  getOwnerAccount,
} from "../common/utilities_config";
import {
  contractCallWithToast,
  contractCallWithToastCogiChain,
} from "./RpcExec/toast";
import { useEffect, useState } from "react";
import { useNavigation, useTheme } from "@react-navigation/native";

import ActionModalsComponent from "./ModalComponent/ActionModalsComponent";
import ButtonComponent from "./ButtonComponent/ButtonComponent";
import { ClassWithStaticMethod } from "../common/static";
import InputComponent from "./InputComponent";
import Toast from "./ToastInfo";
import { isAddress } from "@ethersproject/address";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import NfcManager, { NfcEvents, NfcTech } from "react-native-nfc-manager";
import {
  contractCogiChain_call_Get_Not_Login,
  decodeFunctionResult,
} from "./RpcExec/toast_chain";
import { PRIVATE_CREATE_WALLET_SIGNER } from "../modules/nfc/utils";
import { OPSSigner, createWalletSigner } from "../modules/nfc/signer";
import { DEFAULT_CHAINID } from "../common/constants";
import { isEmpty } from "lodash";

export function CancelAskOrder({
  item,
  market,
  onProcessing,
  onSuccessful,
  onError,
  children,
  serviceID,
}: {
  item: Nft;
  market: IMarket;
  onProcessing: any;
  onSuccessful: any;
  onError: any;
  children: JSX.Element | string;
  serviceID: any;
}): any {
  const [isOwner, setIsOwner] = useState(false);

  const [state, setState] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [onAction, setOnAction] = useState(false);
  const accountWeb = useSelector(AccountReducers.dataAccount);

  const onCleanup = () => {
    setState(null);
  };

  useEffect(() => {
    setIsOwner(
      getOwnerAccount() == item?.owner.id ||
        getOwnerAccount() == item?.seller.id,
    );

    return () => {
      onCleanup();
    };
  }, []);

  useEffect(() => {
    setIsOwner(
      getOwnerAccount() == item?.owner.id ||
        getOwnerAccount() == item?.seller.id,
    );
  }, [item, accountWeb]);

  useEffect(() => {
    if (state == null) return;
    async function perform(item: Nft) {
      onProcessing();
      const contract = ContractFromNamespaceAllNetwork(
        getContractNamespace(market, serviceID),
      );
      await contractCallWithToast(contract, "cancelAskOrder", [
        toAddress(item?.collection.id),
        item?.tokenId,
      ])
        .then(async () => {
          onSuccessful();
          setProcessing(false);
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          // console.log(`Failed cancelSell ${item} ${e}`);
          onError(e);
          setProcessing(false);
        });
    }

    setProcessing(true);
    perform(state);
    setState(null);
  }, [state]);

  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <>
      {isOwner && item?.isTradable && (
        <>
          {processing ? (
            <View
              style={{
                width: "100%",
                alignItems: "center",
                backgroundColor: colors.primary,
                borderRadius: 32,
                height: 40,
                padding: 0,
                justifyContent: "center",
              }}
            >
              <IconProcessingButton />
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setOnAction(true);
              }}
            >
              {children}
            </TouchableOpacity>
          )}
        </>
      )}

      <ActionModalsComponent
        modalVisible={onAction}
        closeModal={() => {
          setOnAction(false);
        }}
        iconClose
        positionIconClose={{
          top: 0,
          right: 20,
        }}
      >
        <View
          style={{
            width: "90%",
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
            {t("nfts.detail.cancel_listing")}
          </MyTextApp>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginVertical: 16,
            }}
          >
            <MyTextApp style={{ color: colors.title, textAlign: "center" }}>
              {t("nfts.detail.do_you_cancel_listing")}
              {" " + item.metadata.name + " #" + item.tokenId + " ?"}
            </MyTextApp>
          </View>
          <View>
            <ButtonComponent
              title={t("common.confirm")}
              onPress={() => {
                setState(item);
              }}
              onProcessing={processing}
            />
          </View>
        </View>
      </ActionModalsComponent>
    </>
  );
}

export function UpdateAskOrder({
  item,
  market,
  onProcessing,
  onSuccessful,
  onError,
  children,
  serviceID,
}: {
  item: Nft;
  market: IMarket;
  onProcessing: any;
  onSuccessful: any;
  onError: any;
  children: JSX.Element | string;
  serviceID: any;
}): any {
  const [isOwner, setIsOwner] = useState(false);

  const [state, setState] = useState<any>([null, null]);
  const [onAction, setOnAction] = useState(false);
  const [processing, setProcessing] = useState(false);
  const accountWeb = useSelector(AccountReducers.dataAccount);

  const onCleanup = () => {
    setState(null);
  };

  useEffect(() => {
    setIsOwner(
      getOwnerAccount() == item?.owner.id ||
        getOwnerAccount() == item?.seller.id,
    );
    return () => {
      onCleanup();
    };
  }, []);

  useEffect(() => {
    setIsOwner(
      getOwnerAccount() == item?.owner.id ||
        getOwnerAccount() == item?.seller.id,
    );
  }, [accountWeb, item]);

  useEffect(() => {
    if (state == null) return;
    async function perform(item: Nft, price: string) {
      onProcessing();
      const contract = ContractFromNamespaceAllNetwork(
        getContractNamespace(market, serviceID),
      );
      await contractCallWithToast(contract, "updateAskOrder", [
        toAddress(item?.collection.id),
        item?.tokenId,
        toWei(price),
      ])
        .then(async () => {
          onSuccessful();
          setProcessing(false);
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.log(`Failed cancelSell ${item} ${e}`);
          onError(e);
          setProcessing(false);
        });
    }
    const [item, price] = state;
    setOnAction(item != null);
    const isEditPrirceComfirm = price != null;
    if (isEditPrirceComfirm) {
      if (checkIsNumber(price, true)) {
        if (isLessMaximumPrice(price)) {
          setState([null, null]);
          setProcessing(true);
          perform(item, price);
        } else {
          Toast.error(
            t("nfts.inventory_tab.maximum_price") + getMaximumPriceFormat(),
          );
        }
      } else {
        Toast.error(t("nfts.inventory_tab.price_invalid"));
      }
    }
  }, [state]);

  const { t } = useTranslation();
  const { colors, dark } = useTheme();
  const [price, setPrice] = useState("");

  return (
    <>
      {isOwner && item?.isTradable && (
        <>
          {processing ? (
            <View>
              <IconLoadingDataComponent />
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setState([item, null]);
              }}
              activeOpacity={0.8}
            >
              {children}
            </TouchableOpacity>
          )}

          <ActionModalsComponent
            modalVisible={onAction}
            closeModal={() => {
              setState([null, null]);
              setOnAction(false);
            }}
            iconClose
            positionIconClose={{
              top: 0,
              right: 20,
            }}
          >
            <View
              style={{
                width: "90%",
                backgroundColor: colors.card,
                paddingVertical: 24,
                paddingHorizontal: 16,
                borderRadius: 8,
              }}
            >
              <View style={{ alignItems: "center" }}>
                <MyTextApp
                  style={{
                    fontSize: 22,
                    ...FONTS.fontBold,
                    color: colors.title,
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  {t("wallet.edit_price")}
                </MyTextApp>
              </View>
              <View style={{ marginTop: 8 }}>
                <MyTextApp style={{ color: colors.title, textAlign: "center" }}>
                  {t("wallet.choose_method")}
                  {" " + " " + item?.metadata.name + " - #" + item?.tokenId}
                </MyTextApp>
              </View>
              <View style={{ marginVertical: 16 }}>
                <Image
                  source={ICONS.nemo}
                  alt=""
                  style={{
                    width: 24,
                    height: 24,
                    position: "absolute",
                    right: 10,
                    top: 12,
                    zIndex: 10,
                  }}
                />
                {/* <TextInput
                    keyboardType="numeric"
                    id="price"
                    placeholder={t("wallet.price")}
                    placeholderTextColor={colors.text}
                    style={{
                      backgroundColor: colors.background,
                      borderRadius: 8,
                      paddingLeft: 16,
                      paddingVertical: 14,
                      maxHeight: 48,
                      paddingRight: 40,
                      borderColor: dark
                        ? "rgba(122, 121, 138, 0.50)"
                        : colors.border,
                      color: colors.title,
                    }}
                    onChangeText={(text) => setPrice(text)}
                    autoFocus
                  /> */}
                <InputComponent
                  keyboardType="numeric"
                  id="price"
                  placeholder={t("wallet.price")}
                  placeholderTextColor={colors.text}
                  style={{
                    backgroundColor: colors.background,
                    borderRadius: 8,
                    paddingLeft: 16,
                    paddingVertical: 14,
                    maxHeight: 48,
                    height: 48,
                    paddingRight: 40,
                    borderColor: dark
                      ? "rgba(122, 121, 138, 0.50)"
                      : colors.border,
                  }}
                  onChangeText={(text: string) => {
                    setPrice(text);
                  }}
                  autoFocus
                  height={48}
                />
              </View>
              <View style={{ marginBottom: 16, alignItems: "flex-start" }}>
                <MyTextApp style={{ color: colors.title }}>
                  {t("wallet.service_fee")}
                  <MyTextApp
                    style={{
                      color: "#ff9d0a",
                      fontSize: 16,
                      ...FONTS.fontBold,
                    }}
                  >
                    {" "}
                    5%
                  </MyTextApp>
                </MyTextApp>
              </View>
              <View>
                <ButtonComponent
                  title={t("common.confirm")}
                  onPress={() => {
                    setState([state[0], price]);
                  }}
                  disabled={!price || price == "0"}
                />
              </View>
            </View>
          </ActionModalsComponent>
        </>
      )}
    </>
  );
}

export function Burn({
  item,
  onProcessing,
  onSuccessful,
  onError,
  onHideDetail,
  children,
  disabled,
}: {
  item: Nft;
  onProcessing: any;
  onSuccessful: any;
  onError: any;
  onHideDetail?: any;
  children: JSX.Element | string;
  isAvailable: boolean;
  disabled?: any;
}): any {
  // Account

  const [isOwner, setIsOwner] = useState(false);
  const [onAction, setOnAction] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [state, setState] = useState<any>(null);
  const accountWeb = useSelector(AccountReducers.dataAccount);

  const onCleanup = () => {
    setState(null);
  };

  useEffect(() => {
    setIsOwner(
      getOwnerAccount() == item?.owner.id ||
        getOwnerAccount() == item?.seller.id,
    );
    return () => {
      onCleanup();
    };
  }, []);

  useEffect(() => {
    setIsOwner(
      getOwnerAccount() == item?.owner.id ||
        getOwnerAccount() == item?.seller.id,
    );
  }, [accountWeb, item]);

  useEffect(() => {
    setIsOwner(
      getOwnerAccount() == item?.owner.id ||
        getOwnerAccount() == item?.seller.id,
    );
  }, [item]);

  useEffect(() => {
    // setProcessing(true)
    if (state == null) return;
    async function perform(item: Nft) {
      onProcessing();
      const contract = ContractFromAddressAllNetwork(item?.collection.id);
      await contractCallWithToast(contract, "burn", [item?.tokenId])
        .then(async () => {
          onSuccessful();
          setProcessing(false);
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.log(`Failed burn ${item} ${e}`);
          onError(e);
          setProcessing(false);
        });
    }
    setProcessing(true);
    perform(state);
    setState(null);
  }, [state]);

  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <>
      {isOwner &&
        !item?.isTradable &&
        collectionFromAddress(item?.collection.id).isBurnToUse && (
          <>
            <TouchableOpacity
              disabled={disabled}
              onPress={() => {
                setOnAction(true);
                if (onHideDetail != null) {
                  onHideDetail();
                }
              }}
              activeOpacity={0.8}
            >
              {children}
            </TouchableOpacity>
          </>
        )}

      <ActionModalsComponent
        modalVisible={onAction}
        closeModal={() => {
          setOnAction(false);
        }}
        iconClose
        positionIconClose={{
          top: 0,
          right: 20,
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
          <View style={{ alignItems: "center" }}>
            <MyTextApp
              style={{
                fontSize: 22,
                ...FONTS.fontBold,
                color: colors.title,
                width: "100%",
                textAlign: "center",
              }}
            >
              {t("nfts.inventory_tab.burn_nft")}
            </MyTextApp>
          </View>
          <View style={{ marginTop: 8 }}>
            <MyTextApp style={{ color: colors.title, textAlign: "center" }}>
              {t("nfts.inventory_tab.do_you_want_to_burn")}
              {" " + " " + item?.metadata.name + " - #" + item?.tokenId}
            </MyTextApp>
          </View>
          <ButtonComponent
            title={t("common.confirm")}
            onPress={() => {
              setState(item);
            }}
            onProcessing={processing}
            style={{
              marginTop: 16,
            }}
          />
        </View>
      </ActionModalsComponent>
    </>
  );
}
export function CreateAskOrder({
  item,
  market,
  onProcessing,
  onSuccessful,
  onError,
  children,
  isAvailable,
  onHideDetail,
  onClose,
  serviceID,
  disabled,
}: {
  item: Nft;
  market: IMarket;
  onProcessing: any;
  onSuccessful: any;
  onError: any;
  children: JSX.Element | string;
  isAvailable: boolean;
  onHideDetail?: any;
  onClose?: any;
  serviceID?: any;
  disabled?: any;
}): any {
  const [isOwner, setIsOwner] = useState(false);

  const [state, setState] = useState<any>([null, null]);
  const [onAction, setOnAction] = useState(false);
  const [processing, setProcessing] = useState(false);
  const accountWeb = useSelector(AccountReducers.dataAccount);
  const onCleanup = () => {
    setState(null);
  };

  useEffect(() => {
    setIsOwner(
      getOwnerAccount() == item?.owner.id ||
        getOwnerAccount() == item?.seller.id,
    );
    return () => {
      onCleanup();
    };
  }, []);

  useEffect(() => {
    setIsOwner(
      getOwnerAccount() == item?.owner.id ||
        getOwnerAccount() == item?.seller.id,
    );
  }, [accountWeb, item]);

  useEffect(() => {
    setIsOwner(
      getOwnerAccount() == item?.owner.id ||
        getOwnerAccount() == item?.seller.id,
    );
  }, [item]);

  useEffect(() => {
    async function perform(item: Nft, price: string) {
      onProcessing();
      const contract = ContractFromNamespaceAllNetwork(
        getContractNamespace(market, serviceID),
      );
      const params = [
        toAddress(item?.collection.id),
        item?.tokenId,
        toWei(price),
      ];
      contractCallWithToast(contract, "createAskOrder", params)
        .then(() => {
          onSuccessful();
          setProcessing(false);
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.log(
            `Failed createAskOrder ${JSON.stringify(params)} ${JSON.stringify(
              e,
            )}`,
          );
          onError(e);
          setProcessing(false);
        });
    }

    const [item, price] = state ?? [];
    setOnAction(item != null);
    const isSellComfirm = price != null;
    if (isSellComfirm) {
      if (checkIsNumber(price, true)) {
        if (isLessMaximumPrice(price)) {
          setProcessing(true);
          setState([null, null]);
          perform(item, price);
        } else {
          Toast.error(
            t("nfts.inventory_tab.maximum_price") + getMaximumPriceFormat(),
          );
        }
      } else {
        Toast.error(t("nfts.inventory_tab.price_invalid"));
      }
    }
  }, [state]);

  const { t } = useTranslation();
  const { colors, dark } = useTheme();
  const [price, setPrice] = useState("");

  return (
    <>
      {isOwner && !item?.isTradable && (
        <>
          {!processing ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  if (isAvailable) {
                    setState([item, null]);
                    if (onHideDetail != null) {
                      onHideDetail();
                    }
                  }
                }}
                disabled={disabled}
                activeOpacity={0.8}
              >
                {children}
              </TouchableOpacity>
            </>
          ) : (
            <IconLoadingDataComponent />
          )}
          <ActionModalsComponent
            modalVisible={onAction}
            closeModal={() => {
              setState([null, null]);
              setOnAction(false);
              if (onClose != null) {
                onClose();
              }
            }}
            iconClose
            positionIconClose={{
              top: 0,
              right: 20,
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
                  fontSize: 20,
                  ...FONTS.fontBold,
                  color: colors.title,
                  textAlign: "center",
                }}
              >
                {t("wallet.sell_nft")}
              </MyTextApp>
              <View>
                <MyTextApp
                  style={{
                    color: colors.title,
                    textAlign: "center",
                  }}
                >
                  {t("wallet.choose_method") + " "}
                  <MyTextApp style={{ color: colors.title, ...FONTS.fontBold }}>
                    {item?.metadata.name + "- #" + item?.tokenId}
                  </MyTextApp>
                </MyTextApp>
                <View style={{ marginVertical: 16 }}>
                  <Image
                    source={ICONS.nemo}
                    alt=""
                    style={{
                      width: 24,
                      height: 24,
                      position: "absolute",
                      right: 10,
                      top: 12,
                      zIndex: 10,
                    }}
                  />
                  <InputComponent
                    keyboardType="numeric"
                    id="price"
                    placeholder={t("wallet.price")}
                    placeholderTextColor={colors.text}
                    style={{
                      backgroundColor: colors.background,
                      borderRadius: 8,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      paddingLeft: 16,
                      maxHeight: 48,
                      height: 48,
                      paddingRight: 40,
                      borderWidth: 1,
                      borderColor: dark
                        ? "rgba(122, 121, 138, 0.50)"
                        : colors.border,
                      color: colors.title,
                    }}
                    onChangeText={(text: string) => {
                      setPrice(text);
                    }}
                    autoFocus
                    height={48}
                    onSubmitEditing={() => {
                      setState([state[0], price]);
                    }}
                  />
                </View>
                <View style={{ marginBottom: 16, alignItems: "flex-start" }}>
                  <MyTextApp style={{ color: colors.title }}>
                    {t("wallet.service_fee")}
                    <MyTextApp
                      style={{
                        color: "#ff9d0a",
                        fontSize: 16,
                        ...FONTS.fontBold,
                      }}
                    >
                      {" "}
                      5%
                    </MyTextApp>
                  </MyTextApp>
                </View>
                <ButtonComponent
                  title={t("wallet.sell")}
                  onPress={() => {
                    setState([state[0], price]);
                  }}
                  disabled={!price || price == "0"}
                />
              </View>
            </View>
          </ActionModalsComponent>
        </>
      )}
    </>
  );
}

export function AcceptBidOrder({
  item,
  bidOrder,
  market,
  onProcessing,
  onSuccessful,
  onError,
  children,
  serviceID,
}: {
  item: Nft;
  bidOrder: BidOrder;
  market: IMarket;
  onProcessing: any;
  onSuccessful: any;
  onError: any;
  children: JSX.Element | string;
  serviceID?: any;
}): any {
  const [isOwner, setIsOwner] = useState(false);
  const [onAction, setOnAction] = useState(false);
  const [state, setState]: [v: Nft, setV: any] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  const accountWeb = useSelector(AccountReducers.dataAccount);

  const onCleanup = () => {
    setState(null);
  };

  useEffect(() => {
    setIsOwner(
      getOwnerAccount() == item?.owner.id ||
        getOwnerAccount() == item?.seller.id,
    );
    return () => {
      onCleanup();
    };
  }, []);

  useEffect(() => {
    setIsOwner(
      getOwnerAccount() == item?.owner.id ||
        getOwnerAccount() == item?.seller.id,
    );
  }, [accountWeb, item]);

  useEffect(() => {
    if (state == null) return;
    async function perform(item: Nft) {
      onProcessing();
      const contract = ContractFromNamespaceAllNetwork(
        getContractNamespace(market, serviceID),
      );
      const params = [
        toAddress(item?.collection.id),
        item?.tokenId,
        bidOrder.buyer.id,
      ];
      contractCallWithToast(contract, "acceptBidOrder", params)
        .then(() => {
          onSuccessful();
          setProcessing(false);
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.log(
            `Failed acceptBidOrder ${JSON.stringify(params)} ${JSON.stringify(
              e,
            )}`,
          );
          onError(e);
          setProcessing(false);
        });
    }

    setProcessing(true);
    perform(state);
    setState(null);
  }, [state]);

  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <>
      {isOwner && bidOrder.isTradable && (
        <>
          {processing ? (
            <IconLoadingDataComponent />
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setOnAction(true);
              }}
            >
              {children}
            </TouchableOpacity>
          )}
        </>
      )}

      <ActionModalsComponent
        modalVisible={onAction}
        closeModal={() => {
          setOnAction(false);
        }}
        iconClose
        positionIconClose={{
          top: 0,
          right: 20,
        }}
      >
        <View
          style={{
            width: "90%",
            backgroundColor: colors.card,
            paddingVertical: 24,
            paddingHorizontal: 16,
            borderRadius: 8,
          }}
        >
          <MyTextApp
            style={{
              fontSize: 20,
              ...FONTS.fontBold,
              color: colors.title,
              textAlign: "center",
            }}
          >
            {t("nfts.detail.accept_offer")}
          </MyTextApp>
          <View style={{ alignItems: "center", marginTop: 8 }}>
            <MyTextApp style={{ color: colors.title, textAlign: "center" }}>
              {t("nfts.detail.do_you_accept_offer")}
            </MyTextApp>
          </View>
          <View style={{ marginTop: 16 }}>
            <ButtonComponent
              title={t("nfts.detail.accept")}
              onPress={() => {
                setState(item);
              }}
              onProcessing={processing}
            />
          </View>
        </View>
      </ActionModalsComponent>
    </>
  );
}

export function CancelBidOrder({
  item,
  bidOrder,
  market,
  onProcessing,
  onSuccessful,
  onError,
  children,
  serviceID,
}: {
  item: Nft;
  bidOrder: BidOrder;
  market: IMarket;
  onProcessing: any;
  onSuccessful: any;
  onError?: any;
  children: JSX.Element | string;
  serviceID: any;
}): any {
  const [isBuyer, setIsBuyer] = useState(false);

  const [state, setState] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [onAction, setOnAction] = useState(false);
  const accountWeb = useSelector(AccountReducers.dataAccount);

  const onCleanup = () => {
    setState(null);
  };

  useEffect(() => {
    setIsBuyer(getOwnerAccount() == bidOrder.buyer.id);
    return () => {
      onCleanup();
    };
  }, []);

  useEffect(() => {
    setIsBuyer(getOwnerAccount() == bidOrder.buyer.id);
  }, [item, accountWeb]);

  useEffect(() => {
    if (state == null) return;
    async function perform(item: Nft) {
      onProcessing();
      const contract = ContractFromNamespaceAllNetwork(
        getContractNamespace(market, serviceID),
      );
      const params = [toAddress(item?.collection.id), item?.tokenId];
      contractCallWithToast(contract, "cancelBidOrder", params)
        .then(() => {
          onSuccessful();
          setProcessing(false);
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.log(
            `Failed cancelBidOrder ${JSON.stringify(params)} ${JSON.stringify(
              e,
            )}`,
          );
          onError(e);
          setProcessing(false);
        });
    }

    setProcessing(true);
    perform(state);
    setState(null);
  }, [state]);

  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <>
      {/* {isBuyer && bidOrder.isTradable && ( */}
      {isBuyer && (
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
            <View
              style={{
                width: "100%",
                alignItems: "center",
                backgroundColor: colors.primary,
                borderRadius: 32,
                height: 40,
                padding: 0,
                justifyContent: "center",
              }}
            >
              <IconProcessingButton />
            </View>
          )}
        </>
      )}

      <ActionModalsComponent
        modalVisible={onAction}
        closeModal={() => {
          setOnAction(false);
        }}
        iconClose
        positionIconClose={{
          top: 0,
          right: 20,
        }}
      >
        <View
          style={{
            width: SIZES.width * 0.9,
            backgroundColor: colors.card,
            paddingVertical: 24,
            paddingHorizontal: 16,
            borderRadius: 8,
          }}
        >
          <MyTextApp
            style={{
              color: colors.title,
              fontSize: 22,
              ...FONTS.fontBold,
              textAlign: "center",
            }}
          >
            {t("nfts.detail.cancel_offer")}
          </MyTextApp>
          <View style={{ marginVertical: 16, alignItems: "center" }}>
            <MyTextApp
              style={{
                color: colors.title,
                width: "100%",
                textAlign: "center",
              }}
            >
              {t("nfts.detail.do_you_cancel_offer")}
              {" " + item.metadata.name} - #{item.tokenId}?
            </MyTextApp>
          </View>
          <View style={{ width: "100%" }}>
            <ButtonComponent
              title={t("nfts.detail.cancel")}
              onPress={() => {
                setState(item);
              }}
              onProcessing={processing}
            />
          </View>
        </View>
      </ActionModalsComponent>
    </>
  );
}

export function CreateOrUpdateBidOrder({
  item,
  market,
  onProcessing,
  onSuccessful,
  onError,
  children,
  serviceID,
}: {
  item: Nft;
  market: IMarket;
  onProcessing: any;
  onSuccessful: any;
  onError: any;
  children: any;
  serviceID: any;
}): any {
  const [isOwner, setIsOwner] = useState(false);

  const [state, setState] = useState<any>([null, null]);
  const [onAction, setOnAction] = useState(false);
  const [processing, setProcessing] = useState(false);
  const accountWeb = useSelector(AccountReducers.dataAccount);

  const onCleanup = () => {
    setState(null);
  };

  useEffect(() => {
    setIsOwner(
      getOwnerAccount() == item?.owner.id ||
        getOwnerAccount() == item?.seller.id,
    );
    return () => {
      onCleanup();
    };
  }, []);

  useEffect(() => {
    setIsOwner(
      getOwnerAccount() == item?.owner.id ||
        getOwnerAccount() == item?.seller.id,
    );
  }, [accountWeb, item]);

  useEffect(() => {
    async function perform(item: Nft, price: string) {
      onProcessing();
      const contract = ContractFromNamespaceAllNetwork(
        getContractNamespace(market, serviceID),
      );
      const currencyContract = ContractFromNamespaceAllNetwork(
        getMarketCurrencyNamespace(market),
      );
      const approve: IApprove = {
        contract: currencyContract,
        owner: getOwnerAccount(),
        spender: contract.address,
        amount: toWei(price),
      };
      const params = [
        toAddress(item?.collection.id),
        item?.tokenId,
        toWei(price),
      ];
      await contractCallWithToast(
        contract,
        "createOrUpdateBidOrder",
        params,
        approve,
      )
        .then((res) => {
          // eslint-disable-next-line no-console
          // console.log(res);
          onSuccessful();
          setProcessing(false);
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          // console.log(e);
          onError(e);
          setProcessing(false);
        });
    }

    const [item, price] = state ?? [];
    setOnAction(item != null);
    const isSellComfirm = price != null;
    if (isSellComfirm) {
      if (checkIsNumber(price, true)) {
        if (isLessMaximumPrice(price)) {
          setState([null, null]);
          setProcessing(true);
          perform(item, price);
        } else {
          Toast.error(
            t("nfts.inventory_tab.maximum_price") + getMaximumPriceFormat(),
          );
        }
      } else {
        Toast.error(t("nfts.inventory_tab.price_invalid"));
      }
    }
  }, [state]);

  const { t } = useTranslation();
  const { colors, dark } = useTheme();
  const [price, setPrice] = useState("");
  const navigation = useNavigation();
  return (
    <>
      {!isOwner && item?.isTradable && (
        <>
          <TouchableOpacity
            onPress={() => {
              if (!accountWeb) {
                navigation.navigate("SignInScreen" as never);
                return;
              }
              setState([item, null]);
            }}
            activeOpacity={0.8}
          >
            {children}
          </TouchableOpacity>
          <ActionModalsComponent
            modalVisible={onAction}
            closeModal={() => {
              setState([null, null]);
              setOnAction(false);
            }}
            iconClose
            positionIconClose={{
              top: 0,
              right: 20,
            }}
          >
            <View
              style={{
                width: "90%",
                backgroundColor: colors.card,
                paddingVertical: 24,
                paddingHorizontal: 16,
                borderRadius: 8,
              }}
            >
              <View style={{ alignItems: "center", gap: 8 }}>
                <MyTextApp
                  style={{
                    fontSize: 20,
                    ...FONTS.fontBold,
                    color: colors.title,
                  }}
                >
                  {t("nfts.detail.offer_nft")}
                </MyTextApp>
                <MyTextApp style={{ color: colors.title }}>
                  {item?.metadata.name + " #" + item?.tokenId}
                </MyTextApp>
              </View>
              <View style={{ marginVertical: 16 }}>
                <InputComponent
                  keyboardType="numeric"
                  id="price"
                  placeholder={t("wallet.price")}
                  placeholderTextColor={colors.text}
                  style={{
                    color: colors.title,
                    paddingHorizontal: 16,
                    paddingVertical: 13,
                    maxHeight: 48,
                    height: 48,
                    backgroundColor: colors.background,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: dark
                      ? "rgba(122, 121, 138, 0.50)"
                      : colors.border,
                  }}
                  value={price}
                  onChangeText={(text: string) => {
                    setPrice(text);
                  }}
                  autoFocus
                  showClear={false}
                />
              </View>
              <View style={{}}>
                <ButtonComponent
                  title={t("common.confirm")}
                  onPress={() => {
                    setState([state[0], price.trim()]);
                  }}
                  disabled={!price || price == "0"}
                  onProcessing={processing}
                />
              </View>
            </View>
          </ActionModalsComponent>
        </>
      )}
    </>
  );
}

export function BuyNFT({
  item,
  market,
  onProcessing,
  onSuccessful,
  onError,
  style,
  children,
  serviceID,
}: {
  item: Nft;
  market: IMarket;
  onProcessing: any;
  onSuccessful: any;
  onError: any;
  style: ViewStyle;
  children: JSX.Element | string;
  serviceID: any;
}): any {
  const [isOwner, setIsOwner] = useState(false);
  const [state, setState] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [onAction, setOnAction] = useState(false);
  const accountWeb = useSelector(AccountReducers.dataAccount);
  const navigation = useNavigation();

  const onCleanup = () => {
    setState(null);
  };

  useEffect(() => {
    setIsOwner(
      getOwnerAccount() == item?.owner.id ||
        getOwnerAccount() == item?.seller.id,
    );
    return () => {
      onCleanup();
    };
  }, []);

  useEffect(() => {
    setIsOwner(
      getOwnerAccount() == item?.owner.id ||
        getOwnerAccount() == item?.seller.id,
    );
  }, [accountWeb, item]);

  useEffect(() => {
    if (state == null) return;
    async function perform(item: Nft) {
      onProcessing();
      const contract = ContractFromNamespaceAllNetwork(
        getContractNamespace(market, serviceID),
      );
      const currencyContract = ContractFromNamespaceAllNetwork(
        getMarketCurrencyNamespace(market),
      );
      const approve: IApprove = {
        contract: currencyContract,
        owner: getOwnerAccount(),
        spender: contract.address,
        amount: toWei(item?.askPrice.toString()),
      };
      await contractCallWithToast(
        contract,
        "buy",
        [toAddress(item?.collection.id), item?.tokenId],
        approve,
      )
        .then((_) => {
          onSuccessful();
          setProcessing(false);
        })
        .catch((e) => {
          onError(e);
          setProcessing(false);
        });
    }

    setProcessing(true);
    perform(state);
    setState(null);
  }, [state]);

  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <>
      {!isOwner && item?.isTradable && (
        <>
          {processing ? (
            <View
              style={{
                width: "100%",
                alignItems: "center",
                backgroundColor: colors.primary,
                borderRadius: 32,
                height: 36,
                padding: 0,
                justifyContent: "center",
              }}
            >
              <IconProcessingButton />
            </View>
          ) : (
            item?.askPrice != null && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={style}
                onPress={() => {
                  if (!accountWeb) {
                    navigation.navigate("SignInScreen" as never);
                    return;
                  }
                  setOnAction(true);
                }}
              >
                {children}
              </TouchableOpacity>
            )
          )}
        </>
      )}
      <ActionModalsComponent
        closeModal={() => {
          setOnAction(false);
        }}
        modalVisible={onAction}
        iconClose
        positionIconClose={{
          top: 0,
          right: 20,
        }}
      >
        <View
          style={{
            width: "90%",
            backgroundColor: colors.card,
            paddingVertical: 24,
            paddingHorizontal: 16,
            borderRadius: 8,
          }}
        >
          <MyTextApp style={{ ...styleBuy.title, color: colors.title }}>
            {t("wallet.buy_nft")}
          </MyTextApp>
          <View>
            <MyTextApp
              style={{
                fontSize: 14,
                textAlign: "center",
                color: colors.title,
              }}
            >
              {t("wallet.do_you_want_to_buy")} {item.metadata.name} - #
              {item.tokenId} ?
            </MyTextApp>
            <View style={{ marginTop: 16 }}>
              <ButtonComponent
                onPress={() => {
                  setState(item);
                }}
                title={t("wallet.buy")}
                textWeight="700"
                textColor={COLORS.white}
                textSize={16}
                onProcessing={processing}
              />
            </View>
          </View>
        </View>
      </ActionModalsComponent>
    </>
  );
}

const styleBuy = StyleSheet.create({
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 8,
  },
});

export function SendNft({
  item,
  onProcessing,
  onSuccessful,
  onError,
  disabled,
  children,
  isAvailable,
  onHideDetail,
  onClose,
}: {
  item: Nft;
  onProcessing: any;
  onSuccessful: any;
  onError: any;
  disabled?: boolean | any;
  children: JSX.Element | string;
  isAvailable: boolean;
  onHideDetail?: any;
  onClose?: any;
}): any {
  const [isOwner, setIsOwner] = useState(false);

  const [state, setState] = useState<any | any[]>([null, null]);
  const [onAction, setOnAction] = useState(false);
  const [processing, setProcessing] = useState(false);
  const accountWeb = useSelector(AccountReducers.dataAccount);
  const onCleanup = () => {
    setState(null);
  };

  useEffect(() => {
    setIsOwner(
      getOwnerAccount() == item?.owner.id ||
        getOwnerAccount() == item?.seller.id,
    );
    return () => {
      onCleanup();
    };
  }, []);

  useEffect(() => {
    setIsOwner(
      getOwnerAccount() == item?.owner.id ||
        getOwnerAccount() == item?.seller.id,
    );
  }, [item, accountWeb]);

  useEffect(() => {
    async function perform(item: Nft, wallet: string) {
      onProcessing();
      const contract = ContractFromAddressCogiChain(
        toAddress(item?.collection.id),
      );
      const params = [getOwnerAccount(), toAddress(wallet), item?.tokenId];
      contractCallWithToastCogiChain(contract, "transferFrom", params)
        .then(() => {
          onSuccessful();
          setProcessing(false);
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.log(
            `Failed Send Nft ${JSON.stringify(params)} ${JSON.stringify(e)}`,
          );
          onError(e);
          setProcessing(false);
        });
    }

    const [item, wallet] = state ?? [];
    setOnAction(item != null);
    const isSellComfirm = !isEmpty(wallet);
    if (isSellComfirm) {
      if (isAddress(wallet)) {
        if (wallet.toLowerCase() != getOwnerAccount().trim().toLowerCase()) {
          setProcessing(true);
          setState([null, null]);
          perform(item, wallet);
        } else {
          Toast.error(t("nfts.inventory_tab.cant_send_item"));
        }
      } else {
        Toast.error(t("wallet.wallet_invalid"));
      }
    }
  }, [state]);

  const { t } = useTranslation();
  const { colors, dark } = useTheme();
  const [address, setAddress] = useState("");

  return (
    <ScrollView keyboardShouldPersistTaps={"handled"}>
      {isOwner && !item?.isTradable && (
        <>
          {!processing ? (
            <>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  if (isAvailable) {
                    setState([item, null]);
                    if (onHideDetail != null) {
                      onHideDetail();
                    }
                  }
                }}
              >
                {children}
              </TouchableOpacity>
            </>
          ) : (
            <View>
              <IconLoadingDataComponent />
            </View>
          )}

          <ActionModalsComponent
            modalVisible={onAction}
            closeModal={() => {
              setState([null, null]);
              setOnAction(false);
              if (onClose != null) {
                onClose();
              }
            }}
            iconClose
            positionIconClose={{
              top: 0,
              right: 20,
            }}
          >
            <View
              style={{
                width: 0.9 * SIZES.width,
                backgroundColor: colors.card,
                paddingVertical: 20,
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
                {t("nfts.inventory_tab.send_nft")}
              </MyTextApp>
              <View style={{ alignItems: "center", marginVertical: 16 }}>
                <MyTextApp style={{ color: colors.title, textAlign: "center" }}>
                  {t("common.send")}
                  {" " + item.metadata.name + " #" + item.tokenId + " ?"}
                </MyTextApp>
              </View>

              <View style={{ marginVertical: 12 }}>
                <InputComponent
                  autoFocus={true}
                  value={address}
                  onChangeText={(text: string) => {
                    setAddress(text);
                  }}
                  placeholder={
                    ClassWithStaticMethod.STATIC_DEFAULT_CHAINID ==
                    ClassWithStaticMethod.NEMO_WALLET_CHAINID
                      ? t("nfts.inventory_tab.nemo_address")
                      : t("nfts.inventory_tab.metamask_address")
                  }
                  placeholderTextColor={colors.text}
                  style={{
                    color: colors.title,
                    paddingHorizontal: 16,
                    paddingVertical: 13,
                    borderRadius: 8,
                    borderColor: dark
                      ? "rgba(122, 121, 138, 0.50)"
                      : colors.border,
                    borderWidth: 1,
                    backgroundColor: colors.background,
                    fontSize: 14,
                    height: 52,
                  }}
                  showClear={false}
                  height={52}
                  onSubmitEditing={() => {
                    setState([
                      state[0],
                      isAddress(address) && descyptNEMOWallet(address.trim()),
                    ]);
                  }}
                />
              </View>
              <View>
                <ButtonComponent
                  title={t("common.confirm")}
                  onPress={() => {
                    setState([
                      state[0],
                      isAddress(address) && descyptNEMOWallet(address.trim()),
                    ]);
                  }}
                />
              </View>
            </View>
          </ActionModalsComponent>
        </>
      )}
    </ScrollView>
  );
}

export function SendNftOPS({
  item,
  nfcID,
  onProcessing,
  onSuccessful,
  onError,
  disabled,
  children,
  isAvailable,
  onHideDetail,
  onClose,
}: {
  item: Nft;
  nfcID?: any;
  onProcessing: any;
  onSuccessful: any;
  onError: any;
  disabled?: boolean | any;
  children: JSX.Element | string;
  isAvailable: boolean;
  onHideDetail?: any;
  onClose?: any;
}): any {
  const [isOwner, setIsOwner] = useState(false);

  const [state, setState] = useState<any | any[]>([null, null]);
  const [onAction, setOnAction] = useState(false);
  const [onActionNFC, setOnActionNFC] = useState(false);
  const [processing, setProcessing] = useState(false);
  const accountWeb = useSelector(AccountReducers.dataAccount);
  const onCleanup = () => {
    setState(null);
  };

  useEffect(() => {
    setIsOwner(
      getOwnerAccount() == item?.owner.id ||
        getOwnerAccount() == item?.seller.id,
    );
    return () => {
      onCleanup();
    };
  }, []);

  useEffect(() => {
    setIsOwner(
      getOwnerAccount() == item?.owner.id ||
        getOwnerAccount() == item?.seller.id,
    );
  }, [item, accountWeb]);

  useEffect(() => {
    async function perform(item: Nft, wallet: string, _nfcID: string) {
      try {
        onProcessing();
        const contract = ContractFromAddressCogiChain(
          toAddress(item?.collection.id),
        );
        //
        const nonceRes = await contractCogiChain_call_Get_Not_Login(
          contract,
          "nonces",
          [getOwnerAccount().trim().toLowerCase()],
        );
        const nonce = parseFloat(
          decodeFunctionResult(contract, "nonces", nonceRes),
        );
        const timestampRes = await contractCogiChain_call_Get_Not_Login(
          contract,
          "timestamp",
          [],
        );
        const timestamp = parseFloat(
          decodeFunctionResult(contract, "timestamp", timestampRes),
        );
        const deadline = timestamp + 60 * 5;
        const res = createWalletSigner(
          _nfcID,
          item?.metadata.id ?? "",
          PRIVATE_CREATE_WALLET_SIGNER,
        );
        const ops = res.signer;
        const signer = new OPSSigner(ops, contract?.address, DEFAULT_CHAINID);
        const signature = await signer.signTransfer(
          getOwnerAccount().trim().toLowerCase(),
          toAddress(wallet),
          item?.tokenId,
          nonce,
          deadline,
        );
        setProcessing(false);
        //
        const params = [
          getOwnerAccount(),
          toAddress(wallet),
          item?.tokenId,
          deadline,
          signature,
        ];
        contractCallWithToastCogiChain(
          contract,
          "safeTransferFrom(address,address,uint256,uint256,bytes)",
          params,
        )
          .then(() => {
            onSuccessful();
            setProcessing(false);
          })
          .catch((e) => {
            // eslint-disable-next-line no-console
            console.log(
              `Failed Send Nft ${JSON.stringify(params)} ${JSON.stringify(e)}`,
            );
            onError(e);
            setProcessing(false);
          });
      } catch (e) {
        onError(e);
        setProcessing(false);
      }
    }

    const [item, wallet, _nfcID] = state ?? [];
    setOnActionNFC(item != null && _nfcID == null && !onAction);
    setOnAction(item != null && _nfcID != null);
    const isSellComfirm = !isEmpty(wallet);
    if (isSellComfirm) {
      if (isAddress(wallet)) {
        if (wallet.toLowerCase() != getOwnerAccount().trim().toLowerCase()) {
          setProcessing(true);
          perform(item, wallet, _nfcID);
          setState([null, null, null]);
        } else {
          Toast.error(t("nfts.inventory_tab.cant_send_item"));
        }
      } else {
        Toast.error(t("wallet.wallet_invalid"));
      }
    }
  }, [state]);

  useEffect(() => {
    if (onActionNFC) {
      readTag();
      // Fake Data
      // setTimeout(() => {
      //   setState([item, null, "04: 5D: 7B: 7A: 21: 59: 80"]);
      // }, 2000);
      //
    }
  }, [onActionNFC]);

  const readTag = async () => {
    await NfcManager.registerTagEvent();
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      if (tag) {
        setState([item, "", tag?.id ?? ""]);
      }
    } catch (ex) {
      console.warn("Oops!", ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }
  };

  const { t } = useTranslation();
  const { colors, dark } = useTheme();
  const [address, setAddress] = useState("");

  return (
    <ScrollView keyboardShouldPersistTaps={"handled"}>
      {isOwner && !item?.isTradable && (
        <>
          {!processing ? (
            <>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  if (isAvailable) {
                    setState([item, null, null]);
                    if (onHideDetail != null) {
                      onHideDetail();
                    }
                  }
                }}
              >
                {children}
              </TouchableOpacity>
            </>
          ) : (
            <View>
              <IconLoadingDataComponent />
            </View>
          )}
          <ActionModalsComponent
            modalVisible={onActionNFC}
            closeModal={() => {
              setState([null, null, null]);
              setOnActionNFC(false);
              if (onClose != null) {
                onClose();
              }
            }}
            iconClose
            positionIconClose={{
              top: 0,
              right: 20,
            }}
          >
            <TouchableOpacity
              style={{
                justifyContent: "flex-end",
                alignItems: "center",
                flexGrow: 1,
                width: "100%",
                height: "100%",
              }}
              onPress={() => {
                setState([null, null, null]);
                setOnActionNFC(false);
                if (onClose != null) {
                  onClose();
                }
              }}
            >
              <TouchableWithoutFeedback
                style={{
                  position: "absolute",
                  bottom: 0,
                  zIndex: 999,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.card,
                    width: "98%",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 36,

                    paddingHorizontal: 36,
                    paddingVertical: 30,
                    borderRadius: 8,
                  }}
                >
                  <MyTextApp style={{ fontSize: 20, color: colors.title }}>
                    {t("account.ready_scan")}
                  </MyTextApp>
                  <Image
                    source={ICONS.scan}
                    alt=""
                    style={{
                      height: 120,
                      width: 120,
                    }}
                  />
                  <MyTextApp style={{ color: colors.title }}>
                    {t("account.move_phone")}
                  </MyTextApp>
                  <ButtonComponent
                    onPress={() => {
                      setState([null, null, null]);
                      setOnActionNFC(false);
                      if (onClose != null) {
                        onClose();
                      }
                    }}
                    title={t("account.cancel")}
                    borderRadius={8}
                  />
                </View>
              </TouchableWithoutFeedback>
            </TouchableOpacity>
          </ActionModalsComponent>
          <ActionModalsComponent
            modalVisible={onAction}
            closeModal={() => {
              setState([null, null, null]);
              setOnAction(false);
              if (onClose != null) {
                onClose();
              }
            }}
            iconClose
            positionIconClose={{
              top: 0,
              right: 20,
            }}
          >
            <View
              style={{
                width: 0.9 * SIZES.width,
                backgroundColor: colors.card,
                paddingVertical: 20,
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
                {t("nfts.inventory_tab.send_nft")}
              </MyTextApp>
              <View style={{ alignItems: "center", marginVertical: 16 }}>
                <MyTextApp style={{ color: colors.title, textAlign: "center" }}>
                  {t("common.send")}
                  {" " + item.metadata.name + " #" + item.tokenId + " ?"}
                </MyTextApp>
              </View>

              <View style={{ marginVertical: 12 }}>
                <InputComponent
                  autoFocus={true}
                  value={address}
                  onChangeText={(text: string) => {
                    setAddress(text);
                  }}
                  placeholder={
                    ClassWithStaticMethod.STATIC_DEFAULT_CHAINID ==
                    ClassWithStaticMethod.NEMO_WALLET_CHAINID
                      ? t("nfts.inventory_tab.nemo_address")
                      : t("nfts.inventory_tab.metamask_address")
                  }
                  placeholderTextColor={colors.text}
                  style={{
                    color: colors.title,
                    paddingHorizontal: 16,
                    paddingVertical: 13,
                    borderRadius: 8,
                    borderColor: dark
                      ? "rgba(122, 121, 138, 0.50)"
                      : colors.border,
                    borderWidth: 1,
                    backgroundColor: colors.background,
                    fontSize: 14,
                    height: 52,
                  }}
                  showClear={false}
                  height={52}
                  onSubmitEditing={() => {
                    setState([
                      state[0],
                      isAddress(address) && descyptNEMOWallet(address.trim()),
                      state[2],
                    ]);
                  }}
                />
              </View>
              <View>
                <ButtonComponent
                  title={t("common.confirm")}
                  onPress={() => {
                    setState([
                      state[0],
                      isAddress(address) && descyptNEMOWallet(address.trim()),
                      state[2],
                    ]);
                  }}
                />
              </View>
            </View>
          </ActionModalsComponent>
        </>
      )}
    </ScrollView>
  );
}

export function ValidateOPS({
  item,
  nfcID,
  onProcessing,
  onSuccessful,
  onError,
  disabled,
  children,
  isAvailable,
  onHideDetail,
  onClose,
}: {
  item: Nft;
  nfcID?: any;
  onProcessing: any;
  onSuccessful: any;
  onError: any;
  disabled?: boolean | any;
  children: JSX.Element | string;
  isAvailable: boolean;
  onHideDetail?: any;
  onClose?: any;
}): any {
  const [isOwner, setIsOwner] = useState(false);

  const [state, setState] = useState<any | any[]>([null, null]);
  const [onAction, setOnAction] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [responseCheck, setResponseCheck] = useState<any>(null);
  const [onActionModalCheck, setOnActionModalCheck] = useState(false);
  const accountWeb = useSelector(AccountReducers.dataAccount);

  const onCleanup = () => {
    setState(null);
  };

  const checkIsSupported = async () => {
    const deviceIsSupported = await NfcManager.isSupported();
    if (deviceIsSupported) {
      if (Platform.OS === "android") {
        NfcManager.setEventListener(
          NfcEvents.StateChanged,
          async ({ state }: { state: any }) => {
            try {
              await NfcManager.cancelTechnologyRequest().catch(() => 0);
              if (state === "off") {
                Toast.error(t("scan_nfc.go_setting"));
                setOnAction(false);
              } else if (state === "on") {
                await NfcManager.start();
              }
            } catch (ex) {
              console.warn("Error", ex);
            }
          },
        );
      }
    } else {
      setOnAction(false);
      Toast.error(t("account.nfc_not_supported"));
    }
  };
  useEffect(() => {
    setIsOwner(
      getOwnerAccount() == item?.owner.id ||
        getOwnerAccount() == item?.seller.id,
    );
    return () => {
      onCleanup();
    };
  }, []);

  useEffect(() => {
    setIsOwner(
      getOwnerAccount() == item?.owner.id ||
        getOwnerAccount() == item?.seller.id,
    );
  }, [item, accountWeb]);

  useEffect(() => {
    async function perform(item: Nft, _nfcID: string) {
      try {
        onProcessing();
        const contract = ContractFromAddressCogiChain(
          toAddress(item?.collection.id),
        );
        //
        const nonceRes = await contractCogiChain_call_Get_Not_Login(
          contract,
          "nonces",
          [getOwnerAccount().trim().toLowerCase()],
        );
        const nonce = parseFloat(
          decodeFunctionResult(contract, "nonces", nonceRes),
        );
        const timestampRes = await contractCogiChain_call_Get_Not_Login(
          contract,
          "timestamp",
          [],
        );
        const timestamp = parseFloat(
          decodeFunctionResult(contract, "timestamp", timestampRes),
        );
        const deadline = timestamp + 60 * 5;
        const res = createWalletSigner(
          _nfcID,
          item?.metadata.id ?? "",
          PRIVATE_CREATE_WALLET_SIGNER,
        );
        const ops = res.signer;
        const signer = new OPSSigner(ops, contract?.address, DEFAULT_CHAINID);
        const signature = await signer.signValidateOPS(
          getOwnerAccount().trim().toLowerCase(),
          item?.tokenId,
          nonce,
          deadline,
        );
        setProcessing(false);
        //
        const params = [getOwnerAccount(), item?.tokenId, deadline, signature];
        const validateOPSRes = await contractCogiChain_call_Get_Not_Login(
          contract,
          "validateOPS",
          params,
        );
        const validateOPS = decodeFunctionResult(
          contract,
          "validateOPS",
          validateOPSRes,
        );
        if (validateOPS.length != 0) {
          setOnActionModalCheck(true);
          setResponseCheck(validateOPS[0]);
        }
        setProcessing(false);
      } catch (e) {
        setOnActionModalCheck(true);
        setResponseCheck(false);
        onError(e);
        setProcessing(false);
      }
    }

    const [item, _nfcID] = state ?? [];
    checkIsSupported();
    setOnAction(item != null);
    const isCheckOPS = _nfcID != null;
    if (isCheckOPS) {
      setProcessing(true);
      setState([null, null]);
      perform(item, _nfcID);
    }
  }, [state]);

  useEffect(() => {
    if (onAction) {
      readTag();
      // Fake Data
      // setTimeout(() => {
      //   setState([item, "04:5D:7B:7A:21:59:80"]);
      // }, 2000);
      //
    }
  }, [onAction]);

  const readTag = async () => {
    await NfcManager.registerTagEvent();
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      if (tag) {
        setState([item, tag?.id ?? ""]);
      }
    } catch (ex) {
      console.warn("Oops!", ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }
  };

  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <ScrollView keyboardShouldPersistTaps={"handled"}>
      {isOwner && !item?.isTradable && (
        <>
          {!processing ? (
            <>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  if (isAvailable) {
                    setState([item, null]);
                    if (onHideDetail != null) {
                      onHideDetail();
                    }
                  }
                }}
              >
                {children}
              </TouchableOpacity>
            </>
          ) : (
            <View>
              <IconLoadingDataComponent />
            </View>
          )}

          <ActionModalsComponent
            modalVisible={onAction}
            closeModal={() => {
              setState([null, null]);
              setOnAction(false);
              if (onClose != null) {
                onClose();
              }
            }}
            iconClose
            positionIconClose={{
              top: 0,
              right: 20,
            }}
          >
            <TouchableOpacity
              style={{
                justifyContent: "flex-end",
                alignItems: "center",
                flexGrow: 1,
                width: "100%",
                height: "100%",
              }}
              onPress={() => {
                setState([null, null]);
                setOnAction(false);
                if (onClose != null) {
                  onClose();
                }
              }}
            >
              <TouchableWithoutFeedback
                style={{
                  position: "absolute",
                  bottom: 0,
                  zIndex: 999,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.card,
                    width: "98%",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 36,

                    paddingHorizontal: 36,
                    paddingVertical: 30,
                    borderRadius: 8,
                  }}
                >
                  <MyTextApp style={{ fontSize: 20, color: colors.title }}>
                    {t("account.ready_scan")}
                  </MyTextApp>
                  <Image
                    source={ICONS.scan}
                    alt=""
                    style={{
                      height: 120,
                      width: 120,
                    }}
                  />
                  <MyTextApp style={{ color: colors.title }}>
                    {t("account.move_phone")}
                  </MyTextApp>
                  <ButtonComponent
                    onPress={() => {
                      setState([null, null]);
                      setOnAction(false);
                      if (onClose != null) {
                        onClose();
                      }
                    }}
                    title={t("account.cancel")}
                    borderRadius={8}
                  />
                </View>
              </TouchableWithoutFeedback>
            </TouchableOpacity>
          </ActionModalsComponent>
          <ActionModalsComponent
            modalVisible={onActionModalCheck}
            closeModal={() => {
              setOnActionModalCheck(false);
            }}
            iconClose
            positionIconClose={{
              right: 20,
              top: 0,
            }}
          >
            <View
              style={{
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 20,
                alignItems: "center",
                width: "90%",
                gap: 20,
                backgroundColor: colors.card,
              }}
            >
              <Image
                source={responseCheck ? IMAGES.success : IMAGES.error}
                style={{ width: 200, height: 200 }}
                resizeMode="contain"
              />
              <MyTextApp
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: responseCheck ? COLORS.success : COLORS.orange,
                  textAlign: "center",
                }}
              >
                {responseCheck ? t("common.success") : t("common.error")}
              </MyTextApp>
              <View style={{ gap: 4 }}>
                {/* multi-language */}
                <MyTextApp
                  style={{
                    textAlign: "center",
                    color: COLORS.orange,
                  }}
                >
                  {!responseCheck && t("nfts.nft_not_owner")}
                </MyTextApp>
                <MyTextApp
                  style={{
                    textAlign: "center",
                    color: COLORS.success,
                  }}
                >
                  {responseCheck && t("nfts.nft_owner")}
                </MyTextApp>
              </View>
              <ButtonComponent
                title={responseCheck ? t("common.done") : t("common.close")}
                color={COLORS.disbaledButton}
                borderColor={COLORS.disbaledButton}
                onPress={() => {
                  setOnActionModalCheck(false);
                }}
              />
            </View>
          </ActionModalsComponent>
        </>
      )}
    </ScrollView>
  );
}
