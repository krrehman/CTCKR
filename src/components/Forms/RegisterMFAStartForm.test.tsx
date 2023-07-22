import renderer, { act } from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { JourneyTree, useFRConfig, CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { ThemeProvider } from 'styled-components';
import { IFormProps } from './Form';
import { RegisterMFAStartForm } from './RegisterMFAStartForm';

const choiceCallbacks = [
  {
    input: [{ name: `IDToken1`, value: `` }],
    output: [
      { name: `choices`, value: [`ok`, `activate`, `exit`] },
      { name: `defaultChoice`, value: 1 }
    ],
    type: CMCFRSDK.CallbackType.ChoiceCallback
  }
];

const step: CMCFRSDK.Step = {
  callbacks: choiceCallbacks
};

describe(`RegisterMFAStartForm`, () => {
  let tree: ReturnType<typeof renderer.create>;
  let frStep: CMCFRSDK.FRStep;

  beforeEach(() => {
    useFRConfig(JourneyTree.FR_JOURNEY_FORGOT_PASSWORD);
    jest.spyOn(CMCFRSDK.TokenStorage, `get`).mockImplementation(() => Promise.resolve(undefined as any));
    frStep = new CMCFRSDK.FRStep(step);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const ComponentToRender = (props: IFormProps) => (
    <ThemeProvider theme={themeCmcLight}>
      <BrowserRouter>
        <RegisterMFAStartForm {...props} />
      </BrowserRouter>
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should match snapshot`, () => {
      expect(renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />).toJSON()).toMatchSnapshot();
    });
  });

  it(`should call setCallbackValue & applyActionCallback when AuthenticationChoiceOption.Ok clicked`, async () => {
    const applyActionCallbackMock = jest.fn();
    const setCallbackValueMock = jest.fn();
    jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

    await act(async () => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    const okButton = tree.root.findByProps({ 'data-testid': `RegisterMFAStartForm.ok` });
    expect(okButton).toBeTruthy();

    act(() => {
      okButton.props.onClick();
    });

    expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.ChoiceCallback, 0);
  });

  it(`should call setCallbackValue & applyActionCallback when AuthenticationChoiceOption.Exit clicked`, async () => {
    const applyActionCallbackMock = jest.fn();
    const setCallbackValueMock = jest.fn();
    jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

    await act(async () => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    const exitButton = tree.root.findByProps({ 'data-testid': `RegisterMFAStartForm.exit` });
    expect(exitButton).toBeTruthy();

    act(() => {
      exitButton.props.onClick();
    });

    expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.ChoiceCallback, 2);
  });

  describe(`skipIfAuthenticated`, () => {
    it(`should call setCallbackValue & applyActionCallback when authenticated`, async () => {
      useFRConfig(JourneyTree.FR_JOURNEY_CHANGE_PASSWORD);

      const applyActionCallbackMock = jest.fn();
      const setCallbackValueMock = jest.fn();
      jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

      await act(async () => {
        tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
      });

      expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
      expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
      expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.ChoiceCallback, 0);
    });

    it(`should not call setCallbackValue & applyActionCallback when not authenticated`, async () => {
      const applyActionCallbackMock = jest.fn();
      const setCallbackValueMock = jest.fn();
      jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

      await act(async () => {
        tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
      });

      expect(applyActionCallbackMock).toHaveBeenCalledTimes(0);
      expect(setCallbackValueMock).toHaveBeenCalledTimes(0);
    });
  });
});
