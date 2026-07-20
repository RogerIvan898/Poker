import { useState } from 'react';

import { cn } from 'shared/utils';
import { Logo } from 'shared/ui/logo';
import styles from './main-menu.module.css';
import { useNavigate } from 'react-router-dom';

const ROOMS = [
  {
    id: 1,
    name: 'Texas Hold’em',
    type: 'Кэш',
    blinds: '0.1/0.2',
    players: 6,
    max: 8,
    minBuy: '10 TON',
  },
  {
    id: 2,
    name: 'Turbo Table',
    type: 'Турбо',
    blinds: '1/2',
    players: 8,
    max: 8,
    minBuy: '50 TON',
  },
  {
    id: 4,
    name: 'Beginners',
    type: 'Кэш',
    blinds: '0.05/0.1',
    players: 4,
    max: 6,
    minBuy: '2 TON',
  },
  {
    id: 5,
    name: 'Deepstack Pro',
    type: 'Кэш',
    blinds: '2/4',
    players: 3,
    max: 8,
    minBuy: '100 TON',
  },
  {
    id: 6,
    name: 'Night Grinders',
    type: 'Турбо',
    blinds: '5/10',
    players: 2,
    max: 6,
    minBuy: '250 TON',
  },
];

const FILTERS = ['Все', 'Кэш', 'Турниры', 'Sit & Go'];

const Header = ({ user }: { user: { firstName: string; balance: string } }) => (
  <header className={styles.header}>
    <div className={styles.headerLeft}>
      <div className={styles.avatarPlaceholder}>{user.firstName.charAt(0)}</div>
      <div className={styles.userInfo}>
        <span className={styles.userName}>{user.firstName}</span>
        <div className={styles.balanceRow}>
          <div className={styles.balanceBadge}>
            <Logo className={styles.tonIcon} />
            <span className={styles.balanceValue}>{user.balance}</span>
          </div>
          <div className={styles.walletActions}>
            <button
              className={cn(styles.actionBtn, styles.depositBtn)}
              aria-label="Пополнить"
            >
              +
            </button>
            <button
              className={cn(styles.actionBtn, styles.withdrawBtn)}
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

const Filters = () => {
  const [active, setActive] = useState('Все');

  return (
    <div className={styles.tabsContainer}>
      {FILTERS.map(f => (
        <button
          key={f}
          onClick={() => setActive(f)}
          className={cn(styles.tabItem, active === f && styles.activeTab)}
        >
          {f}
        </button>
      ))}
    </div>
  );
};

const RoomCard = ({ room }: { room: (typeof ROOMS)[0] }) => {
  const navigate = useNavigate();

  const isFull = room.players === room.max;

  return (
    <div className={cn(styles.roomCard, isFull && styles.roomFull)}>
      <div className={styles.roomContent}>
        <div className={styles.roomHeader}>
          <h3 className={styles.roomName}>{room.name}</h3>
          <span className={styles.roomType}>{room.type}</span>
        </div>

        <div className={styles.roomDetails}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Блайнды</span>
            <span className={styles.statValue}>{room.blinds}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Игроки</span>
            <span className={cn(styles.statValue, isFull && styles.textAlert)}>
              {room.players}/{room.max}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Вход</span>
            <span className={styles.statValue}>{room.minBuy}</span>
          </div>
        </div>
      </div>

      <button
        className={styles.playBtn}
        disabled={isFull}
        onClick={() => navigate(`game/${room.id}`)}
      >
        {isFull ? 'ПОЛН' : 'ИГРАТЬ'}
      </button>
    </div>
  );
};

const NavLinks = () => (
  <>
    <button className={cn(styles.navItem, styles.activeNav)}>
      <span className={styles.navIcon}>🃏</span>
      <span className={styles.navText}>Столы</span>
    </button>
    <button className={styles.navItem}>
      <span className={styles.navIcon}>🎁</span>
      <span className={styles.navText}>Задания</span>
    </button>
    <button className={styles.navItem}>
      <span className={styles.navIcon}>📊</span>
      <span className={styles.navText}>Лидеры</span>
    </button>
  </>
);

export const MainMenu = () => {
  const mockUser = { firstName: 'Алексей', balance: '124.50' };

  return (
    <div className={styles.appLayout}>
      <aside className={styles.sideNav}>
        <div className={styles.brandLogo}>
          <Logo className={styles.tonIconLg} />
          <span>Poker</span>
        </div>
        <nav className={styles.sideNavLinks}>
          <NavLinks />
        </nav>
      </aside>

      <div className={styles.mainContainer}>
        <Header user={mockUser} />
        <Filters />

        <main className={styles.contentArea}>
          <div className={styles.roomGrid}>
            {ROOMS.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
          <div className={styles.bottomSpacer} />
        </main>

        <nav className={styles.bottomNav}>
          <NavLinks />
        </nav>
      </div>
    </div>
  );
};
