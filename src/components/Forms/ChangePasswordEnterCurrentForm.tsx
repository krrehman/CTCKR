/**
 * ChangePasswordEnterCurrent
 * Part of Change Password request flow.
 *
 * Appear when step.getStage = ScreenStage.ChangePasswordCurrentPassword (see in ScreenStage enums).
 * The case when user is logged in, their MFA is disabled and they attepmt to change password.
 * First they will be required to enter their current password.
 * Execute CallbackType.PasswordCallback (Apply new password).
 */
import React from 'react';
import styled from 'styled-components';
import {
  FormGroup,
  FormLabel,
  PasswordFormControl,
  Text,
  useTestId,
  useValidator,
  Validators,
  ValidationErrorMessage,
  Button,
  Size,
  Variant
} from '@cmctechnology/phoenix-stockbroking-web-design';
import { useTranslation } from 'react-i18next';
import { FlexRow, IFormProps } from './Form';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { ENTER_KEY } from '../../constants/constants';

const PasswordInputWrapper = styled.div`
  width: 100%;
`;

const ContentRow = styled(FlexRow)`
  margin-top: 1rem;
  width: 100%;
  gap: 1rem;
  align-items: center;
  justify-content: flex-start;
  ${Text} {
    text-align: left;
    flex: 1;
  }
`;

export const SubmitButton = styled(Button)`
  width: auto;
  padding: 0 2rem;
`;

export const ChangePasswordEnterCurrentForm: React.FC<IFormProps> = ({ step, previousStep, applyActionCallback, ...rest }): JSX.Element => {
  const { t } = useTranslation();
  const { generateTestId } = useTestId(rest, `ChangePasswordEnterCurrentForm`);
  const passwordValidator = useValidator<string>(``, Validators.required(t(`Please enter a valid password`)), { debounceMs: 0 });

  const onSubmit = () => {
    if (passwordValidator.valid) {
      step.setCallbackValue(CMCFRSDK.CallbackType.PasswordCallback, passwordValidator.value);
      applyActionCallback();
    }
  };

  const keyDownHandler = (e: React.KeyboardEvent) => {
    if (e.key === ENTER_KEY) {
      onSubmit();
    }
  };

  return (
    <>
      <FormGroup>
        <FormLabel>
          <b>{t(`Current Login Password`)}</b>
        </FormLabel>
        <PasswordInputWrapper>
          <PasswordFormControl
            value={passwordValidator.value}
            placeholder={t('Enter your password')}
            onChange={(e) => passwordValidator.handleEvent(e.target.value)}
            onBlur={(e) => passwordValidator.handleEvent(e.target.value)}
            onKeyDown={keyDownHandler}
            invalid={passwordValidator.invalid}
            {...generateTestId(`password`)}
          />
        </PasswordInputWrapper>
      </FormGroup>
      {previousStep?.retry && (
        <Text size={Size.Large} variant={Variant.Error} {...generateTestId(`error`)}>
          {t(`The selected password is invalid. Please retry!`)}
        </Text>
      )}
      <ContentRow>
        <SubmitButton label={t(`Next`)} onClick={onSubmit} {...generateTestId(`submit`)} />
        <ValidationErrorMessage validator={passwordValidator} />
      </ContentRow>
    </>
  );
};
