import renderer, { act } from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import { themeCmcLight, useValidator } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { IFormProps } from './Form';
import { ENTER_KEY } from '../../constants/constants';
import { ForgotUsernameDetailsForm } from './ForgotUsernameDetailsForm';

jest.mock(`@cmctechnology/phoenix-stockbroking-web-design`, () => ({
  ...jest.requireActual(`@cmctechnology/phoenix-stockbroking-web-design`),
  useValidator: jest.fn()
}));

const callbacks = [
  {
    input: [
      { name: `IDToken1`, value: `` },
      { name: `IDToken1validateOnly`, value: false }
    ],
    output: [
      { name: `name`, value: `givenName` },
      { name: `prompt`, value: `First Name` },
      { name: `required`, value: true },
      { name: 'policies', value: {} },
      { name: `failedPolicies`, value: [] },
      { name: `validateOnly`, value: false },
      { name: `value`, value: `` }
    ],
    type: CMCFRSDK.CallbackType.StringAttributeInputCallback
  },
  {
    input: [
      { name: `IDToken2`, value: `` },
      { name: `IDToken2validateOnly`, value: false }
    ],
    output: [
      { name: `name`, value: `sn` },
      { name: `prompt`, value: `Last Name` },
      { name: `required`, value: true },
      { name: 'policies', value: {} },
      { name: `failedPolicies`, value: [] },
      { name: `validateOnly`, value: false },
      { name: `value`, value: `` }
    ],
    type: CMCFRSDK.CallbackType.StringAttributeInputCallback
  },
  {
    input: [
      { name: `IDToken3`, value: `` },
      { name: `IDToken3validateOnly`, value: false }
    ],
    output: [
      { name: `name`, value: `frIndexedString3` },
      { name: `prompt`, value: `Date Of Birth` },
      { name: `required`, value: true },
      { name: 'policies', value: {} },
      { name: `failedPolicies`, value: [] },
      { name: `validateOnly`, value: false },
      { name: `value`, value: `` }
    ],
    type: CMCFRSDK.CallbackType.StringAttributeInputCallback
  }
];

const step: CMCFRSDK.Step = {
  callbacks
};

const mockValidator = {
  errorMessage: `some error`,
  handleEvent: jest.fn(),
  invalid: false,
  reset: jest.fn(),
  results: [],
  valid: true,
  validate: () => Promise.resolve(true),
  validating: false,
  value: `test-value-0`,
  validated: true
};

describe(`ForgotUsernameDetailsForm`, () => {
  let frStep: CMCFRSDK.FRStep;
  let tree: ReturnType<typeof renderer.create>;
  let applyActionCallbackMock: jest.Mock;
  let setFirstNameInputValueMock: jest.Mock;
  let setLastNameInputValueMock: jest.Mock;
  let setDOBInputValueMock: jest.Mock;

  beforeEach(() => {
    setFirstNameInputValueMock = jest.fn();
    setLastNameInputValueMock = jest.fn();
    setDOBInputValueMock = jest.fn();
    (useValidator as jest.Mock).mockImplementation(() => mockValidator);
    frStep = new CMCFRSDK.FRStep(step);
    frStep.callbacks[0].setInputValue = setFirstNameInputValueMock;
    frStep.callbacks[1].setInputValue = setLastNameInputValueMock;
    frStep.callbacks[2].setInputValue = setDOBInputValueMock;
    applyActionCallbackMock = jest.fn();
  });

  const ComponentToRender = (props: IFormProps) => (
    <ThemeProvider theme={themeCmcLight}>
      <BrowserRouter>
        <ForgotUsernameDetailsForm {...props} />
      </BrowserRouter>
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should match snapshot`, () => {
      expect(renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />).toJSON()).toMatchSnapshot();
    });
  });

  it(`should call applyActionCallback if firstNameValidator.valid, lastNameValidator.valid and birthDateValidator.valid`, () => {
    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    const submit = tree.root.findByProps({ 'data-testid': `ForgotUsernameDetailsForm.submit` });

    act(() => {
      submit.props.onClick();
    });

    expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
  });

  it(`should not call applyActionCallback if firstNameValidator.invalid`, () => {
    const invalidMockValidator = { ...mockValidator };
    invalidMockValidator.valid = false;
    invalidMockValidator.invalid = true;
    invalidMockValidator.validate = () => Promise.resolve(false);

    (useValidator as jest.Mock)
      .mockImplementationOnce(() => invalidMockValidator)
      .mockImplementationOnce(() => mockValidator)
      .mockImplementationOnce(() => mockValidator);

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    expect(applyActionCallbackMock).not.toHaveBeenCalled();

    const input = tree.root.findByProps({ 'data-testid': `ForgotUsernameDetailsForm.firstName` });

    act(() => {
      input.props.onKeyDown({ key: ENTER_KEY });
    });

    expect(applyActionCallbackMock).not.toHaveBeenCalled();
  });

  it(`should not call applyActionCallback if lastNameValidator.invalid`, () => {
    const invalidMockValidator = { ...mockValidator };
    invalidMockValidator.valid = false;
    invalidMockValidator.invalid = true;
    invalidMockValidator.validate = () => Promise.resolve(false);

    (useValidator as jest.Mock)
      .mockImplementationOnce(() => mockValidator)
      .mockImplementationOnce(() => invalidMockValidator)
      .mockImplementationOnce(() => mockValidator);

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    expect(applyActionCallbackMock).not.toHaveBeenCalled();

    const input = tree.root.findByProps({ 'data-testid': `ForgotUsernameDetailsForm.lastName` });

    act(() => {
      input.props.onKeyDown({ key: ENTER_KEY });
    });

    expect(applyActionCallbackMock).not.toHaveBeenCalled();
  });

  it(`should call setInputValue on firstName, lastName and DOB change`, async () => {
    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    await new Promise(process.nextTick);
    setDOBInputValueMock.mockClear();

    const firstNameInput = tree.root.findByProps({ 'data-testid': `ForgotUsernameDetailsForm.firstName` });
    const lastNameInput = tree.root.findByProps({ 'data-testid': `ForgotUsernameDetailsForm.lastName` });
    const dobInput = tree.root.findByProps({ 'data-testid': `ForgotUsernameDetailsForm.dateSelector` });

    act(() => {
      firstNameInput.props.onChange({ target: { value: mockValidator.value } });
      lastNameInput.props.onChange({ target: { value: mockValidator.value } });
      dobInput.props.onChange({ day: `10`, month: `9`, year: `2000` });
    });

    await new Promise(process.nextTick);

    expect(setFirstNameInputValueMock).toHaveBeenCalledTimes(1);
    expect(setFirstNameInputValueMock).toHaveBeenCalledWith(mockValidator.value);
    expect(setLastNameInputValueMock).toHaveBeenCalledTimes(1);
    expect(setLastNameInputValueMock).toHaveBeenCalledWith(mockValidator.value);
    expect(setDOBInputValueMock).toHaveBeenCalledTimes(1);
    expect(setDOBInputValueMock).toHaveBeenCalledWith(`2000-9-10`);
  });

  describe(`handle input keydown event`, () => {
    beforeEach(() => {
      applyActionCallbackMock = jest.fn();
    });

    it(`should call applyActionCallback on submit, when ENTER key is pressed on first name input`, () => {
      act(() => {
        tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
      });

      expect(applyActionCallbackMock).not.toHaveBeenCalled();

      const input = tree.root.findByProps({ 'data-testid': `ForgotUsernameDetailsForm.firstName` });

      act(() => {
        input.props.onKeyDown({ key: ENTER_KEY });
      });

      expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
    });

    it(`should call applyActionCallback on submit, when ENTER key is pressed on last name input`, () => {
      act(() => {
        tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
      });

      expect(applyActionCallbackMock).not.toHaveBeenCalled();

      const input = tree.root.findByProps({ 'data-testid': `ForgotUsernameDetailsForm.lastName` });

      act(() => {
        input.props.onKeyDown({ key: ENTER_KEY });
      });

      expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
    });

    it(`should not call applyActionCallback on submit, when other key is pressed`, () => {
      act(() => {
        tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
      });

      expect(applyActionCallbackMock).not.toHaveBeenCalled();

      const input = tree.root.findByProps({ 'data-testid': `ForgotUsernameDetailsForm.firstName` });

      act(() => {
        input.props.onKeyDown({ key: `Alt` });
      });

      expect(applyActionCallbackMock).not.toHaveBeenCalled();
    });
  });
});
