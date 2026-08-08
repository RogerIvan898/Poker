import { i18n, type Messages } from '@lingui/core';

import { DEFAULT_LOCALE, supportedLocales, type Locale } from '../constants';

const catalogs = import.meta.glob('../locales/*/messages.po');

export const activate = async (locale: Locale) => {
  const path = `../locales/${locale}/messages.po`;
  const loadCatalog = catalogs[path];

  if (!loadCatalog) {
    console.error(`[i18n] Перевроды для локалии ${locale} не найдены`);
    return;
  }

  try {
    i18n.load(locale, (await loadCatalog()) as Messages);
    i18n.activate(locale);
  } catch (error) {
    console.log(`[i18n] Ошибка при загрузке локалии ${locale}:`, error);
  }
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
