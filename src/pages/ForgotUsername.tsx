import React from 'react';
import { PageFormWrapper, PageShell } from '../components/PageShell';
import { JourneyManager } from '../components/Journey/JourneyManager';
import { IPageProps } from './PageBase';
import { JourneyHandlerActionType, JourneyTree, useFRConfig } from '@cmctechnology/webinvest-store-client';

export const ForgotUsername: React.FC<IPageProps> = ({ onNext, onInterceptorsRequired }) => {
  useFRConfig(JourneyTree.FR_JOURNEY_FORGOT_USERNAME);

  const action = {
    type: JourneyHandlerActionType.ForgotUsername,
    tree: JourneyTree.FR_JOURNEY_FORGOT_USERNAME
  };

  return (
    <PageShell>
      <PageFormWrapper>
        <JourneyManager onNext={onNext} onInterceptorsRequired={onInterceptorsRequired} action={action} />
      </PageFormWrapper>
    </PageShell>
  );
};
