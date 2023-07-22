import renderer from 'react-test-renderer';
import { act, waitFor } from '@testing-library/react';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { useModuleObject } from '@cmctechnology/webinvest-module';
import { PodManager, PodItemWrapper } from './PodManager';
import { IPodManifest } from '../../pods/podProps';
import * as manifestHook from './usePodManifest';

jest.mock(`@cmctechnology/webinvest-module`, () => ({
  ...jest.requireActual(`@cmctechnology/webinvest-module`),
  useModuleObject: jest.fn()
}));

jest.mock(`react-redux`, () => ({
  ...jest.requireActual(`react-redux`),
  useDispatch: jest.fn()
}));

const podManifestList: IPodManifest[] = [
  { name: 'name1', enabled: true, config: {} },
  { name: 'name2', enabled: true, config: {} },
  { name: 'name3', enabled: true, config: {} }
];

describe(`LoginPodManager`, () => {
  let tree: ReturnType<typeof renderer.create>;

  beforeEach(() => {
    (useModuleObject as jest.Mock).mockReturnValue({ moduleConstructor: () => <>Module Constructor.</> });
  });

  const ComponentToRender = () => (
    <ThemeProvider theme={themeCmcLight}>
      <PodManager />
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should render without crashing`, () => {
      const initialPodManifest = [...podManifestList];
      const updatedPodManifestList = { previousPodManifest: undefined, nextPodManifest: initialPodManifest[0] };

      jest.spyOn(manifestHook, `usePodManifest`).mockReturnValue(updatedPodManifestList);
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const renderComponent = () => {
        act(() => {
          tree = renderer.create(<ComponentToRender />);
        });
      };
      expect(renderComponent).not.toThrow();
    });

    it(`should render, when previous descriptor is undefined`, () => {
      const initialPodManifest = [...podManifestList];
      const updatedPodManifestList = { previousPodManifest: undefined, nextPodManifest: initialPodManifest[0] };

      jest.spyOn(manifestHook, `usePodManifest`).mockReturnValue(updatedPodManifestList);

      act(() => {
        tree = renderer.create(<ComponentToRender />);
      });

      const nextPod = tree.root.findByType(PodManager).findByProps({ id: initialPodManifest[0].name });

      expect(nextPod).toBeTruthy();
      expect(nextPod.props.className.includes(`show`)).toBe(true);
    });

    it(`should render and execute timeout handlers, when previous descriptor is defined`, () => {
      jest.useFakeTimers();
      const initialPodManifest = [...podManifestList];
      const updatedPodManifestList = { previousPodManifest: initialPodManifest[0], nextPodManifest: initialPodManifest[1] };

      jest.spyOn(manifestHook, `usePodManifest`).mockReturnValue(updatedPodManifestList);

      act(() => {
        tree = renderer.create(<ComponentToRender />);
      });

      let pods = tree.root.findAllByType(PodItemWrapper);
      expect(pods.length).toBe(2);

      act(() => {
        jest.runOnlyPendingTimers();
        jest.runOnlyPendingTimers();
      });

      pods = tree.root.findAllByType(PodItemWrapper);
      expect(pods.length).toBe(1);
      expect(pods[0].props.className.includes(`show`)).toBe(true);
      jest.useRealTimers();
    });

    it(`should call clearTimeout on unmount`, async () => {
      const initialPodManifest = [...podManifestList];
      const updatedPodManifestList = { previousPodManifest: initialPodManifest[0], nextPodManifest: initialPodManifest[1] };

      jest.spyOn(manifestHook, `usePodManifest`).mockReturnValue(updatedPodManifestList);

      const mockClearTimeout = jest.fn();
      jest.spyOn(global, `clearTimeout`).mockImplementation(mockClearTimeout);

      act(() => {
        tree = renderer.create(<ComponentToRender />);
      });

      tree.unmount();

      await waitFor(() => {
        expect(mockClearTimeout).toHaveBeenCalledTimes(1);
      });
    });

    it(`should not throw if both are undefined`, () => {
      const updatedPodManifestList = { previousPodManifest: undefined, nextPodManifest: undefined };

      jest.spyOn(manifestHook, `usePodManifest`).mockReturnValue(updatedPodManifestList as any);

      // eslint-disable-next-line unicorn/consistent-function-scoping
      const renderComponent = () => {
        act(() => {
          tree = renderer.create(<ComponentToRender />);
        });
      };
      expect(renderComponent).not.toThrow();
    });
  });
});
