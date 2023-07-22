import renderer, { act } from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';

import { RequestMFAAuthOptionsForm } from './RequestMFAAuthOptionsForm';
import { IFormProps } from './Form';

const choiceCallbacks = [
  {
    input: [{ name: `IDToken1`, value: `` }],
    output: [{ name: `choices`, value: [`email`, `push`, `none`] }],
    type: CMCFRSDK.CallbackType.ChoiceCallback
  }
];

const step: CMCFRSDK.Step = {
  callbacks: choiceCallbacks
};

describe(`RequestMFAAuthOptionsForm`, () => {
  let tree: ReturnType<typeof renderer.create>;
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
        <RequestMFAAuthOptionsForm {...props} />
      </BrowserRouter>
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should match snapshot`, () => {
      expect(renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />).toJSON()).toMatchSnapshot();
    });
  });

  it(`should call setCallbackValue & applyActionCallback when MFATypeInput.Email is selected`, () => {
    const applyActionCallbackMock = jest.fn();
    const setCallbackValueMock = jest.fn();
    jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    const emailButton = tree.root.findByProps({ 'data-testid': `RequestMFAAuthOptionsForm.email` });

    act(() => {
      emailButton.props.onClick();
    });

    expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.ChoiceCallback, 0);
  });

  it(`should call setCallbackValue & applyActionCallback when MFATypeInput.Push is selected`, () => {
    const applyActionCallbackMock = jest.fn();
    const setCallbackValueMock = jest.fn();
    jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    const pushButton = tree.root.findByProps({ 'data-testid': `RequestMFAAuthOptionsForm.push` });

    act(() => {
      pushButton.props.onClick();
    });

    expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.ChoiceCallback, 1);
  });

  it(`should call setCallbackValue & applyActionCallback when MFATypeInput.None is selected`, () => {
    const applyActionCallbackMock = jest.fn();
    const setCallbackValueMock = jest.fn();
    jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    const noneButton = tree.root.findByProps({ 'data-testid': `RequestMFAAuthOptionsForm.none` });

    act(() => {
      noneButton.props.onClick();
    });

    expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.ChoiceCallback, 2);
  });
});
