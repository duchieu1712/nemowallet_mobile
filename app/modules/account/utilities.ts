import dayjs from "dayjs";
import { Ed25519SecretKey, SodiumPlus } from "sodium-plus";
import { CHAINID_COGI, KEY_BAMS } from "../../common/constants";
import { ClassWithStaticMethod } from "../../common/static";
// import { rpcExecCogiChainNotEncodeParam } from '../../components/RpcExec/toast_chain'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCALE_STORAGE, TYPE_METHOD_LOGIN } from "../../common/enum";
import { sha256 } from "../../common/utilities";
import { randomBytes } from "react-native-randombytes";
import { createCipheriv, createDecipheriv } from "react-native-crypto";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { LoginManager } from "react-native-fbsdk-next";

export const base64URLEncode = (str: string | any): any => {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

export function encryptData(text: string): any {
  if (!text || text == "") return "";
  const iv = randomBytes(16);

  const cipher = createCipheriv(
    "aes-256-cbc",
    Buffer.from(KEY_BAMS, "hex"),
    iv,
  );

  // Updating text
  let encrypted = cipher.update(text);

  // Using concatenation
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Returning iv and encrypted data
  return {
    iv: iv.toString("hex"),
    encryptedData: encrypted.toString("hex"),
  };
}

// A decrypt function
export function decryptData(text: any): any {
  if (!text || text == "") return "";
  if (typeof text === "string") {
    text = JSON.parse(text);
  }
  try {
    const iv = Buffer.from(text.iv, "hex");
    const encryptedText = Buffer.from(text.encryptedData, "hex");
    // Creating Decipher
    const decipher = createDecipheriv(
      "aes-256-cbc",
      Buffer.from(KEY_BAMS, "hex"),
      iv,
    );
    // Updating encrypted text
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    // returns data after decryption
    return decrypted.toString();
  } catch (_) {
    return "";
  }
}

export const getCodeChallenge = async (
  verifier: any | unknown,
): Promise<any> => {
  return base64URLEncode(sha256(verifier));
};

function dec2hex(dec: any) {
  return ("0" + dec.toString(16)).substr(-2);
}

export const getCodeVerifier = () => {
  const array = new Uint32Array(56 / 2);
  global?.crypto?.getRandomValues(array);
  return Array.from(array, dec2hex).join("");
};

export const getKey = async (): Promise<any> => {
  const sodium = await SodiumPlus.auto();
  const bobKeypair = await sodium.crypto_sign_keypair();
  const publicKeyBytes = await sodium.crypto_sign_publickey(bobKeypair);
  const privateKeyBytes = await sodium.crypto_sign_secretkey(bobKeypair);
  return {
    publicKeyBytes: publicKeyBytes.toString("base64"),
    privateKeyBytes: privateKeyBytes.toString("base64"),
  };
};

export const sodium_crypto_sign = async (
  message: string | any,
  privateKey: string | any,
): Promise<string> => {
  try {
    const sodium = await SodiumPlus.auto();
    if (!message || !privateKey) return "";
    const signature = await sodium.crypto_sign(
      message,
      Ed25519SecretKey.from(privateKey, "base64"),
    );
    const s = signature.slice(0, 64);
    // const sm = Buffer.concat([s, message]);
    // console.log('annnnn sm', sm);
    // const deCodeSM = await sodium.crypto_sign_open(sm, Ed25519PublicKey.from(public_key, 'base64'))
    // console.log('annnnn s', s);
    // console.log('annnnn message', deCodeSM.toString('base64'));
    // console.log('annnnn deCodeSM', deCodeSM.toString('base64'));
    // console.log('annnnn', deCodeSM.toString('base64') == message.toString('base64'));
    return s.toString("base64");
  } catch (e) {
    return "";
  }
};

export const SignOutCustom = async (
  functionCallback: any | unknown,
): Promise<any> => {
  // const store = appState();
  // const accountWeb = store?.account?.dataAccount;

  // const details = {
  //   token: accountWeb?.refresh_token,
  //   token_type_hint: "refresh_token",
  //   client_id: process.env.AUTH0_ID,
  // };
  // const content: any = await rpcExecCogiChainNotEncodeParam({
  //   method: "nemo_id.revocation",
  //   params: [details],
  // });
  // if (!content.error) {
  AsyncStorage.setItem(LOCALE_STORAGE.CODE_LOGIN_GID, "");
  AsyncStorage.setItem(LOCALE_STORAGE.CODE_LOGIN, "");
  AsyncStorage.setItem(LOCALE_STORAGE.ACCOUNT, "");
  AsyncStorage.setItem(LOCALE_STORAGE.STATE_LOGIN_GID, "");
  AsyncStorage.setItem(LOCALE_STORAGE.FLAG_SIGNOUT, "false");
  AsyncStorage.setItem(LOCALE_STORAGE.REMEMBER_ME, "false");
  AsyncStorage.setItem(LOCALE_STORAGE.ON_TOUCHID, "false");
  AsyncStorage.setItem(LOCALE_STORAGE.IS_LOGINED, "false");
  ClassWithStaticMethod.SET_STATIC_DEFAULT_CHAINID(CHAINID_COGI);
  AsyncStorage.getItem(LOCALE_STORAGE.METHOD_LOGIN).then((value) => {
    if (value == TYPE_METHOD_LOGIN.FACEBOOK) {
      signOutWithFacebook();
    } else if (value == TYPE_METHOD_LOGIN.GOOGLE) {
      signOutWithGoogle();
    } else if (value == TYPE_METHOD_LOGIN.APPLE_ID) {
      signOutWithAppleID();
    }
  });
  functionCallback(null);
  //   // window.location.href = process.env.DOMAIN_PUBLIC
  // } else {
  //   Toast.error(content.error_description);
  // }
};

const signOutWithGoogle = async () => {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  } catch (error) {
    console.error(error);
  }
};

const signOutWithFacebook = async () => {
  try {
    LoginManager.logOut();
  } catch (error) {
    console.error(error);
  }
};

const signOutWithAppleID = async () => {};

export const saveCodeLoginGID = async (data: any | unknown): Promise<any> => {
  if (data != null) {
    await AsyncStorage.setItem(
      LOCALE_STORAGE.CODE_LOGIN_GID,
      JSON.stringify(encryptData(data)),
    );
  } else {
    await AsyncStorage.setItem(LOCALE_STORAGE.CODE_LOGIN_GID, "");
  }
};

export const saveAccount = async (data: any | unknown): Promise<any> => {
  if (data != null) {
    await AsyncStorage.setItem(
      LOCALE_STORAGE.ACCOUNT,
      JSON.stringify(encryptData(JSON.stringify(data))),
    );
  } else {
    await AsyncStorage.setItem(LOCALE_STORAGE.ACCOUNT, "");
  }
};

export const checkSessionAccount = async (): Promise<boolean> => {
  let ret = false;
  try {
    const data = decryptData(
      await AsyncStorage.getItem(LOCALE_STORAGE.ACCOUNT),
    );
    if (data && data != "") {
      const jsonData = JSON.parse(data);
      if (parseInt(jsonData.timestamp) > dayjs().valueOf()) {
        ret = true;
      } else {
        // navigation.navigate('signin')
      }
    } else {
      // navigation.navigate('signin')
    }
    return ret;
  } catch (e) {
    return ret;
  }
};

export const getAccountForGetData = (
  nemowallet: any | unknown,
  addrressMetaMask: any | unknown,
): any => {
  if (ClassWithStaticMethod.STATIC_DEFAULT_CHAINID == CHAINID_COGI)
    return nemowallet;
  else return addrressMetaMask;
};
