import { useState } from 'react';

import { Trans, useLingui } from '@lingui/react/macro';
import { QRCodeSVG } from 'qrcode.react';

import { PayViaWalletButton } from 'features/pay-via-wallet';
import { Alert } from 'shared/ui/alert';
import { CopyField } from 'shared/ui/copy-field';
import { cn } from 'shared/utils/cn';

import { buildTonTransferLink } from '../../../lib';
import type { PaymentMethod } from '../../../model';
import shared from '../../deposit.module.css';

import styles from './payment-details.module.css';

interface Props {
  amount: number;
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
  const { t } = useLingui();
  const [method, setMethod] = useState<PaymentMethod>('wallet');

  const amountText = String(amount);
  const walletQrValue = buildTonTransferLink(depositAddress, amount, memo);

  // lingui-set context="payment-method"
  const exchangeLabel = t`Exchange`;
  // lingui-reset
  // lingui-set context="form-field"
  const requiredLabel = t`Required`;
  // lingui-reset

  return (
    <div className={shared.content}>
      <div
        className={styles.tabs}
        role="tablist"
        aria-label={t`Payment method`}
      >
        <button
          type="button"
          role="tab"
          aria-selected={method === 'wallet'}
          className={cn(styles.tab, method === 'wallet' && styles.tabActive)}
          onClick={() => setMethod('wallet')}
        >
          {t`Web3 wallet`}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={method === 'exchange'}
          className={cn(styles.tab, method === 'exchange' && styles.tabActive)}
          onClick={() => setMethod('exchange')}
        >
          {exchangeLabel}
        </button>
      </div>

      {method === 'wallet' ? (
        <div className={styles.panel} role="tabpanel">
          <Alert variant="info" title={t`Tonkeeper / Telegram Wallet`}>
            {t`Pay in one tap via TON Connect, or scan the QR with another phone.`}
          </Alert>

          <PayViaWalletButton
            className={shared.primaryBtn}
            amount={amount}
            depositAddress={depositAddress}
            memo={memo}
            onSuccess={onSuccess}
            onError={() => alert(t`Payment failed or rejected in wallet`)}
          />

          <div
            className={styles.orDivider}
          >{t`— or scan with Tonkeeper —`}</div>

          <div className={styles.qrBlock}>
            <div className={styles.qr}>
              <QRCodeSVG value={walletQrValue} size={170} level="M" />
            </div>
            <p className={styles.qrHint}>
              {memo
                ? t`Full transfer link with address, amount and memo.`
                : t`Full transfer link with address and amount.`}
            </p>
          </div>
        </div>
      ) : (
        <div className={styles.panel} role="tabpanel">
          <Alert variant="warning" title={t`Memo`}>
            <Trans>
              When withdrawing from an exchange (Bybit, OKX, Binance), you must
              include the Memo. Without it the deposit will not be credited.
            </Trans>
          </Alert>

          <div className={styles.qrBlock}>
            <div className={styles.qr}>
              <QRCodeSVG value={depositAddress} size={170} level="M" />
            </div>
            <p
              className={styles.qrHint}
            >{t`Address only — easy for exchange scanners to read.`}</p>
          </div>

          <div className={styles.copyFields}>
            <CopyField
              label={t`Wallet address`}
              value={depositAddress}
              onCopy={() => onCopyText?.(depositAddress, 'address')}
            />

            {memo && (
              <CopyField
                label={t`Memo`}
                value={memo}
                badgeText={requiredLabel}
                onCopy={() => onCopyText?.(memo, 'memo')}
              />
            )}

            <CopyField
              label={t`Amount (TON)`}
              value={amountText}
              onCopy={() => onCopyText?.(amountText, 'amount')}
            />
          </div>
        </div>
      )}
    </div>
  );
};
