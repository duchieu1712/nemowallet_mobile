import * as WalletActions from "../../modules/wallet/actions";

import { type IApprove, type IError } from "../../common/types";
import { appDispatch, appState } from "../../modules";
import {
  contractCogiChain_call,
  contractCogiChain_sendRawTransaction,
  rpcExecCogiChain,
} from "./toast_chain";
import { toEther, translateMessage } from "../../common/utilities";

import { type Contract, type BigNumberish } from "ethers";
import { ClassWithStaticMethod } from "../../common/static";
import OpenLinkComponent from "../OpenLinkComponent";
import { RESPONSE } from "../../common/enum";
// import {Toast} from "toastify-react-native";
import cf_coins from "../../config/coins";
import * as AccountActions from "../../modules/account/actions";
import { COLORS, MyTextApp } from "../../themes/theme";
import { View } from "react-native";
import { explorerFromTx } from "../../common/utilities_config";

export const ToastPromise = (
  promise: Promise<any>,
  { pending, error, success }: any,
) => {
  try {
    // Toast.info(pending);
    if (promise) {
      promise
        .then((data) => {
          const element = success.render(data);
          // Toast.success(element);
          appDispatch(
            AccountActions.setOnStatusNotification({
              visible: true,
              errorMsg: null,
              txSuccess: element,
            }),
          );
        })
        .catch((err) => {
          const element = error.render(err);
          // Toast.error(element);
          appDispatch(
            AccountActions.setOnStatusNotification({
              visible: true,
              errorMsg: element,
              txSuccess: null,
            }),
          );
        });
    }
  } catch (e: any) {
    throw new Error(e);
  }
};

export const contractCallWithToast = async (
  contract: Contract,
  method: string,
  params: any[],
  approve: IApprove | null | IApprove[] = null,
  options: any = null,
): Promise<any | unknown> => {
  try {
    if (
      ClassWithStaticMethod.STATIC_DEFAULT_CHAINID ==
      ClassWithStaticMethod.NEMO_WALLET_CHAINID
    ) {
      return await contractCallWithToastCogiChain(
        contract,
        method,
        params,
        approve,
        options,
      );
    } else {
      return await contractCallWithToast_NetworkETH(
        contract,
        method,
        params,
        approve,
        options,
      );
    }
  } catch (e: any) {
    throw new Error(e);
  }
};

export const contractCallWithToast_NetworkETH = async (
  contract: Contract,
  method: string,
  params: any[],
  approve: IApprove | null | IApprove[] = null,
  options: any = null,
): Promise<any | unknown> => {
  // eslint-disable-next-line no-async-promise-executor
  const resolve = new Promise(async (accept, reject) => {
    try {
      const store = appState();
      const chainId = store?.wallet?.chainId;
      if (chainId != ClassWithStaticMethod.STATIC_DEFAULT_CHAINID) {
        appDispatch(WalletActions.connectMetamask());
        throw {
          code: -5000,
          message: translateMessage("common.wrong_network"),
        };
      }
      if (approve != null) {
        if (Array.isArray(approve)) {
          for (let i = 0; i < approve.length; i++) {
            const appr = approve[i];
            const c = appr.contract;
            const balanceInEth = parseFloat(
              toEther(await c.balanceOf(appr.owner)),
            );
            const allowance = await c.allowance(appr.owner, appr.spender);
            const amountInEth = parseFloat(toEther(appr.amount));
            const p = amountInEth - parseFloat(toEther(allowance));
            if (p > 0) {
              if (balanceInEth < p) {
                throw {
                  code: -5000,
                  message: translateMessage("common.balance_insufficient"),
                };
              }
              const tx = await c.approve(
                appr.spender,
                "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
              );
              await tx.wait();
            } else {
              if (balanceInEth < amountInEth) {
                throw {
                  code: -5000,
                  message: translateMessage("common.balance_insufficient"),
                };
              }
            }
          }
        } else {
          const c = approve.contract;
          const balanceInEth = parseFloat(
            toEther(await c.balanceOf(approve.owner)),
          );
          const allowance = await c.allowance(approve.owner, approve.spender);
          const amountInEth = parseFloat(toEther(approve.amount));
          const p = amountInEth - parseFloat(toEther(allowance));
          if (p > 0) {
            if (balanceInEth < p) {
              throw {
                code: -5000,
                message: translateMessage("common.balance_insufficient"),
              };
            }
            const tx = await c.approve(
              approve.spender,
              "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
            );
            await tx.wait();
          } else {
            if (balanceInEth < amountInEth) {
              throw {
                code: -5000,
                message: translateMessage("common.balance_insufficient"),
              };
            }
          }
        }
      }
      const tx = await contract[method](...params, options);
      await tx.wait();
      accept(tx);
    } catch (e) {
      reject(e);
    }
  });
  ToastPromise(resolve, {
    pending: translateMessage("common.waiting_confirm"),
    success: {
      render: (data: any) => {
        return (
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              gap: 5,
            }}
          >
            <MyTextApp
              style={{
                textAlign: "center",
                color: COLORS.success,
              }}
            >
              {translateMessage("common.transaction_success")}{" "}
            </MyTextApp>
            <MyTextApp
              style={{
                textAlign: "center",
              }}
            >
              <OpenLinkComponent
                address={explorerFromTx(data)}
                style={{
                  borderWidth: 1,
                  borderColor: "rgba(52, 52, 68,0.5)",
                  color: COLORS.success,
                }}
              >
                {data}
              </OpenLinkComponent>
            </MyTextApp>
          </View>
        );
      },
    },
    error: {
      // 'Transaction rejected.'
      render: (data: any) => {
        // Check message special
        let textRes = data.toString();
        const o = data as IError;
        if (o.message != undefined) {
          if (o.code == -32603 && o?.data?.message != null) {
            textRes = o.data.message;
            // return <MyTextApp>{o.data.message}</MyTextApp>;
          }
          if (o?.code?.toString() == "UNPREDICTABLE_GAS_LIMIT") {
            const splitMess = data
              ?.toString()
              ?.split('(reason="execution reverted:');
            if (splitMess.length >= 2) {
              const splitTemp = splitMess[1]
                ?.toString()
                ?.split('", method="estimateGas');
              if (splitTemp.length >= 2) {
                textRes = splitTemp[0].trim();
                // return <MyTextApp>{splitTemp[0].trim()}</MyTextApp>;
              }
            }
          } else {
            textRes = o.message;
            // return <MyTextApp>{o.message}</MyTextApp>;
          }
        }

        return (
          <MyTextApp
            style={{
              textAlign: "center",
              color: COLORS.orange,
            }}
          >
            {textRes}
          </MyTextApp>
        );
      },
    },
  });
  return await resolve;
};

export const contractCallWithToastCogiChain = async (
  contract: Contract,
  method: string,
  params: any[],
  approve: IApprove | null | IApprove[] = null,
  options: any = null,
): Promise<any | unknown> => {
  // eslint-disable-next-line no-async-promise-executor
  const resolve = new Promise(async (accept, reject) => {
    try {
      // Approve
      if (approve != null) {
        if (Array.isArray(approve)) {
          let pSuccess = 0;
          let indexApprove = 0;
          const callSendRawTransaction = () => {
            if (pSuccess == approve.length) {
              contractCogiChain_sendRawTransaction(
                contract,
                method,
                [...params],
                options,
                (tx: any, response: any) => {
                  if (response == RESPONSE.SUCCESS) {
                    accept(tx);
                  } else if (response == RESPONSE.ERROR) {
                    reject(tx);
                  }
                },
              );
            }
          };

          const approveToken = async (i: number) => {
            if (indexApprove >= approve.length) return;
            const appr = approve[i];
            const c = appr.contract;
            const balanceInEth = await getBalanceCoin(c, appr.owner);
            // allowance
            const paramsAllowance = [appr.owner, appr.spender];
            const allowance: any = await contractCogiChain_call(
              c,
              "allowance",
              [...paramsAllowance],
            );
            // const allowance = await c['allowance'](appr.owner, appr.spender)
            const amountInEth = parseFloat(toEther(appr.amount));
            const p = amountInEth - parseFloat(toEther(allowance));
            if (p > 0) {
              if (balanceInEth < p) {
                reject({
                  code: -5000,
                  message: translateMessage("common.balance_insufficient"),
                });
                return;
              }
              contractCogiChain_sendRawTransaction(
                c,
                "approve",
                [
                  appr.spender,
                  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                ],
                null,
                (tx: any, response: any) => {
                  if (response == RESPONSE.ERROR) {
                    reject(tx);
                  } else {
                    pSuccess = pSuccess + 1;
                    indexApprove++;
                    approveToken(indexApprove);
                    callSendRawTransaction();
                  }
                },
              );
            } else {
              if (balanceInEth < amountInEth) {
                throw {
                  code: -5000,
                  message: translateMessage("common.balance_insufficient"),
                };
              } else {
                pSuccess = pSuccess + 1;
                indexApprove++;
                approveToken(indexApprove);
                callSendRawTransaction();
              }
            }
          };
          approveToken(indexApprove);
        } else {
          const c = approve.contract;
          const balanceInEth = await getBalanceCoin(c, approve.owner);
          // const balanceInEth = parseFloat(
          //   toEther(
          //     (await contractCogi_call(c, 'balanceOf', [
          //       approve.owner,
          //     ])) as BigNumberish
          //   )
          // )

          // allowance
          const paramsAllowance = [approve.owner, approve.spender];
          const allowance: any = await contractCogiChain_call(c, "allowance", [
            ...paramsAllowance,
          ]);
          const amountInEth = parseFloat(toEther(approve.amount));
          const p = amountInEth - parseFloat(toEther(allowance));
          if (p > 0) {
            // if (true) {
            if (balanceInEth < p) {
              throw {
                code: -5000,
                message: translateMessage("common.balance_insufficient"),
              };
            }
            await contractCogiChain_sendRawTransaction(
              c,
              "approve",
              [
                approve.spender,
                "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                // '0',
              ],
              null,
              (tx: any, response: any) => {
                if (response == RESPONSE.ERROR) {
                  reject(tx);
                } else {
                  contractCogiChain_sendRawTransaction(
                    contract,
                    method,
                    [...params],
                    options,
                    (tx: any, response: any) => {
                      if (response == RESPONSE.SUCCESS) {
                        accept(tx);
                      } else if (response == RESPONSE.ERROR) {
                        reject(tx);
                      }
                    },
                  );
                }
              },
            );
          } else {
            if (balanceInEth < amountInEth) {
              throw {
                code: -5000,
                message: translateMessage("common.balance_insufficient"),
              };
            }
          }
        }
      }
      // Call
      contractCogiChain_sendRawTransaction(
        contract,
        method,
        [...params],
        options,
        (tx: any, response: any) => {
          if (response == RESPONSE.SUCCESS) {
            accept(tx);
          } else if (response == RESPONSE.ERROR) {
            reject(tx);
          }
        },
      );
    } catch (e) {
      reject(e);
    }
  });
  ToastPromise(resolve, {
    pending: translateMessage("common.waiting_confirm"),
    success: {
      render: (data: any) => {
        return (
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              gap: 5,
            }}
          >
            <MyTextApp
              style={{
                textAlign: "center",
                color: COLORS.success,
              }}
            >
              {translateMessage("common.transaction_success")}{" "}
            </MyTextApp>
            <MyTextApp
              style={{
                textAlign: "center",
              }}
            >
              <OpenLinkComponent
                address={explorerFromTx(data)}
                style={{
                  borderWidth: 1,
                  borderColor: "rgba(52, 52, 68,0.5)",
                  color: COLORS.success,
                }}
              >
                {data}
              </OpenLinkComponent>
            </MyTextApp>
          </View>
        );
      },
    },
    error: {
      // 'Transaction rejected.'
      render: (data: any) => {
        // Check message special
        let textRes = data.toString();
        const o = data as IError;
        if (o.message != undefined) {
          if (o.code == -32603 && o?.data?.message != null) {
            textRes = o.data.message;
            // return <MyTextApp>{o.data.message}</MyTextApp>;
          }
          if (o?.code?.toString() == "UNPREDICTABLE_GAS_LIMIT") {
            const splitMess = data
              ?.toString()
              ?.split('(reason="execution reverted:');
            if (splitMess.length >= 2) {
              const splitTemp = splitMess[1]
                ?.toString()
                ?.split('", method="estimateGas');
              if (splitTemp.length >= 2) {
                textRes = splitTemp[0].trim();
                // return <MyTextApp>{splitTemp[0].trim()}</MyTextApp>;
              }
            }
          } else {
            textRes = o.message;
            // return <MyTextApp>{o.message}</MyTextApp>;
          }
        }

        return (
          <MyTextApp
            style={{
              textAlign: "center",
              color: COLORS.orange,
            }}
          >
            {textRes}
          </MyTextApp>
        );
      },
    },
  });
  return await resolve;
};

const getBalanceCoin = async (tokenContract: any, owner: any) => {
  const coin = cf_coins.find(
    (e) => e.contract.toLowerCase() == tokenContract.address.toLowerCase(),
  );
  if (coin && coin.offchain) {
    const balance: any = await rpcExecCogiChain({
      method: `${coin.hot_wallet}.get_balance`,
      params: [],
    });
    return balance?.balance ?? 0;
  } else {
    return parseFloat(
      toEther(
        (await contractCogiChain_call(tokenContract, "balanceOf", [
          owner,
        ])) as BigNumberish,
      ),
    );
  }
};
