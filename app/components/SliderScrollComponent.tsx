// import { Slider } from 'antd'

import { COLORS, FONTS, MyTextApp } from "../themes/theme";
import { View } from "react-native";
import { useMemo, useRef, useState } from "react";

import { RangeSlider } from "@sharcoux/slider";
import { useTheme } from "@react-navigation/native";

// import { listFilterEquipment } from '../config/filters'

export function SliderScrolls9DComponent({
  onChangeSliderCallBack,
  value,
  list,
}: {
  onChangeSliderCallBack: any;
  value: any;
  list: any[] | any;
}): JSX.Element {
  const refSliderScrolls_9D = useRef();
  const onSlidingCompleted = (r: any) => {
    onChangeSliderCallBack(r);
  };

  const { colors, dark } = useTheme();
  const [range, setRange]: [range: [number, number], setRange: any] =
    useState(value);

  const CustomMark = ({
    value: _value,
    active,
  }: {
    value: any;
    active: boolean;
  }) => {
    return (
      refSliderScrolls_9D.current && (
        <View
          style={{
            width: 14,
            height: 14,
          }}
        >
          {(_value === list[0].grade ||
            _value === list[list.length - 1].grade ||
            range.includes(_value)) && (
            <MyTextApp
              style={{
                // height: 24,
                color: colors.text,
                textAlign: "left",
                position: "absolute",
                top: 20,
                left: 0,
                width: 40,
                ...FONTS.fontBold,
                height: 60,
              }}
            >
              {list[_value]?.name}
            </MyTextApp>
          )}
        </View>
      )
    );
  };

  return (
    <View>
      <RangeSlider
        ref={refSliderScrolls_9D}
        step={1}
        style={{
          width: "100%",
          height: 40,
          paddingHorizontal: 20,
        }}
        crossingAllowed
        onSlidingComplete={onSlidingCompleted}
        onValueChange={setRange}
        outboundColor={dark ? "#E5E5E5" : colors.card}
        inboundColor={colors.primary}
        thumbTintColor={colors.primary}
        slideOnTap={true}
        range={value}
        minimumRange={list[0].grade}
        maximumValue={list[list.length - 1].grade}
        CustomMark={CustomMark}
      />
    </View>
  );
}

export function SliderQualityComponent({
  onChangeSlider,
  value,
  list,
  paddingBottom,
}: {
  onChangeSlider: any;
  value: any;
  list: any[] | any;
  paddingBottom?: any;
}) {
  const refSliderQuality = useRef();
  const onSlidingCompleted = (value: any) => {
    onChangeSlider(value);
  };

  const { dark, colors } = useTheme();

  const [range, setRange]: [range: [number, number], setRange: any] =
    useState(value);

  const CustomMark = useMemo(() => {
    return ({ value: _value, active }: { value: any; active: boolean }) =>
      refSliderQuality.current && (
        <View
          style={{
            width: 14,
            height: 14,
            borderRadius: 10,
            backgroundColor:
              _value < range[0] || _value > range[1]
                ? dark
                  ? COLORS.white
                  : colors.text
                : colors.primary,
          }}
        >
          {_value !== list.length - 1 && (
            <MyTextApp
              style={{
                // height: 24,
                color: colors.text,
                textAlign: "left",
                position: "absolute",
                top: 20,
                left: -10,
                width: 40,
                ...FONTS.fontBold,
                height: 60,
              }}
            >
              {list[_value]?.name}
            </MyTextApp>
          )}
          {_value === list.length - 1 && (
            <MyTextApp
              style={{
                color: colors.text,
                height: 24,
                textAlign: "left",
                position: "absolute",
                top: 20,
                left: -25,
                width: 50,
                ...FONTS.fontBold,
              }}
            >
              {list[_value]?.name}
            </MyTextApp>
          )}
        </View>
      );
  }, [range]);
  return (
    <View
      style={{
        paddingBottom: paddingBottom ?? undefined,
        width: "100%",
      }}
    >
      <RangeSlider
        ref={refSliderQuality}
        style={{
          width: "100%",
          height: 40,
          paddingHorizontal: 20,
          overflow: "visible",
        }}
        step={1}
        minimumRange={1}
        maximumValue={list?.length - 1}
        onSlidingComplete={onSlidingCompleted}
        onValueChange={setRange}
        range={value}
        crossingAllowed
        outboundColor={dark ? "#E5E5E5" : colors.card}
        inboundColor={colors.primary}
        thumbTintColor={colors.primary}
        CustomMark={CustomMark}
      />
    </View>
  );
}

export function SlidersPetComponent({
  onChangeSlider,
  value,
  list,
}: {
  onChangeSlider: any;
  value: any;
  list: any[] | any;
}) {
  const refSlidersPet = useRef();
  const onSlidingCompleted = (value: any) => {
    onChangeSlider(value);
  };

  const { dark, colors } = useTheme();
  const [range, setRange]: [range: [number, number], setRange: any] =
    useState(value);

  const CustomMark = ({
    value: _value,
    active,
  }: {
    value: any;
    active: boolean;
  }) => {
    return (
      refSlidersPet.current && (
        <View
          style={{
            width: 14,
            height: 14,
            borderRadius: 10,
            backgroundColor:
              _value < range[0] || _value > range[1]
                ? dark
                  ? COLORS.white
                  : colors.text
                : colors.primary,
          }}
        >
          <MyTextApp
            style={{
              // height: 24,
              color: colors.text,
              textAlign: "left",
              position: "absolute",
              top: 20,
              left: -10,
              width: 60,
              ...FONTS.fontBold,
              height: 60,
            }}
          >
            {list[_value]?.name}
          </MyTextApp>
        </View>
      )
    );
  };
  return (
    <RangeSlider
      ref={refSlidersPet}
      style={{
        width: "100%",
        height: 60,
        paddingHorizontal: 20,
      }}
      step={1}
      minimumRange={1}
      maximumValue={list?.length - 1}
      onSlidingComplete={onSlidingCompleted}
      onValueChange={setRange}
      range={value}
      outboundColor={dark ? "#E5E5E5" : colors.card}
      inboundColor={colors.primary}
      thumbTintColor={colors.primary}
      CustomMark={CustomMark}
    />
  );
}

export function SliderScrollsGalixComponent({
  onChangeSliderCallBack,
  value,
  list,
}: {
  onChangeSliderCallBack: any;
  value: any;
  list: any[] | any;
}): JSX.Element {
  const refSliderScrolls_Galix = useRef<any>(null);
  const onSlidingCompleted = (r: any) => {
    onChangeSliderCallBack(r);
  };

  const { colors, dark } = useTheme();
  const [range, setRange]: [range: [number, number], setRange: any] =
    useState(value);

  const CustomMark = useMemo(() => {
    return ({ value: _value, active }: { value: any; active: boolean }) => (
      <View
        style={{
          width: 14,
          height: 14,
        }}
      >
        {(_value === list[0].grade ||
          _value === list[list.length - 1].grade ||
          range.includes(_value)) && (
          <MyTextApp
            style={{
              height: 24,
              color: colors.text,
              textAlign: "left",
              position: "absolute",
              top: 20,
              left: 0,
              width: 40,
              ...FONTS.fontBold,
            }}
          >
            {_value}
          </MyTextApp>
        )}
      </View>
    );
  }, [range]);

  return (
    <View style={{ marginBottom: 50 }}>
      <RangeSlider
        ref={refSliderScrolls_Galix}
        step={1}
        style={{
          width: "100%",
          height: 40,
          paddingHorizontal: 20,
        }}
        crossingAllowed
        onSlidingComplete={onSlidingCompleted}
        onValueChange={setRange}
        outboundColor={dark ? "#E5E5E5" : colors.card}
        inboundColor={colors.primary}
        thumbTintColor={colors.primary}
        slideOnTap={true}
        range={value}
        minimumRange={list[0].grade}
        maximumValue={list[list.length - 1].grade}
        CustomMark={CustomMark}
      />
    </View>
  );
}
