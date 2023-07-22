/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable unicorn/consistent-function-scoping */
import 'jest-extended/all';
import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';
import { IGroupedOption, ISelectOption, ISelectProps } from '@cmctechnology/phoenix-stockbroking-web-design';
import 'jest-styled-components';
import { toMatchDiffSnapshot } from 'snapshot-diff';

expect.extend({ toMatchDiffSnapshot });
// @ts-ignore
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({
    t: (value: string) => value,
    i18n: {
      changeLanguage: () => new Promise(() => {})
    }
  }),
  Trans: () => <>Trans</>
}));

jest.mock('@cmctechnology/phoenix-stockbroking-web-design', () => ({
  ...jest.requireActual('@cmctechnology/phoenix-stockbroking-web-design'),
  Select: jest.requireActual('react').forwardRef(function Select({ options = [], value, onChange, onBlur, loadOptions }: ISelectProps, ref: any) {
    let list: ISelectOption[] = options.reduce(
      (a, b) => ((b as IGroupedOption).options ? [...a, ...(b as IGroupedOption).options] : [...a, b as ISelectOption]),
      [] as ISelectOption[]
    );

    // Simulates a pre-selection on asynchronous searches
    if (value && loadOptions) {
      list.push(value);
    }
    return (
      <select
        ref={ref}
        value={value?.value}
        onChange={async (e) => {
          if (loadOptions) {
            const loadedOptions = await loadOptions(e.target.value);
            list = loadedOptions.map((x) => x as ISelectOption);
          }

          if (onChange) {
            onChange(list.find((x) => x.value === e.target.value));
          }
        }}
        onBlur={onBlur}
      >
        {list.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  })
}));

jest.mock('lightweight-charts', () => ({
  createChart: () => {
    return {
      addLineSeries: () => ({ applyOptions: jest.fn(), setData: jest.fn() }),
      remove: jest.fn(),
      timeScale: () => ({
        applyOptions: jest.fn()
      })
    };
  }
}));
