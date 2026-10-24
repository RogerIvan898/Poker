import { createEffect, createEvent, createStore, sample } from 'effector';
import { createGate } from 'effector-react';

import type { Locale } from './constants';
import { activateLocale, detectLocale } from './locale';

export const I18nGate = createGate();

export const changeLocale = createEvent<Locale>();

const activateLocaleFx = createEffect(activateLocale);

export const $currentLocale = createStore<Locale | null>(null).on(
  activateLocaleFx.doneData,
  (_, locale) => locale
);

export const $isI18nReady = createStore(false).on(
  activateLocaleFx.doneData,
  () => true
);

let pendingLoad: Promise<void> | null = null;

export const waitForLocale = () => {
  if ($isI18nReady.getState()) {
    return Promise.resolve();
  }

  pendingLoad ??= new Promise(resolve => {
    const unsubscribe = $isI18nReady.watch(ready => {
      if (!ready) {
        return;
      }

      unsubscribe();
      pendingLoad = null;
      resolve();
    });
  });

  return pendingLoad;
};

sample({
  clock: I18nGate.open,
  fn: () => detectLocale(),
  target: activateLocaleFx,
});

sample({
  clock: changeLocale,
  target: activateLocaleFx,
});
