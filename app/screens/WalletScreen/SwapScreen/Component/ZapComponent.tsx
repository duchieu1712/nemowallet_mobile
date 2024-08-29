import * as AccountReducers from "../../../../modules/account/reducers";
import * as StakeReducers from "../../../../modules/zap/reducers";
import * as WalletActions from "../../../../modules/wallet/actions";
import * as WalletReducers from "../../../../modules/wallet/reducers";

import {
  CHAINID_COGI,
  DEFAULT_CHAINID,
  PROD,
} from "../../../../common/constants";
import { COLORS, FONTS, ICONS, MyTextApp } from "../../../../themes/theme";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  type IApprove,
  type IAssetCoinZap,
  type IAssetZap,
  type IBalanceData,
  type IChainData,
} from "../../../../common/types";
import React, { useEffect, useState } from "react";
import {
  contractCallEth_call,
  decodeFunctionResult,
} from "../../../../components/RpcExec/toast_chain";
import {
  currencyFormat,
  getOwnerAccount,
  roundDownNumber,
  roundDownNumber_v2,
  toEther_v2,
  toWei_v2,
} from "../../../../common/utilities";
import { useDispatch, useSelector } from "react-redux";

import { BigNumber } from "ethers";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import cf_Chains from "../../../../config/chains";
import { ClassWithStaticMethod } from "../../../../common/static";
import { ContractFromAddressAllNetwork } from "../../../../modules/wallet/utilities";
import { FILTER_BUY_SELL_NEMO } from "../../../../common/enum";
import Icon from "react-native-vector-icons/AntDesign";
import { IconProcessingButton } from "../../../../components/LoadingComponent";
import InputComponent from "../../../../components/InputComponent";
import SelectDropdown from "react-native-select-dropdown";
import { SwitchChainComponent } from "../../../../components/ModalComponent/ChainAccountModalComponent";
import Toast from "../../../../components/ToastInfo";
import WalletConnectButtonComponent from "../../../../components/ButtonComponent/WalletConnectButtonComponent";
import { contractCallWithToast } from "../../../../components/RpcExec/toast";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useWalletConnectModal } from "@walletconnect/modal-react-native";

export default function ZapComponent({
  navigation,
  item,
  reload,
  getBalance,
  balances,
  tag,
  setTag,
  isEditNetwork,
  setIsEditNetwork,
  networkFrom,
  setNetworkFrom,
  symbol,
}: {
  navigation: any;
  item: IAssetZap;
  reload: any;
  getBalance: any;
  balances: IBalanceData[];
  tag: FILTER_BUY_SELL_NEMO;
  setTag: any;
  isEditNetwork: any;
  setIsEditNetwork: any;
  networkFrom: any;
  setNetworkFrom: any;
  symbol?: any;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const web3Provider = useSelector(WalletReducers.selectedWeb3Provider);
  const accountWeb = useSelector(AccountReducers.dataAccount);
  const contracts: any = useSelector(StakeReducers.contracts);
  const chainId = useSelector(WalletReducers.selectedChainId);
  const [coinA, setCoinA]: [IAssetCoinZap | null, any] = useState(null);
  const [coinB, setCoinB]: [IAssetCoinZap | null, any] = useState(null);
  const [mybalanceAPending, setMyBalanceAPending] = useState<any>("0");
  const [mybalanceA, setMyBalanceA] = useState<any>("0");
  const [mybalanceB, setMyBalanceB] = useState<any>("0");
  const [valueA, setValueA] = useState<any>("");
  const [valueB, setValueB] = useState<any>("");
  const [switchToChain, setSwitchToChain] = useState<IChainData | any>(null);
  const [onProcessing, setOnProcessing] = useState(false);

  const { address, provider } = useWalletConnectModal();

  useEffect(() => {
    if (!chainId) return;
    if (networkFrom.chainId == DEFAULT_CHAINID) return;
    if (chainId == networkFrom.chainId) {
      setIsEditNetwork(false);
    } else {
      if (networkFrom.chainId == DEFAULT_CHAINID) return;
      let chainChange;
      for (let i = 0; i < cf_Chains.length; i++) {
        if (cf_Chains[i].chainId == networkFrom.chainId) {
          chainChange = cf_Chains[i];
          break;
        }
      }
      setSwitchToChain(null);
      setSwitchToChain(chainChange);
      setIsEditNetwork(true);
    }
  }, [chainId]);

  useEffect(() => {
    checkNetwork();
  }, [isEditNetwork]);

  const checkNetwork = () => {
    if (isEditNetwork) {
      if (networkFrom.chainId == DEFAULT_CHAINID) return;
      let chainChange;
      for (let i = 0; i < cf_Chains.length; i++) {
        if (cf_Chains[i].chainId == networkFrom.chainId) {
          chainChange = cf_Chains[i];
          break;
        }
      }
      setSwitchToChain(null);
      setSwitchToChain(chainChange);
    }
    return isEditNetwork;
  };

  useEffect(() => {
    if (!item) return;
    if (!symbol) {
      setCoinDefault(FILTER_BUY_SELL_NEMO.SELL);
    } else {
      if (symbol == "NEMO") {
        setTag(FILTER_BUY_SELL_NEMO.SELL);
        setCoinDefault(FILTER_BUY_SELL_NEMO.SELL);
      } else if (symbol == "USDT") {
        setTag(FILTER_BUY_SELL_NEMO.BUY);
        setCoinDefault(FILTER_BUY_SELL_NEMO.BUY);
      } else {
        setCoinDefault(FILTER_BUY_SELL_NEMO.SELL);
      }
    }
  }, [item, networkFrom, symbol]);

  useEffect(() => {
    if (coinA)
      checkBalance(coinA, balances, setMyBalanceA, setMyBalanceAPending);
    if (coinB) checkBalance(coinB, balances, setMyBalanceB);
  }, [balances]);

  const setCoinDefault = (tagNew: any) => {
    if (tagNew == FILTER_BUY_SELL_NEMO.BUY) {
      setCoinA(item.coinZap[0]);
      setCoinB(item.coinZap[1]);
      setValueA("");
      setValueB("");
    } else if (tagNew == FILTER_BUY_SELL_NEMO.SELL) {
      setCoinA(item.coinZap[1]);
      setCoinB(item.coinZap[0]);
      setValueA("");
      setValueB("");
    }
  };

  useEffect(() => {
    if (!tag) return;
    setCoinDefault(tag);
  }, [tag]);

  useEffect(() => {
    if (!coinA) return;
    checkBalance(coinA, balances, setMyBalanceA, setMyBalanceAPending);
  }, [coinA]);

  useEffect(() => {
    if (!coinB) return;
    checkBalance(coinB, balances, setMyBalanceB);
  }, [coinB]);

  const checkBalance = (
    coin: any,
    bl: any,
    setBalance: any,
    setBalancePending?: any,
  ) => {
    const lstBl = bl.filter(
      (e: any) =>
        e?.assetData?.symbol?.toString()?.trim() ==
        coin?.symbol?.toString()?.trim(),
    );
    let temp;
    if (lstBl.length > 0) {
      temp = lstBl[lstBl.length - 1];
    }
    if (temp) {
      if (
        temp.assetData.contractNamespace == "nemo_coin" &&
        chainId == ClassWithStaticMethod.NEMO_WALLET_CHAINID
      ) {
        setBalance(temp.balance);
        if (setBalancePending) {
          setBalancePending(toEther_v2(temp?.pendingBalance, coin?.decimals));
        }
      } else {
        setBalance(toEther_v2(temp?.balance, coin?.decimals));
        if (setBalancePending) {
          setBalancePending("0");
        }
      }
    } else {
      setBalance("0");
      if (setBalancePending) {
        setBalancePending("0");
      }
    }
  };

  const zapPool = async () => {
    // Deposit
    if (valueA == "" || valueA == "0") {
      Toast.error("Amount is invalid!");
      return;
    }
    if (parseFloat(valueA) > parseFloat(mybalanceA)) {
      Toast.error("Your balance is insufficient!");
      return;
    }
    setOnProcessing(true);

    const contractInfo = contracts.find(
      (e: any) => e.namespace == item.address,
    );
    if (contractInfo) {
      let contract;
      if (chainId == ClassWithStaticMethod.NEMO_WALLET_CHAINID) {
        contract = contractInfo.contract;
      } else {
        const sig = await web3Provider.getSigner();
        contract = contractInfo.contract.connect(sig);
      }
      const currencyContract = ContractFromAddressAllNetwork(coinA.address);
      const _amount: BigNumber = toWei_v2(valueA, coinA.decimals);
      const approve: IApprove = {
        contract: currencyContract,
        owner: getOwnerAccount(),
        spender: contract.address,
        amount: _amount,
      };

      contractCallWithToast(
        contract,
        "swapToken",
        [coinA.address, _amount, getOwnerAccount()],
        approve,
      )
        .then(async () => {
          setOnProcessing(false);
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          // console.log(`Failed zap ${e}`);

          setOnProcessing(false);
        });
    } else {
      setOnProcessing(false);
    }
  };

  // const formatTokenNumberZap = (number, digit = 2) => {
  //   return currencyFormat(nFormatterDown(number ?? 0, digit))
  // }
  const formatTokenNumberZap = (number: any) => {
    return currencyFormat(number);
  };

  const getAmountTokenOut = async (
    tokenIn: any,
    amountIn: any,
  ): Promise<BigNumber> => {
    try {
      let ret: any;
      const contractInfo = contracts.find(
        (e: any) => e.namespace == item.address,
      );
      if (contractInfo) {
        let contract;
        if (chainId == ClassWithStaticMethod.NEMO_WALLET_CHAINID) {
          contract = contractInfo.contract;
        } else {
          const sig = await web3Provider.getSigner();
          contract = contractInfo.contract.connect(sig);
        }
        console.log(contract.address);
        ret = await contractCallEth_call(contract, "getAmountTokenOut", [
          tokenIn,
          amountIn,
        ]);
        if (chainId == ClassWithStaticMethod.NEMO_WALLET_CHAINID) {
          const res = decodeFunctionResult(contract, "getAmountTokenOut", ret);
          return BigNumber.from(res.amountOut);
        } else {
          const [, amountOut] = ret;
          return BigNumber.from(amountOut);
        }
      }
    } catch (e) {
      console.log(e);

      return BigNumber.from(0);
    }
  };

  const onClickMaxValueA = async () => {
    setValueA(mybalanceA);
    if (mybalanceA == "" || mybalanceA == null) {
      setValueB("");
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const amountOut = await getAmountTokenOut(
        coinA.address,
        toWei_v2(mybalanceA, coinA.decimals),
      );
      setValueB(toEther_v2(amountOut, coinB.decimals));
    }
  };

  const onChangeValueA = async (e: any) => {
    if (e.length > e.maxLength) e = e.slice(0, e.maxLength);
    setValueA(e);
    if (e == "" || e == null) {
      setValueB("");
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const amountOut = await getAmountTokenOut(
        coinA.address,
        toWei_v2(e, coinA.decimals),
      );
      setValueB(toEther_v2(amountOut, coinB.decimals));
    }
  };

  const onChangeValueB = async (e: any) => {
    if (e.length > e.maxLength) e = e.slice(0, e.maxLength);
    setValueB(e);
    if (e == "" || e == null) {
      setValueA("");
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const amountOut = await getAmountTokenOut(
        coinB.address,
        toWei_v2(e, coinB.decimals),
      );
      setValueB(toEther_v2(amountOut, coinA.decimals));
    }
  };
  // const handleChangeTransferFrom = (e: any) => {
  //   const network = e;
  //   if (network != null) {
  //     setNetworkFrom(network);
  //   }
  // };

  const checkNetworkFromConnect = () => {
    let res = true;
    if (networkFrom?.chainId != null && chainId != networkFrom?.chainId) {
      connectToNetwork();
      res = false;
    }
    return res;
  };

  useEffect(() => {
    if (!networkFrom) return;
    connectToNetwork();
  }, [networkFrom]);

  useEffect(() => {
    if (chainId == networkFrom.chainId) {
      setIsEditNetwork(false);
    } else {
      setIsEditNetwork(true);
    }
  }, [chainId]);

  const connectToNetwork = () => {
    if (!networkFrom) {
      Toast.error("Please choose Network!");
      return;
    }
    ClassWithStaticMethod.SET_STATIC_DEFAULT_CHAINID(networkFrom.chainId);
    // coin to
    if (networkFrom.chainId != chainId) {
      if (networkFrom.chainId == DEFAULT_CHAINID) {
        dispatch(WalletActions.connect());
      } else {
        if (chainId != DEFAULT_CHAINID) {
          setIsEditNetwork(true);
        }
        // dispatch(WalletActions.connectMetamask());
        dispatch(WalletActions.setProvider(provider));
      }
    } else {
      if (checkNetworkFromConnect()) {
        setIsEditNetwork(false);
      }
    }
  };

  const checkExistTransactionPending = (): boolean => {
    if (parseFloat(mybalanceAPending) > 0) return true;
    return false;
  };

  const checkPreventSwap = (): boolean => {
    return (
      networkFrom?.chainId == ClassWithStaticMethod.NEMO_WALLET_CHAINID &&
      !accountWeb
    );
  };
  return (
    <View
      style={{
        ...styles.swapContainer,
        backgroundColor: colors.background,
      }}
    >
      <View style={styles.alignCenter}>
        <View
          style={{ ...styles.topItem, backgroundColor: colors.card }}
        ></View>
      </View>
      <View style={{ marginTop: 25 }}>
        <MyTextApp
          style={{
            color: colors.title,
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          {t("swap.network")}
        </MyTextApp>
        <SelectDropdown
          data={cf_Chains?.filter(
            (e) => e.network == (PROD ? "mainnet" : "testnet"),
          )}
          defaultValue={cf_Chains?.find((e) => e.chainId == DEFAULT_CHAINID)}
          onSelect={(selectedItem, index) => {
            setNetworkFrom(selectedItem);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem.name;
          }}
          rowTextForSelection={(item, index) => {
            return item.name;
          }}
          dropdownStyle={{
            shadowColor: "transparent",
            elevation: 0,
            borderBottomRightRadius: 8,
            borderBottomLeftRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 10,
            backgroundColor: colors.card,
            marginTop: -20,
            minHeight: 180,
          }}
          dropdownOverlayColor="transparent"
          rowStyle={{
            borderBottomColor: colors.background,
            backgroundColor: colors.card,
            borderRadius: 4,
            width: "100%",
          }}
          selectedRowStyle={{
            backgroundColor: colors.background,
          }}
          buttonStyle={{
            height: 50,
            width: "100%",
            backgroundColor: colors.card,
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 9,
            marginTop: 8,
          }}
          buttonTextStyle={{
            color: colors.title,
          }}
          renderDropdownIcon={() => (
            <Image source={ICONS.dropDown} style={{ width: 16, height: 16 }} />
          )}
          renderCustomizedButtonChild={(selected) => (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 8,
              }}
            >
              <Image
                source={ICONS[selected?.shortName.toLowerCase()]}
                style={styles.icon}
              />
              <MyTextApp style={{ color: colors.title }}>
                {selected?.name ?? ""}
              </MyTextApp>
            </View>
          )}
          renderCustomizedRowChild={(selected) => (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 8,
              }}
            >
              <Image
                source={ICONS[selected?.shortName.toLowerCase()]}
                style={styles.icon}
              />
              <MyTextApp style={{ color: colors.title }}>
                {selected?.name ?? ""}
              </MyTextApp>
            </View>
          )}
        />
      </View>
      <View style={{ marginTop: 12, gap: 16, position: "relative" }}>
        {coinA && (
          <View style={{ ...styles.swapItem, backgroundColor: colors.card }}>
            <View style={styles.spaceBetween}>
              <MyTextApp style={{ color: colors.title }}>
                {t("swap.pay")}
              </MyTextApp>
              <MyTextApp style={{ color: colors.title }}>
                {t("swap.balance")}:{" "}
                {formatTokenNumberZap(
                  roundDownNumber_v2(parseFloat(mybalanceA)),
                )}
              </MyTextApp>
            </View>
            <View style={styles.spaceBetween}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={ICONS[coinA.symbol.toLowerCase()]}
                  style={{ width: 24, height: 24 }}
                />
                <MyTextApp
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: colors.title,
                    marginLeft: 5,
                  }}
                >
                  {coinA.symbol}
                </MyTextApp>
              </View>
              <InputComponent
                placeholder="1-1000000"
                placeholderTextColor={COLORS.disabledBtn}
                style={{
                  ...styles.input,
                  color: colors.title,
                  borderWidth: 0,
                  flex: 1,
                  paddingRight: 0,
                  paddingBottom: 0,
                }}
                keyboardType="numeric"
                value={valueA}
                onChangeText={async (e: any) => {
                  await onChangeValueA(e);
                }}
                textAlign="right"
                showClear={false}
                fontSize={20}
                fontWeight="700"
                inputPaddingRight={0}
                inputPaddingBottom={4}
              />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity
                onPress={async () => {
                  await onClickMaxValueA();
                }}
              >
                <MyTextApp
                  style={{
                    color: COLORS.yellow,
                    textTransform: "uppercase",
                    ...FONTS.fontBold,
                  }}
                >
                  {t("swap.max")}
                </MyTextApp>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <TouchableOpacity
          style={{
            ...styles.swapIcon,
            backgroundColor: colors.background,
          }}
          onPress={() => {
            if (tag == FILTER_BUY_SELL_NEMO.BUY)
              setTag(FILTER_BUY_SELL_NEMO.SELL);
            else setTag(FILTER_BUY_SELL_NEMO.BUY);
          }}
        >
          <Icon name="swap" size={20} color={COLORS.descriptionText} />
        </TouchableOpacity>
        {coinB && (
          <View style={{ ...styles.swapItem, backgroundColor: colors.card }}>
            <View style={styles.spaceBetween}>
              <MyTextApp style={{ color: colors.title }}>
                {t("swap.get")}
              </MyTextApp>
              <MyTextApp style={{ color: colors.title }}>
                {t("swap.balance")}:{" "}
                {formatTokenNumberZap(
                  roundDownNumber_v2(parseFloat(mybalanceB)),
                )}
              </MyTextApp>
            </View>
            <View style={styles.spaceBetween}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={ICONS[coinB.symbol.toLowerCase()]}
                  style={{ width: 24, height: 24 }}
                />
                <MyTextApp
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: colors.title,
                    marginLeft: 5,
                  }}
                >
                  {coinB.symbol}
                </MyTextApp>
              </View>
              <InputComponent
                placeholder="1-1000000"
                placeholderTextColor={COLORS.disabledBtn}
                style={{
                  ...styles.input,
                  color: colors.title,
                  borderWidth: 0,
                  flex: 1,
                  paddingRight: 0,
                }}
                keyboardType="numeric"
                value={valueB ?? <IconProcessingButton />}
                onChangeText={async (e: any) => {
                  await onChangeValueB(e);
                }}
                textAlign="right"
                showClear={false}
                fontSize={20}
                fontWeight="700"
                inputPaddingRight={0}
                inputPaddingBottom={4}
              />
            </View>
            <MyTextApp></MyTextApp>
          </View>
        )}
      </View>

      {valueA && valueB && (
        <MyTextApp
          style={{
            color: COLORS.descriptionText,
            width: "100%",
            textAlign: "center",
            marginVertical: 16,
          }}
        >
          1 NEMO = $
          {coinA?.symbol == "NEMO"
            ? roundDownNumber(valueB / (valueA == 0 ? 1 : valueA))
            : roundDownNumber(valueA / (valueB == 0 ? 1 : valueB))}{" "}
          USDT{" "}
        </MyTextApp>
      )}
      {(address || (networkFrom.chainId == CHAINID_COGI && accountWeb)) && (
        <ButtonComponent
          style={{
            marginVertical: 16,
          }}
          title={t("swap.title")}
          color={valueA == 0 && COLORS.disabledBtn}
          textColor={valueA == 0 && COLORS.descriptionText}
          disabled={
            valueA == 0 ||
            checkNetwork() ||
            checkExistTransactionPending() ||
            checkPreventSwap()
          }
          onPress={() => {
            if (
              checkNetwork() ||
              checkExistTransactionPending() ||
              checkPreventSwap()
            )
              return;
            zapPool();
          }}
          onProcessing={onProcessing}
        />
      )}
      {networkFrom.chainId == CHAINID_COGI && !accountWeb && (
        <ButtonComponent
          style={{
            marginVertical: 16,
          }}
          title={t("auth.sign_in")}
          onPress={() => {
            navigation.navigate("SignInScreen" as never);
          }}
          onProcessing={onProcessing}
        />
      )}
      {networkFrom.chainId != CHAINID_COGI && <WalletConnectButtonComponent />}
      <SwitchChainComponent
        switchToChain={switchToChain}
        setSwitchToChain={setSwitchToChain}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headTitle: {
    paddingLeft: 10,
    paddingTop: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  collapse: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingBottom: 8,
  },
  greyText: {
    fontSize: 14,
    marginRight: 5,
  },
  infoContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 20,
    maxHeight: 400,
  },
  alignCenter: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  swapContainer: {
    minHeight: 679,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 20,
    paddingTop: 8,
  },
  topItem: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.disabledBtn,
    borderRadius: 5,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  swapItem: {
    backgroundColor: COLORS.greyBackground,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 5,
  },
  spaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    fontSize: 20,
    fontWeight: "bold",
    minWidth: 110,
    textAlign: "right",
  },
  swapIcon: {
    position: "absolute",
    transform: [{ rotate: "90deg" }],
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9,
    top: 105,
    left: Dimensions.get("window").width / 2 - 40,
  },
});
