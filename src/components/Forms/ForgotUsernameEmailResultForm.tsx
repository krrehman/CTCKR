/**
 * ForgotUsernameEmailResultForm
 *
 * Appear when message code = ScreenStage.ForgotUsernameEmailOk || message code = ScreenStage.ForgotUsernameEmailFail (see in ScreenStage enums).
 * Display email result page.
 * Redirect to login on button click.
 */

import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useTestId, Button, Text, ButtonLink, IModalState, useModalState } from '@cmctechnology/phoenix-stockbroking-web-design';
import { FlexColumn, IFormProps } from './Form';
import icon_mail from '../../assets/icon_mail.svg';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { ContactCard } from '../ContactCard';

const SubmitButton = styled(Button)`
  width: 10.5rem;
  margin-top: 2rem;
`;

export const Column = styled(FlexColumn)`
  align-items: center;
  gap: 1rem;
`;

const ResendBlock = styled.span`
  display: inline-block;
`;

const ResendButton = styled(ButtonLink)`
  font-size: 10.5pt;
`;

const ImgIcon = styled.img`
  width: 5rem;
  height: 5rem;
`;

const DetailsText = styled(Text)`
  text-align: center;
`;

export const ForgotUsernameEmailResultForm: React.FC<IFormProps> = ({ step, previousStep, applyActionCallback, ...rest }): JSX.Element => {
  const { t } = useTranslation();
  const { generateTestId } = useTestId(rest, `ForgotUsernameEmailResultForm`);
  const [, setModalState] = useModalState();

  const backToLoginClickHandler = () => {
    step.setCallbackValue(CMCFRSDK.CallbackType.ChoiceCallback, 1);
    applyActionCallback();
  };

  const onResendCode = () => {
    step.setCallbackValue(CMCFRSDK.CallbackType.ChoiceCallback, 0);
    applyActionCallback();
  };

  const openModal = (): void => {
    const state: IModalState = {
      dialog: <ContactCard />,
      open: true
    };
    setModalState(state);
  };

  return (
    <>
      <Column>
        <ImgIcon src={icon_mail} {...generateTestId(`iconMail`)} />
        <DetailsText>{t(`Your account username has been sent to your registered email address.`)}</DetailsText>
        <Text>
          <ResendBlock>
            <ResendButton onClick={openModal} {...generateTestId(`options`)}>
              {t(`Didn't receive?`)}
            </ResendButton>
            <ResendButton onClick={onResendCode} {...generateTestId(`resend`)}>
              {t(`Resend new email`)}
            </ResendButton>
          </ResendBlock>
        </Text>
      </Column>
      <SubmitButton centered label={t(`Back to Login`)} {...generateTestId(`backToLogin`)} onClick={backToLoginClickHandler} />
    </>
  );
};
