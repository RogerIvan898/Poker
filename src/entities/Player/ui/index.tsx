import React from 'react';

import { Card } from 'entities/Card';
import type { Player as PlayerType } from 'shared/types/player';
import styles from './Player.module.css';
import { useUnit } from 'effector-react';
import { $currentPlayerState } from '../model/store';

const initialLetter = (name: string) => (name ? name.charAt(0).toUpperCase() : '?');

export function Player({name, stack, status, id, hand}: PlayerType) {
  const [currentPlayer] = useUnit([$currentPlayerState]);

  const currentHand = currentPlayer?.hand ?? [null, null];
  const isCurrentPlayer = currentPlayer?.id === id;

  const isDealer = false;

  return (
    <div className={styles.player}>
      <div className={styles.avatarWrap}>
        <div className={`${styles.avatar} ${status === 'FOLDED' ? styles.folded : ''}`}>
          {initialLetter(name)}
        </div>
        {isDealer && <div className={styles.dealerBadge}>D</div>}
      </div>

      <div className={styles.info}>
        <div className={styles.name}>{name}</div>
        <div className={styles.stack}>{stack} ✦</div>
      </div>

      {hand?.length && (
      <div className={styles.cards}>
        <Card rank={hand[0].rank} suit={hand[0].suit} hidden={!isCurrentPlayer}/>
        <Card rank={hand[1].rank} suit={hand[1].suit} hidden={!isCurrentPlayer}/>
        </div>
      )}
        
    </div>
  );
}
