import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  authenticatedJourneyTree,
  clientActions,
  FRFormStep,
  JourneyTree,
  LoginApiModelResult,
  ScreenStage,
  Step
} from '@cmctechnology/webinvest-store-client';
import { ApiRequestStatus, frontendActions, useFrontendContext } from '@cmctechnology/webinvest-store-frontend';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { useTranslation } from 'react-i18next';
import { BuildStepForm, WrappedFRStep } from '../Forms/BuildStepForm';
import { IStore } from '../../store/Store';
import { SIGNIN_API_RESULT_KEY } from '../../constants/apiKeyConstants';
import { IPageProps } from '../../pages/PageBase';
import { FormLoader, FormLoaderWrapper } from '../Forms/Form';
import { BuildErrorForm } from '../Forms/BuildErrorForm';

export interface IStepManagerProps extends IPageProps {
  step?: Step;
  previousStep?: Step;
  setSubmissionStep: Dispatch<SetStateAction<Step>>;
  setSubmissionProcess: Dispatch<SetStateAction<boolean>>;
  submissionProcess: boolean;
}

export interface IUserDetails {
  username?: string;
  password?: string;
  accessToken?: string;
  shiftKey?: boolean;
}

export const StepManager: React.FC<IStepManagerProps> = ({
  previousStep,
  step,
  setSubmissionStep,
  setSubmissionProcess,
  submissionProcess,
  onNext,
  onInterceptorsRequired,
  onCloseModal
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const status = useSelector((store: IStore) => store.frontend.apiResults[SIGNIN_API_RESULT_KEY]?.status);
  const errorCode = useSelector((store: IStore) => store.frontend.apiResults[SIGNIN_API_RESULT_KEY]?.errorCode);
  const interceptors = useSelector((store: IStore) => store.client.interceptors);
  const crc = useSelector((store: IStore) => store.client.crc);
  const [userDetails, setUserDetails] = useState<IUserDetails>({ shiftKey: false });
  const [loadInterceptors, setLoadInterceptors] = useState(false);
  const { themeConfig } = useFrontendContext();

  useEffect(() => {
    const submitInteceptorsRequired = async () => {
      const tokens: CMCFRSDK.Tokens = await CMCFRSDK.TokenStorage.get();
      onInterceptorsRequired!({ ...userDetails, interceptors, accessToken: tokens.accessToken });
    };

    const handleStatus = async () => {
      if (loadInterceptors && status === ApiRequestStatus.NotSubmitted) {
        setLoadInterceptors(false);
        await submitInteceptorsRequired();
      }

      if (status === ApiRequestStatus.Success) {
        if (interceptors?.length > 0) {
          dispatch<any>(frontendActions.apiRequestReset(SIGNIN_API_RESULT_KEY));
          setLoadInterceptors(true);
          return;
        }

        if (crc) {
          dispatch<any>(frontendActions.apiRequestReset(SIGNIN_API_RESULT_KEY));
          onNext();
        }
      }

      if (status === ApiRequestStatus.Failed && errorCode === LoginApiModelResult.InterceptorRequired) {
        dispatch<any>(frontendActions.apiRequestReset(SIGNIN_API_RESULT_KEY));
        setLoadInterceptors(true);
      }
    };
    handleStatus();
  }, [status, crc, interceptors, loadInterceptors]);

  useEffect(() => {
    if (step?.type === CMCFRSDK.StepType.LoginSuccess) {
      const submitSignin = async () => {
        const tokens: CMCFRSDK.Tokens = await CMCFRSDK.TokenStorage.get();
        dispatch<any>(clientActions.signInWithToken(tokens.accessToken, !!userDetails?.shiftKey, themeConfig.source));
      };

      // no need to submit signin, if triggered by one of authenticated journeys.
      // should call onNext straight cause already signed in.
      if (authenticatedJourneyTree[CMCFRSDK.Config.get().tree as JourneyTree]) {
        onNext();
      } else {
        submitSignin();
      }
    }
  }, [step]);

  if (!step || step?.type === CMCFRSDK.StepType.LoginSuccess) {
    return (
      <FormLoaderWrapper>
        <FormLoader />
      </FormLoaderWrapper>
    );
  } else if (step?.type === CMCFRSDK.StepType.LoginFailure) {
    return step.errorOutcome?.code ? <BuildErrorForm errorOutcome={step.errorOutcome} /> : <>{t(`Manage Login Failure.`)}</>;
  }

  return (
    <>
      {step?.type === CMCFRSDK.StepType.Step && (
        <BuildStepForm
          step={step}
          setSubmissionStep={(submittedStep) => {
            const unwrapped = (submittedStep as WrappedFRStep)?.step;
            const skipLoad = !!(submittedStep as WrappedFRStep)?.props?.skipLoad;
            const stage = unwrapped?.getStage() || (submittedStep as FRFormStep)?.getStage();
            const isLoginTree = CMCFRSDK.Config.get().tree === JourneyTree.FR_JOURNEY_LOGIN;

            if (stage === ScreenStage.Login) {
              const username = unwrapped.getCallbackOfType(CMCFRSDK.CallbackType.NameCallback).getInputValue(`IDToken1`) as string;
              const password = unwrapped.getCallbackOfType(CMCFRSDK.CallbackType.PasswordCallback).getInputValue(`IDToken2`) as string;
              const { shiftKey } = (submittedStep as WrappedFRStep)?.props;
              setUserDetails({ username, password, shiftKey });
            }

            // should update stored login password, if after login, the system asks to change password.
            // only applicable to login tree.
            // updated user details are used later to submit interceptors (if user has any).
            if (isLoginTree && stage === ScreenStage.ChangePasswordEnterNew) {
              const updatedPassword = (submittedStep as FRFormStep)
                .getCallbackOfType(CMCFRSDK.CallbackType.ValidatedCreatePasswordCallback)
                .getInputValue(`IDToken1`) as string;
              setUserDetails({ ...userDetails, password: updatedPassword });
            }

            if (!skipLoad) {
              setSubmissionProcess(true);
            }
            setSubmissionStep(unwrapped ?? submittedStep);
          }}
          previousStep={previousStep}
          submissionProcess={submissionProcess}
          onCloseModal={onCloseModal}
        />
      )}
    </>
  );
};
