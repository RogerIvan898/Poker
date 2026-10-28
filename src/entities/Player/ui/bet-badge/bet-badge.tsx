import { useUnit } from 'effector-react';

import { gameModel } from 'entities/game';
import type { DirectionType } from 'shared/types/primitives';
import { Logo } from 'shared/ui/logo';
import { cn } from 'shared/utils';
import { formatCompactNumber } from 'shared/utils/format';

import styles from './bet-badge.module.css';

interface Props {
  amount: number;
  position: DirectionType;
  seat: number;
}

export const BetBadge = ({ amount, position, seat }: Props) => {
  const collecting = useUnit(gameModel.$collectingBets);

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
