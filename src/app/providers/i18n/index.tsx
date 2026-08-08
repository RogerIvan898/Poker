import React from 'react';

import { i18n } from '@lingui/core';
import { I18nProvider as LinguiProvider } from '@lingui/react';
import { useGate, useUnit } from 'effector-react';

import { Preloader } from 'widgets/preloader';

import { i18nModel } from 'shared/lib/i18n';

export const I18nProvider = ({ children }: React.PropsWithChildren) => {
  useGate(i18nModel.I18nGate);

  const ready = useUnit(i18nModel.$isI18nReady);

  if (!ready) {
    return <Preloader />;
  }

  return <LinguiProvider i18n={i18n}>{children}</LinguiProvider>;
};
