import { TFunction } from 'i18next';

export type Translated = (t: TFunction) => string;

export type KeyValueTranslated<K extends keyof any = string> = Record<K, Translated>;
