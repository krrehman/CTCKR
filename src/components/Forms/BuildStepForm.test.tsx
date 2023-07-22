import renderer from 'react-test-renderer';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { act } from 'react-dom/test-utils';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { FormLoader } from './Form';
import { BuildStepForm, CloseIcon, IBuildStepFormProps } from './BuildStepForm';
import { ReCaptchaForm } from './ReCaptchaForm';
import { JourneyTree, Page, ScreenStage, useFRConfig } from '@cmctechnology/webinvest-store-client';
import { pages } from '../../constants/pageConstants';

jest.mock(`react-router-dom`, () => ({
  ...jest.requireActual(`react-router-dom`),
  useNavigate: jest.fn()
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

const loginStep: CMCFRSDK.Step = {
  callbacks: [nameCallback, passwordCallback],
  stage: ScreenStage.Login
};

describe(`BuildStepForm`, () => {
  let tree: ReturnType<typeof renderer.create>;
  let frStep: CMCFRSDK.FRStep;
  let mockNavigate: jest.Mock;

  const ComponentToRender = (props: IBuildStepFormProps) => (
    <ThemeProvider theme={themeCmcLight}>
      <BrowserRouter>
        <BuildStepForm {...props} />
      </BrowserRouter>
    </ThemeProvider>
  );

  beforeEach(() => {
    frStep = new CMCFRSDK.FRStep(loginStep);
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it(`should match snapshot`, () => {
    useFRConfig(JourneyTree.FR_JOURNEY_LOGIN);
    tree = renderer.create(<ComponentToRender step={frStep} setSubmissionStep={jest.fn()} submissionProcess={false} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it(`should redirect to login route when tree !== JourneyTree.FR_JOURNEY_LOGIN, but step is LOGIN`, async () => {
    useFRConfig(JourneyTree.FR_JOURNEY_FORGOT_PASSWORD);

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} setSubmissionStep={jest.fn()} submissionProcess={false} />);
    });

    await new Promise(process.nextTick);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(`../${pages[Page.LogIn].path}`);
  });

  it(`should assign stage to ScreenStage.Recaptcha`, () => {
    useFRConfig(JourneyTree.FR_JOURNEY_FORGOT_PASSWORD);
    const reCaptchaCallbacks = [
      {
        input: [{ name: `IDToken1`, value: `` }],
        output: [
          { name: `recaptchaSiteKey`, value: `mock-recaptcha-key` },
          { name: `captchaApiUri`, value: `https://www.google.com/recaptcha/api.js` },
          { name: `captchaDivClass`, value: `g-recaptcha` },
          { name: `reCaptchaV3`, value: true }
        ],
        type: CMCFRSDK.CallbackType.ReCaptchaCallback
      }
    ];

    const recaptchStep: CMCFRSDK.Step = {
      callbacks: reCaptchaCallbacks
    };

    act(() => {
      tree = renderer.create(<ComponentToRender step={new CMCFRSDK.FRStep(recaptchStep)} setSubmissionStep={jest.fn()} submissionProcess={false} />);
    });

    const reCaptchaForm = tree.root.findByType(ReCaptchaForm);
    expect(reCaptchaForm).toBeTruthy();
  });

  it(`should render with loader`, () => {
    useFRConfig(JourneyTree.FR_JOURNEY_LOGIN);

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} setSubmissionStep={jest.fn()} submissionProcess={true} />);
    });

    const loader = tree.root.findByType(FormLoader);
    expect(loader).toBeTruthy();
  });

  it(`should call onCloseModal`, () => {
    useFRConfig(JourneyTree.FR_JOURNEY_LOGIN);

    const closeModalMock = jest.fn();

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} setSubmissionStep={jest.fn()} submissionProcess={true} onCloseModal={closeModalMock} />);
    });

    const closeIcon = tree.root.findByType(CloseIcon);
    expect(closeIcon).toBeTruthy();

    act(() => {
      closeIcon.props.onClick();
    });

    expect(closeModalMock).toHaveBeenCalledTimes(1);
  });
});
