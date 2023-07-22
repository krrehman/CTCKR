import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useModalState, IModalState, Panel, Icon, IconNames, breakpoint, Size } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ContactCard } from './ContactCard';

const IconWrapper = styled(Panel)`
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colours.button.background};
  padding: 1rem 1.25rem;
  border-radius: 1.75rem;
  gap: 1rem;
  font-family: ${({ theme }) => theme.text.font};
  color: ${({ theme }) => theme.colours.default.background};
  @media (max-width: ${breakpoint.mobile}) {
    flex-direction: row;
  }

  ${Icon} {
    color: ${({ theme }) => theme.colours.button.background};
    background-color: ${({ theme }) => theme.colours.default.background};
    padding: 0;

    circle {
      &:first-of-type {
        stroke-opacity: 0;
      }
    }
  }
`;

export const HelpButton: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const [, setModalState] = useModalState();
  const infoClickHandler = (): void => {
    const state: IModalState = {
      dialog: <ContactCard />,
      open: true
    };
    setModalState(state);
  };

  return (
    <IconWrapper onClick={infoClickHandler}>
      <Icon name={IconNames.HelpCircle} size={Size.Large} />
      {t('Help')}
    </IconWrapper>
  );
};
