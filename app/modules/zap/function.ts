import { contractCogiChain_call_Get_Not_Login } from "../../components/RpcExec/toast_chain";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function promiseGetData(assetLaunchpad: any, contract: any) {
  const temp = assetLaunchpad;
  const res: any = {
    address: temp.address,
    ratio: 0,
  };
  try {
    const nratio = await contractCogiChain_call_Get_Not_Login(
      contract,
      "ratioA2B",
      [],
    );
    res.ratio = nratio;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
  return res;
}
