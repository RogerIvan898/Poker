import React from 'react';

import chipsSound from 'assets/sounds/chips.mp3';

import { useSound } from 'shared/hooks/useSound';
import type { DirectionType } from 'shared/types/primitives';
import { ChipStack } from 'shared/ui/chip';
import { Logo } from 'shared/ui/logo';
import { cn } from 'shared/utils';

import styles from './bet-badge.module.css';

export type BetBadgeVariant = 'chips' | 'amount';

interface Props {
  amount: number;
  position: DirectionType;
  variant?: BetBadgeVariant;
}

export const BetBadge = ({ amount, position, variant = 'chips' }: Props) => {
  const { play: playChipsSound } = useSound(chipsSound);
  const prevAmountRef = React.useRef(0);

  React.useEffect(() => {
    if (variant === 'chips' && amount > prevAmountRef.current) {
      playChipsSound();
    }

    prevAmountRef.current = amount;
  }, [amount, playChipsSound, variant]);

  return (
    <div
      className={cn(
        styles.betArea,
        styles[`bet_${position}`],
        variant === 'amount' && styles.betAreaAmount
      )}
    >
      {variant === 'chips' ? (
        <ChipStack amount={amount} />
      ) : (
        <div className={styles.amountBadge}>
          <span className={styles.amountValue}>{amount}</span>
          <Logo size={14} className={styles.amountLogo} />
        </div>
      )}
    </div>
  );
};
