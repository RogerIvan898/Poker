import React from 'react';

import { useLocation, useNavigate } from '@tanstack/react-router';
import { useGate, useUnit } from 'effector-react';

import { PokerBoard } from 'widgets/poker-table';
import { Preloader } from 'widgets/preloader';

import { PlayerActions } from 'features/player-actions';

import { initRoomModel } from 'shared/lib/initRoom';

import { roomMounted, TablePageGate } from '../model';

import styles from './game-room.module.css';

export const GameRoomPage = () => {
  useGate(TablePageGate);

  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading] = useUnit([initRoomModel.$isLoading]);

  React.useEffect(() => {
    const { ticket, wsUrl } = location.state;

    if (!wsUrl || !ticket) {
      void navigate({ to: '/', replace: true });
      return;
    }

    roomMounted({ wsUrl, ticket });
  }, [location.state, navigate]);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.backBtn}
        onClick={() => void navigate({ to: '/' })}
      >
        ← Столы
      </button>

      <PokerBoard />
      <PlayerActions />
    </div>
  );
};
