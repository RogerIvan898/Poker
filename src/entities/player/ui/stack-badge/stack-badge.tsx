import React from 'react';

import { Logo } from 'shared/ui/logo';
import { cn } from 'shared/utils/cn';

import styles from './stack-badge.module.css';

const WIN_MS = 750;

interface Props {
  amount: number;
  name: string;
  folded?: boolean;
  sitOut?: boolean;
  turnActive?: boolean;
  turnProgress?: number;
  usingBank?: boolean;
  winAmount?: number;
  winId?: number;
}

export const StackBadge = ({
  amount,
  name,
  folded = false,
  sitOut = false,
  turnActive = false,
  turnProgress = 0,
  usingBank = false,
  winAmount,
  winId,
}: Props) => {
  const [displayAmount, setDisplayAmount] = React.useState(amount);
  const animatedWinId = React.useRef<number | null>(null);
  const holdingWin = React.useRef(false);

  React.useEffect(() => {
    if (winId && winAmount && animatedWinId.current !== winId) {
      animatedWinId.current = winId;
      holdingWin.current = true;
      setDisplayAmount(Math.max(0, amount - winAmount));

      const timer = window.setTimeout(() => {
        holdingWin.current = false;
        setDisplayAmount(amount);
      }, WIN_MS);

      return () => {
        window.clearTimeout(timer);

        if (holdingWin.current) {
          animatedWinId.current = null;
          holdingWin.current = false;
        }
      };
    }

    if (!holdingWin.current) {
      setDisplayAmount(amount);
    }
  }, [amount, winAmount, winId]);

  return (
    <div className={styles.wrap}>
      <div
        className={cn(
          styles.frame,
          folded && styles.frameFolded,
          sitOut && styles.frameSitOut
        )}
      >
        {turnActive && (
          <div
            className={cn(styles.timerFill, usingBank && styles.timerFillBank)}
            style={{ transform: `scaleX(${turnProgress})` }}
            aria-hidden
          />
        )}

        <div className={styles.content}>
          <span className={styles.name}>{name}</span>
          <div className={styles.stackRow}>
            <span className={styles.stackAmount}>{displayAmount}</span>
            <Logo size={16} className={styles.stackLogo} />
          </div>
        </div>
      </div>
    </div>
  );
};
