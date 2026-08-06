import { Plus } from 'lucide-react';

import styles from './amount-step.module.css';

interface Props {
  options: number[];
  onAdd: (value: number) => void;
}

export const QuickAddOptions = ({ options, onAdd }: Props) => {
  return (
    <div className={styles.quickAmounts}>
      {options.map(value => (
        <button
          key={value}
          type="button"
          className={styles.quickBtn}
          onClick={() => onAdd(value)}
        >
          <span className={styles.quickBtnIcon}>
            <Plus size={18} strokeWidth={2.25} />
          </span>
          <span className={styles.quickBtnValue}>{value}</span>
        </button>
      ))}
    </div>
  );
};
