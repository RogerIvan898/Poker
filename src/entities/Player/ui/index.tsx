import React from 'react';

import { Card } from 'entities/Card';
import type { Player as PlayerType } from 'shared/types/player';
import styles from './Player.module.css';

const initialLetter = (name: string) => (name ? name.charAt(0).toUpperCase() : '?');

interface PlayerProps extends PlayerType {
  cardsPosition?: 'top' | 'bottom' | 'left' | 'right';
  isCurrentPlayer?: boolean;
}

export function Player({ 
  name,
  stack,
  status, 
  hand, 
  cardsPosition = 'top', 
  isCurrentPlayer = false 
}: PlayerProps) {
  const isDealer = false;
  const isSitOut = status === 'SIT_OUT';
  const isFolded = status === 'FOLDED';

  return (
    <div className={`${styles.player} ${isFolded ? styles.folded : ''} ${isSitOut ? styles.sitOut : ''}`}>
      <div className={styles.mainContainer}>
        <div className={styles.avatarWrap}>
          <div className={`${styles.avatar} ${status === 'FOLDED' ? styles.folded : ''} ${isCurrentPlayer ? styles.currentPlayer : ''}`}>
            {initialLetter(name)}
          </div>
          {isDealer && <div className={styles.dealerBadge}>D</div>}
        </div>

      {(hand?.length > 0 && (!isFolded || !isCurrentPlayer)) && (
        <div className={`${styles.cards} ${styles[`cards-${cardsPosition}`]}`}>
          <Card card={hand[0]} hidden={!isCurrentPlayer} />
          <Card card={hand[1]} hidden={!isCurrentPlayer} />
        </div>
      )}     
      </div>   
      
      <div className={styles.info}>
          <div className={styles.name}>{name}</div>
          <div className={styles.stack}>{stack} ✦</div>
        </div>
    </div>
  );
}
