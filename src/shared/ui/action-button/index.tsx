import React from 'react';

import { cn } from 'shared/utils';

import styles from './action-button.module.css';

type ColorIntent = 'primary' | 'neutral' | 'danger';

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
  return (
    <button
      {...props}
      type="button"
      className={cn(styles.button, styles[color], className)}
      disabled={disabled}
    >
      {text}
    </button>
  );
};
