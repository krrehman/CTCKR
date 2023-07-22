import { ISelectOption } from '@cmctechnology/phoenix-stockbroking-web-design';
import { TFunction } from 'i18next';
import { KeyValueTranslated } from '../models/translation';

export const mapKeyValueTranslatedToOption: (keyValue: KeyValueTranslated, key: string, t: TFunction) => ISelectOption = (keyValue, key, t) => ({
  value: key,
  label: keyValue[key](t)
});
