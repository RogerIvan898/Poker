import { cn } from 'shared/utils';
import type { DirectionType } from 'shared/types/primitives';

import { ChipStack } from 'shared/ui/chip';

import styles from './bet-badge.module.css';

interface Props {
  amount: number;
  position: DirectionType;
}

export const BetBadge = ({ amount, position }: Props) => (
  <div className={cn(styles.betArea, styles[`bet_${position}`])}>
    <ChipStack amount={amount} />
    {amount}
  </div>
);
