/**
 * RegisterMFAAuthOptionsForm
 * Part of 2FA common registration flow.
 *
 * Appear when step.getStage = ScreenStage.RegisterMFAAuthOptions (see in ScreenStage enums).
 * Display 2FA registration options (MFATypeInput.Email, MFATypeInput.PushAuthentication, MFATypeInput.WebAuthN).
 * Execute CallbackType.ChoiceCallback to submit 2FA option.
 */

import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { CardContent, OptionRadioButton, useTestId, Button, useValidator, Validators } from '@cmctechnology/phoenix-stockbroking-web-design';
import { MFATypeInput, MFA_TYPES, MFA_TYPE_DESCRIPTIONS } from '../../constants/constants';
import { FlexColumn, IFormProps } from './Form';

const CardContentWithoutBottomPadding = styled(CardContent)`
  padding: 0;
  margin: 0;

  button {
    margin-left: 0;
    :first-child {
      margin-top: 0;
    }
    :last-child {
      margin-bottom: 0;
    }
  }
`;

export const Column = styled(FlexColumn)`
  gap: 2rem;
`;

export const RegisterMFAAuthOptionsForm: React.FC<IFormProps> = ({ step, applyActionCallback, ...rest }): JSX.Element => {
  const { t } = useTranslation();
  const { generateTestId } = useTestId(rest, `RegisterMFAAuthOptionsForm`);
  const choiceCallback = step.getCallbackOfType(CMCFRSDK.CallbackType.ChoiceCallback);
  const choices = choiceCallback.getOutputValue(`choices`) as MFATypeInput[];
  // Temporary removing MFATypeInput.WebAuthN.
  // Will be integrated later.
  const filteredChoices = choices.filter((choice) => choice !== MFATypeInput.WebAuthN);
  const defaultChoice = (choiceCallback.getOutputValue(`defaultChoice`) as number) || 0;
  const initialChoice = choices[defaultChoice];

  const mfaTypeValidator = useValidator(initialChoice, Validators.required(t(`Please choose MFA type`)));

  const onNextClicked = async () => {
    const valid = await mfaTypeValidator.validate();

    if (!valid) return;

    const selectionIndex = choices.indexOf(mfaTypeValidator.value);
    step.setCallbackValue(CMCFRSDK.CallbackType.ChoiceCallback, selectionIndex);
    applyActionCallback();
  };

  return (
    <Column>
      <CardContentWithoutBottomPadding>
        {filteredChoices.map((choice) => (
          <OptionRadioButton
            key={choice}
            label={MFA_TYPES[choice](t)}
            body={MFA_TYPE_DESCRIPTIONS[choice](t)}
            selected={mfaTypeValidator.value === choice}
            onClick={() => mfaTypeValidator.handleEvent(choice)}
            {...generateTestId(choice)}
          />
        ))}
      </CardContentWithoutBottomPadding>
      <Button centered label={t('Next')} {...generateTestId(`next`)} onClick={onNextClicked} />
    </Column>
  );
};
