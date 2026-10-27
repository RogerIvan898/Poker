import type { PlayerActionType } from 'entities/player/model/types';

export const PokerActionBadgeKind = {
  ALL_IN: 'ALL_IN',
  SB: 'SB',
  BB: 'BB',
} as const;

export type PokerActionBadgeKindType =
  (typeof PokerActionBadgeKind)[keyof typeof PokerActionBadgeKind];

export type PokerActionBadgeType = PlayerActionType | PokerActionBadgeKindType;
