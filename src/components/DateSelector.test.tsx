import renderer from 'react-test-renderer';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { act } from 'react-dom/test-utils';

import { DateSelector } from './DateSelector';

describe(`DateSelector`, () => {
  let tree: ReturnType<typeof renderer.create>;
  let mockedOnChange: jest.Mock;
  beforeEach(() => (mockedOnChange = jest.fn()));

  const ComponentToRender = () => (
    <ThemeProvider theme={themeCmcLight}>
      <DateSelector onChange={mockedOnChange} />
    </ThemeProvider>
  );

  it(`should call onChange`, async () => {
    tree = renderer.create(<ComponentToRender />);
    const dayField = tree.root.findByProps({ 'data-testid': `DateSelector.day` });
    const monthField = tree.root.findByProps({ 'data-testid': `DateSelector.month` });
    const yearField = tree.root.findByProps({ 'data-testid': `DateSelector.year` });

    await act(async () => {
      dayField.props.onBlur({ target: { value: `10` } });
      monthField.props.onBlur();
      yearField.props.onBlur({ target: { value: `2001` } });

      dayField.props.onChange({ target: { value: `20` } });
      monthField.props.onChange({
        label: `October`,
        value: `10`
      });
      yearField.props.onChange({ target: { value: `2000` } });
    });

    await new Promise(process.nextTick);

    expect(mockedOnChange).toHaveBeenCalledWith({ day: `20`, month: `10`, year: `2000` });
  });
});
