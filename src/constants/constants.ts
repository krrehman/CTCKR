import { KeyValueTranslated } from '../models/translation';

export const PROMO_POD_MODULE_NAME = `webinvest-module-promo-pods`;

export const FR_AUTHENTICATOR_APPLE_STORE_URL = `https://itunes.apple.com/app/forgerock-authenticator/id1038442926`;
export const FR_AUTHENTICATOR_PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=com.forgerock.authenticator`;

export const ENTER_KEY = `Enter`;
export const CODE_RESEND_STORAGE_NAME = `code-resend`;
export const CODE_SUBMIITED_STORAGE_NAME = `code-submitted`;

export enum MFATypeInput {
  Email = 'email',
  Push = 'push',
  WebAuthN = 'webauthn',
  None = 'none'
}

export const MFA_TYPES: KeyValueTranslated<MFATypeInput> = {
  [MFATypeInput.Email]: (t) => t(`Email`),
  [MFATypeInput.Push]: (t) => t(`Push Notification`),
  [MFATypeInput.WebAuthN]: (t) => t(`Web Authentication`),
  [MFATypeInput.None]: (t) => t(`None`)
};

export enum AuthenticationChoiceOption {
  Ok = 'ok',
  Activate = 'activate',
  Exit = 'exit'
}

export enum RequestMFARecoveryCodesChoiceOption {
  Recovery = 'recovery',
  Exit = 'exit'
}

export const AUTHENTICATION_TYPE_DESCRIPTIONS: KeyValueTranslated<AuthenticationChoiceOption> = {
  [AuthenticationChoiceOption.Ok]: (t) => t(`Register MFA`),
  [AuthenticationChoiceOption.Activate]: (t) => t(`Activate`),
  [AuthenticationChoiceOption.Exit]: (t) => t(`Not Now`)
};

export const RECOVERY_CODES_CHOICE_OPTIONS: KeyValueTranslated<RequestMFARecoveryCodesChoiceOption> = {
  [RequestMFARecoveryCodesChoiceOption.Recovery]: (t) => t(`Recovery`),
  [RequestMFARecoveryCodesChoiceOption.Exit]: (t) => t(`Exit`)
};

export const MFA_TYPE_DESCRIPTIONS: KeyValueTranslated<MFATypeInput> = {
  [MFATypeInput.Email]: (t) => t(`We'll send a code to your registered email address.`),
  [MFATypeInput.Push]: (t) =>
    t(
      `We'll send a push notification to your mobile device. Note you will need to have our app installed and have accepted Push Notifications for this to work.`
    ),
  [MFATypeInput.WebAuthN]: (t) =>
    t(`This method allows you to authenticate using a device such as a fingerprint scanner on your laptop and is handled by your browser.`),
  [MFATypeInput.None]: (t) => t(`None`)
};

export const MONTHS: KeyValueTranslated = {
  '01': (t) => t('January'),
  '02': (t) => t('February'),
  '03': (t) => t('March'),
  '04': (t) => t('April'),
  '05': (t) => t('May'),
  '06': (t) => t('June'),
  '07': (t) => t('July'),
  '08': (t) => t('August'),
  '09': (t) => t('September'),
  '10': (t) => t('October'),
  '11': (t) => t('November'),
  '12': (t) => t('December')
};
