import { useEffect, useState } from 'react';
import { CACHED_DESCRIPTOR_KEY, getOrderedPodManifestList, launchIntervalCounter } from '../../pods/pod';
import { IPodManifest, IUpdatedPodManifestList } from '../../pods/podProps';

export const usePodManifest = (): IUpdatedPodManifestList => {
  const [initialPodManifestList, setInitialPodManifestList] = useState<IPodManifest[]>([]);
  const [updatedPodManifestList, setUpdatedPodManifestList] = useState<IUpdatedPodManifestList>();

  const intervalCallBack = (previousPodManifest: IPodManifest, nextPodManifest: IPodManifest) => {
    setUpdatedPodManifestList({ previousPodManifest, nextPodManifest });
    localStorage.setItem(CACHED_DESCRIPTOR_KEY, nextPodManifest.name);
  };

  const getPodManifestList = async (cachedDescriptorId: string | undefined) => {
    const originalManifestList = await getOrderedPodManifestList(cachedDescriptorId, true);

    setInitialPodManifestList(originalManifestList);
    setUpdatedPodManifestList({ nextPodManifest: originalManifestList[0] });
    localStorage.setItem(CACHED_DESCRIPTOR_KEY, originalManifestList[0].name);
    launchIntervalCounter(originalManifestList, intervalCallBack);
  };

  useEffect(() => {
    const cachedDescriptorId = localStorage.getItem(CACHED_DESCRIPTOR_KEY) || undefined;
    getPodManifestList(cachedDescriptorId);
  }, []);

  if (!(initialPodManifestList && updatedPodManifestList)) {
    return {} as IUpdatedPodManifestList;
  }

  return updatedPodManifestList;
};
