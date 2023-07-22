import renderer, { act } from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { IFormProps } from './Form';
import { ENTER_KEY } from '../../constants/constants';
import { ChangePasswordEnterNewForm } from './ChangePasswordEnterNewForm';
import { StepChoice } from '../../constants/enums';
import { FRFormStep } from '@cmctechnology/webinvest-store-client';

const callbacks = [
  {
    input: [{ name: `IDToken1`, value: ``, IDToken1validateOnly: true }],
    output: [
      { name: `echoOn`, value: false },
      {
        name: `policies`,
        value: {
          conditionalPolicies: undefined,
          fallbackPolicies: undefined,
          name: `password`,
          policies: [{ policyRequirements: [`VALID_TYPE`], policyId: `valid-type`, params: { types: [`string`] } }],
          policyRequirements: [`VALID_TYPE`]
        }
      },
      {
        name: `failedPolicies`,
        value: [
          `{ \"policyRequirement\": \"LENGTH_BASED\", \"params\": { \"max-password-length\": 0, \"min-password-length\": 8 } }`,
          `{ \"policyRequirement\": \"CHARACTER_SET\", \"params\": { \"allow-unclassified-characters\": true, \"character-set-ranges\": [  ], \"character-sets\": [ \"0:0123456789\" ], \"min-character-sets\": 1 } }`
        ]
      },
      { name: 'validateOnly', value: true },
      { name: `prompt`, value: `Password` }
    ],
    type: CMCFRSDK.CallbackType.ValidatedCreatePasswordCallback
  }
];

const step: CMCFRSDK.Step = {
  callbacks
};

const choiceCallbacks = [
  {
    input: [{ name: `IDToken1`, value: 0 }],
    output: [
      { name: 'prompt', value: `Please try again` },
      { name: `choices`, value: [StepChoice.ok, StepChoice.retry] },
      { name: `defaultChoice`, value: 0 }
    ],
    type: CMCFRSDK.CallbackType.ChoiceCallback
  }
];

const previousStep: CMCFRSDK.Step = {
  callbacks: choiceCallbacks
};

describe(`ChangePasswordEnterNewForm`, () => {
  let frStep: FRFormStep;
  let tree: ReturnType<typeof renderer.create>;
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
        <ChangePasswordEnterNewForm {...props} />
      </BrowserRouter>
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should match snapshot`, () => {
      expect(renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />).toJSON()).toMatchSnapshot();
    });

    it(`should render with submit error message`, () => {
      const previousFrStep: FRFormStep = new CMCFRSDK.FRStep(previousStep);
      previousFrStep.retry = true;

      act(() => {
        tree = renderer.create(<ComponentToRender previousStep={previousFrStep} step={frStep} applyActionCallback={applyActionCallbackMock} />);
      });

      expect(tree.root.findAllByProps({ 'data-testid': `ChangePasswordEnterNewForm.retryError` }).length).not.toBe(0);
    });

    it(`should hide retry error on input change`, async () => {
      const previousFrStep: FRFormStep = new CMCFRSDK.FRStep(previousStep);
      previousFrStep.retry = true;

      jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

      await act(async () => {
        tree = renderer.create(<ComponentToRender previousStep={previousFrStep} step={frStep} applyActionCallback={applyActionCallbackMock} />);
      });

      expect(tree.root.findAllByProps({ 'data-testid': `ChangePasswordEnterNewForm.retryError` }).length).not.toBe(0);

      const passwordInput = tree.root.findByProps({ 'data-testid': `ChangePasswordEnterNewForm.password` });
      const confirmPasswordInput = tree.root.findByProps({ 'data-testid': `ChangePasswordEnterNewForm.password-confirm` });

      const value = `somepass1`;

      await act(async () => {
        passwordInput.props.onChange({ target: { value } });
        confirmPasswordInput.props.onChange({ target: { value } });
      });

      expect(tree.root.findAllByProps({ 'data-testid': `ChangePasswordEnterNewForm.retryError` }).length).toBe(0);
    });
  });

  it(`should call setCallbackValueMock & applyActionCallback, when passwordValidator.valid & confirmPasswordValidator.valid`, async () => {
    jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    const passInput = tree.root.findByProps({ 'data-testid': `ChangePasswordEnterNewForm.password` });
    const confirmPassInput = tree.root.findByProps({ 'data-testid': `ChangePasswordEnterNewForm.password-confirm` });
    const changeValue = `somepass1`;
    const blurValue = `somepassB1`;

    await act(async () => {
      passInput.props.onChange({ target: { value: changeValue } });
      confirmPassInput.props.onChange({ target: { value: changeValue } });
    });

    const submit = tree.root.findByProps({ 'data-testid': `ChangePasswordEnterNewForm.submit` });

    await act(async () => {
      passInput.props.onBlur({ target: { value: blurValue } });
      confirmPassInput.props.onBlur({ target: { value: blurValue } });
    });

    await act(async () => {
      submit.props.onClick();
    });

    expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.ValidatedCreatePasswordCallback, blurValue);
    expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
  });

  describe(`handle input keydown event`, () => {
    beforeEach(() => {
      applyActionCallbackMock = jest.fn();
    });

    it(`should call setCallbackValue & applyActionCallback on submit, when ENTER key is pressed`, async () => {
      jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

      act(() => {
        tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
      });

      const passwordInput = tree.root.findByProps({ 'data-testid': `ChangePasswordEnterNewForm.password` });
      const confirmPasswordInput = tree.root.findByProps({ 'data-testid': `ChangePasswordEnterNewForm.password-confirm` });

      const value = `somepass1`;

      await act(async () => {
        passwordInput.props.onChange({ target: { value } });
        confirmPasswordInput.props.onChange({ target: { value } });
      });

      expect(applyActionCallbackMock).not.toHaveBeenCalled();

      const input = tree.root.findByProps({ 'data-testid': `ChangePasswordEnterNewForm.password` });

      act(() => {
        input.props.onKeyDown({ key: ENTER_KEY });
      });

      expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
      expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.ValidatedCreatePasswordCallback, value);
      expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
    });

    it(`should not call setCallbackValue & applyActionCallback, when ENTER key is pressed but input is invalid`, async () => {
      jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

      act(() => {
        tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
      });

      const passwordInput = tree.root.findByProps({ 'data-testid': `ChangePasswordEnterNewForm.password` });

      const value = `somepass1`;

      await act(async () => {
        passwordInput.props.onChange({ target: { value } });
      });

      const input = tree.root.findByProps({ 'data-testid': `ChangePasswordEnterNewForm.password` });

      act(() => {
        input.props.onKeyDown({ key: ENTER_KEY });
      });

      expect(setCallbackValueMock).not.toHaveBeenCalled();
      expect(applyActionCallbackMock).not.toHaveBeenCalled();
    });

    it(`should not call setCallbackValue & applyActionCallback on submit, when non ENTER key is pressed`, async () => {
      jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

      act(() => {
        tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
      });

      const passwordInput = tree.root.findByProps({ 'data-testid': `ChangePasswordEnterNewForm.password` });
      const confirmPasswordInput = tree.root.findByProps({ 'data-testid': `ChangePasswordEnterNewForm.password-confirm` });

      const value = `somepass1`;

      await act(async () => {
        passwordInput.props.onChange({ target: { value } });
        confirmPasswordInput.props.onChange({ target: { value } });
      });

      expect(applyActionCallbackMock).not.toHaveBeenCalled();

      const input = tree.root.findByProps({ 'data-testid': `ChangePasswordEnterNewForm.password` });

      act(() => {
        input.props.onKeyDown({ key: `Alt` });
      });

      expect(setCallbackValueMock).not.toHaveBeenCalled();
      expect(applyActionCallbackMock).not.toHaveBeenCalled();
    });
  });
});
