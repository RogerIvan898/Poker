import React from 'react';

import { cn } from 'shared/utils';

import styles from './control-button.module.css';

const DEFAULT_LABELS = {
  call: 'Call',
  check: 'Check',
  fold: 'Fold',
  raise: 'Raise',
} as const;

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'call' | 'check' | 'fold' | 'raise';
  text?: string;
}

export const ControlButton = ({
  variant,
  text,
  className,
  disabled,
  ...props
}: Props) => {
  const buttonText = text ?? DEFAULT_LABELS[variant];

  const variantClass = styles[`ps-button--${variant}`];

  return (
    <button
      type="button"
      className={cn(styles['ps-button'], variantClass, className)}
      disabled={disabled}
      {...props}
    >
      {buttonText}
    </button>
  );
};
