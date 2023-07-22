import renderer, { act } from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import { themeCmcLight, useValidator } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { IFormProps } from './Form';
import { ENTER_KEY } from '../../constants/constants';
import { ChangeUsernameEnterForm } from './ChangeUsernameEnterForm';

jest.mock(`@cmctechnology/phoenix-stockbroking-web-design`, () => ({
  ...jest.requireActual(`@cmctechnology/phoenix-stockbroking-web-design`),
  useValidator: jest.fn()
}));

const callbacks = [
  {
    input: [{ name: `IDToken1`, value: ``, IDToken1validateOnly: false }],
    output: [
      {
        name: `policies`,
        value: {
          conditionalPolicies: undefined,
          fallbackPolicies: undefined,
          name: `userName`,
          policies: [
            { policyId: `required`, policyRequirements: [`REQUIRED`] },
            { policyId: `valid-type`, policyRequirements: [`VALID_TYPE`], params: { types: [`string`] } },
            { policyId: `valid-username`, policyRequirements: [`VALID_ISERNAME`] },
            { policyId: `cannot-contain-characters`, policyRequirements: [`CANNOT_CONTAIN_CHARACTERS`], params: { forbiddenChars: `/*|` } },
            { policyId: `minimum-length`, policyRequirements: [`MIN_LENGTH`], params: { minLength: 1 } },
            { policyId: `maximum-length`, policyRequirements: [`MAX_LENGTH`], params: { maxLength: 255 } }
          ]
        }
      },
      { name: `failedPolicies`, value: [] },
      { name: `validateOnly`, value: false },
      { name: `prompt`, value: `Username` }
    ],
    type: CMCFRSDK.CallbackType.ValidatedCreateUsernameCallback
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

describe(`ChangeUsernameEnterForm`, () => {
  let frStep: CMCFRSDK.FRStep;
  let tree: ReturnType<typeof renderer.create>;
  let applyActionCallbackMock: jest.Mock;
  let setCallbackValueMock: jest.Mock;

  beforeEach(() => {
    (useValidator as jest.Mock).mockImplementation(() => mockValidator);
    frStep = new CMCFRSDK.FRStep(step);
    applyActionCallbackMock = jest.fn();
    setCallbackValueMock = jest.fn();
  });

  const ComponentToRender = (props: IFormProps) => (
    <ThemeProvider theme={themeCmcLight}>
      <BrowserRouter>
        <ChangeUsernameEnterForm {...props} />
      </BrowserRouter>
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should match snapshot`, () => {
      expect(renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />).toJSON()).toMatchSnapshot();
    });
  });

  it(`should call applyActionCallback if usernameValidator.valid`, () => {
    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    const submit = tree.root.findByProps({ 'data-testid': `ChangeUsernameEnterForm.submit` });

    act(() => {
      submit.props.onClick();
    });

    expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
  });

  it(`should not call applyActionCallback if usernameValidator.invalid`, () => {
    const invalidMockValidator = { ...mockValidator };
    invalidMockValidator.valid = false;
    invalidMockValidator.invalid = true;
    invalidMockValidator.validate = () => Promise.resolve(false);

    (useValidator as jest.Mock).mockImplementation(() => invalidMockValidator);

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    expect(applyActionCallbackMock).not.toHaveBeenCalled();

    const input = tree.root.findByProps({ 'data-testid': `ChangeUsernameEnterForm.username` });

    act(() => {
      input.props.onKeyDown({ key: ENTER_KEY });
    });

    expect(applyActionCallbackMock).not.toHaveBeenCalled();
  });

  it(`should call setCallbackValue on input change`, async () => {
    jest.spyOn(frStep, `setCallbackValue`).mockImplementation(setCallbackValueMock);

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    const input = tree.root.findByProps({ 'data-testid': `ChangeUsernameEnterForm.username` });
    const value = `some-username`;

    act(() => {
      input.props.onChange({ target: { value } });
    });

    await new Promise(process.nextTick);

    expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.ValidatedCreateUsernameCallback, value);
  });

  describe(`handle input keydown event`, () => {
    beforeEach(() => {
      applyActionCallbackMock = jest.fn();
    });

    it(`should call applyActionCallback on submit, when ENTER key is pressed on code input`, () => {
      act(() => {
        tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
      });

      expect(applyActionCallbackMock).not.toHaveBeenCalled();

      const input = tree.root.findByProps({ 'data-testid': `ChangeUsernameEnterForm.username` });

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

      const input = tree.root.findByProps({ 'data-testid': `ChangeUsernameEnterForm.username` });

      act(() => {
        input.props.onKeyDown({ key: `Alt` });
      });

      expect(applyActionCallbackMock).not.toHaveBeenCalled();
    });
  });
});
