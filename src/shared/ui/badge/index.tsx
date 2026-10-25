import type { ReactNode } from 'react';

import { cn } from 'shared/utils';

import styles from './badge.module.css';

export type BadgeVariant =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'highlight';

interface Props {
  variant: BadgeVariant;
  children: ReactNode;
  className?: string;
}

export const Badge = ({ variant, children, className }: Props) => (
  <span className={cn(styles.badge, styles[variant], className)}>
    {children}
  </span>
);
