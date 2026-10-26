import React from 'react';

import { Card } from 'entities/card';
import type { CardType } from 'entities/card';

import { Logo } from 'shared/ui/logo';

import styles from './poker-table.module.css';

interface Props {
  cards: CardType[];
  pot: number;
}

const formatPot = (amount: number) =>
  Number.isInteger(amount) ? String(amount) : amount.toFixed(2);

export const PokerTable = React.forwardRef<HTMLDivElement, Props>(
  ({ cards = [], pot }, ref) => (
    <div className={styles.tableContainer}>
      <div className={styles.pokerTable} ref={ref}>
        <div className={styles.tableRail} />
        <div className={styles.tableSurface}>
          {pot > 0 && (
            <div className={styles.mainPotArea}>
              <div className={styles.potBadge}>
                <Logo size={16} className={styles.potLogo} />
                <span className={styles.potValue}>{formatPot(pot)}</span>
              </div>
            </div>
          )}
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
