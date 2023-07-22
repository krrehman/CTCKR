import renderer from 'react-test-renderer';
import { usePodManifest } from './usePodManifest';
import { act } from 'react-test-renderer';
import { IPodManifest } from '../../pods/podProps';
import { getOrderedPodManifestList, CACHED_DESCRIPTOR_KEY } from '../../pods/pod';

jest.mock('../../pods/pod', () => ({
  ...jest.requireActual('../../pods/pod'),
  getOrderedPodManifestList: jest.fn()
}));

const defaultPodManifestList: IPodManifest[] = [
  { name: `name1`, enabled: true, config: {} },
  { name: `name2`, enabled: true, config: {} },
  { name: `name3`, enabled: true, config: {} }
];

describe(`usePodManifest`, () => {
  let previousManifest: any;
  let nextManifest: any;

  const Unhook = (): JSX.Element => {
    const { previousPodManifest, nextPodManifest } = usePodManifest();
    previousManifest = previousPodManifest;
    nextManifest = nextPodManifest;
    return <div id='unhook' />;
  };

  beforeEach(() => {
    (getOrderedPodManifestList as jest.Mock).mockImplementation(() => defaultPodManifestList);
  });

  it(`should return updated manifest, and cache CACHED_DESCRIPTOR_KEY in local storage`, async () => {
    expect(localStorage.getItem(CACHED_DESCRIPTOR_KEY)).toBeFalsy();

    jest.useFakeTimers();
    const podManifestList = await getOrderedPodManifestList(undefined, false);
    await act(async () => {
      renderer.create(<Unhook />);
    });

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(localStorage.getItem(CACHED_DESCRIPTOR_KEY)).toBe(podManifestList[1].name);
    expect(previousManifest).toEqual(defaultPodManifestList[0]);
    expect(nextManifest).toEqual(defaultPodManifestList[1]);
  });
});
