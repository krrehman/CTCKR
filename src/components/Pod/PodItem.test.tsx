import { useContext } from 'react';
import renderer from 'react-test-renderer';
import { act } from '@testing-library/react';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { useModuleObject } from '@cmctechnology/webinvest-module';
import { IPodItemProps, PodItem } from './PodItem';
import { initialPodContext } from './PodContext';

jest.mock(`@cmctechnology/webinvest-module`, () => ({
  ...jest.requireActual(`@cmctechnology/webinvest-module`),
  useModuleObject: jest.fn()
}));

jest.mock(`react`, () => ({
  ...jest.requireActual(`react`),
  useContext: jest.fn()
}));

describe(`LoginPodItem`, () => {
  let tree: ReturnType<typeof renderer.create>;
  let mockSetPodDescriptor: jest.Mock;
  const moduleName = `GooglePod`;

  beforeEach(() => {
    mockSetPodDescriptor = jest.fn();
    const mockContext = { podDescriptor: initialPodContext.podDescriptor, setPodDescriptor: mockSetPodDescriptor };

    (useContext as jest.Mock).mockImplementation(() => mockContext);
    (useModuleObject as jest.Mock).mockReturnValue({ moduleConstructor: () => <div id={moduleName}>Module Constructor.</div> });
  });

  const ComponentToRender = (props: IPodItemProps) => (
    <ThemeProvider theme={themeCmcLight}>
      <PodItem {...props} />
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should render without crashing`, () => {
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const renderComponent = () => {
        act(() => {
          tree = renderer.create(<ComponentToRender name={moduleName} />);
        });
      };
      expect(renderComponent).not.toThrow();
    });

    it(`should render when moduleConstructor is defined`, () => {
      act(() => {
        tree = renderer.create(<ComponentToRender name={moduleName} />);
      });

      expect(tree.root.findAllByProps({ id: moduleName }).length).toBe(1);
    });

    it(`should not render when moduleConstructor is undefined`, () => {
      (useModuleObject as jest.Mock).mockReturnValue({});

      act(() => {
        tree = renderer.create(<ComponentToRender name={moduleName} />);
      });
      expect(tree.root.findAllByProps({ id: moduleName }).length).toBe(0);
    });

    it(`should call dispatch if moduleConstructor and bgColors are defined`, () => {
      (useModuleObject as jest.Mock).mockReturnValue({
        moduleConstructor: () => <div id={moduleName}>Module Constructor.</div>,
        bgColors: [{ bgColor: `#848B98`, bgTextColor: `#FFFFFF` }]
      });

      act(() => {
        tree = renderer.create(<ComponentToRender name={moduleName} />);
      });

      expect(mockSetPodDescriptor.mock.calls.length).toBe(1);
    });
  });
});
