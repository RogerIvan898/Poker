import { ActionButton } from 'shared/ui/action-button';

import { call, check, fold } from '../../model';

import styles from './base-actions.module.css';

interface Props {
  canFold: boolean;
  canCall: boolean;
  canRaise: boolean;
  isBet: boolean;
  onRaiseClick: () => void;
}

export const BaseActions = ({
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
      onClick={canCall ? () => call() : () => check()}
    />

    {canRaise && (
      <ActionButton
        color="primary"
        text={isBet ? 'Bet' : 'Raise'}
        onClick={onRaiseClick}
      />
    )}

    {canFold && (
      <ActionButton color="secondary" text="Fold" onClick={() => fold()} />
    )}
  </div>
);
