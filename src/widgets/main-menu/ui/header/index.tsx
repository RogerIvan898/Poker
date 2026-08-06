import React from 'react';

import { useTonWallet } from '@tonconnect/ui-react';
import { Settings, Plus, Minus } from 'lucide-react';

import { SettingsDialog } from 'widgets/settings/ui';

import { Logo } from 'shared/ui/logo';
import { cn } from 'shared/utils';

import styles from './header.module.css';

interface Props {
  userName: string;
  balance?: number;
  avatarUrl?: string;
  onDepositClick?: () => void;
  onWithdrawClick?: () => void;
  onSettingsClick?: () => void;
}

export const Header = ({
  userName,
  balance = 0,
  avatarUrl,
  onDepositClick,
  onWithdrawClick,
}: Props) => {
  const [isSettingsOpened, setIsSettingsOpened] = React.useState(false);

  const wallet = useTonWallet();

  const walletAddress = wallet?.account.address;

  const avatarLetter = userName?.trim()?.charAt(0)?.toUpperCase() || '?';

  const formattedBalance = new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 2,
  }).format(balance);

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button
          type="button"
          className={styles.avatarPlaceholder}
          disabled={Boolean(wallet)}
          aria-label={wallet ? 'Кошелёк подключён' : 'Подключить кошелёк'}
          title={walletAddress ?? 'Подключить кошелёк'}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={userName} className={styles.avatarImg} />
          ) : (
            avatarLetter
          )}
        </button>

        <div className={styles.userInfo}>
          <span className={styles.userName}>{userName}</span>

          <div className={styles.balanceRow}>
            <div className={styles.balanceBadge}>
              <Logo className={styles.tonIcon} />
              <span className={styles.balanceValue}>{formattedBalance}</span>
            </div>

            <div className={styles.walletActions}>
              <button
                type="button"
                className={cn(styles.actionBtn, styles.depositBtn)}
                onClick={onDepositClick}
                aria-label="Пополнить баланс"
                title="Пополнить"
              >
                <Plus size={16} strokeWidth={2.5} />
              </button>

              <button
                type="button"
                className={cn(styles.actionBtn, styles.withdrawBtn)}
                onClick={onWithdrawClick}
                aria-label="Вывести средства"
                title="Вывести"
              >
                <Minus size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={styles.settingsBtn}
        onClick={() => setIsSettingsOpened(true)}
        aria-label="Настройки"
        title="Настройки"
      >
        <Settings size={22} />
      </button>

      <SettingsDialog
        open={isSettingsOpened}
        onClose={() => setIsSettingsOpened(false)}
      />
    </header>
  );
};
