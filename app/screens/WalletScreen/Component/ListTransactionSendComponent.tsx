import * as AccountReducers from "../../../modules/account/reducers";

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
import React, { useMemo } from "react";
import {
  currencyFormat,
  descyptNEMOWallet,
  ellipseAddress,
  roundDownNumber,
  timesOnChain,
  toEther_v2,
} from "../../../common/utilities";

import { DEFAULT_CHAINID } from "../../../common/constants";
import { IconLoadingDataComponent } from "../../../components/LoadingComponent";
import NoDataComponent from "../../../components/NoDataComponent";
import { useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export function ListItemTransactionComponent({
  listData,
  coinSelected,
  accountWeb,
  colors,
  t,
}: {
  listData: any;
  coinSelected: any;
  accountWeb: any;
  colors: any;
  t: any;
}) {
  const RenderItem = useMemo(() => {
    return ({ tx, index }: { tx: any; index: any }) => {
      if (coinSelected?.native) {
        if (
          tx?.from?.hash?.toLowerCase() ===
            descyptNEMOWallet(accountWeb?.nemo_address).toLowerCase() &&
          tx?.value !== 0
        ) {
          return (
            <>
              <View style={styles.content} key={index.toString()}>
                <MyTextApp
                  style={{ ...styles.contentTitle, color: colors.title }}
                >
                  {/* {t("wallet.today")} */}
                  {timesOnChain(tx?.timestamp)}
                </MyTextApp>
                <View style={styles.items}>
                  {tx?.to.hash.toLowerCase() ===
                    descyptNEMOWallet(accountWeb?.nemo_address) && (
                    <View style={styles.item}>
                      <MyTextApp style={styles.in}>{t("wallet.in")}</MyTextApp>
                      <Image
                        style={styles.checkIn}
                        source={ICONS.checkIn}
                        alt=""
                      />
                    </View>
                  )}
                  {tx?.from.hash.toLowerCase() ===
                    descyptNEMOWallet(accountWeb?.nemo_address) && (
                    <View style={styles.item}>
                      <MyTextApp style={styles.out}>
                        {t("wallet.out")}
                      </MyTextApp>
                      <Image
                        style={styles.checkIn}
                        source={ICONS.checkIn}
                        alt=""
                      />
                    </View>
                  )}
                  <View>
                    <View style={styles.titleTop}>
                      <MyTextApp
                        style={{ ...styles.titleLeft, color: colors.title }}
                      >
                        {t("wallet.withdraw")}
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
                          {currencyFormat(
                            roundDownNumber(parseFloat(toEther_v2(tx?.value))),
                          )}
                        </MyTextApp>
                        <Image
                          source={coinSelected?.logo}
                          alt=""
                          style={styles.rightImage}
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <MyTextApp style={{ color: colors.text, ...FONTS.font }}>
                        TxID:
                      </MyTextApp>
                      <OpenTxIDLinkComponent
                        TxID={tx?.hash}
                        style={{
                          marginLeft: 4,
                          color: COLORS.blue,
                          borderColor: COLORS.blue,
                          borderBottomWidth: 1,
                        }}
                      >
                        {ellipseAddress(tx?.to.hash)}
                      </OpenTxIDLinkComponent>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    marginLeft: 48,
                    marginTop: 4,
                  }}
                >
                  <MyTextApp style={{ color: colors.text, ...FONTS.font }}>
                    {t("common.address")}:
                  </MyTextApp>
                  <OpenLinkComponent
                    address={tx?.to.hash}
                    chainID={DEFAULT_CHAINID}
                    style={{ paddingLeft: 4, color: colors.title }}
                  >
                    {ellipseAddress(tx?.to.hash)}
                  </OpenLinkComponent>
                </View>
              </View>
            </>
          );
        }
      } else {
        return tx?.token_transfers
          ?.filter(
            (e: any) =>
              e?.from?.hash?.toLowerCase() ===
                descyptNEMOWallet(accountWeb?.nemo_address).toLowerCase() &&
              e?.token?.address?.toLowerCase() ===
                coinSelected?.contract?.toLowerCase(),
          )
          ?.map((txchild: any, j: any) => {
            return (
              <View
                style={styles.content}
                key={index.toString() + j.toString()}
              >
                <MyTextApp
                  style={{ ...styles.contentTitle, color: colors.title }}
                >
                  {/* {t("wallet.today")} */}
                  {timesOnChain(tx?.timestamp)}
                </MyTextApp>
                <View style={styles.items}>
                  {txchild.to.hash.toLowerCase() ===
                    descyptNEMOWallet(accountWeb?.nemo_address) && (
                    <View style={[styles.item]}>
                      <MyTextApp style={styles.in}>{t("wallet.in")}</MyTextApp>
                      <Image
                        style={styles.checkIn}
                        source={ICONS.checkIn}
                        alt=""
                      />
                    </View>
                  )}
                  {txchild?.from.hash.toLowerCase() ===
                    descyptNEMOWallet(accountWeb?.nemo_address) && (
                    <View style={styles.item}>
                      <MyTextApp style={styles.out}>
                        {t("wallet.out")}
                      </MyTextApp>
                      <Image
                        style={styles.checkIn}
                        source={ICONS.checkIn}
                        alt=""
                      />
                    </View>
                  )}
                  <View>
                    <View style={styles.titleTop}>
                      <MyTextApp
                        style={{
                          ...styles.titleLeft,
                          color: colors.title,
                        }}
                      >
                        {t("wallet.withdraw")}
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
                          {currencyFormat(
                            roundDownNumber(
                              parseFloat(
                                toEther_v2(
                                  txchild.total.value,
                                  txchild.total.decimals,
                                ),
                              ),
                            ),
                          )}
                        </MyTextApp>
                        <Image
                          source={coinSelected?.logo}
                          alt=""
                          style={styles.rightImage}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <MyTextApp style={{ color: colors.text, ...FONTS.font }}>
                        TxID:
                      </MyTextApp>
                      <OpenTxIDLinkComponent
                        TxID={tx?.hash}
                        style={{
                          marginLeft: 4,
                          color: COLORS.blue,
                          borderColor: COLORS.blue,
                          borderBottomWidth: 1,
                        }}
                      >
                        {ellipseAddress(txchild?.to.hash)}
                      </OpenTxIDLinkComponent>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    marginTop: 4,
                    marginLeft: 48,
                  }}
                >
                  <MyTextApp style={{ color: colors.text, ...FONTS.font }}>
                    {t("common.address")}:
                  </MyTextApp>
                  <OpenLinkComponent
                    address={tx?.to.hash}
                    chainID={DEFAULT_CHAINID}
                    style={{ paddingLeft: 4, color: colors.title }}
                  >
                    {ellipseAddress(txchild?.to.hash)}
                  </OpenLinkComponent>
                </View>
              </View>
            );
          });
      }
    };
  }, [listData]);

  return (
    <FlatList
      scrollEnabled={false}
      nestedScrollEnabled
      data={listData}
      renderItem={({ item, index }: { item: any; index: any }) => (
        <RenderItem tx={item} index={index} />
      )}
    />
  );
}

export default function ListTransactionSendComponent({
  coinSelected,
  transactions,
  transactionNextPage,
  dispatchGetTransactions,
  setTransactionNextPage,
}: {
  coinSelected: any;
  transactions: any;
  transactionNextPage?: any;
  dispatchGetTransactions?: any;
  setTransactionNextPage?: any;
}) {
  const accountWeb = useSelector(AccountReducers.dataAccount);
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <>
      {transactions?.length === 0 ? (
        <NoDataComponent />
      ) : !transactions ? (
        <IconLoadingDataComponent />
      ) : (
        <ListItemTransactionComponent
          accountWeb={accountWeb}
          t={t}
          colors={colors}
          listData={transactions}
          coinSelected={coinSelected}
        />
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
          marginTop: 24,
        }}
      >
        {transactionNextPage && (
          <TouchableOpacity
            onPress={() => {
              dispatchGetTransactions(null);
              setTransactionNextPage(false);
            }}
            activeOpacity={0.8}
          >
            <MyTextApp>{t("wallet.first_page")}</MyTextApp>
          </TouchableOpacity>
        )}
        {transactions?.next_page_params && (
          <TouchableOpacity
            onPress={() => {
              dispatchGetTransactions(transactions?.next_page_params);
              setTransactionNextPage(true);
            }}
            activeOpacity={0.8}
          >
            <MyTextApp>{t("wallet.next_page")}</MyTextApp>
          </TouchableOpacity>
        )}
      </View>
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
    marginTop: 12,
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
    // borderBottomColor: "#35383F",
    // borderBottomWidth: 1,
    // paddingBottom: 12,
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
  in: {
    width: 40,
    height: 40,
    borderRadius: 50,
    position: "relative",
    backgroundColor: "rgba(71, 164, 50, 0.10)",
    color: "#48B62F",
    flex: 1,
    textAlignVertical: "center",
    textAlign: "center",
    fontWeight: "700",
    ...FONTS.font,
  },
  out: {
    width: 40,
    height: 40,
    borderRadius: 50,
    position: "relative",
    backgroundColor: "rgba(232, 168, 41, 0.1)",
    color: "#FFBD0C",
    flex: 1,
    textAlignVertical: "center",
    textAlign: "center",
    fontWeight: "700",
    ...FONTS.font,
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
    fontFamily: "UTM-Daxline",
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
});
