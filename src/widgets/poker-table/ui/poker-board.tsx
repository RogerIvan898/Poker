import React from 'react';

import { useUnit } from 'effector-react';

import { gameModel } from 'entities/game';

import { PlayersLayer } from './players-layer';
import styles from './poker-board.module.css';
import { PokerTable } from './poker-table';

export const PokerBoard = () => {
  const [gameState] = useUnit([gameModel.$gameState]);

  const [tableElement, setTableElement] = React.useState<HTMLDivElement | null>(
    null
  );
  const [hidePot, setHidePot] = React.useState(false);
  const showPot = !hidePot && gameState.pot > 0;

  return (
    <div className={styles.board}>
      <PokerTable
        cards={gameState.community}
        pot={gameState.pot}
        showPot={showPot}
        ref={setTableElement}
      />

      {tableElement && (
        <PlayersLayer tableElement={tableElement} onHidePot={setHidePot} />
      )}
    </div>
  );
};
