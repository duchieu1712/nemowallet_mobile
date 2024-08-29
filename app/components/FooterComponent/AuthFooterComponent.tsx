import * as AccountActions from "../../modules/account/actions";
import * as WalletActions from "../../modules/wallet/actions";

import { AccessToken, LoginManager } from "react-native-fbsdk-next";
import { COLORS, SOCIALS } from "../../themes/theme";
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { LOCALE_STORAGE, RESPONSE, TYPE_METHOD_LOGIN } from "../../common/enum";
import React, { useEffect, useState } from "react";
import { StackActions, useTheme } from "@react-navigation/native";
import {
  appleAuth,
  appleAuthAndroid,
} from "@invertase/react-native-apple-authentication";
import { getKey, saveAccount } from "../../modules/account/utilities";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ClassWithStaticMethod } from "../../common/static";
import DividerIconComponent from "../DividerComponent/DividerIconComponent";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Toast from "../ToastInfo";
import { rpcExecCogiChainNotEncodeParam } from "../RpcExec/toast_chain";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

const TYPE_PARAM_LOGIN = {
  ID_TOKEN: "id_token",
  ACCESS_TOKEN: "access_token",
};

export default function AuthFooterComponent({
  navigation,
}: {
  navigation: any;
}) {
  ///
  const dispatch = useDispatch();
  const dispatchSetProccessing = (pro: any) =>
    dispatch(AccountActions.setProccessing(pro));
  const dispatchAccount = (account: any) =>
    dispatch(AccountActions.dataAccountResponse(account));
  const dispatchConnect = () => dispatch(WalletActions.connect());

  ///
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [onProcessing, setOnProcessing] = useState(false);

  useEffect(() => {
    dispatchSetProccessing(onProcessing);
  }, [onProcessing]);

  // Login Facebook
  const _signInWithFacebook = async () => {
    try {
      setOnProcessing(true);
      const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ]);
      if (result.isCancelled) {
        setOnProcessing(false);
        Toast.error("User cancelled the login process");
        return;
      }
      AccessToken.getCurrentAccessToken().then((data: any) => {
        const accessToken = data.accessToken.toString();
        signIn(
          accessToken,
          TYPE_PARAM_LOGIN.ACCESS_TOKEN,
          TYPE_METHOD_LOGIN.FACEBOOK,
        );
      });
    } catch (error: any) {
      setOnProcessing(false);
      Toast.error(error.message);
    }
  };
  // login with Google
  GoogleSignin.configure({
    scopes: ["profile", "email"],
    webClientId:
      "819005840904-bp773cpvq3bmjipb7di7n0gf5o7ebbcr.apps.googleusercontent.com",
    offlineAccess: true,
  });
  const _signInWithGoogle = async () => {
    try {
      setOnProcessing(true);
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const getTokens: any = await GoogleSignin.getTokens();
      const id_token = getTokens?.idToken;
      signIn(id_token, TYPE_PARAM_LOGIN.ID_TOKEN, TYPE_METHOD_LOGIN.GOOGLE);
    } catch (error: any) {
      setOnProcessing(false);
      Toast.error(error.message);
    }
  };

  // sign in with Apple
  const _signInWithApple = async () => {
    try {
      setOnProcessing(true);
      if (Platform.OS === "ios") {
        // Start the sign-in request
        const appleAuthRequestResponse = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });

        // Ensure Apple returned a user identityToken
        if (!appleAuthRequestResponse.identityToken) {
          setOnProcessing(false);
          Toast.error("Apple Sign-In failed - no identify token returned");
        } else {
          const identityToken = appleAuthRequestResponse.identityToken;
          signIn(
            identityToken,
            TYPE_PARAM_LOGIN.ID_TOKEN,
            TYPE_METHOD_LOGIN.APPLE_ID,
          );
        }
      } else {
        appleAuthAndroid.configure({
          // The Service ID you registered with Apple
          clientId: "com.nemowallet.mobile",
          responseType: appleAuthAndroid.ResponseType.ALL,
          scope: appleAuthAndroid.Scope.ALL,
          redirectUri: "",
        });
        const response = await appleAuthAndroid.signIn();
        const identityToken = response.id_token;
        signIn(
          identityToken,
          TYPE_PARAM_LOGIN.ID_TOKEN,
          TYPE_METHOD_LOGIN.APPLE_ID,
        );
      }
    } catch (error) {
      setOnProcessing(false);
      console.error(error);
    }
  };

  const signIn = async (token: any, type_param: any, type_method: any) => {
    const data: any = {
      grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
      client_id: process.env.AUTH0_ID,
      client_secret: process.env.AUTH0_SECRET,
      scope: process.env.SCOPE,
      audience: type_method,
      subject_token_type: `urn:ietf:params:oauth:token-type:${type_param}`,
      subject_token: token,
    };

    fetch(`${process.env.LINK_OIDC}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(data).toString(),
    })
      .then(async (data) => await data.json())
      .then(function (response) {
        if (response.error_description) {
          setOnProcessing(false);
          Toast.error(response.error_description);
          return;
        }
        makeTokenRequest(response, type_method);
      })
      .catch(function (error) {
        setOnProcessing(false);
        Toast.error(error.message);
        console.log(error);
      });
    return true;
  };

  const makeTokenRequest = async (response: any, type_method: any) => {
    try {
      if (!response?.access_token) {
        setOnProcessing(false);
        Toast.error("Error");
        return;
      }
      const keyLogin = await getKey();
      const content: any = await rpcExecCogiChainNotEncodeParam({
        method: "nemo_id.login_mb",
        params: [
          {
            public_key: keyLogin?.publicKeyBytes,
            access_token: response.access_token,
            token_type: "Bearer",
          },
        ],
      });
      if (!content.error) {
        if (content.google_two_factor_authentication) {
          rpcExecCogiChainNotEncodeParam({
            method: "nemo_id.signature",
            params: [
              {
                public_key: keyLogin?.publicKeyBytes,
                account: content.nemo_address,
                sub: content.sub,
              },
            ],
            _2fa: content.google_two_factor_authentication,
            callback: (contentAuth_info: any, flagResponse: any) => {
              setOnProcessing(false);
              if (flagResponse == RESPONSE.ERROR) {
                Toast.error(contentAuth_info.message);
                return;
              }
              const ress = {
                ...content,
                ...contentAuth_info,
                accessTokenExpires: Date.now() + response.expires_in * 1000,
                publicKeyBytes: keyLogin?.publicKeyBytes,
                privateKeyBytes: keyLogin?.privateKeyBytes,
                // code_verifier: codeLogin.codeVerifier,
                // code: codeGID,
              };
              saveAccount(ress);
              dispatchAccount(ress);
              ClassWithStaticMethod.SET_USER_INFO(ress);
              dispatchConnect();
              // Navigation
              AsyncStorage.setItem(LOCALE_STORAGE.METHOD_LOGIN, type_method);
              // navigation.goBack();
              navigation.dispatch(StackActions.popToTop());
            },
          });
        } else {
          setOnProcessing(false);
          const ress = {
            ...content,
            accessTokenExpires: Date.now() + response.expires_in * 1000,
            publicKeyBytes: keyLogin?.publicKeyBytes,
            privateKeyBytes: keyLogin?.privateKeyBytes,
            // code_verifier: codeLogin.codeVerifier,
            // code: codeGID,
          };
          saveAccount(ress);
          dispatchAccount(ress);
          ClassWithStaticMethod.SET_USER_INFO(ress);
          dispatchConnect();
          // Navigation
          // navigation.goBack();
          navigation.dispatch(StackActions.popToTop());
        }
      } else {
        setOnProcessing(false);
        AsyncStorage.setItem(LOCALE_STORAGE.ACCOUNT, "");
        dispatchAccount(null);
        Toast.error(content.error_description);
        ClassWithStaticMethod.SET_USER_INFO(null);
      }
    } catch (e) {
      setOnProcessing(false);
      Toast.error(e.message);
      ClassWithStaticMethod.SET_USER_INFO(null);
    }
  };

  return (
    <View style={styles.container}>
      <DividerIconComponent
        text={t("auth.login_social")}
        color={COLORS.divider}
        colorText={colors.text}
      />
      <View style={styles.socials}>
        {Platform.OS === "ios" && (
          <TouchableOpacity onPress={_signInWithApple}>
            <Image source={SOCIALS.apple} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={_signInWithGoogle}>
          <Image source={SOCIALS.google} />
        </TouchableOpacity>
        {Platform.OS === "android" && (
          <TouchableOpacity onPress={_signInWithApple}>
            <Image source={SOCIALS.apple} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={_signInWithFacebook}>
          <Image source={SOCIALS.facebook} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  text: {
    color: "#fff",
  },
  socials: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 40,
    marginVertical: 24,
  },
});
