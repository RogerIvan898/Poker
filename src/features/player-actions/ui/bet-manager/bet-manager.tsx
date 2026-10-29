import React, { useEffect, useState } from 'react';

import { useLingui } from '@lingui/react/macro';

import { Button } from 'shared/ui/button';
import { Logo } from 'shared/ui/logo';
import { cn, clamp } from 'shared/utils';

import { potRaiseTo, raise, type BetPreset } from '../../model';

import styles from './bet-manager.module.css';

interface Props {
  playerId: string;
  minAmount: number;
  maxAmount: number;
  bigBlind: number;
  pot: number;
  callAmount: number;
  committed: number;
  preflop: boolean;
  onCancel: () => void;
  variant: 'bet' | 'raise';
}

export const BetManager = ({
  playerId,
  minAmount,
  maxAmount,
  bigBlind,
  pot,
  callAmount,
  committed,
  preflop,
  onCancel,
  variant,
}: Props) => {
  const { t } = useLingui();
  const [amount, setAmount] = useState(minAmount);
  const [draft, setDraft] = useState<string | null>(null);

  const step = bigBlind > 0 ? bigBlind : 1;
  const legal = (value: number) =>
    clamp(Math.round(value), minAmount, maxAmount);

  const commit = (value: number) => {
    setAmount(legal(value));
    setDraft(null);
  };

  useEffect(() => {
    setAmount(current => clamp(Math.round(current), minAmount, maxAmount));
  }, [minAmount, maxAmount]);

  const handleConfirm = () => {
    const typed = draft === null ? amount : Number(draft);
    raise({
      playerId,
      amount: legal(Number.isFinite(typed) ? typed : amount),
    });
    onCancel();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setDraft(next);
    const value = Number(next);

    if (!Number.isFinite(value)) {
      return;
    }

    if (value > maxAmount) {
      commit(maxAmount);
      return;
    }

    if (value >= minAmount) {
      setAmount(Math.round(value));
    }
  };

  const handleBlur = () => {
    const value = Number(draft);
    commit(Number.isFinite(value) ? value : amount);
  };

  // lingui-set context="bet-manager"
  const maxLabel = t`Max`;
  const potLabel = t`Pot`;
  const allInLabel = t`All in`;
  // lingui-reset
  // lingui-set context="poker-action"
  const betLabel = t`Bet`;
  const raiseLabel = t`Raise`;
  // lingui-reset
  const cancelLabel = t`Cancel`;

  const presets: BetPreset[] = preflop
    ? [
        { label: '2.2 BB', value: bigBlind * 2.2 },
        { label: '3 BB', value: bigBlind * 3 },
        { label: maxLabel, value: maxAmount },
      ]
    : [
        {
          label: '1/2 Pot',
          value: potRaiseTo(0.5, pot, callAmount, committed),
        },
        {
          label: '3/4 Pot',
          value: potRaiseTo(0.75, pot, callAmount, committed),
        },
        { label: potLabel, value: potRaiseTo(1, pot, callAmount, committed) },
        { label: maxLabel, value: maxAmount },
      ];

  const isAllIn = amount >= maxAmount;
  const belowMin =
    draft !== null &&
    Number(draft) < minAmount &&
    Number.isFinite(Number(draft));

  return (
    <div className={styles.wrapper}>
      <div className={styles.shortcuts}>
        {presets.map(preset => {
          const value = legal(preset.value);

          return (
            <button
              key={preset.label}
              type="button"
              className={cn(
                styles.shortcut,
                preset.label === maxLabel &&
                  amount === value &&
                  styles.shortcutActive
              )}
              onClick={() => commit(value)}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      <div className={styles.inputRow}>
        <button
          type="button"
          className={styles.step}
          aria-label="-1 BB"
          disabled={amount <= minAmount}
          onClick={() => commit(amount - step)}
        >
          −
        </button>
        <div className={styles.inputContainer}>
          <input
            type="number"
            inputMode="numeric"
            value={draft ?? amount}
            onChange={handleInputChange}
            onBlur={handleBlur}
            min={minAmount}
            max={maxAmount}
            step={step}
            className={cn(styles.input, belowMin && styles.inputInvalid)}
          />
          <div className={styles.logo}>
            <Logo size={14} className={styles.logoIcon} />
          </div>
        </div>
        <button
          type="button"
          className={styles.step}
          aria-label="+1 BB"
          disabled={amount >= maxAmount}
          onClick={() => commit(amount + step)}
        >
          +
        </button>
      </div>

      <input
        type="range"
        value={amount}
        onChange={event => commit(Number(event.target.value))}
        min={minAmount}
        max={maxAmount}
        step={1}
        className={styles.slider}
      />

      <div className={styles.buttonRow}>
        <Button
          color={isAllIn ? 'warning' : 'primary'}
          text={
            isAllIn ? allInLabel : variant === 'bet' ? betLabel : raiseLabel
          }
          onClick={handleConfirm}
        />
        <Button color="danger" text={cancelLabel} onClick={onCancel} />
      </div>
    </div>
  );
};
