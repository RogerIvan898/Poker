import type { CSSProperties } from 'react';

import { cn } from 'shared/utils';

import styles from './chip-stack.module.css';
import chipStyles from './chip.module.css';
import type { ChipColor } from './utils';
import { breakdownBet } from './utils';

interface ChipProps {
  label: string;
  color: ChipColor;
  grounded?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const Chip = ({
  label,
  color,
  grounded = false,
  className,
  style,
}: ChipProps) => (
  <div
    className={cn(
      chipStyles.chip,
      chipStyles[`color_${color}`],
      grounded ? chipStyles.grounded : chipStyles.stacked,
      className
    )}
    style={style}
  >
    <div className={chipStyles.inner}>
      <span className={chipStyles.value}>{label}</span>
    </div>
  </div>
);

interface StackProps {
  amount: number;
  className?: string;
}

export const ChipStack = ({ amount, className }: StackProps) => {
  const chips = breakdownBet(amount);

  if (!chips.length) return null;

  return (
    <div
      className={cn(styles.stack, className)}
      style={{ '--layers': chips.length } as CSSProperties}
    >
      {chips.map((chip, index) => (
        <Chip
          key={`${chip.value}-${index}`}
          label={chip.label}
          color={chip.color}
          grounded={index === 0}
          className={styles.layer}
          style={{
            bottom: `calc(${index} * var(--step))`,
            zIndex: index + 1,
          }}
        />
      ))}
    </div>
  );
};
