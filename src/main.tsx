import { createRoot } from 'react-dom/client';

import { App } from 'app/App';

import 'entities/session/model';

import { appStarted } from 'shared/config/init';
import { bootstrapMockServer } from 'shared/config/mock-server';
import { initTelegramWebApp } from 'shared/config/telegram-webapp';

import './index.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element was not found');
}

void (async () => {
  initTelegramWebApp();
  await bootstrapMockServer();
  appStarted();
  createRoot(root).render(<App />);
})();
