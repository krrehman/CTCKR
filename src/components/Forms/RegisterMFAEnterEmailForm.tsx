/**
 * RegisterMFAEnterEmailForm
 * Part of 2FA email registration flow.
 *
 * Appear when step.getStage = ScreenStage.RegisterMFAEnterEmail (see in ScreenStage enums).
 * Display 2FA  enter email screen.
 * Execute CallbackType.StringAttributeInputCallback to proceed to the next node.
 */

import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { FormControl, useValidator, Validators, useTestId, ValidationErrorMessage, Button, FormLabel } from '@cmctechnology/phoenix-stockbroking-web-design';
import { FlexColumn, IFormProps } from './Form';
import { ENTER_KEY } from '../../constants/constants';

const ContentColumn = styled(FlexColumn)`
  margin-top: 2rem;
  width: 100%;
  gap: 0.5rem;
`;

export const SubmitButton = styled(Button)`
  max-width: 7rem;
`;

export const Input = styled(FormControl)`
  padding: 0.75rem;
`;

export const RegisterMFAEnterEmailForm: React.FC<IFormProps> = ({ step, applyActionCallback, ...rest }): JSX.Element => {
  const { t } = useTranslation();
  const { generateTestId } = useTestId(rest, `RegisterMFAEnterEmailForm`);
  const emailValidator = useValidator<string>(``, Validators.required(t(`Please enter an email address`)), { debounceMs: 0 });

  const onSubmit = () => {
    if (emailValidator.valid) {
      applyActionCallback();
    }
  };

  const codeInputChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await emailValidator.handleEvent(e.target.value);
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
        <FormLabel>{t(`Email address`)}</FormLabel>
        <Input value={emailValidator.value} onChange={codeInputChangeHandler} onKeyDown={keyDownHandler} {...generateTestId(`email`)} />
        <ValidationErrorMessage validator={emailValidator} />
      </FlexColumn>
      <ContentColumn>
        <SubmitButton label={t(`Next`)} onClick={onSubmit} {...generateTestId(`next`)} validators={[emailValidator]} />
      </ContentColumn>
    </>
  );
};
