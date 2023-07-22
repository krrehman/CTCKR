/**
 * RequestMFAResultForm
 * Part of 2FA PUSH request flow.
 *
 * Appear when step.getStage = ScreenStage.RequestMFAOk || step.getStage = ScreenStage.RequestMFAFail (see in ScreenStage enums).
 * Display when received accept/reject action responce from a registered device.
 * Call setCallbackValue and applyActionCallback to after SCREEN_PAUSE_TIMEOUT is expired to proceed to next step.
 */

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Text, useTestId } from '@cmctechnology/phoenix-stockbroking-web-design';
import { FlexColumn, IFormProps } from './Form';
import icon_success from '../../assets/icon_success.svg';
import icon_error from '../../assets/icon_error.svg';
import { ScreenStage, CMCFRSDK } from '@cmctechnology/webinvest-store-client';

const ContentColumn = styled(FlexColumn)`
  padding: 2rem;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const ImgIcon = styled.img`
  width: 5rem;
  height: 5rem;
`;

const SCREEN_PAUSE_TIMEOUT = 2000;

export const RequestMFAResultForm: React.FC<IFormProps> = ({ step, applyActionCallback, ...rest }): JSX.Element => {
  const { generateTestId } = useTestId(rest, `RequestMFAResultForm`);
  const { t } = useTranslation();
  const stage = step.getStage();

  const timerRef = useRef(0);

  const clearTimer = () => {
    if (!!timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
  };

  const icon = stage === ScreenStage.RequestMFAOk ? icon_success : icon_error;
  const statusText = stage === ScreenStage.RequestMFAOk ? t(`Approved`) : t(`Declined`);
  const iconId = stage === ScreenStage.RequestMFAOk ? `icon-success` : `icon-error`;

  useEffect(() => {
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      step.setCallbackValue(CMCFRSDK.CallbackType.ChoiceCallback, 0);
      applyActionCallback();
    }, SCREEN_PAUSE_TIMEOUT);
    return () => clearTimer();
  }, []);

  return (
    <>
      <ContentColumn>
        <ImgIcon src={icon} {...generateTestId(iconId)} />
        <Text>
          <b>{statusText}</b>
        </Text>
      </ContentColumn>
    </>
  );
};
