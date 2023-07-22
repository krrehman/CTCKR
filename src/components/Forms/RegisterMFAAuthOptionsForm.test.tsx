import renderer, { act } from 'react-test-renderer';
import { waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { RegisterMFAAuthOptionsForm } from './RegisterMFAAuthOptionsForm';
import { IFormProps } from './Form';

const choiceCallbacks = [
  {
    input: [{ name: `IDToken1`, value: `` }],
    output: [
      { name: `choices`, value: [`email`, `push`, `webauthn`] },
      { name: `defaultChoice`, value: 0 }
    ],
    type: CMCFRSDK.CallbackType.ChoiceCallback
  }
];

const step: CMCFRSDK.Step = {
  callbacks: choiceCallbacks
};

describe(`RegisterMFAAuthOptionsForm`, () => {
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
        <RegisterMFAAuthOptionsForm {...props} />
      </BrowserRouter>
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should match snapshot`, () => {
      expect(renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />).toJSON()).toMatchSnapshot();
    });
  });

  it(`should call setCallbackValue & applyActionCallback when MFATypeInput.Email is selected (initial case)`, async () => {
    const applyActionCallbackMock = jest.fn();
    const setCallbackValueMock = jest.fn();
    jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    const nextButton = tree.root.findByProps({ 'data-testid': `RegisterMFAAuthOptionsForm.next` });
    expect(nextButton).toBeTruthy();

    act(() => {
      nextButton.props.onClick();
    });

    await waitFor(() => {
      expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
      expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
      expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.ChoiceCallback, 0);
    });
  });

  it(`should call setCallbackValue & applyActionCallback when MFATypeInput.Email is selected (defaultChoice undefined case)`, async () => {
    const undefinedDefaultChoiceCallbacks = JSON.parse(JSON.stringify(choiceCallbacks));
    undefinedDefaultChoiceCallbacks[0].output[1].value = ``;

    const undefinedDefaultChoiceCallbacksStep: CMCFRSDK.Step = { callbacks: undefinedDefaultChoiceCallbacks };
    const undefinedDefaultChoiceCallbacksFRStep = new CMCFRSDK.FRStep(undefinedDefaultChoiceCallbacksStep);

    const applyActionCallbackMock = jest.fn();
    const setCallbackValueMock = jest.fn();
    jest.spyOn(undefinedDefaultChoiceCallbacksFRStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

    act(() => {
      tree = renderer.create(<ComponentToRender step={undefinedDefaultChoiceCallbacksFRStep} applyActionCallback={applyActionCallbackMock} />);
    });

    const nextButton = tree.root.findByProps({ 'data-testid': `RegisterMFAAuthOptionsForm.next` });
    expect(nextButton).toBeTruthy();

    act(() => {
      nextButton.props.onClick();
    });

    await waitFor(() => {
      expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
      expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
      expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.ChoiceCallback, 0);
    });
  });

  it(`should call setCallbackValue & applyActionCallback when MFATypeInput.Push is selected`, async () => {
    const applyActionCallbackMock = jest.fn();
    const setCallbackValueMock = jest.fn();
    jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    const pushOption = tree.root.findByProps({ 'data-testid': `RegisterMFAAuthOptionsForm.push` });
    expect(pushOption).toBeTruthy();

    act(() => {
      pushOption.props.onClick();
    });

    const nextButton = tree.root.findByProps({ 'data-testid': `RegisterMFAAuthOptionsForm.next` });
    expect(nextButton).toBeTruthy();

    act(() => {
      nextButton.props.onClick();
    });

    await waitFor(() => {
      expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
      expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
      expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.ChoiceCallback, 1);
    });
  });

  it(`should not call setCallbackValue & applyActionCallback when input is invalid`, async () => {
    const noChoiceCallbacks = JSON.parse(JSON.stringify(choiceCallbacks));
    noChoiceCallbacks[0].output[0].value = [];

    const noChoiceCallbacksStep: CMCFRSDK.Step = { callbacks: noChoiceCallbacks };
    const noChoiceCallbacksFRStep = new CMCFRSDK.FRStep(noChoiceCallbacksStep);

    const applyActionCallbackMock = jest.fn();
    const setCallbackValueMock = jest.fn();
    jest.spyOn(noChoiceCallbacksFRStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

    act(() => {
      tree = renderer.create(<ComponentToRender step={noChoiceCallbacksFRStep} applyActionCallback={applyActionCallbackMock} />);
    });

    const nextButton = tree.root.findByProps({ 'data-testid': `RegisterMFAAuthOptionsForm.next` });
    expect(nextButton).toBeTruthy();

    await act(async () => {
      nextButton.props.onClick();
    });

    expect(applyActionCallbackMock).not.toHaveBeenCalled();
    expect(setCallbackValueMock).not.toHaveBeenCalled();
  });
});
