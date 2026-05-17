import { Card } from 'entities/card';
import { cn } from 'shared/utils';
import type { Player } from 'shared/types/player';

import styles from './player-cards.module.css';

type CardPosition = 'top' | 'bottom' | 'left' | 'right';

interface Props {
  cards: Player['hand'];
  position: CardPosition;
  reveal: boolean;
}

export const PlayerCards = ({ cards, position, reveal }: Props) => {
  if (!cards || cards.length < 2) {
    return null;
  }

  return (
    <div className={cn(styles.cards, styles[`cards-${position}`])}>
      <Card card={cards[0]} hidden={!reveal} />
      <Card card={cards[1]} hidden={!reveal} />
    </div>
  );
};
