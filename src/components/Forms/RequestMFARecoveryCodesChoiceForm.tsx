/**
 * RequestMFARecoveryCodesChoiceForm
 * Part of 2FA PUSH request flow.
 *
 * Appear when step.getStage = ScreenStage.RequestMFARecoveryCodesChoice (see in ScreenStage enums).
 * Display a form for recovering/exiting 2FA request process.
 * Execute CallbackType.ChoiceCallback to submit recovery/exit.
 */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useTestId, Button } from '@cmctechnology/phoenix-stockbroking-web-design';
import { RECOVERY_CODES_CHOICE_OPTIONS, RequestMFARecoveryCodesChoiceOption } from '../../constants/constants';
import { FlexRow, IFormProps } from './Form';
import { JourneyTree, authenticatedJourneyTree, CMCFRSDK } from '@cmctechnology/webinvest-store-client';

const SubmitButton = styled(Button)`
  width: 10.5rem;
  margin: 0;
`;

export const Row = styled(FlexRow)`
  justify-content: center;
  gap: 1rem;
`;

export const RequestMFARecoveryCodesChoiceForm: React.FC<IFormProps> = ({ step, applyActionCallback, ...rest }): JSX.Element => {
  const { t } = useTranslation();
  const { generateTestId } = useTestId(rest, `RequestMFARecoveryCodesChoiceForm`);
  const [skip, setSkip] = useState(true);
  const choiceCallback = step.getCallbackOfType(CMCFRSDK.CallbackType.ChoiceCallback);
  const choices = choiceCallback.getOutputValue(`choices`) as RequestMFARecoveryCodesChoiceOption[];

  const onSubmit = (index: number) => {
    step.setCallbackValue(CMCFRSDK.CallbackType.ChoiceCallback, index);
    applyActionCallback();
  };

  useEffect(() => {
    const skipIfAuthenticated = async () => {
      const tree: JourneyTree = CMCFRSDK.Config.get().tree as JourneyTree;
      // should skip this step by submitting/confirming recovery options automatically, when triggered by one of authenticated journeys.
      if (!!authenticatedJourneyTree[tree]) {
        setSkip(true);
        onSubmit(choices.indexOf(RequestMFARecoveryCodesChoiceOption.Recovery));
        return;
      }
      setSkip(false);
    };
    skipIfAuthenticated();
  }, [step]);

  return (
    <>
      {!skip && (
        <Row>
          <SubmitButton
            centered
            label={RECOVERY_CODES_CHOICE_OPTIONS[RequestMFARecoveryCodesChoiceOption.Recovery](t)}
            {...generateTestId(`recovery`)}
            onClick={() => onSubmit(choices.indexOf(RequestMFARecoveryCodesChoiceOption.Recovery))}
          />
          <SubmitButton
            centered
            label={RECOVERY_CODES_CHOICE_OPTIONS[RequestMFARecoveryCodesChoiceOption.Exit](t)}
            {...generateTestId(`exit`)}
            onClick={() => onSubmit(choices.indexOf(RequestMFARecoveryCodesChoiceOption.Exit))}
          />
        </Row>
      )}
    </>
  );
};
