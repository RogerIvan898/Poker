import { createRoot } from 'react-dom/client';

import { App } from 'app/App';

import 'entities/session/model';

import { appStarted } from 'shared/config/init';
import { initTelegramWebApp } from 'shared/config/telegram-webapp';

import './index.css';

initTelegramWebApp();
appStarted();

createRoot(document.getElementById('root')!).render(<App />);
