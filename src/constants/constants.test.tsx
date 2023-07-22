import { AuthenticationChoiceOption, AUTHENTICATION_TYPE_DESCRIPTIONS, MFATypeInput, MFA_TYPES, MFA_TYPE_DESCRIPTIONS } from './constants';

describe(`constants`, () => {
  let tfn: any;

  beforeEach(() => {
    tfn = jest.fn((t: string) => t);
  });

  describe(`MFA_TYPES`, () => {
    it(`should return value for MFATypeInput.Email`, () => {
      const output = `Email`;

      const result = MFA_TYPES[MFATypeInput.Email]!(tfn);
      expect(result).toEqual(output);
    });

    it(`should return value for MFATypeInput.PushAuthentication`, () => {
      const output = `Push Notification`;

      const result = MFA_TYPES[MFATypeInput.Push]!(tfn);
      expect(result).toEqual(output);
    });

    it(`should return value for MFATypeInput.WebAuthN`, () => {
      const output = `Web Authentication`;

      const result = MFA_TYPES[MFATypeInput.WebAuthN]!(tfn);
      expect(result).toEqual(output);
    });

    it(`should return value for MFATypeInput.None`, () => {
      const output = `None`;

      const result = MFA_TYPES[MFATypeInput.None]!(tfn);
      expect(result).toEqual(output);
    });
  });

  describe(`MFA_TYPE_DESCRIPTIONS`, () => {
    it(`should return value for MFATypeInput.Email`, () => {
      const output = `We'll send a code to your registered email address.`;

      const result = MFA_TYPE_DESCRIPTIONS[MFATypeInput.Email]!(tfn);
      expect(result).toEqual(output);
    });

    it(`should return value for MFATypeInput.Push`, () => {
      const output = `We'll send a push notification to your mobile device. Note you will need to have our app installed and have accepted Push Notifications for this to work.`;

      const result = MFA_TYPE_DESCRIPTIONS[MFATypeInput.Push]!(tfn);
      expect(result).toEqual(output);
    });

    it(`should return value for MFATypeInput.WebAuthN`, () => {
      const output = `This method allows you to authenticate using a device such as a fingerprint scanner on your laptop and is handled by your browser.`;

      const result = MFA_TYPE_DESCRIPTIONS[MFATypeInput.WebAuthN]!(tfn);
      expect(result).toEqual(output);
    });

    it(`should return value for MFATypeInput.None`, () => {
      const output = `None`;

      const result = MFA_TYPE_DESCRIPTIONS[MFATypeInput.None]!(tfn);
      expect(result).toEqual(output);
    });
  });

  describe(`AUTHENTICATION_TYPE_DESCRIPTIONS`, () => {
    it(`should return value for AuthenticationChoiceOption.Ok`, () => {
      const output = `Register MFA`;

      const result = AUTHENTICATION_TYPE_DESCRIPTIONS[AuthenticationChoiceOption.Ok]!(tfn);
      expect(result).toEqual(output);
    });

    it(`should return value for AuthenticationChoiceOption.Activate`, () => {
      const output = `Activate`;

      const result = AUTHENTICATION_TYPE_DESCRIPTIONS[AuthenticationChoiceOption.Activate]!(tfn);
      expect(result).toEqual(output);
    });

    it(`should return value for AuthenticationChoiceOption.Exit`, () => {
      const output = `Not Now`;

      const result = AUTHENTICATION_TYPE_DESCRIPTIONS[AuthenticationChoiceOption.Exit]!(tfn);
      expect(result).toEqual(output);
    });
  });
});
