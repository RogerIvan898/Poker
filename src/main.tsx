import { createRoot } from 'react-dom/client';

import { App } from 'app/App';
import 'entities/session';
// Importing the model segment only keeps the dev-only switch UI out of the production bundle.
import { bootstrapMockServer } from 'features/mock-server/model';
import { appStarted } from 'shared/config/init';
import { initTelegramWebApp } from 'shared/config/telegram-webapp';

import './index.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element was not found');
}

void (async () => {
  initTelegramWebApp();
  await bootstrapMockServer().catch((error: unknown) => {
    console.error('[MockServer] Failed to start', error);
  });
  appStarted();
  createRoot(root).render(<App />);
})();
