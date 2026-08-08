import { TonConnectUIProvider } from '@tonconnect/ui-react';

import { getTonConnectManifestUrl } from 'shared/config/tonconnect';
import { I18nProvider } from 'shared/lib/i18n';

import { AppRouter } from './router';

export const App = () => (
  <I18nProvider>
    <TonConnectUIProvider manifestUrl={getTonConnectManifestUrl()}>
      <AppRouter />
    </TonConnectUIProvider>
  </I18nProvider>
);
