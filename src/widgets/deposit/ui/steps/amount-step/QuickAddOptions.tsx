import { Plus } from 'lucide-react';

import styles from './amount-step.module.css';

interface Props {
  options: number[];
  onAdd: (value: number) => void;
}

export const QuickAddOptions = ({ options, onAdd }: Props) => {
  return (
    <div
      className={styles.quickAmounts}
      role="group"
      aria-label="Quick add amount"
    >
      {options.map(value => (
        <button
          key={value}
          type="button"
          className={styles.quickBtn}
          onClick={() => onAdd(value)}
        >
          <span className={styles.quickBtnIcon} aria-hidden>
            <Plus size={16} strokeWidth={2.5} />
          </span>
          <span className={styles.quickBtnValue}>
            {value} <span className={styles.quickBtnUnit}>TON</span>
          </span>
        </button>
      ))}
    </div>
  );
};
