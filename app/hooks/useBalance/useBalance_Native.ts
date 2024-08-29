import { useEffect, useState } from "react";
import { rpcExecCogiChain } from "../../components/RpcExec/toast_chain";
import { cf_assetsCoinNative } from "../../config/assets";
import { type IBalanceData } from "../../common/types";
import * as AccountReducers from "../../modules/account/reducers";
import { useSelector } from "react-redux";

export default function useBalance_Native(tokenId: string | null) {
  const [onchainBalancesCogi, setOnchainBalancesCogi] = useState<
    IBalanceData[] | null
  >(null);

  const accountWeb = useSelector(AccountReducers.dataAccount);

  const getBalanceNative = () => {
    rpcExecCogiChain({ method: "eth_getBalance", params: [] })
      .then((res: any) => {
        const ret = [];
        ret.push({
          assetData: cf_assetsCoinNative,
          balance: res,
        });
        setOnchainBalancesCogi(ret);
      })
      .catch((e) => {
        setOnchainBalancesCogi(null);
      });
  };

  useEffect(() => {
    accountWeb && tokenId && getBalanceNative();
  }, [tokenId, accountWeb]);

  return onchainBalancesCogi;
}
