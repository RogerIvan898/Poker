import React from 'react'
import { useUnit } from 'effector-react';

import { TableProvider, useTable } from 'providers/table-context';
import { useGameSocket, gameModel } from 'features/game';
import { $currentPlayerId } from 'entities/Player/model/store';
import { PokerTable } from 'entities/PokerTabe/ui'
import { PlayersLayer } from 'entities/PokerTabe/ui/PlayersLayer';
import { ActionViewer } from 'entities/PokerTabe/ui/ActionViewer';
import type { Card } from 'shared/types/card';

import styles from './room-page.module.css';
import { playerSeatsConfig } from '../constants';

export const RoomPage = () => {
  useGameSocket('1000');
  
  const [call, check, fold, raise, gameState] = useUnit([
    gameModel.call,
    gameModel.check,
    gameModel.fold,
    gameModel.raise,
    gameModel.$gameState
  ]);

  const currentPlayerId = useUnit($currentPlayerId)

function generateRandomCards(players: any[], count: number = 5) {
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  
  const fullDeck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      fullDeck.push({ rank, suit });
    }
  }

  const usedCards = new Set();
  
  players.forEach(player => {
    player.hand.forEach(card => {
      if (card) {
        usedCards.add(`${card.rank}-${card.suit}`);
      }
    });
  });
  
  const availableCards = fullDeck.filter(card => 
    !usedCards.has(`${card.rank}-${card.suit}`)
  );

  const result = [];
  for (let i = 0; i < count && availableCards.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    result.push(availableCards[randomIndex]);
    availableCards.splice(randomIndex, 1);
  }

  return result;
}

  const community: Card[] = generateRandomCards(gameState.players, 5);

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
          seatConfigs={playerSeatsConfig}
          currentPlayerId={currentPlayerId}
          playerTurnId={gameState.currentTurnId}
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
