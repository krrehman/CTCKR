import React from 'react';
import { JourneyManager } from '../components/Journey/JourneyManager';
import { JourneyHandlerAction, JourneyHandlerActionType, JourneyTree, useFRConfig } from '@cmctechnology/webinvest-store-client';

interface IChangeUsernameProps {
  onNext: () => void;
  redirectUrl?: string;
  falconDisabled?: boolean;
  onCloseModal?: () => void;
}

const action: JourneyHandlerAction = {
  type: JourneyHandlerActionType.ChangeUsername,
  tree: JourneyTree.FR_JOURNEY_CHANGE_USERNAME
};

const ChangeUsername: React.FC<IChangeUsernameProps> = ({ onNext, redirectUrl, falconDisabled, onCloseModal }) => {
  action.falconDisabled = falconDisabled;
  useFRConfig(JourneyTree.FR_JOURNEY_CHANGE_USERNAME, redirectUrl);

  return <JourneyManager onNext={onNext} action={action} onCloseModal={onCloseModal} />;
};

export default ChangeUsername;
