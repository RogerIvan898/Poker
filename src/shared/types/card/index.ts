import type { CardRank, CardSuit } from 'shared/constants/cards';

export type CardRank = (typeof CardRank)[keyof typeof CardRank];
export type CardSuit = (typeof CardSuit)[keyof typeof CardSuit];

export interface Card {
  rank: CardRank;
  suit: CardSuit;
}
