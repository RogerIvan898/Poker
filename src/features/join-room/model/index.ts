import { createEffect, createEvent, createStore, sample } from 'effector';

import { gameModel } from 'entities/game';
import { roomApi } from 'entities/room/api';

export const joinRoom = createEvent<string>();

export const joinRoomFx = createEffect(async (roomId: string) => {
  const data = await roomApi.join(roomId);

  return { roomId, ...data };
});

export const $isJoining = joinRoomFx.pending;

export const $joinError = createStore<string | null>(null)
  .on(joinRoom, () => null)
  .on(joinRoomFx.failData, (_, error) =>
    error instanceof Error ? error.message : 'Failed to join room'
  );

sample({
  clock: joinRoom,
  target: joinRoomFx,
});

sample({
  clock: joinRoomFx.doneData,
  fn: ({ wsUrl }) => ({ wsUrl }),
  target: gameModel.connectGame,
});
