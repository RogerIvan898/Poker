import { cn } from 'shared/utils';
import { Logo } from 'shared/ui/logo';

import styles from './stack-badge.module.css';

interface Props {
  amount: number;
  name: string;
  folded?: boolean;
  sitOut?: boolean;
  turnActive?: boolean;
  turnProgress?: number;
  usingBank?: boolean;
}

export const StackBadge = ({
  amount,
  name,
  folded = false,
  sitOut = false,
  turnActive = false,
  turnProgress = 0,
  usingBank = false,
}: Props) => (
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
        <span className={styles.stackAmount}>{amount}</span>
        <Logo size={16} className={styles.stackLogo} />
      </div>
    </div>
  </div>
);
