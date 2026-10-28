import { PlayerAction, PlayerStatus } from 'entities/player/model/constants';
import type {
  PlayerActionType,
  PlayerStatusType,
} from 'entities/player/model/types';

import { PokerActionBadgeKind } from './constants';
import type { PokerActionBadgeType } from './types';

export const resolveSeatActionBadge = (
  lastAction: PlayerActionType | null,
  status: PlayerStatusType,
  blindRole?: 'sb' | 'bb' | null
): PokerActionBadgeType | null => {
  if (status === PlayerStatus.ALL_IN) {
    return PokerActionBadgeKind.ALL_IN;
  }

  if (status === PlayerStatus.FOLDED) {
    return PlayerAction.FOLD;
  }

  if (lastAction) {
    return lastAction;
  }

  if (blindRole === 'sb') {
    return PokerActionBadgeKind.SB;
  }

  if (blindRole === 'bb') {
    return PokerActionBadgeKind.BB;
  }

  return null;
};
