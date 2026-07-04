import React from 'react';

import { cn } from 'shared/utils';

import styles from './control-button.module.css';
import { useSound } from 'shared/hooks/useSound';
import checkSoundUrl from 'assets/sounds/check.mp3';

const DEFAULT_LABELS = {
  call: 'Call',
  check: 'Check',
  fold: 'Fold',
  raise: 'Raise',
  bet: 'Bet',
} as const;

type ActionType = keyof typeof DEFAULT_LABELS;
type ColorIntent = 'primary' | 'secondary' | 'danger' | 'neutral';

const ACTION_COLORS: Record<ActionType, ColorIntent> = {
  call: 'secondary',
  check: 'neutral',
  fold: 'danger',
  raise: 'primary',
  bet: 'primary',
};

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  action?: ActionType;
  color?: ColorIntent;
  text?: string;
}

export const ControlButton = ({
  action,
  color,
  text,
  className,
  disabled,
  ...props
}: Props) => {
  const { play: playCheckSound } = useSound(checkSoundUrl);
  const buttonText = text ?? (action ? DEFAULT_LABELS[action] : '');
  const buttonColor = color ?? (action ? ACTION_COLORS[action] : 'neutral');

  return (
    <button
      type="button"
      className={cn(styles.button, styles[`color-${buttonColor}`], className)}
      disabled={disabled}
      {...props}
      onClick={() => playCheckSound()}
    >
      {buttonText}
    </button>
  );
};
