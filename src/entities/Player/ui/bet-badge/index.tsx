import type { DirectionType } from 'shared/types/primitives';
import { Logo } from 'shared/ui/logo';
import { cn } from 'shared/utils';
import { formatCompactNumber } from 'shared/utils/format';

import styles from './bet-badge.module.css';

interface Props {
  amount: number;
  position: DirectionType;
}

export const BetBadge = ({ amount, position }: Props) => {
  if (amount <= 0) return null;

  return (
    <div className={cn(styles.betArea, styles[`bet_${position}`])}>
      <div className={styles.amountBadge}>
        <Logo size={18} className={styles.amountLogo} />
        <span key={amount} className={styles.amountValue}>
          {formatCompactNumber(amount)}
        </span>
      </div>
    </div>
  );
};
