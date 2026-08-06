import cardDealSound from './assets/card-deal.mp3';
import checkSound from './assets/check.mp3';
import chipsSound from './assets/chips.mp3';
import timeBankSound from './assets/time-bank.mp3';
import turnSound from './assets/turn.mp3';

export const SOUNDS = {
  cardDeal: cardDealSound,
  check: checkSound,
  timeBank: timeBankSound,
  chips: chipsSound,
  turn: turnSound,
} as const;
