// import { Steps } from "antd";

import { COLORS, MyTextApp } from "../../../themes/theme";
import { StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";

import StepIndicator from "react-native-step-indicator";
import { customStyleStep } from "../../../themes/styleSheet";

export function StepByStep({
  value,
  listName,
}: {
  value: any;
  listName: any | any[];
}): JSX.Element {
  // const { Step } = Steps;
  const [valueStep, setValueStep]: [valueSlider: number, setValueSilder: any] =
    useState(0);
  useEffect(() => {
    setValueStep(value);
    setValueStep(0);
  }, []);

  useEffect(() => {
    setValueStep(value);
  }, [value]);

  const renderLabel = ({
    position,
    label,
    currentPosition,
  }: {
    position: number;
    stepStatus: string;
    label: string;
    currentPosition: number;
  }) => {
    return (
      <MyTextApp
        style={
          position === currentPosition
            ? styles.stepLabelSelected
            : styles.stepLabel
        }
      >
        {label}
      </MyTextApp>
    );
  };

  return (
    <View style={{ width: "100%" }}>
      {/* <Steps current={valueStep}>
        {listName.map((e: any, i: any) => {
          return <Step key={i} title={e} />;
        })}
      </Steps> */}
      <StepIndicator
        stepCount={listName.length}
        customStyles={customStyleStep}
        currentPosition={valueStep}
        labels={listName}
        renderLabel={renderLabel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stepLabel: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
    color: COLORS.descriptionText,
  },
  stepLabelSelected: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
    color: COLORS.primary,
  },
});
