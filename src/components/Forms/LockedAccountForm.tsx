/**
 * LockedAccountForm
 * Error Form.
 *
 * Appear when message code = ErrorMessageCode.CMCAccountLocked (see in ErrorMessageCode enums).
 * Display a form when a user account is locked.
 * Redirect to login on button click.
 */

import React from 'react';
import styled from 'styled-components';
import { Trans, useTranslation } from 'react-i18next';
import { useTestId, Button, Text } from '@cmctechnology/phoenix-stockbroking-web-design';
import { FlexColumn, IErrorFormProps } from './Form';
import { useNavigate } from 'react-router-dom';
import { JourneyTree, Page, CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { pages } from '../../constants/pageConstants';

const SubmitButton = styled(Button)`
  width: 10.5rem;
  margin: 0;
`;

export const Column = styled(FlexColumn)`
  align-items: center;
  gap: 1rem;
`;

const Description = styled(Text)`
  text-align: center;
`;

export const LockedAccountForm: React.FC<IErrorFormProps> = ({ ...rest }): JSX.Element => {
  const { t } = useTranslation();
  const { generateTestId } = useTestId(rest, `LockedAccountForm`);
  const navigate = useNavigate();

  const tree = CMCFRSDK.Config.get().tree;

  const backToLoginClickHandler = () => {
    if (tree === JourneyTree.FR_JOURNEY_LOGIN) {
      // already on login route/journey, refresh the page to rerender the login form.
      navigate(0);
    } else {
      // not on login route/journey, navigate to login.
      navigate(`../${pages[Page.LogIn].path}`);
    }
  };

  return (
    <Column>
      <Description>
        <Trans t={t}>Your account is currently locked due to suspicious activity. Please contact our Client Service on 1300 000000 to unlock it.</Trans>
      </Description>
      <SubmitButton centered label={t(`Back to Login`)} {...generateTestId(`backToLogin`)} onClick={backToLoginClickHandler} />
    </Column>
  );
};
