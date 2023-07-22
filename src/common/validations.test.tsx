import { IconNames, Variant } from '@cmctechnology/phoenix-stockbroking-web-design';
import { getPasswordValidationVariantAndIcon } from './validations';

describe(`validations`, () => {
  describe(`getPasswordValidationVariantAndIcon`, () => {
    it(`should return initial result`, () => {
      const result = getPasswordValidationVariantAndIcon(false);
      expect(result).toEqual({ name: IconNames.Minus, opacity: 0.5 });
    });

    it(`should return sucess result`, () => {
      const result = getPasswordValidationVariantAndIcon(true, { id: `some-id`, valid: true, message: `message` });
      expect(result).toEqual({ name: IconNames.Check, variant: Variant.Success, opacity: 1 });
    });

    it(`should return error result`, () => {
      const result = getPasswordValidationVariantAndIcon(true, { id: `some-id`, valid: false, message: `message` });
      expect(result).toEqual({ name: IconNames.X, variant: Variant.Error, opacity: 1 });
    });
  });
});
