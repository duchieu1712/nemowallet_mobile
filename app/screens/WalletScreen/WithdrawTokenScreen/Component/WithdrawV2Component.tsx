import * as AccountReducers from "../../../../modules/account/reducers";
import * as HotwalletActions from "../../../../modules/hotwallet/actions";
import * as HotwalletReducers from "../../../../modules/hotwallet/reducers";
import * as WalletActions from "../../../../modules/wallet/actions";
import * as WalletReducers from "../../../../modules/wallet/reducers";

import {
  COLORS,
  FONTS,
  ICONS,
  IMAGES,
  MyTextApp,
  SIZES,
} from "../../../../themes/theme";
import {
  ContractFromNamespace,
  ContractFromNamespaceCogiChain,
} from "../../../../modules/wallet/utilities";
import {
  type IApprove,
  type IBalanceData,
  type IChainData,
} from "../../../../common/types";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { TYPE_ACTION, TYPE_WITHDRAW } from "../../../../common/enum";
import {
  balancesFromHotwalletSaga,
  balancesFromWalletSaga,
} from "../../../../common/utilities_config";
import {
  contractCallNetwork_Eth,
  rpcExecCogiChain,
} from "../../../../components/RpcExec/toast_chain";
import {
  currencyFormat,
  descyptNEMOWallet,
  getContractBridge,
  getFeeWithdraw,
  getPoolBridge_Withdraw_V2,
  getSymbolCoin_Network,
  isAddress,
  roundDownNumber,
  sleep,
  toEther,
  toWei,
} from "../../../../common/utilities";
import { useDispatch, useSelector } from "react-redux";
import { useRoute, useTheme } from "@react-navigation/native";

import ActionModalsComponent from "../../../../components/ModalComponent/ActionModalsComponent";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import { ClassWithStaticMethod } from "../../../../common/static";
import { Contract } from "ethers";
import DropdownSelectCoinComponent from "../../Component/SelectCoinComponent";
import { GalixBridgeWithSupportingAbi } from "../../../../common/abi";
import InputComponent from "../../../../components/InputComponent";
import NetworkDropdownComponent from "../../Component/SelectNetworkComponent";
import { SwitchChainComponent } from "../../../../components/ModalComponent/ChainAccountModalComponent";
import Toast from "../../../../components/ToastInfo";
import cf_Chains from "../../../../config/chains";
import { cf_assetsCoinNative } from "../../../../config/assets";
import cf_coins from "../../../../config/coins";
import {
  cf_hotwalletsErc20,
  cf_hotwallets as hotwalletsConfig,
} from "../../../../config/kogi-api";
import { contractCallWithToastCogiChain } from "../../../../components/RpcExec/toast";
import { isEmpty } from "lodash";
import { useTranslation } from "react-i18next";

export default function WithdrawV2Component({
  navigation,
  isFilter,
}: {
  navigation: any;
  isFilter: any;
}) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const route = useRoute();
  const [data, setData] = useState<any>();

  // Account
  const accountWeb = useSelector(AccountReducers.dataAccount);
  const [addressInput, setAddressInput] = useState<any>(null);
  const [switchToChain, setSwitchToChain] = useState<IChainData | any>(null);
  const [valueAmount, setValueAmount] = useState("");
  const [coinSelected, setCoinSelected] = useState<any>(null);
  const [networkSelected, setNetworkSelected] = useState<any>(null);
  const [balanceAvailable, setBalanceAvailable] = useState("0");
  const [balancePending, setBalancePending] = useState(false);

  const [balances, setBalances] = useState<any[] | null>([]);
  const [balancesNative, setBalancesNative] = useState<any>(null);

  const [withdrawData, setWithdrawData] = useState(["", "", ""]);
  const [withdrawDataNative, setWithdrawDataNative] = useState(["", "", ""]);
  const [bridgePoolsSupporting, setBridgePoolsSupporting] = useState<any>(null);
  const [bridgePools, setBridgePools] = useState<any>(null);
  const [poolSelected, setPoolSelected] = useState<any>(null);
  const [symbol, setSymbol] = useState("");
  const [onActionSuccess, setOnActionSuccess] = useState(false);

  const chainID = useSelector(WalletReducers.selectedChainId);
  // const jsonrpc = useSelector(JsonrpcReducers.dump)
  const getBalancesResponse = useSelector(
    HotwalletReducers.getBalancesResponse,
  );
  const bridgePoolsReponse = useSelector(HotwalletReducers.bridgePoolResponse);
  const dispatch = useDispatch();
  // Account
  const dispatchGetBridgePools = () =>
    dispatch(HotwalletActions.getBridgePools(TYPE_WITHDRAW.WITHDRAW_AUTO));

  // balance USDT
  const contractCallResponse = useSelector(WalletReducers.contractCallResponse);
  const dispatchContractCallOnchainBalances = () => {
    cf_hotwalletsErc20.map((asset) => {
      dispatch(
        WalletActions.contractCall({
          namespace: asset.assetContractNamespace,
          method: "balanceOf",
          params: [descyptNEMOWallet(accountWeb?.nemo_address)],
        }),
      );
    });
  };

  useEffect(() => {
    if (!route.params) return;
    const { data }: any = route.params;
    setData(data);
  }, [route]);

  useEffect(() => {
    if (data) {
      setSymbol(data.symbol);
    } else {
      setSymbol("NEMO");
    }
  }, [data]);

  useEffect(() => {
    // onchain Balances
    let ret: IBalanceData[] = [];
    if (contractCallResponse !== null) {
      ret = balancesFromWalletSaga(contractCallResponse);
    }
    let temp = balances ? [...balances] : [];
    ret.map((e) => {
      temp = temp.filter(
        (b) =>
          b?.assetData?.contractNamespace !== e?.assetData?.contractNamespace,
      );
      temp?.push(e);
    });
    setBalances([...temp]);
  }, [contractCallResponse]);

  // balance Cogi
  const getBalanceNative = () => {
    rpcExecCogiChain({ method: "eth_getBalance", params: [] }).then(
      (res: any) => {
        let temp = balances ? [...balances] : [];
        temp = temp.filter(
          (e) =>
            e?.assetData?.contractNamespace !==
            cf_assetsCoinNative.contractNamespace,
        );
        temp?.push({
          assetData: cf_assetsCoinNative,
          balance: res,
        });
        setBalancesNative({
          assetData: cf_assetsCoinNative,
          balance: res,
        });
        setBalances([...temp]);
      },
    );
  };

  // balance NEMO
  const dispatchGetBalances = () => {
    const res = [];
    for (let i = 0; i < hotwalletsConfig.length; i++) {
      res.push(hotwalletsConfig[i].namespace);
    }
    dispatch(
      HotwalletActions.getBalances({
        namespaces: res,
      }),
    );
  };

  useEffect(() => {
    if (getBalancesResponse) {
      let temp = balances ? [...balances] : [];
      const ret = balancesFromHotwalletSaga(getBalancesResponse);
      ret.map((e) => {
        temp = temp.filter(
          (b) =>
            b?.assetData?.contractNamespace !== e?.assetData?.contractNamespace,
        );
        temp?.push(e);
      });
      setBalances([...temp]);
    }
  }, [getBalancesResponse]);

  //
  const getBalance = async () => {
    setBalances(null);
    getBalanceNative();
    await sleep(500);
    dispatchGetBalances();
    dispatchContractCallOnchainBalances();
  };

  const loadData = () => {
    getBalance();
    dispatchGetBridgePools();
  };

  const reload = () => {
    cleanup();
    getBalance();
    dispatchGetBridgePools();
  };

  const cleanup = () => {
    setValueAmount("");
    setBalances(null);
    setBridgePoolsSupporting(null);
  };

  useEffect(() => {
    setBridgePoolsSupporting(bridgePoolsReponse?.supporting_pools);
    setBridgePools(bridgePoolsReponse?.pools);
  }, [bridgePoolsReponse]);

  useEffect(() => {
    if (!accountWeb) return;
    loadData();
    if (symbol) {
      setCoinSelected(
        cf_coins.find(
          (e) =>
            e.symbol.toLowerCase() === symbol.toString().toLowerCase() &&
            e.chainID === ClassWithStaticMethod.NEMO_WALLET_CHAINID,
        ),
      );
    }
  }, [isFilter, symbol]);

  useEffect(() => {
    getBalanceAvailable();
    if (!coinSelected || !networkSelected) {
      setPoolSelected(null);
      return;
    }
    const pool = getPoolBridge_Withdraw_V2(
      bridgePoolsSupporting,
      ClassWithStaticMethod.NEMO_WALLET_CHAINID,
      coinSelected.contract,
      networkSelected,
    );
    setPoolSelected(pool);
  }, [networkSelected, coinSelected]);

  useEffect(() => {
    if (!balances) return;
    getBalanceAvailable();
  }, [balances]);

  useEffect(() => {
    if (!poolSelected) return;
    const max = toEther(poolSelected?.max_in_wei, coinSelected.decimals);
    if (Number(max) <= Number(valueAmount)) {
      setValueAmount("");
    }
  }, [poolSelected]);

  // const handleClickMax = () => {
  //   if (!poolSelected) {
  //     setValueAmount(balanceAvailable);
  //   } else {
  //     const max = toEther(poolSelected?.max_in_wei, coinSelected.decimals);
  //     if (Number(max) <= Number(balanceAvailable)) {
  //       setValueAmount(max);
  //     } else {
  //       setValueAmount(balanceAvailable);
  //     }
  //   }
  // };

  const getBalanceAvailable = () => {
    const coin: any = balances?.find(
      (e) => e?.assetData?.contractNamespace === coinSelected?.namespace,
    );
    if (coin) {
      if (
        coinSelected?.namespace === "nemo_coin" ||
        coinSelected?.namespace === "gosu_coin"
      ) {
        setBalanceAvailable(coin.balance);
        setBalancePending(coin?.pendingBalance > 0);
      } else {
        setBalanceAvailable(toEther(coin.balance));
        setBalancePending(false);
      }
    } else {
      setBalanceAvailable("0");
      setBalancePending(false);
    }
  };

  useEffect(() => {
    async function performSendERC20(
      namespace: any,
      symbol: any,
      amount: any,
      toAddress: any,
    ) {
      try {
        if (
          isEmpty(descyptNEMOWallet(toAddress)) ||
          !isAddress(descyptNEMOWallet(toAddress))
        ) {
          Toast.error(t("wallet.withdraw_screen.address_invalid"));
          return;
        }
        const assetContract = ContractFromNamespaceCogiChain(symbol);
        const hwContract = new Contract(
          poolSelected.address,
          GalixBridgeWithSupportingAbi,
        );
        const approve: IApprove = {
          contract: assetContract,
          owner: descyptNEMOWallet(accountWeb?.nemo_address),
          spender: hwContract?.address,
          amount: toWei(amount),
        };
        const params = [
          poolSelected?.destination?.token,
          poolSelected?.destination?.destination?.chain_id,
          descyptNEMOWallet(toAddress),
          toWei(amount),
        ];
        await contractCallWithToastCogiChain(
          hwContract,
          "sendERC20WithSupporting",
          params,
          approve,
        ).then(() => {
          setOnActionSuccess(true);
          getBalance();
          setValueAmount("");
          Toast.success("Withdraw is sucessfull!");
        });
      } catch (e) {
        Toast.error(e.message);
      }
    }

    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const [namespace, symbol, nameCoin, amount, toAddress] = withdrawData;
    const isWithdrawConfirm = parseFloat(amount ?? 0) > 0;

    // amountWithdraw:BigNumber, liquidity:BigNumber, toAddress

    if (isWithdrawConfirm) {
      if (chainID !== networkSelected?.chainId && networkSelected?.chainId) {
        ClassWithStaticMethod.SET_STATIC_DEFAULT_CHAINID(
          networkSelected?.chainId,
        );
        let chainChange;
        for (let i = 0; i < cf_Chains.length; i++) {
          if (
            cf_Chains[i].chainId ===
            ClassWithStaticMethod.STATIC_DEFAULT_CHAINID
          ) {
            chainChange = cf_Chains[i];
            break;
          }
        }
        setSwitchToChain(null);
        setSwitchToChain(chainChange);
        return;
      }
      getAmountLiquidity(symbol).then((amountLiquidityy) => {
        if (amountLiquidityy === -1) {
          Toast.error("Withdraw is Error!");
          setWithdrawData(["", "", ""]);
          return;
        }
        if (toWei(amount).gt(toWei(amountLiquidityy?.toString()))) {
          Toast.error(t("wallet.withdraw_scren.exceed_liquidity"));
          setWithdrawData(["", "", ""]);
          return;
        }

        performSendERC20(namespace, symbol, amount, toAddress);
        setWithdrawData(["", "", ""]);
      });
    }
  }, [withdrawData]);

  useEffect(() => {
    async function performSendNative(
      namespace: any,
      symbol: any,
      amount: any,
      toAddress: any,
    ) {
      try {
        if (!poolSelected) {
          Toast.error("An Error!");
        }
        const hwContract = new Contract(
          poolSelected.address,
          GalixBridgeWithSupportingAbi,
        );
        const params = [
          poolSelected?.destination?.destination?.chain_id,
          descyptNEMOWallet(toAddress),
        ];
        const options = {
          value: toWei(amount).toHexString(),
        };
        await contractCallWithToastCogiChain(
          hwContract,
          "sendETHWithSupporting",
          params,
          null,
          options,
        ).then(() => {
          setOnActionSuccess(true);
          getBalance();
          setValueAmount("");
          Toast.success(t("wallet.withdraw_success"));
        });
      } catch (e: any) {
        Toast.error(e.message);
      }
    }

    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const [namespace, symbol, nameCoin, amount, toAddress] = withdrawDataNative;
    const isWithdrawConfirm = parseFloat(amount ?? 0) > 0;

    if (isWithdrawConfirm) {
      // check network
      if (chainID !== networkSelected?.chainId && networkSelected?.chainId) {
        ClassWithStaticMethod.SET_STATIC_DEFAULT_CHAINID(
          networkSelected?.chainId,
        );
        let chainChange;
        for (let i = 0; i < cf_Chains.length; i++) {
          if (
            cf_Chains[i].chainId ===
            ClassWithStaticMethod.STATIC_DEFAULT_CHAINID
          ) {
            chainChange = cf_Chains[i];
            break;
          }
        }
        setSwitchToChain(null);
        setSwitchToChain(chainChange);
        return;
      }

      getAmountLiquidity(symbol).then((amountLiquidityy) => {
        if (amountLiquidityy === -1) {
          Toast.error(t("wallet.withdraw_screen.withdraw_error"));
          setWithdrawDataNative(["", "", ""]);
          return;
        }
        if (toWei(amount).gt(toWei(amountLiquidityy?.toString()))) {
          Toast.error("Exceed liquidity provider balance");
          setWithdrawDataNative(["", "", ""]);
          return;
        }

        performSendNative(namespace, symbol, amount, toAddress);
        setWithdrawDataNative(["", "", ""]);
      });
    }
  }, [withdrawDataNative]);

  const getAmountLiquidity = async (symbol: any) => {
    try {
      const assetContract = ContractFromNamespace(symbol);
      const coin = getSymbolCoin_Network(
        assetContract?.address,
        networkSelected?.chainId,
      );
      const hwContract = getContractBridge(
        bridgePools,
        networkSelected?.chainId,
        assetContract?.address,
      );
      return await contractCallNetwork_Eth(hwContract, "liquidity", [
        assetContract?.address?.toLowerCase(),
      ])
        .then((res: any) => {
          return toEther(res._hex, coin.decimals);
        })
        .catch((_) => {
          return -1;
        });
    } catch (_) {
      return -1;
    }
  };

  const checkEnableTx = () => {
    // return (
    //   coinSelected !== null &&
    //   networkSelected !== null &&
    //   (coinSelected?.symbol !== 'NEMO' ||
    //     networkSelected.chainId === ClassWithStaticMethod.NEMO_WALLET_CHAINID)
    // )
    return coinSelected !== null && networkSelected !== null;
  };

  const checkExistTransactionPending = (): boolean => {
    if (balancePending) return true;
    return false;
  };

  const checkPreventWithdrawToken = () => {
    // return false
    return (
      coinSelected?.symbol === "COGI" &&
      valueAmount >= toEther(balancesNative?.balance ?? 0)
    );
  };

  const getAmountWithdrawAfter = () => {
    let res = 0;
    try {
      const minFee =
        1 +
        parseFloat(valueAmount) -
        parseFloat(
          toEther(poolSelected?.destination?.destination?.minFees ?? 0),
        ) -
        1;
      const feePercent =
        (parseFloat(valueAmount) *
          (100 - (poolSelected?.destination?.destination?.fees ?? 0) * 100)) /
        100;
      res = minFee < feePercent ? minFee : feePercent;
    } catch (e) {
      res = parseFloat(valueAmount);
    }
    return res > 0 ? res : 0;
  };
  return (
    <ScrollView style={{ paddingHorizontal: 16, flex: 1 }}>
      <View style={{ ...styles.content, paddingTop: 16 }}>
        <MyTextApp style={{ ...styles.titleContent, color: colors.title }}>
          {t("wallet.token")}
        </MyTextApp>
        <DropdownSelectCoinComponent
          chainID={ClassWithStaticMethod.NEMO_WALLET_CHAINID}
          coinSelected={coinSelected}
          setCoinSelected={setCoinSelected}
          type={TYPE_ACTION.SEND}
        />
      </View>

      <View style={styles.content}>
        <MyTextApp style={{ ...styles.titleContent, color: colors.title }}>
          {t("wallet.network")}
        </MyTextApp>
        <NetworkDropdownComponent
          bridgePools={bridgePoolsSupporting}
          coinSelected={coinSelected}
          networkSelected={networkSelected}
          setNetworkSelected={setNetworkSelected}
          type={TYPE_ACTION.SEND}
          type_deposit_withdraw={TYPE_WITHDRAW.WITHDRAW_AUTO}
        />
      </View>
      <View style={styles.content}>
        <MyTextApp
          style={{
            ...styles.titleContent,
            position: "relative",
            color: colors.title,
          }}
        >
          {t("common.address")}
        </MyTextApp>
        <View style={{ position: "relative" }}>
          {/* <TextInput
            placeholder={t("common.address")}
            placeholderTextColor={COLORS.descriptionText}
            style={{ ...styles.textInput, backgroundColor: colors.input, color: colors.title }}
            value={addressInput}
            onChangeText={setAddressInput}
          /> */}
          <InputComponent
            placeholder={t("common.address")}
            placeholderTextColor={COLORS.descriptionText}
            style={{
              ...styles.textInput,
              backgroundColor: colors.input,
              color: colors.title,
              borderWidth: 0,
              height: 52,
            }}
            value={addressInput}
            onChangeText={(e: string) => {
              setAddressInput(e);
            }}
            showClear={false}
            height={52}
          />
        </View>
      </View>

      <View style={{ ...styles.content }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            columnGap: 12,
          }}
        >
          <MyTextApp style={{ ...styles.titleContent, color: colors.title }}>
            {t("wallet.amount")}
          </MyTextApp>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MyTextApp style={{ color: COLORS.descriptionText, ...FONTS.font }}>
              {t("wallet.balance")}:{" "}
            </MyTextApp>
            <MyTextApp
              style={{ color: colors.title, ...FONTS.font }}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {currencyFormat(roundDownNumber(balanceAvailable))}
            </MyTextApp>
          </View>
        </View>
        <View style={{ position: "relative" }}>
          <MyTextApp style={styles.max}>{t("wallet.max")}</MyTextApp>
          {/* <TextInput
            style={{
              ...styles.textInput,
              backgroundColor: colors.input,
              color: colors.title,
            }}
            inputMode="decimal"
            placeholder={
              !poolSelected
                ? t("common.enter_amount")
                : `${currencyFormat(
                    toEther(poolSelected?.min_in_wei, coinSelected.decimals)
                  )}-${currencyFormat(
                    toEther(poolSelected?.max_in_wei, coinSelected.decimals)
                  )}`
            }
            placeholderTextColor={COLORS.descriptionText}
            value={valueAmount}
            onChangeText={setValueAmount}
          /> */}
          <InputComponent
            style={{
              ...styles.textInput,
              backgroundColor: colors.input,
              color: colors.title,
              borderWidth: 0,
              height: 52,
            }}
            inputMode="decimal"
            placeholder={
              !poolSelected
                ? t("common.enter_amount")
                : `${currencyFormat(
                    toEther(poolSelected?.min_in_wei, coinSelected.decimals),
                  )}-${currencyFormat(
                    toEther(poolSelected?.max_in_wei, coinSelected.decimals),
                  )}`
            }
            placeholderTextColor={COLORS.descriptionText}
            value={valueAmount}
            onChangeText={setValueAmount}
            showClear={false}
            height={52}
          />
        </View>
      </View>

      <View
        style={[
          styles.content,
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          },
        ]}
      >
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexDirection: "row",
            columnGap: 12,
            flex: 1,
          }}
        >
          <View
            style={{
              alignItems: "flex-start",
              justifyContent: "center",
              flexWrap: "wrap",
              width: (SIZES.width - 56) / 3,
            }}
          >
            <MyTextApp
              style={{
                color: COLORS.descriptionText,
                ...FONTS.font,
                textTransform: "uppercase",
                fontWeight: "700",
                fontSize: 12,
              }}
            >
              {t("wallet.total_amount")}
            </MyTextApp>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: 8,
                // flexWrap: "wrap",
              }}
            >
              {coinSelected && (
                <Image
                  source={ICONS[coinSelected?.symbol?.toLowerCase()]}
                  alt=""
                  style={styles.icon_2}
                />
              )}
              <MyTextApp
                style={{ color: colors.title, ...FONTS.font, flex: 1 }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {currencyFormat(roundDownNumber(getAmountWithdrawAfter()))}{" "}
              </MyTextApp>
            </View>
          </View>

          <View
            style={{
              alignItems: "flex-start",
              justifyContent: "center",
              flexWrap: "wrap",
              width: (SIZES.width - 56) / 3,
            }}
          >
            <MyTextApp
              style={{
                color: COLORS.descriptionText,
                ...FONTS.font,
                textTransform: "uppercase",
                fontWeight: "700",
                fontSize: 12,
              }}
            >
              {t("wallet.network_fee")}
            </MyTextApp>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: 8,
                width: "100%",
                // flexWrap: "wrap",
              }}
            >
              <MyTextApp
                style={{
                  color: colors.title,
                  ...FONTS.font,
                  fontWeight: 700,
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {(poolSelected?.destination?.destination?.fees ?? 0) * 100}%{" "}
                <MyTextApp
                  style={{
                    fontWeight: 400,
                    color: colors.title,
                    ...FONTS.font,
                  }}
                >
                  ( {t("wallet.min")}:{" "}
                </MyTextApp>
                {coinSelected && (
                  <Image
                    source={ICONS[coinSelected?.symbol?.toLowerCase()]}
                    alt=""
                    style={styles.icon_2}
                  />
                )}
                <MyTextApp style={{ color: colors.title, fontWeight: 700 }}>
                  {getFeeWithdraw(poolSelected)}{" "}
                </MyTextApp>
                <MyTextApp style={{ color: colors.title }}>)</MyTextApp>
              </MyTextApp>
            </View>
          </View>

          <View
            style={{
              alignItems: "flex-start",
              justifyContent: "center",
              flexWrap: "wrap",
              width: (SIZES.width - 56) / 3,
            }}
          >
            <MyTextApp
              style={{
                color: COLORS.descriptionText,
                ...FONTS.font,
                textTransform: "uppercase",
                fontWeight: "700",
                fontSize: 12,
              }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {t("wallet.fee_gas")}
            </MyTextApp>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: 8,
                width: "100%",
                // flexWrap: "wrap",
              }}
            >
              <Image source={ICONS.cogi} alt="" style={[styles.icon_2]} />
              <MyTextApp
                style={{
                  color: colors.title,
                  ...FONTS.font,
                  flex: 1,
                  fontWeight: "700",
                }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                0.06879
              </MyTextApp>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.line}></View>
      <ButtonComponent
        title={t("onboard.next")}
        height={48}
        disabled={
          !checkEnableTx() ||
          checkExistTransactionPending() ||
          checkPreventWithdrawToken()
        }
        onPress={() => {
          if (
            !checkEnableTx() ||
            checkExistTransactionPending() ||
            checkPreventWithdrawToken()
          ) {
            return;
          }
          if (
            parseFloat(valueAmount) <
              parseFloat(toEther(poolSelected?.min_in_wei)) ||
            parseFloat(valueAmount) >
              parseFloat(toEther(poolSelected?.max_in_wei))
          ) {
            Toast.error(t("wallet.withdraw_screen.amount_invalid"));
            return;
          }
          if (!isAddress(addressInput)) {
            Toast.error(t("wallet.withdraw_screen.address_invalid"));
            return;
          }
          if (coinSelected.native) {
            setWithdrawDataNative([
              coinSelected.contractBridge,
              coinSelected?.namespace,
              coinSelected.symbol,
              valueAmount?.toString(),
              addressInput,
            ]);
          } else {
            setWithdrawData([
              coinSelected.contractBridge,
              coinSelected?.namespace,
              coinSelected.symbol,
              valueAmount?.toString(),
              addressInput,
            ]);
          }
        }}
      />
      <MyTextApp style={styles.textWarning}>
        {t("wallet.wallet_address_withdraw_notify")}
      </MyTextApp>
      <SwitchChainComponent
        switchToChain={switchToChain}
        setSwitchToChain={setSwitchToChain}
      />

      <ActionModalsComponent
        modalVisible={onActionSuccess}
        closeModal={() => {
          reload();
          setOnActionSuccess(false);
        }}
        iconClose
        positionIconClose={{
          right: 20,
          top: 0,
        }}
      >
        <View
          style={{
            width: "90%",
            maxWidth: 350,
            backgroundColor: colors.card,
            paddingVertical: 24,
            paddingHorizontal: 16,
            borderRadius: 12,
            gap: 8,
            alignItems: "center",
          }}
        >
          <Image source={IMAGES.success} alt="" />
          <MyTextApp
            style={{
              fontSize: 20,
              ...FONTS.fontBold,
              color: COLORS.success_2,
            }}
          >
            {t("common.complete")}
          </MyTextApp>
          <MyTextApp style={{ color: colors.title }}>
            {t("common.congrates")} !
          </MyTextApp>
          <MyTextApp style={{ color: colors.title }}>
            {t("wallet.withdraw_screen.tx_submited")}
          </MyTextApp>
          <MyTextApp style={{ color: colors.title }}>
            {t("wallet.withdraw_screen.wait_to_update")}
          </MyTextApp>
          <ButtonComponent
            title={t("wallet.nemo_wallet")}
            style={{ marginTop: 16 }}
            onPress={() => {
              setOnActionSuccess(false);
              navigation.replace("DrawerNavigation");
            }}
          />
        </View>
      </ActionModalsComponent>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textTab: {
    color: "#fff",
    ...FONTS.font,
  },
  content: {
    width: "100%",
    flex: 1,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  titleContent: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  icon_2: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  textInput: {
    color: COLORS.white,
    backgroundColor: COLORS.backgroundInput,
    paddingVertical: 13,
    paddingLeft: 16,
    paddingRight: 60,
    borderRadius: 8,
    ...FONTS.font,
    marginTop: 8,
    width: "100%",
    flex: 1,
  },
  max: {
    position: "absolute",
    right: 16,
    top: 24,
    zIndex: 2,
    color: COLORS.warning,
    ...FONTS.font,
    textTransform: "uppercase",
    ...FONTS.fontBold,
  },
  line: {
    marginBottom: 32,
    height: 1,
    width: "100%",
    backgroundColor: COLORS.borderColor,
  },
  textWarning: {
    color: COLORS.danger,
    textAlign: "center",
    marginTop: 12,
    fontSize: 12,
    lineHeight: 18,
  },
});
