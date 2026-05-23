import type { CARD_RANK, CARD_SUIT } from 'shared/constants/cards';

export type CardRank = (typeof CARD_RANK)[keyof typeof CARD_RANK];
export type CardSuit = (typeof CARD_SUIT)[keyof typeof CARD_SUIT];

export interface Card {
  rank: CardRank;
  suit: CardSuit;
}
