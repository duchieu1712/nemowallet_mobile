import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef } from "react";

import AppIntroSlider from "react-native-app-intro-slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import FeatherIcon from "react-native-vector-icons/Feather";
import { LOCALE_STORAGE } from "../../common/enum";
import { MyTextApp } from "../../themes/theme";
import { useTranslation } from "react-i18next";

export default function OnBoardingScreen({ navigation }: { navigation: any }) {
  const sliders = useRef<any>();

  const { t } = useTranslation();

  const slides = [
    {
      key: 1,
      title: t("onboard.title_1"),
      text: t("onboard.description_1"),
      image: require("../../assets/images/images_n69/homepage/intro_1.png"),
      backgroundColor: "transparent",
    },
    {
      key: 2,
      title: t("onboard.title_2"),
      text: t("onboard.description_2"),
      image: require("../../assets/images/images_n69/homepage/intro_2.png"),
      backgroundColor: "transparent",
    },
    {
      key: 3,
      title: t("onboard.title_3"),
      text: t("onboard.description_3"),
      image: require("../../assets/images/images_n69/homepage/intro_3.png"),
      backgroundColor: "transparent",
    },
  ];

  const RenderItem = ({ item }: { item: any }) => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: item.backgroundColor,
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 60,
          position: "relative",
        }}
      >
        <Image
          source={item.image}
          style={styles.sliderImage}
          resizeMode="cover"
        />
        <MyTextApp style={styles.title}>{item.title}</MyTextApp>
        <MyTextApp style={styles.text}>{item.text}</MyTextApp>
      </View>
    );
  };

  const onDone = () => {
    navigation.replace("SignInScreen");
  };
  const onSkip = () => {
    navigation.replace("SignInScreen");
  };

  const RenderSkipButton = () => {
    return (
      <TouchableOpacity style={styles.skip} onPress={onSkip}>
        <MyTextApp
          style={{
            ...styles.text,
            textAlign: "right",
            fontSize: 16,
          }}
        >
          {t("onboard.skip")}
        </MyTextApp>
        <FeatherIcon
          size={24}
          color={"rgba(201, 197, 202, 1)"}
          name="arrow-right"
        />
      </TouchableOpacity>
    );
  };

  const RenderNextButton = () => {
    return (
      <ButtonComponent
        style={styles.nextBtn}
        onPress={() => {
          sliders.current.goToSlide(sliders.current.state.activeIndex + 1);
        }}
        title={t("onboard.next")}
      />
    );
  };

  const RenderDoneButton = () => {
    return (
      <ButtonComponent
        style={styles.nextBtn}
        onPress={onDone}
        title={t("onboard.start")}
      />
    );
  };

  AsyncStorage.setItem(LOCALE_STORAGE.IS_ON_BORDING, "true");

  // console.log('sliderssss', sliders.current);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/images_n69/homepage/SplashScreen.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <RenderSkipButton />
        <AppIntroSlider
          data={slides}
          renderItem={RenderItem}
          ref={(ref) => (sliders.current = ref)}
          doneLabel={t("onboard.start")}
          dotClickEnabled
          dotStyle={{
            backgroundColor: "#36393E",
          }}
          activeDotStyle={{
            backgroundColor: "#5142FC",
            width: 30,
          }}
          bottomButton
          nextLabel={t("onboard.next")}
          style={{
            backgroundColor: "transparent",
          }}
          renderNextButton={RenderNextButton}
          renderDoneButton={RenderDoneButton}
          // renderSkipButton={RenderSkipButton}
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    margin: 0,
    position: "relative",
    backgroundColor: "#14141F",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    // backgroundColor: "#14141f",
    padding: 15,
    position: "relative",
  },
  intro_1: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // padding: 15,
    height: "100%",
    backgroundColor: "#14141F",
  },
  title: {
    fontSize: 25,
    color: "#fff",
    textAlign: "center",
    marginTop: 0,
    marginBottom: 15,
    fontWeight: 700,
  },
  text: {
    fontSize: 16,
    color: "#C9C5CA",
    textAlign: "center",
  },
  sliderImage: {
    maxHeight: 400,
    height: 400,
    width: "100%",
    aspectRatio: "4/4",
  },
  skip: {
    flex: 1,
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 200,
    width: "100%",
    paddingTop: 30,
    paddingRight: 15,
    gap: 8,
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
    // borderWidth: 1,
    // borderColor: "red"
  },
  nextBtn: {
    padding: 10,
    backgroundColor: "#5142FC",
    // borderRadius: 30,
  },
});
