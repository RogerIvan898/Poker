import React, { useEffect } from 'react';

import styles from './Card.module.css';

const suitSymbol = (suit: string) => {
  switch (suit) {
    case 'hearts': return '♥';
    case 'diamonds': return '♦';
    case 'clubs': return '♣';
    case 'spades': return '♠';
    default: return '';
  }
};

export const Card = ({
  rank = 'A',
  suit = 'spades',
  hidden = false,
  index = 0,
  size = 1 
}) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const symbol = suitSymbol(suit);

  useEffect(() => {
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

  return (
    <div
      ref={ref}
      style={{width: 64 * size, height: 92 * size}}
      className={`${styles.card} ${hidden ? styles.cardHidden : ''} ${styles['suit_' + suit] || ''}`}
      role="img"
      aria-label={hidden ? 'face down card' : `${rank} of ${suit}`}
    >
      {!hidden ? (
        <>
          <div className={styles.cardCornerTop}>
            {rank}<span className={styles.cardSuitSmall}>{symbol}</span>
          </div>
          <div className={styles.cardCenter}>{symbol}</div>
          <div className={styles.cardCornerBottom}>
            {rank}<span className={styles.cardSuitSmall}>{symbol}</span>
          </div>
        </>
      ) : (
        <div className={styles.cardBack} />
      )}
    </div>
  );
};
