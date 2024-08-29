import { COLORS, ICONS, MyTextApp } from "../../../themes/theme";
import { Image, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  currencyFormat,
  roundDownNumber,
  toEther,
} from "../../../common/utilities";
import { getTitle, getTotalBox } from "../../../common/utilities_config";

import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import { BuyMysteryBox } from "./component";
import DividerComponent from "../../../components/DividerComponent/DividerComponent";
import { STAGE_MYSTERYBOX } from "../../../common/enum";
import { cf_BOX_DATA_CONFIG } from "../../../config/mysterybox/configMysteryBox";
import cf_info_INO from "../../../config/mysterybox/info";
import dayjs from "dayjs";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function MysteryBoxComponent({
  item,
  event,
  onchainBalances,
  loadData,
  itemServiceID,
}: {
  item: any;
  event?: any;
  onchainBalances?: any;
  loadData?: any;
  itemServiceID?: any;
}) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [stage, setStage] = useState(STAGE_MYSTERYBOX.END);
  const [amount, setAmount] = useState<any>("1");
  const boxData: any = cf_BOX_DATA_CONFIG.find(
    (e: any) => e.serviceID === itemServiceID,
  );

  useEffect(() => {
    if (item === null) return;
    // Stage
    const now = Math.floor(dayjs().valueOf() / 1000);
    if (now < parseInt(item?.info[0]?.whitelistOpentime)) {
      setPrice(parseFloat(toEther(item?.info[0]?.whitelistPrice)));
      setStock(parseFloat(item?.info[0]?.whitelistAmount));
      setStage(STAGE_MYSTERYBOX.INIT_STAGE_1);
    } else if (
      (now >= parseInt(item?.info[0]?.whitelistOpentime) &&
        now <= parseInt(item?.info[0]?.whitelistClosetime)) ||
      (now >= parseInt(item?.info[0]?.whitelistOpentime) &&
        now < parseInt(item?.info[0]?.opentime) - 20 * 60)
    ) {
      setStage(STAGE_MYSTERYBOX.STAGE_1_PRIVATE);
      setPrice(parseFloat(toEther(item?.info[0]?.whitelistPrice)));
      setStock(parseFloat(item?.info[0]?.whitelistAmount));
    } else if (
      now >= parseInt(item?.info[0]?.whitelistOpentime) &&
      now < parseInt(item?.info[0]?.opentime)
    ) {
      setStage(STAGE_MYSTERYBOX.INIT_STAGE_2);
      setPrice(parseFloat(toEther(item?.info[0]?.price)));
      setStock(parseFloat(item?.info[0]?.amount));
    } else if (
      now >= parseInt(item?.info[0]?.opentime) &&
      now <= parseInt(item?.info[0]?.closetime)
    ) {
      // ROUND 1
      if (
        cf_info_INO.find((e: any) => e.serviceID === itemServiceID)!
          .startRound2 > parseInt(item?.info[0]?.opentime)
      ) {
        setStage(STAGE_MYSTERYBOX.STAGE_1_PUBLIC);
      } else {
        setStage(STAGE_MYSTERYBOX.STAGE_2_PUBLIC);
      }
      setPrice(parseFloat(toEther(item?.info[0]?.price)));
      setStock(parseFloat(item?.info[0]?.amount));
    } else {
      setStage(STAGE_MYSTERYBOX.END);
      setPrice(parseFloat(toEther(item?.info[0]?.price)));
      setStock(parseFloat(item?.info[0]?.amount));
    }
  }, [item]);

  return (
    <View style={{ width: 330, gap: 16 }}>
      <MyTextApp
        style={{
          lineHeight: 22,
          fontSize: 20,
          fontWeight: "bold",
          color: boxData.color_box(item?.symbol),
          textAlign: "left",
        }}
      >
        {item?.name}
      </MyTextApp>
      <MyTextApp>{getTitle(itemServiceID, item?.symbol)}</MyTextApp>

      <DividerComponent />
      <View style={{ gap: 8 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <MyTextApp style={{ color: colors.text }}>
            {t("event.balances")}
          </MyTextApp>
          <View style={{ flexDirection: "row", gap: 12 }}>
            {onchainBalances?.map((once: any, i: any) => (
              <View
                key={i}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Image
                  source={ICONS[once?.assetData?.symbol?.toLowerCase()]}
                  style={{ width: 16, height: 16, marginRight: 4 }}
                />
                <MyTextApp style={{ color: COLORS.white }}>
                  {currencyFormat(roundDownNumber(parseFloat(once.balance), 3))}
                </MyTextApp>
              </View>
            ))}
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <MyTextApp style={{ color: colors.text }}>
            {t("event.price")}
          </MyTextApp>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={ICONS.nemo}
              style={{ width: 16, height: 16, marginRight: 4 }}
            />
            <MyTextApp style={{ color: COLORS.white }}>{price}</MyTextApp>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <MyTextApp style={{ color: colors.text }}>
            {t("event.stock")}
          </MyTextApp>
          <MyTextApp>
            {stock}/{getTotalBox(itemServiceID, item?.symbol, stage)}
          </MyTextApp>
        </View>
      </View>
      <BuyMysteryBox
        title={t("event.buy")}
        item={item}
        amount={amount}
        price={price}
        balances={onchainBalances}
        stage={stage}
        onProcessing={() => {
          return false;
        }}
        onSuccessful={() => {
          loadData();
        }}
        onError={() => {
          return false;
        }}
        setAmount={setAmount}
        gameServiceID={itemServiceID}
      />
      <ButtonComponent
        title={t("event.detail")}
        color="transparent"
        borderColor={COLORS.white}
        onPress={event}
      />
    </View>
  );
}
