import { cn } from 'shared/utils';

import type { WithdrawDestination } from '../model/types';

import styles from './withdraw.module.css';

interface Props {
  value: WithdrawDestination;
  onChange: (value: WithdrawDestination) => void;
}

export const DestinationTabs = ({ value, onChange }: Props) => (
  <div className={styles.tabs} role="tablist" aria-label="Destination">
    <button
      type="button"
      role="tab"
      aria-selected={value === 'wallet'}
      className={cn(styles.tab, value === 'wallet' && styles.tabActive)}
      onClick={() => onChange('wallet')}
    >
      My wallet
    </button>
    <button
      type="button"
      role="tab"
      aria-selected={value === 'address'}
      className={cn(styles.tab, value === 'address' && styles.tabActive)}
      onClick={() => onChange('address')}
    >
      Address
    </button>
  </div>
);
