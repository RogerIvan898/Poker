import React, { useState } from 'react';

import { X, ArrowLeft } from 'lucide-react';

import styles from './deposit.module.css';
import { AmountStep } from './steps/AmountStep';
import { PaymentDetailsStep } from './steps/PaymentDetailsStep';

export enum DepositStep {
  Amount = 1,
  Details = 2,
}

const STEP_CONFIG = {
  [DepositStep.Amount]: { title: 'Deposit TON' },
  [DepositStep.Details]: { title: 'Payment Details' },
};

const TOTAL_STEPS = Object.keys(STEP_CONFIG).length;

interface Props {
  open: boolean;
  onClose: () => void;
  depositAddress: string;
  memo?: string;
  onCopyText?: (text: string, type: 'address' | 'memo' | 'amount') => void;
}

export const DepositModal = ({
  open,
  onClose,
  depositAddress,
  memo,
  onCopyText,
}: Props) => {
  const [step, setStep] = useState<DepositStep>(DepositStep.Amount);
  const [amount, setAmount] = useState('');

  if (!open) {
    return null;
  }

  const handleNextStep = () => setStep(DepositStep.Details);
  const handlePrevStep = () => setStep(DepositStep.Amount);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <header className={styles.header}>
          {step === DepositStep.Details ? (
            <button
              type="button"
              className={styles.iconBtn}
              onClick={handlePrevStep}
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>
          ) : (
            <div className={styles.iconPlaceholder} />
          )}

          <div className={styles.titleGroup}>
            <h2>{STEP_CONFIG[step].title}</h2>
            <span className={styles.stepper}>
              {step}/{TOTAL_STEPS}
            </span>
          </div>

          <button
            type="button"
            className={styles.iconBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>

        {step === DepositStep.Amount && (
          <AmountStep
            amount={amount}
            onChangeAmount={setAmount}
            onNext={handleNextStep}
          />
        )}

        {step === DepositStep.Details && (
          <PaymentDetailsStep
            amount={amount}
            depositAddress={depositAddress}
            memo={memo}
            onCopyText={onCopyText}
          />
        )}
      </div>
    </div>
  );
};
