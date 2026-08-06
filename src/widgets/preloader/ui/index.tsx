import { Loader2, Spade } from 'lucide-react';

import styles from './preloader.module.css';

interface PreloaderProps {
  label?: string;
  progress?: number;
}

export const Preloader = ({
  label = 'Загрузка ресурсов...',
  progress,
}: PreloaderProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <Spade className={styles.centerIcon} size={32} />
          <Loader2 className={styles.spinner} size={72} />
        </div>

        <p className={styles.label}>{label}</p>

        {typeof progress === 'number' && (
          <div className={styles.progressWrapper}>
            <div className={styles.track}>
              <div
                className={styles.bar}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <span className={styles.progressText}>{Math.round(progress)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};
