/**
 * RegisterMFAPushRegistrationForm
 * Part of 2FA PUSH registration flow.
 *
 * Appear when step.getStage = ScreenStage.RegisterMFAPushRegistration (see in ScreenStage enums).
 * Display QR code for 2FA registration purpose, which needs to be scanned by FR authenticator app.
 * Execute CallbackType.HiddenValueCallback to check if the QR code is scanned.
 */

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import QRCode from 'react-qr-code';
import { Trans, useTranslation } from 'react-i18next';
import { Text } from '@cmctechnology/phoenix-stockbroking-web-design';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { FlexColumn, FlexRow, IFormProps } from './Form';

const ContentColumn = styled(FlexColumn)`
  max-width: 11.25rem;

  ${Text} {
    margin-left: 0;
  }
`;

const ContentRow = styled(FlexRow)`
  gap: 2rem;
  justify-content: center;
  margin-top: 1rem;
  margin-bottom: 2rem;
`;

const QRCodeWrapper = styled.div`
  width: 13rem;
  height: 13rem;
`;

export const RegisterMFAPushRegistrationForm: React.FC<IFormProps> = ({ step, applyActionCallback }): JSX.Element => {
  const { t } = useTranslation();
  const value = step.getCallbackOfType(CMCFRSDK.CallbackType.HiddenValueCallback).getOutputValue(`value`) as string;
  const id = step.getCallbackOfType(CMCFRSDK.CallbackType.HiddenValueCallback).getOutputValue(`id`) as string;
  const pollInterval = step.getCallbackOfType(CMCFRSDK.CallbackType.PollingWaitCallback).getOutputValue(`waitTime`) as number;

  const [qrCodeSize, setQrCodeSize] = useState(0);

  const timerRef = useRef(0);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const clearTimer = () => {
    if (!!timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
  };

  useEffect(() => {
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      step.setCallbackValue(CMCFRSDK.CallbackType.HiddenValueCallback, id);
      applyActionCallback();
    }, pollInterval);
    return () => clearTimer();
  }, [step, applyActionCallback]);

  useEffect(() => {
    const boundingRect = qrCodeRef?.current?.getBoundingClientRect() as DOMRect;
    const rectSize = boundingRect?.height ?? 0;
    setQrCodeSize(rectSize);
  }, []);

  return (
    <>
      <ContentRow>
        <ContentColumn>
          <Text>
            <b>{t(`Step 2:`)}</b>
          </Text>
          <Text>
            <Trans t={t}>Open the CMC Invest app and tap on the QR code icon in the top left of the login page. Then scan the QR code to the right.</Trans>
            <br />
            <br />
          </Text>
          <Text>
            <b>{t(`Step 3:`)}</b>
          </Text>
          <Text>
            <Trans t={t}>The mobile app will then load an acceptance screen. Tap the approve button to complete the setup.</Trans>
          </Text>
        </ContentColumn>
        <QRCodeWrapper ref={qrCodeRef}>
          <QRCode size={qrCodeSize} value={value} viewBox={`0 0 ${qrCodeSize} ${qrCodeSize}`} />
        </QRCodeWrapper>
      </ContentRow>
    </>
  );
};
