export const PRIVATE_CREATE_WALLET_SIGNER = "qFIDL761THTk6RJ5Si8JFXlbMjN4Wk7x";
export const IPFS_USERNAME = "test";
export const IPFS_PASSWORD = "uSVGnY8Jsgtscnd";
export const IPFS_ENDPOINT = "https://testnet-ipfs.nemoverse.io/api/v0";

export function convertTextToHex(inputText: string) {
  // Convert the text to a byte array using UTF-8 encoding
  const byteArray = new TextEncoder().encode(inputText);

  // Convert each byte to its hexadecimal representation
  const hexResult = Array.from(byteArray, (byte) =>
    byte.toString(16).padStart(2, "0"),
  );

  return hexResult;
}

//
export async function encodeString(inputString: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(inputString);
  const hashArray = Array.from(new Uint8Array(data));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  // Take the first 8 characters as your encoded string
  const encodedString = hashHex.substring(0, 4);

  return encodedString;
}
