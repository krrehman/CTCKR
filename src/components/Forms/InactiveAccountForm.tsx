/**
 * InactiveAccountForm
 * Error Form.
 *
 * Appear when message code = ErrorMessageCode.CMCAccountInactive (see in ErrorMessageCode enums).
 * Display a form when a user account is inactive.
 * Redirect to login on button click.
 */

import React from 'react';
import styled from 'styled-components';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { Trans, useTranslation } from 'react-i18next';
import { useTestId, Button, Size, Text, Panel } from '@cmctechnology/phoenix-stockbroking-web-design';
import { FlexColumn, IErrorFormProps } from './Form';
import { useNavigate } from 'react-router-dom';
import { JourneyTree, Page } from '@cmctechnology/webinvest-store-client';
import { pages } from '../../constants/pageConstants';

const SubmitButton = styled(Button)`
  width: 10.5rem;
  margin: 0;
`;

export const Column = styled(FlexColumn)`
  align-items: center;
  gap: 1rem;
`;

const CardPanel = styled(Panel)`
  box-sizing: border-box;
  padding: 1.25rem;
  margin: 0 0 0.5rem 0;
  width: 100%;
  align-items: center;
  border-radius: 0.25rem;
  flex-direction: column;
  gap: 0.25rem;
  white-space: normal;

  ${Text} {
    margin: 0;
  }
`;

const Description = styled(Text)`
  text-align: center;
`;

export const InactiveAccountForm: React.FC<IErrorFormProps> = ({ errorOutcome, ...rest }): JSX.Element => {
  const { t } = useTranslation();
  const { generateTestId } = useTestId(rest, `InactiveAccountForm`);
  const navigate = useNavigate();

  const { customerRef } = errorOutcome;
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
        <Trans t={t}>Your account is inactive. Please contact our Client Service on 1300 000000 and quote the below reference number.</Trans>
      </Description>
      <CardPanel>
        <Text size={Size.Medium}>{customerRef}</Text>
      </CardPanel>
      <SubmitButton centered label={t(`Back to Login`)} {...generateTestId(`backToLogin`)} onClick={backToLoginClickHandler} />
    </Column>
  );
};
