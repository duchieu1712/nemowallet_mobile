import * as AccountReducers from "../../../modules/account/reducers";

import { COLORS, FONTS, ICONS, MyTextApp } from "../../../themes/theme";
import { FLAG_APPROVE, RESPONSE } from "../../../common/enum";
import {
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import ActionModalsComponent from "../../../components/ModalComponent/ActionModalsComponent";
import ApproveComponent from "./Component/ApproveComponent";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import FeatherIcon from "react-native-vector-icons/Feather";
import { IconLoadingDataComponent } from "../../../components/LoadingComponent";
import { MAX_BIG } from "../../../common/constants";
import ScrollViewToTop from "../../../components/ScrollToTopComponent";
import Toast from "../../../components/ToastInfo";
import ToggleComponent from "../../../components/ToggleComponent";
import { isEmpty } from "lodash";
import { rpcExecCogiChain } from "../../../components/RpcExec/toast_chain";
import { toWei } from "../../../common/utilities";
import { useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function ApprovalScreen({ navigation }: { navigation: any }) {
  const accountWeb = useSelector(AccountReducers.dataAccount);
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [openHepler, setOpenHepler] = useState(false);
  const [assetsToken, setAssetsToken] = useState<any>(null);
  const [approveToken, setApproveToken] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [amount, setAmount] = useState<any>();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);
  const loadData = () => {
    if (!accountWeb) return;
    rpcExecCogiChain({
      method: "nemo_hotwallet.approve_services",
      params: [],
    })
      .then((res: any) => {
        setAssetsToken(res);
      })
      .catch((e) => {
        setAssetsToken(null);
        Toast.error(e?.message ?? e);
      })
      .finally(() => {
        setRefreshing(false);
      });
  };
  // const cleanup = () => {
  //   setAssetsToken(null);
  // };
  useEffect(() => {
    loadData();
  }, [accountWeb]);

  useEffect(() => {
    if (refreshing) {
      loadData();
    }
  }, [refreshing]);
  const handleApproveToken = (item: any) => {
    setApproveToken(item);
    setOpenModal(true);
  };

  const closeModalHelper = () => {
    setOpenHepler(false);
  };
  const closeModal = () => {
    setOpenModal(false);
    setIsUnlimited(false);
  };

  const handleConfirm = () => {
    closeModal();
    if (isUnlimited) {
      onApproveToken(MAX_BIG);
    } else {
      onApproveToken(amount);
    }
  };
  const onApproveToken = async (amountToken: any) => {
    let params: any[] = [];
    if (approveToken.flag === FLAG_APPROVE.APPROVE) {
      if (amountToken === MAX_BIG) {
        params = [approveToken.item.treasury_wallet, amountToken];
      } else {
        if (isEmpty(amountToken)) {
          Toast.error(t("account.amount_invalid"));
          return;
        }
        params = [
          approveToken.item.treasury_wallet,
          toWei(amountToken).toString(),
        ];
      }
    } else if (approveToken.flag === FLAG_APPROVE.RECALL) {
      params = [approveToken.item.treasury_wallet, toWei("0").toString()];
    }
    rpcExecCogiChain({
      method: "nemo_hotwallet.approve",
      params,
      callback: (res: any, flagResponse: any) => {
        if (flagResponse === RESPONSE.SUCCESS) {
          Toast.success(
            `${t("account.approve_game")} ${approveToken.item.service_name} ${t(
              "account.is_successful",
            )}`,
          );
          // cleanup();
          onRefresh();
          setAmount(0);
          // setOnActionApprove(false)
        } else {
          Toast.error(res.message ?? res);
        }
      },
    });
  };

  const RenderItem = useMemo(() => {
    return ({ item, index }: { item: any; index: any }) => (
      <ApproveComponent item={item} setApproveToken={handleApproveToken} />
    );
  }, [assetsToken]);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          zIndex: 1,
          backgroundColor: colors.background,
        }}
      >
        <View
          style={{
            height: 48,
            backgroundColor: colors.background,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <View
            style={{
              height: 48,
              width: 48,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                height: "100%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FeatherIcon name="arrow-left" size={22} color={colors.title} />
            </TouchableOpacity>
          </View>
          <MyTextApp
            style={{
              flex: 1,
              textAlign: "left",
              ...FONTS.h5,
              ...FONTS.fontBold,
              color: colors.title,
            }}
          >
            {t("account.approval")}
          </MyTextApp>
          <TouchableOpacity
            style={{ width: 48, alignItems: "center" }}
            onPress={() => {
              setOpenHepler(true);
            }}
          >
            <FeatherIcon name="help-circle" color={colors.title} size={20} />
          </TouchableOpacity>
          <ActionModalsComponent
            modalVisible={openHepler}
            closeModal={closeModalHelper}
            iconClose
          >
            <View
              style={{
                ...styles.modalContent,
                backgroundColor: colors.card,
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
                  {t("account.approval")}
                </MyTextApp>
              </View>
              <MyTextApp style={{ color: colors.text, textAlign: "center" }}>
                {t("account.approval_helper")}
              </MyTextApp>
            </View>
          </ActionModalsComponent>
        </View>
      </View>
      <ScrollViewToTop
        style={{
          flexGrow: 1,
          backgroundColor: colors.background,
        }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        keyboardShouldPersistTaps="always"
        bottomIcon={30}
      >
        {!assetsToken ? (
          <View style={{ flex: 1 }}>
            <IconLoadingDataComponent />
          </View>
        ) : (
          <View
            style={{ ...styles.container, backgroundColor: colors.background }}
          >
            <FlatList
              nestedScrollEnabled
              scrollEnabled={false}
              data={assetsToken}
              renderItem={RenderItem}
            />
            <ActionModalsComponent
              modalVisible={openModal}
              closeModal={closeModal}
              iconClose
            >
              <View
                style={{
                  ...styles.modalContent,
                  backgroundColor: colors.card,
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
                    {approveToken?.flag === FLAG_APPROVE.APPROVE &&
                      t("account.approve_game") +
                        "\n" +
                        approveToken?.item.service_name}
                    {approveToken?.flag === FLAG_APPROVE.RECALL &&
                      t("account.retract_game") +
                        "\n" +
                        approveToken?.item.service_name}
                  </MyTextApp>
                </View>
                {approveToken?.flag === FLAG_APPROVE.APPROVE && (
                  <View style={{ width: "100%", gap: 12 }}>
                    <View
                      style={{
                        ...styles.input,
                        backgroundColor: colors.background,
                      }}
                    >
                      <TextInput
                        style={{ flex: 1, color: colors.text }}
                        placeholder={t("account.amount")}
                        placeholderTextColor={COLORS.placeholder}
                        keyboardType="numeric"
                        value={isUnlimited ? t("account.always_allow") : amount}
                        onChangeText={setAmount}
                        editable={!isUnlimited}
                      />
                      <Image
                        source={ICONS.nemo}
                        style={{ width: 24, height: 24 }}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      <MyTextApp
                        style={{ fontWeight: "bold", color: colors.title }}
                      >
                        {t("account.unlimited")}
                      </MyTextApp>
                      <ToggleComponent
                        size={26}
                        onToggle={() => {
                          setIsUnlimited(!isUnlimited);
                        }}
                      />
                    </View>
                  </View>
                )}
                <ButtonComponent
                  title={t("common.confirm")}
                  textWeight="bold"
                  onPress={handleConfirm}
                />
              </View>
            </ActionModalsComponent>
          </View>
        )}
      </ScrollViewToTop>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    gap: 16,
    paddingTop: 0,
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
    width: "90%",
    gap: 24,
  },
  closeBtn: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.divider,
    width: "100%",
    paddingHorizontal: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
