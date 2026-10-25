import React from 'react';

import chipsSound from 'shared/assets/sounds/chips.mp3';
import { useSound } from 'shared/hooks/useSound';
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
  const { play: playChipsSound } = useSound(chipsSound);
  const prevAmountRef = React.useRef(amount);

  React.useEffect(() => {
    if (amount > prevAmountRef.current) {
      playChipsSound();
    }

    prevAmountRef.current = amount;
  }, [amount, playChipsSound]);

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
