import React from 'react';
import { getConfig, MODAL_NAME, POST_MESSAGE } from '@cmctechnology/webinvest-store-frontend';
import { useModalState, useTestId } from '@cmctechnology/phoenix-stockbroking-web-design';
import { useTranslation } from 'react-i18next';
import ChangePassword from './ChangePassword';
import ChangeUsername from './ChangeUsername';
import { WfeButtonType } from '../constants/enums';
import { useCheckCmcSession } from './useCheckCmcSession';

declare global {
  interface Window {
    cmcsb?: { isFalcon?: boolean };
  }
}

interface IChangeButtonProps {
  buttonType: WfeButtonType;
}

const ChangeButton: React.FC<IChangeButtonProps> = ({ buttonType, ...rest }) => {
  const [, setModalState] = useModalState();
  const { t } = useTranslation();
  const { generateTestId } = useTestId(rest, `ChangeButton`);

  const isFalconEnabled = !!window?.cmcsb?.isFalcon;

  // should open modal here (non falcon version).
  const openModal = () => {
    setModalState({
      dialog:
        buttonType === WfeButtonType.ChangePassword ? (
          <ChangePassword
            onNext={() => {
              setModalState({ open: false });
            }}
            // when non falcon should set stockbrokingUrl as redirect to match the origin.
            // this will prevent throwing CORS when submitting the journey.
            redirectUrl={getConfig().stockbrokingUrl}
            falconDisabled={true}
            onCloseModal={() => {
              setModalState({ open: false });
            }}
          />
        ) : (
          <ChangeUsername
            onNext={() => {
              setModalState({ open: false });
            }}
            // when non falcon should set stockbrokingUrl as redirect to match the origin.
            // this will prevent throwing CORS when submitting the journey.
            redirectUrl={getConfig().stockbrokingUrl}
            falconDisabled={true}
            onCloseModal={() => {
              setModalState({ open: false });
            }}
          />
        ),
      open: true
    });
  };

  const { setRequestToCheckSession } = useCheckCmcSession(openModal);

  // should send message (falcon version, sends post message to the parent).
  const sendMessage = () => {
    window.parent.postMessage(
      {
        type: POST_MESSAGE.SHOW_MODAL,
        name: buttonType === WfeButtonType.ChangePassword ? MODAL_NAME.CHANGE_PASSWORD : MODAL_NAME.CHANGE_USERNAME
      },
      getConfig().hostUrl
    );
  };

  return (
    <input
      type='button'
      value={t(`Change`)}
      onClick={isFalconEnabled ? sendMessage : () => setRequestToCheckSession(true)}
      {...generateTestId(`changeBtn`)}
      className='inputbutton btn'
    />
  );
};

export default ChangeButton;
