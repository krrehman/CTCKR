/**
 * InnerOTPResendOptionForm
 * Part of 2FA EMAIL registration flow.
 *
 * Appear when step.getStage = ScreenStage.InnerOTPResendOption (see in ScreenStage enums).
 * Skip step, call resend, or submit option.
 * Execute CallbackType.ChoiceCallback automatically based on localStorage CODE_RESEND_STORAGE_NAME.
 */

import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import React, { useEffect } from 'react';
import { CODE_RESEND_STORAGE_NAME, CODE_SUBMIITED_STORAGE_NAME } from '../../constants/constants';
import { IFormProps } from './Form';

export const InnerOTPResendOptionForm: React.FC<IFormProps> = ({ step, applyActionCallback }): JSX.Element => {
  useEffect(() => {
    const index = sessionStorage.getItem(CODE_RESEND_STORAGE_NAME) ? 1 : 0;
    if (sessionStorage.getItem(CODE_SUBMIITED_STORAGE_NAME)) step.retry = true;
    sessionStorage.removeItem(CODE_SUBMIITED_STORAGE_NAME);
    sessionStorage.removeItem(CODE_RESEND_STORAGE_NAME);
    step.setCallbackValue(CMCFRSDK.CallbackType.ChoiceCallback, index);
    applyActionCallback();
  }, [step]);

  return <></>;
};
