import { cn } from 'shared/utils';
import { Logo } from 'shared/ui/logo';

import styles from './stack-badge.module.css';

interface Props {
  amount: number;
  name: string;
  folded?: boolean;
  sitOut?: boolean;
}

export const StackBadge = ({
  amount,
  name,
  folded = false,
  sitOut = false,
}: Props) => (
  <div
    className={cn(
      styles.frame,
      folded && styles.frameFolded,
      sitOut && styles.frameSitOut
    )}
  >
    <span className={styles.name}>{name}</span>
    <div className={styles.stackRow}>
      <span className={styles.stackAmount}>{amount}</span>
      <Logo size={14} className={styles.stackLogo} />
    </div>
  </div>
);
