import React from 'react';
import { PageFormWrapper, PageShell } from '../components/PageShell';
import { JourneyManager } from '../components/Journey/JourneyManager';
import { IPageProps } from './PageBase';
import { JourneyHandlerActionType, JourneyTree, useFRConfig } from '@cmctechnology/webinvest-store-client';

export const Login: React.FC<IPageProps> = ({ onNext, onInterceptorsRequired }) => {
  useFRConfig(JourneyTree.FR_JOURNEY_LOGIN);

  const action = {
    type: JourneyHandlerActionType.Login,
    tree: JourneyTree.FR_JOURNEY_LOGIN
  };

  return (
    <PageShell>
      <PageFormWrapper>
        <JourneyManager onNext={onNext} onInterceptorsRequired={onInterceptorsRequired} action={action} />
      </PageFormWrapper>
    </PageShell>
  );
};
