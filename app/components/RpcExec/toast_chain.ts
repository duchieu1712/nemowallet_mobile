import axios from "axios";
import { type Contract } from "ethers";
import {
  checkCreatePIN,
  checkFundPasswordLocked,
  getRememberFundPassword,
  getPinCode,
  saveRememberFundPassword,
  translateMessage,
  sha256,
} from "../../common/utilities";
import { sodium_crypto_sign } from "../../modules/account/utilities";
import {
  ENDPOINT_RPC,
  ERROR_MESSSAGE_NOT_TIME_SIGNATURE,
} from "../../common/constants";
import { appDispatch, appState } from "../../modules";
import { getChainId } from "../../modules/wallet/utilities";
import nano from "nano-seconds";
import * as ProfileActions from "../../modules/profile/actions";
import * as AccountActions from "../../modules/account/actions";
import {
  ENUM_ENDPOINT_RPC,
  RESPONSE,
  RESPONSE_CODE_RPC,
} from "../../common/enum";
import { ClassWithStaticMethod } from "../../common/static";
import { cf_MESSAGE_JSONRPC } from "../../config/message";
import { isEmpty } from "lodash";
import dayjs from "dayjs";
import {
  endpointAPIFetchFromChainId,
  endpointContractFromChainId,
  endpointContractFromChainIdRpc,
} from "../../common/utilities_config";
const METHOD_NOT_FEE_GAS = ["nemo_hotwallet.approve"];

export const contractCallEth_call = async (
  contract: Contract,
  method: string,
  params: any[],
): Promise<any> => {
  try {
    if (
      ClassWithStaticMethod.STATIC_DEFAULT_CHAINID ==
      ClassWithStaticMethod.NEMO_WALLET_CHAINID
    ) {
      return await contractCogiChain_call_Get_Not_Login(
        contract,
        method,
        params,
      );
    } else {
      return await contractCallNetwork_Eth(contract, method, params);
    }
  } catch (e: any) {
    throw new Error(e?.message ?? e);
  }
};

export const contractCallNetwork_Eth = async (
  contract: Contract,
  method: string,
  params: any[],
): Promise<any> => {
  try {
    return await new Promise((accept, reject) =>
      contract[method](...params)
        .then(async (res: any) => {
          if (typeof res.wait === "function") {
            accept(await res.wait()); // is tx
          }
          accept(res);
        })
        .catch((e: any) => {
          reject(e);
        }),
    );
  } catch (e: any) {
    return new Error(e.message);
  }
};

export const contractCogiChain_call_Get_Not_Login = async (
  contract: Contract,
  method: string,
  params: any[],
  endpoint = ENUM_ENDPOINT_RPC._NEMO_WALLET,
): Promise<any> => {
  const resolve = new Promise((accept, reject) => {
    try {
      const data = contract?.interface?.encodeFunctionData(method, [...params]);
      const tx = {
        to: contract.address,
        data,
      };
      const rpcEndpoint = endpointContractFromChainIdRpc(
        endpoint,
        getChainId(),
      )?.endpoint;
      axios
        .post(
          rpcEndpoint,
          {
            jsonrpc: "2.0",
            id: 1,
            method: "eth_call",
            params: [tx],
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        )
        .then((response: any) => {
          const res = response?.data;
          if (!res.error) {
            accept(res?.result);
          } else {
            reject(res.error);
          }
        })
        .catch((e) => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
  return await resolve;
};

export const contractCogiChain_call = async (
  contract: Contract,
  method: string,
  params: any[],
): Promise<any> => {
  const resolve = new Promise(async (accept, reject) => {
    try {
      const data = contract?.interface?.encodeFunctionData(method, [...params]);
      const tx = {
        to: contract.address,
        data,
      };
      await rpcExecCogiChain({ method: "eth_call", params: [tx] })
        .then((res: any) => {
          if (!res.error) {
            accept(res);
          } else {
            reject(res.error);
          }
        })
        .catch((e) => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
  return await resolve;
};

export const contractEth_batch = async (
  lstInfoContract: any[],
): Promise<any> => {
  const resolve = new Promise(async (accept, reject) => {
    try {
      const lstInfoJsonRpc = [];
      for (let i = 0; i < lstInfoContract.length; i++) {
        const method = lstInfoContract[i].method;
        const params = lstInfoContract[i].params;
        const contract = lstInfoContract[i].contract;
        const data = contract?.interface?.encodeFunctionData(method, [
          ...params,
        ]);
        const tx = {
          to: contract.address,
          data,
        };
        lstInfoJsonRpc.push({
          method: "eth_call",
          params: [tx],
        });
      }
      await rpcExecCogiChain_batch(lstInfoJsonRpc)
        .then((res: any) => {
          if (!res.error) {
            accept(res);
          } else {
            reject(res.error);
          }
        })
        .catch((e) => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
  return await resolve;
};

export const contractCogiChain_sendRawTransaction = async (
  contract: Contract,
  method: string,
  params: any[],
  options: any = null,
  callback: any = null,
): Promise<any> => {
  const resolve = new Promise(async () => {
    try {
      const data = contract?.interface?.encodeFunctionData(method, [...params]);
      let tx = {
        to: contract.address,
        data,
      };
      if (options != null)
        tx = {
          to: contract.address,
          data,
          ...options,
        };
      const _2fa = checkConfirm2FA(contract, method);
      const _pin = true;
      return await rpcExecCogiChain({
        method: "eth_sendRawTransaction",
        params: [tx],
        options,
        _2fa,
        _pin,
        callback: (res: any, flagResponse: any) => {
          if (callback) callback(res, flagResponse);
        },
        methodTx: method,
      });
    } catch (e: any) {
      if (e?.message?.includes(ERROR_MESSSAGE_NOT_TIME_SIGNATURE)) {
        appDispatch(AccountActions.setRequestSignOut(true));
      }
      if (callback) callback(e, RESPONSE.ERROR);
    }
  });
  return await resolve;
};

export const rpcExecCogiChain = async <T>({
  method,
  params = [],
  options = null,
  _2fa = false,
  _pin = false,
  callback = null,
  account = null,
  methodTx = null,
  endpoint = ENUM_ENDPOINT_RPC._NEMO_WALLET,
}: {
  method?: string;
  params?: any;
  options?: any;
  _2fa?: any;
  _pin?: any;
  callback?: any;
  account?: any;
  methodTx?: any;
  endpoint?: ENUM_ENDPOINT_RPC;
}): Promise<any> => {
  try {
    if (!_pin) {
      _pin = checkConfirm_pin(method);
    }
    const store = appState();
    let accountWeb;
    if (account) {
      accountWeb = account;
    } else {
      accountWeb = store?.account?.dataAccount;
    }
    const ACCESS_ID = `${ENDPOINT_RPC}${method}`;
    const ACCESS_TIME = nano.toString(nano.now());
    let message_hash;
    if (params.length == 0) {
      message_hash = sha256(ACCESS_ID + ":" + ACCESS_TIME + ":[]");
    } else {
      message_hash = sha256(
        ACCESS_ID + ":" + ACCESS_TIME + ":" + JSON.stringify(params),
      );
    }
    const ACCESS_SIGNATURE = await sodium_crypto_sign(
      message_hash,
      accountWeb?.privateKeyBytes,
    );
    let paramsJsonrpc = [
      accountWeb?.signature,
      ACCESS_SIGNATURE,
      ACCESS_TIME.toString(),
      params,
    ];
    const rpcEndpoint = endpointContractFromChainIdRpc(
      endpoint,
      getChainId(),
    )?.endpoint;

    if (_pin && checkFundPasswordLocked()) {
      if (callback) {
        callback(translateMessage("common.pin_locked"), RESPONSE.ERROR);
      }
      return;
    }
    if (_pin && checkCreatePIN()) {
      if (callback) {
        callback(translateMessage("common.pin_not_created"), RESPONSE.ERROR);
      }
      appDispatch(ProfileActions.setOnActionCreatePIN(true));
      return;
    }
    if (_2fa || _pin || (_pin && !METHOD_NOT_FEE_GAS.includes(method))) {
      const request = {
        methodTx,
        action_2fa: _2fa,
        action_pin: _pin,
        fee_gas: _pin && !METHOD_NOT_FEE_GAS.includes(method),
        callbackConfirm2FA: async (CODE: any, flagResponse: any) => {
          appDispatch(ProfileActions.setConfirm2FA(null));
          // appDispatch(ProfileActions.getAuthenticators_Enabled())
          let pOption = { ...options };
          if (CODE?.otp) {
            pOption = { ...pOption, otp_code: CODE.otp };
          }
          if (CODE?.pin) {
            const hash = getPinCode(CODE.pin);
            pOption = { ...pOption, pin_code: hash };
          }
          if (CODE?.save_fund_password) {
            pOption = {
              ...pOption,
              // save_fund_password: CODE.save_fund_password,
            };
          }
          if (flagResponse == RESPONSE.ERROR) {
            if (callback) {
              callback(
                translateMessage("common.cancel_action"),
                RESPONSE.ERROR,
              );
            }
            return;
          }
          // Save FUND Password
          if (CODE.save_fund_password) {
            saveRememberFundPassword({
              deadTime: dayjs().valueOf() / 1000 + 3600 * 24,
              fund_password: CODE.pin,
            });
          }
          // Save for Approve
          if (methodTx == "approve") {
            ClassWithStaticMethod.SET_PIN_APPROVE({
              timestamp: Math.round(dayjs().valueOf() / 1000 + 10),
              pin: CODE?.pin,
            });
          }
          //
          paramsJsonrpc = [...paramsJsonrpc, pOption];
          const response = await axios.post<T>(
            rpcEndpoint,
            {
              jsonrpc: "2.0",
              id: 1,
              method,
              params: paramsJsonrpc,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
          //
          let error;
          const ress: any = response.data;
          if (ress?.result?.error != null) {
            if (callback) {
              callback(ress?.result?.error, RESPONSE.ERROR);
            }
            error = ress?.result?.error;
          }
          if (ress?.error != null) {
            if (callback) {
              callback(ress?.error, RESPONSE.ERROR);
            }
            error = ress?.error;
          }
          // error
          if (!isEmpty(error?.message)) {
            if (error?.message?.code == RESPONSE_CODE_RPC._UNAUTHORIZED) {
              appDispatch(AccountActions.setRequestSignOut(true));
            }
            if (
              error?.message.trim().toLowerCase().includes("invalid pin code")
            ) {
              saveRememberFundPassword(null);
            }
            return new Error(error);
          }
          // Success
          if (callback) {
            callback(ress.result, RESPONSE.SUCCESS);
          }
          return ress.result;
        },
      };
      appDispatch(ProfileActions.setConfirm2FA(request));
    } else {
      if (options) {
        paramsJsonrpc.push(options);
      }
      const rpcEndpoint: any = endpointContractFromChainIdRpc(
        endpoint,
        getChainId(),
      )?.endpoint;

      const response = await axios.post<T>(
        rpcEndpoint,
        {
          jsonrpc: "2.0",
          id: 1,
          method,
          params: paramsJsonrpc,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const ress: any = response.data;
      if (ress?.result?.error != null) {
        if (callback) {
          callback(ress?.result?.error, RESPONSE.ERROR);
        }
        if (ress?.result?.error?.code == RESPONSE_CODE_RPC._UNAUTHORIZED) {
          appDispatch(AccountActions.setRequestSignOut(true));
        }
        throw new Error(ress?.result?.error?.message);
      }
      if (ress?.error != null) {
        if (callback) {
          callback(ress?.error, RESPONSE.ERROR);
        }
        if (ress?.error?.code == RESPONSE_CODE_RPC._UNAUTHORIZED) {
          appDispatch(AccountActions.setRequestSignOut(true));
        }
        throw new Error(ress?.error?.message);
      }
      if (callback) {
        callback(ress.result, RESPONSE.SUCCESS);
      }
      return ress.result;
    }
  } catch (error: any) {
    if (callback) {
      callback(error.message, RESPONSE.ERROR);
    } else {
      throw new Error(error.message);
    }
  }
};

export const rpcExecCogiChain_batch = async <T>(
  lstJsonrpc: string | any[],
): Promise<T> => {
  try {
    const store = appState();
    const accountWeb = store?.account?.dataAccount;
    const batch = [];
    for (let i = 0; i < lstJsonrpc.length; i++) {
      const method = lstJsonrpc[i].method;
      const params = lstJsonrpc[i].params;
      const options = lstJsonrpc[i].options;
      const ACCESS_ID = `${ENDPOINT_RPC}${method}`;
      const ACCESS_TIME = nano.toString(nano.now());
      let message_hash;
      if (params.length == 0) {
        message_hash = sha256(ACCESS_ID + ":" + ACCESS_TIME + ":[]");
      } else {
        message_hash = sha256(
          ACCESS_ID + ":" + ACCESS_TIME + ":" + JSON.stringify(params),
        );
      }
      const ACCESS_SIGNATURE = await sodium_crypto_sign(
        message_hash,
        accountWeb?.privateKeyBytes,
      );
      const paramsJsonrpc = [
        accountWeb?.signature,
        ACCESS_SIGNATURE,
        ACCESS_TIME.toString(),
        params,
        options,
      ];
      batch.push({
        jsonrpc: "2.0",
        id: i + 1,
        method,
        params: paramsJsonrpc,
      });
    }
    if (batch && batch.length != 0) {
      const rpcEndpoint = endpointContractFromChainId(getChainId())?.endpoint;
      const response: any = await axios.post<T>(rpcEndpoint, batch, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const ress: any = response?.data?.map((e) => {
        if (e.result.error != null) {
          return new Error(e);
        } else if (e?.error != null) {
          return new Error(e);
        } else {
          return e.result;
        }
      });
      return ress;
    }
  } catch (error: any) {
    throw new Error(error);
  }
};

/// //

/// SIGNER
export const rpcExecCogiChain_Signer_batch = async <T>(
  lstJsonrpc: string | any[],
  endpoint = ENUM_ENDPOINT_RPC._NEMO_WALLET,
): Promise<T> => {
  try {
    const batch = [];
    for (let i = 0; i < lstJsonrpc.length; i++) {
      const method = lstJsonrpc[i].method;
      const params = lstJsonrpc[i].params;
      batch.push({
        id: i,
        message: cf_MESSAGE_JSONRPC,
        method,
        payload: params,
      });
    }
    if (batch && batch.length != 0) {
      const response: any = await rpcExecCogiChain({
        method: "eth_personal_sign",
        params: batch,
        endpoint: ENUM_ENDPOINT_RPC._NEMO_WALLET,
      });
      if (response?.length == 0) throw new Error("");
      const resBatch = [];
      const rpcEndpoint = endpointContractFromChainIdRpc(
        endpoint,
        getChainId(),
      )?.endpoint;
      for (let i = 0; i < response?.length; i++) {
        const res = response[i];
        const paramsJsonrpc = [
          res?.signature,
          res?.message,
          res?.deadline,
          res?.signer,
          lstJsonrpc[i].params,
        ];
        if (lstJsonrpc[i].options) {
          paramsJsonrpc.push(lstJsonrpc[i].options);
        }
        resBatch.push(
          axios.post<T>(
            rpcEndpoint,
            {
              jsonrpc: "2.0",
              id: i,
              method: lstJsonrpc[i].method,
              params: paramsJsonrpc,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          ),
        );
      }
      const ress: any = await Promise.all(resBatch)
        .then((data: any) => {
          return data?.map((e: any) => e?.data?.result);
        })
        .catch((_) => {
          return null;
        });
      return ress;
    }
  } catch (error: any) {
    throw new Error(error);
  }
};

export const rpcExecCogiChain_Signer = async <T>({
  method,
  params = [],
  options = null,
  _2fa = false,
  _pin = false,
  callback = null,
  account = null,
  methodTx = null,
  endpoint = ENUM_ENDPOINT_RPC._NEMO_WALLET,
}: {
  method?: string;
  params?: any;
  options?: any;
  _2fa?: any;
  _pin?: any;
  callback?: any;
  account?: any;
  methodTx?: any;
  endpoint?: ENUM_ENDPOINT_RPC;
}): Promise<T> => {
  try {
    return await rpcExecCogiChain({
      method: "eth_personal_sign",
      params: [
        {
          id: 0,
          message: cf_MESSAGE_JSONRPC,
          method,
          payload: params,
        },
      ],
      options,
      _2fa,
      _pin,
      callback,
      account,
      methodTx,
      endpoint: ENUM_ENDPOINT_RPC._NEMO_WALLET,
    })
      .then(async (response: any) => {
        if (response?.length == 0) throw new Error("");
        const res = response[0];
        try {
          if (!_pin) {
            _pin = checkConfirm_pin(method);
          }
          let paramsJsonrpc = [
            res?.signature,
            res?.message,
            res?.deadline,
            res?.signer,
            params,
          ];
          const rpcEndpoint = endpointContractFromChainIdRpc(
            endpoint,
            getChainId(),
          )?.endpoint;
          if (_pin && checkFundPasswordLocked()) {
            if (callback) {
              callback(translateMessage("common.pin_locked"), RESPONSE.ERROR);
            }
            return;
          }
          if (_pin && checkCreatePIN()) {
            if (callback) {
              callback(
                translateMessage("common.pin_not_created"),
                RESPONSE.ERROR,
              );
            }
            appDispatch(ProfileActions.setOnActionCreatePIN(true));
            return;
          }
          if (
            _2fa ||
            (_pin && !getRememberFundPassword()) ||
            (_pin && !METHOD_NOT_FEE_GAS.includes(method))
          ) {
            const request = {
              methodTx,
              action_2fa: _2fa,
              action_pin: _pin && !getRememberFundPassword(),
              fee_gas: _pin && !METHOD_NOT_FEE_GAS.includes(method),
              callbackConfirm2FA: async (CODE: any, flagResponse: any) => {
                appDispatch(ProfileActions.setConfirm2FA(null));
                // appDispatch(ProfileActions.getAuthenticators_Enabled())
                let pOption = { ...options };
                if (CODE?.otp) {
                  pOption = { ...pOption, otp_code: CODE.otp };
                }
                if (CODE?.pin) {
                  const hash = getPinCode(CODE.pin);
                  pOption = { ...pOption, pin_code: hash };
                }
                if (CODE?.save_fund_password) {
                  pOption = {
                    ...pOption,
                    // save_fund_password: CODE.save_fund_password,
                  };
                }
                if (flagResponse == RESPONSE.ERROR) {
                  if (callback) {
                    callback(
                      translateMessage("common.cancel_action"),
                      RESPONSE.ERROR,
                    );
                  }
                  return;
                }
                // Save FUND Password
                if (CODE.save_fund_password) {
                  saveRememberFundPassword({
                    deadTime: dayjs().valueOf() / 1000 + 3600 * 24,
                    fund_password: CODE.pin,
                  });
                }
                // Save for Approve
                if (methodTx == "approve") {
                  ClassWithStaticMethod.SET_PIN_APPROVE({
                    timestamp: Math.round(dayjs().valueOf() / 1000 + 10),
                    pin: CODE?.pin,
                  });
                }
                //
                paramsJsonrpc = [...paramsJsonrpc, pOption];
                const response = await axios.post<T>(
                  rpcEndpoint,
                  {
                    jsonrpc: "2.0",
                    id: 1,
                    method,
                    params: paramsJsonrpc,
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  },
                );
                //
                let error;
                const ress: any = response.data;
                if (ress?.result?.error != null) {
                  if (callback) {
                    callback(ress?.result?.error, RESPONSE.ERROR);
                  }
                  error = ress?.result?.error;
                }
                if (ress?.error != null) {
                  if (callback) {
                    callback(ress?.error, RESPONSE.ERROR);
                  }
                  error = ress?.error;
                }
                // error
                if (!isEmpty(error?.message)) {
                  if (error?.message?.code == RESPONSE_CODE_RPC._UNAUTHORIZED) {
                    appDispatch(AccountActions.setRequestSignOut(true));
                  }
                  if (
                    error?.message
                      .trim()
                      .toLowerCase()
                      .includes("invalid pin code")
                  ) {
                    saveRememberFundPassword(null);
                  }
                  return new Error(error);
                }
                // Success
                if (callback) {
                  callback(ress.result, RESPONSE.SUCCESS);
                }
                return ress.result;
              },
            };
            appDispatch(ProfileActions.setConfirm2FA(request));
          } else {
            if (options) {
              paramsJsonrpc.push(options);
            }
            const response = await axios.post<T>(
              rpcEndpoint,
              {
                jsonrpc: "2.0",
                id: 1,
                method,
                params: paramsJsonrpc,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              },
            );
            const ress: any = response.data;
            if (ress?.result?.error != null) {
              if (callback) {
                callback(ress?.result?.error, RESPONSE.ERROR);
              }
              if (
                ress?.result?.error?.code == RESPONSE_CODE_RPC._UNAUTHORIZED
              ) {
                appDispatch(AccountActions.setRequestSignOut(true));
              }
              throw new Error(ress?.result?.error?.message);
            }
            if (ress?.error != null) {
              if (callback) {
                callback(ress?.error, RESPONSE.ERROR);
              }
              if (ress?.error?.code == RESPONSE_CODE_RPC._UNAUTHORIZED) {
                appDispatch(AccountActions.setRequestSignOut(true));
              }
              throw new Error(ress?.error?.message);
            }
            if (callback) {
              callback(ress.result, RESPONSE.SUCCESS);
            }
            return ress.result;
          }
        } catch (error: any) {
          if (callback) {
            callback(error.message, RESPONSE.ERROR);
          } else {
            throw new Error(error);
          }
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (error: any) {
    if (callback) {
      callback(error.message, RESPONSE.ERROR);
    } else {
      throw new Error(error);
    }
  }
};

export const rpcExecCogiChainNotEncodeParam = async <T>({
  method,
  params = [],
  _2fa = false,
  callback = null,
  endpoint = ENUM_ENDPOINT_RPC._NEMO_WALLET,
}: {
  method: string;
  params: any;
  _2fa?: boolean;
  callback?: any;
  endpoint?: ENUM_ENDPOINT_RPC;
}): Promise<T> => {
  try {
    if (_2fa) {
      const request = {
        action_2fa: true,
        callbackConfirm2FA: async (CODE: any) => {
          const rpcEndpoint = endpointContractFromChainIdRpc(
            endpoint,
            getChainId(),
          )?.endpoint;
          const response: any = await axios.post<T>(
            rpcEndpoint,
            {
              jsonrpc: "2.0",
              id: 1,
              method,
              params: [{ ...params[0], otp_code: CODE?.otp }],
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
          const ress: any = response?.data;
          if (ress?.result?.error != null) {
            if (callback) {
              callback(ress?.result?.error, RESPONSE.ERROR);
            }
            throw new Error(ress?.result?.error?.message);
          }
          if (ress?.error != null) {
            if (callback) {
              callback(ress?.error, RESPONSE.ERROR);
            }
            throw new Error(ress?.error?.message);
          }
          if (callback) {
            callback(ress.result, RESPONSE.SUCCESS);
            appDispatch(ProfileActions.setConfirm2FA(null));
          }
          return ress.result;
        },
      };
      appDispatch(ProfileActions.setConfirm2FA(request));
    } else {
      const rpcEndpoint = endpointContractFromChainIdRpc(
        endpoint,
        getChainId(),
      )?.endpoint;
      const response: any = await axios.post<T>(
        rpcEndpoint,
        {
          jsonrpc: "2.0",
          id: 1,
          method,
          params,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const ress: any = response?.data;
      if (ress?.result?.error != null) {
        if (callback) {
          callback(ress?.result?.error, RESPONSE.ERROR);
        }
        throw new Error(ress?.result?.error?.message);
      }
      if (ress?.error != null) {
        if (callback) {
          callback(ress?.error, RESPONSE.ERROR);
        }
        throw new Error(ress?.error?.message);
      }
      if (callback) {
        callback(ress.result, RESPONSE.SUCCESS);
      }
      return ress.result;
    }
  } catch (error: any) {
    if (callback) {
      callback(error.message, RESPONSE.ERROR);
    }
    throw new Error(error);
  }
};

export const rpcExecAPI_batch = async <T>(
  lstJsonrpc: string | any[],
): Promise<T> => {
  try {
    const batch = [];
    for (let i = 0; i < lstJsonrpc.length; i++) {
      const method = lstJsonrpc[i].method;
      const params = lstJsonrpc[i].params;
      batch.push({
        jsonrpc: "2.0",
        id: i + 1,
        method,
        params,
      });
    }
    if (batch && batch.length != 0) {
      const rpcEndpoint = endpointContractFromChainId(
        ClassWithStaticMethod.STATIC_DEFAULT_CHAINID,
      )?.endpoint;
      const response: any = await axios.post<T>(rpcEndpoint, batch, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const ress: any = response?.data?.map((e: any) => {
        if (e?.result?.error != null) {
          return new Error(e?.result?.error);
        }
        if (e?.error != null) {
          return new Error(e?.error);
        }
        return e.result;
      });
      return ress;
    }
  } catch (error: any) {
    throw new Error(error);
  }
};

export const rpcFetchAPI = async <T>(
  url: string,
  options = null,
): Promise<T> => {
  try {
    const rpcEndpoint = endpointAPIFetchFromChainId(getChainId())?.endpoint;
    let pUrl = url;
    if (options) {
      pUrl += "?";
      for (const [key, value] of Object.entries(options)) {
        pUrl += "&" + key + "=" + JSON.stringify(value);
      }
    }
    const response: any = await axios.get<T>(rpcEndpoint + pUrl, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const ress: any = response?.data;
    if (ress.error != null) {
      throw new Error(ress?.error);
    }
    return ress;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const decodeFunctionResult = (
  contract: any | unknown,
  method: any | unknown,
  data: any | unknown,
): any => {
  if (!contract) return "";
  return contract?.interface?.decodeFunctionResult(method, data);
};

export const checkConfirm2FA = (
  contract: any | unknown,
  method: any | unknown,
): any => {
  const store = appState();
  const accountWeb = store.account.dataAccount;
  if (!accountWeb?.google_two_factor_authentication) return false;
  const dataExtractSecuredMethods = store.profile.dataExtractSecuredMethods;
  if (!dataExtractSecuredMethods) return true;
  return dataExtractSecuredMethods.google_2fa.eth[0].sendRawTransaction.some(
    (a: any) =>
      a.address.toLowerCase() == contract.address.toLowerCase() &&
      a?.methods?.includes(method),
  );
};

export const checkConfirm_pin = (method: any | unknown): any => {
  let res = false;
  try {
    const store = appState();
    const dataExtractSecuredMethods = store.profile.dataExtractSecuredMethods;
    if (!dataExtractSecuredMethods) return false;
    const splitMethod = method?.split(".");
    if (splitMethod.length >= 2) {
      res =
        dataExtractSecuredMethods?.fund_password[splitMethod[0]]?.includes(
          splitMethod[1],
        ) ?? false;
    }
  } catch (e: any) {
    throw new Error(e?.message ?? e);
  }
  return res;
};
