import { createEvent, sample } from 'effector';
import { createGate } from 'effector-react';

import { gameModel } from 'entities/game';
import type { RoomJoinData } from 'entities/room/types';

import { initRoomModel } from 'shared/lib/initRoom';

export const TablePageGate = createGate();

export const roomMounted = createEvent<RoomJoinData>();

sample({
  clock: roomMounted,
  target: gameModel.connectGame,
});

sample({
  clock: TablePageGate.open,
  target: initRoomModel.initRoom,
});

sample({
  clock: TablePageGate.close,
  target: gameModel.resetTable,
});
