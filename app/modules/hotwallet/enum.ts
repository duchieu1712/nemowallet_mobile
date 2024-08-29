import { KogiApi } from "../../common/enum";
import { ellipseAddress, toNEMOWallet } from "../../common/utilities";

export function toHuman(value: KogiApi): string {
  switch (value) {
    case KogiApi.TRANSACTION_AWARD:
      return "Award";
    case KogiApi.TRANSACTION_CHARGE:
      return "Charge";
    case KogiApi.TRANSACTION_CLAIMTOKEN:
      return "Claim";
    case KogiApi.TRANSACTION_DEPOSIT:
      return "Deposit";
    case KogiApi.TRANSACTION_WITHDRAW:
      return "Withdraw";
    case KogiApi.TX_SUCCESS:
      return "Completed";
    case KogiApi.TX_PENDING:
      return "Pending";
  }
}

export function toHumanMethod(
  value: KogiApi,
  kind: KogiApi,
  address: string | any,
): string {
  if (kind == KogiApi.TRANSACTION_INTERNAL) {
    switch (value) {
      case KogiApi.TRANSACTION_DEPOSIT:
        return "Deposit from " + ellipseAddress(toNEMOWallet(address));
      case KogiApi.TRANSACTION_WITHDRAW:
        return "Transfer to " + ellipseAddress(toNEMOWallet(address));
    }
  }
  switch (value) {
    case KogiApi.TRANSACTION_AWARD:
      return "Award";
    case KogiApi.TRANSACTION_CHARGE:
      return "Charge";
    case KogiApi.TRANSACTION_CLAIMTOKEN:
      return "Claim";
    case KogiApi.TRANSACTION_DEPOSIT:
      return "Deposit";
    case KogiApi.TRANSACTION_WITHDRAW:
      return "Withdraw";
    case KogiApi.TX_SUCCESS:
      return "Completed";
    case KogiApi.TX_PENDING:
      return "Pending";
  }
}

export function getIDTransaction(value: any | string): any {
  return value
    .replace("internal:deposit:0:", "")
    .replace("internal:withdraw:0:", "")
    .replace("onchain:deposit:0:", "")
    .replace(".1", "")
    .replace(".2", "");
}

export function getBalanceAfterTransaction(
  balances: any | unknown,
  transactions: any | unknown,
  index: any | unknown,
  tx: any | unknown,
): number {
  if (!balances || !tx || index > transactions.length) return 0;
  const balance = balances.find(
    (e) => e.assetData.symbol == tx.assetData.symbol,
  );
  if (balance) {
    let res = parseFloat(balance.balance);
    for (let i = 0; i < index; i++) {
      if (transactions[i].status == KogiApi.TX_SUCCESS) {
        if (transactions[i].method == KogiApi.TRANSACTION_DEPOSIT) {
          res = res - parseFloat(transactions[i].amount);
        } else if (transactions[i].method == KogiApi.TRANSACTION_WITHDRAW) {
          res = res + parseFloat(transactions[i].amount);
        }
      }
    }
    if (isNaN(res)) return 0;
    return res;
  }
  return 0;
}
