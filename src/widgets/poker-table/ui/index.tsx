import React from 'react';
import { useUnit } from 'effector-react';

import { gameModel } from 'entities/game';
import { playerModel } from 'entities/player';

import { PokerTable } from './poker-table';
import { PlayersLayer } from './players-layer';

export const PokerBoard = () => {
  const [gameState, currentPlayerId] = useUnit([
    gameModel.$gameState,
    playerModel.$currentPlayerId,
  ]);
  const [tableElement, setTableElement] = React.useState<HTMLDivElement | null>(
    null
  );

  return (
    <>
      <PokerTable
        cards={gameState.communityCards || []}
        ref={setTableElement}
      />

      {tableElement && (
        <PlayersLayer
          players={gameState.players}
          currentPlayerId={currentPlayerId}
          playerTurnId={gameState.currentTurnId}
          tableElement={tableElement}
        />
      )}
    </>
  );
};
