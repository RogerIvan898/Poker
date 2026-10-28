import { useLingui } from '@lingui/react/macro';

import { PlayerAction } from 'entities/player/model/constants';

import { Badge } from 'shared/ui/badge';
import { cn } from 'shared/utils';
import { formatChipAmount } from 'shared/utils/format';

import { PokerActionBadgeKind } from '../model/constants';
import type { PokerActionBadgeType } from '../model/types';

import { ACTION_PRESENTATION } from './action-presentation';
import styles from './poker-action-badge.module.css';

interface Props {
  action: PokerActionBadgeType;
  amount?: number;
}

export const PokerActionBadge = ({ action, amount }: Props) => {
  const { t } = useLingui();

  // lingui-set context="poker-action"
  const labels: Record<PokerActionBadgeType, string> = {
    [PlayerAction.FOLD]: t`Fold`,
    [PlayerAction.CHECK]: t`Check`,
    [PlayerAction.CALL]: t`Call`,
    [PlayerAction.BET]: t`Bet`,
    [PlayerAction.RAISE]: t`Raise`,
    [PokerActionBadgeKind.ALL_IN]: t`All in`,
    [PokerActionBadgeKind.SB]: t`SB`,
    [PokerActionBadgeKind.BB]: t`BB`,
  };
  // lingui-reset

  const label = labels[action];
  const presentation = ACTION_PRESENTATION[action];
  const showAmount =
    amount != null && amount > 0 && action !== PlayerAction.FOLD;

  return (
    <div className={styles.root}>
      <Badge
        variant={presentation.variant}
        className={cn(
          styles.compact,
          presentation.warningBorder && styles.allInBorder
        )}
      >
        {label}
        {showAmount ? ` ${formatChipAmount(amount)}` : null}
      </Badge>
    </div>
  );
};
