import cardDealSound from 'shared/assets/sounds/card-deal.mp3';
import checkSound from 'shared/assets/sounds/check.mp3';
import chipsSound from 'shared/assets/sounds/chips.mp3';
import timeBankSound from 'shared/assets/sounds/time-bank.mp3';
import turnSound from 'shared/assets/sounds/turn.mp3';

export const Sound = {
  CARD_DEAL: cardDealSound,
  CHECK: checkSound,
  TIME_BANK: timeBankSound,
  CHIPS: chipsSound,
  TURN: turnSound,
} as const;
