import React from 'react';
import { createPortal } from 'react-dom';

import { X } from 'lucide-react';

import styles from './dialog.module.css';

interface Props {
  open: boolean;
  title?: React.ReactNode;
  onClose: () => void;
}

export const Dialog = ({
  open,
  title = '',
  onClose,
  children,
}: React.PropsWithChildren<Props>) => {
  if (!open) {
    return null;
  }

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <header className={styles.header}>
          <div className={styles.titleContainer}>{title}</div>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>
        {children}
      </div>
    </div>,
    document.body
  );
};
