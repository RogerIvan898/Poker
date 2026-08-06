import { useState } from 'react';

import { toNano } from '@ton/core';
import { QRCodeSVG } from 'qrcode.react';

import { PayViaWalletButton } from 'features/pay-via-wallet';

import { Alert } from 'shared/ui/alert';
import { CopyField } from 'shared/ui/copy-field';
import { cn } from 'shared/utils';

import shared from '../../deposit.module.css';

import styles from './payment-details.module.css';

type PaymentMethod = 'wallet' | 'exchange';

interface Props {
  amount: number;
  depositAddress: string;
  memo?: string;
  onCopyText?: (text: string, type: 'address' | 'memo' | 'amount') => void;
  onSuccess?: () => void;
}

const buildTonTransferLink = (
  address: string,
  amount: number,
  memo?: string
) => {
  const params = new URLSearchParams({
    amount: toNano(amount.toString()).toString(),
  });

  if (memo) {
    params.set('text', memo);
  }

  return `ton://transfer/${address}?${params.toString()}`;
};

export const PaymentDetailsStep = ({
  amount,
  depositAddress,
  memo,
  onCopyText,
  onSuccess,
}: Props) => {
  const [method, setMethod] = useState<PaymentMethod>('wallet');

  const amountText = String(amount);
  const walletQrValue = buildTonTransferLink(depositAddress, amount, memo);

  return (
    <div className={shared.content}>
      <div className={styles.tabs} role="tablist" aria-label="Payment method">
        <button
          type="button"
          role="tab"
          aria-selected={method === 'wallet'}
          className={cn(styles.tab, method === 'wallet' && styles.tabActive)}
          onClick={() => setMethod('wallet')}
        >
          Web3 Wallet
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={method === 'exchange'}
          className={cn(styles.tab, method === 'exchange' && styles.tabActive)}
          onClick={() => setMethod('exchange')}
        >
          Exchange
        </button>
      </div>

      {method === 'wallet' ? (
        <div className={styles.panel} role="tabpanel">
          <Alert variant="info" title="Tonkeeper / Telegram Wallet">
            Pay in one tap via TON Connect, or scan the QR with another phone.
          </Alert>

          <PayViaWalletButton
            className={shared.primaryBtn}
            amount={amount}
            depositAddress={depositAddress}
            memo={memo}
            onSuccess={onSuccess}
            onError={() => alert('Payment failed or rejected in wallet')}
          />

          <div className={styles.orDivider}>— or scan with Tonkeeper —</div>

          <div className={styles.qrBlock}>
            <div className={styles.qr}>
              <QRCodeSVG value={walletQrValue} size={170} level="M" />
            </div>
            <p className={styles.qrHint}>
              Full transfer link with address, amount
              {memo ? ' and memo' : ''}.
            </p>
          </div>
        </div>
      ) : (
        <div className={styles.panel} role="tabpanel">
          <Alert variant="warning" title="Memo required">
            When withdrawing from an exchange (Bybit, OKX, Binance), you must
            include the Memo / comment. Without it the deposit will not be
            credited.
          </Alert>

          <div className={styles.qrBlock}>
            <div className={styles.qr}>
              <QRCodeSVG value={depositAddress} size={170} level="M" />
            </div>
            <p className={styles.qrHint}>
              Address only — easy for exchange scanners to read.
            </p>
          </div>

          <div className={styles.copyFields}>
            <CopyField
              label="Wallet address"
              value={depositAddress}
              onCopy={() => onCopyText?.(depositAddress, 'address')}
            />

            {memo && (
              <CopyField
                label="Memo / Comment"
                value={memo}
                badgeText="Required"
                onCopy={() => onCopyText?.(memo, 'memo')}
              />
            )}

            <CopyField
              label="Amount (TON)"
              value={amountText}
              onCopy={() => onCopyText?.(amountText, 'amount')}
            />
          </div>
        </div>
      )}
    </div>
  );
};
