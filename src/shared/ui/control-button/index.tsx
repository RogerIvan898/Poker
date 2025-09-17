import React from 'react';

import styles from './control-button.module.css';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement>{
  text?: string;
  variant: 'call' | 'check' | 'fold' | 'raise';
  fontColor?: string;
}

export const cn = (...classes: (string | undefined | boolean)[]) => 
  classes.filter(Boolean).join(' ');

export const ControlButton = ({ text, variant = 'raise', onClick, disabled }: Props) => {
  const variantClass = variant === 'call' ? styles['ps-button--call']
                  : variant === 'check' ? styles['ps-button--check']
                  : variant === 'fold' ? styles['ps-button--fold']
                  : styles['ps-button--raise'];

  return (
    <button
      className={cn(styles['ps-button'], variantClass)}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};