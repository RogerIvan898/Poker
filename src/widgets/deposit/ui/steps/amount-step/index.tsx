import { useState } from 'react';

import { Alert } from 'shared/ui/alert';
import { NumberField } from 'shared/ui/NumberField';

import styles from '../../deposit.module.css';

import { QuickAddOptions } from './QuickAddOptions';

interface Props {
  amount: number;
  onChangeAmount: (value: number) => void;
  onNext: () => void;
}

const formatDraft = (value: number) => (value === 0 ? '' : String(value));

export const AmountStep = ({ amount, onChangeAmount, onNext }: Props) => {
  const [draft, setDraft] = useState(() => formatDraft(amount));
  const isValid = amount > 0;

  const handleInputChange = (value: string) => {
    setDraft(value);

    if (value === '' || value === '.') {
      onChangeAmount(0);
      return;
    }

    const parsed = Number(value);

    if (!Number.isNaN(parsed)) {
      onChangeAmount(parsed);
    }
  };

  const handleQuickAdd = (value: number) => {
    const next = amount + value;
    onChangeAmount(next);
    setDraft(formatDraft(next));
  };

  return (
    <div className={styles.content}>
      <Alert variant="info" title="Deposit TON">
        Enter the amount you want to deposit.
      </Alert>

      <label className={styles.label}>Amount</label>
      <div className={styles.amountBox}>
        <NumberField
          value={draft}
          onChange={handleInputChange}
          placeholder="0.00"
        />
        <span>TON</span>
      </div>

      <QuickAddOptions options={[5, 10, 20]} onAdd={handleQuickAdd} />

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
