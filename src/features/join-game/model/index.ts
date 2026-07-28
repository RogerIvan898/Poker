import { createEvent, sample } from 'effector';

import { sessionModel } from 'entities/session';

import { wsConnect } from 'shared/api/socket';
import type { ConnectParams } from 'shared/types/socket';

export const joinGame = createEvent();

sample({
  clock: joinGame,
  source: sessionModel.$viewerId,
  filter: Boolean,
  fn: (playerId): ConnectParams => ({ playerId }),
  target: wsConnect,
});
