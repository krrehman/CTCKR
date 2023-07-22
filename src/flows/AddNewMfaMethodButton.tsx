import React from 'react';
import { getConfig, MODAL_NAME, POST_MESSAGE } from '@cmctechnology/webinvest-store-frontend';
import { useModalState, useTestId } from '@cmctechnology/phoenix-stockbroking-web-design';
import { useTranslation } from 'react-i18next';
import EnableMfa from './EnableMfa';
import { useCheckCmcSession } from './useCheckCmcSession';

declare global {
  interface Window {
    cmcsb?: { isFalcon?: boolean };
  }
}

const AddNewMfaMethodButton: React.FC = ({ ...rest }) => {
  const [, setModalState] = useModalState();
  const { t } = useTranslation();
  const { generateTestId } = useTestId(rest, `AddNewMfaMethodButton`);

  const isFalconEnabled = !!window?.cmcsb?.isFalcon;

  // should open modal here (non falcon version).
  const openModal = () => {
    setModalState({
      dialog: (
        <EnableMfa
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
        name: MODAL_NAME.ADD_NEW_MFA_METHOD
      },
      getConfig().hostUrl
    );
  };

  return (
    <input
      type='button'
      value={t(`Add New MFA Method`)}
      onClick={isFalconEnabled ? sendMessage : () => setRequestToCheckSession(true)}
      {...generateTestId(`mfaMethodBtn`)}
      className='inputbutton btn'
    />
  );
};

export default AddNewMfaMethodButton;
