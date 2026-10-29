import { Logo } from 'shared/ui/logo';
import { cn, formatCompactNumber } from 'shared/utils';

import type { BetPosition } from '../../model';

import styles from './bet-badge.module.css';

interface Props {
  amount: number;
  position: BetPosition;
  seat: number;
  collecting: boolean;
}

export const BetBadge = ({ amount, position, seat, collecting }: Props) => {
  if (amount <= 0) return null;

  return (
    <div
      className={cn(
        styles.betArea,
        styles[`bet_${position}`],
        collecting && styles.collect
      )}
      data-bet={amount}
      data-bet-seat={seat}
    >
      <div className={styles.amountBadge}>
        <Logo size={18} className={styles.amountLogo} />
        <span key={amount} className={styles.amountValue}>
          {formatCompactNumber(amount)}
        </span>
      </div>
    </div>
  );
};
