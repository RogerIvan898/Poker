import { useState } from 'react';

import { ArrowLeft } from 'lucide-react';

import { Sheet } from 'shared/ui/sheet';

import styles from './deposit.module.css';
import { AmountStep } from './steps/amount-step';
import { PaymentDetailsStep } from './steps/payment-details';

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
  const [amount, setAmount] = useState(0);

  const handleClose = () => {
    onClose();
    setStep(DepositStep.Amount);
    setAmount(0);
  };

  const handleNextStep = () => setStep(DepositStep.Details);
  const handlePrevStep = () => setStep(DepositStep.Amount);

  return (
    <Sheet
      open={open}
      onClose={handleClose}
      title={STEP_CONFIG[step].title}
      titleAddon={
        <span className={styles.stepper}>
          {step}/{TOTAL_STEPS}
        </span>
      }
      leading={
        step === DepositStep.Details ? (
          <button
            type="button"
            className={styles.iconBtn}
            onClick={handlePrevStep}
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
        ) : undefined
      }
    >
      {step === DepositStep.Amount && (
        <AmountStep
          key="amount"
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
    </Sheet>
  );
};
