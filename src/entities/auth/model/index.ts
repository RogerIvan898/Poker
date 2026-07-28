import { createEffect, sample } from 'effector';

import { authApi } from 'shared/api/auth';
import { appStarted } from 'shared/config/init';

const authFx = createEffect(() => {
  const tg = window.Telegram?.WebApp;

  if (!tg) {
    return;
  }

  tg.ready();
  tg.expand();

  return authApi.login(tg.initData);
});

sample({
  clock: appStarted,
  target: authFx,
});
