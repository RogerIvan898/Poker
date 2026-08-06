import { useEffect, useState } from 'react';

import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';

import { Sheet } from 'shared/ui/sheet';
import { formatAmountDraft, isTonAddress } from 'shared/utils';

import { getWithdrawButtonLabel } from '../lib/get-withdraw-button-label';
import type { WithdrawDestination, WithdrawPayload } from '../model/types';

import styles from './withdraw.module.css';
import { WithdrawAmountField } from './WithdrawAmountField';
import { WithdrawDestination as DestinationBlock } from './WithdrawDestination';

interface Props {
  open: boolean;
  onClose: () => void;
  balance: number;
  onSubmit?: (payload: WithdrawPayload) => void;
}

const parseAmountDraft = (value: string) => {
  if (value === '' || value === '.') {
    return 0;
  }

  const parsed = Number(value);

  return Number.isNaN(parsed) ? null : parsed;
};

export const WithdrawModal = ({ open, onClose, balance, onSubmit }: Props) => {
  const connectedAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

  const [amount, setAmount] = useState(0);
  const [draft, setDraft] = useState('');
  const [destination, setDestination] = useState<WithdrawDestination>('wallet');
  const [customAddress, setCustomAddress] = useState('');

  useEffect(() => {
    if (!open) {
      return;
    }

    setDestination(connectedAddress ? 'wallet' : 'address');
  }, [open, connectedAddress]);

  const formattedBalance = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(balance);

  const targetAddress =
    destination === 'wallet' ? connectedAddress : customAddress.trim();

  const exceedsBalance = amount > balance;
  const isAmountValid = amount > 0 && !exceedsBalance;
  const isAddressValid =
    destination === 'wallet'
      ? Boolean(connectedAddress)
      : isTonAddress(customAddress);

  const canSubmit = isAmountValid && isAddressValid;

  const resetForm = () => {
    setAmount(0);
    setDraft('');
    setCustomAddress('');
    setDestination(connectedAddress ? 'wallet' : 'address');
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const handleAmountChange = (value: string) => {
    setDraft(value);

    const parsed = parseAmountDraft(value);

    if (parsed !== null) {
      setAmount(parsed);
    }
  };

  const handleMax = () => {
    if (balance <= 0) {
      return;
    }

    setAmount(balance);
    setDraft(formatAmountDraft(balance));
  };

  const handleSubmit = () => {
    if (!canSubmit || !targetAddress) {
      return;
    }

    onSubmit?.({
      amount,
      address: targetAddress,
      destination,
    });

    handleClose();
  };

  return (
    <Sheet open={open} onClose={handleClose} title="Withdraw TON">
      <div className={styles.content}>
        <button
          type="button"
          className={styles.balanceCard}
          onClick={handleMax}
          disabled={balance <= 0}
        >
          <span className={styles.balanceLabel}>Available balance</span>
          <span className={styles.balanceValue}>{formattedBalance} TON</span>
          <span className={styles.balanceHint}>Tap to use max</span>
        </button>

        <WithdrawAmountField
          draft={draft}
          exceedsBalance={exceedsBalance}
          balance={balance}
          onChange={handleAmountChange}
          onMax={handleMax}
        />

        <DestinationBlock
          destination={destination}
          connectedAddress={connectedAddress || undefined}
          customAddress={customAddress}
          onDestinationChange={setDestination}
          onCustomAddressChange={setCustomAddress}
          onConnectWallet={() => void tonConnectUI.openModal()}
        />

        <button
          type="button"
          className={styles.primaryBtn}
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          {getWithdrawButtonLabel({
            destination,
            connectedAddress: connectedAddress || undefined,
            amount,
          })}
        </button>
      </div>
    </Sheet>
  );
};
