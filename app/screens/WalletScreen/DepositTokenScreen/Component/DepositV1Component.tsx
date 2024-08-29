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
  type IApprove,
  type IBalanceData,
  type IChainData,
} from "../../../../common/types";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { TYPE_ACTION, TYPE_DEPOSIT } from "../../../../common/enum";
import {
  currencyFormat,
  descyptNEMOWallet,
  getContractBridge,
  getPoolBridge,
  roundDownNumber,
  toEther,
  toWei,
} from "../../../../common/utilities";
import {
  // cf_hotwallets as hotwalletsConfig,
  cf_hotwalletsReceiveToken,
} from "../../../../config/kogi-api";
import { useDispatch, useSelector } from "react-redux";
import { useRoute, useTheme } from "@react-navigation/native";

import ActionModalsComponent from "../../../../components/ModalComponent/ActionModalsComponent";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import cf_Chains from "../../../../config/chains";
import { ClassWithStaticMethod } from "../../../../common/static";
import { ContractFromNamespace } from "../../../../modules/wallet/utilities";
import DropdownSelectCoinComponent from "../../Component/SelectCoinComponent";
import InputComponent from "../../../../components/InputComponent";
import { MAX_GAS_FEE } from "../../../../common/constants";
import NetworkDropdownComponent from "../../Component/SelectNetworkComponent";
import { SwitchChainComponent } from "../../../../components/ModalComponent/ChainAccountModalComponent";
import Toast from "../../../../components/ToastInfo";
import WalletConnectButtonComponent from "../../../../components/ButtonComponent/WalletConnectButtonComponent";
import { cf_assetsCoinNative } from "../../../../config/assets";
import cf_coins from "../../../../config/coins";
import { contractCallWithToast_NetworkETH } from "../../../../components/RpcExec/toast";
import { rpcExecCogiChain } from "../../../../components/RpcExec/toast_chain";
import { useTranslation } from "react-i18next";
import { balancesFromWalletSagaReceive } from "../../../../common/utilities_config";

export default function DepositV1Component({ isFilter }: { isFilter?: any }) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const route = useRoute();
  const [data, setData] = useState<any>();

  const accountWeb = useSelector(AccountReducers.dataAccount);

  const [switchToChain, setSwitchToChain] = useState<IChainData | any>(null);

  const [valueAmount, setValueAmount] = useState<any>("");
  const [coinSelected, setCoinSelected] = useState<any>(null);
  const [symbol, setSymbol] = useState("");
  const [networkSelected, setNetworkSelected] = useState<any>(null);

  const [depositData, setDepositData] = useState(["", "", ""]);
  const [bridgePools, setBridgePools] = useState(null);
  const [poolSelected, setPoolSelected] = useState<any>(null);
  const [balances, setBalances] = useState<any[]>([]);
  const [balanceAvailable, setBalanceAvailable] = useState<any>(null);
  const [onActionSuccess, setOnActionSuccess] = useState(false);
  const [onchainBalancesCogi, setOnchainBalancesCogi] = useState<any>(null);
  const account: string = useSelector(WalletReducers.selectedAddress);
  const chainID = useSelector(WalletReducers.selectedChainId);
  const bridgePoolsReponse = useSelector(HotwalletReducers.bridgePoolResponse);
  const dispatch = useDispatch();

  const dispatchConnectMetamask = () =>
    dispatch(WalletActions.connectMetamask());
  const dispatchReload = () => dispatch(WalletActions.reload());
  const dispatchGetBridgePools = () =>
    dispatch(HotwalletActions.getBridgePools(TYPE_DEPOSIT.DEPOSIT));

  // balance metamask
  const contractMetamaskResponse = useSelector(
    WalletReducers.contractMetamaskResponse,
  );
  const dispatchContractCallOnchainBalances = () => {
    if (chainID !== ClassWithStaticMethod.NEMO_WALLET_CHAINID) {
      cf_hotwalletsReceiveToken.map((asset) => {
        dispatch(
          WalletActions.contractCallMetamask({
            namespace: asset.assetContractNamespace,
            method: "balanceOf",
            params: [account],
          }),
        );
      });
    }
  };

  useEffect(() => {
    if (!route.params) return;
    const { data }: any = route.params;
    setData(data);
  }, [route]);

  useEffect(() => {
    // onchain Balances
    let ret: IBalanceData[] = [];
    if (contractMetamaskResponse !== null) {
      ret = balancesFromWalletSagaReceive(contractMetamaskResponse);
    }
    const temp = balances ? [...balances] : [];
    ret.map((e: any) => {
      temp.push(e);
    });
    setBalances([]);
    setBalances([...temp]);
  }, [contractMetamaskResponse]);

  useEffect(() => {
    // onchain Balances
    if (account) {
      setBalances([]);
      dispatchContractCallOnchainBalances();
    }
  }, [account, chainID]);

  useEffect(() => {
    getBalance();
  }, [balances]);

  const loadData = () => {
    dispatchReload();
    if (account) {
      dispatchContractCallOnchainBalances();
    }
    dispatchGetBridgePools();
    if (accountWeb) {
      getBalanceNative();
    }
  };

  const reload = () => {
    cleanup();
    if (account) {
      dispatchContractCallOnchainBalances();
    }
    dispatchReload();
    dispatchGetBridgePools();
    if (accountWeb) {
      getBalanceNative();
    }
  };

  const cleanup = () => {
    setBalances([]);
    setOnchainBalancesCogi([]);
    setBridgePools(null);
    setValueAmount(null);
  };

  useEffect(() => {
    if (data) {
      setSymbol(data.symbol);
    } else {
      setSymbol("NEMO");
    }
  }, [data]);

  useEffect(() => {
    //
    setBridgePools(bridgePoolsReponse?.pools);
  }, [bridgePoolsReponse]);

  useEffect(() => {
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
    getBalance();
    if (!coinSelected || !networkSelected) {
      setPoolSelected(null);
      return;
    }
    const coin = cf_coins.find(
      (e) =>
        e.symbol === coinSelected.symbol &&
        e.chainID === networkSelected?.chainId,
    );
    const pool = getPoolBridge(
      bridgePools,
      networkSelected?.chainId,
      coin?.contract,
    );
    setPoolSelected(pool);
  }, [coinSelected, networkSelected]);

  useEffect(() => {
    if (!networkSelected) {
      return;
    }
    ClassWithStaticMethod.SET_STATIC_DEFAULT_CHAINID(networkSelected?.chainId);
    dispatchConnectMetamask();
  }, [networkSelected]);

  // balance Cogi
  const getBalanceNative = () => {
    rpcExecCogiChain({ method: "eth_getBalance", params: [] })
      .then((res: any) => {
        setOnchainBalancesCogi({
          assetData: cf_assetsCoinNative,
          balance: res,
        });
      })
      .catch((_) => {
        setOnchainBalancesCogi(null);
      });
  };

  const getBalance = () => {
    if (!coinSelected || balances?.length === 0) {
      setBalanceAvailable(null);
      return;
    }
    const coin = balances.find(
      (e) => e.assetData.contractNamespace === coinSelected?.namespace,
    );

    if (coin) {
      const coinInAsset = cf_coins.find(
        (e) =>
          e.symbol === coin?.assetData?.symbol &&
          e.chainID === networkSelected?.chainId,
      );
      setBalanceAvailable({
        value: toEther(coin?.balance, coinInAsset?.decimals),
        decimals: coinInAsset?.decimals,
      });
    } else {
      setBalanceAvailable(null);
    }
  };

  useEffect(() => {
    if (!poolSelected) return;
    const max = toEther(poolSelected?.max_in_wei, coinSelected.decimals);
    if (Number(max) <= Number(valueAmount)) {
      setValueAmount("");
    }
  }, [poolSelected]);

  const handleClickMax = () => {
    const max = toEther(poolSelected?.max_in_wei, coinSelected.decimals);

    if (Number(max) <= Number(balanceAvailable?.value)) {
      setValueAmount(max);
    } else {
      setValueAmount(balanceAvailable?.value);
    }
  };

  useEffect(() => {
    async function performSendERC20(
      namespace: any,
      symbol: any,
      decimals: any,
      amount: any,
      toAddress: any,
    ) {
      try {
        const assetContract = ContractFromNamespace(namespace);
        const hwContract = getContractBridge(
          bridgePools,
          chainID,
          assetContract?.address,
        );
        if (!hwContract) {
          Toast.error(t("wallet.deposit_screen.an_error_occured"));
          return;
        }
        const approve: IApprove = {
          contract: assetContract,
          owner: account,
          spender: hwContract?.address,
          amount: toWei(amount, decimals),
        };
        const params = [
          assetContract.address,
          ClassWithStaticMethod.NEMO_WALLET_CHAINID,
          toAddress,
          toWei(amount, decimals),
        ];
        await contractCallWithToast_NetworkETH(
          hwContract,
          "sendERC20",
          params,
          approve,
        )
          .then(async () => {
            setValueAmount(null);
            reload();
            setOnActionSuccess(true);
          })
          .catch((e) => {
            // eslint-disable-next-line no-console
            console.log(e);
            reload();
          });
      } catch (e: any) {
        Toast.error(e.message);
      } finally {
        return;
      }
    }
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const [namespaceBridge, namespace, symbol, decimals, amount] = depositData;
    const isDepositConfirm = parseFloat(amount) > 0;
    if (isDepositConfirm) {
      // check Network
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

      performSendERC20(
        namespace,
        symbol,
        decimals,
        amount,
        descyptNEMOWallet(accountWeb?.nemo_address),
      );
      setDepositData(["", "", ""]);
    }
  }, [depositData]);

  const checkEnableTx = () => {
    return (
      coinSelected !== null &&
      networkSelected !== null &&
      !checkPreventDepositToken()
    );
  };

  const checkPreventDepositToken = () => {
    return !(
      coinSelected?.symbol === "COGI" ||
      parseFloat(toEther(onchainBalancesCogi?.balance ?? 0)) >= MAX_GAS_FEE
    );
  };

  return (
    <ScrollView
      style={{ ...styles.container, backgroundColor: colors.background }}
    >
      <View>
        <View style={styles.content}>
          <MyTextApp style={{ ...styles.titleContent, color: colors.title }}>
            {t("wallet.token")}
          </MyTextApp>
          <DropdownSelectCoinComponent
            chainID={chainID}
            coinSelected={coinSelected}
            setCoinSelected={setCoinSelected}
            type={TYPE_ACTION.RECECEIVE}
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
            type={TYPE_ACTION.RECECEIVE}
            type_deposit_withdraw={TYPE_DEPOSIT.DEPOSIT}
          />
        </View>

        <WalletConnectButtonComponent />
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
            <MyTextApp style={{ ...styles.titleContent, color: colors.title }}>
              {t("wallet.amount")}
            </MyTextApp>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MyTextApp style={{ color: colors.text, ...FONTS.font }}>
                {t("wallet.balance")}:{" "}
              </MyTextApp>
              <MyTextApp
                style={{ color: colors.title, ...FONTS.font }}
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                {currencyFormat(
                  roundDownNumber(
                    parseFloat(balanceAvailable?.value ?? "0"),
                    3,
                  ),
                )}
              </MyTextApp>
            </View>
          </View>
          <View style={{ position: "relative" }}>
            <MyTextApp style={styles.max} onPress={handleClickMax}>
              {t("wallet.max")}
            </MyTextApp>
            <InputComponent
              style={{
                ...styles.textInput,
                color: colors.title,
                borderWidth: 0,
                height: 52,
                alignItems: "center",
                backgroundColor: colors.card,
                flex: 1,
              }}
              height={52}
              inputMode="decimal"
              placeholder="1.0-1000000.0"
              placeholderTextColor={COLORS.descriptionText}
              value={valueAmount}
              maxLength={28}
              onChangeText={(e: string) => {
                setValueAmount(e);
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
                {t("wallet.deposit_amount")}
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
                    style={[styles.icon_2]}
                  />
                )}
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
                  )}{" "}
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
                {coinSelected && (
                  <Image
                    source={ICONS[coinSelected?.symbol?.toLowerCase()]}
                    alt=""
                    style={[styles.icon_2]}
                  />
                )}
                <MyTextApp
                  style={{ color: colors.title, ...FONTS.font, flex: 1 }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {currencyFormat(
                    roundDownNumber(valueAmount * (poolSelected?.fee ?? 0)),
                  )}{" "}
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
                {coinSelected && (
                  <Image source={ICONS.cogi} alt="" style={[styles.icon_2]} />
                )}
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
          disabled={!account && !checkEnableTx()}
          onPress={() => {
            if (!account && !checkEnableTx()) return;
            if (
              parseFloat(valueAmount) <
                parseFloat(toEther(poolSelected?.min_in_wei)) ||
              parseFloat(valueAmount) >
                parseFloat(toEther(poolSelected?.max_in_wei))
            ) {
              Toast.error(t("wallet.deposit_screen.amount_invalid"));
              return;
            }
            setDepositData([
              coinSelected?.contractBridge,
              coinSelected?.namespace,
              coinSelected?.symbol,
              balanceAvailable?.decimals,
              valueAmount?.toString(),
            ]);
          }}
        />
      </View>
      <SwitchChainComponent
        switchToChain={switchToChain}
        setSwitchToChain={setSwitchToChain}
      />

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
            {t("wallet.deposit_screen.token_receive_success")}
          </MyTextApp>
          <ButtonComponent
            title={t("wallet.nemo_wallet")}
            style={{ marginTop: 16 }}
          />
        </View>
      </ActionModalsComponent>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    // backgroundColor: COLORS.darkBackground,
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
    ...FONTS.fontBold,
    textTransform: "uppercase",
  },
  line: {
    marginBottom: 32,
    height: 1,
    width: "100%",
    backgroundColor: COLORS.borderColor,
  },
});
