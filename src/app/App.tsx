import { TonConnectUIProvider } from '@tonconnect/ui-react';

import { getTonConnectManifestUrl } from 'shared/config/tonconnect';

import { AppRouter } from './router';

export const App = () => (
  <TonConnectUIProvider manifestUrl={getTonConnectManifestUrl()}>
    <AppRouter />
  </TonConnectUIProvider>
);
