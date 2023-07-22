import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import renderer from 'react-test-renderer';
import { ThemeProvider } from 'styled-components';
import { act } from 'react-test-renderer';
import { waitFor } from '@testing-library/react';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { FRONTEND_STORE_NAME, createFrontendStore, defaultFrontendStore, frontendActions } from '@cmctechnology/webinvest-store-frontend';
import { Store } from '../store/Store';
import { useCheckCmcSession } from './useCheckCmcSession';
import { CLIENT_DETAILS_API_RESULT_KEY } from '../constants/apiKeyConstants';
import { CLIENT_STORE_NAME, createClientStore, defaultClientStore, CMCFRSDK, getNextStep } from '@cmctechnology/webinvest-store-client';

jest.mock(`@cmctechnology/webinvest-store-client`, () => ({
  ...jest.requireActual(`@cmctechnology/webinvest-store-client`),
  getNextStep: jest.fn()
}));

interface IUnhookProps {
  onSuccess: () => void;
}

interface IComponentToRenderProps {
  children: React.ReactNode;
  store?: any;
}

const createTestStore = (initialClientStore = defaultClientStore, initialFrontendStore = defaultFrontendStore) => {
  const clientStore = createClientStore(initialClientStore);
  const frontendStore = createFrontendStore(initialFrontendStore);

  return configureStore({
    reducer: {
      [CLIENT_STORE_NAME]: clientStore.reducer,
      [FRONTEND_STORE_NAME]: frontendStore.reducer
    }
  });
};

describe(`useCheckCmcSession`, () => {
  let tree: ReturnType<typeof renderer.create>;

  const Unhook = ({ onSuccess }: IUnhookProps): JSX.Element => {
    const { setRequestToCheckSession } = useCheckCmcSession(onSuccess);
    return <div id='unhook' data-testid='testButton' onClick={() => setRequestToCheckSession(true)} />;
  };

  const ComponentToRender = ({ children, store }: IComponentToRenderProps) => (
    <Provider store={store ?? Store}>
      <ThemeProvider theme={themeCmcLight}>{children}</ThemeProvider>
    </Provider>
  );

  it(`should call success handler when ClientDetailsGet1 returns success`, async () => {
    const initialClientStore = { ...defaultClientStore };
    const testStore = createTestStore(initialClientStore);
    const mockSuccessHandler = jest.fn();

    await act(async () => {
      tree = renderer.create(
        <ComponentToRender store={testStore}>
          <Unhook onSuccess={mockSuccessHandler} />
        </ComponentToRender>
      );
    });

    const testButton = tree.root.findByProps({ 'data-testid': `testButton` });

    await act(async () => {
      testButton.props.onClick();
      testStore.dispatch(frontendActions.apiRequestSucceeded(CLIENT_DETAILS_API_RESULT_KEY));
    });

    expect(mockSuccessHandler).toHaveBeenCalledTimes(1);
  });

  it(`should force signout when ClientDetailsGet1 fails`, async () => {
    jest.spyOn(frontendActions, `redirectToUrl`).mockImplementation(jest.fn());
    (getNextStep as jest.Mock).mockImplementation(() => Promise.resolve(new CMCFRSDK.FRStep({})));
    const mockLogout = jest.fn();
    jest.spyOn(CMCFRSDK.FRUser, `logout`).mockImplementation(mockLogout);

    const initialClientStore = { ...defaultClientStore };
    const testStore = createTestStore(initialClientStore);

    await act(async () => {
      tree = renderer.create(
        <ComponentToRender store={testStore}>
          <Unhook onSuccess={jest.fn()} />
        </ComponentToRender>
      );
    });

    const testButton = tree.root.findByProps({ 'data-testid': `testButton` });

    await act(async () => {
      testButton.props.onClick();
      testStore.dispatch(frontendActions.apiRequestFailed({ apiRequest: CLIENT_DETAILS_API_RESULT_KEY, errorCode: `some-error` }));
    });

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });
});
