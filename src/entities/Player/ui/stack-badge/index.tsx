import { Logo } from 'shared/ui/logo';

import styles from './stack-badge.module.css';

interface Props {
  amount: number;
}

export const StackBadge = ({ amount }: Props) => {
  return (
    <div className={styles.stackContainer}>
      <div className={styles.stackAmount}>{amount}</div>
      <Logo />
    </div>
  );
};
