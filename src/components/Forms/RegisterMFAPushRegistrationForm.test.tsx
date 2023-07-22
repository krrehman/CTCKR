import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { act } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { IFormProps } from './Form';
import { RegisterMFAPushRegistrationForm } from './RegisterMFAPushRegistrationForm';

const callbacks = [
  {
    output: [
      {
        name: `message`,
        value: `Scan the QR code image below with the ForgeRock Authenticator app to register your device with your login.`
      },
      { name: `messageType`, value: 0 }
    ],
    type: CMCFRSDK.CallbackType.TextOutputCallback
  },
  {
    output: [
      {
        name: `message`,
        value: `window.QRCodeReader.createCode.`
      },
      { name: `messageType`, value: 4 }
    ],
    type: CMCFRSDK.CallbackType.TextOutputCallback
  },
  {
    input: [{ name: `IDToken3`, value: `mfaDeviceRegistration` }],
    output: [
      {
        name: `value`,
        value: `pushauth://push/forgerock:1981?l=YW1sYmNvb2tpZT0wMQ&issuer=Rm9yZ2VSb2Nr&m=REGISTER:33c50052-6a03-4847-93c6-52853a6e4a421670203387011&s=i0c_a5y4mze_nv2ze8sv86Q1faB0dwcCAyM6wyU5x3w&c=ncDLRReNA_zvG37CSvjKXqI80FQiGTy1o5TrQXnP8bY&r=aHR0cHM6Ly9vcGVuYW0tY21jbWFya2V0c3N0by1jbWNtYS1kZXYuaWQuZm9yZ2Vyb2NrLmlvOjQ0My9hbS9qc29uL2FscGhhL3B1c2gvc25zL21lc3NhZ2U_X2FjdGlvbj1yZWdpc3Rlcg&a=aHR0cHM6Ly9vcGVuYW0tY21jbWFya2V0c3N0by1jbWNtYS1kZXYuaWQuZm9yZ2Vyb2NrLmlvOjQ0My9hbS9qc29uL2FscGhhL3B1c2gvc25zL21lc3NhZ2U_X2FjdGlvbj1hdXRoZW50aWNhdGU&b=032b75`
      },
      { name: `id`, value: `mfaDeviceRegistration` }
    ],
    type: CMCFRSDK.CallbackType.HiddenValueCallback
  },
  {
    output: [
      { name: `waitTime`, value: `5000` },
      {
        name: `message`,
        value: `Waiting for response...`
      }
    ],
    type: CMCFRSDK.CallbackType.PollingWaitCallback
  }
];

const step: CMCFRSDK.Step = {
  callbacks
};

describe(`RegisterMFAPushRegistrationForm`, () => {
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
        <RegisterMFAPushRegistrationForm {...props} />
      </BrowserRouter>
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should match snapshot`, () => {
      expect(renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />).toJSON()).toMatchSnapshot();
    });
  });

  it(`should call setCallbackValue & applyActionCallback`, () => {
    jest.useFakeTimers();

    jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.HiddenValueCallback, `mfaDeviceRegistration`);
    jest.useRealTimers();
  });

  it(`should call mockClearTimeout when the component is unmounted`, async () => {
    const mockClearTimeout = jest.fn();
    window.clearTimeout = mockClearTimeout;

    jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    expect(mockClearTimeout.mock.calls.length).toBe(0);

    act(() => {
      tree.unmount();
    });

    await new Promise(process.nextTick);

    expect(mockClearTimeout.mock.calls.length).toBe(1);
  });
});
