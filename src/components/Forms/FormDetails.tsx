import { LoginForm } from './LoginForm';
import { RegisterMFAAuthOptionsForm } from '../Forms/RegisterMFAAuthOptionsForm';
import { InnerOTPDecisionForm } from '../Forms/InnerOTPDecisionForm';
import { RegisterMFAAnotherDeviceForm } from '../Forms/RegisterMFAAnotherDeviceForm';
import { RegisterMFAAuthAppForm } from '../Forms/RegisterMFAAuthAppForm';
import { RegisterMFAPushRegistrationForm } from '../Forms/RegisterMFAPushRegistrationForm';
import { RegisterMFARecoveryCodesForm } from '../Forms/RegisterMFARecoveryCodesForm';
import { RequestMFAPushPollingWaitForm } from '../Forms/RequestMFAPushPollingWaitForm';
import { ProfileCollectorForm } from './ProfileCollectorForm';
import { RequestMFAResultForm } from './RequestMFAResultForm';
import { RequestMFARecoveryCodesForm } from './RequestMFARecoveryCodesForm';
import { RequestMFAAuthOptionsForm } from './RequestMFAAuthOptionsForm';
import { RegisterMFAStartForm } from './RegisterMFAStartForm';
import { ForgotPasswordUsernameForm } from './ForgotPasswordUsernameForm';
import { ChangePasswordEnterNewForm } from './ChangePasswordEnterNewForm';
import { ForgotUsernameDetailsForm } from './ForgotUsernameDetailsForm';
import { ChangeUsernameEnterForm } from './ChangeUsernameEnterForm';
import { IBuildStepFormProps } from './BuildStepForm';
import { TFunction } from 'i18next';
import { ReCaptchaForm } from './ReCaptchaForm';
import { RetryActionForm } from './RetryActionForm';
import { InnerOTPResendOptionForm } from './InnerOTPResendOptionForm';
import { RequestMFARecoveryCodesChoiceForm } from './RequestMFARecoveryCodesChoiceForm';
import { LoginRetryForm } from './LoginRetryForm';
import { InactiveAccountForm } from './InactiveAccountForm';
import { ForgotUsernameEmailResultForm } from './ForgotUsernameEmailResultForm';
import { RegisterMFAEnterEmailForm } from './RegisterMFAEnterEmailForm';
import { LockedAccountForm } from './LockedAccountForm';
import { ChangePasswordEnterCurrentForm } from './ChangePasswordEnterCurrentForm';
import { DisableMFAConfirmForm } from './DisableMFAConfirmForm';
import { ErrorMessageCode, JourneyTree, ScreenStage, authenticatedJourneyTree, CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { IErrorOutcome } from '@cmctechnology/webinvest-store-client/dist/js/utils/FRErrorParser';

export interface IErrorFormDetails {
  title: string;
  subtitle?: string;
  content: JSX.Element;
}
export interface IFormDetails extends IErrorFormDetails {
  skipStep?: boolean;
}

interface IGetFormDetailsProps extends Omit<IBuildStepFormProps, `submissionProcess`> {
  stage: ScreenStage;
  t: TFunction;
}

interface IGetErrorFormDetailsProps {
  errorOutcome: IErrorOutcome;
  t: TFunction;
}

export const getFormDetails = ({ previousStep, step, setSubmissionStep, stage, t }: IGetFormDetailsProps): IFormDetails => {
  const tree: JourneyTree = CMCFRSDK.Config.get().tree as JourneyTree;
  const isAuthenticatedJourney = !!authenticatedJourneyTree[tree];

  switch (stage) {
    case ScreenStage.Login: {
      // Submit username/password
      return {
        title: t(`Login`),
        content: (
          <LoginForm step={step} previousStep={previousStep} applyActionCallback={(shiftKey: boolean) => setSubmissionStep({ step, props: { shiftKey } })} />
        )
      };
    }
    case ScreenStage.LoginRetry: {
      return {
        title: t(`Login`),
        content: <LoginRetryForm step={step} applyActionCallback={() => setSubmissionStep(step)} />,
        skipStep: true
      };
    }
    case ScreenStage.RegisterMFAProfileCollector:
    case ScreenStage.MFARiskCheckProfileCollector:
    case ScreenStage.StepupProfileCollector: {
      // Share device profile metadata.
      return {
        title: t(`Device Information Capture`),
        content: <ProfileCollectorForm step={step} applyActionCallback={() => setSubmissionStep(step)} />,
        skipStep: true
      };
    }
    case ScreenStage.RegisterMFAAuthOptions: {
      // Submit MFA flow option (e.g. email, push, web auth).
      return {
        title: t(`Multi-Factor Authentication`),
        subtitle: t(`Please set up one of the below authentication methods to increase security on your account.`),
        content: <RegisterMFAAuthOptionsForm step={step} applyActionCallback={() => setSubmissionStep(step)} />
      };
    }
    case ScreenStage.RegisterMFAEnterEmail: {
      return {
        title: t(`Email Address Required`),
        subtitle: t(
          `Your account does not currenly have a registered email address. Please add details below to continue the Multi Factor authentication journey.`
        ),
        content: <RegisterMFAEnterEmailForm step={step} applyActionCallback={() => setSubmissionStep(step)} />
      };
    }
    case ScreenStage.InnerOTPDecision: {
      // Submit or resend verification code.
      return {
        title: t(`Verification Code`),
        content: <InnerOTPDecisionForm step={step} previousStep={previousStep} applyActionCallback={() => setSubmissionStep(step)} />
      };
    }
    case ScreenStage.RegisterMFAAnotherDevice: {
      return {
        title: t(`Register another MFA method ?`),
        content: <RegisterMFAAnotherDeviceForm step={step} applyActionCallback={() => setSubmissionStep(step)} />
      };
    }
    case ScreenStage.RegisterMFAAuthApp: {
      return {
        title: t(`Authorise Device`),
        subtitle: t(`Follow these steps to setup MFA Push Notifications`),
        content: <RegisterMFAAuthAppForm step={step} applyActionCallback={() => setSubmissionStep(step)} />
      };
    }
    case ScreenStage.RegisterMFAPushRegistration: {
      return {
        title: t(`Authorise Device`),
        subtitle: t(`Follow these steps to setup MFA Push Notifications`),
        content: <RegisterMFAPushRegistrationForm step={step} applyActionCallback={() => setSubmissionStep({ step, props: { skipLoad: true } })} />
      };
    }
    case ScreenStage.RegisterMFARecoveryCodes: {
      return {
        title: t(`Backup`),
        subtitle: t(`If you lose access to your security method use the below codes to authenticate. These backup codes can only be used once.`),
        content: <RegisterMFARecoveryCodesForm step={step} applyActionCallback={() => setSubmissionStep(step)} />
      };
    }
    case ScreenStage.RequestMFAPushPollingWait: {
      return {
        title: t(`Verification`),
        content: <RequestMFAPushPollingWaitForm step={step} applyActionCallback={() => setSubmissionStep({ step, props: { skipLoad: true } })} />
      };
    }
    case ScreenStage.RequestMFAOk:
    case ScreenStage.RequestMFAFail: {
      return {
        title: t(`Verification`),
        content: <RequestMFAResultForm step={step} applyActionCallback={() => setSubmissionStep(step)} />
      };
    }
    case ScreenStage.RequestMFARecoveryCodes: {
      return {
        title: t(`Recovery Code`),
        content: <RequestMFARecoveryCodesForm step={step} applyActionCallback={() => setSubmissionStep(step)} />
      };
    }
    case ScreenStage.RequestMFARecoveryCodesChoice: {
      return {
        title: t(`Enter a Recovery Code or Exit`),
        content: <RequestMFARecoveryCodesChoiceForm step={step} applyActionCallback={() => setSubmissionStep(step)} />,
        skipStep: isAuthenticatedJourney
      };
    }
    case ScreenStage.RequestMFAOptions: {
      return {
        title: t(`Verification`),
        content: <RequestMFAAuthOptionsForm step={step} applyActionCallback={() => setSubmissionStep(step)} />
      };
    }
    case ScreenStage.RegisterMFAStart: {
      return {
        title: t(`Multi-Factor Authentication`),
        subtitle: t(`Do you want to register MFA?`),
        content: <RegisterMFAStartForm step={step} applyActionCallback={() => setSubmissionStep(step)} />,
        skipStep: isAuthenticatedJourney
      };
    }
    case ScreenStage.ForgotPasswordUsername: {
      return {
        title: t(`Reset Password`),
        content: <ForgotPasswordUsernameForm step={step} applyActionCallback={() => setSubmissionStep(step)} />
      };
    }
    case ScreenStage.ChangePasswordEnterNew: {
      return {
        title: t(`Reset Password`),
        content: <ChangePasswordEnterNewForm step={step} previousStep={previousStep} applyActionCallback={() => setSubmissionStep(step)} />
      };
    }
    case ScreenStage.ChangePasswordCurrentPassword: {
      return {
        title: t(`Enter your current password`),
        content: <ChangePasswordEnterCurrentForm step={step} previousStep={previousStep} applyActionCallback={() => setSubmissionStep(step)} />
      };
    }
    case ScreenStage.ForgotUsernameDetails: {
      return {
        title: t(`Forgot Username`),
        content: <ForgotUsernameDetailsForm step={step} applyActionCallback={() => setSubmissionStep(step)} />
      };
    }
    case ScreenStage.ForgotUsernameEmailOk:
    case ScreenStage.ForgotUsernameEmailFail: {
      return {
        title: t(`Forgot Username`),
        content: <ForgotUsernameEmailResultForm step={step} applyActionCallback={() => setSubmissionStep(step)} />
      };
    }
    case ScreenStage.ChangeUsernameEnter: {
      return {
        title: t(`Change Username`),
        content: <ChangeUsernameEnterForm step={step} applyActionCallback={() => setSubmissionStep(step)} />
      };
    }
    // SKIP STEPS
    case ScreenStage.Recaptcha: {
      return {
        title: t(`Loading Recaptcha`),
        content: <ReCaptchaForm step={step} applyActionCallback={() => setSubmissionStep(step)} />,
        skipStep: true
      };
    }
    case ScreenStage.ChangePasswordEnterNewRetry:
    case ScreenStage.ChangePasswordCurrentPasswordRetry: {
      return {
        title: t(`Change Password Enter New Retry`),
        content: <RetryActionForm step={step} applyActionCallback={() => setSubmissionStep(step)} />,
        skipStep: true
      };
    }
    case ScreenStage.InnerOTPResendOption: {
      /**
       * Submit either code submit, or code resend options.
       * The step contains "submit and resend" options.
       * To match the cmc designs, when landing to this screen initially, it needs auto proceed to submit without showing the mentioned options.
       * When landing to this screen, as a result of "code resend" action, the screen should auto proceed to resend.
       * The proceed action is determined in localStorage.
       * Needs a proper design while processing to the next step e.g. a loading indicator with a message.
       */
      return {
        title: t(`Inner OTP Resend`),
        content: <InnerOTPResendOptionForm step={step} applyActionCallback={() => setSubmissionStep(step)} />,
        skipStep: true
      };
    }
    case ScreenStage.DisableMFAConfirm: {
      return {
        title: t(`Confirm`),
        content: <DisableMFAConfirmForm step={step} applyActionCallback={() => setSubmissionStep(step)} />
      };
    }
  }
  return {
    title: t(`Unknown Step!`),
    content: <>{t(`unknown-step`)}</>
  };
};

export const getErrorFormDetails = ({ errorOutcome, t }: IGetErrorFormDetailsProps): IErrorFormDetails => {
  const { code } = errorOutcome;

  // will change to switch once more cases.
  if (code === ErrorMessageCode.CMCAccountInactive) {
    return {
      title: t(`Account Inactive`),
      content: <InactiveAccountForm errorOutcome={errorOutcome} />
    };
  }
  if (code === ErrorMessageCode.CMCAccountLocked) {
    return {
      title: t(`Account Locked`),
      content: <LockedAccountForm errorOutcome={errorOutcome} />
    };
  }
  return {
    title: t(`Unknown Error!`),
    content: <>{t(`unknown-error`)}</>
  };
};
