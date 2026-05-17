import React from 'react';
import { useUnit } from 'effector-react';

import { sessionModel } from 'entities/session';

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
  const [viewerId] = useUnit([sessionModel.$viewerId]);
  const [isRaising, setIsRaising] = React.useState(false);

  if (!viewerId) {
    return null;
  }

  return (
    <div className={styles.actionContainer}>
      {isRaising ? (
        <RaiseManager
          playerId={viewerId}
          minRaise={minRaise}
          maxRaise={maxRaise}
          onCancel={() => setIsRaising(false)}
        />
      ) : (
        <BaseActions
          playerId={viewerId}
          canFold={canFold}
          canCall={canCall}
          canRaise={canRaise}
          onRaiseClick={() => setIsRaising(true)}
        />
      )}
    </div>
  );
};
