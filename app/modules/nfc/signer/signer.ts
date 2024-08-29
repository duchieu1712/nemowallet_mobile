import { type Wallet, constants } from "ethers";
import { __OPSERC721_TRANSFER_SIGNATURE__ } from "./eip712";

class Hasher {
  constructor(
    readonly chainId: number,
    readonly contractAddress: string,
  ) {}

  public getTransferDomain(
    from: string,
    to: string,
    tokenId: number,
    nonce: number,
    deadline: number,
  ) {
    const data = { ...__OPSERC721_TRANSFER_SIGNATURE__ };

    data.domain.chainId = this.chainId;
    data.domain.verifyingContract = this.contractAddress;
    data.message.from = from;
    data.message.to = to;
    data.message.tokenId = tokenId;
    data.message.nonce = nonce;
    data.message.deadline = deadline;

    return data;
  }
}

export class OPSSigner {
  readonly hasher;
  constructor(
    readonly inner: Wallet,
    readonly contractAddress: string,
    readonly chainId: number,
  ) {
    this.hasher = new Hasher(chainId, contractAddress);
  }

  public async signTransfer(
    from: string,
    to: string,
    tokenId: number,
    nonce: number,
    deadline: number,
  ) {
    const data = this.hasher.getTransferDomain(
      from,
      to,
      tokenId,
      nonce,
      deadline,
    );
    return await this.inner._signTypedData(
      data.domain,
      data.types,
      data.message,
    );
  }

  public async signValidateOPS(
    owner: string,
    tokenId: number,
    nonce: number,
    deadline: number,
  ) {
    return await this.signTransfer(
      owner,
      constants.AddressZero,
      tokenId,
      nonce,
      deadline,
    );
  }
}
