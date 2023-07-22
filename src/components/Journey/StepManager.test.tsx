import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import {
  clientActions,
  createClientStore,
  defaultClientStore,
  CLIENT_STORE_NAME,
  LoginApiModelResult,
  ScreenStage,
  useFRConfig,
  JourneyTree,
  FRLoginFailureEnhanced,
  ErrorMessageCode,
  CMCFRSDK
} from '@cmctechnology/webinvest-store-client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { IStepManagerProps, StepManager } from './StepManager';
import { LoginForm } from '../Forms/LoginForm';
import { Provider, useDispatch } from 'react-redux';
import { Store } from '../../store/Store';
import {
  createFrontendStore,
  defaultFrontendStore,
  frontendActions,
  FRONTEND_STORE_NAME,
  FrontendContextProvider,
  getConfig
} from '@cmctechnology/webinvest-store-frontend';
import { configureStore } from '@reduxjs/toolkit';
import { SIGNIN_API_RESULT_KEY } from '../../constants/apiKeyConstants';
import { RegisterMFARecoveryCodesForm } from '../Forms/RegisterMFARecoveryCodesForm';
import { FormLoaderWrapper } from '../Forms/Form';
import { BuildStepForm } from '../Forms/BuildStepForm';
import { BuildErrorForm } from '../Forms/BuildErrorForm';
import { SOURCES, THEMES } from '@cmctechnology/webinvest-constants';

jest.mock(`react-redux`, () => ({
  ...jest.requireActual(`react-redux`),
  useDispatch: jest.fn()
}));

const nameCallback = {
  input: [{ name: `IDToken1`, value: `` }],
  output: [{ name: `prompt`, value: `User Name` }],
  type: CMCFRSDK.CallbackType.NameCallback
};

const passwordCallback = {
  input: [{ name: `IDToken2`, value: `` }],
  output: [{ name: `prompt`, value: `Password` }],
  type: CMCFRSDK.CallbackType.PasswordCallback
};

const newPassCallbacks = [
  {
    input: [{ name: `IDToken1`, value: ``, IDToken1validateOnly: true }],
    output: [
      { name: `echoOn`, value: false },
      {
        name: `policies`,
        value: {
          conditionalPolicies: undefined,
          fallbackPolicies: undefined,
          name: `password`,
          policies: [{ policyRequirements: [`VALID_TYPE`], policyId: `valid-type`, params: { types: [`string`] } }],
          policyRequirements: [`VALID_TYPE`]
        }
      },
      {
        name: `failedPolicies`,
        value: [
          `{ \"policyRequirement\": \"LENGTH_BASED\", \"params\": { \"max-password-length\": 0, \"min-password-length\": 8 } }`,
          `{ \"policyRequirement\": \"CHARACTER_SET\", \"params\": { \"allow-unclassified-characters\": true, \"character-set-ranges\": [  ], \"character-sets\": [ \"0:0123456789\" ], \"min-character-sets\": 1 } }`
        ]
      },
      { name: 'validateOnly', value: true },
      { name: `prompt`, value: `Password` }
    ],
    type: CMCFRSDK.CallbackType.ValidatedCreatePasswordCallback
  }
];

const step: CMCFRSDK.Step = {
  callbacks: [nameCallback, passwordCallback],
  stage: ScreenStage.Login
};

interface IProps extends IStepManagerProps {
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

describe(`StepManager`, () => {
  let tree: ReturnType<typeof renderer.create>;
  let frStep: CMCFRSDK.FRStep;
  const accessToken = `some-access-token`;

  useFRConfig(JourneyTree.FR_JOURNEY_LOGIN);

  const ComponentToRender = (props: IProps) => (
    <Provider store={props.store ?? Store}>
      <ThemeProvider theme={themeCmcLight}>
        <BrowserRouter>
          <StepManager {...props} />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );

  beforeEach(() => {
    frStep = new CMCFRSDK.FRStep(step);
  });

  it(`should match snapshot`, () => {
    expect(
      renderer
        .create(
          <ComponentToRender
            step={frStep}
            setSubmissionStep={jest.fn()}
            onNext={jest.fn()}
            onInterceptorsRequired={jest.fn()}
            setSubmissionProcess={jest.fn()}
            submissionProcess={false}
          />
        )
        .toJSON()
    ).toMatchSnapshot();
  });

  describe(`signInWithToken`, () => {
    it(`should call signInWithToken when shiftKey is false`, async () => {
      jest.spyOn(CMCFRSDK.TokenStorage, `get`).mockImplementation(() => Promise.resolve({ accessToken }));

      const frSuccessStep = new CMCFRSDK.FRLoginSuccess(step);

      const mockSignInWithToken = jest.fn();
      jest.spyOn(clientActions, `signInWithToken`).mockImplementation(mockSignInWithToken);

      const mockDispatch = jest.fn();
      (useDispatch as jest.Mock).mockReturnValue(mockDispatch);

      act(() => {
        tree = renderer.create(
          <FrontendContextProvider
            tradingRoutePrefix={`${process.env.PUBLIC_URL}/trading`}
            publicUrl={`${process.env.PUBLIC_URL}`}
            config={getConfig()}
            theme={THEMES.CMCSingapore}
          >
            <ComponentToRender
              step={frSuccessStep}
              setSubmissionStep={jest.fn()}
              onNext={jest.fn()}
              onInterceptorsRequired={jest.fn()}
              setSubmissionProcess={jest.fn()}
              submissionProcess={false}
            />
          </FrontendContextProvider>
        );
      });

      await new Promise(process.nextTick);

      expect(mockSignInWithToken).toHaveBeenCalledTimes(1);
      expect(mockSignInWithToken).toHaveBeenCalledWith(accessToken, false, SOURCES.CmcInvestSingaporePublic);
    });

    it(`should call signInWithToken when shiftKey is true. (setUserDetails and call setSubmissionStep)`, async () => {
      jest.spyOn(CMCFRSDK.TokenStorage, `get`).mockImplementation(() => Promise.resolve({ accessToken }));

      const mockSignInWithToken = jest.fn();
      jest.spyOn(clientActions, `signInWithToken`).mockImplementation(mockSignInWithToken);

      const mockSetSubmissionStep = jest.fn();

      const mockDispatch = jest.fn();
      (useDispatch as jest.Mock).mockReturnValue(mockDispatch);

      act(() => {
        tree = renderer.create(
          <FrontendContextProvider
            tradingRoutePrefix={`${process.env.PUBLIC_URL}/trading`}
            publicUrl={`${process.env.PUBLIC_URL}`}
            config={getConfig()}
            theme={THEMES.CMC}
          >
            <ComponentToRender
              step={new CMCFRSDK.FRStep(step)}
              setSubmissionStep={mockSetSubmissionStep}
              onNext={jest.fn()}
              onInterceptorsRequired={jest.fn()}
              setSubmissionProcess={jest.fn()}
              submissionProcess={false}
            />
          </FrontendContextProvider>
        );
      });

      const loginForm = tree.root.findByType(LoginForm);
      expect(loginForm).toBeTruthy();

      act(() => {
        loginForm.props.applyActionCallback(true);
      });

      expect(mockSignInWithToken).not.toHaveBeenCalled();
      expect(mockSetSubmissionStep).toHaveBeenCalledTimes(1);

      const frSuccessStep = new CMCFRSDK.FRLoginSuccess(step);

      act(() => {
        tree.update(
          <FrontendContextProvider
            tradingRoutePrefix={`${process.env.PUBLIC_URL}/trading`}
            publicUrl={`${process.env.PUBLIC_URL}`}
            config={getConfig()}
            theme={THEMES.CMC}
          >
            <ComponentToRender
              step={frSuccessStep}
              setSubmissionStep={jest.fn()}
              onNext={jest.fn()}
              onInterceptorsRequired={jest.fn()}
              setSubmissionProcess={jest.fn()}
              submissionProcess={false}
            />
          </FrontendContextProvider>
        );
      });

      await new Promise(process.nextTick);

      expect(mockSignInWithToken).toHaveBeenCalledTimes(1);
      expect(mockSignInWithToken).toHaveBeenCalledWith(accessToken, true, SOURCES.CmcPublic);
    });
  });

  it(`should not call signInWithToken, but should call setSubmissionStep`, () => {
    const textOutputCallback = {
      output: [
        { name: `message`, value: `Do you want to register another device?` },
        { name: `messageType`, value: 0 }
      ],
      type: CMCFRSDK.CallbackType.TextOutputCallback
    };

    const callbacks = JSON.parse(JSON.stringify([textOutputCallback]));
    const registerMFARecoveryCodesStep = { callbacks, stage: ScreenStage.RegisterMFARecoveryCodes };

    const mockSignInWithToken = jest.fn();
    const mockSetSubmissionStep = jest.fn();
    jest.spyOn(clientActions, `signInWithToken`).mockImplementation(mockSignInWithToken);

    act(() => {
      tree = renderer.create(
        <ComponentToRender
          step={new CMCFRSDK.FRStep(registerMFARecoveryCodesStep)}
          setSubmissionStep={mockSetSubmissionStep}
          onNext={jest.fn()}
          onInterceptorsRequired={jest.fn()}
          setSubmissionProcess={jest.fn()}
          submissionProcess={false}
        />
      );
    });

    const loginForm = tree.root.findByType(RegisterMFARecoveryCodesForm);

    act(() => {
      loginForm.props.applyActionCallback();
    });

    expect(mockSignInWithToken).not.toHaveBeenCalled();
    expect(mockSetSubmissionStep).toHaveBeenCalledTimes(1);
  });

  describe(`LoginFailure`, () => {
    it(`should return BuildErrorForm`, () => {
      const frFailureStep = new CMCFRSDK.FRLoginFailure(step) as FRLoginFailureEnhanced;
      frFailureStep.errorOutcome = {
        code: ErrorMessageCode.CMCAccountInactive,
        customerRef: `some-ref`
      };

      act(() => {
        tree = renderer.create(
          <ComponentToRender
            step={frFailureStep}
            setSubmissionStep={jest.fn()}
            onNext={jest.fn()}
            onInterceptorsRequired={jest.fn()}
            setSubmissionProcess={jest.fn()}
            submissionProcess={false}
          />
        );
      });

      expect(tree.root.findAllByType(BuildErrorForm).length).toBe(1);
    });

    it(`should return LoginFailure placeholder`, () => {
      const frFailureStep = new CMCFRSDK.FRLoginFailure(step);

      act(() => {
        tree = renderer.create(
          <ComponentToRender
            step={frFailureStep}
            setSubmissionStep={jest.fn()}
            onNext={jest.fn()}
            onInterceptorsRequired={jest.fn()}
            setSubmissionProcess={jest.fn()}
            submissionProcess={false}
          />
        );
      });

      expect(tree.toJSON()).toEqual(`Manage Login Failure.`);
    });
  });

  it(`should return undefined placeholder`, () => {
    act(() => {
      tree = renderer.create(
        <ComponentToRender
          step={undefined}
          setSubmissionStep={jest.fn()}
          onNext={jest.fn()}
          onInterceptorsRequired={jest.fn()}
          setSubmissionProcess={jest.fn()}
          submissionProcess={false}
        />
      );
    });

    expect(tree.root.findAllByType(FormLoaderWrapper).length).toBe(1);
  });

  it(`should call setSubmissionStep`, () => {
    const mockSubmissionStep = jest.fn();

    act(() => {
      tree = renderer.create(
        <ComponentToRender
          step={frStep}
          setSubmissionStep={mockSubmissionStep}
          onNext={jest.fn()}
          onInterceptorsRequired={jest.fn()}
          setSubmissionProcess={jest.fn()}
          submissionProcess={false}
        />
      );
    });

    const loginForm = tree.root.findByType(LoginForm);
    expect(loginForm).toBeTruthy();

    act(() => {
      loginForm.props.applyActionCallback();
    });
    expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
  });

  describe(`onNext`, () => {
    let mockDispatch: jest.Mock;

    beforeEach(() => {
      mockDispatch = jest.fn();
      jest.spyOn(CMCFRSDK.TokenStorage, `get`).mockImplementation(() => Promise.resolve({ accessToken }));
      (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    });

    it(`should call onNext when login status is ApiRequestStatus.Success and crc present`, () => {
      const initialClientStore = { ...defaultClientStore };
      initialClientStore.crc = 12_345;
      const testStore = createTestStore(initialClientStore);
      testStore.dispatch(frontendActions.apiRequestSucceeded(SIGNIN_API_RESULT_KEY));

      const onNext = jest.fn();
      act(() => {
        tree = renderer.create(
          <ComponentToRender
            store={testStore}
            onNext={onNext}
            step={frStep}
            setSubmissionStep={jest.fn()}
            onInterceptorsRequired={jest.fn()}
            setSubmissionProcess={jest.fn()}
            submissionProcess={false}
          />
        );
      });

      expect(onNext).toHaveBeenCalledTimes(1);
    });

    it(`should not call onNext when login status is ApiRequestStatus.Success, and crc is falsy`, () => {
      const initialClientStore = { ...defaultClientStore };
      const testStore = createTestStore(initialClientStore);
      testStore.dispatch(frontendActions.apiRequestSucceeded(SIGNIN_API_RESULT_KEY));

      const onNext = jest.fn();
      act(() => {
        tree = renderer.create(
          <ComponentToRender
            store={testStore}
            onNext={onNext}
            step={frStep}
            setSubmissionStep={jest.fn()}
            onInterceptorsRequired={jest.fn()}
            setSubmissionProcess={jest.fn()}
            submissionProcess={false}
          />
        );
      });

      expect(onNext).not.toHaveBeenCalled();
    });

    it(`should not call onNext when login status is ApiRequestStatus.Success, and tree is authenticated`, () => {
      const frSuccessStep = new CMCFRSDK.FRLoginSuccess(step);
      const mockSignInWithToken = jest.fn();
      jest.spyOn(clientActions, `signInWithToken`).mockImplementation(mockSignInWithToken);

      (useDispatch as jest.Mock).mockReturnValue(mockDispatch);

      useFRConfig(JourneyTree.FR_JOURNEY_CHANGE_PASSWORD);

      const onNext = jest.fn();
      act(() => {
        tree = renderer.create(
          <ComponentToRender
            onNext={onNext}
            step={frSuccessStep}
            setSubmissionStep={jest.fn()}
            onInterceptorsRequired={jest.fn()}
            setSubmissionProcess={jest.fn()}
            submissionProcess={false}
          />
        );
      });

      expect(onNext).toHaveBeenCalledTimes(1);
      expect(mockSignInWithToken).not.toHaveBeenCalled();
    });
  });

  describe(`onInterceptorsRequired`, () => {
    let mockDispatch: jest.Mock;

    beforeEach(() => {
      mockDispatch = jest.fn();
      jest.spyOn(CMCFRSDK.TokenStorage, `get`).mockImplementation(() => Promise.resolve({ accessToken }));
      (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    });

    it(`should call onInterceptorsRequired when required (success)`, async () => {
      const onInterceptorsRequired = jest.fn();
      const interceptors = [{ interceptor: `mock-interceptor` } as any];
      const testStore = createTestStore({ ...defaultClientStore, interceptors });
      testStore.dispatch(frontendActions.apiRequestSucceeded(SIGNIN_API_RESULT_KEY));

      act(() => {
        tree = renderer.create(
          <ComponentToRender
            step={frStep}
            setSubmissionStep={jest.fn()}
            onNext={jest.fn()}
            store={testStore}
            onInterceptorsRequired={onInterceptorsRequired}
            setSubmissionProcess={jest.fn()}
            submissionProcess={false}
          />
        );
      });

      act(() => {
        testStore.dispatch(frontendActions.apiRequestReset(SIGNIN_API_RESULT_KEY));
      });

      await new Promise(process.nextTick);

      expect(onInterceptorsRequired).toHaveBeenCalledTimes(1);
    });

    // when user logs in but the next step is change password.
    // after submitting changed password the stored user details should be updated as well.
    // when calling interceptors, the new, updated user password needs to be passed.
    it(`should call onInterceptorsRequired with updated password`, async () => {
      useFRConfig(JourneyTree.FR_JOURNEY_LOGIN);

      const changePasswordEnterNewStep: CMCFRSDK.Step = {
        callbacks: [...newPassCallbacks],
        stage: ScreenStage.ChangePasswordEnterNew
      };

      const onInterceptorsRequired = jest.fn();
      const interceptors = [{ interceptor: `mock-interceptor` } as any];
      const testStore = createTestStore({ ...defaultClientStore, interceptors });
      testStore.dispatch(frontendActions.apiRequestSucceeded(SIGNIN_API_RESULT_KEY));

      jest.spyOn(CMCFRSDK.TokenStorage, `get`).mockImplementation(() => Promise.resolve({ accessToken }));

      const mockSignInWithToken = jest.fn();
      jest.spyOn(clientActions, `signInWithToken`).mockImplementation(mockSignInWithToken);

      const mockSetSubmissionStep = jest.fn();

      (useDispatch as jest.Mock).mockReturnValue(mockDispatch);

      const changePasswordEnterNewFRStep = new CMCFRSDK.FRStep(changePasswordEnterNewStep);

      act(() => {
        tree = renderer.create(
          <ComponentToRender
            store={testStore}
            step={changePasswordEnterNewFRStep}
            setSubmissionStep={mockSetSubmissionStep}
            onNext={jest.fn()}
            onInterceptorsRequired={onInterceptorsRequired}
            setSubmissionProcess={jest.fn()}
            submissionProcess={false}
          />
        );
      });

      const buildStepForm = tree.root.findByType(BuildStepForm);
      expect(buildStepForm).toBeTruthy();

      const updatedPass = `some-updated-pass`;
      changePasswordEnterNewFRStep.setCallbackValue(CMCFRSDK.CallbackType.ValidatedCreatePasswordCallback, updatedPass);

      act(() => {
        buildStepForm.props.setSubmissionStep(changePasswordEnterNewFRStep);
      });

      await act(async () => {
        testStore.dispatch(frontendActions.apiRequestReset(SIGNIN_API_RESULT_KEY));
      });

      expect(onInterceptorsRequired).toHaveBeenCalledTimes(1);
      expect(onInterceptorsRequired.mock.calls[0][0].password).toEqual(updatedPass);
    });

    it(`should call onInterceptorsRequired when required, but not found (fail)`, async () => {
      const onInterceptorsRequired = jest.fn();
      const testStore = createTestStore();
      testStore.dispatch(frontendActions.apiRequestFailed({ apiRequest: SIGNIN_API_RESULT_KEY, errorCode: LoginApiModelResult.InterceptorRequired }));

      act(() => {
        tree = renderer.create(
          <ComponentToRender
            step={frStep}
            setSubmissionStep={jest.fn()}
            onNext={jest.fn()}
            store={testStore}
            onInterceptorsRequired={onInterceptorsRequired}
            setSubmissionProcess={jest.fn()}
            submissionProcess={false}
          />
        );
      });

      act(() => {
        testStore.dispatch(frontendActions.apiRequestReset(SIGNIN_API_RESULT_KEY));
      });

      await new Promise(process.nextTick);

      expect(onInterceptorsRequired).toHaveBeenCalledTimes(1);
    });
  });

  it(`should not setSubmissionProcess when 'skipLoad' is set to true`, () => {
    const initialClientStore = { ...defaultClientStore };
    const testStore = createTestStore(initialClientStore);
    const mockSetSubmissionProcess = jest.fn();

    const confirmationCallBack = {
      output: [
        { name: `prompt`, value: `` },
        { name: `messageType`, value: 0 },
        { name: `options`, value: [`Cancel`] },
        { name: `optionType`, value: -1 },
        { name: `defaultOption`, value: 0 }
      ],
      type: CMCFRSDK.CallbackType.ConfirmationCallback
    };

    const pollingCallback = {
      output: [
        { name: `waitTime`, value: `5000` },
        {
          name: `message`,
          value: `Waiting for response...`
        }
      ],
      type: CMCFRSDK.CallbackType.PollingWaitCallback
    };

    const callbacks = JSON.parse(JSON.stringify([confirmationCallBack, pollingCallback]));
    const pollingWaitStep: CMCFRSDK.Step = {
      callbacks,
      stage: ScreenStage.RequestMFAPushPollingWait
    };

    const pollingWaitFRStep = new CMCFRSDK.FRStep(pollingWaitStep);

    act(() => {
      tree = renderer.create(
        <ComponentToRender
          store={testStore}
          onNext={jest.fn()}
          step={pollingWaitFRStep}
          setSubmissionStep={jest.fn()}
          onInterceptorsRequired={jest.fn()}
          setSubmissionProcess={mockSetSubmissionProcess}
          submissionProcess={false}
        />
      );
    });

    const buildStepForm = tree.root.findByType(BuildStepForm);
    expect(buildStepForm).toBeTruthy();

    buildStepForm.props.setSubmissionStep({ step: pollingWaitFRStep, props: { skipLoad: true } });

    expect(mockSetSubmissionProcess).not.toHaveBeenCalled();
  });
});
