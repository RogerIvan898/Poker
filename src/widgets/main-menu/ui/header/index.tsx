import { Settings, Plus, Minus } from 'lucide-react';

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
  onSettingsClick,
}: Props) => {
  const initial = userName?.trim()?.charAt(0)?.toUpperCase() || '?';

  const formattedBalance = new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 2,
  }).format(balance);

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <div className={styles.avatarPlaceholder}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={userName} className={styles.avatarImg} />
          ) : (
            initial
          )}
        </div>

        <div className={styles.userInfo}>
          <span className={styles.userName} title={userName}>
            {userName}
          </span>
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
        onClick={onSettingsClick}
        aria-label="Настройки"
        title="Настройки"
      >
        <Settings size={22} />
      </button>
    </header>
  );
};
