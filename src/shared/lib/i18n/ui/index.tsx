import React from 'react';

import { i18n } from '@lingui/core';
import { I18nProvider as LinguiProvider } from '@lingui/react';
import { useGate, useUnit } from 'effector-react';

import { Preloader } from 'widgets/preloader';

import { $isI18nReady, I18nGate } from '../model';

export const I18nProvider = ({ children }: React.PropsWithChildren) => {
  useGate(I18nGate);

  const ready = useUnit($isI18nReady);

  if (!ready) {
    return <Preloader />;
  }

  return <LinguiProvider i18n={i18n}>{children}</LinguiProvider>;
};
