/**
 * RequestMFAAuthOptionsForm
 * Part of 2FA common request flow.
 *
 * Appear when step.getStage = ScreenStage.RequestMFAOptions (see in ScreenStage enums).
 * Display 2FA options (if multiple registered) (MFATypeInput.Email, MFATypeInput.PushAuthentication, MFATypeInput.WebAuthN).
 * Execute CallbackType.ChoiceCallback to submit 2FA option.
 */

import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useTestId, Button, Text } from '@cmctechnology/phoenix-stockbroking-web-design';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { MFATypeInput, MFA_TYPES } from '../../constants/constants';
import { FlexColumn, IFormProps } from './Form';

const ContentColumn = styled(FlexColumn)`
  gap: 1rem;
  justify-content: center;
  align-items: center;

  ${Text} {
    text-align: center !important;
  }
`;

export const RequestMFAAuthOptionsForm: React.FC<IFormProps> = ({ step, applyActionCallback, ...rest }): JSX.Element => {
  const { t } = useTranslation();
  const { generateTestId } = useTestId(rest, `RequestMFAAuthOptionsForm`);
  const choiceCallback = step.getCallbackOfType(CMCFRSDK.CallbackType.ChoiceCallback);
  const choices = choiceCallback.getOutputValue(`choices`) as MFATypeInput[];

  const mfaTypeClickHandler = (choice: MFATypeInput) => {
    const selectionIndex = choices.indexOf(choice);
    step.setCallbackValue(CMCFRSDK.CallbackType.ChoiceCallback, selectionIndex);
    applyActionCallback();
  };

  return (
    <ContentColumn>
      <Text>{t(`To protect your account please verify your login using MFA. Please choose your preferred verification method below.`)}</Text>
      {choices.map((choice) => (
        <Button invertColours key={choice} label={MFA_TYPES[choice](t)} onClick={() => mfaTypeClickHandler(choice)} {...generateTestId(choice)} />
      ))}
    </ContentColumn>
  );
};
