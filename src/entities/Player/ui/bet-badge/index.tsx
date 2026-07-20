import React from 'react';

import chipsSound from 'assets/sounds/chips.mp3';

import { useSound } from 'shared/hooks/useSound';
import type { DirectionType } from 'shared/types/primitives';
import { ChipStack } from 'shared/ui/chip';
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
      <ChipStack amount={amount} />
      {amount}
    </div>
  );
};
