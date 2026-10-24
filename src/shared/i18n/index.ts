export { i18n } from './instance';
export { I18nProvider } from './provider';
export {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_STORAGE_KEY,
  supportedLocales,
} from './constants';
export type { Locale } from './constants';
export { changeLocale, $currentLocale, $isI18nReady } from './model';
