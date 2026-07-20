import { ActionButton } from 'shared/ui/action-button';

import { call, check, fold } from '../../model';

import styles from './base-actions.module.css';

interface Props {
  playerId: string;
  canFold: boolean;
  canCall: boolean;
  canRaise: boolean;
  isBet: boolean;
  onRaiseClick: () => void;
}

export const BaseActions = ({
  playerId,
  canFold,
  canCall,
  canRaise,
  isBet,
  onRaiseClick,
}: Props) => (
  <div className={styles.buttonRow}>
    <ActionButton
      color="danger"
      text={canCall ? 'Call' : 'Check'}
      onClick={canCall ? () => call({ playerId }) : () => check({ playerId })}
    />

    {canRaise && (
      <ActionButton
        color="primary"
        text={isBet ? 'Bet' : 'Raise'}
        onClick={onRaiseClick}
      />
    )}

    {canFold && (
      <ActionButton
        color="secondary"
        text="Fold"
        onClick={() => fold({ playerId })}
      />
    )}
  </div>
);
