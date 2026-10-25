import { PlayerAction } from 'entities/player/model/constants';

import type { BadgeVariant } from 'shared/ui/badge';

import {
  PokerActionBadgeKind,
  type PokerActionBadgeType,
} from '../model/types';

export const ACTION_VARIANT: Record<PokerActionBadgeType, BadgeVariant> = {
  [PlayerAction.FOLD]: 'neutral',
  [PlayerAction.CHECK]: 'warning',
  [PlayerAction.CALL]: 'primary',
  [PlayerAction.BET]: 'success',
  [PlayerAction.RAISE]: 'success',
  [PokerActionBadgeKind.ALL_IN]: 'success',
};
