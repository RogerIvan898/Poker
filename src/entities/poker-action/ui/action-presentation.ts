import { PlayerAction } from 'entities/player/model/constants';
import type { BadgeVariant } from 'shared/ui/badge';

import { PokerActionBadgeKind } from '../model/constants';
import type { PokerActionBadgeType } from '../model/types';

export interface ActionPresentation {
  variant: BadgeVariant;
  warningBorder: boolean;
}

const plain = (variant: BadgeVariant): ActionPresentation => ({
  variant,
  warningBorder: false,
});

export const ACTION_PRESENTATION: Record<
  PokerActionBadgeType,
  ActionPresentation
> = {
  [PlayerAction.FOLD]: plain('neutral'),
  [PlayerAction.CHECK]: plain('warning'),
  [PlayerAction.CALL]: plain('primary'),
  [PlayerAction.BET]: plain('primary'),
  [PlayerAction.RAISE]: plain('active'),
  [PokerActionBadgeKind.ALL_IN]: {
    variant: 'primary',
    warningBorder: true,
  },
  [PokerActionBadgeKind.SB]: plain('primary'),
  [PokerActionBadgeKind.BB]: plain('primary'),
};
