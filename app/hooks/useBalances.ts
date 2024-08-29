import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as AccountReducers from "../modules/account/reducers";
import useBalanceERC20 from "./useBalance/useBalance_ERC20";
import useBalance_NEMO from "./useBalance/useBalance_NEMO";
import useBalance_Native from "./useBalance/useBalance_Native";
import { getSymbolCoin } from "../common/utilities";

export default function useBalances(lstTokenId: string[] | null) {
  const accountWeb = useSelector(AccountReducers.dataAccount);
  const [isReponse, setIsReponse] = useState<boolean>(true);
  const [WtokenID_ERC20, setWtokenID_ERC20] = useState<string | null>("");
  const [WtokenID_NEMO, setWtokenID_NEMO] = useState<string | null>("");
  const [WtokenID_Native, setWtokenID_Native] = useState<string | null>("");

  const balance_ERC20 = useBalanceERC20(WtokenID_ERC20);
  const balance_NEMO = useBalance_NEMO(WtokenID_NEMO);
  const balance_Native = useBalance_Native(WtokenID_Native);

  const setTokenID = (tokenId: string[] | null) => {
    tokenId?.map((tokenId) => {
      const coin = getSymbolCoin(tokenId);
      if (coin) {
        // COGI
        if (coin.native) {
          setWtokenID_Native(tokenId);
        } else {
          // NEMO, GOSU
          if (coin.offchain) {
            coin.namespace == "nemo_coin" && setWtokenID_NEMO(tokenId);
          }
          // USDT
          else {
            setWtokenID_ERC20(tokenId);
          }
        }
      }
    });
  };

  useEffect(() => {
    setIsReponse(accountWeb && lstTokenId);
    accountWeb && lstTokenId && setTokenID(lstTokenId);
  }, [lstTokenId]);

  return isReponse
    ? {
        balance_ERC20,
        balance_NEMO,
        balance_Native,
      }
    : {
        balance_ERC20: null,
        balance_NEMO: null,
        balance_Native: null,
      };
}
