import { useState } from 'react';

import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { Check, Copy, RefreshCw, Wallet } from 'lucide-react';

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
  const walletAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

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
      // clipboard может быть недоступен — молча игнорируем
    }
  };

  return (
    <Dialog open={open} title="Настройки" onClose={onClose}>
      <Setting label="Кошелёк">
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
                  aria-label={isCopied ? 'Скопировано' : 'Скопировать адрес'}
                  title={isCopied ? 'Скопировано' : 'Скопировать адрес'}
                >
                  {isCopied ? <Check size={15} /> : <Copy size={15} />}
                </button>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => void disconnectWallet()}
                  disabled={isPending}
                  aria-label="Сменить кошелёк"
                  title="Сменить кошелёк"
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
              Отключить кошелёк
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
            {isPending ? 'Подключение…' : 'Подключить кошелёк'}
          </button>
        )}
      </Setting>
    </Dialog>
  );
};
