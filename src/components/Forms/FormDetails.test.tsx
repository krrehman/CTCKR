import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ErrorMessageCode, JourneyTree, ScreenStage, useFRConfig, CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { LoginForm } from './LoginForm';
import { ProfileCollectorForm } from './ProfileCollectorForm';
import { RegisterMFAAuthOptionsForm } from '../Forms/RegisterMFAAuthOptionsForm';
import { StepChoice } from '../../constants/enums';
import { InnerOTPDecisionForm } from '../Forms/InnerOTPDecisionForm';
import { RegisterMFAAnotherDeviceForm } from '../Forms/RegisterMFAAnotherDeviceForm';
import { RegisterMFAAuthAppForm } from '../Forms/RegisterMFAAuthAppForm';
import { RegisterMFAPushRegistrationForm } from '../Forms/RegisterMFAPushRegistrationForm';
import { RegisterMFARecoveryCodesForm } from '../Forms/RegisterMFARecoveryCodesForm';
import { RequestMFAPushPollingWaitForm } from '../Forms/RequestMFAPushPollingWaitForm';
import { RequestMFAResultForm } from './RequestMFAResultForm';
import { RequestMFARecoveryCodesForm } from './RequestMFARecoveryCodesForm';
import { RequestMFAAuthOptionsForm } from './RequestMFAAuthOptionsForm';
import { RegisterMFAStartForm } from './RegisterMFAStartForm';
import { ForgotPasswordUsernameForm } from './ForgotPasswordUsernameForm';
import { ChangePasswordEnterNewForm } from './ChangePasswordEnterNewForm';
import { ForgotUsernameDetailsForm } from './ForgotUsernameDetailsForm';
import { ChangeUsernameEnterForm } from './ChangeUsernameEnterForm';
import { getErrorFormDetails, getFormDetails, IFormDetails } from './FormDetails';
import { RetryActionForm } from './RetryActionForm';
import { ReCaptchaForm } from './ReCaptchaForm';
import { InnerOTPResendOptionForm } from './InnerOTPResendOptionForm';
import { RequestMFARecoveryCodesChoiceForm } from './RequestMFARecoveryCodesChoiceForm';
import { LoginRetryForm } from './LoginRetryForm';
import { InactiveAccountForm } from './InactiveAccountForm';
import { ForgotUsernameEmailResultForm } from './ForgotUsernameEmailResultForm';
import { RegisterMFAEnterEmailForm } from './RegisterMFAEnterEmailForm';
import { LockedAccountForm } from './LockedAccountForm';
import { ChangePasswordEnterCurrentForm } from './ChangePasswordEnterCurrentForm';
import { DisableMFAConfirmForm } from './DisableMFAConfirmForm';

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

const deviceProfileCallback = {
  input: [{ name: `IDToken1`, value: `` }],
  output: [
    { name: `location`, value: true },
    { name: `metadata`, value: true }
  ],
  type: CMCFRSDK.CallbackType.DeviceProfileCallback
};

const choiceCallback = {
  input: [{ name: `IDToken1`, value: `` }],
  output: [
    { name: `choices`, value: [`email`, `push`, `webauthn`] },
    { name: `defaultChoice`, value: 0 }
  ],
  type: CMCFRSDK.CallbackType.ChoiceCallback
};

const mfaStartChoiceCallback = {
  input: [{ name: `IDToken1`, value: `` }],
  output: [
    { name: `choices`, value: [`ok`, `activate`] },
    { name: `defaultChoice`, value: 1 }
  ],
  type: CMCFRSDK.CallbackType.ChoiceCallback
};

const textOutputCallback = {
  output: [
    { name: `message`, value: `Do you want to register another device?` },
    { name: `messageType`, value: 0 }
  ],
  type: CMCFRSDK.CallbackType.TextOutputCallback
};

const confirmationCallback = {
  output: [
    { name: `prompt`, value: `` },
    { name: `messageType`, value: 0 },
    { name: `options`, value: [`Yes`, `No`] },
    { name: `optionType`, value: -1 },
    { name: `defaultOption`, value: 1 }
  ],
  type: CMCFRSDK.CallbackType.ConfirmationCallback
};

const hiddenValueCallback = {
  input: [{ name: `IDToken3`, value: `mfaDeviceRegistration` }],
  output: [
    {
      name: `value`,
      value: `pushauth://push/forgerock:1981?l=YW1sYmNvb2tpZT0wMQ&issuer=Rm9yZ2VSb2Nr&m=REGISTER:33c50052-6a03-4847-93c6-52853a6e4a421670203387011&s=i0c_a5y4mze_nv2ze8sv86Q1faB0dwcCAyM6wyU5x3w&c=ncDLRReNA_zvG37CSvjKXqI80FQiGTy1o5TrQXnP8bY&r=aHR0cHM6Ly9vcGVuYW0tY21jbWFya2V0c3N0by1jbWNtYS1kZXYuaWQuZm9yZ2Vyb2NrLmlvOjQ0My9hbS9qc29uL2FscGhhL3B1c2gvc25zL21lc3NhZ2U_X2FjdGlvbj1yZWdpc3Rlcg&a=aHR0cHM6Ly9vcGVuYW0tY21jbWFya2V0c3N0by1jbWNtYS1kZXYuaWQuZm9yZ2Vyb2NrLmlvOjQ0My9hbS9qc29uL2FscGhhL3B1c2gvc25zL21lc3NhZ2U_X2FjdGlvbj1hdXRoZW50aWNhdGU&b=032b75`
    },
    { name: `id`, value: `mfaDeviceRegistration` }
  ],
  type: CMCFRSDK.CallbackType.HiddenValueCallback
};

const pollingWaitCallback = {
  output: [
    { name: `waitTime`, value: `5000` },
    {
      name: `message`,
      value: `Waiting for response...`
    }
  ],
  type: CMCFRSDK.CallbackType.PollingWaitCallback
};

const reCaptchaCallback = {
  input: [{ name: `IDToken1`, value: `` }],
  output: [
    { name: `recaptchaSiteKey`, value: `mock-recaptcha-key` },
    { name: `captchaApiUri`, value: `https://www.google.com/recaptcha/api.js` },
    { name: `captchaDivClass`, value: `g-recaptcha` },
    { name: `reCaptchaV3`, value: true }
  ],
  type: CMCFRSDK.CallbackType.ReCaptchaCallback
};

const stringAttributeInputCallback = {
  input: [
    { name: `IDToken2`, value: `` },
    { name: `IDToken1validateOnly`, value: false }
  ],
  output: [
    { name: `name`, value: `userName` },
    { name: `prompt`, value: `Username` },
    { name: `required`, value: true },
    { name: 'policies', value: {} },
    { name: `failedPolicies`, value: [] },
    { name: `validateOnly`, value: false },
    { name: `value`, value: `` }
  ],
  type: CMCFRSDK.CallbackType.StringAttributeInputCallback
};

const validatedCreatePasswordCallback = {
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
};

const validateCreateUsernameCallback = {
  input: [{ name: `IDToken1`, value: ``, IDToken1validateOnly: false }],
  output: [
    {
      name: `policies`,
      value: {
        conditionalPolicies: undefined,
        fallbackPolicies: undefined,
        name: `userName`,
        policies: [
          { policyId: `required`, policyRequirements: [`REQUIRED`] },
          { policyId: `valid-type`, policyRequirements: [`VALID_TYPE`], params: { types: [`string`] } },
          { policyId: `valid-username`, policyRequirements: [`VALID_ISERNAME`] },
          { policyId: `cannot-contain-characters`, policyRequirements: [`CANNOT_CONTAIN_CHARACTERS`], params: { forbiddenChars: `/*|` } },
          { policyId: `minimum-length`, policyRequirements: [`MIN_LENGTH`], params: { minLength: 1 } },
          { policyId: `maximum-length`, policyRequirements: [`MAX_LENGTH`], params: { maxLength: 255 } }
        ]
      }
    },
    { name: `failedPolicies`, value: [] },
    { name: `validateOnly`, value: false },
    { name: `prompt`, value: `Username` }
  ],
  type: CMCFRSDK.CallbackType.ValidatedCreateUsernameCallback
};

interface IComponentToRender {
  content: JSX.Element;
}

const loginStep: CMCFRSDK.Step = {
  callbacks: [nameCallback, passwordCallback],
  stage: ScreenStage.Login
};

describe(`FormDetails`, () => {
  let tree: ReturnType<typeof renderer.create>;
  let frStep: CMCFRSDK.FRStep;
  let formDetails: IFormDetails;
  let tfn: any;
  const accessToken = `some-access-token`;

  const ComponentToRender = ({ content }: IComponentToRender) => (
    <ThemeProvider theme={themeCmcLight}>
      <BrowserRouter>
        <>{content}</>
      </BrowserRouter>
    </ThemeProvider>
  );

  beforeEach(() => {
    useFRConfig(JourneyTree.FR_JOURNEY_LOGIN);
    jest.spyOn(CMCFRSDK.TokenStorage, `get`).mockImplementation(() => Promise.resolve({ accessToken }));
    frStep = new CMCFRSDK.FRStep(loginStep);
    tfn = jest.fn((t: string) => t);
  });

  it(`should match snapshot`, () => {
    formDetails = getFormDetails({ previousStep: undefined, step: frStep, setSubmissionStep: jest.fn(), stage: ScreenStage.Login, t: tfn });
    expect(renderer.create(<ComponentToRender content={formDetails.content} />).toJSON()).toMatchSnapshot();
  });

  it(`should return unknown step placeholder`, () => {
    const unhandledCallbacks = JSON.parse(JSON.stringify([{ ...nameCallback }, { ...passwordCallback }]));
    unhandledCallbacks[0].type = CMCFRSDK.CallbackType.MetadataCallback;
    unhandledCallbacks[1].type = CMCFRSDK.CallbackType.MetadataCallback;
    const unhandledCallbackStep = { callbacks: unhandledCallbacks };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(unhandledCallbackStep),
      setSubmissionStep: jest.fn(),
      stage: ScreenStage.Unknown,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    expect(tree.toJSON()).toEqual(`unknown-step`);
  });

  it(`should call render with LoginForm when stage = ScreenStage.Login`, () => {
    const mockSubmissionStep = jest.fn();

    formDetails = getFormDetails({
      previousStep: undefined,
      step: frStep,
      setSubmissionStep: mockSubmissionStep,
      stage: ScreenStage.Login,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const loginForm = tree.root.findByType(LoginForm);
    expect(loginForm).toBeTruthy();

    loginForm.props.applyActionCallback();
    expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
  });

  it(`should call render with LoginRetryForm when stage = ScreenStage.LoginRetry`, () => {
    const mockSubmissionStep = jest.fn();
    const loginRetryCallback = JSON.parse(JSON.stringify({ ...choiceCallback }));
    loginRetryCallback.output = [
      { name: `prompt`, value: `Invalid Credentials. Please try again.` },
      { name: `choices`, value: [`retry`, `ok`] },
      { name: `defaultChoice`, value: 0 }
    ];
    const callbacks = [loginRetryCallback];
    const loginRetryStep = { callbacks, stage: ScreenStage.LoginRetry };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(loginRetryStep),
      setSubmissionStep: mockSubmissionStep,
      stage: ScreenStage.LoginRetry,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const loginRetryForm = tree.root.findByType(LoginRetryForm);
    expect(loginRetryForm).toBeTruthy();

    expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
  });

  it(`should render with ProfileCollectorForm when stage = ScreenStage.RegisterMFAProfileCollector`, () => {
    const mockGetProfile = jest.fn(() => Promise.resolve({} as any));
    jest.spyOn(CMCFRSDK.FRDevice.prototype, `getProfile`).mockImplementation(mockGetProfile);

    const callbacks = JSON.parse(JSON.stringify([{ ...deviceProfileCallback }]));
    const registerMFAProfileCollectorStep = { callbacks, stage: ScreenStage.RegisterMFAProfileCollector };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(registerMFAProfileCollectorStep),
      setSubmissionStep: jest.fn(),
      stage: ScreenStage.RegisterMFAProfileCollector,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const profileCollectorForm = tree.root.findByType(ProfileCollectorForm);
    expect(profileCollectorForm).toBeTruthy();
  });

  it(`should render with ProfileCollectorForm when stage = ScreenStage.MFARiskCheckProfileCollector`, () => {
    const mockGetProfile = jest.fn(() => Promise.resolve({} as any));
    jest.spyOn(CMCFRSDK.FRDevice.prototype, `getProfile`).mockImplementation(mockGetProfile);

    const callbacks = JSON.parse(JSON.stringify([{ ...deviceProfileCallback }]));
    const mfaRiskCheckProfileCollectorStep = { callbacks, stage: ScreenStage.MFARiskCheckProfileCollector };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(mfaRiskCheckProfileCollectorStep),
      setSubmissionStep: jest.fn(),
      stage: ScreenStage.MFARiskCheckProfileCollector,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const profileCollectorForm = tree.root.findByType(ProfileCollectorForm);
    expect(profileCollectorForm).toBeTruthy();
  });

  it(`should render with ProfileCollectorForm when stage = ScreenStage.StepupProfileCollector`, () => {
    const mockGetProfile = jest.fn(() => Promise.resolve({} as any));
    jest.spyOn(CMCFRSDK.FRDevice.prototype, `getProfile`).mockImplementation(mockGetProfile);

    const callbacks = JSON.parse(JSON.stringify([{ ...deviceProfileCallback }]));
    const stepupProfileCollectorProfileCollectorStep = { callbacks, stage: ScreenStage.StepupProfileCollector };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(stepupProfileCollectorProfileCollectorStep),
      setSubmissionStep: jest.fn(),
      stage: ScreenStage.StepupProfileCollector,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const profileCollectorForm = tree.root.findByType(ProfileCollectorForm);
    expect(profileCollectorForm).toBeTruthy();
  });

  it(`should render with RegisterMFAAuthOptionsForm when stage = ScreenStage.RegisterMFAAuthOptions`, () => {
    const mockSubmissionStep = jest.fn();
    const callbacks = JSON.parse(JSON.stringify([{ ...choiceCallback }]));
    const registerMFAAuthOptionsStep = { callbacks, stage: ScreenStage.RegisterMFAAuthOptions };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(registerMFAAuthOptionsStep),
      setSubmissionStep: mockSubmissionStep,
      stage: ScreenStage.RegisterMFAAuthOptions,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const registerMFAAuthOptionsForm = tree.root.findByType(RegisterMFAAuthOptionsForm);
    expect(registerMFAAuthOptionsForm).toBeTruthy();

    registerMFAAuthOptionsForm.props.applyActionCallback();
    expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
  });
  it(`should render with RegisterMFAEnterEmailForm when stage = ScreenStage.RegisterMFAEnterEmail`, () => {
    const mockSubmissionStep = jest.fn();
    const callbacks = JSON.parse(JSON.stringify([{ ...stringAttributeInputCallback }]));
    const registerMFAEnterEmailStep = { callbacks, stage: ScreenStage.RegisterMFAEnterEmail };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(registerMFAEnterEmailStep),
      setSubmissionStep: mockSubmissionStep,
      stage: ScreenStage.RegisterMFAEnterEmail,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const registerMFAEnterEmailForm = tree.root.findByType(RegisterMFAEnterEmailForm);
    expect(registerMFAEnterEmailForm).toBeTruthy();

    registerMFAEnterEmailForm.props.applyActionCallback();
    expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
  });

  it(`should render with InnerOTPDecisionForm when stage = ScreenStage.InnerOTPDecision`, () => {
    const mockSubmissionStep = jest.fn();
    const callbacks = JSON.parse(JSON.stringify([{ ...nameCallback }, { ...passwordCallback }]));
    callbacks.shift();
    const innerOTPDecisionStep = { callbacks, stage: ScreenStage.InnerOTPDecision };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(innerOTPDecisionStep),
      setSubmissionStep: mockSubmissionStep,
      stage: ScreenStage.InnerOTPDecision,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const innerOTPDecisionForm = tree.root.findByType(InnerOTPDecisionForm);
    expect(innerOTPDecisionForm).toBeTruthy();

    innerOTPDecisionForm.props.applyActionCallback();
    expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
  });

  it(`should render with RegisterMFAAnotherDeviceForm when stage = ScreenStage.RegisterMFAAnotherDevice`, () => {
    const mockSubmissionStep = jest.fn();
    const callbacks = JSON.parse(JSON.stringify([{ ...textOutputCallback }, { ...confirmationCallback }]));
    const registerMFAAnotherDeviceStep = { callbacks, stage: ScreenStage.RegisterMFAAnotherDevice };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(registerMFAAnotherDeviceStep),
      setSubmissionStep: mockSubmissionStep,
      stage: ScreenStage.RegisterMFAAnotherDevice,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const registerMFAAnotherDeviceForm = tree.root.findByType(RegisterMFAAnotherDeviceForm);
    expect(registerMFAAnotherDeviceForm).toBeTruthy();

    registerMFAAnotherDeviceForm.props.applyActionCallback();
    expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
  });

  it(`should render with DisableMFAConfirmForm when stage = ScreenStage.DisableMFAConfirm`, () => {
    const mockSubmissionStep = jest.fn();
    const callbacks = JSON.parse(JSON.stringify([{ ...choiceCallback }]));
    callbacks[0].input[0].value = 1;
    callbacks[0].output[0].value = [`Confirm`, `Keep`];
    const disableMFAConfirmFormStep = { callbacks, stage: ScreenStage.DisableMFAConfirm };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(disableMFAConfirmFormStep),
      setSubmissionStep: mockSubmissionStep,
      stage: ScreenStage.DisableMFAConfirm,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const disableMFAConfirmForm = tree.root.findByType(DisableMFAConfirmForm);
    expect(disableMFAConfirmForm).toBeTruthy();

    disableMFAConfirmForm.props.applyActionCallback();
    expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
  });

  it(`should render with RegisterMFAAuthAppForm when stage = ScreenStage.RegisterMFAAuthApp`, () => {
    const mockSubmissionStep = jest.fn();
    const callbacks = JSON.parse(JSON.stringify([{ ...textOutputCallback }, { ...confirmationCallback }]));
    const registerMFAAuthAppStep = { callbacks, stage: ScreenStage.RegisterMFAAuthApp };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(registerMFAAuthAppStep),
      setSubmissionStep: mockSubmissionStep,
      stage: ScreenStage.RegisterMFAAuthApp,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const registerMFAAuthAppForm = tree.root.findByType(RegisterMFAAuthAppForm);
    expect(registerMFAAuthAppForm).toBeTruthy();

    registerMFAAuthAppForm.props.applyActionCallback();
    expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
  });

  it(`should render with RegisterMFAPushRegistrationForm when stage = ScreenStage.RegisterMFAPushRegistration`, () => {
    const mockSubmissionStep = jest.fn();
    const callbacks = JSON.parse(
      JSON.stringify([{ ...textOutputCallback }, { ...textOutputCallback }, { ...hiddenValueCallback }, { ...pollingWaitCallback }])
    );
    const registerMFAPushRegistrationStep = { callbacks, stage: ScreenStage.RegisterMFAPushRegistration };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(registerMFAPushRegistrationStep),
      setSubmissionStep: mockSubmissionStep,
      stage: ScreenStage.RegisterMFAPushRegistration,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const registerMFAPushRegistrationForm = tree.root.findByType(RegisterMFAPushRegistrationForm);
    expect(registerMFAPushRegistrationForm).toBeTruthy();

    registerMFAPushRegistrationForm.props.applyActionCallback();
    expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
  });

  it(`should render with RegisterMFARecoveryCodesForm when stage = ScreenStage.RegisterMFARecoveryCodes`, () => {
    const mockSubmissionStep = jest.fn();
    const callbacks = JSON.parse(JSON.stringify([{ ...textOutputCallback }]));
    const registerMFARecoveryCodesStep = { callbacks, stage: ScreenStage.RegisterMFARecoveryCodes };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(registerMFARecoveryCodesStep),
      setSubmissionStep: mockSubmissionStep,
      stage: ScreenStage.RegisterMFARecoveryCodes,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const registerMFARecoveryCodesForm = tree.root.findByType(RegisterMFARecoveryCodesForm);
    expect(registerMFARecoveryCodesForm).toBeTruthy();

    registerMFARecoveryCodesForm.props.applyActionCallback();
    expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
  });

  it(`should render with RequestMFAPushPollingWaitForm when stage = ScreenStage.RequestMFAPushPollingWait`, () => {
    const mockSubmissionStep = jest.fn();
    const callbacks = JSON.parse(JSON.stringify([{ ...pollingWaitCallback }, { ...confirmationCallback }]));
    const requestMFAPushPollingWaitStep = { callbacks, stage: ScreenStage.RequestMFAPushPollingWait };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(requestMFAPushPollingWaitStep),
      setSubmissionStep: mockSubmissionStep,
      stage: ScreenStage.RequestMFAPushPollingWait,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const requestMFAPushPollingWaitForm = tree.root.findByType(RequestMFAPushPollingWaitForm);
    expect(requestMFAPushPollingWaitForm).toBeTruthy();

    requestMFAPushPollingWaitForm.props.applyActionCallback();
    expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
  });

  it(`should render with RequestMFAResultForm when stage = ScreenStage.RequestMFAOk`, () => {
    const mockSubmissionStep = jest.fn();
    const callbacks = JSON.parse(JSON.stringify([{ ...choiceCallback }]));
    const requestMFAResultStep = { callbacks, stage: ScreenStage.RequestMFAOk };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(requestMFAResultStep),
      setSubmissionStep: mockSubmissionStep,
      stage: ScreenStage.RequestMFAOk,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const requestMFAResultForm = tree.root.findByType(RequestMFAResultForm);
    expect(requestMFAResultForm).toBeTruthy();

    requestMFAResultForm.props.applyActionCallback();
    expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
  });

  it(`should render with RequestMFAResultForm when stage = ScreenStage.RequestMFAFail`, () => {
    const mockSubmissionStep = jest.fn();
    const callbacks = JSON.parse(JSON.stringify([{ ...choiceCallback }]));
    const requestMFAResultStep = { callbacks, stage: ScreenStage.RequestMFAFail };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(requestMFAResultStep),
      setSubmissionStep: mockSubmissionStep,
      stage: ScreenStage.RequestMFAFail,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const requestMFAResultForm = tree.root.findByType(RequestMFAResultForm);
    expect(requestMFAResultForm).toBeTruthy();

    requestMFAResultForm.props.applyActionCallback();
    expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
  });

  it(`should render with RequestMFARecoveryCodesForm when stage = ScreenStage.RequestMFARecoveryCodes`, () => {
    const mockSubmissionStep = jest.fn();
    const callbacks = JSON.parse(JSON.stringify([{ ...nameCallback }]));
    const requestMFARecoveryCodesStep = { callbacks, stage: ScreenStage.RequestMFARecoveryCodes };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(requestMFARecoveryCodesStep),
      setSubmissionStep: mockSubmissionStep,
      stage: ScreenStage.RequestMFARecoveryCodes,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const mequestMFARecoveryCodesForm = tree.root.findByType(RequestMFARecoveryCodesForm);
    expect(mequestMFARecoveryCodesForm).toBeTruthy();

    mequestMFARecoveryCodesForm.props.applyActionCallback();
    expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
  });

  it(`should render with RequestMFAAuthOptionsForm when stage = ScreenStage.RequestMFAOptions`, () => {
    const mockSubmissionStep = jest.fn();
    const callbacks = JSON.parse(JSON.stringify([{ ...choiceCallback }]));
    const requestMFAOptionsStep = { callbacks, stage: ScreenStage.RequestMFAOptions };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(requestMFAOptionsStep),
      setSubmissionStep: mockSubmissionStep,
      stage: ScreenStage.RequestMFAOptions,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const requestMFAAuthOptionsForm = tree.root.findByType(RequestMFAAuthOptionsForm);
    expect(requestMFAAuthOptionsForm).toBeTruthy();

    requestMFAAuthOptionsForm.props.applyActionCallback();
    expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
  });

  it(`should render with RegisterMFAStartForm when stage = ScreenStage.RegisterMFAStart`, () => {
    const mockSubmissionStep = jest.fn();
    const callbacks = JSON.parse(JSON.stringify([{ ...mfaStartChoiceCallback }]));
    const registerMfaStartStep = { callbacks, stage: ScreenStage.RegisterMFAStart };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(registerMfaStartStep),
      setSubmissionStep: mockSubmissionStep,
      stage: ScreenStage.RegisterMFAStart,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const registerMfaStartForm = tree.root.findByType(RegisterMFAStartForm);
    expect(registerMfaStartForm).toBeTruthy();

    expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
  });

  it(`should render with ForgotPasswordUsernameForm when stage = ScreenStage.ForgotPasswordUsername`, () => {
    const mockSubmissionStep = jest.fn();
    const callbacks = JSON.parse(JSON.stringify([{ ...stringAttributeInputCallback }]));
    const forgotPasswordUsernameStep = { callbacks, stage: ScreenStage.ForgotPasswordUsername };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(forgotPasswordUsernameStep),
      setSubmissionStep: mockSubmissionStep,
      stage: ScreenStage.ForgotPasswordUsername,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const forgotPasswordUsernameForm = tree.root.findByType(ForgotPasswordUsernameForm);
    expect(forgotPasswordUsernameForm).toBeTruthy();

    forgotPasswordUsernameForm.props.applyActionCallback();
    expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
  });

  it(`should render with ChangePasswordEnterNewForm when stage = ScreenStage.ChangePasswordEnterNew`, () => {
    const mockSubmissionStep = jest.fn();
    const callbacks = JSON.parse(JSON.stringify([{ ...validatedCreatePasswordCallback }]));
    const changePasswordEnterNewStep = { callbacks, stage: ScreenStage.ChangePasswordEnterNew };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(changePasswordEnterNewStep),
      setSubmissionStep: mockSubmissionStep,
      stage: ScreenStage.ChangePasswordEnterNew,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const changePasswordEnterNewForm = tree.root.findByType(ChangePasswordEnterNewForm);
    expect(changePasswordEnterNewForm).toBeTruthy();

    changePasswordEnterNewForm.props.applyActionCallback();
    expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
  });

  it(`should render with ChangePasswordEnterCurrentForm when stage = ScreenStage.ChangePasswordCurrentPassword`, () => {
    const mockSubmissionStep = jest.fn();
    const callbacks = JSON.parse(JSON.stringify([{ ...passwordCallback }]));
    const changePasswordEnterCurrentStep = { callbacks, stage: ScreenStage.ChangePasswordCurrentPassword };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(changePasswordEnterCurrentStep),
      setSubmissionStep: mockSubmissionStep,
      stage: ScreenStage.ChangePasswordCurrentPassword,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const changePasswordEnterCurrentForm = tree.root.findByType(ChangePasswordEnterCurrentForm);
    expect(changePasswordEnterCurrentForm).toBeTruthy();

    changePasswordEnterCurrentForm.props.applyActionCallback();
    expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
  });

  describe(`ForgotUsernameDetailsForm`, () => {
    const callback1 = JSON.parse(JSON.stringify({ ...stringAttributeInputCallback }));
    const callback2 = JSON.parse(JSON.stringify({ ...stringAttributeInputCallback }));
    const callback3 = JSON.parse(JSON.stringify({ ...stringAttributeInputCallback }));

    callback1.input[0].name = `IDToken1`;
    callback1.input[0].value = ``;
    callback1.input[1].name = `IDToken1validateOnly`;
    callback1.input[1].value = false;
    callback1.output[0].name = `name`;
    callback1.output[0].value = `givenName`;
    callback1.output[1].name = `prompt`;
    callback1.output[1].value = `First Name`;

    callback2.input[0].name = `IDToken2`;
    callback2.input[0].value = ``;
    callback2.input[1].name = `IDToken2validateOnly`;
    callback2.input[1].value = false;
    callback2.output[0].name = `name`;
    callback2.output[0].value = `sn`;
    callback2.output[1].name = `prompt`;
    callback2.output[1].value = `Last Name`;

    callback2.input[0].name = `IDToken2`;
    callback2.input[0].value = ``;
    callback2.input[1].name = `IDToken2validateOnly`;
    callback2.input[1].value = false;
    callback2.output[0].name = `name`;
    callback2.output[0].value = `sn`;
    callback2.output[1].name = `prompt`;
    callback2.output[1].value = `Last Name`;

    callback3.input[0].name = `IDToken2`;
    callback3.input[0].value = ``;
    callback3.input[1].name = `IDToken3validateOnly`;
    callback3.input[1].value = false;
    callback3.output[0].name = `name`;
    callback3.output[0].value = `frIndexedString3`;
    callback3.output[1].name = `prompt`;
    callback3.output[1].value = `Date Of Birth`;

    it(`should render with ForgotUsernameDetailsForm when stage = ScreenStage.ForgotUsernameDetails`, () => {
      const mockSubmissionStep = jest.fn();
      const callbacks = [callback1, callback2, callback3];
      const forgotUsernameDetailsStep = { callbacks, stage: ScreenStage.ForgotUsernameDetails };

      formDetails = getFormDetails({
        previousStep: undefined,
        step: new CMCFRSDK.FRStep(forgotUsernameDetailsStep),
        setSubmissionStep: mockSubmissionStep,
        stage: ScreenStage.ForgotUsernameDetails,
        t: tfn
      });

      act(() => {
        tree = renderer.create(<ComponentToRender content={formDetails.content} />);
      });

      const forgotUsernameDetailsForm = tree.root.findByType(ForgotUsernameDetailsForm);
      expect(forgotUsernameDetailsForm).toBeTruthy();

      forgotUsernameDetailsForm.props.applyActionCallback();
      expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
    });
  });

  it(`should render with ForgotUsernameEmailResultForm when stage = ScreenStage.ForgotUsernameEmailOk`, () => {
    const mockSubmissionStep = jest.fn();
    const callbacks = JSON.parse(JSON.stringify([{ ...choiceCallback }]));
    callbacks[0].output = [
      { name: `choices`, value: [`resend`, `backToLogin`] },
      { name: `defaultChoice`, value: 1 }
    ];
    const forgotUsernameEmailOkStep = { callbacks, stage: ScreenStage.ForgotUsernameEmailOk };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(forgotUsernameEmailOkStep),
      setSubmissionStep: mockSubmissionStep,
      stage: ScreenStage.ForgotUsernameEmailOk,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const forgotUsernameEmailResultForm = tree.root.findByType(ForgotUsernameEmailResultForm);
    expect(forgotUsernameEmailResultForm).toBeTruthy();

    forgotUsernameEmailResultForm.props.applyActionCallback();
    expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
  });
  it(`should render with ForgotUsernameEmailResultForm when stage = ScreenStage.ForgotUsernameEmailFail`, () => {
    const mockSubmissionStep = jest.fn();
    const callbacks = JSON.parse(JSON.stringify([{ ...choiceCallback }]));
    callbacks[0].output = [
      { name: `choices`, value: [`resend`, `backToLogin`] },
      { name: `defaultChoice`, value: 1 }
    ];
    const forgotUsernameEmailFailStep = { callbacks, stage: ScreenStage.ForgotUsernameEmailFail };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(forgotUsernameEmailFailStep),
      setSubmissionStep: mockSubmissionStep,
      stage: ScreenStage.ForgotUsernameEmailFail,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const forgotUsernameEmailResultFailedForm = tree.root.findByType(ForgotUsernameEmailResultForm);
    expect(forgotUsernameEmailResultFailedForm).toBeTruthy();

    forgotUsernameEmailResultFailedForm.props.applyActionCallback();
    expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
  });

  it(`should render with ChangeUsernameEnterForm when stage = ScreenStage.ChangeUsernameEnter`, () => {
    const mockSubmissionStep = jest.fn();
    const callbacks = JSON.parse(JSON.stringify([{ ...validateCreateUsernameCallback }]));
    const changeUsernameEnterStep = { callbacks, stage: ScreenStage.ChangeUsernameEnter };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(changeUsernameEnterStep),
      setSubmissionStep: mockSubmissionStep,
      stage: ScreenStage.ChangeUsernameEnter,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const changeUsernameEnterForm = tree.root.findByType(ChangeUsernameEnterForm);
    expect(changeUsernameEnterForm).toBeTruthy();

    changeUsernameEnterForm.props.applyActionCallback();
    expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
  });

  it(`should render with RequestMFARecoveryCodesChoiceForm when stage = ScreenStage.RequestMFARecoveryCodesChoice`, () => {
    const requestMFARecoveryCodesChoiceCallback = { ...mfaStartChoiceCallback };
    requestMFARecoveryCodesChoiceCallback.output[0].value = [`recovery`, `exit`];
    const mockSubmissionStep = jest.fn();
    const callbacks = JSON.parse(JSON.stringify([{ ...requestMFARecoveryCodesChoiceCallback }]));
    const requestMFARecoveryCodesChoiceStep = { callbacks, stage: ScreenStage.RequestMFARecoveryCodesChoice };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(requestMFARecoveryCodesChoiceStep),
      setSubmissionStep: mockSubmissionStep,
      stage: ScreenStage.RequestMFARecoveryCodesChoice,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const requestMFARecoveryCodesChoiceForm = tree.root.findByType(RequestMFARecoveryCodesChoiceForm);
    expect(requestMFARecoveryCodesChoiceForm).toBeTruthy();

    requestMFARecoveryCodesChoiceForm.props.applyActionCallback();
    expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
  });

  // SKIP STEP ACTIONS
  it(`should render with RetryActionForm when stage = ScreenStage.ChangePasswordEnterNewRetry`, () => {
    const mockSubmissionStep = jest.fn();
    const callbacks = JSON.parse(JSON.stringify([{ ...choiceCallback }]));
    callbacks[0].output = [
      { name: `choices`, value: [StepChoice.ok, StepChoice.retry] },
      { name: `defaultChoice`, value: 0 }
    ];
    const changePasswordEnterNewRetryStep = { callbacks, stage: ScreenStage.ChangePasswordEnterNewRetry };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(changePasswordEnterNewRetryStep),
      setSubmissionStep: mockSubmissionStep,
      stage: ScreenStage.ChangePasswordEnterNewRetry,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const retryActionForm = tree.root.findByType(RetryActionForm);
    expect(retryActionForm).toBeTruthy();

    expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
  });

  it(`should render with RetryActionForm when stage = ScreenStage.ChangePasswordCurrentPasswordRetry`, () => {
    const mockSubmissionStep = jest.fn();
    const callbacks = JSON.parse(JSON.stringify([{ ...choiceCallback }]));
    callbacks[0].output = [
      { name: `choices`, value: [StepChoice.ok, StepChoice.retry] },
      { name: `defaultChoice`, value: 0 }
    ];
    const changePasswordEnterCurrentRetryStep = { callbacks, stage: ScreenStage.ChangePasswordCurrentPasswordRetry };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(changePasswordEnterCurrentRetryStep),
      setSubmissionStep: mockSubmissionStep,
      stage: ScreenStage.ChangePasswordCurrentPasswordRetry,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const retryActionForm = tree.root.findByType(RetryActionForm);
    expect(retryActionForm).toBeTruthy();

    expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
  });

  it(`should render with ReCaptchaForm when stage = ScreenStage.Recaptcha`, () => {
    const mockSubmissionStep = jest.fn();
    const callbacks = JSON.parse(JSON.stringify([{ ...reCaptchaCallback }]));
    const reCaptchaStep = { callbacks };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(reCaptchaStep),
      setSubmissionStep: mockSubmissionStep,
      stage: ScreenStage.Recaptcha,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const reCaptchaForm = tree.root.findByType(ReCaptchaForm);
    expect(reCaptchaForm).toBeTruthy();

    reCaptchaForm.props.applyActionCallback();
    expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
  });

  it(`should render with InnerOTPResendOptionForm when stage = ScreenStage.InnerOTPResendOption`, () => {
    const mockSubmissionStep = jest.fn();
    const callbacks = JSON.parse(JSON.stringify([{ ...choiceCallback }]));
    callbacks[0].output = [
      { name: `choices`, value: [StepChoice.submit, StepChoice.resend] },
      { name: `defaultChoice`, value: 0 }
    ];
    const innerOTPResendOptionStep = { callbacks, stage: ScreenStage.InnerOTPResendOption };

    formDetails = getFormDetails({
      previousStep: undefined,
      step: new CMCFRSDK.FRStep(innerOTPResendOptionStep),
      setSubmissionStep: mockSubmissionStep,
      stage: ScreenStage.InnerOTPResendOption,
      t: tfn
    });

    act(() => {
      tree = renderer.create(<ComponentToRender content={formDetails.content} />);
    });

    const innerOTPResendOptionForm = tree.root.findByType(InnerOTPResendOptionForm);
    expect(innerOTPResendOptionForm).toBeTruthy();

    expect(mockSubmissionStep).toHaveBeenCalledTimes(1);
  });

  describe(`getErrorFormDetails`, () => {
    useFRConfig(JourneyTree.FR_JOURNEY_LOGIN);

    it(`should render with InactiveAccountForm when code === ErrorMessageCode.CMCAccountInactive`, () => {
      const errorOutcome = {
        code: ErrorMessageCode.CMCAccountInactive,
        customerRef: `some-ref`
      };

      const errorFormDetails = getErrorFormDetails({
        errorOutcome,
        t: tfn
      });

      tree = renderer.create(<ComponentToRender content={errorFormDetails.content} />);

      const inactiveAccountForm = tree.root.findByType(InactiveAccountForm);
      expect(inactiveAccountForm).toBeTruthy();
    });

    it(`should render with LockedAccountForm when code === ErrorMessageCode.CMCAccountLocked`, () => {
      const errorOutcome = {
        code: ErrorMessageCode.CMCAccountLocked,
        customerRef: `some-ref`
      };

      const errorFormDetails = getErrorFormDetails({
        errorOutcome,
        t: tfn
      });

      tree = renderer.create(<ComponentToRender content={errorFormDetails.content} />);

      const lockedAccountForm = tree.root.findByType(LockedAccountForm);
      expect(lockedAccountForm).toBeTruthy();
    });
  });

  it(`should render with unknown error when code is undefined`, () => {
    const errorOutcome = {
      code: ErrorMessageCode.Unknown,
      customerRef: `some-ref`
    };

    const errorFormDetails = getErrorFormDetails({
      errorOutcome,
      t: tfn
    });

    tree = renderer.create(<ComponentToRender content={errorFormDetails.content} />);

    expect(tree.toJSON()).toEqual(`unknown-error`);
  });
});
