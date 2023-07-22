/**
 * RetryActionForm
 *
 * Appear when step.getStage = ScreenStage.RetryActionForm (see in ScreenStage enums).
 * Skip step.
 * Execute CallbackType.ChoiceCallback automatically and set step.retry to true.
 */

import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import React, { useEffect } from 'react';
import { IFormProps } from './Form';

export const RetryActionForm: React.FC<IFormProps> = ({ step, applyActionCallback }): JSX.Element => {
  useEffect(() => {
    step.retry = true;
    step.setCallbackValue(CMCFRSDK.CallbackType.ChoiceCallback, 0);
    applyActionCallback();
  }, [step]);

  return <></>;
};
