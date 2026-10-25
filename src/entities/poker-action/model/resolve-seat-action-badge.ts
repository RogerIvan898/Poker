import { PlayerAction, PlayerStatus } from 'entities/player/model/constants';
import type {
  PlayerActionType,
  PlayerStatusType,
} from 'entities/player/model/types';

import { PokerActionBadgeKind, type PokerActionBadgeType } from './types';

export const resolveSeatActionBadge = (
  lastAction: PlayerActionType | null,
  status: PlayerStatusType
): PokerActionBadgeType | null => {
  if (status === PlayerStatus.ALL_IN) {
    return PokerActionBadgeKind.ALL_IN;
  }

  if (status === PlayerStatus.FOLDED) {
    return PlayerAction.FOLD;
  }

  return lastAction;
};
