/**
 * LoginRetryForm
 * Part of 2FA login flow.
 *
 * Appear when step.getStage = ScreenStage.LoginRetry (see in ScreenStage enums).
 * Display a form for retrying login process.
 * Execute CallbackType.ChoiceCallback to submit retry.
 */

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { FlexColumn, IFormProps } from './Form';

export const Column = styled(FlexColumn)`
  align-items: center;
  gap: 1rem;
`;

export const LoginRetryForm: React.FC<IFormProps> = ({ step, applyActionCallback }): JSX.Element => {
  useEffect(() => {
    step.retry = true;
    step.setCallbackValue(CMCFRSDK.CallbackType.ChoiceCallback, 0);
    applyActionCallback();
  }, [step]);

  return <></>;
};
