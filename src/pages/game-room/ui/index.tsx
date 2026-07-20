import { useGate } from 'effector-react';

import { PokerBoard } from 'widgets/poker-table';
import { PlayerActions } from 'features/player-actions';

import { TablePageGate } from '../model';

import styles from './game-room.module.css';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'shared/constants/routes';

export const GameRoomPage = () => {
  const navigate = useNavigate();

  useGate(TablePageGate);

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate(ROUTES.MENU)}>
        ← Столы
      </button>
      <PokerBoard />
      <PlayerActions />
    </div>
  );
};
