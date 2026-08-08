import { createEffect, createEvent, createStore, sample } from 'effector';
import { createGate } from 'effector-react';

import type { Locale } from '../constants';
import { activate, detectLocale } from '../utils';

export const I18nGate = createGate();

const activateLocaleFx = createEffect(async (locale: Locale) => {
  await activate(locale);

  return locale;
});

export const changeLocale = createEvent<Locale>();

export const $currentLocale = createStore<string | null>(null).on(
  activateLocaleFx.doneData,
  (_, locale) => locale
);
export const $isI18nReady = createStore(false).on(
  activateLocaleFx.doneData,
  () => true
);

sample({
  clock: I18nGate.open,
  fn: () => detectLocale(),
  target: activateLocaleFx,
});

sample({
  clock: changeLocale,
  target: activateLocaleFx,
});
