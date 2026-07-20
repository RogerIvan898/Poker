import React from 'react';

import type { Card as CardType } from 'shared/types/card';
import { cn, getSymbol } from 'shared/utils';

import styles from './card.module.css';

interface Props {
  card: CardType | null;
  flat?: boolean;
}

export const Card = ({ card, flat = false }: Props) => {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    element.classList.add(flat ? styles.playFlat : styles.play);

    const onEnd = () => {
      element.style.transform = flat
        ? 'none'
        : `rotate(${(Math.random() * 10 - 5).toFixed(2)}deg)`;
      element.removeEventListener('animationend', onEnd);
    };

    element.addEventListener('animationend', onEnd);

    return () => {
      element.removeEventListener('animationend', onEnd);
    };
  }, [flat]);

  const symbol = getSymbol(card?.suit ?? '');

  return (
    <div
      ref={ref}
      className={cn(styles.card, styles['suit_' + card?.suit])}
      role="img"
    >
      {card ? (
        <>
          <div className={styles.cardCornerTop}>
            {card.rank ?? ''}
            <span className={styles.cardSuitSmall}>{symbol}</span>
          </div>
          <div className={styles.cardCenter}>{symbol}</div>
          <div className={styles.cardCornerBottom}>
            {card.rank ?? ''}
            <span className={styles.cardSuitSmall}>{symbol}</span>
          </div>
        </>
      ) : (
        <div className={styles.cardBack} />
      )}
    </div>
  );
};
