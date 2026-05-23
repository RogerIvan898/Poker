import React from 'react';
import { useUnit } from 'effector-react';

import { gameModel } from 'entities/game';
import { sessionModel } from 'entities/session';

import { BaseActions } from './base-actions';
import { BetManager } from './bet-manager';
import styles from './player-actions.module.css';

export const PlayerActions = () => {
  const [viewerId, allowedActions] = useUnit([
    sessionModel.$viewerId,
    gameModel.$myAllowedActions,
  ]);

  const [isChangingAmount, setIsChangingAmount] = React.useState(false);

  // if (!viewerId || !allowedActions) {
  //     return null;
  //   }

  if (!viewerId) {
    return null;
  }

  const canBet = !allowedActions?.canCall || allowedActions.minRaise === 0;
  const canPutChips =
    (allowedActions?.maxRaise ?? 0) >= (allowedActions?.minRaise ?? 0);

  return (
    <div className={styles.actionContainer}>
      {isChangingAmount ? (
        <BetManager
          playerId={viewerId}
          minAmount={allowedActions?.minRaise ?? 0}
          maxAmount={allowedActions?.maxRaise ?? 1000}
          onCancel={() => setIsChangingAmount(false)}
          variant={canBet ? 'bet' : 'raise'}
        />
      ) : (
        <BaseActions
          playerId={viewerId}
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
