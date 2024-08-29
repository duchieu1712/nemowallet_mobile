import * as AccountReducers from "../../modules/account/reducers";
import * as HotwalletActions from "../../modules/hotwallet/actions";
import * as HotwalletReducers from "../../modules/hotwallet/reducers";
import * as WalletActions from "../../modules/wallet/actions";

import { COLORS, FONTS, ICONS, MyTextApp, SIZES } from "../../themes/theme";
import { FlatList, Image, StyleSheet, View } from "react-native";
import OpenLinkComponent, { OpenTxIDLinkComponent } from "../OpenLinkComponent";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  descyptNEMOWallet,
  ellipseAddress,
  getMethodTx,
  isLogined,
  timesOnChain,
} from "../../common/utilities";
import { useDispatch, useSelector } from "react-redux";

import { Collections } from "../../config/collections";
import { ContractFromNamespaceCogiChain } from "../../modules/wallet/utilities";
import { DEFAULT_CHAINID } from "../../common/constants";
import FeatherIcon from "react-native-vector-icons/Feather";
import { IconLoadingDataComponent } from "../LoadingComponent";
import ListGameComponent from "./ListGameComponent";
import NoDataComponent from "../NoDataComponent";
import ScrollViewToTop from "../ScrollToTopComponent";
import SelectDropdown from "react-native-select-dropdown";
import { TYPE_NFT } from "../../common/enum";
import { isEmpty } from "lodash";
import { type cf_services } from "../../config/services";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export function ListItemTransaction({
  listData,
  accountWeb,
  t,
}: {
  listData: any;
  accountWeb: any;
  t: any;
}) {
  const { colors } = useTheme();
  const RenderItem = useMemo(() => {
    return ({ tx, index }: { tx: any; index: any }) => {
      const method = getMethodTx(tx?.to.hash, tx?.method);
      return tx?.token_transfers
        ?.filter((e: any) => e.token.type == TYPE_NFT.ERC_721)
        ?.map((txchild: any, j: any) => (
          <View style={styles.content} key={index.toString() + j.toString()}>
            <MyTextApp style={{ ...styles.contentTitle, color: colors.title }}>
              {timesOnChain(tx?.timestamp)}
            </MyTextApp>
            <View style={styles.items}>
              {txchild?.to.hash.toLowerCase() ==
                descyptNEMOWallet(accountWeb?.nemo_address) && (
                <View style={styles.item}>
                  <MyTextApp style={styles.in}>{t("wallet.in")}</MyTextApp>
                  <Image style={styles.checkIn} source={ICONS.checkIn} alt="" />
                </View>
              )}
              {txchild?.from.hash.toLowerCase() ==
                descyptNEMOWallet(accountWeb?.nemo_address) && (
                <View style={styles.item}>
                  <MyTextApp
                    style={{
                      ...styles.out,
                    }}
                  >
                    {t("wallet.out")}
                  </MyTextApp>
                  <Image style={styles.checkIn} source={ICONS.checkIn} alt="" />
                </View>
              )}
              <View>
                <View style={styles.titleTop}>
                  <MyTextApp
                    style={{ ...styles.titleLeft, color: colors.title }}
                  >
                    {ellipseAddress(method)}
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
                      #{txchild.total.token_id}
                    </MyTextApp>
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
                    {ellipseAddress(tx?.hash)}
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
                {isEmpty(txchild?.to?.name)
                  ? ellipseAddress(txchild?.to?.hash)
                  : ellipseAddress(txchild?.to?.name)}
              </OpenLinkComponent>
            </View>
          </View>
        ));
    };
  }, [listData]);

  return (
    <FlatList
      scrollEnabled={false}
      nestedScrollEnabled={true}
      data={listData}
      renderItem={({ item, index }: { item: any; index: any }) => (
        <RenderItem tx={item} index={index} />
      )}
    />
  );
}

export default function ListTransaction_NFT({
  gameSelected,
  setGameSelected,
}: {
  gameSelected: (typeof cf_services)[0];
  setGameSelected: any;
}) {
  const [transactions, setTransactions] = useState<any>(null);
  const [refresh, setRefreshing] = useState(false);

  const [tokenSelected, setTokenSelected] = useState(
    Collections.filter((e) => e.serviceID == gameSelected.serviceID)[0],
  );

  const getTransactionsResponse = useSelector(
    HotwalletReducers.getTransactionsResponse,
  );
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const accountWeb = useSelector(AccountReducers.dataAccount);

  const dispatchReload = () => dispatch(WalletActions.reload());

  const dispatchGetTransactions = (request: any) => {
    if (!tokenSelected) return;
    const contract = ContractFromNamespaceCogiChain(
      tokenSelected.contractNamespace,
    );
    dispatch(
      HotwalletActions.getTransactions({
        tokenAddress: contract?.address,
        isNative: false,
        next_page_params: request,
      }),
    );
  };

  const loadData = () => {
    if (!isLogined()) {
      setTransactions([]);
      setRefreshing(false);
    }
    dispatchReload();
    dispatchGetTransactions(null);
  };

  useEffect(() => {
    if (getTransactionsResponse) {
      setTransactions(getTransactionsResponse.items);
    } else {
      setTransactions([]);
    }
    setRefreshing(false);
  }, [getTransactionsResponse]);

  useEffect(() => {
    const collection = Collections?.filter(
      (e) => e?.serviceID == gameSelected?.serviceID,
    );
    if (collection && collection.length != 0) {
      setTokenSelected(collection[0]);
    }
  }, [gameSelected]);

  useEffect(() => {
    setTransactions(null);
    loadData();
  }, [tokenSelected]);

  useEffect(() => {
    if (!accountWeb) {
      setRefreshing(false);
      return;
    }
    loadData();
  }, [accountWeb]);

  useEffect(() => {
    if (refresh) {
      setTransactions(null);
      loadData();
    }
  }, [refresh]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  return (
    <View style={{ width: "100%", paddingBottom: 180 }}>
      <ScrollViewToTop refreshing={refresh} onRefresh={onRefresh}>
        <ListGameComponent game={gameSelected} setGame={setGameSelected} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        ></View>
        <View
          style={{
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            width: "100%",
            paddingHorizontal: 15,
          }}
        >
          {/* Service of Game */}
          <SelectDropdown
            data={Collections?.filter(
              (e) => e?.serviceID == gameSelected?.serviceID,
            )}
            disabled={!tokenSelected}
            onSelect={(game) => {
              setTokenSelected(game);
            }}
            buttonTextAfterSelection={(_) => tokenSelected.name}
            defaultButtonText={t("wallet.select_game")}
            defaultValue={tokenSelected}
            rowTextForSelection={(item) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              return item?.name;
            }}
            dropdownStyle={{
              shadowColor: "transparent",
              borderBottomRightRadius: 8,
              borderBottomLeftRadius: 8,
              paddingHorizontal: 8,
              paddingVertical: 10,
              backgroundColor: colors.card,
              //   borderWidth: 1,
              //   borderColor: "red",
              marginTop: -20,
              minHeight: 160,
              elevation: 0,
            }}
            dropdownOverlayColor="transparent"
            rowStyle={{
              borderBottomColor: colors.background,
              backgroundColor: colors.card,
              borderRadius: 4,
              width: "100%",
            }}
            rowTextStyle={{
              color: colors.title,
              fontSize: 14,
            }}
            selectedRowStyle={{
              backgroundColor: colors.background,
            }}
            selectedRowTextStyle={{
              color: colors.title,
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
              fontSize: 14,
              textAlign: "left",
            }}
            renderDropdownIcon={() => (
              <FeatherIcon size={16} name="chevron-down" color={colors.text} />
            )}
          />
        </View>
        <View
          style={{ marginBottom: 32, marginTop: 24, paddingHorizontal: 16 }}
        >
          <MyTextApp style={{ color: colors.text, ...FONTS.font }}>
            {t("wallet.transaction")}
          </MyTextApp>
        </View>
        {transactions?.length == 0 ? (
          <NoDataComponent />
        ) : !transactions ? (
          <IconLoadingDataComponent />
        ) : (
          <ListItemTransaction
            listData={transactions}
            t={t}
            accountWeb={accountWeb}
          />
        )}
      </ScrollViewToTop>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.darkBackground,
    flex: 1,
    borderTopWidth: 5,
    borderTopColor: COLORS.primary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  content: {
    flex: 1,
    marginHorizontal: 15,
    color: COLORS.white,
    // borderWidth: 1,
    // borderColor: "red",
    borderBottomColor: "#35383F",
    borderBottomWidth: 1,
    paddingBottom: 12,
    marginTop: 12,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
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
});
