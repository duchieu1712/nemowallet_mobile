import * as AccountReducers from "../../../../modules/account/reducers";

import {
  COLORS,
  ICONS,
  IMAGES,
  LANDS,
  MyTextApp,
  SIZES,
} from "../../../../themes/theme";
import { ENUM_ENDPOINT_RPC, STATUS_LAND } from "../../../../common/enum";
import {
  type IApprove,
  type IContractRelay,
  type LandInfo,
} from "../../../../common/types";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  currencyFormat,
  descyptNEMOWallet,
  formatTokenNumber,
  getRandomLandImage,
  timeStampToTime,
  toWei,
} from "../../../../common/utilities";

import ActionModalsComponent from "../../../../components/ModalComponent/ActionModalsComponent";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import { ContractFromNamespaceCogiChain } from "../../../../modules/wallet/utilities";
import FeatherIcon from "react-native-vector-icons/Feather";
import { cf_LST_PACKAGE_MINT_LAND } from "../../../../config/land-filters";
import Toast from "../../../../components/ToastInfo";
import { contractCallWithToast } from "../../../../components/RpcExec/toast";
import dayjs from "dayjs";
import { rpcExecCogiChain_Signer } from "../../../../components/RpcExec/toast_chain";
import { useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function LandComponent({
  land,
  reload,
  flagPendingClaimToken,
  setFlagPendingClaimToken,
  flagPendingClaimResource,
  setFlagPendingClaimResource,
  isPendingNemo,
  balanceNemo,
  isPendingResource,
  changeTagFocus,
  hasWhiteList,
  dispatchContractCallOnchainBalances,
}: {
  land: LandInfo;
  reload: any;
  flagPendingClaimToken: any;
  setFlagPendingClaimToken: any;
  flagPendingClaimResource: any;
  setFlagPendingClaimResource: any;
  isPendingNemo: boolean;
  balanceNemo: any;
  isPendingResource: boolean;
  changeTagFocus: any;
  hasWhiteList: any;
  dispatchContractCallOnchainBalances: any;
}) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [onActionClaimResource, setOnActionClaimResource] = useState(false);
  const [onActionUpgradeLand, setOnActionUpgradeLand] = useState(false);
  const [resourceSelected, setResourceSelected] = useState<any>("");
  const [packageSelected, setPackageSelected] = useState<any>(0);
  const [onRequestUpgrade, setOnRequestUpgrade] = useState(false);
  const [feeMintResources, setFeeMintResources] = useState<any>(null);
  const [feeMint, setFeeMint] = useState<any>(null);
  const [upgradeInfo, setUpgradeInfo] = useState<any>(null);
  // const [rengtingAvai, setRengtinAvai] = useState(false);
  const [timeCountDownMintResource, setTimeCountDownMintResource] =
    useState<any>(null);
  const timeCDInsMintResource = useRef<any>(null);
  // countdown mysteryhouse
  const [timeCountDownMysteryHouse, setTimeCountDownMysteryHouse] =
    useState<any>(null);
  const timeCDInsMysteryHouse = useRef<any>(null);
  const accountWeb = useSelector(AccountReducers.dataAccount);

  const timeoutMintResource = () => {
    setTimeCountDownMintResource((prevTimer: any) => {
      if (prevTimer > 0) {
        return prevTimer - 1;
      } else if (prevTimer === 0) {
        return prevTimer;
      }
    });
  };

  useEffect(() => {
    if (timeCountDownMintResource === null) return;
    if (timeCountDownMintResource > 0) {
      timeCDInsMintResource.current = setTimeout(timeoutMintResource, 1000);
    }
    if (timeCountDownMintResource === 0) {
      reload();
    }
    return () => {
      clearTimeout(timeCDInsMintResource.current);
    };
  }, [timeCountDownMintResource]);

  const timeoutMysteryHouse = () => {
    setTimeCountDownMysteryHouse((prevTimer: any) => {
      if (prevTimer > 0) {
        return prevTimer - 1;
      } else if (prevTimer === 0) {
        return prevTimer;
      }
    });
  };

  useEffect(() => {
    if (!land) return;
    if (land.nextsmtime > 0) {
      setTimeCountDownMysteryHouse(land.nextsmtime);
    }
  }, [land]);

  useEffect(() => {
    if (timeCountDownMysteryHouse === null) return;
    if (timeCountDownMysteryHouse > 0) {
      timeCDInsMintResource.current = setTimeout(timeoutMysteryHouse, 1000);
    }
    return () => {
      clearTimeout(timeCDInsMysteryHouse.current);
    };
  }, [timeCountDownMysteryHouse]);

  //
  // useEffect(() => {
  //   // onchain Balances
  //   if (hasWhiteList) {
  //     setRengtinAvai(false);
  //   }
  // }, [hasWhiteList]);

  const claimToken = async () => {
    // claim
    if (land.unclaimed_tokens <= "0") {
      Toast.error(t("event.not_have_token"));
      return;
    }
    try {
      setFlagPendingClaimToken(true);
      rpcExecCogiChain_Signer({
        method: "erc721_galix_land.request_claimtoken",
        params: {
          cid: land.cid.toString(),
        },
        endpoint: ENUM_ENDPOINT_RPC._GALIXCITY,
      })
        .then(async () => {
          setFlagPendingClaimToken(false);
          Toast.success(t("event.token_confirm_success"));
          reload();
        })
        .catch((error) => {
          Toast.error(error.message);
          setFlagPendingClaimToken(false);
        });
    } catch (e: any) {
      Toast.error(e.message);
      setFlagPendingClaimToken(false);
    }
  };

  async function performMintResource(response: any) {
    const contractRelay: IContractRelay = response.contract_relay;
    const namespace = contractRelay.namespace;
    const params: any = contractRelay.params;
    const hwContract = ContractFromNamespaceCogiChain(namespace);
    // approve
    const currencyContract = ContractFromNamespaceCogiChain("nemo_coin");
    const approve: IApprove = {
      contract: currencyContract,
      owner: descyptNEMOWallet(accountWeb?.nemo_address),
      spender: hwContract?.address,
      amount: toWei(params.fee),
    };
    await contractCallWithToast(
      hwContract,
      contractRelay.method,
      [params.cid, params.deadline, toWei(params.fee), params.signature],
      approve,
    )
      .then(async () => {
        setFlagPendingClaimResource(false);
        Toast.success(t("event.mint_success"));
        reload();
      })
      .catch(() => {
        // eslint-disable-next-line no-console
        // setFlagPendingClaimResource(false)
      });
  }
  const mintResource = async () => {
    try {
      // claim
      if (!resourceSelected) {
        Toast.error(t("event.choose_resource"));
        return;
      }
      if (!packageSelected) {
        Toast.error(t("event.choose_package"));
        return;
      }
      if (
        getValueResourceNotFormat(resourceSelected) <
        getValuePackage(packageSelected)
      ) {
        Toast.error(t("event.not_enought_resource"));
        // toast({title: t("event.not_enought_resource")})
        return;
      }
      const now = dayjs().valueOf() / 1000;
      if (feeMint.cdtime > now) {
        Toast.error(
          t("event.pls_wait") +
            timeStampToTime(timeCountDownMintResource) +
            t("event.mint_resource"),
        );
        return;
      }
      setFlagPendingClaimResource(true);

      // get Fee Resource Token
      rpcExecCogiChain_Signer({
        method: "erc721_galix_land.request_claimaward",
        params: {
          mintid: feeMint.mintid.toString(),
          cid: land.cid.toString(),
          namespace: "erc721_galix_resource",
          fee: feeMint.fee.toString(),
        },
        endpoint: ENUM_ENDPOINT_RPC._GALIXCITY,
      })
        .then((res: any) => {
          performMintResource(res);
        })
        .catch((e) => {
          Toast.error(e.message);
        });
    } catch (e: any) {
      setFlagPendingClaimResource(false);
      if (
        e.message.includes("Response_Data_Error") &&
        e.message.includes("fee")
      ) {
        getFeeResource();
        Toast.error(t("event.fee_changed_mint_again"));
      } else if (
        e.message.includes("Response_Data_Error") &&
        e.message.includes("Resource type")
      ) {
        getFeeResource();
        Toast.error(t("event.not_enought_resource"));
      } else {
        Toast.error(e.message);
      }
    }
  };

  // Upgrade land
  async function performUpgradeLand(response: any) {
    const contractRelay: IContractRelay = response.upgrade_reply;
    const namespace = contractRelay.namespace;
    const params: any = contractRelay.params;
    const hwContract = ContractFromNamespaceCogiChain(namespace);
    // approve
    const currencyContract = ContractFromNamespaceCogiChain("nemo_coin");
    const approve: IApprove = {
      contract: currencyContract,
      owner: descyptNEMOWallet(accountWeb?.nemo_address),
      spender: hwContract?.address,
      amount: toWei(params.fee),
    };
    await contractCallWithToast(
      hwContract,
      contractRelay.method,
      [
        parseInt(params.tokenid),
        params.cid,
        params.deadline,
        toWei(params.fee),
        params.signature,
      ],
      approve,
    )
      .then(async () => {
        setOnRequestUpgrade(false);
        Toast.success(t("event.upgrade_land_success"));
        reload();
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log(response, e);
        setOnRequestUpgrade(false);
      });
  }

  const upgradeLand = async () => {
    if (!upgradeInfo) return;
    // claim
    if (upgradeInfo?.current_point < upgradeInfo?.next_point) {
      Toast.error(t("event.not_enough_point"));
      return;
    }
    if (upgradeInfo?.fee > balanceNemo) {
      Toast.error(t("event.not_enough_nemo"));
      return;
    }
    if (upgradeInfo?.level === 8) {
      Toast.error(t("event.max_level_land"));
      return;
    }
    try {
      setOnRequestUpgrade(true);
      rpcExecCogiChain_Signer({
        method: "erc721_galix_land.request_upgradeland",
        params: {
          cid: land.cid.toString(),
        },
        endpoint: ENUM_ENDPOINT_RPC._GALIXCITY,
      })
        .then((res: any) => {
          performUpgradeLand(res);
        })
        .catch((e) => {
          Toast.error(e.message);
        });
    } catch (e: any) {
      Toast.error(e.message);
      setOnRequestUpgrade(false);
    }
  };

  const getInfoUpgrade = async () => {
    try {
      setUpgradeInfo(null);
      // get Fee Resource
      dispatchContractCallOnchainBalances();
      rpcExecCogiChain_Signer({
        method: "erc721_galix_land.get_upgradeinfo",
        params: {
          cid: land.cid.toString(),
        },
        endpoint: ENUM_ENDPOINT_RPC._GALIXCITY,
      })
        .then((res: any) => {
          setUpgradeInfo(res.upgradeinfo);
        })
        .catch((e) => {
          Toast.error(e.message);
        });
    } catch (e: any) {
      setUpgradeInfo(null);
      Toast.error(e.message);
    }
  };

  const getFeeResource = async () => {
    try {
      rpcExecCogiChain_Signer({
        method: "erc721_galix_land.get_claimawardfee",
        params: {
          cid: land.cid.toString(),
        },
        endpoint: ENUM_ENDPOINT_RPC._GALIXCITY,
      })
        .then((res: any) => {
          setFeeMintResources(res.data);
        })
        .catch((e) => {
          Toast.error(e.message);
        });
    } catch (e: any) {
      setFeeMintResources(null);
      Toast.error(e.message);
    }
  };

  useEffect(() => {
    if (!packageSelected || !resourceSelected) {
      return;
    }
    setFeeMint("");
    const feeResource = feeMintResources?.find(
      (e: any) => e.type === resourceSelected,
    );
    if (feeResource) {
      const packs = feeResource.packs;
      const fee = packs.find(
        (e: any) =>
          e.mintid.toString() ===
            "500000" +
              (
                (parseInt(resourceSelected) - 1) * 5 +
                packageSelected
              ).toString() ||
          e.mintid.toString() ===
            "5000000" +
              (
                (parseInt(resourceSelected) - 1) * 5 +
                packageSelected
              ).toString(),
      );
      if (fee) {
        const now = Math.floor(dayjs().valueOf() / 1000);
        if (fee.cdtime !== "" && fee.cdtime > now) {
          setTimeCountDownMintResource(fee.cdtime - now);
        } else {
          setTimeCountDownMintResource(null);
          clearTimeout(timeCDInsMintResource.current);
        }
        setFeeMint(fee);
      }
    }
  }, [packageSelected, resourceSelected]);

  const getValueResource = (type: any) => {
    let res = 0;
    if (feeMintResources) {
      const feeResource = feeMintResources?.find((e: any) => e.type === type);
      if (feeResource) {
        res = feeResource.amount;
      }
    }
    return formatTokenNumber(res);
  };

  const getValueResourceNotFormat = (type: any) => {
    let res = 0;
    if (feeMintResources) {
      const feeResource = feeMintResources?.find((e: any) => e.type === type);
      if (feeResource) {
        res = feeResource.amount;
      }
    }
    return res;
  };

  const getValuePackage = (type: any) => {
    let res = 0;
    if (cf_LST_PACKAGE_MINT_LAND) {
      const feeResource = cf_LST_PACKAGE_MINT_LAND?.find(
        (e) => e.metadataIndex === type,
      );
      if (feeResource) {
        res = feeResource.value;
      }
    }
    return res;
  };

  // const closeModalMint = () => {
  //   setOnActionClaimResource(false);
  //   setPackageSelected(null);
  //   setResourceSelected(null);
  //   setFeeMint(null);
  //   setTimeCountDownMintResource(null);
  //   setViewCountdown(false);
  // };

  return (
    <View
      style={{
        backgroundColor: colors.card,
        flex: 1,
        borderRadius: 12,
        marginBottom: 12,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: 40,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          padding: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
            {land.name}:{" "}
          </MyTextApp>
          <MyTextApp style={{ color: COLORS.neon, fontWeight: "bold" }}>
            #{land.landid}
          </MyTextApp>
        </View>
        {timeCountDownMysteryHouse > 0 && (
          <MyTextApp style={{ color: COLORS.yellow, fontWeight: "bold" }}>
            {t("event.mystery_house_after")}:
            {timeStampToTime(timeCountDownMysteryHouse)}
          </MyTextApp>
        )}
        <TouchableOpacity
          onPress={() => {
            changeTagFocus(land?.landid);
          }}
        >
          <FeatherIcon name="map" size={24} color={colors.title} />
        </TouchableOpacity>
      </View>
      <View style={{ padding: 8, gap: 8 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <Image
            source={LANDS[getRandomLandImage(land?.landid, land.level)]}
            style={{ width: 88, height: 88 }}
          />
          <View
            style={{ flex: 1, height: 88, justifyContent: "space-between" }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 10,
                backgroundColor: colors.background,
                borderRadius: 8,
              }}
            >
              <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
                {t("event.dev_point")}: {currencyFormat(land.dev_point)}
              </MyTextApp>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setOnActionUpgradeLand(true);
                  getInfoUpgrade();
                }}
              >
                <FeatherIcon
                  name="arrow-up-circle"
                  size={18}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 10,
                backgroundColor: colors.background,
                borderRadius: 8,
              }}
            >
              <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
                {t("event.comment")}: {land.comment}
              </MyTextApp>
              <FeatherIcon name="edit" size={18} color={colors.text} />
            </View>
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ width: "49%" }}>
            <MyTextApp
              style={{
                color: colors.title,
                fontWeight: "bold",
                backgroundColor: colors.background,
                width: "100%",
                textAlign: "center",
                paddingVertical: 6,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                borderWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              {t("event.resources")}
            </MyTextApp>
            <View
              style={{
                backgroundColor: colors.card2,
                gap: 8,
                alignItems: "center",
                paddingVertical: 8,
                borderWidth: 1,
                borderColor: colors.border,
                borderTopWidth: 0,
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Image
                  source={IMAGES.resource1}
                  style={{ width: 24, height: 24 }}
                />
                <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
                  {formatTokenNumber(land.unclaimed_crytal)}
                </MyTextApp>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Image
                  source={IMAGES.resource2}
                  style={{ width: 24, height: 24 }}
                />
                <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
                  {formatTokenNumber(land.unclaimed_metal)}
                </MyTextApp>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Image
                  source={IMAGES.resource3}
                  style={{ width: 24, height: 24 }}
                />
                <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
                  {formatTokenNumber(land.unclaimed_fuel)}
                </MyTextApp>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Image
                  source={IMAGES.resource4}
                  style={{ width: 24, height: 24 }}
                />
                <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
                  {formatTokenNumber(land.unclaimed_electricity)}
                </MyTextApp>
              </View>
            </View>
          </View>
          <View style={{ width: "49%", gap: 12 }}>
            <View>
              <MyTextApp
                style={{
                  color: colors.title,
                  fontWeight: "bold",
                  backgroundColor: colors.background,
                  width: "100%",
                  textAlign: "center",
                  paddingVertical: 6,
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  borderWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                {t("event.reward")}
              </MyTextApp>
              <View
                style={{
                  flexDirection: "row",
                  paddingVertical: 10,
                  justifyContent: "center",
                  backgroundColor: colors.card2,
                  alignItems: "center",
                  gap: 4,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderTopWidth: 0,
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                }}
              >
                <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
                  {formatTokenNumber(land.unclaimed_tokens, 3)}
                </MyTextApp>
                <Image source={ICONS.nemo} style={{ width: 16, height: 16 }} />
              </View>
            </View>
            <ButtonComponent
              title={t("event.claim")}
              color="transparent"
              textColor={colors.title}
              borderColor={colors.title}
              height={36}
              paddingVertical={0}
              onPress={() => {
                if (
                  isPendingNemo ||
                  flagPendingClaimToken ||
                  land?.status === STATUS_LAND.LANDSTATUS_LOCKED
                ) {
                  return;
                }
                claimToken();
              }}
            />
            <ButtonComponent
              title={t("event.mint")}
              color="transparent"
              textColor={colors.title}
              borderColor={colors.title}
              height={36}
              paddingVertical={0}
              onPress={() => {
                if (
                  isPendingResource ||
                  flagPendingClaimResource ||
                  land?.status === STATUS_LAND.LANDSTATUS_LOCKED
                ) {
                  return;
                }
                setOnActionClaimResource(true);
                getFeeResource();
              }}
            />
          </View>
        </View>
      </View>
      <ActionModalsComponent
        modalVisible={onActionClaimResource}
        closeModal={() => {
          setOnActionClaimResource(false);
        }}
        iconClose
      >
        <View
          style={{
            ...styles.modalContent,
            backgroundColor: colors.background,
          }}
        >
          <View style={{ position: "relative", width: "100%" }}>
            <MyTextApp
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: colors.title,
                textAlign: "center",
              }}
            >
              {t("event.mint_resource")}
            </MyTextApp>
          </View>
          <View style={{ gap: 24, width: "100%" }}>
            <View style={{ gap: 16 }}>
              <MyTextApp
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: colors.title,
                }}
              >
                {t("event.select_resource_mint")}
              </MyTextApp>
              <View style={{ gap: 8 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      width: "49%",
                      height: 48,
                      backgroundColor:
                        resourceSelected === "1" ? COLORS.primary : colors.card,
                      borderRadius: 8,
                    }}
                    activeOpacity={0.8}
                    onPress={() => {
                      setResourceSelected("1");
                    }}
                  >
                    <Image
                      source={IMAGES.resource1}
                      style={{ width: 24, height: 24 }}
                    />
                    <MyTextApp
                      style={{
                        color:
                          resourceSelected === "1"
                            ? COLORS.white
                            : colors.title,
                        fontWeight: "bold",
                      }}
                    >
                      {getValueResource(1)}
                    </MyTextApp>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      width: "49%",
                      height: 48,
                      backgroundColor:
                        resourceSelected === "2" ? COLORS.primary : colors.card,
                      borderRadius: 8,
                    }}
                    activeOpacity={0.8}
                    onPress={() => {
                      setResourceSelected("2");
                    }}
                  >
                    <Image
                      source={IMAGES.resource2}
                      style={{ width: 24, height: 24 }}
                    />
                    <MyTextApp
                      style={{
                        color:
                          resourceSelected === "2"
                            ? COLORS.white
                            : colors.title,
                        fontWeight: "bold",
                      }}
                    >
                      {getValueResource(2)}
                    </MyTextApp>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      width: "49%",
                      height: 48,
                      backgroundColor:
                        resourceSelected === "3" ? COLORS.primary : colors.card,
                      borderRadius: 8,
                    }}
                    activeOpacity={0.8}
                    onPress={() => {
                      setResourceSelected("3");
                    }}
                  >
                    <Image
                      source={IMAGES.resource3}
                      style={{ width: 24, height: 24 }}
                    />
                    <MyTextApp
                      style={{
                        color:
                          resourceSelected === "3"
                            ? COLORS.white
                            : colors.title,
                        fontWeight: "bold",
                      }}
                    >
                      {getValueResource(3)}
                    </MyTextApp>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      width: "49%",
                      height: 48,
                      backgroundColor:
                        resourceSelected === "4" ? COLORS.primary : colors.card,
                      borderRadius: 8,
                    }}
                    activeOpacity={0.8}
                    onPress={() => {
                      setResourceSelected("4");
                    }}
                  >
                    <Image
                      source={IMAGES.resource4}
                      style={{ width: 24, height: 24 }}
                    />
                    <MyTextApp
                      style={{
                        color:
                          resourceSelected === "4"
                            ? COLORS.white
                            : colors.title,
                        fontWeight: "bold",
                      }}
                    >
                      {getValueResource(4)}
                    </MyTextApp>
                  </TouchableOpacity>
                </View>
              </View>
              <MyTextApp style={{ color: colors.title, lineHeight: 20 }}>
                {t("event.mint_resource_descrip")}
              </MyTextApp>
            </View>
            <View style={{ gap: 16 }}>
              <MyTextApp
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: colors.title,
                }}
              >
                {t("event.specify_quantity_resources")}
              </MyTextApp>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 6,
                  height: 88,
                  alignContent: "space-between",
                }}
              >
                {cf_LST_PACKAGE_MINT_LAND.map((e, i) => (
                  <TouchableOpacity
                    key={i}
                    style={{
                      width: (SIZES.width - 68) / 3,
                      height: 40,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: COLORS.success_2,
                      justifyContent: "center",
                      backgroundColor:
                        e.metadataIndex === packageSelected
                          ? COLORS.success_2
                          : "transparent",
                    }}
                    onPress={() => {
                      setPackageSelected(e.metadataIndex);
                    }}
                    activeOpacity={0.8}
                  >
                    <MyTextApp
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color:
                          e.metadataIndex === packageSelected
                            ? COLORS.white
                            : COLORS.success_2,
                        textAlign: "center",
                      }}
                    >
                      {e.categories}
                    </MyTextApp>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={{ gap: 16, alignItems: "center", marginTop: 24 }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <MyTextApp
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: colors.title,
                  }}
                >
                  {t("event.fee")}: {formatTokenNumber(feeMint?.fee, 4)}
                </MyTextApp>
                <Image source={ICONS.nemo} style={{ width: 20, height: 20 }} />
              </View>
              <ButtonComponent
                title={t("event.mint")}
                color="transparent"
                borderColor={colors.title}
                textColor={colors.title}
                onPress={() => {
                  mintResource();
                }}
              />
            </View>
          </View>
        </View>
      </ActionModalsComponent>
      <ActionModalsComponent
        modalVisible={onActionUpgradeLand}
        closeModal={() => {
          setOnActionUpgradeLand(false);
        }}
        iconClose
      >
        <View
          style={{
            ...styles.modalContent,
            backgroundColor: colors.background,
          }}
        >
          <View style={{ position: "relative", width: "100%" }}>
            <MyTextApp
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: colors.title,
                textAlign: "center",
              }}
            >
              {t("event.land_upgrade")}
            </MyTextApp>
          </View>
          <View style={{ width: "70%", gap: 8 }}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <MyTextApp style={{ color: colors.title, fontSize: 16 }}>
                {t("event.land_level")}:
              </MyTextApp>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MyTextApp
                  style={{
                    color: COLORS.success_2,
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  {upgradeInfo?.current_level ?? 0}
                </MyTextApp>
                <FeatherIcon
                  name="arrow-right"
                  size={18}
                  color={COLORS.success_2}
                />
                <MyTextApp
                  style={{
                    color: COLORS.success_2,
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  {(upgradeInfo?.current_level ?? 0) + 1}
                </MyTextApp>
              </View>
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <MyTextApp style={{ color: colors.title, fontSize: 16 }}>
                {t("event.dev_point")}:
              </MyTextApp>
              <MyTextApp
                style={{
                  color: COLORS.success_2,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {formatTokenNumber(upgradeInfo?.current_point ?? 0)}/
                {formatTokenNumber(upgradeInfo?.next_point ?? 0)}
              </MyTextApp>
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <MyTextApp style={{ color: colors.title, fontSize: 16 }}>
                {t("event.nemo")}:
              </MyTextApp>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <MyTextApp
                  style={{
                    color: COLORS.success_2,
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  {formatTokenNumber(balanceNemo ?? 0)}/{upgradeInfo?.fee ?? 0}
                </MyTextApp>
                <Image source={ICONS.nemo} style={{ width: 18, height: 18 }} />
              </View>
            </View>
          </View>
          <ButtonComponent
            title={t("event.upgrade")}
            onProcessing={onRequestUpgrade}
            onClick={() => {
              if (
                !upgradeInfo ||
                upgradeInfo?.pending_upgradeland ||
                upgradeInfo?.current_point < upgradeInfo?.next_point ||
                upgradeInfo?.fee > balanceNemo
              ) {
                return;
              }
              upgradeLand();
            }}
            disabled={
              !upgradeInfo ||
              upgradeInfo?.pending_upgradeland ||
              upgradeInfo?.current_point < upgradeInfo?.next_point ||
              upgradeInfo?.fee > balanceNemo
            }
          />
        </View>
      </ActionModalsComponent>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#00000081",
    padding: 12,
  },
  modalContent: {
    margin: 20,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 20,
    alignItems: "center",
    width: SIZES.width - 32,
    gap: 24,
  },
  closeBtn: {
    position: "absolute",
    right: 0,
    top: 0,
  },
});
