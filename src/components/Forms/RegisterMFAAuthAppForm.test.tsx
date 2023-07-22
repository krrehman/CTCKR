import renderer, { act } from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { IFormProps } from './Form';
import { RegisterMFAAuthAppForm } from './RegisterMFAAuthAppForm';

const callbacks = [
  {
    output: [
      {
        name: `message`,
        value: `document.getElementById(\"callback_0\").innerHTML=\"<center>Get the app from the <a target='_blank' href='https://itunes.apple.com/app/forgerock-authenticator/id1038442926'>Apple App Store</a> or on <a target='_blank' href='https://play.google.com/store/apps/details?id=com.forgerock.authenticator'>Google Play Store</a></center>`
      },
      { name: `messageType`, value: 4 }
    ],
    type: CMCFRSDK.CallbackType.TextOutputCallback
  },
  {
    input: [{ name: `IDToken2`, value: 0 }],
    output: [
      { name: `prompt`, value: `` },
      { name: `messageType`, value: 0 },
      { name: `options`, value: [`Continue`] },
      { name: `optionType`, value: -1 },
      { name: `defaultOption`, value: 0 }
    ],
    type: CMCFRSDK.CallbackType.ConfirmationCallback
  }
];

const step: CMCFRSDK.Step = {
  callbacks
};

describe(`RegisterMFAAuthAppForm`, () => {
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
      <BrowserRouter>
        <RegisterMFAAuthAppForm {...props} />
      </BrowserRouter>
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should match snapshot`, () => {
      expect(renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />).toJSON()).toMatchSnapshot();
    });
  });

  it(`should call setCallbackValue & applyActionCallback`, () => {
    jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    const continueButton = tree.root.findByProps({ 'data-testid': `RegisterMFAAuthAppForm.continue` });
    expect(continueButton).toBeTruthy();

    act(() => {
      continueButton.props.onClick();
    });

    expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.ConfirmationCallback, 0);
  });
});
