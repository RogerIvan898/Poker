import React from 'react';

import { ControlButton } from 'shared/ui/control-button';
import styles from './action-viewer.module.css';
import { Logo } from 'shared/ui/logo';

interface Props {
  canFold: boolean;
  canCall: boolean;
  canRaise: boolean;
  onCheck: () => void;
  onFold: () => void;
  onCall: () => void;
  onRaise: (amount: number) => void;
  minRaise?: number;
  maxRaise?: number;
  currentBet?: number;
}

export const ActionViewer = ({
  canFold,
  canCall,
  canRaise,
  onFold,
  onCall,
  onRaise,
  onCheck,
  minRaise = 0,
  maxRaise = 1000,
  currentBet = 0
}: Props) => {
  const [raiseAmount, setRaiseAmount] = React.useState(minRaise);
  const [isRaising, setIsRaising] = React.useState(false);

  const handleRaiseClick = () => {
    if (isRaising) {
      onRaise(raiseAmount);
      setIsRaising(false);
    } else {
      setIsRaising(true);
      setRaiseAmount(minRaise);
    }
  };

  const handleRaiseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(maxRaise, Math.max(minRaise, Number(e.target.value)));
    setRaiseAmount(value);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRaiseAmount(Number(e.target.value));
  };

  const handleCancelRaise = () => {
    setIsRaising(false);
  };

  return (
    <div className={styles.actionContainer}>
      {isRaising ? (
        <>
          <div className={styles.raiseControls}> 
            <div className={styles.raiseInputContainer}>
              <input
                type="number"
                value={raiseAmount}
                onChange={handleRaiseChange}
                min={minRaise}
                max={maxRaise}
                className={styles.raiseInput}
              />
              <div className={styles.raiseLogo}>
                <Logo size={19} />
              </div>
            </div>

            <input
              type="range"
              value={raiseAmount}
              onChange={handleSliderChange}
              min={minRaise}
              max={maxRaise}
              className={styles.raiseSlider}
            />
          </div>
          <ControlButton text="Confirm Raise" variant="raise" onClick={handleRaiseClick} />
          <ControlButton text="Cancel" variant="fold" onClick={handleCancelRaise} />
        </>
      ) : (
        <>
          {canCall 
            ? <ControlButton text='Call' variant='call' onClick={onCall}/> 
            : <ControlButton text='Check' variant='check' onClick={onCheck}/>
          }
          {canRaise && <ControlButton text='Raise' variant='raise' onClick={() => setIsRaising(true)}/>}
          {canFold && <ControlButton text='Fold' variant='fold' onClick={onFold}/>}
        </>
      )}
    </div>
  );
};
