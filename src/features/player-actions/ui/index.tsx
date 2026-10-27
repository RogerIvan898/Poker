import React from 'react';

import { useUnit } from 'effector-react';

import { gameModel } from 'entities/game';
import { PlayerStatus } from 'entities/player';
import { sessionModel } from 'entities/session';

import { ActionPanel } from './action-panel';
import { BetManager } from './bet-manager';
import styles from './player-actions.module.css';

const isPlayerInHand = (status: string | undefined) =>
  status === PlayerStatus.IN_GAME ||
  status === PlayerStatus.RAISE ||
  status === PlayerStatus.ALL_IN;

export const PlayerActions = () => {
  const [viewerId, allowedActions, players, gameState] = useUnit([
    sessionModel.$currentUserId,
    gameModel.$myAllowedActions,
    gameModel.$players,
    gameModel.$gameState,
  ]);

  const [isChangingAmount, setIsChangingAmount] = React.useState(false);
  const isMyTurn = Boolean(allowedActions);

  React.useEffect(() => {
    if (!isMyTurn) {
      setIsChangingAmount(false);
    }
  }, [isMyTurn]);

  if (!viewerId) {
    return null;
  }

  const viewer = Object.values(players).find(player => player.id === viewerId);
  const inHand = isPlayerInHand(viewer?.status);
  const showPreActions = inHand && !isMyTurn;

  const canBet = !allowedActions?.canCall || allowedActions.minRaise === 0;
  const canPutChips =
    (allowedActions?.maxRaise ?? 0) >= (allowedActions?.minRaise ?? 0);

  return (
    <div className={styles.actionContainer}>
      {isMyTurn && isChangingAmount ? (
        <BetManager
          playerId={viewerId}
          minAmount={allowedActions?.minRaise ?? 0}
          maxAmount={allowedActions?.maxRaise ?? 1000}
          bigBlind={gameState.bigBlind}
          pot={
            gameState.pot +
            Object.values(players).reduce(
              (sum, player) => sum + player.committed,
              0
            )
          }
          callAmount={allowedActions?.callAmount ?? 0}
          committed={viewer?.committed ?? 0}
          preflop={gameState.round === 'PREFLOP'}
          onCancel={() => setIsChangingAmount(false)}
          variant={canBet ? 'bet' : 'raise'}
        />
      ) : (
        <ActionPanel
          isMyTurn={isMyTurn}
          showPreActions={showPreActions}
          canFold={allowedActions?.canFold ?? true}
          canCall={allowedActions?.canCall ?? true}
          canRaise={canPutChips}
          onRaiseClick={() => setIsChangingAmount(true)}
          isBet={canBet}
        />
      )}
    </div>
  );
};
