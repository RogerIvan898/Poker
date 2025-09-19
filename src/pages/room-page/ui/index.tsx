import React from 'react'
import { useUnit } from 'effector-react';

import { TableProvider } from 'providers/table-context';
import { useGameSocket, gameModel } from 'features/game';
import { $currentPlayerId } from 'entities/Player/model/store';
import { PokerTable } from 'entities/PokerTabe/ui'
import { PlayersLayer } from 'entities/PokerTabe/ui/PlayersLayer';
import { ActionViewer } from 'entities/PokerTabe/ui/ActionViewer';
import type { Card } from 'shared/types/card';

import styles from './room-page.module.css';

export const RoomPage = () => {
  useGameSocket('1000');
  
  const [call, check, fold, raise, gameState] = useUnit([
    gameModel.callClicked,
    gameModel.checkClicked,
    gameModel.foldClicked,
    gameModel.raiseClicked,
    gameModel.$gameState
  ]);

  const [currentPlayerId] = useUnit([
    $currentPlayerId
  ])

  const community: Card[] = [
    { rank: 'A', suit: 'spades' },
    { rank: '10', suit: 'hearts' },
    { rank: '7', suit: 'diamonds' },
    { rank: 'K', suit: 'clubs' },
    { rank: '3', suit: 'clubs' },
  ];

  const playersWithPositions = gameState.players.map((player, index) => {
    if (currentPlayerId === player.id) {
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
          seatConfigs={{
            0: {
              margin: 18,
              cardPosition: 'left',
            },
            1: {
              margin: 32,
              cardPosition: 'right',
            },
            2: {
              margin: 14,
              cardPosition: 'right',
            },
            3: {
              margin: 32,
              cardPosition: 'right',
            },
            4: {
              margin: 22,
              cardPosition: 'right',
            },
            5: {
              margin: 22,
              cardPosition: 'left',
            },
            6: {
              margin: 32,
              cardPosition: 'left',
            },
            7: {
              margin: 12,
              cardPosition: 'left',
            },
            8: {
              margin: 32,
              cardPosition: 'left'
            }
          }}
        />

        {currentPlayerId && (
          <ActionViewer
            canFold={true}
            canCall={true}
            canRaise={true}
            onCall={() => call({playerId: currentPlayerId})}
            onFold={() => fold({playerId: currentPlayerId})}
            onRaise={(amount: number) => raise({playerId: currentPlayerId, amount})}
            onCheck={() => check({playerId: currentPlayerId})}
          />
        )}
      </div>
    </TableProvider>
  )
};
