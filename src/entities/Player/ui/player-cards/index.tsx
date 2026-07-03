import { Card } from 'entities/card';
import type { Player } from 'shared/types/player';

import styles from './player-cards.module.css';

interface Props {
  cards: Player['hand'];
}

export const PlayerCards = ({ cards }: Props) => {
  if (!cards || cards.length < 2) {
    return null;
  }

  return (
    <div className={styles.cards}>
      <div className={styles.cardSlot}>
        <Card card={cards[0]} flat />
      </div>
      <div className={styles.cardSlot}>
        <Card card={cards[1]} flat />
      </div>
    </div>
  );
};
