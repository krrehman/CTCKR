import React from 'react';
import { JourneyManager } from '../components/Journey/JourneyManager';
import { JourneyHandlerAction, JourneyHandlerActionType, JourneyTree, useFRConfig } from '@cmctechnology/webinvest-store-client';

interface IDisableMfaProps {
  onNext: () => void;
  redirectUrl?: string;
  falconDisabled?: boolean;
  onCloseModal?: () => void;
}

const action: JourneyHandlerAction = {
  type: JourneyHandlerActionType.DisableMfa,
  tree: JourneyTree.FR_JOURNEY_DISABLE_MFA
};

const DisableMfa: React.FC<IDisableMfaProps> = ({ onNext, redirectUrl, falconDisabled, onCloseModal }) => {
  action.falconDisabled = falconDisabled;
  useFRConfig(JourneyTree.FR_JOURNEY_DISABLE_MFA, redirectUrl);

  return <JourneyManager onNext={onNext} action={action} onCloseModal={onCloseModal} />;
};

export default DisableMfa;
