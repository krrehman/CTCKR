import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { JourneyHandlerAction, clientActions, useJourneyHandler } from '@cmctechnology/webinvest-store-client';
import { breakpoint } from '@cmctechnology/phoenix-stockbroking-web-design';
import { StepManager } from './StepManager';
import { IPageProps } from '../../pages/PageBase';
import { redirectToLogin } from '../../flows/logout';

const ScreenWrapper = styled.div`
  margin: 1.5rem;
  @media only screen and (max-width: 90.5rem) {
    display: flex;
    justify-content: center;
  }

  @media only screen and (max-width: ${breakpoint.mobileSmall}) {
    margin-bottom: 0;
  }
`;

export interface IJourneyManagerProps extends IPageProps {
  action: JourneyHandlerAction;
}

export const JourneyManager: React.FC<IJourneyManagerProps> = (props) => {
  const dispatch = useDispatch();

  // Will be executed for internal flows only, to logout user e.g.
  // JourneyTree.FR_JOURNEY_CHANGE_PASSWORD
  // JourneyTree.FR_JOURNEY_CHANGE_USERNAME
  // JourneyTree.FR_JOURNEY_ENABLE_MFA
  // JourneyTree.FR_JOURNEY_DISABLE_MFA
  /* istanbul ignore next */
  const forceCmcSignout = (falconDisabled?: boolean) => {
    dispatch<any>(clientActions.signOut());

    // only for non falcon version, and only for internal flows.
    // for falcon version this case is handled by webinvest-frontend.
    if (falconDisabled) {
      // redirect to login.
      redirectToLogin();
    }
  };

  const { action } = props;
  const { renderStep, setSubmissionStep, submissionStep, setSubmissionProcess, submissionProcess } = useJourneyHandler({ ...action, forceCmcSignout });

  return (
    <ScreenWrapper>
      <StepManager
        previousStep={submissionStep}
        step={renderStep}
        setSubmissionStep={setSubmissionStep}
        setSubmissionProcess={setSubmissionProcess}
        submissionProcess={submissionProcess}
        {...props}
      />
    </ScreenWrapper>
  );
};
