/**
 * ChangeUsernameEnterForm
 * Part of Change Username request flow.
 *
 * Appear when step.getStage = ScreenStage.ChangeUsernameEnter (see in ScreenStage enums).
 * Execute CallbackType.ValidatedCreateUsernameCallback
 * Apply new username.
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
import { FlexColumn, FlexRow, IFormProps } from './Form';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { ENTER_KEY } from '../../constants/constants';

const ContentRow = styled(FlexRow)`
  margin-top: 1rem;
  width: 100%;
  gap: 1rem;
  align-items: center;
  justify-content: flex-end;
  ${Text} {
    text-align: left;
    flex: 1;
  }
`;

export const Input = styled(FormControl)`
  padding: 0.75rem;
`;

export const ChangeUsernameEnterForm: React.FC<IFormProps> = ({ step, applyActionCallback, ...rest }): JSX.Element => {
  const { t } = useTranslation();
  const { generateTestId } = useTestId(rest, `ChangeUsernameEnterForm`);
  const usernameValidator = useValidator<string>(``, Validators.required(t(`Please enter a username`)));

  const onSubmit = () => {
    if (usernameValidator.valid) {
      applyActionCallback();
    }
  };

  const codeInputChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await usernameValidator.handleEvent(e.target.value);
    step.setCallbackValue(CMCFRSDK.CallbackType.ValidatedCreateUsernameCallback, e.target.value);
  };

  const keyDownHandler = (e: React.KeyboardEvent) => {
    if (e.key === ENTER_KEY) {
      onSubmit();
    }
  };

  return (
    <>
      <FlexColumn>
        <FormLabel>{t(`Enter New Username`)}</FormLabel>
        <Input
          placeholder={t(`Username`)}
          value={usernameValidator.value}
          onChange={codeInputChangeHandler}
          onKeyDown={keyDownHandler}
          {...generateTestId(`username`)}
        />
      </FlexColumn>
      <ContentRow>
        <ValidationErrorMessage validator={usernameValidator} />
        <Button label={t(`Confirm Change Username`)} onClick={onSubmit} {...generateTestId(`submit`)} validators={[usernameValidator]} />
      </ContentRow>
    </>
  );
};
