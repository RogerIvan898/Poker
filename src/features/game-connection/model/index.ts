import { createEvent, createEffect, sample } from 'effector';
import { createGate } from 'effector-react';

import type { GameEvent } from 'entities/game/types';
import { socket } from 'shared/lib/socketClient';
import { gameApi } from 'shared/api/game';

import { CLIENT_COMMANDS } from './constants';

export const incomingEvent = createEvent<GameEvent>();
export const sendAction = createEvent<{ action: string; payload?: unknown }>();

export const TableGate = createGate<{ tableId: string }>();

export const sendActionFx = createEffect(
  ({ action, payload }: { action: string; payload?: unknown }) =>
    socket.emit(CLIENT_COMMANDS.PLAYER_ACTION, { action, payload })
);

const connectToTableFx = createEffect(gameApi.connectToTable);

const disconnectFromTableFx = createEffect((tableId: string) => {
  socket.emit(CLIENT_COMMANDS.LEAVE_TABLE, { tableId });
  socket.disconnect();
});

sample({
  clock: TableGate.open,
  fn: ({ tableId }) => tableId,
  target: connectToTableFx,
});

sample({
  clock: TableGate.close,
  fn: ({ tableId }) => tableId,
  target: disconnectFromTableFx,
});

sample({
  clock: sendAction,
  target: sendActionFx,
});
