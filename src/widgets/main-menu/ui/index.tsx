import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useUnit } from 'effector-react';

import { DepositModal } from 'widgets/deposit/ui';
import { WithdrawModal } from 'widgets/withdraw';

import { roomModel } from 'entities/room';

import { cn } from 'shared/utils';

import { Header } from './header';
import styles from './main-menu.module.css';

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

const Filters = () => {
  const [active, setActive] = React.useState('Все');

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsScroll}>
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
    </div>
  );
};

const RoomCard = ({ room }: { room: (typeof ROOMS)[0] }) => {
  const navigate = useNavigate();
  const [joinRoomFx, isJoining] = useUnit([
    roomModel.joinRoomFx,
    roomModel.$isJoining,
  ]);
  const isFull = room.players === room.max;

  const handleJoin = async () => {
    try {
      const data = await joinRoomFx(String(room.id));
      await navigate(`/room/${data.roomId}`, {
        state: { ticket: data.ticket, wsUrl: data.wsUrl },
      });
    } catch (error) {
      console.error('Failed to join room', error);
    }
  };

  return (
    <div className={cn(styles.roomCard, isFull && styles.roomFull)}>
      <div className={styles.roomContent}>
        <div className={styles.roomHeader}>
          <h3 className={styles.roomName}>{room.name}</h3>
          <span
            className={cn(
              styles.roomType,
              room.type === 'Турбо' && styles.typeTurbo
            )}
          >
            {room.type}
          </span>
        </div>

        <div className={styles.roomDetails}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Блайнды</span>
            <span className={styles.statValue}>{room.blinds}</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statLabel}>Игроки</span>
            <span className={cn(styles.statValue, isFull && styles.textAlert)}>
              {room.players}/{room.max}
            </span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statLabel}>Вход</span>
            <span className={styles.statValue}>{room.minBuy}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={cn(styles.playBtn, isFull && styles.playBtnDisabled)}
        disabled={isFull || isJoining}
        onClick={() => void handleJoin()}
      >
        {isFull ? 'МЕСТ НЕТ' : isJoining ? 'ВХОД...' : 'ИГРАТЬ'}
      </button>
    </div>
  );
};

export const MainMenu = () => {
  const [isDepositOpen, setIsDepositOpen] = React.useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = React.useState(false);
  const mockUser = { firstName: 'User', balance: 42.5 };

  return (
    <div className={styles.appLayout}>
      <div className={styles.mainContainer}>
        <Header
          userName={mockUser.firstName}
          balance={mockUser.balance}
          onDepositClick={() => setIsDepositOpen(true)}
          onWithdrawClick={() => setIsWithdrawOpen(true)}
        />

        <main className={styles.contentArea}>
          <div className={styles.stickyHeader}>
            <Filters />
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Доступные столы</h2>
              {/* <span className={styles.onlineCount}>0</span> */}
            </div>
          </div>

          <div className={styles.roomGrid}>
            {ROOMS.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
          <div className={styles.bottomSpacer} />
        </main>
      </div>

      <DepositModal
        open={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        depositAddress="UQA-hgA0arLRETGFy5ccxv11acPYBUpU49X8RyqfIju3tGci"
        memo="1049285"
      />

      <WithdrawModal
        open={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        balance={mockUser.balance}
        onSubmit={payload => {
          console.log('Withdraw request', payload);
        }}
      />
    </div>
  );
};
