import { createEffect, createEvent, sample } from 'effector';

import { SOUNDS } from 'shared/constants/sound';
import { getAudioContext, preloadAllSounds } from 'shared/hooks/useSound';

const SOUNDS_TO_LOAD = [
  SOUNDS.cardDeal,
  SOUNDS.check,
  SOUNDS.timeBank,
  SOUNDS.chips,
  SOUNDS.turn,
];

const initRoomFx = createEffect(async () => {
  await new Promise(res => setTimeout(res, 1_000));

  const ctx = getAudioContext();

  if (ctx && ctx.state === 'suspended') {
    await ctx.resume();
  }

  return preloadAllSounds(SOUNDS_TO_LOAD);
});

export const initRoom = createEvent();

export const $isLoading = initRoomFx.pending;

sample({
  clock: initRoom,
  target: initRoomFx,
});
