import renderer from 'react-test-renderer';
import { act } from '@testing-library/react';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { ActiveBackground } from './ActiveBackground';
import { initialPodContext, PodContext } from './PodContext';

let tree: ReturnType<typeof renderer.create>;

interface IComponentToRenderProps {
  mockContext: any;
}

describe(`ActiveBackground`, () => {
  const ComponentToRender = ({ mockContext }: IComponentToRenderProps) => {
    return (
      <ThemeProvider theme={themeCmcLight}>
        <PodContext.Provider value={mockContext}>
          <ActiveBackground />
        </PodContext.Provider>
      </ThemeProvider>
    );
  };

  describe(`render`, () => {
    it(`should render without crashing`, () => {
      const mockContext = { podDescriptor: { ...initialPodContext.podDescriptor }, setPodDescriptor: jest.fn() };
      mockContext.podDescriptor.bgColors = [{ bgColor: `#FFFFFF`, bgTextColor: `#FFFFFF` }];
      expect(() => renderer.create(<ComponentToRender mockContext={mockContext} />)).not.toThrow();
    });

    it(`should render without crashing when no backgrounds are specified`, () => {
      const mockContext = { podDescriptor: { ...initialPodContext.podDescriptor }, setPodDescriptor: jest.fn() };
      mockContext.podDescriptor.bgColors = [] as any;
      expect(() => renderer.create(<ComponentToRender mockContext={mockContext} />)).not.toThrow();
    });

    it(`should clear timer when timeoutId is set`, () => {
      const mockContext = { podDescriptor: { ...initialPodContext.podDescriptor }, setPodDescriptor: jest.fn() };
      mockContext.podDescriptor.bgColors = [
        { bgColor: `#FFFFFF`, bgTextColor: `#000000` },
        { bgColor: `#000000`, bgTextColor: `#FFFFFF` }
      ];
      jest.useFakeTimers();
      const mockClearTimeout = jest.fn();
      window.clearTimeout = mockClearTimeout;

      act(() => {
        tree = renderer.create(<ComponentToRender mockContext={mockContext} />);
      });

      act(() => {
        jest.runOnlyPendingTimers();
        jest.runOnlyPendingTimers();
      });

      expect(mockClearTimeout.mock.calls.length).toBe(2);

      act(() => {
        tree.unmount();
      });

      expect(mockClearTimeout.mock.calls.length).toBe(3);
    });
  });
});
