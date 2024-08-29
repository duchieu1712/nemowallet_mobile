import * as AccountReducers from "../modules/account/reducers";

import { AppState, Platform, StatusBar, StyleSheet, View } from "react-native";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from "react";
import {
  StackActions,
  useNavigation,
  useTheme,
} from "@react-navigation/native";

import AccountScreen from "../screens/AccountScreen/AccountScreen";
import ApprovalScreen from "../screens/AccountScreen/ApprovalScreen/ApprovalScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CodeScannerScreen from "../screens/WalletScreen/CodeScannerScreen/CodeScannerScreen";
import DepositTokenScreen from "../screens/WalletScreen/DepositTokenScreen/DepositTokenScreen";
import DetailNFTScreen from "../screens/DetailNftScreen/DetailNftScreen";
import DetailNotifyScreen from "../screens/EventScreen/NotificationScreen/Component/detail_notify";
import DrawerNavigation from "./DrawerNavigation";
import GoogleAuthenticatorScreen from "../screens/AuthScreen/GoogleAuthenticatorScreen/GoogleAuthenticatorScreen";
import INOBoxDetailScreen from "../screens/EventScreen/MysteryBoxScreen/INOBoxDetailScreen/INOBoxDetailScreen";
import ImageViewScreen from "../screens/AccountScreen/MyAccountScreen/ImageViewScreen/ImageViewScreen";
import { LOCALE_STORAGE } from "../common/enum";
import LandPortalScreen from "../screens/EventScreen/LandPortalScreen/LandPortalScreen";
import MapDescriptionScreen from "../screens/EventScreen/LandPortalScreen/MapDescriptionScreen/MapDescriptionScreen";
import MyAccountScreen from "../screens/AccountScreen/MyAccountScreen/MyAccountScreen";
import MysteryBoxDetailScreen from "../screens/EventScreen/MysteryBoxScreen/MysteryBoxDetailScreen/MysteryBoxDetailScreen";
import MysteryBoxScreen from "../screens/EventScreen/MysteryBoxScreen/MysteryBoxScreen";
import MysteryHouseGuideScreen from "../screens/EventScreen/LandPortalScreen/MySteryHouseGuideScreen/MysteryHouseGuideScreen";
import NotificationScreen from "../screens/EventScreen/NotificationScreen/NotificationScreen";
import OnBoardingScreen from "../screens/OnBoardingScreen/OnBoardingScreen";
import OnTouchIDScreen from "../screens/AuthScreen/OnTouchIDScreen/OnTouchIDScreen";
import QRCodeScreen from "../screens/WalletScreen/QRCodeScreen/QRCodeScreen";
import RequiredSiginScreen from "../screens/AuthScreen/RequiredSignInScreen/RequiredSignInScreen";
import ResetPasswordScreen from "../screens/AuthScreen/ResetPasswordScreen/ResetPasswordScreen";
import RuleScreen from "../screens/EventScreen/MysteryBoxScreen/RuleScreen/RuleScreen";
import SearchScreen from "../screens/SearchScreen/SearchScreen";
import SecurityScreen from "../screens/AccountScreen/SecurityScreen/SecurityScreen";
import SignInScreen from "../screens/AuthScreen/SignInScreen/SignInScreen";
import SignUpScreen from "../screens/AuthScreen/SignUpScreen/SignUpScreen";
import StakingScreen from "../screens/EventScreen/StakingScreen/StakingScreen";
import SwapScreen from "../screens/WalletScreen/SwapScreen/SwapScreen";
import TokenScreen from "../screens/WalletScreen/TokenScreen/TokenScreen";
import VerifyEmailStep1Screen from "../screens/AuthScreen/VerifyEmailScreen/VerifyEmailStep1Screen/VerifyEmailStep1Screen";
import VerifyEmailStep2Screen from "../screens/AuthScreen/VerifyEmailScreen/VerifyEmailStep2Screen/VerifyEmailStep2Screen";
import WalletConnectModalApp from "../components/ModalComponent/WalletConnectModalComponent";
import WithdrawScreen from "../screens/WalletScreen/WithdrawTokenScreen/WithdrawTokenScreen";
import HomeScreen from "../screens/Home";

import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { isEmpty } from "lodash";

const MyStatusBar = ({ ...props }) => (
  <View style={[styles.statusBar]}>
    <StatusBar translucent {...props} backgroundColor="transparent" />
  </View>
);

const Stack = createStackNavigator();

const StackNavigator = ({ ...props }) => {
  const initPage = props.initPage;
  const { pageRouter } = props;

  const { colors }: { colors: any } = useTheme();
  const theme = useTheme();

  const navigation = useNavigation();
  const appState = useRef(AppState.currentState);
  const [backgroundNoti, setBackgroundNoti] = useState("notibar");
  const accountWeb = useSelector(AccountReducers.dataAccount);

  // deep-link uri schema
  useEffect(() => {
    console.log("annnnnnn ENV", process.env.ENV);
    try {
      if (!pageRouter?.screen) return;
      const stackLength = navigation.getState().routes.length;
      const nameScreen = navigation.getState().routes[stackLength - 1]?.name;
      if (
        stackLength != 0 &&
        (nameScreen == "OnTouchIDScreen" || nameScreen == "SignInScreen")
      )
        return;
      if (pageRouter?.params) {
        navigation.navigate(pageRouter?.screen as never, pageRouter?.params);
      } else {
        navigation.navigate(pageRouter?.screen as never);
      }
    } catch {}
  }, [pageRouter, navigation]);

  // Touch ID if background 5 minutes
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (!accountWeb) return;
      if (nextAppState == "background") {
        AsyncStorage.setItem(
          LOCALE_STORAGE.TIME_BACK_GROUND,
          dayjs().valueOf().toString(),
        );
      }
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        AsyncStorage.getItem(LOCALE_STORAGE.IS_LOGINED).then((isLogin) => {
          if (isLogin == "true") {
            AsyncStorage.getItem(LOCALE_STORAGE.TIME_BACK_GROUND).then(
              (value: any) => {
                if (isEmpty(value)) return;
                // 3 minutes - milliseconds
                const MINUTE_CHECK_BIO = 60000 * 3;
                // const MINUTE_CHECK_BIO = 15;
                if (
                  parseInt(value?.toString() ?? 0) + MINUTE_CHECK_BIO <
                  dayjs().valueOf()
                ) {
                  const stackLength = navigation.getState().routes.length;
                  if (
                    stackLength != 0 &&
                    navigation.getState().routes[stackLength - 1]?.name ==
                      "OnTouchIDScreen"
                  )
                    return;
                  if (stackLength > 1) {
                    const popAction = StackActions.pop(stackLength);
                    navigation.dispatch(popAction);
                  }
                  const replaceAction = StackActions.replace(
                    "OnTouchIDScreen" as never,
                  );
                  navigation.dispatch(replaceAction);
                  AsyncStorage.setItem(LOCALE_STORAGE.TIME_BACK_GROUND, "");
                }
              },
            );
          }
        });
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const listRouternotGrey: any = [
    "DrawerNavigation",
    "DetailNFTScreen",
    "MysteryBoxDetailScreen",
    "INOBoxDetailScreen",
    "LandPortalScreen",
    "SearchScreen",
  ];
  useEffect(() => {
    if (!navigation) return;
    const unsubscribe = navigation.addListener("state", () => {
      const routes = navigation.getState()?.routes;
      if (!routes) return;
      const nameRoutes = routes[routes.length - 1]?.name;
      if (listRouternotGrey.includes(nameRoutes)) {
        setBackgroundNoti("notibar");
      } else {
        setBackgroundNoti("background");
      }
    });
    return unsubscribe;
  }, [navigation]);

  return (
    initPage && (
      <View
        style={[styles.container, { backgroundColor: colors[backgroundNoti] }]}
      >
        <MyStatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
        <Stack.Navigator
          initialRouteName={initPage}
          // initialRouteName={'signin'}
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: "transparent" },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        >
          <Stack.Screen name="OnBoardingScreen" component={OnBoardingScreen} />
          {/* <Stack.Screen name="SignInScreen" component={SignInV1} /> */}
          <Stack.Screen name="SignInScreen" component={SignInScreen} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          <Stack.Screen
            name="VerifyEmailStep1Screen"
            component={VerifyEmailStep1Screen}
          />
          <Stack.Screen
            name="VerifyEmailStep2Screen"
            component={VerifyEmailStep2Screen}
          />
          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
          />
          <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
          <Stack.Screen name="OnTouchIDScreen" component={OnTouchIDScreen} />
          <Stack.Screen
            name="NotificationScreen"
            component={NotificationScreen}
          />
          <Stack.Screen name="SearchScreen" component={SearchScreen} />
          <Stack.Screen name="WithdrawScreen" component={WithdrawScreen} />
          <Stack.Screen name="DepositScreen" component={DepositTokenScreen} />
          <Stack.Screen name="TokenScreen" component={TokenScreen} />
          <Stack.Screen name="AccountScreen" component={AccountScreen} />
          <Stack.Screen name="MyAccountScreen" component={MyAccountScreen} />
          <Stack.Screen
            name="RequiredSignInScreen"
            component={RequiredSiginScreen}
          />
          <Stack.Screen
            name="WalletConnectModal"
            component={WalletConnectModalApp}
          />
          <Stack.Screen name="DetailNFTScreen" component={DetailNFTScreen} />
          <Stack.Screen name="ApprovalScreen" component={ApprovalScreen} />
          <Stack.Screen name="SecurityScreen" component={SecurityScreen} />
          <Stack.Screen
            name="GoogleAuthenticatorScreen"
            component={GoogleAuthenticatorScreen}
          />
          <Stack.Screen
            name="MysteryBoxDetailScreen"
            component={MysteryBoxDetailScreen}
          />
          <Stack.Screen name="MysteryBoxScreen" component={MysteryBoxScreen} />
          <Stack.Screen name="INOBoxDetail" component={INOBoxDetailScreen} />
          <Stack.Screen name="StakingScreen" component={StakingScreen} />
          <Stack.Screen name="LandPortalScreen" component={LandPortalScreen} />
          <Stack.Screen
            name="MysteryHouseGuideScreen"
            component={MysteryHouseGuideScreen}
          />
          <Stack.Screen
            name="MapDescriptionScreen"
            component={MapDescriptionScreen}
          />
          <Stack.Screen name="RuleScreen" component={RuleScreen} />
          <Stack.Screen name="ImageViewScreen" component={ImageViewScreen} />
          <Stack.Screen
            name="DetailNotifyScreen"
            component={DetailNotifyScreen}
          />
          <Stack.Screen name="SwapScreen" component={SwapScreen} />
          <Stack.Screen
            name="CodeScannerScreen"
            component={CodeScannerScreen}
          />
          <Stack.Screen name="QRCodeScreen" component={QRCodeScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
        </Stack.Navigator>
      </View>
    )
  );
};

const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 35 : StatusBar.currentHeight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: STATUSBAR_HEIGHT,
    paddingBottom: Platform.OS == "ios" ? 20 : 0,
  },
  statusBar: {
    height: 0,
    backgroundColor: "transparent",
  },
});
export default StackNavigator;
