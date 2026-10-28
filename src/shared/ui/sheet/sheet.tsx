import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { useLingui } from '@lingui/react/macro';
import { X } from 'lucide-react';

import styles from './sheet.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  leading?: ReactNode;
  titleAddon?: ReactNode;
  children: ReactNode;
}

export const Sheet = ({
  open,
  onClose,
  title,
  leading,
  titleAddon,
  children,
}: Props) => {
  const { t } = useLingui();

  if (!open) {
    return null;
  }

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        onClick={e => e.stopPropagation()}
      >
        <header className={styles.header}>
          {leading ?? <div className={styles.headerSide} />}

          <div className={styles.titleGroup}>
            {title != null && <h2 className={styles.title}>{title}</h2>}
            {titleAddon}
          </div>

          <div className={styles.headerSide}>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={onClose}
              aria-label={t`Close`}
            >
              <X size={18} />
            </button>
          </div>
        </header>

        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body
  );
};
