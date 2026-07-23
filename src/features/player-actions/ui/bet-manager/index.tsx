import React, { useState, useEffect } from 'react';

import { ActionButton } from 'shared/ui/action-button';
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
  const [amount, setAmount] = useState(minAmount);

  const handleConfirm = () => {
    raise({ playerId, amount });
    onCancel();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setAmount(Math.min(maxAmount, Math.max(minAmount, value)));
  };

  useEffect(() => {
    setAmount(minAmount);
  }, [minAmount]);

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
        <ActionButton
          color="primary"
          text={`Confirm ${variant}`}
          onClick={handleConfirm}
        />
        <ActionButton color="danger" text="Cancel" onClick={onCancel} />
      </div>
    </div>
  );
};
