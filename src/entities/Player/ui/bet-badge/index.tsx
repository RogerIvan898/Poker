import React from 'react';

import chipsSound from 'shared/assets/sounds/chips.mp3';
import { useSound } from 'shared/hooks/useSound';
import type { DirectionType } from 'shared/types/primitives';
import { Logo } from 'shared/ui/logo';
import { cn } from 'shared/utils';

import styles from './bet-badge.module.css';

interface Props {
  amount: number;
  position: DirectionType;
}

export const BetBadge = ({ amount, position }: Props) => {
  const { play: playChipsSound } = useSound(chipsSound);
  const prevAmountRef = React.useRef(0);

  React.useEffect(() => {
    if (amount > prevAmountRef.current) {
      playChipsSound();
    }

    prevAmountRef.current = amount;
  }, [amount, playChipsSound]);

  return (
    <div className={cn(styles.betArea, styles[`bet_${position}`])}>
      <div className={styles.amountBadge}>
        <span className={styles.amountValue}>{amount}</span>
        <Logo size={14} className={styles.amountLogo} />
      </div>
    </div>
  );
};
