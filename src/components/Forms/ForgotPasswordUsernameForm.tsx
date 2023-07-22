/**
 * ForgotPasswordUsernameForm
 * Part of Forgot Password request flow.
 *
 * Appear when step.getStage = ScreenStage.ForgotPasswordUsername (see in ScreenStage enums).
 * Execute CallbackType.StringAttributeInputCallback
 * Apply username.
 */

import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  Text,
  FormControl,
  useValidator,
  Validators,
  useTestId,
  ValidationErrorMessage,
  Button,
  FormLabel
} from '@cmctechnology/phoenix-stockbroking-web-design';
import { FlexColumn, IFormProps } from './Form';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { ENTER_KEY } from '../../constants/constants';

const ContentColumn = styled(FlexColumn)`
  margin-top: 1rem;
  width: 100%;
  gap: 1rem;
  align-items: left;
  justify-content: center;
  ${Text} {
    margin-left: 0;
    text-align: left;
  }
`;

export const SubmitButton = styled(Button)`
  max-width: 7rem;
`;

export const Input = styled(FormControl)`
  padding: 0.75rem;
`;

export const ForgotPasswordUsernameForm: React.FC<IFormProps> = ({ step, applyActionCallback, ...rest }): JSX.Element => {
  const { t } = useTranslation();
  const { generateTestId } = useTestId(rest, `ForgotPasswordUsernameForm`);
  const usernameValidator = useValidator<string>(``, Validators.required(t(`Please enter a username`)));

  const onSubmit = () => {
    if (usernameValidator.valid) {
      applyActionCallback();
    }
  };

  const codeInputChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await usernameValidator.handleEvent(e.target.value);
    step.setCallbackValue(CMCFRSDK.CallbackType.StringAttributeInputCallback, e.target.value);
  };

  const keyDownHandler = (e: React.KeyboardEvent) => {
    if (e.key === ENTER_KEY) {
      onSubmit();
    }
  };

  return (
    <>
      <FlexColumn>
        <FormLabel>{t(`Username`)}</FormLabel>
        <Input
          placeholder={t(`Enter your username`)}
          value={usernameValidator.value}
          onChange={codeInputChangeHandler}
          onKeyDown={keyDownHandler}
          {...generateTestId(`username`)}
        />
        <ValidationErrorMessage validator={usernameValidator} />
      </FlexColumn>
      <ContentColumn>
        <SubmitButton label={t(`Submit`)} onClick={onSubmit} {...generateTestId(`submit`)} validators={[usernameValidator]} />
      </ContentColumn>
    </>
  );
};
