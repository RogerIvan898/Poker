import { i18n } from '@lingui/core';

import { DEFAULT_LOCALE, supportedLocales, type Locale } from '../constants';

export const activate = async (locale: Locale) => {
  const { messages } = await import(`../locales/${locale}/messages.po`);

  i18n.load(locale, messages);
  i18n.activate(locale);
};

const isLocale = (value: string): value is Locale =>
  supportedLocales.includes(value as Locale);

export const detectLocale = () => {
  const telegramLang =
    window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code?.slice(0, 2);

  if (telegramLang && isLocale(telegramLang)) {
    return telegramLang;
  }

  const browserLang = navigator.language.slice(0, 2);

  if (isLocale(browserLang)) {
    return browserLang;
  }

  return DEFAULT_LOCALE;
};
