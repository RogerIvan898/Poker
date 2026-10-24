import { useLingui } from '@lingui/react/macro';

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
}: Props) => {
  const { t } = useLingui();

  // lingui-set context="poker-action"
  const foldLabel = t`Fold`;
  const callLabel = t`Call`;
  const checkLabel = t`Check`;
  const betLabel = t`Bet`;
  const raiseLabel = t`Raise`;
  // lingui-reset

  return (
    <div className={styles.buttonRow}>
      {canFold && (
        <ActionButton color="danger" text={foldLabel} onClick={() => fold()} />
      )}

      <ActionButton
        color="neutral"
        text={canCall ? callLabel : checkLabel}
        onClick={canCall ? () => call() : () => check()}
      />

      {canRaise && (
        <ActionButton
          color="primary"
          text={isBet ? betLabel : raiseLabel}
          onClick={onRaiseClick}
        />
      )}
    </div>
  );
};
