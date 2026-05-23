import { ControlButton } from '../control-button';
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
    {canCall ? (
      <ControlButton action="call" onClick={() => call({ playerId })} />
    ) : (
      <ControlButton action="check" onClick={() => check({ playerId })} />
    )}

    {canRaise && (
      <ControlButton action={isBet ? 'bet' : 'raise'} onClick={onRaiseClick} />
    )}

    {canFold && (
      <ControlButton action="fold" onClick={() => fold({ playerId })} />
    )}
  </div>
);
