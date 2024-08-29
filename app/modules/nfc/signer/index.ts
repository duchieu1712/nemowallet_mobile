import { Wallet } from "ethers";
import { keccak256, solidityPack, toUtf8Bytes } from "ethers/lib/utils";

export * from "./signer";

export function createWalletSigner(id: string, cid: string, salt: string) {
  const packed = solidityPack(
    ["bytes32", "bytes32", "bytes32"],
    [
      keccak256(toUtf8Bytes(id)),
      keccak256(toUtf8Bytes(cid)),
      keccak256(toUtf8Bytes(salt)),
    ],
  );

  const prv = keccak256(packed);

  return {
    signer: new Wallet(prv),
    // secret: Buffer.from(arrayify(prv)).toString("base64").slice(0, 8),
    secret: "Gihot@123",
  };
}
