import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as WalletReducers from "../../modules/wallet/reducers";
import * as WalletActions from "../../modules/wallet/actions";
import * as AccountReducers from "../../modules/account/reducers";
import { descyptNEMOWallet, getSymbolCoin } from "../../common/utilities";
import { type IBalanceData } from "../../common/types";
import { balancesFromWalletSaga } from "../../common/utilities_config";

export default function useBalanceERC20(tokenId: string | null | string[]) {
  const dispatch = useDispatch();
  const [onchainBalances, setOnchainBalances] = useState<IBalanceData[]>([]);
  const accountWeb = useSelector(AccountReducers.dataAccount);

  const contractCallResponse = useSelector(WalletReducers.contractCallResponse);
  const dispatchContractCallOnchainBalances = () => {
    const coin = getSymbolCoin(tokenId);
    if (coin) {
      dispatch(
        WalletActions.contractCall({
          namespace: coin.namespace,
          method: "balanceOf",
          params: [descyptNEMOWallet(accountWeb?.nemo_address)],
        }),
      );
    }
  };

  useEffect(() => {
    // onchain Balances
    let ret: IBalanceData[] = [];
    if (contractCallResponse != null) {
      ret = balancesFromWalletSaga(contractCallResponse);
    }
    setOnchainBalances(ret);
  }, [contractCallResponse]);

  useEffect(() => {
    accountWeb && tokenId && dispatchContractCallOnchainBalances();
  }, [tokenId, accountWeb]);

  return onchainBalances;
}
