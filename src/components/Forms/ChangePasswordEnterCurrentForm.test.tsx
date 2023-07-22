import renderer, { act } from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { IFormProps } from './Form';
import { ChangePasswordEnterCurrentForm } from './ChangePasswordEnterCurrentForm';
import { ENTER_KEY } from '../../constants/constants';
import { StepChoice } from '../../constants/enums';
import { FRFormStep } from '@cmctechnology/webinvest-store-client';

const callbacks = [
  {
    input: [{ name: `IDToken2`, value: `` }],
    output: [{ name: `prompt`, value: `Password` }],
    type: CMCFRSDK.CallbackType.PasswordCallback
  }
];

const step: CMCFRSDK.Step = {
  callbacks
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

describe(`ChangePasswordEnterCurrentForm`, () => {
  let frStep: FRFormStep;
  let tree: ReturnType<typeof renderer.create>;
  let applyActionCallbackMock: jest.Mock;
  let setCallbackValueMock: jest.Mock;

  beforeEach(() => {
    frStep = new CMCFRSDK.FRStep(step);
    applyActionCallbackMock = jest.fn();
    setCallbackValueMock = jest.fn();
  });

  const ComponentToRender = (props: IFormProps) => (
    <ThemeProvider theme={themeCmcLight}>
      <BrowserRouter>
        <ChangePasswordEnterCurrentForm {...props} />
      </BrowserRouter>
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should match snapshot`, () => {
      expect(renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />).toJSON()).toMatchSnapshot();
    });

    it(`should render with error message`, () => {
      const previousFrStep: FRFormStep = new CMCFRSDK.FRStep(previousStep);
      previousFrStep.retry = true;

      act(() => {
        tree = renderer.create(<ComponentToRender previousStep={previousFrStep} step={frStep} applyActionCallback={applyActionCallbackMock} />);
      });

      expect(tree.root.findByProps({ 'data-testid': `ChangePasswordEnterCurrentForm.error` })).toBeTruthy();
    });
  });

  it(`should call setCallbackValueMock & applyActionCallback, when passwordValidator.valid`, async () => {
    jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    const passInput = tree.root.findByProps({ 'data-testid': `ChangePasswordEnterCurrentForm.password` });
    const changeValue = `somepass1`;
    const blurValue = `somepassB1`;

    await act(async () => {
      passInput.props.onChange({ target: { value: changeValue } });
    });

    const next = tree.root.findByProps({ 'data-testid': `ChangePasswordEnterCurrentForm.submit` });

    await act(async () => {
      passInput.props.onBlur({ target: { value: blurValue } });
    });

    await act(() => {
      next.props.onClick();
    });

    expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.PasswordCallback, blurValue);
    expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
  });

  describe(`handle input keydown event`, () => {
    beforeEach(() => {
      applyActionCallbackMock = jest.fn();
    });

    it(`should call setCallbackValue & applyActionCallback on submit, when ENTER key is pressed`, async () => {
      jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

      act(() => {
        tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
      });

      const passswordInput = tree.root.findByProps({ 'data-testid': `ChangePasswordEnterCurrentForm.password` });

      const value = `somepass1`;

      await act(async () => {
        passswordInput.props.onChange({ target: { value } });
      });

      expect(applyActionCallbackMock).not.toHaveBeenCalled();

      await act(async () => {
        passswordInput.props.onKeyDown({ key: ENTER_KEY });
      });

      expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
      expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.PasswordCallback, value);
      expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
    });

    it(`should not call setCallbackValue & applyActionCallback, when ENTER key is pressed but input is invalid`, async () => {
      jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

      act(() => {
        tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
      });

      const passwordInput = tree.root.findByProps({ 'data-testid': `ChangePasswordEnterCurrentForm.password` });

      const value = ``;

      await act(async () => {
        passwordInput.props.onChange({ target: { value } });
      });

      await act(async () => {
        passwordInput.props.onKeyDown({ key: ENTER_KEY });
      });

      expect(setCallbackValueMock).not.toHaveBeenCalled();
      expect(applyActionCallbackMock).not.toHaveBeenCalled();
    });

    it(`should not call setCallbackValue & applyActionCallback on submit, when non ENTER key is pressed`, async () => {
      jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

      act(() => {
        tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
      });

      const passwordInput = tree.root.findByProps({ 'data-testid': `ChangePasswordEnterCurrentForm.password` });

      const value = `somepass1`;

      await act(async () => {
        passwordInput.props.onChange({ target: { value } });
      });

      expect(applyActionCallbackMock).not.toHaveBeenCalled();

      act(() => {
        passwordInput.props.onKeyDown({ key: `Alt` });
      });

      expect(setCallbackValueMock).not.toHaveBeenCalled();
      expect(applyActionCallbackMock).not.toHaveBeenCalled();
    });
  });
});
