import { PokerBoard } from 'widgets/poker-table';
import { useGameSocket } from 'entities/game';
import { PlayerActions } from 'features/player-actions';

import styles from './room-page.module.css';

export const RoomPage = () => {
  useGameSocket('1000');

  return (
    <div className={styles.container}>
      <PokerBoard />
      <PlayerActions />
    </div>
  );
};
