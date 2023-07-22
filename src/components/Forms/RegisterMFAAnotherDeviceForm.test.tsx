import renderer, { act } from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { IFormProps } from './Form';
import { RegisterMFAAnotherDeviceForm } from './RegisterMFAAnotherDeviceForm';

const callbacks = [
  {
    output: [
      { name: `message`, value: `Do you want to register another device?` },
      { name: `messageType`, value: 0 }
    ],
    type: CMCFRSDK.CallbackType.TextOutputCallback
  },
  {
    output: [
      { name: `prompt`, value: `` },
      { name: `messageType`, value: 0 },
      { name: `options`, value: [`Yes`, `No`] },
      { name: `optionType`, value: -1 },
      { name: `defaultOption`, value: 1 }
    ],
    type: CMCFRSDK.CallbackType.ConfirmationCallback
  }
];

const step: CMCFRSDK.Step = {
  callbacks
};

describe(`RegisterMFAAnotherDeviceForm`, () => {
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
        <RegisterMFAAnotherDeviceForm {...props} />
      </BrowserRouter>
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should match snapshot`, () => {
      expect(renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />).toJSON()).toMatchSnapshot();
    });
  });

  it(`should call setCallbackValue & applyActionCallback (Yes case)`, () => {
    jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    const yesButton = tree.root.findByProps({ 'data-testid': `RegisterMFAAnotherDeviceForm.yes` });
    expect(yesButton).toBeTruthy();

    act(() => {
      yesButton.props.onClick();
    });

    expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.ConfirmationCallback, 0);
  });

  it(`should call setCallbackValue & applyActionCallback (Skip case)`, () => {
    jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    const noButton = tree.root.findByProps({ 'data-testid': `RegisterMFAAnotherDeviceForm.skip` });
    expect(noButton).toBeTruthy();

    act(() => {
      noButton.props.onClick();
    });

    expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.ConfirmationCallback, 1);
  });
});
