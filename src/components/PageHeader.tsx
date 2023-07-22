import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Button, breakpoint, Link, IconNames, Logo } from '@cmctechnology/phoenix-stockbroking-web-design';
import { frontendActions, OPEN_BLANK_URL_TARGET } from '@cmctechnology/webinvest-store-frontend';
import { CMC_MARKETS_WEBSITE_URL, ONBOARDING_START_URL } from '../constants/urlConstants';

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 5rem;
  background-color: ${({ theme }) => theme.colours.navigationBar.background};
  left: 0;
  top: 0;
  padding: 0 2rem;
`;

const CreateAccountButton = styled(Button)`
  width: 10.5rem;
`;

const GoToWebsiteButton = styled(Button)`
  background: none;
  border: none;
  justify-content: flex-end;
  width: 9.5rem;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
`;

const GoToWebsiteButtonWrapper = styled(ButtonWrapper)`
  justify-content: flex-start;
  @media only screen and (max-width: ${breakpoint.mobileSmall}) {
    display: none;
  }
`;

const CreateAccountButtonWrapper = styled(ButtonWrapper)`
  justify-content: flex-end;
`;

const StaticLogoWrapper = styled.div`
  display: block;

  @media only screen and (max-width: ${breakpoint.mobileSmall}) {
    display: none;
  }
`;

const LinkLogoWrapper = styled(Link)`
  display: none;

  @media only screen and (max-width: ${breakpoint.mobileSmall}) {
    display: block;
  }
`;

const onGoToWebsite = (): void => {
  frontendActions.redirectToUrl(CMC_MARKETS_WEBSITE_URL, OPEN_BLANK_URL_TARGET);
};

const onCreateAccount = (): void => {
  frontendActions.redirectToUrl(ONBOARDING_START_URL, OPEN_BLANK_URL_TARGET);
};

export const PageHeader: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <HeaderWrapper>
      <GoToWebsiteButtonWrapper>
        <GoToWebsiteButton invertColours icon={IconNames.ArrowLeft} label={t('CMC website')} type='button' onClick={onGoToWebsite} />
      </GoToWebsiteButtonWrapper>
      <StaticLogoWrapper>
        <Logo />
      </StaticLogoWrapper>
      <LinkLogoWrapper href={CMC_MARKETS_WEBSITE_URL}>
        <Logo />
      </LinkLogoWrapper>
      <CreateAccountButtonWrapper>
        <CreateAccountButton label={t('Create account')} type='button' onClick={onCreateAccount} />
      </CreateAccountButtonWrapper>
    </HeaderWrapper>
  );
};
