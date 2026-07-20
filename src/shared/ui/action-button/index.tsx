import React from 'react';

import checkSoundUrl from 'assets/sounds/check.mp3';

import { useSound } from 'shared/hooks/useSound';
import { cn } from 'shared/utils';

import styles from './action-button.module.css';

type ColorIntent = 'primary' | 'secondary' | 'danger' | 'neutral';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ColorIntent;
  text?: string;
}

export const ActionButton = ({
  color = 'primary',
  text,
  className,
  disabled,
  ...props
}: Props) => {
  const { play: playCheckSound } = useSound(checkSoundUrl);

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playCheckSound();
    props.onClick?.(e);
  };

  return (
    <button
      {...props}
      type="button"
      className={cn(styles.button, styles[`color-${color}`], className)}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
