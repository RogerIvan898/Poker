import { createRoot } from 'react-dom/client';

import { App } from 'app/App';

import { appStarted } from 'shared/config/init';

import './index.css';

appStarted();

createRoot(document.getElementById('root')!).render(<App />);
