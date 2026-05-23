import { CARD_SUIT } from 'shared/constants/cards';
import type { Card, CardRank } from 'shared/types/card';

const SUIT_MAP = {
  h: CARD_SUIT.HEARTS,
  d: CARD_SUIT.DIAMONDS,
  c: CARD_SUIT.CLUBS,
  s: CARD_SUIT.SPADES,
} as const;

export const parseCard = (cardString: string): Card => {
  const rawSuit = cardString.slice(-1) as keyof typeof SUIT_MAP;
  const suit = SUIT_MAP[rawSuit];

  const rank = cardString.slice(0, -1) as CardRank;

  return {
    rank,
    suit,
  };
};
