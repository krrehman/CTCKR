/**
 * RegisterMFAStartForm
 * Part of 2FA common registration flow.
 *
 * Appear when step.getStage = ScreenStage.RegisterMFAStart (see in ScreenStage enums).
 * Display a form for starting/exiting 2FA process.
 * Execute CallbackType.ChoiceCallback to submit start/exit.
 */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { JourneyTree, authenticatedJourneyTree, CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { useTestId, Button, Text } from '@cmctechnology/phoenix-stockbroking-web-design';
import { AuthenticationChoiceOption, AUTHENTICATION_TYPE_DESCRIPTIONS } from '../../constants/constants';
import { FlexColumn, FlexRow, IFormProps } from './Form';

const SubmitButton = styled(Button)`
  width: 10.5rem;
  margin: 0;
`;

export const Column = styled(FlexColumn)`
  align-items: center;
  gap: 2rem;
`;

export const Row = styled(FlexRow)`
  justify-content: center;
  gap: 1rem;
`;

export const RegisterMFAStartForm: React.FC<IFormProps> = ({ step, applyActionCallback, ...rest }): JSX.Element => {
  const { t } = useTranslation();
  const { generateTestId } = useTestId(rest, `RegisterMFAStartForm`);
  const [skip, setSkip] = useState(true);
  const choiceCallback = step.getCallbackOfType(CMCFRSDK.CallbackType.ChoiceCallback);
  const choices = choiceCallback.getOutputValue(`choices`) as AuthenticationChoiceOption[];

  useEffect(() => {
    const skipIfAuthenticated = async () => {
      const tree: JourneyTree = CMCFRSDK.Config.get().tree as JourneyTree;
      // should skip first step by submitting automatically, when triggered by one of authenticated journeys.
      if (!!authenticatedJourneyTree[tree] || tree === JourneyTree.FR_JOURNEY_LOGIN) {
        setSkip(true);
        const index = choices.indexOf(AuthenticationChoiceOption.Ok);
        step.setCallbackValue(CMCFRSDK.CallbackType.ChoiceCallback, index);
        applyActionCallback();
        return;
      }
      setSkip(false);
    };
    skipIfAuthenticated();
  }, [step]);

  const onSubmit = (index: number) => {
    step.setCallbackValue(CMCFRSDK.CallbackType.ChoiceCallback, index);
    applyActionCallback();
  };

  return (
    <>
      {!skip && (
        <Column>
          <Text>
            {t(
              `Increase security on your investment account by setting up Multi-Factor Authentication. We offer flexible authentication solutions including your registered email and/or push notification via the CMC Invest app.`
            )}
          </Text>
          <Row>
            <SubmitButton
              centered
              label={AUTHENTICATION_TYPE_DESCRIPTIONS[AuthenticationChoiceOption.Ok](t)}
              {...generateTestId(`ok`)}
              onClick={() => onSubmit(choices.indexOf(AuthenticationChoiceOption.Ok))}
            />
            <SubmitButton
              centered
              label={AUTHENTICATION_TYPE_DESCRIPTIONS[AuthenticationChoiceOption.Exit](t)}
              {...generateTestId(`exit`)}
              onClick={() => onSubmit(choices.indexOf(AuthenticationChoiceOption.Exit))}
            />
          </Row>
        </Column>
      )}
    </>
  );
};
