export const __OPSERC721_TRANSFER_SIGNATURE__ = {
  types: {
    TransferSignatureHash: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  },
  primaryType: "TransferSignatureHash",
  domain: {
    name: "OPSERC721EIP712",
    version: "1.0.0",
    chainId: 0,
    verifyingContract: "",
  },
  message: {
    from: "",
    to: "",
    tokenId: 0,
    nonce: 0,
    deadline: 0,
  },
};
