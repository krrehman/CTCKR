/**
 * RegisterMFAAnotherDeviceForm
 * Part of 2FA common registration flow.
 *
 * Appear when step.getStage = ScreenStage.RegisterMFAAnotherDevice (see in ScreenStage enums).
 * Display register another device options.
 * Execute CallbackType.ConfirmationCallback to submit device registration option (yes/no).
 */

import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import styled from 'styled-components';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { useTestId, Button, Text } from '@cmctechnology/phoenix-stockbroking-web-design';
import { FlexColumn, FlexRow, IFormProps } from './Form';
import { StepChoice } from '../../constants/enums';

const OptionButton = styled(Button)`
  width: 10.5rem;
  margin: 0;
`;

export const Column = styled(FlexColumn)`
  align-items: center;
  gap: 1rem;
`;

export const Row = styled(FlexRow)`
  justify-content: center;
  gap: 1rem;
`;

export const RegisterMFAAnotherDeviceForm: React.FC<IFormProps> = ({ step, applyActionCallback, ...rest }): JSX.Element => {
  const { t } = useTranslation();
  const { generateTestId } = useTestId(rest, `RegisterMFAAnotherDeviceForm`);
  const options = step.getCallbackOfType(CMCFRSDK.CallbackType.ConfirmationCallback).getOutputValue(`options`) as string[];

  const onChoiceSelected = (option: string) => {
    const selectionIndex = options.indexOf(option);
    step.setCallbackValue(CMCFRSDK.CallbackType.ConfirmationCallback, selectionIndex);
    applyActionCallback();
  };

  return (
    <Column>
      <Text>
        <Trans t={t}>
          You can setup multiple MFA methods on your account. Would you like to setup another MFA now?
          <br />
          <br />
          If you decide to skip this step you can add another method later through your account settings.
        </Trans>
      </Text>
      <Row>
        <OptionButton centered label={t('Yes')} {...generateTestId(`yes`)} onClick={() => onChoiceSelected(StepChoice.yes)} />
        <OptionButton centered label={t('Skip')} {...generateTestId(`skip`)} onClick={() => onChoiceSelected(StepChoice.no)} />
      </Row>
    </Column>
  );
};
