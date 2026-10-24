import { Suspense, type ReactNode } from 'react';

import { I18nProvider as LinguiProvider } from '@lingui/react';
import { useGate, useUnit } from 'effector-react';

import { Preloader } from 'widgets/preloader';

import { i18n } from './instance';
import { $isI18nReady, I18nGate, waitForLocale } from './model';

const LocaleReady = ({ children }: { children: ReactNode }) => {
  const ready = useUnit($isI18nReady);

  if (!ready) {
    // Suspense принимает промис, а не Error.
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- контракт React Suspense
    throw waitForLocale();
  }

  return children;
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  useGate(I18nGate);

  return (
    <LinguiProvider i18n={i18n}>
      <Suspense fallback={<Preloader />}>
        <LocaleReady>{children}</LocaleReady>
      </Suspense>
    </LinguiProvider>
  );
};
