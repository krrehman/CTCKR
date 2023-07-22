import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  FormGroup,
  FormLabel,
  FormControl,
  Button,
  Validators,
  useValidator,
  ValidationErrorMessage,
  useTestId,
  Text
} from '@cmctechnology/phoenix-stockbroking-web-design';
import { IFormProps } from './Form';
import { ENTER_KEY } from '../../constants/constants';
import { DateSelector } from '../DateSelector';
import { DayMonthYear } from '@cmctechnology/phoenix-stockbroking-api-client';

const SubmitButton = styled(Button)`
  width: 10.5rem;
`;

const LastNameInput = styled(FormControl)`
  padding: 0.75rem;
`;

const FirstNameInput = styled(FormControl)`
  padding: 0.75rem;
`;

const DetailsText = styled(Text)`
  text-align: center;
`;

export const ButtonGroup = styled(FormGroup)`
  display: flex;
  justify-content: flex-start;
`;

export const ForgotUsernameDetailsForm: React.FC<IFormProps> = ({ step, applyActionCallback, ...rest }): JSX.Element => {
  const { t } = useTranslation();
  const firstNameValidator = useValidator<string>(``, Validators.required(t(`Please enter your first name`)));
  const lastNameValidator = useValidator<string>(``, Validators.required(t(`Please enter your last name`)));
  /* istanbul ignore next */
  const birthDateValidator = useValidator<DayMonthYear>(
    {} as DayMonthYear,
    Validators.custom((value: DayMonthYear) => !!value.day && !!value.month && !!value.year, t(`date string is invalid`))
  );
  const { generateTestId } = useTestId(rest, `ForgotUsernameDetailsForm`);

  const onSubmit = () => {
    if (firstNameValidator.valid && lastNameValidator.valid && birthDateValidator.valid) {
      applyActionCallback();
    }
  };

  const keyDownHandler = (e: React.KeyboardEvent) => {
    if (e.key === ENTER_KEY) {
      onSubmit();
    }
  };

  const firstNameInputChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await firstNameValidator.handleEvent(e.target.value);
    step.callbacks[0].setInputValue(firstNameValidator.value);
  };

  const lastNameInputChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await lastNameValidator.handleEvent(e.target.value);
    step.callbacks[1].setInputValue(lastNameValidator.value);
  };

  return (
    <>
      <FormGroup>
        <FormLabel>{t(`First Name`)}</FormLabel>
        <FirstNameInput
          placeholder={t(`Enter your first name`)}
          value={firstNameValidator.value}
          onChange={firstNameInputChangeHandler}
          onKeyDown={keyDownHandler}
          onBlur={firstNameInputChangeHandler}
          invalid={firstNameValidator.invalid}
          {...generateTestId(`firstName`)}
        />
        <ValidationErrorMessage validator={firstNameValidator} />
      </FormGroup>
      <FormGroup>
        <FormLabel>{t(`Last Name`)}</FormLabel>
        <LastNameInput
          placeholder={t(`Enter your last name`)}
          value={lastNameValidator.value}
          onChange={lastNameInputChangeHandler}
          onKeyDown={keyDownHandler}
          onBlur={lastNameInputChangeHandler}
          invalid={lastNameValidator.invalid}
          {...generateTestId(`lastName`)}
        />
        <ValidationErrorMessage validator={lastNameValidator} />
      </FormGroup>
      <FormGroup>
        <FormLabel>{t(`Date of birth`)}</FormLabel>
        <DateSelector
          onChange={async (date) => {
            await birthDateValidator.handleEvent(date);
            const dateStr = `${date.year}-${date.month}-${date.day}`;
            step.callbacks[2].setInputValue(dateStr);
          }}
          {...generateTestId(`dateSelector`)}
        />
        <ValidationErrorMessage validator={lastNameValidator} />
      </FormGroup>
      <FormGroup>
        <DetailsText>
          {t(
            `If details match we will send an email to your registered address with the account username. If you do not receive this please call client services.`
          )}
        </DetailsText>
      </FormGroup>
      <ButtonGroup>
        <SubmitButton label={t(`Submit`)} type='submit' onClick={onSubmit} {...generateTestId(`submit`)} validators={[firstNameValidator, lastNameValidator]} />
      </ButtonGroup>
    </>
  );
};
