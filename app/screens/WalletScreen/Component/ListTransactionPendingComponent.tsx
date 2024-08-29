import * as WalletReducers from "../../../modules/wallet/reducers";

import { COLORS, FONTS, ICONS, MyTextApp, SIZES } from "../../../themes/theme";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import OpenLinkComponent, {
  OpenTxIDLinkComponent,
} from "../../../components/OpenLinkComponent";
import React, { useEffect, useMemo, useState } from "react";
import {
  SwitchAccountComponent,
  SwitchChainComponent,
} from "../../../components/ModalComponent/ChainAccountModalComponent";
import {
  ellipseAddress,
  getContractBridge,
  getNamespaceWithdraw_Deposit,
  toEther,
} from "../../../common/utilities";

import cf_Chains from "../../../config/chains";
import { DEFAULT_CHAINID } from "../../../common/constants";
import FeatherIcon from "react-native-vector-icons/Feather";
import { type IChainData } from "../../../common/types";
import { IconLoadingDataComponent } from "../../../components/LoadingComponent";
import NoDataComponent from "../../../components/NoDataComponent";
import Toast from "../../../components/ToastInfo";
import WalletConnectButtonComponent from "../../../components/ButtonComponent/WalletConnectButtonComponent";
import cf_coins from "../../../config/coins";
import { contractCallWithToast_NetworkETH } from "../../../components/RpcExec/toast";
import { rpcExecCogiChain } from "../../../components/RpcExec/toast_chain";
import { useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useWalletConnectModal } from "@walletconnect/modal-react-native";

export function ListItemTransactionComponent({
  listPending,
  data,
  t,
  address,
  performReceiveERC20,
}: {
  listPending: any;
  data: any;
  t: any;
  address: any;
  performReceiveERC20: any;
}) {
  const { colors, dark } = useTheme();

  const RenderItem = useMemo(() => {
    return ({ tx, index }: { tx: any; index: any }) => {
      const chainID = cf_Chains.find((e) => e.chainId === tx.chain_id);
      return (
        <View style={styles.content} key={index.toString()}>
          <View style={styles.items}>
            <View style={styles.item}>
              <MyTextApp style={styles.pending}>{t("wallet.out")}</MyTextApp>
              <Image style={styles.checkIn} source={ICONS.pending} alt="" />
            </View>
            <View>
              <View style={styles.titleTop}>
                <MyTextApp style={{ ...styles.titleLeft, color: colors.title }}>
                  {t("wallet.withdraw_pending")}
                </MyTextApp>
                <View style={styles.titleRight}>
                  <MyTextApp
                    style={{
                      ...FONTS.fontBold,
                      fontSize: 16,
                      color: colors.title,
                      alignSelf: "center",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlignVertical: "center",
                      alignContent: "center",
                    }}
                  >
                    {toEther(tx.amount, data?.decimals)}
                  </MyTextApp>
                  <Image source={data?.logo} alt="" style={styles.rightImage} />
                </View>
              </View>
              <View style={styles.bottomPending}>
                <View
                  style={{
                    ...FONTS.font,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <MyTextApp style={{ color: colors.text }}>TxID:</MyTextApp>
                  <OpenTxIDLinkComponent
                    TxID={tx?.txhash}
                    style={{
                      color: "rgba(5, 169, 252, 1)",
                      borderBottomWidth: 1,
                      borderBottomColor: "rgba(5, 169, 252, 1)",
                      marginLeft: 4,
                    }}
                  >
                    {ellipseAddress(tx?.txhash)}
                  </OpenTxIDLinkComponent>
                </View>

                {address ? (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      if (!address) {
                        open();
                      } else {
                        performReceiveERC20(
                          tx.txhash,
                          tx.chain_id,
                          tx.recipient,
                        );
                      }
                    }}
                  >
                    <View
                      style={{
                        ...styles.buttonSend,
                        backgroundColor: !dark
                          ? colors.primary
                          : COLORS.transparent,
                        borderColor: !dark ? colors.primary : colors.title,
                      }}
                    >
                      <FeatherIcon
                        size={16}
                        name="send"
                        color={!dark ? COLORS.white : colors.title}
                        style={styles.iconSend}
                      />
                      <MyTextApp
                        style={{
                          color: !dark ? COLORS.white : colors.title,
                        }}
                      >
                        {t("wallet.withdraw")}
                      </MyTextApp>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <WalletConnectButtonComponent
                    styleConnect={{
                      borderColor: dark ? colors.title : colors.primary,
                      // width: 96,
                      paddingHorizontal: 4,
                      paddingVertical: 1,
                      height: 32,
                      backgroundColor: dark ? "transparent" : colors.primary,
                      color: COLORS.white,
                    }}
                    styleButton={{
                      width: 96,
                    }}
                  />
                )}
              </View>
            </View>
          </View>
          <View style={{ marginLeft: 48 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <MyTextApp style={{ color: colors.text }}>
                {t("common.address")}:
              </MyTextApp>
              <OpenLinkComponent
                chainID={tx?.chain_id}
                address={tx?.recipient}
                style={{ color: colors.title }}
              >
                {ellipseAddress(tx?.recipient)}
              </OpenLinkComponent>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                marginTop: 4,
              }}
            >
              <MyTextApp style={{ color: colors.text }}>
                {t("wallet.network")}:
              </MyTextApp>
              <View style={{ justifyContent: "center" }}>
                {chainID ? (
                  <Image
                    source={ICONS[chainID.chainId]}
                    alt=""
                    style={{ width: 16, height: 16 }}
                  />
                ) : (
                  <></>
                )}
              </View>
              <MyTextApp style={{ color: colors.title }}>
                {chainID?.name}
              </MyTextApp>
            </View>
          </View>
        </View>
      );
    };
  }, [listPending]);

  return (
    <FlatList
      scrollEnabled={false}
      nestedScrollEnabled
      data={listPending}
      renderItem={({ item, index }: { item: any; index: any }) => (
        <RenderItem tx={item} index={index} />
      )}
    />
  );
}

export default function ListTransactionPending({
  transactions,
  bridgePools,
  data,
}: {
  transactions: any;
  bridgePools?: any;
  data: any;
}) {
  const { t } = useTranslation();

  const [transactionPending, setTransactionPending] = useState<any>(null);

  const account = useSelector(WalletReducers.selectedAddress);

  const [switchToChain, setSwitchToChain] = useState<IChainData | any>(null);
  const [switchToAccount, setSwitchToAccount] = useState<any>(null);

  const _chainID = useSelector(WalletReducers.selectedChainId);
  const { address } = useWalletConnectModal();

  useEffect(() => {
    if (!transactions) {
      setTransactionPending(null);
      return;
    }
    const dataByCoin = transactions?.available?.filter((e: any) => {
      const coin = cf_coins.find(
        (a) => a.namespace === data?.namespace && a.chainID === e.chain_id,
      );
      return e?.token_address?.toLowerCase() === coin?.contract?.toLowerCase();
    });
    setTransactionPending(dataByCoin ?? []);
  }, [transactions]);

  async function performReceiveERC20(tx: any, chainID: any, recipient: any) {
    if (chainID !== _chainID) {
      let chainChange;
      for (let i = 0; i < cf_Chains.length; i++) {
        if (cf_Chains[i].chainId === chainID) {
          chainChange = cf_Chains[i];
          break;
        }
      }
      setSwitchToChain(null);
      setSwitchToChain(chainChange);
      return;
    }
    if (account?.toLowerCase() !== recipient?.toLowerCase()) {
      setSwitchToAccount(recipient);
      return;
    }
    try {
      const namespaceWithdraw = getNamespaceWithdraw_Deposit(DEFAULT_CHAINID);
      rpcExecCogiChain({
        method: `${namespaceWithdraw}.extract_proof`,
        params: [tx],
      })
        .then((ress: any) => {
          const contractRelay = ress.contract_relay;
          const hwContractReceive = getContractBridge(
            bridgePools,
            chainID,
            contractRelay.params.token,
          );
          const paramsReceiveERC20 = [
            contractRelay.params.token,
            contractRelay.params.receiver,
            contractRelay.params.txhash,
            contractRelay.params.amount,
            contractRelay.params.signatures,
          ];

          if (!hwContractReceive) {
            Toast.error(t("wallet.withdraw_processing_error"));
            return;
          }
          contractCallWithToast_NetworkETH(
            hwContractReceive,
            contractRelay.method,
            paramsReceiveERC20,
          ).then(async (_) => {
            Toast.success(t("wallet.withdraw_success"));
          });
        })
        .catch((e: any) => {
          Toast.error(e.message);
        });
    } catch (e: any) {
      Toast.error(e.message);
    }
  }

  return (
    <>
      {transactionPending?.length === 0 ? (
        <NoDataComponent />
      ) : !transactionPending ? (
        <View style={{ flex: 1 }}>
          <IconLoadingDataComponent />
        </View>
      ) : (
        <ListItemTransactionComponent
          listPending={transactionPending}
          t={t}
          data={data}
          address={address}
          performReceiveERC20={performReceiveERC20}
        />
      )}
      <>
        <SwitchChainComponent
          switchToChain={switchToChain}
          setSwitchToChain={setSwitchToChain}
        />

        <SwitchAccountComponent
          switchToAccount={switchToAccount}
          setSwitchToAccount={setSwitchToAccount}
        />

        {/* <Modal
          animationType="slide"
          transparent={true}
          visible={switchToChain !== null}
          onRequestClose={() => {
            setSwitchToChain(null);
          }}
        >
          <View
            style={{
              justifyContent: "center",
              flex: 1,
              backgroundColor: "#00000081",
            }}
          >
            <View
              style={{
                ...styles.modalView,
                backgroundColor: colors.card,
                ...GlobalStyleSheet,
              }}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setSwitchToChain(null)}
                  style={[styles.buttonClose, { borderColor: colors.title }]}
                >
                  <FeatherIcon name="x" color={colors.title} size={18} />
                </TouchableOpacity>
              </View>

              <MyTextApp
                style={{
                  color: "#fe8e16",
                  fontSize: 28,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                {t("wallet.wrong_network")}
              </MyTextApp>

              <Image
                source={IMAGES.wrong_network}
                style={{ width: 100, height: 100 }}
              />

              <MyTextApp
                style={{
                  fontSize: 16,
                  textAlign: "center",
                  marginVertical: 16,
                  color: colors.title,
                }}
              >
                {t("wallet.wrong_network_description", {
                  chainName: switchToChain?.name,
                })}
              </MyTextApp>
              <WalletConnectButtonComponent
                hiddenAddress="none"
                styleConnect={{
                  color: colors.title,
                }}
                styleButton={
                  {
                    // width: "100%"
                  }
                }
              />
            </View>
          </View>
        </Modal> */}
      </>

      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={!isEmpty(switchToAccount)}
        onRequestClose={() => {
          setSwitchToAccount(null);
        }}
      >
        <View
          style={{
            justifyContent: "center",
            flex: 1,
            // backgroundColor: colors.text,
            // opacity: 0.1,
          }}
        >
          <View style={styles.modalView}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSwitchToAccount(null)}
                style={[styles.buttonClose, { borderColor: colors.title }]}
              >
                <FeatherIcon name="x" color={colors.title} size={18} />
              </TouchableOpacity>
            </View>

            <MyTextApp
              style={{
                color: "#fe8e16",
                fontSize: 28,
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              {t("wallet.warning")}
            </MyTextApp>

            <Image
              source={IMAGES.metamask}
              style={{ width: 100, height: 100 }}
            />

            <MyTextApp
              style={{
                fontSize: 16,
                textAlign: "center",
              }}
            >
              {t("wallet.connect_metamask_description")}
            </MyTextApp>
            <MyTextApp
              style={{
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              {t("wallet.please_connect")}
            </MyTextApp>
            <MyTextApp
              style={{
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              {ellipseAddress(switchToAccount)}
            </MyTextApp>
            <WalletConnectButtonComponent
              hiddenAddress="none"
              styleDisconnect={{
                marginTop: 16,
              }}
              styleConnect={{
                marginTop: 16,
              }}

              // hideModalWhenDisconnect={setSwitchToAccount(null)}
            />
          </View>
        </View>
      </Modal> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.darkBackground,
    flex: 1,
    borderTopWidth: 5,
    borderTopColor: COLORS.primary,
  },
  mainContainer: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
  },

  content: {
    flex: 1,
    paddingHorizontal: 15,
    color: COLORS.white,
    // borderWidth: 1,
    // borderColor: "red"
    borderBottomColor: "#35383F",
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  contentTitle: {
    color: COLORS.white,
    ...FONTS.font,
  },
  items: {
    marginTop: 12,
    width: "100%",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  item: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
    overflow: "visible",
    minWidth: 40,
    maxWidth: 40,
    marginRight: 8,
  },

  pending: {
    width: 40,
    height: 40,
    borderRadius: 50,
    position: "relative",
    backgroundColor: "rgba(223, 73, 73, 0.10)",
    color: "#DF4949",
    flex: 1,
    textAlignVertical: "center",
    textAlign: "center",
    fontWeight: "700",
    ...FONTS.font,
  },

  checkIn: {
    position: "absolute",
    right: 0,
    bottom: -3,
    width: 16,
    height: 16,
    overflow: "visible",
  },

  titleTop: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: SIZES.width - 40 - 8 - 32,
    marginBottom: 8,
  },

  titleLeft: {
    // fontFamily: "UTM-Daxline",
    fontWeight: "700",
    fontSize: 16,
    color: COLORS.white,
  },
  titleRight: {
    flex: 1,
    flexDirection: "row",
    columnGap: 8,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  rightImage: {
    width: 24,
    height: 24,
  },
  bottomPending: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonSend: {
    backgroundColor: "transparent",
    borderWidth: 1,
    bordercolor: "#fff",
    minWidth: 93,
    maxWidth: 93,
    maxHeight: 32,
    height: 32,
    borderRadius: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 4,
  },
  iconSend: {
    width: 16,
    height: 16,
  },
  buttonClose: {
    // borderWidth: 1,
    // borderColor: "red",
    flexDirection: "row",
    justifyContent: "flex-end",
    // width: "100%",
    maxWidth: 30,
    borderWidth: 1,
    borderRadius: 18,
    padding: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //   marginTop: 22,
    width: "100%",
    paddingHorizontal: 16,
  },
  modalView: {
    margin: 20,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: 12,
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 24,
    paddingTop: 16,
    width: "90%",
  },
});
