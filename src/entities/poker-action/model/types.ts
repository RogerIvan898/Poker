import type { PlayerActionType } from 'entities/player/model/types';

import { PokerActionBadgeKind } from './constants';

export type PokerActionBadgeKindType =
  (typeof PokerActionBadgeKind)[keyof typeof PokerActionBadgeKind];

export type PokerActionBadgeType = PlayerActionType | PokerActionBadgeKindType;
