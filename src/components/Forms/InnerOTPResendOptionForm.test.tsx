import renderer, { act } from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { FRFormStep, CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { IFormProps } from './Form';
import { StepChoice } from '../../constants/enums';
import { InnerOTPResendOptionForm } from './InnerOTPResendOptionForm';
import { CODE_RESEND_STORAGE_NAME, CODE_SUBMIITED_STORAGE_NAME } from '../../constants/constants';

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

const step: CMCFRSDK.Step = {
  callbacks: choiceCallbacks
};

describe(`InnerOTPResendOptionForm`, () => {
  let frStep: FRFormStep;
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
        <InnerOTPResendOptionForm {...props} />
      </BrowserRouter>
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should match snapshot`, () => {
      expect(renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />).toJSON()).toMatchSnapshot();
    });
  });

  it(`should call setCallbackValue & applyActionCallback (StepChoice.submit case)`, () => {
    jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);
    expect(frStep.retry).toBeFalsy();

    act(() => {
      renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.ChoiceCallback, 0);
  });

  it(`should call setCallbackValue & applyActionCallback (StepChoice.resend case)`, () => {
    sessionStorage.setItem(CODE_RESEND_STORAGE_NAME, `true`);
    jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

    act(() => {
      renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.ChoiceCallback, 1);
  });
  it(`should call setCallbackValue & applyActionCallback and set retry to true (StepChoice.submit case)`, () => {
    jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);
    expect(frStep.retry).toBeFalsy();

    sessionStorage.setItem(CODE_SUBMIITED_STORAGE_NAME, `true`);

    act(() => {
      renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.ChoiceCallback, 0);
    expect(frStep.retry).toBeTruthy();
  });
});
