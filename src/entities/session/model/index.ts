import { createStore } from 'effector';
import { createEffect, sample } from 'effector';

import { authApi } from 'entities/session/api';

import { appStarted } from 'shared/config/init';

const authFx = createEffect(() => {
  const tg = window.Telegram?.WebApp;

  if (!tg) {
    return;
  }

  return authApi.login(tg.initData);
});

export const $currentUserId = createStore<string | null>('100');
export const $isAuthorized = $currentUserId.map(user => Boolean(user));

// const $authPending = authFx.pending;

sample({
  clock: appStarted,
  target: authFx,
});
