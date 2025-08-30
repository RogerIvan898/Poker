import styles from './PokerTable.module.css';
import { Card } from '../Card';
import type { Card as CardType } from '../../shared/types/card';
import React from 'react';
import { useTable } from '../../Providers/table-context';

interface Props {
    cards: CardType[];
}

export const PokerTable = ({cards = []}: Props) => {
    const {setTableElement} = useTable();

  return (
    <div className={styles.tableContainer}>
      <div className={styles.pokerTable}>
        <div className={styles.tableRail} />
        <div className={styles.tableSurface} ref={setTableElement}>
          <div className={styles.communityCards}>
            {cards.map((c, i) => (
              <Card key={i} index={i} rank={c.rank} suit={c.suit} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
