import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { JourneyHandlerActionType, JourneyTree, useFRConfig } from '@cmctechnology/webinvest-store-client';
import { act } from 'react-dom/test-utils';
import renderer from 'react-test-renderer';
import { IJourneyManagerProps, JourneyManager } from './JourneyManager';
import { Store } from '../../store/Store';
import { StepManager } from './StepManager';

describe(`JourneyManager`, () => {
  let tree: ReturnType<typeof renderer.create>;
  useFRConfig(JourneyTree.FR_JOURNEY_LOGIN);

  const ComponentToRender = ({ onNext, onInterceptorsRequired, action }: IJourneyManagerProps) => (
    <Provider store={Store}>
      <ThemeProvider theme={themeCmcLight}>
        <JourneyManager onNext={onNext} onInterceptorsRequired={onInterceptorsRequired} action={action} />
      </ThemeProvider>
    </Provider>
  );

  describe(`Login`, () => {
    const loginAction = {
      type: JourneyHandlerActionType.Login,
      tree: JourneyTree.FR_JOURNEY_LOGIN
    };

    it(`should match snapshot`, () => {
      expect(renderer.create(<ComponentToRender onNext={jest.fn()} onInterceptorsRequired={jest.fn()} action={loginAction} />).toJSON()).toMatchSnapshot();
    });

    it(`should call onNext`, () => {
      const mockOnNext = jest.fn();

      act(() => {
        tree = renderer.create(<ComponentToRender onNext={mockOnNext} onInterceptorsRequired={jest.fn()} action={loginAction} />);
      });

      const screenManager = tree.root.findByType(StepManager);

      act(() => {
        screenManager.props.onNext();
      });

      expect(mockOnNext).toHaveBeenCalledTimes(1);
    });

    it(`should call onInterceptorsRequired`, () => {
      const mockOnInterceptorsRequired = jest.fn();

      act(() => {
        tree = renderer.create(<ComponentToRender onNext={jest.fn()} onInterceptorsRequired={mockOnInterceptorsRequired} action={loginAction} />);
      });

      const screenManager = tree.root.findByType(StepManager);

      act(() => {
        screenManager.props.onInterceptorsRequired();
      });

      expect(mockOnInterceptorsRequired).toHaveBeenCalledTimes(1);
    });
  });
});
