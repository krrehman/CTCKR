/**
 * ChangePasswordEnterNewForm
 * Part of Forgot Password request flow.
 *
 * Appear when step.getStage = ScreenStage.ChangePasswordEnterNew (see in ScreenStage enums).
 * Execute CallbackType.ValidatedCreatePasswordCallback (Apply new password).
 */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  FormGroup,
  FormLabel,
  PasswordFormControl,
  Text,
  useTestId,
  useValidator,
  Validators,
  Icon,
  Size,
  ValidationErrorMessage,
  Button,
  Variant
} from '@cmctechnology/phoenix-stockbroking-web-design';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { useTranslation } from 'react-i18next';
import { FlexRow, IFormProps } from './Form';
import { getPasswordValidationVariantAndIcon, passwordValidations } from '../../common/validations';
import { ENTER_KEY } from '../../constants/constants';

const PasswordInputWrapper = styled.div`
  width: 100%;
`;

const ConfirmPasswordInputWrapper = styled(PasswordInputWrapper)`
  margin-top: 1rem;
`;

const NoMarginTextSmall = styled(Text)`
  margin: 0;
`;

const ContentRow = styled(FlexRow)`
  margin-top: 2rem;
  width: 100%;
  gap: 1rem;
  align-items: center;
  justify-content: flex-start;
  ${Text} {
    text-align: left;
    flex: 1;
  }
`;

export const ChangePasswordEnterNewForm: React.FC<IFormProps> = ({ step, previousStep, applyActionCallback, ...rest }): JSX.Element => {
  const { t } = useTranslation();
  const { generateTestId } = useTestId(rest, `ChangePasswordEnterNewForm`);
  const [showRetryError, setShowRetryError] = useState(false);
  const passwordValidator = useValidator<string>(
    ``,
    Validators.required(t(`Password is invalid.`)).combine(passwordValidations.map((x) => Validators.match(x.regex, x.message(t), x.id))),
    { debounceMs: 0 }
  );

  const confirmPasswordValidator = useValidator(
    ``,
    Validators.custom((value) => passwordValidator.valid && value === passwordValidator.value, t(`Passwords do not match. Please try again.`)),
    { debounceMs: 0 }
  );

  useEffect(() => {
    if (previousStep?.retry) {
      setShowRetryError(true);
    }
  }, [step]);

  useEffect(() => {
    if (passwordValidator.validated && confirmPasswordValidator.validated) {
      confirmPasswordValidator.validate();
    }
  }, [passwordValidator.validated, passwordValidator.valid, passwordValidator.value]);

  const onSubmit = () => {
    if (confirmPasswordValidator.valid) {
      step.setCallbackValue(CMCFRSDK.CallbackType.ValidatedCreatePasswordCallback, confirmPasswordValidator.value);
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
          <b>{t(`New Login Password`)}</b>
        </FormLabel>
        <PasswordInputWrapper>
          <PasswordFormControl
            value={passwordValidator.value}
            placeholder={t('Enter your password')}
            onChange={(e) => {
              if (showRetryError) {
                setShowRetryError(false);
              }
              passwordValidator.handleEvent(e.target.value);
            }}
            onBlur={(e) => passwordValidator.handleEvent(e.target.value)}
            onKeyDown={keyDownHandler}
            invalid={passwordValidator.invalid}
            {...generateTestId(`password`)}
          />
        </PasswordInputWrapper>
        {passwordValidations.map((validation) => {
          const validationResult = passwordValidator.results.find((x) => x.id === validation.id);
          return (
            <NoMarginTextSmall key={validation.id} size={Size.Small}>
              <Icon {...getPasswordValidationVariantAndIcon(passwordValidator.validated, validationResult)} size={Size.Small} />
              {validation.message(t)}
            </NoMarginTextSmall>
          );
        })}
        <ConfirmPasswordInputWrapper>
          <FormLabel>
            <b>{t(`Confirm Login Password`)}</b>
          </FormLabel>
          <PasswordFormControl
            value={confirmPasswordValidator.value}
            placeholder={t('Confirm your password')}
            onChange={(e) => {
              if (showRetryError) {
                setShowRetryError(false);
              }
              confirmPasswordValidator.handleEvent(e.target.value);
            }}
            onBlur={(e) => confirmPasswordValidator.handleEvent(e.target.value)}
            onKeyDown={keyDownHandler}
            invalid={confirmPasswordValidator.invalid}
            {...generateTestId(`password-confirm`)}
          />
          <ValidationErrorMessage validator={confirmPasswordValidator} {...generateTestId(`validationError`)} />
        </ConfirmPasswordInputWrapper>
      </FormGroup>
      {showRetryError && (
        <Text variant={Variant.Error} {...generateTestId(`retryError`)}>
          {t(`Selected password is invalid. Please try again.`)}
        </Text>
      )}
      <ContentRow>
        <Button label={t(`Change Password`)} onClick={onSubmit} {...generateTestId(`submit`)} validators={[confirmPasswordValidator]} />
      </ContentRow>
    </>
  );
};
