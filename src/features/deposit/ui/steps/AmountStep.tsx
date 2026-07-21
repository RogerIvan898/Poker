import React from 'react';

import { Alert } from 'shared/ui/alert';

import styles from '../deposit.module.css';

interface Props {
  amount: string;
  onChangeAmount: (value: string) => void;
  onNext: () => void;
}

export const AmountStep = ({ amount, onChangeAmount, onNext }: Props) => {
  const isValid = Boolean(amount) && Number(amount) > 0;

  return (
    <div className={styles.content}>
      <Alert variant="info" title="Deposit TON">
        Enter the amount you want to deposit.
      </Alert>

      <label className={styles.label}>Amount</label>
      <div className={styles.amountBox}>
        <input
          value={amount}
          onChange={e => onChangeAmount(e.target.value)}
          placeholder="0.00"
          inputMode="decimal"
        />
        <span>TON</span>
      </div>

      <button
        type="button"
        className={styles.primaryBtn}
        disabled={!isValid}
        onClick={onNext}
      >
        Continue
      </button>
    </div>
  );
};
