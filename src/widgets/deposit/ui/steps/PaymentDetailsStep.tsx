import React, { useState } from 'react';

import { Copy, Check } from 'lucide-react';

import { PayViaWalletButton } from 'features/pay-via-wallet';

import { Alert } from 'shared/ui/alert';
import { CopyField } from 'shared/ui/copy-field';

import styles from '../deposit.module.css';

interface Props {
  amount: string;
  depositAddress: string;
  memo?: string;
  onCopyText?: (text: string, type: 'address' | 'memo' | 'amount') => void;
  onSuccess?: () => void;
}

export const PaymentDetailsStep = ({
  amount,
  depositAddress,
  memo,
  onCopyText,
  onSuccess,
}: Props) => {
  const [copiedAmount, setCopiedAmount] = useState(false);

  const handleCopyAmount = async () => {
    try {
      await navigator.clipboard.writeText(amount);
      setCopiedAmount(true);
      onCopyText?.(amount, 'amount');
      setTimeout(() => setCopiedAmount(false), 1500);
    } catch (error) {
      console.error('Failed to copy amount:', error);
    }
  };

  return (
    <div className={styles.content}>
      <Alert variant="warning" title="Send only TON">
        Send TON only through The Open Network. Sending other assets or another
        network may result in permanent loss.
      </Alert>

      <PayViaWalletButton
        className={styles.primaryBtn}
        amount={amount}
        depositAddress={depositAddress}
        memo={memo}
        onSuccess={onSuccess}
        onError={() => alert('Payment failed or rejected in wallet')}
      />

      <div style={{ textAlign: 'center', margin: '20px 0', color: '#888' }}>
        — or send manually —
      </div>

      <div className={styles.amountDisplay}>
        <span className={styles.amountLabel}>Amount to send:</span>
        <div className={styles.amountValueRow}>
          <span className={styles.amountValue}>{amount} TON</span>
          <button
            type="button"
            className={styles.inlineCopyBtn}
            onClick={handleCopyAmount}
            title="Copy amount"
          >
            {copiedAmount ? (
              <Check size={16} className={styles.checkIcon} />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>
      </div>

      <div className={styles.depositDetails}>
        <div className={styles.qrWrapper}>
          <div className={styles.qr}>QR</div>
        </div>

        <CopyField
          label="Deposit address"
          value={depositAddress}
          onCopy={() => onCopyText?.(depositAddress, 'address')}
        />

        {memo && (
          <CopyField
            label="Memo"
            value={memo}
            badgeText="Required"
            onCopy={() => onCopyText?.(memo, 'memo')}
          />
        )}
      </div>
    </div>
  );
};
