/**
 * InnerOTPDecisionForm
 * Part of 2FA EMAIL registration flow.
 *
 * Appear when step.getStage = ScreenStage.InnerOTPDecision (see in ScreenStage enums).
 * Execute CallbackType.PasswordCallback (Submit case - Apply verification code from email).
 * Execute CallbackType.PasswordCallback (Resend case - Apply long RESEND_FLOW_INVALID_CODE to trigger resend flow on InnerOTPResendOptionForm).
 */

import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Text, VerificationCode, breakpoint, ButtonLink, useTestId, Size, Variant } from '@cmctechnology/phoenix-stockbroking-web-design';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { FlexColumn, IFormProps } from './Form';
import { CODE_RESEND_STORAGE_NAME, CODE_SUBMIITED_STORAGE_NAME } from '../../constants/constants';

const StyledVerificationCode = styled(VerificationCode)`
  margin-top: 2rem;
  margin-bottom: 0.625rem;

  & input {
    height: 3.5rem;
  }

  @media (max-width: ${breakpoint.mobile}) {
    gap: 0.5rem;
  }
`;

const ContentColumn = styled(FlexColumn)`
  ${Text} {
    margin-left: 0;
  }
`;

const ResendBlock = styled.span`
  margin-top: 1rem;
  display: inline-block;
`;

const ResendButton = styled(ButtonLink)`
  font-size: 10.5pt;
`;

const AUTHENTICATION_CODE_LENGTH = 6;
const RESEND_FLOW_INVALID_CODE = `00000000`;

export const InnerOTPDecisionForm: React.FC<IFormProps> = ({ step, previousStep, applyActionCallback, ...rest }): JSX.Element => {
  const { t } = useTranslation();
  const { generateTestId } = useTestId(rest, `InnerOTPDecisionForm`);

  const isInProgress = false;

  const onCodeChanged = (code: string) => {
    if (code.length !== AUTHENTICATION_CODE_LENGTH) return;
    sessionStorage.setItem(CODE_SUBMIITED_STORAGE_NAME, `true`);
    step.setCallbackValue(CMCFRSDK.CallbackType.PasswordCallback, code);
    applyActionCallback();
  };

  const onResendCode = () => {
    // This is a work around for showing both, verification and resend code functionality on the same screen.
    // Sets CODE_RESEND_STORAGE_NAME flag in session storage to mark that resend action is commenced.
    sessionStorage.setItem(CODE_RESEND_STORAGE_NAME, `true`);
    // Sets RESEND_FLOW_INVALID_CODE to step.
    // When FR backend receives long verification code, it redirects back to submit/resend verification code step.
    // On that step the client checks if CODE_RESEND_STORAGE_NAME flag is set to session storage.
    // If set, call resend callback and land back to this screen.
    step.setCallbackValue(CMCFRSDK.CallbackType.PasswordCallback, RESEND_FLOW_INVALID_CODE);
    // Apply action callback with long/invalid code.
    applyActionCallback();
  };

  return (
    <>
      <ContentColumn>
        <Text>{t(`Please enter the 6-digit verification code sent to your registered email address.`)}</Text>
        <StyledVerificationCode onChange={onCodeChanged} disabled={isInProgress} type='number' />
      </ContentColumn>
      {previousStep?.retry && (
        <Text size={Size.Large} variant={Variant.Error} {...generateTestId(`error`)}>
          {t(`Verification code entered is incorrect.`)}
        </Text>
      )}
      <Text>
        <ResendBlock>
          <b>{t(`Didn't receive a code?`)}</b>{' '}
          <ResendButton onClick={onResendCode} {...generateTestId(`resend`)}>
            {t(`Resend a new code`)}
          </ResendButton>
        </ResendBlock>
      </Text>
    </>
  );
};
