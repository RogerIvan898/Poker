import { useState } from 'react';

import { useLingui } from '@lingui/react/macro';
import { ArrowLeft } from 'lucide-react';

import { Sheet } from 'shared/ui/sheet';
import sheetStyles from 'shared/ui/sheet/sheet.module.css';

import styles from './deposit.module.css';
import { AmountStep } from './steps/amount-step';
import { PaymentDetailsStep } from './steps/payment-details';

export enum DepositStep {
  Amount = 1,
  Details = 2,
}

const TOTAL_STEPS = 2;

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
  const { t } = useLingui();
  const [step, setStep] = useState<DepositStep>(DepositStep.Amount);
  const [amount, setAmount] = useState(0);

  const stepTitle =
    step === DepositStep.Amount ? t`Deposit TON` : t`Payment details`;

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
      title={stepTitle}
      titleAddon={
        <span className={styles.stepper}>
          {step}/{TOTAL_STEPS}
        </span>
      }
      leading={
        step === DepositStep.Details ? (
          <div className={sheetStyles.headerSide}>
            <button
              type="button"
              className={sheetStyles.iconBtn}
              onClick={handlePrevStep}
              aria-label={t`Back`}
            >
              <ArrowLeft size={18} />
            </button>
          </div>
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
