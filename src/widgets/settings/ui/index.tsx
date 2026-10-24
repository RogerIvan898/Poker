import { useState } from 'react';

import { useLingui } from '@lingui/react/macro';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { useUnit } from 'effector-react';
import { Check, Copy, RefreshCw, Wallet } from 'lucide-react';

import {
  changeLocale,
  LOCALES,
  supportedLocales,
  $currentLocale,
} from 'shared/i18n';
import { Dialog } from 'shared/ui/dialog';
import { cn } from 'shared/utils';

import { formatAddress } from '../utils';

import { Setting } from './setting';
import styles from './settings-dialog.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const SettingsDialog = ({ open, onClose }: Props) => {
  const { t } = useLingui();
  const walletAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const [currentLocale, setLocale] = useUnit([$currentLocale, changeLocale]);

  const [isPending, setIsPending] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const connectWallet = async () => {
    setIsPending(true);
    try {
      await tonConnectUI.openModal();
    } finally {
      setIsPending(false);
    }
  };

  const disconnectWallet = async () => {
    setIsPending(true);
    try {
      await tonConnectUI.disconnect();
    } finally {
      setIsPending(false);
    }
  };

  const copyAddress = async () => {
    if (!walletAddress) return;

    try {
      await navigator.clipboard.writeText(walletAddress);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    } catch {
      void 0;
    }
  };

  return (
    <Dialog open={open} title={t`Settings`} onClose={onClose}>
      <div className={styles.sections}>
        <Setting label={t`Language`}>
          <div className={styles.langRow}>
            {supportedLocales.map(locale => (
              <button
                key={locale}
                type="button"
                className={cn(
                  styles.langBtn,
                  currentLocale === locale && styles.langBtnActive
                )}
                onClick={() => setLocale(locale)}
              >
                {LOCALES[locale]}
              </button>
            ))}
          </div>
        </Setting>

        <Setting label={t`Wallet`}>
          {walletAddress ? (
            <div className={styles.walletCard}>
              <div className={styles.walletInfo}>
                <span className={styles.walletAddress} title={walletAddress}>
                  {formatAddress(walletAddress)}
                </span>

                <div className={styles.walletActions}>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => void copyAddress()}
                    aria-label={isCopied ? t`Copied` : t`Copy address`}
                    title={isCopied ? t`Copied` : t`Copy address`}
                  >
                    {isCopied ? <Check size={15} /> : <Copy size={15} />}
                  </button>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => void disconnectWallet()}
                    disabled={isPending}
                    aria-label={t`Change wallet`}
                    title={t`Change wallet`}
                  >
                    <RefreshCw
                      size={15}
                      className={cn(isPending && styles.spin)}
                    />
                  </button>
                </div>
              </div>

              <button
                type="button"
                className={styles.disconnectBtn}
                onClick={() => void disconnectWallet()}
                disabled={isPending}
              >
                {t`Disconnect wallet`}
              </button>
            </div>
          ) : (
            <button
              type="button"
              className={styles.connectBtn}
              onClick={() => void connectWallet()}
              disabled={isPending}
            >
              <Wallet size={16} />
              {isPending ? t`Connecting…` : t`Connect wallet`}
            </button>
          )}
        </Setting>
      </div>
    </Dialog>
  );
};
