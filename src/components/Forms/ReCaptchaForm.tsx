/**
 * ReCaptchaForm
 *
 * Appear when step.getStage = ScreenStage.{to be decided} (see in ScreenStage enums).
 * Requests re-captcha token by recaptchaSiteKey and submits it to FR.
 */
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import React, { useEffect } from 'react';
import { IFormProps } from './Form';

export const ReCaptchaForm: React.FC<IFormProps> = ({ step, applyActionCallback }): JSX.Element => {
  const reCaptchaKey = step.callbacks[0].getOutputValue(`recaptchaSiteKey`) as string;
  const reCaptchaUrl = step.callbacks[0].getOutputValue(`captchaApiUri`) as string;

  const handleLoaded = () => {
    (window as any).grecaptcha.ready(() => {
      (window as any).grecaptcha
        .execute(reCaptchaKey, { action: `login` })
        .then((token: string) => {
          step.setCallbackValue(CMCFRSDK.CallbackType.ReCaptchaCallback, token);
          applyActionCallback();
          return token;
        })
        .catch(() => {
          // recaptcha error.
        });
    });
  };

  useEffect(() => {
    const script = document.createElement(`script`);
    script.src = `${reCaptchaUrl}?render=${reCaptchaKey}`;
    script.addEventListener(`load`, handleLoaded);
    document.body.append(script);
    return () => script.removeEventListener(`load`, handleLoaded);
  }, []);

  return <></>;
};
