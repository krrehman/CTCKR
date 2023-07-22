/**
 * DisableMFAConfirmForm
 *
 * Appear when step.getStage = ScreenStage.DisableMFAConfirm (see in ScreenStage enums).
 * Confirms disabling of MFA.
 * Execute CallbackType.ChoiceCallback to disabling MFA (Confirm).
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useTestId, Button, Text } from '@cmctechnology/phoenix-stockbroking-web-design';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { FlexColumn, IFormProps } from './Form';
import { StepChoice } from '../../constants/enums';

const ContentColumn = styled(FlexColumn)`
  gap: 1rem;
  justify-content: center;
  align-items: center;

  ${Text} {
    text-align: center !important;
  }
`;

const OptionButton = styled(Button)`
  width: 10.5rem;
  margin: 0;
`;

export const DisableMFAConfirmForm: React.FC<IFormProps> = ({ step, applyActionCallback, ...rest }): JSX.Element => {
  const { t } = useTranslation();
  const { generateTestId } = useTestId(rest, `DisableMFAConfirmForm`);
  const choices = step.getCallbackOfType(CMCFRSDK.CallbackType.ChoiceCallback).getOutputValue(`choices`) as string[];

  const onChoiceSelected = (choice: string) => {
    const selectionIndex = choices.indexOf(choice);
    step.setCallbackValue(CMCFRSDK.CallbackType.ChoiceCallback, selectionIndex);
    applyActionCallback();
  };

  return (
    <>
      <ContentColumn>
        <Text>{t(`Are you sure you want to turn Multi-Factor Authentication off for this account?`)}</Text>
        <OptionButton centered label={t('Confirm')} {...generateTestId(`confirm`)} onClick={() => onChoiceSelected(StepChoice.confirm)} />
      </ContentColumn>
    </>
  );
};
