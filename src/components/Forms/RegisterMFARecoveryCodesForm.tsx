/**
 * RegisterMFARecoveryCodesForm
 * Part of 2FA PUSH registration flow.
 *
 * Appear when step.getStage = ScreenStage.RegisterMFARecoveryCodes (see in ScreenStage enums).
 * Display recovery codes in to retrieve account access.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { useTestId, Button, Text } from '@cmctechnology/phoenix-stockbroking-web-design';
import { FlexRow, IFormProps, LinkButton } from './Form';

const SubmitButton = styled(Button)`
  margin-top: 2rem;
  max-width: 12rem;
`;

const ContentGrid = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
`;

const ContentRow = styled(FlexRow)`
  gap: 2rem;
  justify-content: center;
  margin-top: 2rem;
`;

const printCodes = () => window.print();

export const RegisterMFARecoveryCodesForm: React.FC<IFormProps> = ({ step, applyActionCallback, ...rest }): JSX.Element => {
  const { t } = useTranslation();
  const { generateTestId } = useTestId(rest, `RegisterMFARecoveryCodesForm`);

  const recoveryCodes = CMCFRSDK.FRRecoveryCodes.getCodes(step);

  const copyCodes = async () => {
    await navigator.clipboard.writeText(recoveryCodes.toString());
  };

  return (
    <>
      <ContentGrid>
        {recoveryCodes.map((code, index) => (
          <Text key={`${code}-${index}`}>{`${index + 1}. ${code}`}</Text>
        ))}
      </ContentGrid>
      <ContentRow>
        <LinkButton onClick={copyCodes} {...generateTestId(`copy`)}>
          {t(`Copy to clipboard`)}
        </LinkButton>
        <LinkButton onClick={printCodes} {...generateTestId(`print`)}>
          {t(`Print`)}
        </LinkButton>
      </ContentRow>
      <SubmitButton centered label={t('Done')} {...generateTestId(`done`)} onClick={applyActionCallback} />
    </>
  );
};
