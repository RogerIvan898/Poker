import React from 'react';

import { cn, getSymbol } from 'shared/utils';
import type { Card as CardType } from 'shared/types/card';
import styles from './Card.module.css';

interface Props {
  card: CardType | null;
  hidden?: boolean;
}

export const Card = ({ card, hidden = false }: Props) => {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    element.classList.add(styles.play);

    const rot = (Math.random() * 10 - 5).toFixed(2);

    const onEnd = () => {
      element.style.transform = `rotate(${rot}deg)`;
      element.removeEventListener('animationend', onEnd);
    };

    element.addEventListener('animationend', onEnd);

    return () => {
      element.removeEventListener('animationend', onEnd);
    };
  }, []);

  const symbol = getSymbol(card?.suit ?? '');

  return (
    <div
      ref={ref}
      style={{ width: 64, height: 92 }}
      className={cn(
        styles.card,
        hidden && styles.cardHidden,
        styles['suit_' + card?.suit]
      )}
      role="img"
    >
      {card && !hidden ? (
        <>
          <div className={styles.cardCornerTop}>
            {card?.rank ?? ''}
            <span className={styles.cardSuitSmall}>{symbol}</span>
          </div>
          <div className={styles.cardCenter}>{symbol}</div>
          <div className={styles.cardCornerBottom}>
            {card?.rank ?? ''}
            <span className={styles.cardSuitSmall}>{symbol}</span>
          </div>
        </>
      ) : (
        <div className={styles.cardBack} />
      )}
    </div>
  );
};
