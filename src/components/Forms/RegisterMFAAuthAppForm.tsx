/**
 * RegisterMFAAuthAppForm
 * Part of 2FA PUSH registration flow.
 *
 * Appear when step.getStage = ScreenStage.RegisterMFAAuthApp (see in ScreenStage enums).
 * Display 2FA get authenticator app screen.
 * Execute CallbackType.ConfirmationCallback to proceed to the next node.
 */

import React from 'react';
import styled from 'styled-components';
import { Trans, useTranslation } from 'react-i18next';
import { OPEN_BLANK_URL_TARGET } from '@cmctechnology/webinvest-store-frontend';
import { useTestId, Button, Text, Link } from '@cmctechnology/phoenix-stockbroking-web-design';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { FlexColumn, FlexRow, IFormProps } from './Form';
import { FR_AUTHENTICATOR_APPLE_STORE_URL, FR_AUTHENTICATOR_PLAY_STORE_URL } from '../../constants/constants';
import QR_app_code from '../../assets/qrcode_redirect_to_app.png';
import app_store_layer from '../../assets/app_store.svg';
import play_store_layer from '../../assets/play_store.svg';

const ContentColumn = styled(FlexColumn)`
  ${Text} {
    margin-left: 0;
  }
`;

const ContentRow = styled(FlexRow)`
  gap: 2rem;
  justify-content: center;
`;

const QRImage = styled.img`
  width: 8rem;
  height: 8rem;
`;

const StoreLink = styled(Link)`
  margin-top: 2rem;
`;

export const SubmitButton = styled(Button)`
  margin-top: 2rem;
`;

export const RegisterMFAAuthAppForm: React.FC<IFormProps> = ({ step, applyActionCallback, ...rest }): JSX.Element => {
  const { t } = useTranslation();
  const { generateTestId } = useTestId(rest, `RegisterMFAAuthAppForm`);

  const onChoiceSelected = () => {
    step.setCallbackValue(CMCFRSDK.CallbackType.ConfirmationCallback, 0);
    applyActionCallback();
  };

  return (
    <>
      <ContentColumn>
        <Text>
          <b>{t(`Step 1:`)}</b>
        </Text>
        <ContentRow>
          <Text>
            <Trans t={t}>
              You need to have the CMC Invest app downloaded to use Push Notifications as your MFA method.
              <br />
              <br />
              If you have not already done so please use the QR code to download the app on your device before proceeding. Alternatively use the links below.
            </Trans>
          </Text>
          <QRImage src={QR_app_code} />
        </ContentRow>
        <ContentRow>
          <StoreLink target={OPEN_BLANK_URL_TARGET} href={FR_AUTHENTICATOR_APPLE_STORE_URL}>
            <img src={app_store_layer} />
          </StoreLink>
          <StoreLink target={OPEN_BLANK_URL_TARGET} href={FR_AUTHENTICATOR_PLAY_STORE_URL}>
            <img src={play_store_layer} />
          </StoreLink>
        </ContentRow>
      </ContentColumn>
      <SubmitButton centered label={t('Continue')} {...generateTestId(`continue`)} onClick={onChoiceSelected} />
    </>
  );
};
