import React from 'react';
import styles from './Player.module.css';

const initialLetter = (name) => (name ? name.charAt(0).toUpperCase() : '?');

export default function Player({ name = 'Player', stack = 0, status = 'waiting', isDealer = false }) {
  return (
    <div className={styles.player}>
      <div className={styles.avatarWrap}>
        <div className={`${styles.avatar} ${status === 'fold' ? styles.folded : ''}`}>
          {initialLetter(name)}
        </div>
        {isDealer && <div className={styles.dealerBadge}>D</div>}
      </div>

      <div className={styles.info}>
        <div className={styles.name}>{name}</div>
        <div className={styles.stack}>{stack} ✦</div>
      </div>
    </div>
  );
}
