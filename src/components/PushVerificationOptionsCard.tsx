import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
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
  useTestId
} from '@cmctechnology/phoenix-stockbroking-web-design';
import { FlexColumn, FlexRow } from './Forms/Form';

const CardWrapper = styled(CardLarge)`
  width: 35rem;
  margin: 0;

  @media only screen and (max-width: ${breakpoint.mobileSmall}) {
    width: calc(100vw - 3rem);
  }
`;

const Header = styled(CardHeader)`
  padding: 3rem 3rem 0;
  background-color: ${({ theme }) => theme.colours.card.large.background};
  justify-content: center;
  box-sizing: border-box;

  ${Heading1} {
    margin: 0;
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

const Content = styled(CardContent)<Pick<IPushVerificationOptionsCardProps, `isInModal`>>`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  padding: ${(props) => (props.isInModal ? `0` : `2rem 3rem 3rem`)};
`;

const CardPanel = styled(Panel)`
  box-sizing: border-box;
  padding: 1.25rem;
  margin: 0 0 0.5rem 0;
  width: 100%;
  align-items: flex-start;
  border-radius: 0.25rem;
  flex-direction: column;
  gap: 0.25rem;
  white-space: normal;

  ${Text} {
    margin: 0;
  }
`;

const Label = styled(Text)`
  font-weight: bold;
  margin-left: 1.25rem;
`;

const Row = styled(FlexRow)`
  gap: 1rem;
  align-items: center;
`;

export const CloseButton = styled(Button)`
  width: 10.5rem;
  margin-top: 2.5rem;
`;

export const BackupCodesButton = styled(Button)`
  width: 14rem;
`;

export interface IPushVerificationOptionsCardProps {
  backupCodesSelectionHandler: () => void;
  goBackHandler?: () => void;
  isInModal?: boolean;
}

export const PushVerificationOptionsCard: React.FC<IPushVerificationOptionsCardProps> = ({
  backupCodesSelectionHandler,
  isInModal,
  goBackHandler,
  ...rest
}): JSX.Element => {
  const { generateTestId } = useTestId(rest, `PushVerificationOptionsCard`);
  const { t } = useTranslation();
  const [, setModalState] = useModalState();

  const getOptionsContent = (): JSX.Element => (
    <Content isInModal={isInModal}>
      <CardPanel>
        <Label>
          <b>{t(`Resend Push Notification`)}</b>
        </Label>
        <Text size={Size.Medium}>{t(`We will send you a new push notification automatically in 2 minutes.`)}</Text>
      </CardPanel>
      <CardPanel>
        <Row>
          <FlexColumn>
            <Label>
              <b>{t(`Backup Codes`)}</b>
            </Label>
            <Text size={Size.Medium}>{t(`No longer have your device? You can use the backup codes provided during setup`)}</Text>
          </FlexColumn>
          <BackupCodesButton
            label={t('Use Backup')}
            onClick={() => {
              backupCodesSelectionHandler();
              if (!isInModal) {
                setModalState({ open: false } as IModalState);
              }
            }}
            {...generateTestId(`codes`)}
          />
        </Row>
      </CardPanel>
      <CardPanel>
        <Label>
          <b>{t(`Contact Us`)}</b>
        </Label>
        <Text size={Size.Medium}>{t(`Call our Client Service team on 1300 360 071`)}</Text>
      </CardPanel>
      <CloseButton
        label={isInModal ? t('Back') : t('Close')}
        onClick={() => (isInModal && goBackHandler ? goBackHandler() : setModalState({ open: false } as IModalState))}
        {...generateTestId(`close`)}
      />
    </Content>
  );

  return (
    <>
      {isInModal ? (
        getOptionsContent()
      ) : (
        <CardWrapper>
          <Header>
            <Icon name={IconNames.HelpCircle} />
            <Heading1>{t(`Options`)}</Heading1>
          </Header>
          {getOptionsContent()}
        </CardWrapper>
      )}
    </>
  );
};
