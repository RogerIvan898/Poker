import React, { useState } from 'react';

import { gameModel } from 'entities/game';
import { Logo } from 'shared/ui/logo';

import { ControlButton } from '../control-button';

import styles from './raise-manager.module.css';

interface RaiseManagerProps {
  playerId: string;
  minRaise: number;
  maxRaise: number;
  onCancel: () => void;
}

export const RaiseManager = ({
  playerId,
  minRaise,
  maxRaise,
  onCancel,
}: RaiseManagerProps) => {
  const [raiseAmount, setRaiseAmount] = useState(minRaise);

  const handleConfirm = () => {
    gameModel.raise({ playerId, amount: raiseAmount });
    onCancel();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setRaiseAmount(Math.min(maxRaise, Math.max(minRaise, value)));
  };

  return (
    <div className={styles.raiseWrapper}>
      <div className={styles.raiseControls}>
        <div className={styles.raiseInputContainer}>
          <input
            type="number"
            inputMode="numeric"
            value={raiseAmount}
            onChange={handleInputChange}
            min={minRaise}
            max={maxRaise}
            className={styles.raiseInput}
          />
          <div className={styles.raiseLogo}>
            <Logo size={14} color="#0098ea" />
          </div>
        </div>

        <input
          type="range"
          value={raiseAmount}
          onChange={e => setRaiseAmount(Number(e.target.value))}
          min={minRaise}
          max={maxRaise}
          className={styles.raiseSlider}
        />
      </div>

      <div>
        <ControlButton variant="raise" text="Confirm" onClick={handleConfirm} />
        <ControlButton variant="fold" text="Cancel" onClick={onCancel} />
      </div>
    </div>
  );
};
