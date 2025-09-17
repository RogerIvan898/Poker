import React from 'react';

import { ControlButton } from 'shared/ui/control-button';
import styles from './action-viewer.module.css';

interface Props {
  canFold: boolean;
  canCall: boolean;
  canRaise: boolean;
  onCheck: () => void;
  onFold: () => void;
  onCall: () => void;
  onRaise: (amount: number) => void;
}

export const ActionViewer = ({
  canFold,
  canCall,
  canRaise,
  onFold,
  onCall,
  onRaise,
  onCheck
}: Props) => {
  const [raiseAmount, setRiseAmount] = React.useState(0);

  return (
      <div className={styles.actionContainer}>
        {canCall 
          ? <ControlButton text='Call' variant='call' onClick={onCall}/> 
          : <ControlButton text='Check' varian='check' onClick={onCheck}/>
        }
        {canRaise && <ControlButton text='Raise' variant='raise' onClick={() => onRaise(raiseAmount)}/>}
        {canFold && <ControlButton text='Fold' variant='fold' onClick={onFold}/>}
    </div>
  );
};
