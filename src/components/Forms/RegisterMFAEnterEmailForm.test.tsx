import renderer, { act } from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { themeCmcLight, useValidator } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { IFormProps } from './Form';
import { ENTER_KEY } from '../../constants/constants';
import { RegisterMFAEnterEmailForm } from './RegisterMFAEnterEmailForm';

jest.mock(`@cmctechnology/phoenix-stockbroking-web-design`, () => ({
  ...jest.requireActual(`@cmctechnology/phoenix-stockbroking-web-design`),
  useValidator: jest.fn()
}));

const callbacks = [
  {
    input: [{ name: `IDToken1`, value: ``, IDToken1validateOnly: false }],
    output: [
      { name: `name`, value: `mail` },
      { name: `prompt`, value: `Email Address` },
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

describe(`RegisterMFAEnterEmailForm`, () => {
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
        <RegisterMFAEnterEmailForm {...props} />
      </BrowserRouter>
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should match snapshot`, () => {
      expect(renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />).toJSON()).toMatchSnapshot();
    });
  });

  it(`should call applyActionCallback if emailValidator.valid`, () => {
    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    const submit = tree.root.findByProps({ 'data-testid': `RegisterMFAEnterEmailForm.next` });

    act(() => {
      submit.props.onClick();
    });

    expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
  });

  it(`should not call applyActionCallback if emailValidator.invalid`, () => {
    const invalidMockValidator = { ...mockValidator };
    invalidMockValidator.valid = false;
    invalidMockValidator.invalid = true;
    invalidMockValidator.validate = () => Promise.resolve(false);

    (useValidator as jest.Mock).mockImplementation(() => invalidMockValidator);

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    expect(applyActionCallbackMock).not.toHaveBeenCalled();

    const input = tree.root.findByProps({ 'data-testid': `RegisterMFAEnterEmailForm.email` });

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

    const input = tree.root.findByProps({ 'data-testid': `RegisterMFAEnterEmailForm.email` });
    const value = `some-email`;

    act(() => {
      input.props.onChange({ target: { value } });
    });

    await new Promise(process.nextTick);

    expect(setCallbackValueMock).toHaveBeenCalledTimes(1);
    expect(setCallbackValueMock).toHaveBeenCalledWith(CMCFRSDK.CallbackType.StringAttributeInputCallback, value);
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

      const input = tree.root.findByProps({ 'data-testid': `RegisterMFAEnterEmailForm.email` });

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

      const input = tree.root.findByProps({ 'data-testid': `RegisterMFAEnterEmailForm.email` });

      act(() => {
        input.props.onKeyDown({ key: `Alt` });
      });

      expect(applyActionCallbackMock).not.toHaveBeenCalled();
    });
  });
});
