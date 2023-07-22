/**
 * RequestMFAPushPollingWaitForm
 * Part of 2FA PUSH request flow.
 *
 * Appear when step.getStage = ScreenStage.RequestMFAPushPollingWait (see in ScreenStage enums).
 * Display this screen while waiting for an action from mobile device, when 2FA request push is sent.
 * Poll applyActionCallback to check if accept/reject action was submitted from a registered device.
 * Show recovery options modal in case if push request can't be accepted/rejected (e.g. mobile is lost).
 */

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { JourneyTree, authenticatedJourneyTree, CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { Text, useTestId, useModalState, IModalState } from '@cmctechnology/phoenix-stockbroking-web-design';
import { FlexColumn, IFormProps, LinkButton } from './Form';
import cmc_push_wait from '../../assets/cmc_push_wait.png';
import { PushVerificationOptionsCard } from '../PushVerificationOptionsCard';

const ContentColumn = styled(FlexColumn)`
  padding: 2rem;
  justify-content: center;
  gap: 1rem;
  ${Text} {
    text-align: center;
  }
`;

export const RequestMFAPushPollingWaitForm: React.FC<IFormProps> = ({ step, applyActionCallback, ...rest }): JSX.Element => {
  const tree: JourneyTree = CMCFRSDK.Config.get().tree as JourneyTree;
  const isAuthenticatedJourney = !!authenticatedJourneyTree[tree];
  const { generateTestId } = useTestId(rest, `RequestMFAPushPollingWaitForm`);
  const { t } = useTranslation();
  const [state, setModalState] = useModalState();
  const [showOptionsView, setShowOptionsView] = useState(false);
  const pollInterval = step.getCallbackOfType(CMCFRSDK.CallbackType.PollingWaitCallback).getOutputValue(`waitTime`) as number;
  const timerRef = useRef(0);

  const clearTimer = () => {
    if (!!timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
  };

  const backupCodesSelectionHandler = () => {
    clearTimer();
    step.setCallbackValue(CMCFRSDK.CallbackType.ConfirmationCallback, 0);
    applyActionCallback();
  };

  const openOptions = () => {
    if (isAuthenticatedJourney) {
      setShowOptionsView(true);
    } else {
      const newState: IModalState = {
        dialog: <PushVerificationOptionsCard backupCodesSelectionHandler={backupCodesSelectionHandler} />,
        open: true
      };
      setModalState(newState);
    }
  };

  useEffect(() => {
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      applyActionCallback();
    }, pollInterval);
    return () => clearTimer();
  }, [step]);

  useEffect(() => {
    return () => {
      if (isAuthenticatedJourney) {
        setShowOptionsView(true);
      } else {
        setModalState({ open: false } as IModalState);
      }
    };
  }, []);

  useEffect(() => {
    if (state.open && !!(state?.dialog as JSX.Element).props?.backupCodesSelectionHandler) {
      setModalState({ open: false } as IModalState);
      openOptions();
    }
  }, [applyActionCallback]);

  return (
    <>
      {showOptionsView ? (
        <PushVerificationOptionsCard backupCodesSelectionHandler={backupCodesSelectionHandler} isInModal goBackHandler={() => setShowOptionsView(false)} />
      ) : (
        <ContentColumn>
          <Text>
            <b>{t(`A push notification has been sent to your registered mobile device. Tap this notification and approve to continue logging in.`)}</b>
          </Text>
          <img src={cmc_push_wait} />
          <LinkButton onClick={openOptions} {...generateTestId(`options`)}>
            {t(`Didn't receive a verification message?`)}
          </LinkButton>
        </ContentColumn>
      )}
    </>
  );
};
