import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import { ModalProvider, themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { JourneyTree, useFRConfig, CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { act } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { IFormProps } from './Form';
import { RequestMFAPushPollingWaitForm } from './RequestMFAPushPollingWaitForm';
import { PushVerificationOptionsCard } from '../PushVerificationOptionsCard';

const callbacks = [
  {
    output: [
      { name: `prompt`, value: `` },
      { name: `messageType`, value: 0 },
      { name: `options`, value: [`Cancel`] },
      { name: `optionType`, value: -1 },
      { name: `defaultOption`, value: 0 }
    ],
    type: CMCFRSDK.CallbackType.ConfirmationCallback
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

describe(`RequestMFAPushPollingWaitForm`, () => {
  let tree: ReturnType<typeof renderer.create>;
  let frStep: CMCFRSDK.FRStep;
  let applyActionCallbackMock: jest.Mock;
  let setCallbackValueMock: jest.Mock;

  beforeEach(() => {
    useFRConfig(JourneyTree.FR_JOURNEY_LOGIN);
    frStep = new CMCFRSDK.FRStep(step);
    applyActionCallbackMock = jest.fn();
    setCallbackValueMock = jest.fn();
  });

  const ComponentToRender = (props: IFormProps) => (
    <ThemeProvider theme={themeCmcLight}>
      <ModalProvider />
      <BrowserRouter>
        <RequestMFAPushPollingWaitForm {...props} />
      </BrowserRouter>
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should match snapshot`, () => {
      expect(renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />).toJSON()).toMatchSnapshot();
    });
  });

  it(`should call applyActionCallback`, () => {
    jest.useFakeTimers();

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    act(() => {
      jest.runOnlyPendingTimers();
    });

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

  describe(`verification options dialog`, () => {
    it(`should open verification options dialog`, () => {
      jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

      act(() => {
        tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
      });
      const optionsButton = tree.root.findByProps({ 'data-testid': `RequestMFAPushPollingWaitForm.options` });

      expect(tree.root.findAllByType(PushVerificationOptionsCard).length).toBe(0);

      act(() => {
        optionsButton.props.onClick();
      });

      expect(applyActionCallbackMock).not.toHaveBeenCalled();
      expect(setCallbackValueMock).not.toHaveBeenCalled();

      const pushVerificationOptionsCardList = tree.root.findAllByType(PushVerificationOptionsCard);

      expect(pushVerificationOptionsCardList.length).toBe(1);

      act(() => {
        pushVerificationOptionsCardList[0].props.backupCodesSelectionHandler();
      });

      expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
      expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
      tree.unmount();
    });

    it(`should update verification options dialog`, async () => {
      jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

      act(() => {
        tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
      });
      const optionsButton = tree.root.findByProps({ 'data-testid': `RequestMFAPushPollingWaitForm.options` });

      expect(tree.root.findAllByType(PushVerificationOptionsCard).length).toBe(0);

      act(() => {
        optionsButton.props.onClick();
      });

      expect(tree.root.findAllByType(PushVerificationOptionsCard).length).toBe(1);

      const newActionCallback = jest.fn();
      tree.update(<ComponentToRender step={frStep} applyActionCallback={newActionCallback} />);

      await new Promise(process.nextTick);

      expect(tree.root.findAllByType(PushVerificationOptionsCard).length).toBe(1);
      tree.unmount();
    });
  });

  describe(`verification options view`, () => {
    it(`should switch to verification options view`, () => {
      useFRConfig(JourneyTree.FR_JOURNEY_CHANGE_PASSWORD);

      act(() => {
        tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
      });
      const optionsButton = tree.root.findByProps({ 'data-testid': `RequestMFAPushPollingWaitForm.options` });

      expect(tree.root.findAllByType(PushVerificationOptionsCard).length).toBe(0);

      act(() => {
        optionsButton.props.onClick();
      });

      expect(tree.root.findAllByType(PushVerificationOptionsCard).length).toBe(1);
      expect(tree.root.findByType(PushVerificationOptionsCard).props.isInModal).toBe(true);
      act(() => {
        tree.unmount();
      });
    });

    it(`should switch back to the main view`, () => {
      useFRConfig(JourneyTree.FR_JOURNEY_CHANGE_PASSWORD);

      act(() => {
        tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
      });
      const optionsButton = tree.root.findByProps({ 'data-testid': `RequestMFAPushPollingWaitForm.options` });

      expect(tree.root.findAllByType(PushVerificationOptionsCard).length).toBe(0);

      act(() => {
        optionsButton.props.onClick();
      });

      expect(tree.root.findAllByType(PushVerificationOptionsCard).length).toBe(1);

      const optionsCard = tree.root.findByType(PushVerificationOptionsCard);

      expect(optionsCard.props.isInModal).toBe(true);

      act(() => {
        optionsCard.props.goBackHandler();
      });

      expect(tree.root.findAllByType(PushVerificationOptionsCard).length).toBe(0);
    });
  });
});
