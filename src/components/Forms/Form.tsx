import styled from 'styled-components';
import { breakpoint, ButtonLink, CardContent, CardFooter, CardHeader, CardLarge, Heading2 } from '@cmctechnology/phoenix-stockbroking-web-design';
import { FRFormStep, Step } from '@cmctechnology/webinvest-store-client';
import { IErrorOutcome } from '@cmctechnology/webinvest-store-client/dist/js/utils/FRErrorParser';

export interface IFormProps {
  step: FRFormStep;
  previousStep?: Step;
  applyActionCallback: (args?: any) => void;
}

export interface IErrorFormProps {
  errorOutcome: IErrorOutcome;
}

const CARD_WIDTH = `30rem`;

export const FormLoaderWrapper = styled.div`
  width: ${CARD_WIDTH};
  text-align: center;

  @media only screen and (max-width: ${breakpoint.mobileSmall}) {
    width: 100%;
  }
`;

export const FormLoader = styled.span`
  margin: 2rem;
  padding: 2rem;
  width: 5rem;
  height: 5rem;
  border: 0.313rem solid ${({ theme }) => theme.colours.default.border};
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const FormWrapper = styled(CardLarge)`
  width: ${CARD_WIDTH};
  max-width: ${CARD_WIDTH};

  @media only screen and (max-width: ${breakpoint.mobileSmall}) {
    width: 100%;
  }
`;

export const Header = styled(CardHeader)`
  padding: 2rem;
  width: 100%;
  justify-content: center;
  box-sizing: border-box;
  min-height: 8rem;

  ${Heading2} {
    margin-top: 0;
    margin-bottom: 0;
    color: ${({ theme }) => theme.colours.card.header.text};
  }
`;

export const Content = styled(CardContent)`
  padding: 2rem;
  width: 100%;
`;

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`;

export const Footer = styled(CardFooter)`
  padding: 0 2rem 3rem;
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;

export const LinkButton = styled(ButtonLink)`
  text-decoration: none;
`;
