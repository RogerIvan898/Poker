import { sample } from 'effector';
import { createGate } from 'effector-react';

import { gameModel } from 'entities/game';
import type { ServerGameEvent } from 'entities/game/model/types';

import { wsDisconnect, wsMessageReceived } from 'shared/api/socket';

export const TablePageGate = createGate();

sample({
  clock: wsMessageReceived,
  fn: message => message as ServerGameEvent,
  target: gameModel.incomingEvent,
});

sample({
  clock: TablePageGate.close,
  target: wsDisconnect,
});
