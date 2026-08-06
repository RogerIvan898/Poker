import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useGate, useUnit } from 'effector-react';

import { PokerBoard } from 'widgets/poker-table';
import { Preloader } from 'widgets/preloader';

import { PlayerActions } from 'features/player-actions';

import { ROUTES } from 'shared/constants/routes';
import { initRoomModel } from 'shared/lib/initRoom';

import { roomMounted, TablePageGate } from '../model';

import styles from './game-room.module.css';

type LocationState = {
  wsUrl?: string;
  ticket?: string;
};

export const GameRoomPage = () => {
  useGate(TablePageGate);

  const navigate = useNavigate();
  const location = useLocation();

  const [mountRoom, isLoading] = useUnit([
    roomMounted,
    initRoomModel.$isLoading,
  ]);

  React.useEffect(() => {
    const state = location.state as LocationState | null;

    if (!state?.wsUrl || !state?.ticket) {
      void navigate(ROUTES.MENU, { replace: true });
      return;
    }

    mountRoom({ wsUrl: state.wsUrl, ticket: state.ticket });
  }, [location.state, mountRoom, navigate]);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.backBtn}
        onClick={() => void navigate(ROUTES.MENU)}
      >
        ← Столы
      </button>

      <PokerBoard />
      <PlayerActions />
    </div>
  );
};
