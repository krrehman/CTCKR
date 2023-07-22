import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { act } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { IFormProps } from './Form';
import { RequestMFAResultForm } from './RequestMFAResultForm';
import { ScreenStage } from '@cmctechnology/webinvest-store-client';

const callbacks = [
  {
    input: [{ name: `IDToken1`, value: `0` }],
    output: [
      { name: `prompt`, value: `Press OK to continue` },
      { name: `choices`, value: [`Ok`, `Continue`] },
      { name: `defaultChoice`, value: 0 }
    ],
    type: CMCFRSDK.CallbackType.ChoiceCallback
  }
];

const step: CMCFRSDK.Step = {
  callbacks
};

describe(`RequestMFAResultForm`, () => {
  let tree: ReturnType<typeof renderer.create>;
  let frStep: CMCFRSDK.FRStep;
  let applyActionCallbackMock: jest.Mock;

  beforeEach(() => {
    frStep = new CMCFRSDK.FRStep(step);
    applyActionCallbackMock = jest.fn();
  });

  const ComponentToRender = (props: IFormProps) => (
    <ThemeProvider theme={themeCmcLight}>
      <BrowserRouter>
        <RequestMFAResultForm {...props} />
      </BrowserRouter>
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should match snapshot`, () => {
      expect(renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />).toJSON()).toMatchSnapshot();
    });

    it(`should render (success case)`, () => {
      const requestMFAOkStep = { callbacks, stage: ScreenStage.RequestMFAOk };

      act(() => {
        tree = renderer.create(<ComponentToRender step={new CMCFRSDK.FRStep(requestMFAOkStep)} applyActionCallback={applyActionCallbackMock} />);
      });

      const successIcon = tree.root.findByProps({ 'data-testid': `RequestMFAResultForm.icon-success` });
      const errorIcon = tree.root.findAllByProps({ 'data-testid': `RequestMFAResultForm.icon-error` });
      expect(successIcon).toBeTruthy();
      expect(errorIcon.length).toBe(0);
    });

    it(`should render (fail case)`, () => {
      const requestMFAOkStep = { callbacks, stage: ScreenStage.RequestMFAFail };

      act(() => {
        tree = renderer.create(<ComponentToRender step={new CMCFRSDK.FRStep(requestMFAOkStep)} applyActionCallback={applyActionCallbackMock} />);
      });

      const successIcon = tree.root.findAllByProps({ 'data-testid': `RequestMFAResultForm.icon-success` });
      const errorIcon = tree.root.findByProps({ 'data-testid': `RequestMFAResultForm.icon-error` });
      expect(successIcon.length).toBe(0);
      expect(errorIcon).toBeTruthy();
    });
  });

  it(`should call setCallbackValue & applyActionCallback`, () => {
    const setCallbackValueMock = jest.fn();
    jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

    jest.useFakeTimers();

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.ChoiceCallback, 0);
    expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it(`should call mockClearTimeout when the component is unmounted`, async () => {
    const mockClearTimeout = jest.fn();
    window.clearTimeout = mockClearTimeout;

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
