import React from 'react';
import { JourneyManager } from '../components/Journey/JourneyManager';
import { JourneyHandlerAction, JourneyHandlerActionType, JourneyTree, useFRConfig } from '@cmctechnology/webinvest-store-client';

interface IEnableMfaProps {
  onNext: () => void;
  redirectUrl?: string;
  falconDisabled?: boolean;
  onCloseModal?: () => void;
}

const action: JourneyHandlerAction = {
  type: JourneyHandlerActionType.RegisterMfa,
  tree: JourneyTree.FR_JOURNEY_REGISTER_MFA
};

const EnableMfa: React.FC<IEnableMfaProps> = ({ onNext, redirectUrl, falconDisabled, onCloseModal }) => {
  action.falconDisabled = falconDisabled;
  useFRConfig(JourneyTree.FR_JOURNEY_REGISTER_MFA, redirectUrl);

  return <JourneyManager onNext={onNext} action={action} onCloseModal={onCloseModal} />;
};

export default EnableMfa;
