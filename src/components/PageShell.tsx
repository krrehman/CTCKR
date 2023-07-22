import React, { PropsWithChildren, useState } from 'react';
import styled from 'styled-components';
import { useTranslation, Trans } from 'react-i18next';
import { Text, Size, Link, breakpoint } from '@cmctechnology/phoenix-stockbroking-web-design';
import { OPEN_BLANK_URL_TARGET } from '@cmctechnology/webinvest-store-frontend';
import { PageHeader } from './PageHeader';
import { HelpButton } from './HelpButton';
import { CMC_MARKETS_WEBSITE_LEGAL } from '../constants/urlConstants';
import { ActiveBackground } from './Pod/ActiveBackground';
import { IPodDescriptor } from '../pods/podProps';
import { initialPodContext, PodContext } from './Pod/PodContext';
import { PodManager } from './Pod/PodManager';

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const PageFormWrapper = styled.div`
  margin-left: 8rem;

  @media only screen and (max-width: ${breakpoint.monitor}) {
    margin-left: unset;
  }

  @media only screen and (max-width: ${breakpoint.mobile}) {
    margin-left: unset;
  }

  @media only screen and (max-width: ${breakpoint.mobileSmall}) {
    margin: unset;
    width: 100%;
  }
`;

const Content = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  @media only screen and (max-width: ${breakpoint.tablet}) {
    flex-direction: column;
    height: auto;
    width: auto;
  }
`;

const Footer = styled.div<{ textColour: string }>`
  max-width: 75rem;
  display: flex;
  align-items: center;

  ${Text} {
    padding: 1.25rem 1.25rem 2.5rem;
    color: ${({ textColour }) => textColour};
    transition: color 1s linear;
  }

  ${Link} {
    &:focus,
    &:hover,
    &:visited,
    &:link,
    &:active {
      color: ${({ textColour }) => textColour};
    }
  }
`;

const PodWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1.5rem;
`;

export const PageShell: React.FC<PropsWithChildren> = ({ children }) => {
  const [podDescriptor, setPodDescriptor] = useState<IPodDescriptor>(initialPodContext.podDescriptor);
  const podContextValue = { podDescriptor, setPodDescriptor };
  const { t } = useTranslation();

  return (
    <PodContext.Provider value={podContextValue}>
      <Wrapper>
        <ActiveBackground />
        <PageHeader />
        <Content>
          {children}
          <PodWrapper>
            <PodManager />
          </PodWrapper>
        </Content>
        <Footer textColour={podDescriptor.bgColors[0].bgTextColor}>
          <Text size={Size.Medium}>
            <Trans t={t}>
              <b>Disclaimer:</b> © CMC Markets Singapore Invest Pte. Ltd.. Co. Reg. No./UEN 202217639M. Regulated and licensed by the Monetary Authority of
              Singapore (Capital Markets Services License No: 101320). Refer to
              <Link href={CMC_MARKETS_WEBSITE_LEGAL} target={OPEN_BLANK_URL_TARGET} size={Size.Small}>
                <b> our Website </b>
              </Link>
              for Terms and Conditions, Risk Disclosures, Privacy Statement, Dispute Handling process and other important information.
            </Trans>
          </Text>
        </Footer>
        <HelpButton />
      </Wrapper>
    </PodContext.Provider>
  );
};
