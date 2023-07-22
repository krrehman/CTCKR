import React, { useEffect, useState } from 'react';
import { getConfig, MODAL_NAME, POST_MESSAGE } from '@cmctechnology/webinvest-store-frontend';
import { useModalState, useTestId } from '@cmctechnology/phoenix-stockbroking-web-design';
import { useTranslation } from 'react-i18next';
import { WfeButtonType } from '../constants/enums';
import EnableMfa from './EnableMfa';
import DisableMfa from './DisableMfa';
import styled from 'styled-components';
import { FlexRow } from '../components/Forms/Form';
import AddNewMfaMethodButton from './AddNewMfaMethodButton';
import { useCheckCmcSession } from './useCheckCmcSession';

declare global {
  interface Window {
    cmcsb?: { isFalcon?: boolean };
  }
}

interface IEnableDisableMfaContainerProps {
  buttonType: WfeButtonType;
}

const Row = styled(FlexRow)`
  gap: 1rem;
`;

const EnableDisableMfaContainer: React.FC<IEnableDisableMfaContainerProps> = ({ buttonType, ...rest }) => {
  const [, setModalState] = useModalState();
  const { t } = useTranslation();
  const [mfaButtonType, setMfaButtonType] = useState(buttonType);
  const { generateTestId } = useTestId(rest, `EnableDisableMfaContainer`);

  const isFalconEnabled = !!window?.cmcsb?.isFalcon;

  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      if (event.data.type === POST_MESSAGE.UPDATE_MFA_STATUS) {
        const updated = event.data.mfaStatus === `enabled` ? WfeButtonType.DisableMFA : WfeButtonType.EnableMFA;
        setMfaButtonType(updated);
      }
    };

    window.addEventListener(`message`, messageHandler);

    return () => {
      window.removeEventListener(`message`, messageHandler);
    };
  }, []);

  // should open modal here (non falcon version).
  const openModal = () => {
    setModalState({
      dialog:
        mfaButtonType === WfeButtonType.EnableMFA ? (
          <EnableMfa
            onNext={() => {
              setMfaButtonType(WfeButtonType.DisableMFA);
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
          <DisableMfa
            onNext={() => {
              setMfaButtonType(WfeButtonType.EnableMFA);
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
        name: mfaButtonType === WfeButtonType.EnableMFA ? MODAL_NAME.ENABLE_MFA : MODAL_NAME.DISABLE_MFA
      },
      getConfig().hostUrl
    );
  };

  const buttonLabel = mfaButtonType === WfeButtonType.EnableMFA ? t(`Activate`) : t(`Deactivate`);

  return (
    <Row>
      <input
        type='button'
        value={buttonLabel}
        onClick={isFalconEnabled ? sendMessage : () => setRequestToCheckSession(true)}
        {...generateTestId(`enableDisableMfaBtn`)}
        className='inputbutton btn'
      />
      {mfaButtonType === WfeButtonType.DisableMFA && <AddNewMfaMethodButton />}
    </Row>
  );
};

export default EnableDisableMfaContainer;
