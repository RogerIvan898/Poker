import { gameModel } from 'entities/game';

import { ControlButton } from '../control-button';

import styles from './base-actions.module.css';

interface Props {
  playerId: string;
  canFold: boolean;
  canCall: boolean;
  canRaise: boolean;
  onRaiseClick: () => void;
}

export const BaseActions = ({
  playerId,
  canFold,
  canCall,
  canRaise,
  onRaiseClick,
}: Props) => {
  return (
    <div className={styles.buttonRow}>
      {canCall ? (
        <ControlButton
          variant="call"
          onClick={() => gameModel.call({ playerId })}
        />
      ) : (
        <ControlButton
          variant="check"
          onClick={() => gameModel.check({ playerId })}
        />
      )}

      {canRaise && <ControlButton variant="raise" onClick={onRaiseClick} />}
      {canFold && (
        <ControlButton
          variant="fold"
          onClick={() => gameModel.fold({ playerId })}
        />
      )}
    </div>
  );
};
