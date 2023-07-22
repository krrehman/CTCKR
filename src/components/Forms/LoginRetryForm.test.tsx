import renderer, { act } from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { IFormProps } from './Form';
import { LoginRetryForm } from './LoginRetryForm';

const choiceCallbacks = [
  {
    input: [{ name: `IDToken1`, value: `` }],
    output: [
      { name: `choices`, value: [`retry`, `ok`] },
      { name: `prompt`, value: `retry-error` },
      { name: `defaultChoice`, value: 0 }
    ],
    type: CMCFRSDK.CallbackType.ChoiceCallback
  }
];

const step: CMCFRSDK.Step = {
  callbacks: choiceCallbacks
};

describe(`LoginRetryForm`, () => {
  let frStep: CMCFRSDK.FRStep;

  beforeEach(() => {
    frStep = new CMCFRSDK.FRStep(step);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const ComponentToRender = (props: IFormProps) => (
    <ThemeProvider theme={themeCmcLight}>
      <BrowserRouter>
        <LoginRetryForm {...props} />
      </BrowserRouter>
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should match snapshot`, () => {
      expect(renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />).toJSON()).toMatchSnapshot();
    });
  });

  it(`should call setCallbackValue & applyActionCallback on render`, () => {
    const applyActionCallbackMock = jest.fn();
    const setCallbackValueMock = jest.fn();
    jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

    act(() => {
      renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.ChoiceCallback, 0);
  });
});
