import { ControlButton } from '../control-button';
import { call, check, fold } from '../../model';

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
}: Props) => (
  <div className={styles.buttonRow}>
    {canCall ? (
      <ControlButton variant="call" onClick={() => call({ playerId })} />
    ) : (
      <ControlButton variant="check" onClick={() => check({ playerId })} />
    )}

    {canRaise && <ControlButton variant="raise" onClick={onRaiseClick} />}

    {canFold && (
      <ControlButton variant="fold" onClick={() => fold({ playerId })} />
    )}
  </div>
);
