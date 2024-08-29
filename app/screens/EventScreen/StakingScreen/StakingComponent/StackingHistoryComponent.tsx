import * as AccountReducers from "../../../../modules/account/reducers";
import * as PoolsReducers from "../../../../modules/stakes/reducers";

import { COLORS, ICONS, MyTextApp } from "../../../../themes/theme";
import { Image, StyleSheet, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  currencyFormat,
  descyptNEMOWallet,
  roundDownNumber,
  timeStampToTime_V3,
  timestampToHuman_v2,
  toEther,
} from "../../../../common/utilities";

import ActionModalsComponent from "../../../../components/ModalComponent/ActionModalsComponent";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import CheckBox from "@react-native-community/checkbox";
import DividerComponent from "../../../../components/DividerComponent/DividerComponent";
import FeatherIcon from "react-native-vector-icons/Feather";
import Toast from "../../../../components/ToastInfo";
import { contractCallWithToastCogiChain } from "../../../../components/RpcExec/toast";
import { contractCogiChain_call } from "../../../../components/RpcExec/toast_chain";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function StackingHistoryComponent({
  value,
  index,
  priceCogi,
}: {
  value: any;
  index: any;
  priceCogi: any;
}) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [isCheck, setIsCheck] = useState(false);
  const [onAction, setOnAction] = useState(false);
  const [viewSubscription, setViewSubscription] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const accountWeb: any = useSelector(AccountReducers.dataAccount);
  const contracts = useSelector(PoolsReducers.contracts);

  // time count down
  const [timeCountDown, setTimeCountDown] = useState<any>(null);
  const timeCDIns = useRef<any>(null);
  const timeout = () => {
    setTimeCountDown((prevTimer: any) => {
      if (prevTimer > 0) {
        return prevTimer - 1;
      } else if (prevTimer === 0) {
        return prevTimer;
      }
    });
  };
  useEffect(() => {
    if (timeCountDown === null) return;
    if (timeCountDown > 0) {
      timeCDIns.current = setTimeout(timeout, 1000);
    }
    return () => {
      clearTimeout(timeCDIns.current);
    };
  }, [timeCountDown]);

  const getEstAPR = (rewardRate: any, volume: any) => {
    return roundDownNumber(
      ((rewardRate * 365 * 0.1) / (volume * priceCogi)) * 100,
      2,
    );
  };

  const getLockPeriod = (lockPeriod: any, roundDate: any) => {
    if (lockPeriod === 0) {
      return "Flexible";
    } else {
      if (roundDate === 60) {
        return roundDownNumber(lockPeriod / roundDate, 2) + " Minutes";
      } else if (roundDate === 3600) {
        return roundDownNumber(lockPeriod / roundDate, 2) + " Hours";
      }
      return roundDownNumber(lockPeriod / roundDate, 2) + " Days";
    }
  };
  useEffect(() => {
    // load allowance
    if (!value) return;
    const contract = contracts?.find(
      (e: any) => e.address === value?.product?.pool?.id,
    );
    if (contract) {
      contractCogiChain_call(contract.contract, "viewSubscription", [
        descyptNEMOWallet(accountWeb?.nemo_address?.toLowerCase()),
        value?.product?.productId,
        value?.subscriptionId,
      ])
        .then((res: any) => {
          const ress = contract.contract?.interface?.decodeFunctionResult(
            "viewSubscription",
            res,
          );
          setViewSubscription(ress);
        })
        .catch((_) => {
          setViewSubscription(null);
        });
    }
    // set Time count down
    if (value?.interestEndDate !== 0) {
      setTimeCountDown(value?.interestEndDate - dayjs().valueOf() / 1000);
    }
  }, [value]);

  const onClaim = () => {
    setProcessing(true);
    let method = "redeem";
    if (value?.product?.pool?.nativeTokenAllowed) {
      method = "redeemETH";
    }
    const contract = contracts?.find(
      (e: any) => e.address === value?.product?.pool?.id,
    );
    if (contract) {
      contractCallWithToastCogiChain(contract.contract, method, [
        value?.product?.productId,
        value?.subscriptionId,
      ])
        .then(async () => {
          setProcessing(false);
          Toast.success(t("event.claim_success"));
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.log(t("event.fail_zap") + e);
          setProcessing(false);
        });
    } else {
      setProcessing(false);
      Toast.error(t("event.staking_error"));
    }
  };

  const checkTimeEarlierStaking = () => {
    if (value?.interestEndDate === 0) return false;
    const now = dayjs().valueOf() / 1000;
    return now < value?.interestEndDate;
  };

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        gap: 16,
      }}
      key={index}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Image source={ICONS.nemo} style={{ width: 40, height: 40 }} />
          <View style={{ justifyContent: "space-between" }}>
            <MyTextApp style={{ color: colors.text, fontWeight: "bold" }}>
              {t("event.staked")}
            </MyTextApp>
            <View
              style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
            >
              <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
                {currencyFormat(value?.product?.price)}
              </MyTextApp>
              <Image source={ICONS.cogi} style={{ width: 14, height: 14 }} />
            </View>
          </View>
        </View>
        <View style={{ justifyContent: "space-between" }}>
          <MyTextApp style={{ color: colors.text, fontWeight: "bold" }}>
            APR
          </MyTextApp>
          <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
            {getEstAPR(value?.product?.rewardRate, value?.product?.price)} %
          </MyTextApp>
        </View>
        <View style={{ justifyContent: "space-between" }}>
          <MyTextApp style={{ color: colors.text, fontWeight: "bold" }}>
            {t("event.duration")}
          </MyTextApp>
          <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
            {getLockPeriod(
              value?.product?.lockPeriod,
              value?.product?.roundDate,
            )}
          </MyTextApp>
        </View>
      </View>
      <DividerComponent />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <MyTextApp style={{ color: colors.text }}>
          {t("event.value_date")}:
        </MyTextApp>
        <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
          {timestampToHuman_v2(value?.valueDate)}
        </MyTextApp>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <MyTextApp style={{ color: colors.text }}>
          {t("event.interest_end_date")}:
        </MyTextApp>
        <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
          {value?.interestEndDate === 0
            ? ""
            : timestampToHuman_v2(value?.interestEndDate)}
        </MyTextApp>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <MyTextApp style={{ color: colors.text }}>
          {t("event.countdown")}:
        </MyTextApp>
        <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
          {value?.interestEndDate === 0
            ? ""
            : timeStampToTime_V3(timeCountDown)}
        </MyTextApp>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <MyTextApp style={{ color: colors.text }}>
          {t("event.cummulative_interest")}:
        </MyTextApp>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <MyTextApp
            style={{
              color: colors.title,
              fontWeight: "bold",
            }}
          >
            {value?.redeemed
              ? roundDownNumber(value?.rewardAmount)
              : roundDownNumber(
                  toEther(viewSubscription?.rewardsCurrentAmount),
                )}
          </MyTextApp>
          <Image source={ICONS.nemo} style={{ width: 14, height: 14 }} />
        </View>
      </View>
      {value?.redeemed && (
        <ButtonComponent title={t("event.claimed")} disabled />
      )}
      {!value?.redeemed && (
        <>
          {checkTimeEarlierStaking() ? (
            <ButtonComponent
              title={t("event.unstake_earlier")}
              onPress={() => {
                setOnAction(true);
              }}
            />
          ) : (
            <ButtonComponent
              title={t("event.claim")}
              onPress={onClaim}
              onProcessing={processing}
            />
          )}
        </>
      )}
      <ActionModalsComponent
        modalVisible={onAction}
        closeModal={() => {
          setOnAction(false);
        }}
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
              {t("event.unstake_earlier")}
            </MyTextApp>
          </View>
          <View
            style={{
              gap: 8,
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <MyTextApp style={{ color: colors.text, fontSize: 16 }}>
                {t("event.interest_amount")}:
              </MyTextApp>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <MyTextApp
                  style={{
                    color: colors.title,
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  {roundDownNumber(toEther(viewSubscription?.rewardsAmount))}
                </MyTextApp>
                <Image source={ICONS.nemo} style={{ width: 14, height: 14 }} />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <MyTextApp style={{ color: colors.text, fontSize: 16 }}>
                {t("event.redeem_earlier_amount")}:
              </MyTextApp>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <MyTextApp
                  style={{
                    color: colors.title,
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  {roundDownNumber(
                    toEther(viewSubscription?.rewardsEarlierAmount),
                  )}
                </MyTextApp>
                <Image source={ICONS.nemo} style={{ width: 14, height: 14 }} />
              </View>
            </View>
            <DividerComponent />
            <MyTextApp style={{ color: colors.title, lineHeight: 20 }}>
              {t("event.descrip_txt_1")}
            </MyTextApp>
            <MyTextApp style={{ color: colors.title, lineHeight: 20 }}>
              {t("event.descrip_txt_2")}
            </MyTextApp>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                width: "100%",
              }}
            >
              <FeatherIcon
                name="alert-triangle"
                size={20}
                color={COLORS.yellow}
              />
              <MyTextApp
                style={{ color: COLORS.yellow, lineHeight: 20, flex: 1 }}
              >
                {t("event.descrip_txt_3")}
              </MyTextApp>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <CheckBox
                value={isCheck}
                onValueChange={setIsCheck}
                tintColors={{ true: colors.title }}
              />
              <View>
                <MyTextApp style={{ color: colors.title }}>
                  {t("event.read_agree")}
                </MyTextApp>
                <MyTextApp style={{ color: COLORS.yellow }}>
                  {t("event.cogi_staking_service")}
                </MyTextApp>
              </View>
            </View>
          </View>
          <ButtonComponent
            title={t("common.confirm")}
            onPress={() => {
              if (isCheck) {
                onClaim();
                setOnAction(false);
              }
            }}
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
});
