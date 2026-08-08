import cardDealSound from 'assets/sounds/card-deal.mp3';
import checkSound from 'assets/sounds/check.mp3';
import chipsSound from 'assets/sounds/chips.mp3';
import timeBankSound from 'assets/sounds/time-bank.mp3';
import turnSound from 'assets/sounds/turn.mp3';

export const SOUNDS = {
  cardDeal: cardDealSound,
  check: checkSound,
  timeBank: timeBankSound,
  chips: chipsSound,
  turn: turnSound,
} as const;
