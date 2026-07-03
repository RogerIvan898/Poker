import { useGate, useUnit } from 'effector-react';

import { navigateToMenu } from 'app/model';
import { PokerBoard } from 'widgets/poker-table';
import { PlayerActions } from 'features/player-actions';

import { TablePageGate } from '../model';

import styles from './room-page.module.css';

export const RoomPage = () => {
  const leave = useUnit(navigateToMenu);

  useGate(TablePageGate);

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => leave()} type="button">
        ← Столы
      </button>
      <PokerBoard />
      <PlayerActions />
    </div>
  );
};
