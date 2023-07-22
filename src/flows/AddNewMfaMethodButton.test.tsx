import renderer, { act } from 'react-test-renderer';
import { waitFor } from '@testing-library/react';
import {
  frontendActions,
  getConfig,
  MODAL_NAME,
  POST_MESSAGE,
  defaultFrontendStore,
  createFrontendStore,
  FRONTEND_STORE_NAME
} from '@cmctechnology/webinvest-store-frontend';
import { CLIENT_STORE_NAME, createClientStore, defaultClientStore, getNextStep, getOAuth, CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { IModalState, themeCmcLight, useModalState } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Store } from '../store/Store';
import AddNewMfaMethodButton from './AddNewMfaMethodButton';
import { CLIENT_DETAILS_API_RESULT_KEY } from '../constants/apiKeyConstants';

jest.mock(`@cmctechnology/phoenix-stockbroking-web-design`, () => ({
  ...jest.requireActual(`@cmctechnology/phoenix-stockbroking-web-design`),
  useModalState: jest.fn()
}));

jest.mock(`@cmctechnology/webinvest-store-client`, () => ({
  ...jest.requireActual(`@cmctechnology/webinvest-store-client`),
  getNextStep: jest.fn(),
  getOAuth: jest.fn()
}));

interface IComponentToRenderProps {
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

describe(`AddNewMfaMethodButton`, () => {
  let tree: ReturnType<typeof renderer.create>;

  const ComponentToRender = ({ store }: IComponentToRenderProps) => (
    <Provider store={store ?? Store}>
      <ThemeProvider theme={themeCmcLight}>
        <AddNewMfaMethodButton />
      </ThemeProvider>
    </Provider>
  );

  const setModalState = jest.fn();
  beforeEach(() => {
    (getOAuth as jest.Mock).mockImplementation(() => Promise.resolve({ success: true }));
    (useModalState as jest.Mock).mockImplementation(() => [{} as IModalState, setModalState]);
  });

  it(`should match snapshot`, () => {
    expect(renderer.create(<ComponentToRender />).toJSON()).toMatchSnapshot();
  });

  it(`should force signout when ClientDetailsGet1 fails (non falcon)`, async () => {
    jest.spyOn(frontendActions, `redirectToUrl`).mockImplementation(jest.fn());
    (getNextStep as jest.Mock).mockImplementation(() => Promise.resolve(new CMCFRSDK.FRStep({})));
    const mockLogout = jest.fn();
    jest.spyOn(CMCFRSDK.FRUser, `logout`).mockImplementation(mockLogout);

    (window as any).cmcsb = { isFalcon: false };
    const initialClientStore = { ...defaultClientStore };
    const testStore = createTestStore(initialClientStore);

    (window as any).cmcsb = { isFalcon: false };

    tree = renderer.create(<ComponentToRender store={testStore} />);

    const mfaMethodButton = tree.root.findByProps({ 'data-testid': `AddNewMfaMethodButton.mfaMethodBtn` });

    await act(async () => {
      mfaMethodButton.props.onClick();
      testStore.dispatch(frontendActions.apiRequestFailed({ apiRequest: CLIENT_DETAILS_API_RESULT_KEY, errorCode: `some-error` }));
    });

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe(`AddNewMfaMethod`, () => {
    it(`should open & close modal onNext`, async () => {
      (window as any).cmcsb = { isFalcon: false };
      const initialClientStore = { ...defaultClientStore };
      const testStore = createTestStore(initialClientStore);

      tree = renderer.create(<ComponentToRender store={testStore} />);
      const mfaMethodButton = tree.root.findByProps({ 'data-testid': `AddNewMfaMethodButton.mfaMethodBtn` });

      await act(async () => {
        mfaMethodButton.props.onClick();
        testStore.dispatch(frontendActions.apiRequestSucceeded(CLIENT_DETAILS_API_RESULT_KEY));
      });

      await waitFor(() => {
        expect(setModalState).toHaveBeenCalledTimes(2);
      });

      const Dialog = setModalState.mock.calls[1][0].dialog;

      // the type function should be EnableMfa
      expect(Dialog.type.name).toEqual(`EnableMfa`);

      act(() => {
        Dialog.props.onNext();
      });

      expect(setModalState).toHaveBeenCalledTimes(3);
      expect(setModalState.mock.calls[2][0]).toEqual({ open: false });
    });

    it(`should open & close modal onCloseModal`, async () => {
      (window as any).cmcsb = { isFalcon: false };
      const initialClientStore = { ...defaultClientStore };
      const testStore = createTestStore(initialClientStore);

      tree = renderer.create(<ComponentToRender store={testStore} />);
      const mfaMethodButton = tree.root.findByProps({ 'data-testid': `AddNewMfaMethodButton.mfaMethodBtn` });

      await act(async () => {
        mfaMethodButton.props.onClick();
        testStore.dispatch(frontendActions.apiRequestSucceeded(CLIENT_DETAILS_API_RESULT_KEY));
      });

      await waitFor(() => {
        expect(setModalState).toHaveBeenCalledTimes(2);
      });

      const Dialog = setModalState.mock.calls[1][0].dialog;

      // the type function should be EnableMfa
      expect(Dialog.type.name).toEqual(`EnableMfa`);

      act(() => {
        Dialog.props.onCloseModal();
      });

      expect(setModalState).toHaveBeenCalledTimes(3);
      expect(setModalState.mock.calls[2][0]).toEqual({ open: false });
    });

    it(`should send change password message to parent`, async () => {
      (window as any).cmcsb = { isFalcon: true };

      const mockPostMessage = jest.fn();
      (window as any).postMessage = mockPostMessage;

      tree = renderer.create(<ComponentToRender />);
      const mfaMethodButton = tree.root.findByProps({ 'data-testid': `AddNewMfaMethodButton.mfaMethodBtn` });

      act(() => {
        mfaMethodButton.props.onClick();
      });

      await new Promise(process.nextTick);

      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      expect(mockPostMessage).toHaveBeenCalledWith(
        {
          type: POST_MESSAGE.SHOW_MODAL,
          name: MODAL_NAME.ADD_NEW_MFA_METHOD
        },
        getConfig().hostUrl
      );
    });
  });
});
