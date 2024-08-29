import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as AccountReducers from "../../modules/account/reducers";
import { getSymbolCoin, sleep } from "../../common/utilities";
import useBalance_Native from "./useBalance_Native";
import useBalance_NEMO from "./useBalance_NEMO";
import useBalanceERC20 from "./useBalance_ERC20";

export default function useBalance(tokenId: string | null) {
  const accountWeb = useSelector(AccountReducers.dataAccount);
  const [balance, setBalance] = useState<any | null>(null);

  // console.log('annnnnnn')
  const [WtokenID_ERC20, setWtokenID_ERC20] = useState<string | null>("");
  const [WtokenID_NEMO, setWtokenID_NEMO] = useState<string | null>("");
  const [WtokenID_Native, setWtokenID_Native] = useState<string | null>("");

  const balance_ERC20 = useBalanceERC20(WtokenID_ERC20);
  const balance_NEMO = useBalance_NEMO(WtokenID_NEMO);
  const balance_Native = useBalance_Native(WtokenID_Native);

  const setTokenID = async (tokenId: string | null) => {
    const coin = getSymbolCoin(tokenId);
    if (coin) {
      // COGI
      if (coin.native) {
        setWtokenID_Native(null);
        await sleep(100);
        setWtokenID_Native(tokenId);
      } else {
        // NEMO
        if (coin.offchain) {
          setWtokenID_NEMO(null);
          await sleep(100);
          setWtokenID_NEMO(tokenId);
        }
        // USDT
        else {
          setWtokenID_ERC20(null);
          await sleep(100);
          setWtokenID_ERC20(tokenId);
        }
      }
    }
  };

  useEffect(() => {
    setBalance(balance_ERC20);
  }, [WtokenID_ERC20, balance_ERC20]);

  useEffect(() => {
    setBalance(balance_NEMO);
  }, [WtokenID_NEMO, balance_NEMO]);

  useEffect(() => {
    setBalance(balance_Native);
  }, [WtokenID_Native, balance_Native]);

  useEffect(() => {
    accountWeb && tokenId && setTokenID(tokenId);
  }, [tokenId]);

  return balance;
}
