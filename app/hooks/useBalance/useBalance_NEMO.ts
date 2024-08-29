import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type IBalanceData } from "../../common/types";
import { cf_hotwallets as hotwalletsConfig } from "../../config/kogi-api";
import * as HotwalletReducers from "../../modules/hotwallet/reducers";
import * as HotwalletActions from "../../modules/hotwallet/actions";
import { type GetBalancesRequest } from "../../modules/hotwallet/types";
import * as AccountReducers from "../../modules/account/reducers";
import { isEmpty } from "lodash";
import { balancesFromHotwalletSaga } from "../../common/utilities_config";

export default function useBalance_NEMO(tokenId: string | null | string[]) {
  const dispatch = useDispatch();
  const [balances, setBalances] = useState<IBalanceData[]>([]);
  const getBalancesResponse = useSelector(
    HotwalletReducers.getBalancesResponse,
  );

  const accountWeb = useSelector(AccountReducers.dataAccount);

  const dispatchGetBalances = () => {
    const res: GetBalancesRequest = {
      namespaces: [],
    };
    for (let i = 0; i < hotwalletsConfig.length; i++) {
      if (!isEmpty(hotwalletsConfig[i].namespace))
        res.namespaces.push(hotwalletsConfig[i].namespace ?? "");
    }
    dispatch(HotwalletActions.getBalances(res));
  };

  useEffect(() => {
    getBalancesResponse &&
      setBalances(balancesFromHotwalletSaga(getBalancesResponse));
  }, [getBalancesResponse]);

  useEffect(() => {
    accountWeb && tokenId && dispatchGetBalances();
  }, [tokenId, accountWeb]);

  return balances;
}
