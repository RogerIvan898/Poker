import { Card } from 'entities/card';
import { cn } from 'shared/utils';
import type { Player } from 'shared/types/player';
import type { DirectionType } from 'shared/types/primitives';

import styles from './player-cards.module.css';

interface Props {
  cards: Player['hand'];
  position: DirectionType;
}

export const PlayerCards = ({ cards, position }: Props) => {
  if (!cards || cards.length < 2) {
    return null;
  }

  return (
    <div className={cn(styles.cards, styles[`cards-${position}`])}>
      <Card card={cards[0]} />
      <Card card={cards[1]} />
    </div>
  );
};
