import * as AccountReducers from "../../../../modules/account/reducers";
import * as HotwalletActions from "../../../../modules/hotwallet/actions";
import * as HotwalletReducers from "../../../../modules/hotwallet/reducers";
import * as WalletActions from "../../../../modules/wallet/actions";
import * as WalletReducers from "../../../../modules/wallet/reducers";

import {
  COLORS,
  FONTS,
  ICONS,
  MyTextApp,
  SIZES,
} from "../../../../themes/theme";
import {
  ContractFromNamespace,
  ContractFromNamespaceCogiChain,
} from "../../../../modules/wallet/utilities";
import {
  DEFAULT_CHAINID,
  MAX_GAS_FEE,
  MAX_STEP_WITHDRAW,
  TIME_STEP,
} from "../../../../common/constants";
import {
  type IApprove,
  type IBalanceData,
  type IChainData,
} from "../../../../common/types";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { RESPONSE, TYPE_ACTION, TYPE_WITHDRAW } from "../../../../common/enum";
import React, { useEffect, useState } from "react";
import {
  balancesFromHotwalletSaga,
  balancesFromWalletSaga,
} from "../../../../common/utilities_config";
import {
  cf_hotwalletsErc20,
  cf_hotwallets as hotwalletsConfig,
} from "../../../../config/kogi-api";
import {
  contractCallNetwork_Eth,
  contractCogiChain_sendRawTransaction,
  rpcExecCogiChain,
} from "../../../../components/RpcExec/toast_chain";
import {
  contractCallWithToastCogiChain,
  contractCallWithToast_NetworkETH,
} from "../../../../components/RpcExec/toast";
import {
  currencyFormat,
  descyptNEMOWallet,
  getContractBridge,
  getNamespaceWithdraw_Deposit,
  getPoolBridge,
  getSymbolCoin_Network,
  isAddress,
  roundDownNumber,
  sleep,
  toEther,
  toWei,
} from "../../../../common/utilities";
import { useDispatch, useSelector } from "react-redux";
import { useRoute, useTheme } from "@react-navigation/native";

import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import { ClassWithStaticMethod } from "../../../../common/static";
import ConfirmSendToken from "../../Component/ConfirmSendTokenComponent";
import DropdownSelectCoinComponent from "../../Component/SelectCoinComponent";
import InputComponent from "../../../../components/InputComponent";
import NetworkDropdownComponent from "../../Component/SelectNetworkComponent";
import { SwitchChainComponent } from "../../../../components/ModalComponent/ChainAccountModalComponent";
import Toast from "../../../../components/ToastInfo";
import WalletConnectButtonComponent from "../../../../components/ButtonComponent/WalletConnectButtonComponent";
import cf_Chains from "../../../../config/chains";
import { cf_assetsCoinNative } from "../../../../config/assets";
import cf_coins from "../../../../config/coins";
import { isEmpty } from "lodash";
import { useTranslation } from "react-i18next";

export default function WithdrawV1Component({
  navigation,
  isFilter,
  dataQr,
}: {
  navigation?: any;
  isFilter: any;
  dataQr: any;
}) {
  const route = useRoute();
  const [data, setData] = useState<any>();

  const { t } = useTranslation();

  const [networkSelected, setNetworkSelected] = useState<any>(null);

  const [bridgePools, setBridgePools] = useState<any>(null);
  const [balanceAvailable, setBalanceAvailable] = useState("0");
  const [balancePending, setBalancePending] = useState(false);
  const [balances, setBalances] = useState<any>([]);
  const [balancesNative, setBalancesNative] = useState<any>(null);
  const { colors } = useTheme();

  useEffect(() => {
    if (!route.params) return;
    const { data }: any = route.params;
    setData(data);
  }, [route]);

  useEffect(() => {
    if (!dataQr) return;
    setValueAmount(dataQr.amount);
    setNetworkSelected(cf_Chains.find((e) => e.chainId === dataQr.network));
    setAddressInput(dataQr.address);
  }, [dataQr]);

  const accountWeb = useSelector(AccountReducers.dataAccount);
  const [switchToChain, setSwitchToChain] = useState<IChainData | any>(null);
  const [txSendToken, setTxSendToken] = useState<any>(null);
  const [valueAmount, setValueAmount] = useState<any>(null);
  const [addressInput, setAddressInput] = useState<any>(null);
  const [onAction, setOnAction] = useState(false);
  const [valueStep, setValueStep] = useState(0);
  const [coinSelected, setCoinSelected] = useState<any>(null);
  const [transferData, setTransferData] = useState(["", "", ""]);
  const [withdrawData, setWithdrawData] = useState(["", "", ""]);
  const [withdrawDataNative, setWithdrawDataNative] = useState(["", "", ""]);
  const [symbol, setSymbol] = useState("");
  const [poolSelected, setPoolSelected] = useState<any>(null);

  const account: string = useSelector(WalletReducers.selectedAddress);
  const chainID = useSelector(WalletReducers.selectedChainId);
  const getBalancesResponse = useSelector(
    HotwalletReducers.getBalancesResponse,
  );
  const bridgePoolsReponse = useSelector(HotwalletReducers.bridgePoolResponse);
  const dispatch = useDispatch();
  // Account
  // const accountWeb = useSelector(AccountReducers.dataAccount)
  const dispatchGetBridgePools = () =>
    dispatch(HotwalletActions.getBridgePools(TYPE_WITHDRAW.WITHDRAW));
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
    setBridgePools(null);
  };

  useEffect(() => {
    if (data) {
      setSymbol(data.symbol);
    } else {
      setSymbol("NEMO");
    }
  }, [data]);

  useEffect(() => {
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
    const pool = getPoolBridge(
      bridgePools,
      ClassWithStaticMethod.NEMO_WALLET_CHAINID,
      coinSelected.contract,
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

  const handleClickMax = () => {
    if (!poolSelected) {
      setValueAmount(balanceAvailable);
    } else {
      const max = toEther(poolSelected?.max_in_wei, coinSelected.decimals);
      // if (Number(max) <= Number(valueAmount)) {
      if (Number(max) <= Number(balanceAvailable)) {
        setValueAmount(max);
      } else {
        setValueAmount(balanceAvailable);
      }
    }
  };

  const getBalanceAvailable = () => {
    const coin: any = balances?.find(
      (e: any) => e?.assetData?.contractNamespace === coinSelected?.namespace,
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
    async function performTransferERC20(
      namespace: any,
      symbol: any,
      amount: any,
      toAddress: any,
    ) {
      try {
        if (isEmpty(toAddress) || !isAddress(toAddress)) {
          Toast.error("NEMO Wallet is invalid!");
          return;
        }
        if (isEmpty(amount)) {
          Toast.error(t("wallet.withdraw_screen.amount_invalid"));
          return;
        }
        setOnAction(true);
        setValueStep(2);
        if (namespace === "cogi_coin") {
          rpcExecCogiChain({
            method: "eth_sendRawTransaction",
            params: [
              {
                to: toAddress,
                value: toWei(amount)?.toHexString(),
              },
            ],
            _2fa: accountWeb?.google_two_factor_authentication,
            _pin: true,
            callback: (res: any, flagResponse: any) => {
              if (flagResponse === RESPONSE.SUCCESS) {
                setValueStep(3);
                reload();
                Toast.success(`Transfer ${symbol} is successful!`);
              } else {
                setValueStep(4);
                Toast.error(res.message);
              }
            },
          });
        } else {
          const contract = ContractFromNamespaceCogiChain(namespace);
          contractCogiChain_sendRawTransaction(
            contract,
            "transfer",
            [toAddress, toWei(amount)],
            null,
            (res: any, flagResponse: any) => {
              if (flagResponse === RESPONSE.SUCCESS) {
                setValueAmount("");
                setValueStep(3);
                reload();
                Toast.success(`Transfer ${symbol} is successful!`);
              } else {
                setValueStep(4);
                Toast.error(res.message);
              }
            },
          );
        }
      } catch (e: any) {
        Toast.error(e.message);
      }
    }
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const [namespace, symbol, address, amount] = transferData;
    const isTransferConfirm = parseFloat(amount) > 0;
    if (isTransferConfirm) {
      performTransferERC20(
        namespace,
        symbol,
        amount,
        descyptNEMOWallet(address),
      );
      setTransferData(["", "", ""]);
    }
  }, [transferData]);

  // USDT, NEMO
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
          Toast.error("Address is invalid!");
          return;
        }
        const assetContract = ContractFromNamespaceCogiChain(symbol);
        const hwContract = getContractBridge(
          bridgePools,
          ClassWithStaticMethod.NEMO_WALLET_CHAINID,
          assetContract.address,
        );
        const approve: IApprove = {
          contract: assetContract,
          owner: descyptNEMOWallet(accountWeb?.nemo_address),
          spender: hwContract?.address,
          amount: toWei(amount),
        };
        const params = [
          assetContract.address,
          ClassWithStaticMethod.STATIC_DEFAULT_CHAINID,
          toAddress,
          toWei(amount),
        ];
        setOnAction(true);
        setValueStep(0);
        await contractCallWithToastCogiChain(
          hwContract,
          "sendERC20",
          params,
          approve,
        )
          .then(async (res: any) => {
            setValueStep(1);
            // await sleep(TIME_SLEEP)
            let step = 0;
            const interval = setInterval(() => {
              step++;
              if (step > MAX_STEP_WITHDRAW) {
                clearInterval(interval);
                return;
              }
              const namespaceWithdraw =
                getNamespaceWithdraw_Deposit(DEFAULT_CHAINID);
              rpcExecCogiChain({
                method: `${namespaceWithdraw}.extract_proof`,
                params: [res],
              })
                .then((ress: any) => {
                  clearInterval(interval);
                  const contractRelay = ress.contract_relay;
                  if (account.toLowerCase() === toAddress?.toLowerCase()) {
                    setValueStep(2);
                    setTxSendToken(contractRelay.params.txhash);
                    // const hwContractReceive = ContractFromNamespace(namespace)
                    const hwContractReceive = getContractBridge(
                      bridgePools,
                      ClassWithStaticMethod.STATIC_DEFAULT_CHAINID,
                      contractRelay.params.token,
                    );
                    const paramsReceiveERC20 = [
                      contractRelay.params.token,
                      contractRelay.params.receiver,
                      contractRelay.params.txhash,
                      contractRelay.params.amount,
                      contractRelay.params.signatures,
                    ];
                    contractCallWithToast_NetworkETH(
                      hwContractReceive,
                      contractRelay.method,
                      paramsReceiveERC20,
                    )
                      .then(async (_) => {
                        setValueAmount("");
                        getBalance();
                        setValueStep(3);
                      })
                      .catch(() => {
                        setValueStep(4);
                      });
                  } else {
                    setValueStep(4);
                  }
                })
                .catch((e) => {
                  if (step === MAX_STEP_WITHDRAW) {
                    setValueStep(4);
                    Toast.error(e.message);
                  }
                });
            }, TIME_STEP);
          })
          .catch((_) => {
            setValueStep(4);
          });
      } catch (e: any) {
        setValueStep(4);
        Toast.error(e.message);
      }
    }
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const [namespace, symbol, nameCoin, amount] = withdrawData;
    const isWithdrawConfirm = parseFloat(amount ?? 0) > 0;

    if (isWithdrawConfirm) {
      if (chainID !== ClassWithStaticMethod.STATIC_DEFAULT_CHAINID) {
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
          // if (Number(amount) > Number(amountLiquidityy?.toString())) {
          Toast.error("Exceed liquidity provider balance");
          setWithdrawData(["", "", ""]);
          return;
        }

        performSendERC20(namespace, symbol, amount, account);
        setWithdrawData(["", "", ""]);
      });
    }
  }, [withdrawData]);

  // COGI
  useEffect(() => {
    async function performSendNative(namespace, symbol, amount, toAddress) {
      try {
        const assetContract = ContractFromNamespaceCogiChain(symbol);
        const hwContract = getContractBridge(
          bridgePools,
          ClassWithStaticMethod.NEMO_WALLET_CHAINID,
          assetContract.address,
        );
        const params = [
          ClassWithStaticMethod.STATIC_DEFAULT_CHAINID,
          toAddress,
        ];
        const options = {
          value: toWei(amount).toHexString(),
        };
        setOnAction(true);
        setValueStep(1);
        await contractCallWithToastCogiChain(
          hwContract,
          "sendETH",
          params,
          null,
          options,
        )
          .then(async (res: any) => {
            setValueStep(2);
            // await sleep(TIME_SLEEP)
            let step = 0;
            const interval = setInterval(() => {
              step++;
              if (step > MAX_STEP_WITHDRAW) {
                clearInterval(interval);
                return;
              }
              const assetContractReceive = ContractFromNamespace(symbol);
              const namespaceWithdraw = getNamespaceWithdraw_Deposit(
                ClassWithStaticMethod.STATIC_DEFAULT_CHAINID,
              );
              const hwContractReceive = getContractBridge(
                bridgePools,
                ClassWithStaticMethod.STATIC_DEFAULT_CHAINID,
                assetContractReceive.address,
              );
              rpcExecCogiChain({
                method: `${namespaceWithdraw}.extract_proof`,
                params: [res],
              })
                .then((ress: any) => {
                  clearInterval(interval);
                  setValueStep(3);
                  const contractRelay = ress.contract_relay;
                  const paramsReceiveERC20 = [
                    contractRelay.params.token,
                    contractRelay.params.receiver,
                    contractRelay.params.txhash,
                    contractRelay.params.amount,
                    contractRelay.params.signatures,
                  ];
                  contractCallWithToast_NetworkETH(
                    hwContractReceive,
                    contractRelay.method,
                    paramsReceiveERC20,
                  )
                    .then(async (_: any) => {
                      getBalance();
                      setValueAmount("");
                      setValueStep(3);
                      Toast.success("Withdraw is sucessfull!");
                    })
                    .catch(() => {
                      setValueStep(4);
                    });
                })
                .catch((e) => {
                  if (step === MAX_STEP_WITHDRAW) {
                    setValueStep(4);
                    Toast.error(e.message);
                  }
                });
            }, TIME_STEP);
          })
          .catch((e) => {
            setValueStep(4);
            // eslint-disable-next-line no-console
            console.log(e);
          });
      } catch (e: any) {
        setValueStep(4);
        Toast.error(e.message);
      }
    }
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const [namespace, symbol, nameCoin, amount] = withdrawDataNative;
    const isWithdrawConfirm = parseFloat(amount ?? 0) > 0;

    if (isWithdrawConfirm) {
      if (chainID !== ClassWithStaticMethod.STATIC_DEFAULT_CHAINID) {
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
          setWithdrawDataNative(["", "", ""]);
          return;
        }
        if (toWei(amount).gt(toWei(amountLiquidityy?.toString()))) {
          Toast.error("Exceed liquidity provider balance");
          setWithdrawDataNative(["", "", ""]);
          return;
        }

        performSendNative(namespace, symbol, amount, account);
        setWithdrawDataNative(["", "", ""]);
      });
    }
  }, [withdrawDataNative]);

  const getAmountLiquidity = async (symbol) => {
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
        .catch((_: any) => {
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
    // return (
    //   coinSelected?.symbol === 'COGI' &&
    //   valueAmount >= toEther(balancesNative?.balance ?? 0)
    // )
    return (
      coinSelected?.symbol === "COGI" &&
      valueAmount >= toEther(balancesNative?.balance ?? 0)
    );
  };

  // const searchEmailToWithdraw = () => {
  //   rpcExecCogiChainNotEncodeParam({
  //     method: 'account.public_account_info',
  //     params: [getEL('#to__Email')?.value?.toString()?.trim()?.toLowerCase()],
  //   })
  //     .then((res: any) => {
  //       // AN-NEMO-WALLET
  //       // getEL('#to_Address').value = descyptNEMOWallet(res?.nemo_address ?? '')
  //       getEL('#to_Address').value = res?.nemo_address ?? ''
  //     })
  //     .catch((error: any) => {
  //       Toast.error(error.message)
  //       getEL('#to_Address').value = ''
  //     })
  // }

  return (
    <ScrollView
      style={{ ...styles.container, backgroundColor: colors.background }}
    >
      <View style={styles.content}>
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
          bridgePools={bridgePools}
          coinSelected={coinSelected}
          networkSelected={networkSelected}
          setNetworkSelected={setNetworkSelected}
          type={TYPE_ACTION.SEND}
          type_deposit_withdraw={TYPE_WITHDRAW.WITHDRAW}
        />
      </View>

      {networkSelected?.chainId ===
      ClassWithStaticMethod.NEMO_WALLET_CHAINID ? (
        <View style={styles.content}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              columnGap: 12,
            }}
          >
            <MyTextApp
              style={{
                ...styles.titleContent,
                marginBottom: 8,
                color: colors.title,
              }}
            >
              {t("common.address")}
            </MyTextApp>
          </View>
          <View style={{ position: "relative" }}>
            {/* <TextInput
              style={{
                ...styles.textInput,
                backgroundColor: colors.input,
                color: colors.title,
              }}
              inputMode="decimal"
              placeholder="NEMO address"
              placeholderTextColor={COLORS.descriptionText}
              value={addressInput}
              maxLength={28}
              onChangeText={setAddressInput}
            /> */}
            <InputComponent
              style={{
                ...styles.textInput,
                backgroundColor: colors.input,
                color: colors.title,
                borderWidth: 0,
                height: 52,
              }}
              placeholder="NEMO address"
              placeholderTextColor={COLORS.descriptionText}
              value={addressInput}
              maxLength={28}
              onChangeText={(e: string) => {
                setAddressInput(e);
              }}
            />
          </View>
        </View>
      ) : (
        <WalletConnectButtonComponent />
      )}

      <View style={{ ...styles.content, marginTop: 16 }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            columnGap: 12,
          }}
        >
          <MyTextApp
            style={{
              ...styles.titleContent,
              marginBottom: 8,
              color: colors.title,
            }}
          >
            {t("wallet.amount")}
          </MyTextApp>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <MyTextApp style={{ color: colors.text, ...FONTS.font }}>
              {t("wallet.balance")}:{" "}
            </MyTextApp>
            <MyTextApp
              style={{ color: colors.title, ...FONTS.font }}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {!isEmpty(data) ? data?.amount.shortBalance : balanceAvailable}
            </MyTextApp>
          </View>
        </View>
        <View style={{ position: "relative" }}>
          <MyTextApp style={styles.max} onPress={handleClickMax}>
            {t("wallet.max")}
          </MyTextApp>
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
                    toEther(poolSelected?.min_in_wei, coinSelected?.decimals)
                  )}-${currencyFormat(
                    toEther(poolSelected?.max_in_wei, coinSelected?.decimals)
                  )}`
            }
            placeholderTextColor={COLORS.descriptionText}
            value={valueAmount}
            maxLength={28}
            onChangeText={(e) => {
              if (e.length > 28) {
                e = e.slice(0, 28);
              }
              if (isEmpty(e)) {
                setValueAmount("");
              } else {
                setValueAmount(parseFloat(e));
              }
              console.log(valueAmount);
            }}
          /> */}
          <InputComponent
            style={{
              ...styles.textInput,
              backgroundColor: colors.input,
              color: colors.title,
              height: 52,
              borderWidth: 0,
            }}
            inputMode="decimal"
            placeholder={
              !poolSelected
                ? t("common.enter_amount")
                : `${currencyFormat(
                    toEther(poolSelected?.min_in_wei, coinSelected?.decimals),
                  )}-${currencyFormat(
                    toEther(poolSelected?.max_in_wei, coinSelected?.decimals),
                  )}`
            }
            placeholderTextColor={COLORS.descriptionText}
            value={valueAmount}
            maxLength={28}
            onChangeText={(e: string) => {
              if (e.length > 28) {
                e = e.slice(0, 28);
              }
              if (isEmpty(e)) {
                setValueAmount("");
              } else {
                setValueAmount(parseFloat(e));
              }
              console.log(valueAmount);
            }}
            showClear={false}
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
              <Image
                source={ICONS[coinSelected?.symbol?.toLowerCase()]}
                alt=""
                style={[styles.icon_2]}
              />
              <MyTextApp
                style={{ color: colors.title, ...FONTS.font, flex: 1 }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {currencyFormat(
                  roundDownNumber(
                    (valueAmount * (100 - (poolSelected?.fee ?? 0))) / 100,
                    3,
                  ),
                )}
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
              <Image
                source={ICONS[coinSelected?.symbol?.toLowerCase()]}
                alt=""
                style={[styles.icon_2]}
              />
              <MyTextApp
                style={{ color: colors.title, ...FONTS.font, flex: 1 }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {currencyFormat(
                  roundDownNumber(valueAmount * (poolSelected?.fee ?? 0), 3),
                )}
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
                style={{ color: colors.title, ...FONTS.font, flex: 1 }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {MAX_GAS_FEE}
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
            networkSelected?.chainId ===
            ClassWithStaticMethod.NEMO_WALLET_CHAINID
          ) {
            if (
              addressInput?.toLowerCase() ===
              descyptNEMOWallet(accountWeb?.nemo_address)?.toLowerCase()
            ) {
              Toast.error("Can't transfer token to your own wallet!");
              return;
            }
            setTransferData([
              coinSelected?.namespace,
              coinSelected.symbol,
              addressInput,
              valueAmount?.toString(),
            ]);
          } else {
            if (
              valueAmount < parseFloat(toEther(poolSelected?.min_in_wei)) ||
              valueAmount > parseFloat(toEther(poolSelected?.max_in_wei))
            ) {
              Toast.error(t("wallet.withdraw_screen.amount_invalid"));
              return;
            }
            if (coinSelected.native) {
              setWithdrawDataNative([
                coinSelected.contractBridge,
                coinSelected?.namespace,
                coinSelected.symbol,
                valueAmount?.toString(),
              ]);
            } else {
              setWithdrawData([
                coinSelected.contractBridge,
                coinSelected?.namespace,
                coinSelected.symbol,
                valueAmount?.toString(),
              ]);
            }
          }
        }}
      />
      <SwitchChainComponent
        switchToChain={switchToChain}
        setSwitchToChain={setSwitchToChain}
      />
      <ConfirmSendToken
        tx={txSendToken}
        onAction={onAction}
        setOnAction={setOnAction}
        valueStep={valueStep}
        setValueStep={setValueStep}
        navigation={navigation}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: COLORS.darkBackground,
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
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginTop: 16,
  },
  textTab: {
    color: "#fff",
    ...FONTS.font,
  },
  content: {
    width: "100%",
    flex: 1,
    marginBottom: 24,
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
    // paddingVertical: 13,
    paddingLeft: 16,
    paddingRight: 60,
    borderRadius: 8,
    ...FONTS.font,
    // marginTop: 8,
    width: "100%",
    flex: 1,
  },
  max: {
    position: "absolute",
    right: 16,
    top: 16,
    zIndex: 2,
    textTransform: "uppercase",
    color: COLORS.warning,
    ...FONTS.font,
    ...FONTS.fontBold,
  },
  line: {
    marginBottom: 32,
    height: 1,
    width: "100%",
    backgroundColor: COLORS.borderColor,
  },
});
