import * as AccountActions from "../modules/account/actions";
import * as AccountReducers from "../modules/account/reducers";
import * as ProfileActions from "../modules/profile/actions";
import * as ProfileReducers from "../modules/profile/reducers";
import * as WalletActions from "../modules/wallet/actions";

import {
  DEEP_LINK,
  DEEP_LINK_ID,
  DEEP_LINK_MARKETPLACE,
  URI_DIRECT,
} from "../common/constants";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  StackActions,
  createNavigationContainerRef,
} from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  SignOutCustom,
  decryptData,
  saveAccount,
} from "../modules/account/utilities";
import { useDispatch, useSelector } from "react-redux";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../themes/theme";
import { ClassWithStaticMethod } from "../common/static";
import ConfirmGoogleAuthenticator from "../screens/AccountScreen/Component/ConfirmGoogleAuthenticatorComponent";
import { FullscreenLoading } from "../components/FullscreenLoading";
import { LOCALE_STORAGE } from "../common/enum";
import { Linking } from "react-native";
import ModalCheckNetworkComponent from "../components/ModalComponent/NotNetworkComponent";
import PINAuthenticator from "../screens/AccountScreen/SecurityScreen/Component/SecurityPINComponent";
import { RequestSignOutComponent } from "../components/RequestSignOut";
import StackNavigator from "./StackNavigator";
import StatusNotificationComponent from "../components/ModalComponent/StatusNotificationComponent";
import ToastManager from "toastify-react-native";
import WarningVersionComponent from "../components/ModalComponent/WarningVersionComponent";
import { collectionsAddressFromSlugs } from "../common/utilities_config";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { rpcExecCogiChainNotEncodeParam } from "../components/RpcExec/toast_chain";
import themeContext from "../themes/themeContext";
import { useWalletConnectModal } from "@walletconnect/modal-react-native";
// import dynamicLinks from '@react-native-firebase/dynamic-links';

export const navigationRef = createNavigationContainerRef();
export function navigate(name: any, params: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
export function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}

export function navigationReplaceAll(nameScreenReplace: any, params?: any) {
  const stackLength = navigationRef.getState().routes.length;
  if (
    stackLength != 0 &&
    navigationRef.getState().routes[stackLength - 1]?.name == nameScreenReplace
  )
    return;
  if (stackLength > 1) {
    const popAction = StackActions.pop(stackLength);
    navigationRef.dispatch(popAction);
  }
  const replaceAction = StackActions.replace(
    nameScreenReplace as never,
    params,
  );
  navigationRef.dispatch(replaceAction);
}

const Routes = () => {
  const dispatch = useDispatch();
  // const navigation = useNavigation();
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const onActionCreatePIN = useSelector(ProfileReducers.onActionCreatePIN);
  // const onActionCreatePIN = true
  const accountWeb = useSelector(AccountReducers.dataAccount);
  const dataAuthenticators_Enabled = useSelector(
    ProfileReducers.dataAuthenticatorsEnabled,
  );
  const dispatchSetOnActionCreatePIN = (request: any) =>
    dispatch(ProfileActions.setOnActionCreatePIN(request));
  const dispatchAccount = (account: any) =>
    dispatch(AccountActions.dataAccountResponse(account));

  const authContext = React.useMemo(
    () => ({
      setDarkTheme: () => {
        AsyncStorage.setItem(LOCALE_STORAGE.IS_DARK_THEME, "true");
        setIsDarkTheme(true);
      },
      setLightTheme: () => {
        AsyncStorage.setItem(LOCALE_STORAGE.IS_DARK_THEME, "false");
        setIsDarkTheme(false);
      },
    }),
    [],
  );

  useEffect(() => {
    if (!dataAuthenticators_Enabled) return;
    if (
      !(
        accountWeb?.fund_password !=
          dataAuthenticators_Enabled?.fund_password ||
        accountWeb?.google_two_factor_authentication !=
          dataAuthenticators_Enabled.google_two_factor_authentication ||
        accountWeb?.fund_password_locked !=
          dataAuthenticators_Enabled?.fund_password_locked
      )
    )
      return;
    const ress = {
      ...accountWeb,
      ...dataAuthenticators_Enabled,
    };
    saveAccount(ress);
    dispatchAccount(ress);
    ClassWithStaticMethod.SET_USER_INFO(ress);
  }, [dataAuthenticators_Enabled]);

  useEffect(() => {
    // Dark/Light Mode
    AsyncStorage.getItem(LOCALE_STORAGE.IS_DARK_THEME).then((res) => {
      if (isEmpty(res)) return;
      if (res == "true") {
        authContext.setDarkTheme();
      } else {
        authContext.setLightTheme();
      }
    });
  }, []);

  const confirm2FA = useSelector(ProfileReducers.confirm2FA);
  const { isConnected, provider } = useWalletConnectModal();
  const dispatchSetProvider = (provider: any) =>
    dispatch(WalletActions.setProvider(provider));

  const dispatchGetExtract_Secured_Methods = () =>
    dispatch(ProfileActions.getExtract_Secured_Methods());
  const dispatchGetAuthenticators_enabled = () =>
    dispatch(ProfileActions.getAuthenticators_Enabled());
  const dispatchConnect = () => dispatch(WalletActions.connect());

  useEffect(() => {
    dispatchSetProvider(provider);
  }, [isConnected, provider]);

  useEffect(() => {
    dispatchGetExtract_Secured_Methods();
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      // extract_secured_methods
      dispatchConnect();
      dispatchGetExtract_Secured_Methods();
      const flagSignOut = await AsyncStorage.getItem(
        LOCALE_STORAGE.FLAG_SIGNOUT,
      );
      if (flagSignOut == "true") {
        await AsyncStorage.setItem(LOCALE_STORAGE.FLAG_SIGNOUT, "false");
        SignOutCustom(dispatchAccount);
        navigationReplaceAll("SignInScreen");
        return;
      }
      const data = decryptData(
        await AsyncStorage.getItem(LOCALE_STORAGE.ACCOUNT),
      );
      if (data && data != "") {
        const jsonData = JSON.parse(data);
        if (jsonData?.signature?.ttl < Math.floor(dayjs().valueOf() / 1000)) {
          SignOutCustom(dispatchAccount);
          navigationReplaceAll("SignInScreen");
          return;
        }
        if (parseInt(jsonData.accessTokenExpires) > dayjs().valueOf()) {
          dispatchAccount(jsonData);
          // account_info
          dispatchGetAuthenticators_enabled();
        } else {
          refreshAccessToken(jsonData)
            .then((res) => {
              const content = {
                ...res,
                publicKeyBytes: jsonData.publicKeyBytes,
                privateKeyBytes: jsonData.privateKeyBytes,
                code_verifier: jsonData.code_verifier,
                code: jsonData.code,
                refresh_token: res.refresh_token,
                access_token: res.access_token,
              };
              saveAccount(content);
              dispatchAccount(content);
            })
            .catch((_) => {
              SignOutCustom(dispatchAccount);
              navigationReplaceAll("SignInScreen");
            });
        }
      } else {
        SignOutCustom(dispatchAccount);
        navigationReplaceAll("SignInScreen");
      }
    } catch {
      SignOutCustom(dispatchAccount);
      navigationReplaceAll("SignInScreen");
    }
  };

  async function refreshAccessToken(jsonData: any) {
    try {
      // Get a new set of tokens with a refreshToken
      const tokenResponse: any = await rpcExecCogiChainNotEncodeParam({
        method: "nemo_id.re_login",
        params: [
          {
            public_key: jsonData?.publicKeyBytes,
            refresh_token: jsonData?.refresh_token,
            code_verifier: jsonData?.code_verifier,
            redirect_uri: process.env.DOMAIN_PUBLIC + URI_DIRECT,
          },
        ],
      });
      return {
        ...jsonData,
        accessTokenExpires: Date.now() + tokenResponse.expires_in * 1000,
        expires_in: tokenResponse.expires_in,
        access_token: tokenResponse.access_token,
        accessTokenExpiry: tokenResponse.expires_in,
        refresh_token: tokenResponse.refresh_token,
        code_verifier: jsonData?.code_verifier,
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  // set up UI
  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      background: COLORS.background,
      title: COLORS.title,
      card: COLORS.card,
      text: COLORS.text,
      borderColor: COLORS.border,
      input: "#EEEDED",
      tabBar: "#ebebeb",
      primary: COLORS.primary,
      card2: COLORS.card2,
      notibar: COLORS.notibar,
    },
  };

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      background: COLORS.darkBackground,
      title: COLORS.darkTitle,
      card: COLORS.greyBackground,
      text: COLORS.descriptionText,
      borderColor: COLORS.borderColor,
      input: COLORS.backgroundInput,
      tabBar: COLORS.tabBarDark,
      primary: COLORS.primary,
      card2: COLORS.card2Dark,
      notibar: COLORS.notibarDark,
    },
  };

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;
  const [pageRouter, setPageRouter] = useState<any>(null);

  const linking = {
    prefixes: [DEEP_LINK_ID, DEEP_LINK],
    config: {
      screens: {
        SignInScreen: "callback/",
      },
    },

    // Custom function to subscribe to incoming links
    subscribe(listener: any) {
      const linkingSubscription = Linking.addEventListener(
        "url",
        ({ url }: { url: any }) => {
          try {
            const _url = url
              .replace(DEEP_LINK_MARKETPLACE, "")
              .replace(DEEP_LINK_ID, "");
            const splitUrl = _url.split("/");
            const screen = splitUrl?.length >= 0 ? splitUrl[0] : "";
            if (screen.toLowerCase() == "marketplace") {
              const serviceID = splitUrl
                ? splitUrl[splitUrl.length - 1]?.replace("?serviceID=", "")
                : "";
              const lstAddress = collectionsAddressFromSlugs(
                [splitUrl?.length >= 1 ? splitUrl[1] : ("" as string)],
                serviceID.toString(),
              );
              if (lstAddress?.length == 0) return;
              setPageRouter({
                screen: "DetailNFTScreen",
                params: {
                  collectionID: lstAddress[0],
                  tokenID: splitUrl?.length >= 2 ? splitUrl[2] : "",
                  servicesID: serviceID,
                },
              });
              AsyncStorage.setItem(
                LOCALE_STORAGE._DATA_DEEP_LINGING,
                JSON.stringify({
                  collectionID: lstAddress[0],
                  tokenID: splitUrl?.length >= 2 ? splitUrl[2] : "",
                  servicesID: serviceID,
                }),
              );
            }
          } catch {}
          listener(url);
        },
      );

      return () => {
        linkingSubscription.remove();
      };
    },
  };

  // const handleDynamicLinks = async (link: any) => {
  //   console.log('Foreground link handling:', link)
  // }
  // useEffect(() => {
  //   const unsubscribe = dynamicLinks().onLink(handleDynamicLinks)
  //   return () => unsubscribe()
  // }, [])

  // init Page
  const [initPage, setInitPage] = useState<any>("");

  AsyncStorage.getItem(LOCALE_STORAGE.IS_ON_BORDING).then((e) => {
    if (e == "true") {
      AsyncStorage.getItem(LOCALE_STORAGE.IS_LOGINED).then((res) => {
        if (res == "true") {
          setInitPage("OnTouchIDScreen");
        } else {
          setInitPage("SignInScreen");
        }
      });
    } else {
      setInitPage("OnBoardingScreen");
    }
  });

  useEffect(() => {
    if (onActionCreatePIN && accountWeb) {
      navigationRef?.navigate("PINAuthenticator", {
        account: accountWeb,
        createPIN: !accountWeb?.fund_password,
      });
    }
  }, [onActionCreatePIN]);

  return (
    <themeContext.Provider value={authContext}>
      <NavigationContainer ref={navigationRef} theme={theme} linking={linking}>
        <StackNavigator initPage={initPage} pageRouter={pageRouter} />
        <ToastManager
          position="top"
          style={{
            width: "100%",
            paddingRight: 20,
          }}
          height="auto"
        />
        {/* <AdvertisementComponent /> */}
        <RequestSignOutComponent navigation={navigationRef} />
        <ModalCheckNetworkComponent />
        <ConfirmGoogleAuthenticator
          show={
            !!(
              confirm2FA?.action_2fa ||
              confirm2FA?.action_pin ||
              confirm2FA?.fee_gas
            )
          }
        />
        <PINAuthenticator
          onAction={onActionCreatePIN}
          setOnAction={dispatchSetOnActionCreatePIN}
          account={accountWeb}
          createPIN={!accountWeb?.fund_password}
        />
        <WarningVersionComponent />
        <StatusNotificationComponent />
        <FullscreenLoading />
      </NavigationContainer>
    </themeContext.Provider>
  );
};
export default Routes;
