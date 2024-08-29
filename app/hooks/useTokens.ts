import { useEffect, useState } from "react";
import { type TokenInfo, TokenManager } from "../config/coins";
import { DEFAULT_CHAINID } from "../common/constants";

export default function useTokens(chainId: number | undefined | null) {
  const [tokens, setTokens] = useState<TokenInfo[]>(
    TokenManager.list(DEFAULT_CHAINID),
  );

  useEffect(() => {
    chainId && setTokens(TokenManager.list(chainId));
  }, [chainId]);

  return tokens;
}
