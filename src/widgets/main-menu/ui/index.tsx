import React from 'react';

import { useLingui } from '@lingui/react/macro';
import { Coins, Swords } from 'lucide-react';

import { DepositModal } from 'widgets/deposit/ui';
import { WithdrawModal } from 'widgets/withdraw';

import { cn } from 'shared/utils';

import { Header } from './header';
import styles from './main-menu.module.css';
import { RoomCard } from './room-card';
import {
  filterRooms,
  ROOM_FILTERS,
  ROOMS,
  roomFilterLabel,
  type RoomFilter,
} from './rooms';

const DevServerSwitch = import.meta.env.DEV
  ? React.lazy(() =>
      import('./dev/server-mode-switch').then(module => ({
        default: module.ServerModeSwitch,
      }))
    )
  : null;

interface FiltersProps {
  active: RoomFilter;
  onChange: (filter: RoomFilter) => void;
}

const FILTER_ICONS = {
  cash: Coins,
  'heads-up': Swords,
} as const;

const Filters = ({ active, onChange }: FiltersProps) => {
  const { i18n } = useLingui();

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsScroll}>
        {ROOM_FILTERS.map(filter => {
          const Icon = filter === 'all' ? null : FILTER_ICONS[filter];

          return (
            <button
              key={filter}
              type="button"
              onClick={() => onChange(filter)}
              className={cn(
                styles.tabItem,
                active === filter && styles.activeTab
              )}
            >
              {Icon ? <Icon size={15} strokeWidth={2.25} /> : null}
              {i18n._(roomFilterLabel(filter))}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const MainMenu = () => {
  const { t } = useLingui();
  const [roomFilter, setRoomFilter] = React.useState<RoomFilter>('all');
  const [isDepositOpen, setIsDepositOpen] = React.useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = React.useState(false);
  const mockUser = { firstName: 'User', balance: 42.5 };
  const visibleRooms = filterRooms(ROOMS, roomFilter);

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
            <Filters active={roomFilter} onChange={setRoomFilter} />
            {DevServerSwitch ? (
              <React.Suspense fallback={null}>
                <DevServerSwitch />
              </React.Suspense>
            ) : null}
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{t`Available tables`}</h2>
            </div>
          </div>

          <div className={styles.roomGrid}>
            {visibleRooms.map(room => (
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
