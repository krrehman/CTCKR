import React from 'react';
import styled from 'styled-components';
import { useTranslation, Trans } from 'react-i18next';
import {
  CardLarge,
  breakpoint,
  Heading1,
  CardHeader,
  Text,
  CardContent,
  Button,
  useModalState,
  IModalState,
  Size,
  Panel,
  Icon,
  IconNames,
  Link
} from '@cmctechnology/phoenix-stockbroking-web-design';
import { OPEN_BLANK_URL_TARGET } from '@cmctechnology/webinvest-store-frontend';
import { CMC_MARKETS_WEBSITE_STOCKBROKING_URL, BROKING_SERVICE_EMAIL, CMC_CONTACT_US_PHONE } from '../constants/urlConstants';

const CardWrapper = styled(CardLarge)`
  width: 35rem;
  margin: 0;

  @media only screen and (max-width: ${breakpoint.mobileSmall}) {
    width: calc(100vw - 3rem);
  }
`;

const ServiceText = styled(Text)`
  text-align: center;
`;

const ContactCardHeader = styled(CardHeader)`
  padding: 3rem 3rem 0;
  background-color: ${({ theme }) => theme.colours.card.large.background};
  justify-content: center;
  box-sizing: border-box;

  ${Heading1} {
    margin: 0;
    color: ${({ theme }) => theme.colours.default.text};
  }

  ${ServiceText} {
    color: ${({ theme }) => theme.colours.default.text};
  }

  ${Icon} {
    width: 3.5rem;
    height: 3.5rem;
    color: ${({ theme }) => theme.colours.default.text};
    background-color: ${({ theme }) => theme.colours.banner.label.background};
    circle {
      &:first-of-type {
        stroke-opacity: 0;
      }
    }
  }
`;

const ContactCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  padding: 2rem 3rem 3rem;
`;

const ContactPanel = styled(Panel)`
  box-sizing: border-box;
  padding: 1.25rem;
  margin: 0 0 0.5rem 0;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  border-radius: 0.25rem;
`;

const ContactPanelLeft = styled.div`
  display: flex;
  align-items: center;

  ${Icon} {
    padding: 0;
  }
`;

const ContactLink = styled(Link)`
  margin: 0;
`;

const ContactText = styled(Text)`
  margin: 0;
`;

const IconText = styled(Text)`
  font-weight: bold;
  margin-left: 1.25rem;
`;

export const CloseButton = styled(Button)`
  width: 10.5rem;
  margin-top: 2.5rem;
`;

export const ContactCard: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const [, setModalState] = useModalState();

  return (
    <CardWrapper>
      <ContactCardHeader>
        <Icon name={IconNames.HelpCircle} />
        <Heading1>{t('Contact us')}</Heading1>
        <ServiceText size={Size.Large}>
          <Trans t={t}>
            Our client services team are available:
            <br />
            9.00am - 6:00pm, Monday - Friday
          </Trans>
        </ServiceText>
      </ContactCardHeader>
      <ContactCardContent>
        <ContactPanel>
          <ContactPanelLeft>
            <Icon name={IconNames.Mail} size={Size.Large} />
            <IconText size={Size.Large}>{t('Email')}</IconText>
          </ContactPanelLeft>
          <ContactLink href={`mailto:${BROKING_SERVICE_EMAIL}`} target={OPEN_BLANK_URL_TARGET} size={Size.Large}>
            {BROKING_SERVICE_EMAIL}
          </ContactLink>
        </ContactPanel>
        <ContactPanel>
          <ContactPanelLeft>
            <Icon name={IconNames.PhoneCall} size={Size.Large} />
            <IconText>{t('Phone')}</IconText>
          </ContactPanelLeft>
          <ContactText size={Size.Large}>{CMC_CONTACT_US_PHONE}</ContactText>
        </ContactPanel>
        <ContactPanel>
          <ContactPanelLeft>
            <Icon name={IconNames.Home} size={Size.Large} />
            <IconText>{t('Website')}</IconText>
          </ContactPanelLeft>
          <ContactLink href={CMC_MARKETS_WEBSITE_STOCKBROKING_URL} target={OPEN_BLANK_URL_TARGET} size={Size.Large}>
            {t('About CMC Invest Singapore')}
          </ContactLink>
        </ContactPanel>
        {/* <ContactPanel>
          <ContactPanelLeft>
            <Icon name={IconNames.HelpCircle} size={Size.Large} />
            <IconText>{t('FAQs')}</IconText>
          </ContactPanelLeft>
          <ContactLink href={CMC_MARKETS_WEBSITE_FAQ_URL} target={OPEN_BLANK_URL_TARGET} size={Size.Large}>
            {t('CMC Invest')}
          </ContactLink>
        </ContactPanel> */}
        <CloseButton label={t('Close')} type='button' onClick={() => setModalState({ open: false } as IModalState)} />
      </ContactCardContent>
    </CardWrapper>
  );
};
