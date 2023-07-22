import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  FormGroup,
  FormLabel,
  FormControl,
  PasswordFormControl,
  Button,
  CheckBox,
  Validators,
  useValidator,
  ValidationErrorMessage,
  useTestId,
  Variant,
  Text
} from '@cmctechnology/phoenix-stockbroking-web-design';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { FlexRow, IFormProps, LinkButton } from './Form';
import { ENTER_KEY } from '../../constants/constants';
import { Page } from '@cmctechnology/webinvest-store-client';
import { pages } from '../../constants/pageConstants';

export const LoginButton = styled(Button)`
  width: 10.5rem;
`;

const PasswordInput = styled(PasswordFormControl)`
  padding: 0.75rem;
`;

export const UsernameInput = styled(FormControl)`
  padding: 0.75rem;
`;

export const LabelRow = styled(FlexRow)`
  justify-content: space-between;
  align-items: baseline;
  ${LinkButton} {
    font-size: 0.8125rem;
  }
`;

export const LoginForm: React.FC<IFormProps> = ({ step, previousStep, applyActionCallback, ...rest }): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isAccountCached, setIsAccountCached] = useState(false);
  const [showRetryError, setShowRetryError] = useState(false);

  const userNameValidator = useValidator<string>(``, Validators.required(t(`Please enter your username`)), { debounceMs: 0 });
  const passwordValidator = useValidator<string>(``, Validators.required(t(`Please enter your password`)), { debounceMs: 0 });
  const { generateTestId } = useTestId(rest, `LoginForm`);

  useEffect(() => {
    if (previousStep?.retry) {
      setShowRetryError(true);
    }
  }, [step]);

  const onSubmit = (shiftKey: boolean) => {
    if (userNameValidator.valid && passwordValidator.valid) {
      step.setCallbackValue(CMCFRSDK.CallbackType.NameCallback, userNameValidator.value);
      step.setCallbackValue(CMCFRSDK.CallbackType.PasswordCallback, passwordValidator.value);
      applyActionCallback(shiftKey);
    }
  };

  const keyDownHandler = (e: React.KeyboardEvent) => {
    if (e.key === ENTER_KEY && userNameValidator.valid && passwordValidator.valid) {
      onSubmit(e.shiftKey);
    }
  };

  const usernameInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (showRetryError) {
      setShowRetryError(false);
    }
    userNameValidator.handleEvent(e.target.value);
  };

  const passwordInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (showRetryError) {
      setShowRetryError(false);
    }
    passwordValidator.handleEvent(e.target.value);
  };

  return (
    <>
      <FormGroup>
        <LabelRow>
          <FormLabel>{t(`Username`)}</FormLabel>
          <LinkButton type='button' onClick={() => navigate(`../${pages[Page.ForgotUsername].path}`)} {...generateTestId(`forgotUsername`)}>
            {t(`Forgot username?`)}
          </LinkButton>
        </LabelRow>
        <UsernameInput
          placeholder={t(`Enter your username`)}
          value={userNameValidator.value}
          onChange={usernameInputChangeHandler}
          onKeyDown={keyDownHandler}
          onBlur={usernameInputChangeHandler}
          invalid={userNameValidator.invalid}
          {...generateTestId(`username`)}
        />
        <ValidationErrorMessage validator={userNameValidator} />
      </FormGroup>
      <FormGroup>
        <LabelRow>
          <FormLabel>{t(`Password`)}</FormLabel>
          <LinkButton type='button' onClick={() => navigate(`../${pages[Page.ForgotPassword].path}`)} {...generateTestId(`forgotPassword`)}>
            {t(`Forgot password?`)}
          </LinkButton>
        </LabelRow>
        <PasswordInput
          placeholder={t(`Enter your password`)}
          value={passwordValidator.value}
          onChange={passwordInputChangeHandler}
          onKeyDown={keyDownHandler}
          onBlur={passwordInputChangeHandler}
          invalid={passwordValidator.invalid}
          {...generateTestId(`password`)}
        />
        <ValidationErrorMessage validator={passwordValidator} />
      </FormGroup>
      {showRetryError && (
        <Text variant={Variant.Error} {...generateTestId(`retryError`)}>
          {t(`Username or Password entered is incorrect.`)}
        </Text>
      )}
      <FormGroup>
        <LoginButton
          label={t(`Login`)}
          type='submit'
          onClick={(e: React.MouseEvent<HTMLElement>) => onSubmit(e.shiftKey)}
          {...generateTestId(`loginBtn`)}
          validators={[userNameValidator, passwordValidator]}
        />
      </FormGroup>
      <FormGroup>
        <CheckBox label={t(`Remember me`)} checked={isAccountCached} onChange={() => setIsAccountCached(!isAccountCached)} {...generateTestId(`rememberMe`)} />
      </FormGroup>
    </>
  );
};
