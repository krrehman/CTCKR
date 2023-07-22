import { getOrderedPodManifestList, launchIntervalCounter, EFFECT_INTERVAL } from './pod';
import { IPodManifest } from './podProps';

const defaultPodManifestList: IPodManifest[] = [
  { name: 'name1', enabled: true, config: { test: `test` } },
  { name: 'name2', enabled: true, config: {} },
  { name: 'name3', enabled: true, config: {} }
];

describe(`pod.util`, () => {
  describe(`getOrderedPodManifestList`, () => {
    beforeEach(() => {
      (global as any).fetch = (url: string) => {
        if (url.includes(`pods.json`)) {
          return Promise.resolve({
            json: () => Promise.resolve(JSON.parse(JSON.stringify(defaultPodManifestList)))
          });
        }
        return undefined;
      };
    });

    it(`should return initial manifest order (no cacheId match)`, async () => {
      const cacheId = `non-existing-id`;
      const orderedPodManifestList = await getOrderedPodManifestList(cacheId, true);
      expect(JSON.stringify(orderedPodManifestList)).toEqual(JSON.stringify(defaultPodManifestList));
    });

    it(`should return enabled manifest order (no cacheId match)`, async () => {
      const disabledPodManifestList = JSON.parse(JSON.stringify(defaultPodManifestList));
      disabledPodManifestList[0].enabled = false;
      disabledPodManifestList[2].enabled = false;

      (global as any).fetch = (url: string) => {
        if (url.includes(`pods.json`)) {
          return Promise.resolve({
            json: () => Promise.resolve(disabledPodManifestList)
          });
        }
        return undefined;
      };

      const orderedPodManifestList = await getOrderedPodManifestList(undefined, true);
      expect(orderedPodManifestList.length).toBe(1);
      expect(orderedPodManifestList[0]).toEqual(disabledPodManifestList[1]);
    });

    it(`should return initial manifest order (cacheId is undefined)`, async () => {
      const orderedPodManifestList = await getOrderedPodManifestList(undefined, true);
      expect(JSON.stringify(orderedPodManifestList)).toEqual(JSON.stringify(defaultPodManifestList));
    });

    it(`should return correct manifest order (start from next descriptor)`, async () => {
      const cacheId = defaultPodManifestList[0].name;
      const cachedItemIndex = defaultPodManifestList.map((item: IPodManifest) => item.name).indexOf(cacheId);
      const orderedPodManifestList = await getOrderedPodManifestList(cacheId, true);

      expect(orderedPodManifestList.length).toBe(defaultPodManifestList.length);
      expect(orderedPodManifestList[0].name).toBe(defaultPodManifestList[cachedItemIndex + 1].name);
      expect(orderedPodManifestList[defaultPodManifestList.length - 1].name).toBe(defaultPodManifestList[cachedItemIndex].name);
    });

    it(`should return correct manifest order (start from first item, when cached descriptor is last in list)`, async () => {
      const cacheId = defaultPodManifestList[2].name;
      const orderedPodManifestList = await getOrderedPodManifestList(cacheId, true);
      expect(JSON.stringify(orderedPodManifestList)).toEqual(JSON.stringify(defaultPodManifestList));
    });

    it(`should return correct manifest order (start from same descriptor)`, async () => {
      const cacheId = defaultPodManifestList[1].name;
      const cachedItemIndex = defaultPodManifestList.map((item: IPodManifest) => item.name).indexOf(cacheId);
      const orderedPodManifestList = await getOrderedPodManifestList(cacheId, false);

      expect(orderedPodManifestList.length).toBe(defaultPodManifestList.length);
      expect(orderedPodManifestList[0].name).toBe(defaultPodManifestList[cachedItemIndex].name);
      expect(orderedPodManifestList[defaultPodManifestList.length - 1].name).toBe(defaultPodManifestList[cachedItemIndex - 1].name);
    });
  });

  describe(`launchIntervalCounter`, () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it(`should call counter callback with next and previous items`, () => {
      const callback = jest.fn();
      const slicedManifestItems = defaultPodManifestList.slice(0, 2);
      const interval = launchIntervalCounter(slicedManifestItems, callback);

      jest.runOnlyPendingTimers();
      window.clearInterval(interval);
      expect(callback.mock.calls.length).toBe(1);
      expect(callback.mock.calls[0][0]).toEqual(slicedManifestItems[0]);
      expect(callback.mock.calls[0][1]).toEqual(slicedManifestItems[1]);
    });

    it(`should call counter callback with last and first items (end of the interval loop)`, () => {
      const callback = jest.fn();
      const slicedManifestItems = defaultPodManifestList.slice(0, 2);
      const interval = launchIntervalCounter(slicedManifestItems, callback);
      jest.advanceTimersByTime(EFFECT_INTERVAL);
      jest.runOnlyPendingTimers();
      window.clearInterval(interval);

      expect(callback.mock.calls.length).toBe(2);
      expect(callback.mock.calls[0][0]).toEqual(slicedManifestItems[0]);
      expect(callback.mock.calls[0][1]).toEqual(slicedManifestItems[1]);
      expect(callback.mock.calls[1][0]).toEqual(slicedManifestItems[1]);
      expect(callback.mock.calls[1][1]).toEqual(slicedManifestItems[0]);
    });
  });
});
