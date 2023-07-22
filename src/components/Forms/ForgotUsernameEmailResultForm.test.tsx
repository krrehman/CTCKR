import renderer, { act } from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import { ModalProvider, themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { IFormProps } from './Form';
import { ForgotUsernameEmailResultForm } from './ForgotUsernameEmailResultForm';
import { ContactCard } from '../ContactCard';

const choiceCallbacks = [
  {
    input: [{ name: `IDToken1`, value: `` }],
    output: [
      { name: `choices`, value: [`resend`, 'backToLogin'] },
      { name: `defaultChoice`, value: 1 }
    ],
    type: CMCFRSDK.CallbackType.ChoiceCallback
  }
];

const step: CMCFRSDK.Step = {
  callbacks: choiceCallbacks
};

describe(`ForgotUsernameEmailResultForm`, () => {
  let tree: ReturnType<typeof renderer.create>;
  let frStep: CMCFRSDK.FRStep;
  let applyActionCallbackMock: jest.Mock;
  let setCallbackValueMock: jest.Mock;

  beforeEach(() => {
    frStep = new CMCFRSDK.FRStep(step);
    applyActionCallbackMock = jest.fn();
    setCallbackValueMock = jest.fn();
  });

  const ComponentToRender = (props: IFormProps) => (
    <ThemeProvider theme={themeCmcLight}>
      <ModalProvider />
      <BrowserRouter>
        <ForgotUsernameEmailResultForm {...props} />
      </BrowserRouter>
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should match snapshot`, () => {
      expect(renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />).toJSON()).toMatchSnapshot();
    });
  });

  it(`should navigate to login on backToLoginButton click`, () => {
    jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    const backToLoginButton = tree.root.findByProps({ 'data-testid': `ForgotUsernameEmailResultForm.backToLogin` });
    expect(backToLoginButton).toBeTruthy();
    act(() => {
      backToLoginButton.props.onClick();
    });
    expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.ChoiceCallback, 1);
  });

  it(`should resend email on resend click`, () => {
    jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    const resendButton = tree.root.findByProps({ 'data-testid': `ForgotUsernameEmailResultForm.resend` });
    expect(resendButton).toBeTruthy();

    act(() => {
      resendButton.props.onClick();
    });

    expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.ChoiceCallback, 0);
  });

  it(`should open options dialog`, () => {
    jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    const optionsButton = tree.root.findByProps({ 'data-testid': `ForgotUsernameEmailResultForm.options` });
    expect(optionsButton).toBeTruthy();

    expect(tree.root.findAllByType(ContactCard).length).toBe(0);

    act(() => {
      optionsButton.props.onClick();
    });
    expect(tree.root.findAllByType(ContactCard).length).toBe(1);
  });
});
