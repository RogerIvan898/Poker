import { CARD_SUIT } from 'shared/constants/cards';
import type { Card, CardRank } from 'shared/types/card';
import type { Player } from 'shared/types/player';

import type { PlayerInfo, ServerGameEvent } from '../types';

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

export const buildPlayer = (playerInfo: PlayerInfo, seat: number): Player => ({
  id: playerInfo.id,
  name: playerInfo.name,
  stack: playerInfo.stack,
  seat,
  status: playerInfo.status,
  committed: 0,
  hand: null,
});

export const isServerGameEvents = (data: unknown): data is ServerGameEvent =>
  typeof data === 'object' && data !== null && 'type' in data;
