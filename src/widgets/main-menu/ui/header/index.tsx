import { Logo } from 'shared/ui/logo';
import { cn } from 'shared/utils';

import styles from './header.module.css';

interface Props {
  userName: string;
  balance?: number;
  onDepositClick?: () => void;
  onWithdrawClick?: () => void;
}

export const Header = ({
  userName,
  balance = 0,
  onDepositClick,
  onWithdrawClick,
}: Props) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <div className={styles.avatarPlaceholder}>{userName.charAt(0)}</div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{userName}</span>
          <div className={styles.balanceRow}>
            <div className={styles.balanceBadge}>
              <Logo className={styles.tonIcon} />
              <span className={styles.balanceValue}>{balance}</span>
            </div>
            <div className={styles.walletActions}>
              <button
                className={cn(styles.actionBtn, styles.depositBtn)}
                onClick={onDepositClick}
                aria-label="Пополнить"
              >
                +
              </button>
              <button
                className={cn(styles.actionBtn, styles.withdrawBtn)}
                onClick={onWithdrawClick}
                aria-label="Вывести"
              >
                -
              </button>
            </div>
          </div>
        </div>
      </div>

      <button className={styles.settingsBtn} aria-label="Настройки">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>
    </header>
  );
};
