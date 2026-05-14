import { cn } from 'shared/utils';
import { Logo } from 'shared/ui/logo';

import styles from './bet-badge.module.css';

interface Props {
  bet: number;
  position: CardPosition;
}

type CardPosition = 'top' | 'bottom' | 'left' | 'right';

export const BetBadge = ({ bet, position }: Props) => (
  <div className={cn(styles.betContainer, styles[`bet-${position}`])}>
    <div className={styles.betAmount}>{bet}</div>
    <Logo />
  </div>
);
