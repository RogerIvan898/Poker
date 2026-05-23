import { useGate } from 'effector-react';

import { PokerBoard } from 'widgets/poker-table';
import { PlayerActions } from 'features/player-actions';

import { TablePageGate } from '../model';

import styles from './room-page.module.css';

export const RoomPage = () => {
  // useGameSocket('1000');
  useGate(TablePageGate);

  return (
    <div className={styles.container}>
      <PokerBoard />
      <PlayerActions />
    </div>
  );
};
