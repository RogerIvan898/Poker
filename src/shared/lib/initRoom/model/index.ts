import { createEffect, createEvent, sample } from 'effector';

import { Sound } from 'shared/constants/sound';
import { getAudioContext, preloadAllSounds } from 'shared/lib/audio';

const SOUNDS_TO_LOAD = [
  Sound.CARD_DEAL,
  Sound.CHECK,
  Sound.TIME_BANK,
  Sound.CHIPS,
  Sound.TURN,
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
