export async function promiseGetData(
  provider: any | unknown,
  method: any | unknown,
  params: any | unknown,
): Promise<any> {
  let res = [];
  try {
    const temp = await provider.call(method, params);
    if (temp.landinfo) {
      res = temp.landinfo;
    }
  } catch (e) {
    res = [];
  }
  return res;
}

export async function promiseGetDataBatch(
  provider: any | unknown,
  batch: any | unknown,
): Promise<any> {
  const res = {
    landinfo: [],
    nemo_hotwallet_pendingonchain: true,
    erc721_galix_resource_pendingonchain: true,
  };
  try {
    if (batch.length == 3) {
      const [
        landinfo,
        nemo_hotwallet_pendingonchain,
        erc721_galix_resource_pendingonchain,
      ] = await provider.batch(batch);
      if (!landinfo.message) {
        res.landinfo = landinfo.landinfo;
      }
      if (!nemo_hotwallet_pendingonchain.message) {
        res.nemo_hotwallet_pendingonchain =
          nemo_hotwallet_pendingonchain.is_pending;
      }
      if (!erc721_galix_resource_pendingonchain.message) {
        res.erc721_galix_resource_pendingonchain =
          erc721_galix_resource_pendingonchain.is_pending;
      }
    } else if (batch.length == 2) {
      const [landinfo, erc721_galix_resource_pendingonchain] =
        await provider.batch(batch);
      if (!landinfo.message) {
        res.landinfo = landinfo.landinfo;
      }
      if (!erc721_galix_resource_pendingonchain.message) {
        res.erc721_galix_resource_pendingonchain =
          erc721_galix_resource_pendingonchain.is_pending;
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
  return res;
}
