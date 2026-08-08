import React from 'react';

import { useNavigate } from '@tanstack/react-router';
import { useGate, useUnit } from 'effector-react';

import { PokerBoard } from 'widgets/poker-table';
import { Preloader } from 'widgets/preloader';

import { PlayerActions } from 'features/player-actions';

import { gameModel } from 'entities/game';

import { GamePageGate } from '../model';

import styles from './game-room.module.css';

export const GameRoomPage = () => {
  useGate(GamePageGate);

  const navigate = useNavigate();

  const [isLoading] = useUnit([gameModel.$isGameLoading]);

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
