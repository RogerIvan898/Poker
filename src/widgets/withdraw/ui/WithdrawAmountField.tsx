import { NumberField } from 'shared/ui/NumberField';
import { cn } from 'shared/utils';

import styles from './withdraw.module.css';

interface Props {
  draft: string;
  exceedsBalance: boolean;
  balance: number;
  onChange: (value: string) => void;
  onMax: () => void;
}

export const WithdrawAmountField = ({
  draft,
  exceedsBalance,
  balance,
  onChange,
  onMax,
}: Props) => (
  <div className={styles.field}>
    <div className={styles.fieldHeader}>
      <label className={styles.label} htmlFor="withdraw-amount">
        Amount
      </label>
      <button
        type="button"
        className={styles.maxBtn}
        onClick={onMax}
        disabled={balance <= 0}
      >
        MAX
      </button>
    </div>

    <div
      className={cn(styles.amountBox, exceedsBalance && styles.fieldInvalid)}
    >
      <NumberField
        id="withdraw-amount"
        value={draft}
        onChange={onChange}
        placeholder="0.00"
      />
      <span>TON</span>
    </div>

    {exceedsBalance && (
      <p className={styles.fieldError}>Exceeds available balance</p>
    )}
  </div>
);
