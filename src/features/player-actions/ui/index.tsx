import React from 'react';
import { useUnit } from 'effector-react';

import { playerModel } from 'entities/player';

import { BaseActions } from './base-actions';
import { RaiseManager } from './raise-manager';
import styles from './player-actions.module.css';

interface Props {
  canFold?: boolean;
  canCall?: boolean;
  canRaise?: boolean;
  minRaise?: number;
  maxRaise?: number;
}

export const PlayerActions = ({
  canFold = true,
  canCall = true,
  canRaise = true,
  minRaise = 0,
  maxRaise = 1000,
}: Props) => {
  const [playerId] = useUnit([playerModel.$currentPlayerId]);
  const [isRaising, setIsRaising] = React.useState(false);

  if (!playerId) {
    return null;
  }

  return (
    <div className={styles.actionContainer}>
      {isRaising ? (
        <RaiseManager
          playerId={playerId}
          minRaise={minRaise}
          maxRaise={maxRaise}
          onCancel={() => setIsRaising(false)}
        />
      ) : (
        <BaseActions
          playerId={playerId}
          canFold={canFold}
          canCall={canCall}
          canRaise={canRaise}
          onRaiseClick={() => setIsRaising(true)}
        />
      )}
    </div>
  );
};
