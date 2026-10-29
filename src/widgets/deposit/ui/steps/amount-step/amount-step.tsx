import { useEffect, useState } from 'react';

import { useLingui } from '@lingui/react/macro';
import { ChevronRight } from 'lucide-react';

import { Alert } from 'shared/ui/alert';
import { Logo } from 'shared/ui/logo';
import { NumberField } from 'shared/ui/number-field';

import { AMOUNT_RE, formatDepositDraft } from '../../../lib';
import styles from '../../deposit.module.css';

import { QuickAddOptions } from './QuickAddOptions';

interface Props {
  amount: number;
  onChangeAmount: (value: number) => void;
  onNext: () => void;
}

export const AmountStep = ({ amount, onChangeAmount, onNext }: Props) => {
  const { t } = useLingui();
  const [draft, setDraft] = useState(() => formatDepositDraft(amount));

  useEffect(() => {
    setDraft(prev => {
      const normalized = prev.replace(',', '.');
      const parsed = Number(normalized);
      return Number.isFinite(parsed) && parsed === amount
        ? prev
        : formatDepositDraft(amount);
    });
  }, [amount]);

  const isValid = amount > 0;

  const handleInputChange = (value: string) => {
    const normalized = value.replace(',', '.');

    if (normalized !== '' && !AMOUNT_RE.test(normalized)) return;

    setDraft(value);
    onChangeAmount(normalized === '' ? 0 : Number(normalized));
  };

  const handleQuickAdd = (value: number) => {
    onChangeAmount(amount + value);
  };

  return (
    <div className={styles.content}>
      <Alert variant="info" title={t`Deposit TON`}>
        {t`Enter the amount you want to deposit`}
      </Alert>

      <label className={styles.label} htmlFor="deposit-amount">
        {t`Amount`}
      </label>

      <div className={styles.amountBox}>
        <NumberField
          id="deposit-amount"
          value={draft}
          onChange={handleInputChange}
          placeholder="0.00"
          inputMode="decimal"
          autoComplete="off"
          aria-invalid={!isValid && draft !== ''}
        />
        <span className={styles.amountCurrency}>
          <Logo /> TON
        </span>
      </div>

      <QuickAddOptions options={[5, 10, 20]} onAdd={handleQuickAdd} />

      <button
        type="button"
        className={styles.primaryBtn}
        disabled={!isValid}
        onClick={onNext}
      >
        <span>{isValid ? t`Continue` : t`Enter amount to continue`}</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
};
