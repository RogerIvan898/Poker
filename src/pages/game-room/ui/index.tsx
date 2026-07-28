import { useNavigate } from 'react-router-dom';

import { useGate } from 'effector-react';

import { PokerBoard } from 'widgets/poker-table';

import { PlayerActions } from 'features/player-actions';

import { ROUTES } from 'shared/constants/routes';

import { TablePageGate } from '../model';

import styles from './game-room.module.css';

export const GameRoomPage = () => {
  useGate(TablePageGate);

  const navigate = useNavigate();

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
