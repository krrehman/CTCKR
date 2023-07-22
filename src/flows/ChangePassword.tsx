import React from 'react';
import { JourneyManager } from '../components/Journey/JourneyManager';
import { JourneyHandlerAction, JourneyHandlerActionType, JourneyTree, useFRConfig } from '@cmctechnology/webinvest-store-client';

interface IChangePasswordProps {
  onNext: () => void;
  redirectUrl?: string;
  falconDisabled?: boolean;
  onCloseModal?: () => void;
}

const action: JourneyHandlerAction = {
  type: JourneyHandlerActionType.ChangePassword,
  tree: JourneyTree.FR_JOURNEY_CHANGE_PASSWORD
};

const ChangePassword: React.FC<IChangePasswordProps> = ({ onNext, redirectUrl, falconDisabled, onCloseModal }) => {
  action.falconDisabled = falconDisabled;
  useFRConfig(JourneyTree.FR_JOURNEY_CHANGE_PASSWORD, redirectUrl);

  return <JourneyManager onNext={onNext} action={action} onCloseModal={onCloseModal} />;
};

export default ChangePassword;
