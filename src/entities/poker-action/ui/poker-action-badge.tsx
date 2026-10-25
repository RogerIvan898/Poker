import { useLingui } from '@lingui/react/macro';

import { PlayerAction } from 'entities/player/model/constants';

import { Badge } from 'shared/ui/badge';
import { cn } from 'shared/utils';

import {
  PokerActionBadgeKind,
  type PokerActionBadgeType,
} from '../model/types';

import { ACTION_VARIANT } from './action-presentation';
import styles from './poker-action-badge.module.css';

interface Props {
  action: PokerActionBadgeType;
  amount?: number;
}

const formatAmount = (value: number) =>
  Number.isInteger(value) ? String(value) : value.toFixed(2);

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
  };
  // lingui-reset

  const label = labels[action];
  const variant = ACTION_VARIANT[action];
  const showAmount =
    amount != null && amount > 0 && action !== PlayerAction.FOLD;

  return (
    <div className={styles.root}>
      <Badge
        variant={variant}
        className={cn(
          styles.compact,
          action === PokerActionBadgeKind.ALL_IN && styles.allInWarningBorder
        )}
      >
        {label}
        {showAmount ? ` ${formatAmount(amount)}` : null}
      </Badge>
    </div>
  );
};
