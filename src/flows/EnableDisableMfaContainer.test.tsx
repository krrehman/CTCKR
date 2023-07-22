import renderer, { act } from 'react-test-renderer';
import { waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { CLIENT_STORE_NAME, CMCFRSDK, createClientStore, defaultClientStore, getNextStep, getOAuth } from '@cmctechnology/webinvest-store-client';
import {
  frontendActions,
  getConfig,
  MODAL_NAME,
  POST_MESSAGE,
  defaultFrontendStore,
  createFrontendStore,
  FRONTEND_STORE_NAME
} from '@cmctechnology/webinvest-store-frontend';
import { IModalState, themeCmcLight, useModalState } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { Store } from '../store/Store';
import EnableDisableMfaContainer from './EnableDisableMfaContainer';
import { WfeButtonType } from '../constants/enums';
import { CLIENT_DETAILS_API_RESULT_KEY } from '../constants/apiKeyConstants';

jest.mock(`@cmctechnology/webinvest-store-client`, () => ({
  ...jest.requireActual(`@cmctechnology/webinvest-store-client`),
  getNextStep: jest.fn(),
  getOAuth: jest.fn()
}));

jest.mock(`@cmctechnology/phoenix-stockbroking-web-design`, () => ({
  ...jest.requireActual(`@cmctechnology/phoenix-stockbroking-web-design`),
  useModalState: jest.fn()
}));

interface IComponentToRenderProps {
  buttonType: WfeButtonType;
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

describe(`EnableDisableMfaContainer`, () => {
  let tree: ReturnType<typeof renderer.create>;

  const ComponentToRender = ({ buttonType, store }: IComponentToRenderProps) => (
    <Provider store={store ?? Store}>
      <ThemeProvider theme={themeCmcLight}>
        <EnableDisableMfaContainer buttonType={buttonType} />
      </ThemeProvider>
    </Provider>
  );

  const setModalState = jest.fn();
  beforeEach(() => {
    (getOAuth as jest.Mock).mockImplementation(() => Promise.resolve({ success: true }));
    (useModalState as jest.Mock).mockImplementation(() => [{} as IModalState, setModalState]);
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

    tree = renderer.create(<ComponentToRender buttonType={WfeButtonType.ChangePassword} store={testStore} />);

    const enableDisableButton = tree.root.findByProps({ 'data-testid': `EnableDisableMfaContainer.enableDisableMfaBtn` });

    await act(async () => {
      enableDisableButton.props.onClick();
      testStore.dispatch(frontendActions.apiRequestFailed({ apiRequest: CLIENT_DETAILS_API_RESULT_KEY, errorCode: `some-error` }));
    });

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe(`EnableMfa`, () => {
    it(`should match snapshot`, () => {
      expect(renderer.create(<ComponentToRender buttonType={WfeButtonType.EnableMFA} />).toJSON()).toMatchSnapshot();
    });

    it(`should open & close modal onNext`, async () => {
      (window as any).cmcsb = { isFalcon: false };
      const initialClientStore = { ...defaultClientStore };
      const testStore = createTestStore(initialClientStore);

      await act(async () => {
        tree = renderer.create(<ComponentToRender buttonType={WfeButtonType.EnableMFA} store={testStore} />);
      });

      const enableDisableButton = tree.root.findByProps({ 'data-testid': `EnableDisableMfaContainer.enableDisableMfaBtn` });

      await act(async () => {
        enableDisableButton.props.onClick();
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

      await act(async () => {
        tree = renderer.create(<ComponentToRender buttonType={WfeButtonType.EnableMFA} store={testStore} />);
      });

      const enableDisableButton = tree.root.findByProps({ 'data-testid': `EnableDisableMfaContainer.enableDisableMfaBtn` });

      await act(async () => {
        enableDisableButton.props.onClick();
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

      await act(async () => {
        tree = renderer.create(<ComponentToRender buttonType={WfeButtonType.EnableMFA} />);
      });

      const enableDisableButton = tree.root.findByProps({ 'data-testid': `EnableDisableMfaContainer.enableDisableMfaBtn` });

      act(() => {
        enableDisableButton.props.onClick();
      });

      await new Promise(process.nextTick);

      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      expect(mockPostMessage).toHaveBeenCalledWith(
        {
          type: POST_MESSAGE.SHOW_MODAL,
          name: MODAL_NAME.ENABLE_MFA
        },
        getConfig().hostUrl
      );
    });
  });

  describe(`DisableMfa`, () => {
    it(`should open & close modal onNext`, async () => {
      (window as any).cmcsb = { isFalcon: false };
      const initialClientStore = { ...defaultClientStore };
      const testStore = createTestStore(initialClientStore);

      await act(async () => {
        tree = renderer.create(<ComponentToRender buttonType={WfeButtonType.DisableMFA} store={testStore} />);
      });

      const enableDisableButton = tree.root.findByProps({ 'data-testid': `EnableDisableMfaContainer.enableDisableMfaBtn` });

      await act(async () => {
        enableDisableButton.props.onClick();
        testStore.dispatch(frontendActions.apiRequestSucceeded(CLIENT_DETAILS_API_RESULT_KEY));
      });

      await waitFor(() => {
        expect(setModalState).toHaveBeenCalledTimes(2);
      });

      const Dialog = setModalState.mock.calls[1][0].dialog;

      // the type function should be DisableMfa
      expect(Dialog.type.name).toEqual(`DisableMfa`);

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

      await act(async () => {
        tree = renderer.create(<ComponentToRender buttonType={WfeButtonType.DisableMFA} store={testStore} />);
      });

      const enableDisableButton = tree.root.findByProps({ 'data-testid': `EnableDisableMfaContainer.enableDisableMfaBtn` });

      await act(async () => {
        enableDisableButton.props.onClick();
        testStore.dispatch(frontendActions.apiRequestSucceeded(CLIENT_DETAILS_API_RESULT_KEY));
      });

      await waitFor(() => {
        expect(setModalState).toHaveBeenCalledTimes(2);
      });

      const Dialog = setModalState.mock.calls[1][0].dialog;

      // the type function should be DisableMfa
      expect(Dialog.type.name).toEqual(`DisableMfa`);

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

      await act(async () => {
        tree = renderer.create(<ComponentToRender buttonType={WfeButtonType.DisableMFA} />);
      });

      const enableDisableButton = tree.root.findByProps({ 'data-testid': `EnableDisableMfaContainer.enableDisableMfaBtn` });

      act(() => {
        enableDisableButton.props.onClick();
      });

      await new Promise(process.nextTick);

      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      expect(mockPostMessage).toHaveBeenCalledWith(
        {
          type: POST_MESSAGE.SHOW_MODAL,
          name: MODAL_NAME.DISABLE_MFA
        },
        getConfig().hostUrl
      );
    });
  });

  describe(`handle message`, () => {
    let mockAddEventListener: jest.Mock;
    let mockRemoveEventListener: jest.Mock;

    beforeEach(() => {
      mockAddEventListener = jest.fn();
      mockRemoveEventListener = jest.fn();
      (window as any).addEventListener = mockAddEventListener;
      (window as any).removeEventListener = mockRemoveEventListener;
    });

    afterEach(() => {
      mockAddEventListener.mockRestore();
      mockRemoveEventListener.mockRestore();
    });

    it(`should not setMfaButtonType if message is not POST_MESSAGE.UPDATE_MFA_STATUS`, async () => {
      await act(async () => {
        tree = renderer.create(<ComponentToRender buttonType={WfeButtonType.DisableMFA} />);
      });

      expect(mockAddEventListener).toHaveBeenCalledTimes(1);
      expect(mockAddEventListener.mock.calls[0][0]).toBe(`message`);

      act(() => {
        mockAddEventListener.mock.calls[0][1]({ data: { type: `any-type`, mfaStatus: `enabled` } });
      });

      const enableDisableButton = tree.root.findByProps({ 'data-testid': `EnableDisableMfaContainer.enableDisableMfaBtn` });

      expect(enableDisableButton.props.value).toBe(`Deactivate`);
    });

    it(`should setMfaButtonType to WfeButtonType.DisableMFA (value Deactivate)`, async () => {
      await act(async () => {
        tree = renderer.create(<ComponentToRender buttonType={WfeButtonType.EnableMFA} />);
      });

      expect(mockAddEventListener).toHaveBeenCalledTimes(1);
      expect(mockAddEventListener.mock.calls[0][0]).toBe(`message`);

      act(() => {
        mockAddEventListener.mock.calls[0][1]({ data: { type: POST_MESSAGE.UPDATE_MFA_STATUS, mfaStatus: `enabled` } });
      });

      const enableDisableButton = tree.root.findByProps({ 'data-testid': `EnableDisableMfaContainer.enableDisableMfaBtn` });

      expect(enableDisableButton.props.value).toBe(`Deactivate`);
    });

    it(`should setMfaButtonType WfeButtonType.EnableMFA (value Activate)`, async () => {
      await act(async () => {
        tree = renderer.create(<ComponentToRender buttonType={WfeButtonType.DisableMFA} />);
      });

      expect(mockAddEventListener).toHaveBeenCalledTimes(1);
      expect(mockAddEventListener.mock.calls[0][0]).toBe(`message`);

      act(() => {
        mockAddEventListener.mock.calls[0][1]({ data: { type: POST_MESSAGE.UPDATE_MFA_STATUS, mfaStatus: `disabled` } });
      });

      const enableDisableButton = tree.root.findByProps({ 'data-testid': `EnableDisableMfaContainer.enableDisableMfaBtn` });

      expect(enableDisableButton.props.value).toBe(`Activate`);
    });

    it(`should call removeEventListener`, async () => {
      await act(async () => {
        tree = renderer.create(<ComponentToRender buttonType={WfeButtonType.EnableMFA} />);
      });

      await new Promise(process.nextTick);

      act(() => {
        tree.unmount();
      });

      await new Promise(process.nextTick);

      expect(mockRemoveEventListener).toHaveBeenCalledTimes(1);
    });
  });
});
