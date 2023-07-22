import React, { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { Content, FormLoader, FormLoaderWrapper, FormWrapper, Header } from './Form';
import { Heading2, Icon, IconNames, Size, Text, useTestId } from '@cmctechnology/phoenix-stockbroking-web-design';
import { getFormDetails } from './FormDetails';
import { FRFormStep, JourneyTree, Page, ScreenStage, Step } from '@cmctechnology/webinvest-store-client';
import { pages } from '../../constants/pageConstants';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export interface WrappedFRStep {
  step: FRFormStep;
  props?: any;
}
export interface IBuildStepFormProps {
  step: FRFormStep;
  previousStep?: Step;
  setSubmissionStep: Dispatch<SetStateAction<Step | WrappedFRStep | undefined>>;
  submissionProcess: boolean;
  onCloseModal?: () => void;
}

export const CloseIcon = styled(Icon)`
  position: absolute;
  right: 1rem;
  top: 1rem;
`;

export const BuildStepForm: React.FC<IBuildStepFormProps> = ({ previousStep, step, setSubmissionStep, submissionProcess, onCloseModal, ...rest }) => {
  const { generateTestId } = useTestId(rest, `BuildStepForm`);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const stage = step.getCallbacksOfType(CMCFRSDK.CallbackType.ReCaptchaCallback).length > 0 ? ScreenStage.Recaptcha : (step.getStage() as ScreenStage);

  useEffect(() => {
    // not on login specific tree/form, should redirect to login route.
    // e.g. several cases when the rout is not login, but the step is received is login,
    // as a result loads the login form under /different-route (e.g. forgot-password, forgot-username).
    // in order to avoid this, should redirect to login.
    const tree = CMCFRSDK.Config.get().tree;

    if (tree !== JourneyTree.FR_JOURNEY_LOGIN && stage === ScreenStage.Login) {
      navigate(`../${pages[Page.LogIn].path}`);
    }
  }, [step]);

  const { skipStep, title, subtitle, content } = useMemo(() => getFormDetails({ previousStep, step, setSubmissionStep, stage, t }), [step, previousStep]);

  return (
    <>
      {skipStep ? (
        <>
          <FormLoaderWrapper>
            <FormLoader />
            {content}
          </FormLoaderWrapper>
        </>
      ) : (
        <FormWrapper>
          <Header>
            <Heading2>{title}</Heading2>
            {!!onCloseModal && <CloseIcon name={IconNames.X} size={Size.Medium} onClick={onCloseModal} {...generateTestId('closeIcon')} />}
            {!!subtitle && <Text>{subtitle}</Text>}
          </Header>
          {submissionProcess ? <FormLoader /> : <Content>{content}</Content>}
        </FormWrapper>
      )}
    </>
  );
};
