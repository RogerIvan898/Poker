import React, { useEffect, useState } from 'react';

import { useLingui } from '@lingui/react/macro';

import { Button } from 'shared/ui/button';
import { Logo } from 'shared/ui/logo';

import { raise } from '../../model';

import styles from './bet-manager.module.css';

interface Props {
  playerId: string;
  minAmount: number;
  maxAmount: number;
  onCancel: () => void;
  variant: 'bet' | 'raise';
}

export const BetManager = ({
  playerId,
  minAmount,
  maxAmount,
  onCancel,
  variant,
}: Props) => {
  const { t } = useLingui();
  const [amount, setAmount] = useState(minAmount);

  const handleConfirm = () => {
    const bet = Math.min(maxAmount, Math.max(minAmount, amount));
    raise({ playerId, amount: bet });
    onCancel();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setAmount(Math.min(maxAmount, Math.max(minAmount, value)));
  };

  useEffect(() => {
    setAmount(current => Math.min(maxAmount, Math.max(minAmount, current)));
  }, [minAmount, maxAmount]);

  // lingui-set context="bet-manager"
  const confirmLabel = variant === 'bet' ? t`Confirm bet` : t`Confirm raise`;
  // lingui-reset
  const cancelLabel = t`Cancel`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputContainer}>
        <input
          type="number"
          inputMode="numeric"
          value={amount}
          onChange={handleInputChange}
          min={minAmount}
          max={maxAmount}
          className={styles.input}
        />
        <div className={styles.logo}>
          <Logo size={14} className={styles.logoIcon} />
        </div>
      </div>

      <input
        type="range"
        value={amount}
        onChange={e => setAmount(Number(e.target.value))}
        min={minAmount}
        max={maxAmount}
        className={styles.slider}
      />

      <div className={styles.buttonRow}>
        <Button color="primary" text={confirmLabel} onClick={handleConfirm} />
        <Button color="danger" text={cancelLabel} onClick={onCancel} />
      </div>
    </div>
  );
};
