import { IconNames, IconName, Variant, IValidationResult } from '@cmctechnology/phoenix-stockbroking-web-design';
import { Translated } from '../models/translation';

export const getPasswordValidationVariantAndIcon = (
  validated: boolean,
  validationResult?: IValidationResult
): { name: IconName; variant?: Variant; opacity: number } => {
  const opacity = validated ? 1 : 0.5;

  if (!validated) {
    return { name: IconNames.Minus, opacity };
  }

  if (validationResult?.valid) {
    return { name: IconNames.Check, variant: Variant.Success, opacity };
  }
  return { name: IconNames.X, variant: Variant.Error, opacity };
};

export interface IPasswordValidation {
  id: string;
  regex: RegExp;
  message: Translated;
}

export const passwordValidations: IPasswordValidation[] = [
  { id: 'containsLetter', regex: /.*[A-Za-z]/, message: (t) => t('Contain a letter') },
  { id: 'containsNumber', regex: /.*\d/, message: (t) => t('Contain a number') },
  { id: 'charactersRange', regex: /^.{8,99}$/, message: (t) => t('Minimum 8 characters') }
];
