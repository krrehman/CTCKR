import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { FRFormStep, CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { themeCmcLight, useValidator, CheckBox, PasswordInput } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { LoginButton, LoginForm, UsernameInput } from './LoginForm';
import { IFormProps } from './Form';
import { StepChoice } from '../../constants/enums';

jest.mock(`react-router-dom`, () => ({
  ...jest.requireActual(`react-router-dom`),
  useNavigate: jest.fn()
}));

jest.mock(`@cmctechnology/phoenix-stockbroking-web-design`, () => ({
  ...jest.requireActual(`@cmctechnology/phoenix-stockbroking-web-design`),
  useValidator: jest.fn()
}));

const mockValidator = {
  errorMessage: `some error`,
  handleEvent: jest.fn(),
  invalid: false,
  reset: jest.fn(),
  results: [],
  valid: true,
  validate: () => Promise.resolve(true),
  validating: false,
  value: `test-value-0`,
  validated: true
};

const step: CMCFRSDK.Step = {
  callbacks: [
    {
      input: [{ name: `IDToken1`, value: `` }],
      output: [{ name: `prompt`, value: `User Name` }],
      type: CMCFRSDK.CallbackType.NameCallback
    },
    {
      input: [{ name: `IDToken2`, value: `` }],
      output: [{ name: `prompt`, value: `Password` }],
      type: CMCFRSDK.CallbackType.PasswordCallback
    }
  ]
};

const choiceCallbacks = [
  {
    input: [{ name: `IDToken1`, value: 0 }],
    output: [
      { name: 'prompt', value: `Please try again` },
      { name: `choices`, value: [StepChoice.ok, StepChoice.retry] },
      { name: `defaultChoice`, value: 0 }
    ],
    type: CMCFRSDK.CallbackType.ChoiceCallback
  }
];

const previousStep: CMCFRSDK.Step = {
  callbacks: choiceCallbacks
};

describe(`LoginForm`, () => {
  let tree: ReturnType<typeof renderer.create>;
  let frStep: CMCFRSDK.FRStep;

  beforeEach(() => {
    (useValidator as jest.Mock).mockImplementation(() => mockValidator);
    frStep = new CMCFRSDK.FRStep(step);
  });

  const ComponentToRender = (props: IFormProps) => (
    <ThemeProvider theme={themeCmcLight}>
      <BrowserRouter>
        <LoginForm {...props} />
      </BrowserRouter>
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should render without crashing`, () => {
      expect(() => renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />)).not.toThrow();
    });

    it(`should match snapshot`, () => {
      expect(renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />).toJSON()).toMatchSnapshot();
    });

    it(`should render with retry error message`, () => {
      const previousFrStep: FRFormStep = new CMCFRSDK.FRStep(previousStep);
      previousFrStep.retry = true;

      act(() => {
        tree = renderer.create(<ComponentToRender previousStep={previousFrStep} step={frStep} applyActionCallback={jest.fn()} />);
      });

      expect(tree.root.findByProps({ 'data-testid': `LoginForm.retryError` })).toBeTruthy();
    });

    it(`should hide retry error on input change`, async () => {
      const setCallbackValueMock = jest.fn();
      const previousFrStep: FRFormStep = new CMCFRSDK.FRStep(previousStep);
      previousFrStep.retry = true;

      jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

      await act(async () => {
        tree = renderer.create(<ComponentToRender previousStep={previousFrStep} step={frStep} applyActionCallback={jest.fn()} />);
      });

      expect(tree.root.findAllByProps({ 'data-testid': `LoginForm.retryError` }).length).not.toBe(0);

      const loginAccountInput = tree.root.findByType(UsernameInput);
      const loginPasswordInput = tree.root.findByType(PasswordInput);

      const loginAccountValue = `test-account-value`;
      const loginPasswordValue = `test-password-value`;

      await act(async () => {
        loginAccountInput.props.onChange({ target: { value: loginAccountValue } });
        loginPasswordInput.props.onChange({ target: { value: loginPasswordValue } });
      });

      expect(tree.root.findAllByProps({ 'data-testid': `LoginForm.retryError` }).length).toBe(0);
    });

    it(`should render component`, () => {
      const isRememberMeChecked = false;

      act(() => {
        tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />);
      });

      const loginAccountInput = tree.root.findByType(UsernameInput);
      const loginRememberCheckbox = tree.root.findByType(CheckBox);

      expect(loginAccountInput).toBeTruthy();
      expect(loginRememberCheckbox).toBeTruthy();
      expect(loginAccountInput.props.value).toEqual(mockValidator.value);
      expect(loginRememberCheckbox.props.checked).toBe(isRememberMeChecked);
    });
  });

  describe(`change handlers`, () => {
    it(`should change loginAccount value`, () => {
      const handleEvent = jest.fn();
      const validator = { ...mockValidator, handleEvent };
      (useValidator as jest.Mock).mockImplementation(() => validator);

      act(() => {
        tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />);
      });
      const loginAccountInput = tree.root.findByType(UsernameInput);

      expect(loginAccountInput).toBeTruthy();
      expect(loginAccountInput.props.value).toEqual(mockValidator.value);

      const loginAccountValue = `test-account-value`;
      act(() => {
        loginAccountInput.props.onChange({ target: { value: loginAccountValue, id: `loginAccount` } });
      });

      expect(handleEvent.mock.calls.length).toBe(1);
      expect(handleEvent.mock.calls[0][0]).toEqual(loginAccountValue);
    });

    it(`should change loginPassword value`, () => {
      const handleEvent = jest.fn();
      const validator = { ...mockValidator, handleEvent };
      (useValidator as jest.Mock).mockImplementation(() => validator);

      act(() => {
        tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />);
      });
      const loginPasswordInput = tree.root.findByType(PasswordInput);

      expect(loginPasswordInput).toBeTruthy();
      expect(loginPasswordInput.props.value).toEqual(mockValidator.value);

      const loginPasswordValue = `test-password-value`;
      act(() => {
        loginPasswordInput.props.onChange({ target: { value: loginPasswordValue, id: `loginPassword` } });
      });

      expect(handleEvent.mock.calls.length).toBe(1);
      expect(handleEvent.mock.calls[0][0]).toEqual(loginPasswordValue);
    });

    it(`should change loginRemember value`, () => {
      act(() => {
        tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />);
      });
      const loginRememberCheckbox = tree.root.findByType(CheckBox);

      expect(loginRememberCheckbox).toBeTruthy();
      expect(loginRememberCheckbox.props.checked).toBe(false);

      act(() => {
        loginRememberCheckbox.props.onChange({ target: { value: true } });
      });

      expect(loginRememberCheckbox.props.checked).toBe(true);
    });
  });

  describe(`blur handlers`, () => {
    it(`should call handleEvent on loginAccountInput blur`, () => {
      const handleEvent = jest.fn();
      const validator = { ...mockValidator, handleEvent };
      (useValidator as jest.Mock).mockImplementation(() => validator);

      act(() => {
        tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />);
      });
      const loginAccountInput = tree.root.findByType(UsernameInput);

      expect(loginAccountInput).toBeTruthy();
      expect(loginAccountInput.props.value).toEqual(mockValidator.value);

      const loginAccountValue = `test-account-value`;
      act(() => {
        loginAccountInput.props.onBlur({ target: { value: loginAccountValue } });
      });

      expect(handleEvent.mock.calls.length).toBe(1);
      expect(handleEvent.mock.calls[0][0]).toEqual(loginAccountValue);
    });

    it(`should call handleEvent on loginPasswordInput blur`, () => {
      const handleEvent = jest.fn();
      const validator = { ...mockValidator, handleEvent };
      (useValidator as jest.Mock).mockImplementation(() => validator);

      act(() => {
        tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />);
      });
      const loginPasswordInput = tree.root.findByType(PasswordInput);

      expect(loginPasswordInput).toBeTruthy();
      expect(loginPasswordInput.props.value).toEqual(mockValidator.value);

      const loginPasswordValue = `test-password-value`;
      act(() => {
        loginPasswordInput.props.onBlur({ target: { value: loginPasswordValue } });
      });

      expect(handleEvent.mock.calls.length).toBe(1);
      expect(handleEvent.mock.calls[0][0]).toEqual(loginPasswordValue);
    });
  });

  describe(`submit`, () => {
    let applyActionCallbackMock: jest.Mock;
    let setCallbackValueMock: jest.Mock;

    beforeEach(() => {
      applyActionCallbackMock = jest.fn();
      setCallbackValueMock = jest.fn();
      jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);
    });

    it(`should call applyActionCallback & setCallbackValue on submit`, async () => {
      act(() => {
        tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
      });

      const submitButton = tree.root.findByType(LoginButton);
      expect(submitButton).toBeTruthy();

      act(() => {
        submitButton.props.onClick({ shiftKey: false });
      });

      await new Promise(process.nextTick);

      expect(setCallbackValueMock).toHaveBeenCalledTimes(2);
      expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
    });

    it(`should not call applyActionCallback & setCallbackValue on submit if not valid`, () => {
      const validator = { ...mockValidator, valid: false, invalid: true };
      (useValidator as jest.Mock).mockImplementation(() => validator);

      act(() => {
        tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
      });

      const submitButton = tree.root.findByType(LoginButton);
      expect(submitButton).toBeTruthy();

      act(() => {
        submitButton.props.onClick({ shiftKey: false });
      });

      expect(setCallbackValueMock).not.toHaveBeenCalled();
      expect(applyActionCallbackMock).not.toHaveBeenCalled();
    });
  });

  describe(`handle input keydown event`, () => {
    let applyActionCallbackMock: jest.Mock;
    let setCallbackValueMock: jest.Mock;

    beforeEach(() => {
      applyActionCallbackMock = jest.fn();
      setCallbackValueMock = jest.fn();
      jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);
    });

    it(`should call applyActionCallback & setCallbackValue on submit, when ENTER key is pressed on UsernameInput`, () => {
      act(() => {
        tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
      });

      expect(applyActionCallbackMock).toHaveBeenCalledTimes(0);

      const logonAccountInput = tree.root.findAllByType(UsernameInput);

      act(() => {
        logonAccountInput[0].props.onKeyDown({ key: `Enter`, shiftKey: false });
      });

      expect(setCallbackValueMock).toHaveBeenCalledTimes(2);
      expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
    });

    it(`should call applyActionCallback & setCallbackValue on submit, when ENTER key is pressed on PasswordInput`, () => {
      act(() => {
        tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
      });

      expect(applyActionCallbackMock).toHaveBeenCalledTimes(0);

      const passwordInput = tree.root.findAllByType(PasswordInput);

      act(() => {
        passwordInput[0].props.onKeyDown({ key: `Enter`, shiftKey: false });
      });

      expect(setCallbackValueMock).toHaveBeenCalledTimes(2);
      expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
    });

    it(`should not call applyActionCallback on submit, when other key is pressed`, () => {
      act(() => {
        tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
      });

      expect(applyActionCallbackMock).toHaveBeenCalledTimes(0);

      const passwordInput = tree.root.findAllByType(PasswordInput);

      act(() => {
        passwordInput[0].props.onKeyDown({ key: `Alt` });
      });

      expect(setCallbackValueMock).not.toHaveBeenCalled();
      expect(applyActionCallbackMock).not.toHaveBeenCalled();
    });
  });

  it(`should redirect to forgot password route`, () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />);
    });

    const forgotPasswordButton = tree.root.findByProps({ 'data-testid': `LoginForm.forgotPassword` });

    act(() => {
      forgotPasswordButton.props.onClick();
    });

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(`../forgot-password`);
  });

  it(`should redirect to forgot username route`, () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />);
    });

    const forgotUsernameButton = tree.root.findByProps({ 'data-testid': `LoginForm.forgotUsername` });

    act(() => {
      forgotUsernameButton.props.onClick();
    });

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(`../forgot-username`);
  });
});
