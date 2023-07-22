import { render, fireEvent, screen } from '@testing-library/react';
import renderer, { act } from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { FRFormStep, CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { IFormProps } from './Form';
import { InnerOTPDecisionForm } from './InnerOTPDecisionForm';
import { StepChoice } from '../../constants/enums';

const passwordCallback = [
  {
    input: [{ name: `IDToken2`, value: `` }],
    output: [{ name: `prompt`, value: `Password` }],
    type: CMCFRSDK.CallbackType.PasswordCallback
  }
];

const step: CMCFRSDK.Step = {
  callbacks: passwordCallback
};

const choiceCallbacks = [
  {
    input: [{ name: `IDToken1`, value: `` }],
    output: [
      { name: `choices`, value: [StepChoice.submit, StepChoice.resend] },
      { name: `defaultChoice`, value: 0 }
    ],
    type: CMCFRSDK.CallbackType.ChoiceCallback
  }
];

const previousStep: CMCFRSDK.Step = {
  callbacks: choiceCallbacks
};

describe(`InnerOTPDecisionForm`, () => {
  let frStep: CMCFRSDK.FRStep;
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
        <InnerOTPDecisionForm {...props} />
      </BrowserRouter>
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should match snapshot`, () => {
      expect(renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />).toJSON()).toMatchSnapshot();
    });
  });

  it(`should not apply callback if code length is < AUTHENTICATION_CODE_LENGTH`, () => {
    const codes = [`1`, `2`, `3`, `4`, `5`];

    jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

    render(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);

    const codeInputs = screen.getAllByTestId(/VerificationCode.Control/);
    expect(codeInputs.length).toBe(codes.length + 1);

    codes.forEach((i, idx) => {
      const input = codeInputs[idx];
      fireEvent.change(input, { target: { value: i } });
    });

    expect(applyActionCallbackMock).toHaveBeenCalledTimes(0);
    expect(setCallbackValueMock).toHaveBeenCalledTimes(0);
  });

  it(`should apply callback if code length equals AUTHENTICATION_CODE_LENGTH`, () => {
    const codes = [`1`, `2`, `3`, `4`, `5`, `6`];

    jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

    render(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);

    const codeInputs = screen.getAllByTestId(/VerificationCode.Control/);
    expect(codeInputs.length).toBe(codes.length);

    codes.forEach((i, idx) => {
      const input = codeInputs[idx];
      fireEvent.change(input, { target: { value: i } });
    });

    expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.PasswordCallback, codes.join(``));
  });

  it(`should apply callback with 00000000, when resending`, () => {
    jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    const resendButton = tree.root.findByProps({ 'data-testid': `InnerOTPDecisionForm.resend` });
    expect(resendButton).toBeTruthy();

    act(() => {
      resendButton.props.onClick();
    });

    expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.PasswordCallback, `00000000`);
  });

  it(`should render with error message`, () => {
    const previousFrStep: FRFormStep = new CMCFRSDK.FRStep(previousStep);
    previousFrStep.retry = true;

    act(() => {
      tree = renderer.create(<ComponentToRender previousStep={previousFrStep} step={frStep} applyActionCallback={jest.fn()} />);
    });

    expect(tree.root.findByProps({ 'data-testid': `InnerOTPDecisionForm.error` })).toBeTruthy();
  });
});
