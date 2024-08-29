import {
  COLORS,
  GAMES_AVATAR,
  ICONS,
  MyTextApp,
} from "../../../../themes/theme";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  currencyFormat,
  roundDownNumber,
  toEther,
} from "../../../../common/utilities";

import { ContractFromAddressCogiChain } from "../../../../modules/wallet/utilities";
import { FLAG_APPROVE } from "../../../../common/enum";
import FeatherIcon from "react-native-vector-icons/Feather";
import { MAX_BIG } from "../../../../common/constants";
import Toast from "../../../../components/ToastInfo";
import { rpcExecCogiChain } from "../../../../components/RpcExec/toast_chain";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function ApproveComponent({
  item,
  setApproveToken,
}: {
  item: any;
  setApproveToken: any;
}) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [allowance, setAllowance] = useState("0");
  const [viewiconToken, setViewiconToken] = useState(true);

  useEffect(() => {
    // load allowance
    if (!item) return;
    // setImage(item.service_name.toLowerCase())
    const params = [item.treasury_wallet];
    const contract = ContractFromAddressCogiChain(item.token_address);
    if (contract) {
      rpcExecCogiChain({
        method: `${item.namespace}.get_allowance`,
        params,
      })
        .then((res: any) => {
          if (res.amount.toString() === MAX_BIG) {
            setAllowance(t("account.always_allow"));
            setViewiconToken(false);
          } else {
            setAllowance(
              currencyFormat(
                roundDownNumber(parseFloat(toEther(res.amount.toString()))),
              ).toString(),
            );
            setViewiconToken(true);
          }
        })
        .catch((e) => {
          setAllowance("0");
          setViewiconToken(true);
          Toast.error(e.message);
        });
    }
  }, [item]);

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: colors.card,
        marginBottom: 16,
      }}
    >
      <View style={styles.content}>
        {GAMES_AVATAR[item.service_name.toLowerCase().replace(/\s/g, "")] ? (
          <Image
            source={
              GAMES_AVATAR[item.service_name.toLowerCase().replace(/\s/g, "")]
            }
            style={{ width: 80, height: 80, borderRadius: 12, marginRight: 16 }}
          />
        ) : (
          <Image
            source={GAMES_AVATAR.default}
            style={{ width: 80, height: 80, borderRadius: 12, marginRight: 16 }}
          />
        )}

        <View style={{ justifyContent: "center", gap: 12 }}>
          <MyTextApp
            style={{ fontWeight: "bold", fontSize: 18, color: colors.title }}
          >
            {item.service_name}
          </MyTextApp>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <MyTextApp style={{ color: colors.title }}>
              {t("account.allowance")}: {allowance}
            </MyTextApp>
            {viewiconToken && (
              <Image source={ICONS.nemo} style={{ width: 16, height: 16 }} />
            )}
          </View>
        </View>
      </View>
      <View style={styles.groupBtn}>
        <TouchableOpacity
          onPress={() =>
            setApproveToken({
              item,
              flag: FLAG_APPROVE.RECALL,
            })
          }
          style={{ ...styles.button, backgroundColor: COLORS.disabledBtn }}
          activeOpacity={0.8}
        >
          <FeatherIcon name="x-octagon" size={16} color={COLORS.white} />
          <MyTextApp style={{ fontWeight: "bold" }}>
            {t("account.revoke")}
          </MyTextApp>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.button, backgroundColor: colors.primary }}
          onPress={() =>
            setApproveToken({
              item,
              flag: FLAG_APPROVE.APPROVE,
            })
          }
          activeOpacity={0.8}
        >
          <FeatherIcon name="check-circle" size={16} color={COLORS.white} />
          <MyTextApp style={{ fontWeight: "bold" }}>
            {t("account.approve")}
          </MyTextApp>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 20,
  },
  content: {
    flexDirection: "row",
  },
  groupBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: COLORS.divider,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "47%",
    height: 40,
    borderRadius: 30,
    gap: 8,
  },
});
