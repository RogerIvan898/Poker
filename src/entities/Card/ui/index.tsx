import React from 'react';

import { cn, getSymbol } from 'shared/utils';
import type { Card as CardType } from 'shared/types/card';
import styles from './Card.module.css';

interface Props {
  card: CardType | null,
  hidden?: boolean; 
  index?: number;
}

export const Card = ({
  card,
  hidden = false,
  index = 0,
}: Props) => {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;

    if (!el) return;

    const delay = index * 150;
    el.style.setProperty('--delay', `${delay}ms`);
    el.classList.add(styles.play);

    const rot = (Math.random() * 10 - 5).toFixed(2);
    
    const onEnd = () => {
      el.style.transform = `rotate(${rot}deg)`;
      el.removeEventListener('animationend', onEnd);
    };

    el.addEventListener('animationend', onEnd);

    return () => {
      el.removeEventListener('animationend', onEnd);
    };
  }, [index]);

  const symbol = getSymbol(card?.suit ?? '');

  return (
    <div
      ref={ref}
      style={{width: 64, height: 92}}
      className={cn(styles.card, hidden && styles.cardHidden, styles['suit_' + card?.suit])}
      role="img"
    >
      {(card && !hidden) ? (
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
