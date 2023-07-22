import { DayMonthYear } from '@cmctechnology/phoenix-stockbroking-api-client';
import {
  breakpoint,
  FormCol,
  FormRow,
  ISelectOption,
  Select,
  useTestId,
  useValidator,
  Validators,
  createFilter,
  NumericFormControl
} from '@cmctechnology/phoenix-stockbroking-web-design';
import { IInputProps } from '@cmctechnology/phoenix-stockbroking-web-design/dist/js/Forms/Input/Input';
import styled from 'styled-components';
import { forwardRef, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { mapKeyValueTranslatedToOption } from '../common/mappings';
import { MONTHS } from '../constants/constants';

const DAY_REGEX = /^(0?[1-9]|[12]\d|3[01])$/;
const YEAR_REGEX = /^\d{4}$/;
const DAY_MAX_LENGTH = 2;
const YEAR_MAX_LENGTH = 4;
const DATE_INDIVIDUAL_COMPONENT_WIDTH_PERCENTAGE = 30;
const DATE_MONTH_COMPONENT_WIDTH_PERCENTAGE = 40;

const MIN_POSITIVE_VALUE = 1;

const filterByStartWith = createFilter({
  matchFrom: `start`
});

export interface IDateProps {
  onChange: (value: DayMonthYear) => void;
}

const MonthSelect = styled(Select)`
  @media (max-width: ${breakpoint.mobileSmall}) {
    .react-select__single-value {
      padding-left: 2rem;
    }
  }
  .react-select__placeholder {
    padding-left: 2rem;
  }
`;

const PositiveNumericFormControl = forwardRef<HTMLInputElement, Omit<IInputProps, 'ref' | 'type' | 'min'>>(function NumericInput(props, ref) {
  return <NumericFormControl min={MIN_POSITIVE_VALUE} {...props} ref={ref} />;
});

export const DateSelector: React.FC<IDateProps> = ({ onChange, ...rest }) => {
  const { t } = useTranslation();
  const { generateTestId } = useTestId(rest, `DateSelector`);
  const yearInputRef = useRef<HTMLInputElement | null>(null);

  const monthsSelectOptions = Object.keys(MONTHS)
    .sort((a, b) => a.localeCompare(b) - 1)
    .map((x) => mapKeyValueTranslatedToOption(MONTHS, x, t));
  const dayValidator = useValidator<string>(``, Validators.required(``).match(DAY_REGEX, ``), { debounceMs: 0 });
  const monthValidator = useValidator<string>(``, Validators.required(``), { debounceMs: 0 });
  const yearValidator = useValidator<string>(``, Validators.required(``).match(YEAR_REGEX, ``), { debounceMs: 0 });

  const handleDayChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const day = e.target.value.slice(0, DAY_MAX_LENGTH);
    await dayValidator.handleEvent(day);
  };

  const handleMonthChange = async (option: any) => {
    const month = (option as ISelectOption)?.value;
    await monthValidator.handleEvent(month);
    /* istanbul ignore next */
    if (!yearValidator.value) {
      yearInputRef.current?.focus();
    }
  };

  const handleYearChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = e.target.value.slice(0, YEAR_MAX_LENGTH);
    await yearValidator.handleEvent(year);
  };

  useEffect(() => {
    onChange({ day: dayValidator.value, month: monthValidator.value, year: yearValidator.value });
  }, [dayValidator.value, monthValidator.value, yearValidator.value, dayValidator.validated, monthValidator.validated, yearValidator.validated]);

  return (
    <FormRow>
      <FormCol percentWidth={DATE_INDIVIDUAL_COMPONENT_WIDTH_PERCENTAGE}>
        <PositiveNumericFormControl
          textAlign='center'
          placeholder={t(`DD`)}
          value={dayValidator.value}
          onChange={handleDayChange}
          onBlur={handleDayChange}
          invalid={dayValidator.invalid}
          {...generateTestId(`day`)}
        />
      </FormCol>
      <FormCol percentWidth={DATE_MONTH_COMPONENT_WIDTH_PERCENTAGE}>
        <MonthSelect
          value={monthsSelectOptions.find((x) => x.value === monthValidator.value)}
          options={monthsSelectOptions}
          onChange={handleMonthChange}
          onBlur={async () => {
            await monthValidator.validate();
          }}
          placeholder={t(`Month`)}
          invalid={monthValidator.invalid}
          filterOption={filterByStartWith}
          textAlign='center'
          {...generateTestId(`month`)}
        />
      </FormCol>
      <FormCol percentWidth={DATE_INDIVIDUAL_COMPONENT_WIDTH_PERCENTAGE}>
        <PositiveNumericFormControl
          textAlign='center'
          placeholder={t(`YYYY`)}
          value={yearValidator.value}
          onChange={handleYearChange}
          onBlur={handleYearChange}
          invalid={yearValidator.invalid}
          {...generateTestId(`year`)}
          ref={yearInputRef}
        />
      </FormCol>
    </FormRow>
  );
};
