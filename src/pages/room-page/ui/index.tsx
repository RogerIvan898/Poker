import React from 'react'
import { useUnit } from 'effector-react';

import { TableProvider } from 'providers/table-context';
import { useGameSocket, gameModel } from 'features/game';
import { PokerTable } from 'entities/PokerTabe/ui'
import { PlayersLayer } from 'entities/PokerTabe/ui/PlayersLayer';
import { ActionViewer } from 'entities/PokerTabe/ui/ActionViewer';
import type { Card } from 'shared/types/card';
import styles from './room-page.module.css';
import { $currentPlayerState } from 'entities/Player/model/store';

export const RoomPage = () => {
  useGameSocket('1000');
  
  const [call, check, fold, raise, gameState] = useUnit([
    gameModel.callClicked,
    gameModel.checkClicked,
    gameModel.foldClicked,
    gameModel.raiseClicked,
    gameModel.$gameState
  ]);

  const [currentPlayer] = useUnit([
    $currentPlayerState
  ])

  const community: Card[] = [
    { rank: 'A', suit: 'spades' },
    { rank: '10', suit: 'hearts' },
    { rank: '7', suit: 'diamonds' },
    { rank: 'K', suit: 'clubs' },
    { rank: '3', suit: 'clubs' },
  ];

  const playersWithPositions = gameState.players.map((player, index) => {
    if (currentPlayer && player.id === currentPlayer.id) {
      return {
        ...player,
        seat: 0
      };
    }
    
    const positionIndex = index >= 5 ? index % 5 + 1 : index + 1;
    return {
      ...player,
      seat: positionIndex
    };
  });

  return (
    <TableProvider>
      <div className={styles.container}>
        <PokerTable cards={community} />
        <PlayersLayer 
          players={playersWithPositions} 
          currentPlayerId={currentPlayer?.id} 
          seatMargins={{
            0: 10,
            1: 32,
            2: 14,
            3: 32,
            4: 22,
            5: 22,
            6: 32,
            7: 14,
            8: 32
          }}
        />

        {currentPlayer && (
          <ActionViewer
            canFold={true}
            canCall={true}
            canRaise={true}
            onCall={() => call({playerId: currentPlayer.id})}
            onFold={() => fold({playerId: currentPlayer.id})}
            onRaise={(amount: number) => raise({playerId: currentPlayer.id, amount})}
            onCheck={() => check({playerId: currentPlayer.id})}
          />
        )}
      </div>
    </TableProvider>
  )
};