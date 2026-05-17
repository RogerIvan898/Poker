import React from 'react';

import { Card } from 'entities/card';
import type { Card as CardType } from 'shared/types/card';

import styles from './poker-table.module.css';

interface Props {
  cards: CardType[];
}

export const PokerTable = React.forwardRef<HTMLDivElement, Props>(
  ({ cards = [] }, ref) => (
    <div className={styles.tableContainer} ref={ref}>
      <div className={styles.pokerTable}>
        <div className={styles.tableRail} />
        <div className={styles.tableSurface}>
          <div className={styles.communityCards}>
            {cards.map(c => (
              <Card key={`${c.rank}-${c.suit}`} card={c} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
);
