import type { PokerSoundAction, SoundRecipe } from './types';

export const ACTION_SOUND_RECIPES: Record<PokerSoundAction, SoundRecipe> = {
  fold: { clicks: [], swoosh: true },
  check: { clicks: [{ pitch: 1, volume: 1, soft: true }], swoosh: false },
  call: { clicks: [{ pitch: 1, volume: 0.8, soft: false }], swoosh: false },
  bet: { clicks: [{ pitch: 1.25, volume: 0.9, soft: false }], swoosh: false },
  allin: {
    clicks: [
      { pitch: 1.25, volume: 0.9, soft: false },
      { pitch: 0.9, volume: 0.55, soft: false, delay: 0.055 },
    ],
    swoosh: false,
    rumble: true,
  },
};
