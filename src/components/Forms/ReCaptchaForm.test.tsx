import renderer, { act } from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { IFormProps } from './Form';
import { ReCaptchaForm } from './ReCaptchaForm';

const reCaptchaCallbacks = [
  {
    input: [{ name: `IDToken1`, value: `` }],
    output: [
      { name: `recaptchaSiteKey`, value: `mock-recaptcha-key` },
      { name: `captchaApiUri`, value: `https://www.google.com/recaptcha/api.js` },
      { name: `captchaDivClass`, value: `g-recaptcha` },
      { name: `reCaptchaV3`, value: true }
    ],
    type: CMCFRSDK.CallbackType.ReCaptchaCallback
  }
];

const step: CMCFRSDK.Step = {
  callbacks: reCaptchaCallbacks
};

describe(`ReCaptchaForm`, () => {
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
        <ReCaptchaForm {...props} />
      </BrowserRouter>
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should match snapshot`, () => {
      const tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />);
      expect(tree.toJSON()).toMatchSnapshot();
      tree.unmount();
    });
  });

  it(`should call setCallbackValue & applyActionCallback (re-captcha load success)`, async () => {
    const mockToken = `some-token`;

    const mockReady = jest.fn();
    const mockExecute = jest.fn(() => Promise.resolve(mockToken));

    const mockReCaptcha = {
      ready: mockReady,
      execute: mockExecute
    };

    (window as any).grecaptcha = mockReCaptcha;

    const mockAddEventListener = jest.fn();
    jest.spyOn(HTMLScriptElement.prototype, `addEventListener`).mockImplementation(mockAddEventListener);

    jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

    act(() => {
      renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    expect(mockAddEventListener).toHaveBeenCalledTimes(1);
    expect(mockAddEventListener.mock.calls[0][0]).toBe(`load`);

    mockAddEventListener.mock.calls[0][1]();

    expect(mockReady).toHaveBeenCalledTimes(1);

    mockReady.mock.calls[0][0]();

    await new Promise(process.nextTick);

    expect(mockExecute).toHaveBeenCalledTimes(1);
    expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.ReCaptchaCallback, mockToken);
  });

  it(`should not call setCallbackValue & applyActionCallback (re-captcha load error)`, async () => {
    const error = `some-error`;

    const mockReady = jest.fn();
    const mockExecute = jest.fn(() => Promise.reject(error));

    const mockReCaptcha = {
      ready: mockReady,
      execute: mockExecute
    };

    (window as any).grecaptcha = mockReCaptcha;

    const mockAddEventListener = jest.fn();
    jest.spyOn(HTMLScriptElement.prototype, `addEventListener`).mockImplementation(mockAddEventListener);

    jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

    act(() => {
      renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    expect(mockAddEventListener).toHaveBeenCalledTimes(1);
    expect(mockAddEventListener.mock.calls[0][0]).toBe(`load`);

    mockAddEventListener.mock.calls[0][1]();

    expect(mockReady).toHaveBeenCalledTimes(1);

    await act(async () => {
      mockReady.mock.calls[0][0]();
    });

    await new Promise(process.nextTick);

    expect(mockExecute).toHaveBeenCalledTimes(1);
    expect(applyActionCallbackMock).toHaveBeenCalledTimes(0);
    expect(setCallbackValueMock).toHaveBeenCalledTimes(0);
  });
});
