import { IPodIntervalCallback, IPodManifest } from './podProps';

export const EFFECT_INTERVAL = 60_000;
export const CACHED_DESCRIPTOR_KEY = `cached_descriptor`;

const POD_FOLDER = `${process.env.PUBLIC_URL}/pods`;
const POD_MANIFEST_NAME = 'pods.json';
const POD_MANIFEST_TIMEOUT = 1000 * 60 * 5; // 5 minutes

const loadPodsFromManifest = async () => {
  const cacheBust = Math.floor(Date.now() / POD_MANIFEST_TIMEOUT);
  const podsManifestFetch = await fetch(`${POD_FOLDER}/${POD_MANIFEST_NAME}?cacheBust=${cacheBust}`);
  const podsManifest = (await podsManifestFetch.json()) as IPodManifest[];
  return podsManifest.filter((pod) => pod.enabled);
};

export const getOrderedPodManifestList = async (cacheId: string | undefined, nextStart: boolean): Promise<IPodManifest[]> => {
  const podManifestList = [...(await loadPodsFromManifest())];
  if (!cacheId) {
    return podManifestList;
  }

  let cachedItemIndex = podManifestList.map((item: IPodManifest) => item.name).indexOf(cacheId);
  if (cachedItemIndex === -1) {
    return podManifestList;
  }
  if (nextStart) {
    cachedItemIndex = cachedItemIndex === podManifestList.length - 1 ? 0 : (cachedItemIndex += 1);
  }
  return [...podManifestList.slice(cachedItemIndex), ...podManifestList.slice(0, cachedItemIndex)];
};

export const launchIntervalCounter = (manifestList: IPodManifest[], callback: IPodIntervalCallback): number => {
  let nextItemNum = 0;
  const totalItemNum = manifestList.length;

  const nextEffectHandler = () => {
    const previousNum = nextItemNum;
    nextItemNum += 1;

    if (nextItemNum > totalItemNum - 1) {
      nextItemNum = 0;
    }
    callback(manifestList[previousNum], manifestList[nextItemNum]);
  };
  return window.setInterval(nextEffectHandler, EFFECT_INTERVAL);
};
