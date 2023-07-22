/**
 * RequestMFARecoveryCodesForm
 * Part of 2FA PUSH request flow.
 *
 * Appear when step.getStage = ScreenStage.RequestMFARecoveryCodes (see in ScreenStage enums).
 * Execute CallbackType.NameCallback
 * Apply recovery code.
 */

import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { Text, Panel, FormControl, useValidator, Validators, useTestId, ValidationErrorMessage, Button } from '@cmctechnology/phoenix-stockbroking-web-design';
import { FlexColumn, IFormProps } from './Form';
import { ENTER_KEY } from '../../constants/constants';

const ContentColumn = styled(FlexColumn)`
  gap: 1rem;
  align-items: center;
  ${Text} {
    text-align: center;
  }
`;

const SubmitColumn = styled(FlexColumn)`
  align-items: flex-start;
  width: 100%;
  margin-bottom: 2rem;
`;

const FooterColumn = styled(FlexColumn)`
  width: 100%;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  padding: 0 2rem 2rem;
  box-sizing: border-box;
`;

const PhoneBlock = styled(Panel)`
  box-sizing: border-box;
  padding: 1.25rem;
  width: 100%;
  align-items: center;
  border-radius: 0.25rem;
`;

export const SubmitButton = styled(Button)`
  max-width: 7rem;
  margin-top: 1rem;
`;

export const CodeInput = styled(FormControl)`
  padding: 0.75rem;
`;

export const RequestMFARecoveryCodesForm: React.FC<IFormProps> = ({ step, applyActionCallback, ...rest }): JSX.Element => {
  const { t } = useTranslation();
  const { generateTestId } = useTestId(rest, `RequestMFARecoveryCodesForm`);
  const codeValidator = useValidator<string>(``, Validators.required(t(`Please enter a recovery code`)));

  const onSubmit = () => {
    if (codeValidator.valid) {
      applyActionCallback();
    }
  };

  const codeInputChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await codeValidator.handleEvent(e.target.value);
    step.setCallbackValue(CMCFRSDK.CallbackType.NameCallback, e.target.value);
  };

  const keyDownHandler = (e: React.KeyboardEvent) => {
    if (e.key === ENTER_KEY) {
      onSubmit();
    }
  };

  return (
    <>
      <ContentColumn>
        <Text>{t(`Please enter a recovery code provided when setting up MFA to continue logging in.`)}</Text>
        <SubmitColumn>
          <CodeInput
            placeholder={t(`Enter your recovery code`)}
            value={codeValidator.value}
            onChange={codeInputChangeHandler}
            onKeyDown={keyDownHandler}
            {...generateTestId(`code`)}
          />
          <ValidationErrorMessage validator={codeValidator} />
          <SubmitButton label={t(`Submit`)} onClick={onSubmit} {...generateTestId(`submit`)} validators={[codeValidator]} />
        </SubmitColumn>
      </ContentColumn>
      <FooterColumn>
        <Text>
          <b>{t(`Don't have your recovery codes?`)}</b>
        </Text>
        <PhoneBlock>
          <Text>
            <b>{t(`Phone: `)}</b> {t(`1300 360 071`)}
          </Text>
        </PhoneBlock>
      </FooterColumn>
    </>
  );
};
