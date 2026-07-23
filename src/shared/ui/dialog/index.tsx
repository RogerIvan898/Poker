import React from 'react';
import { createPortal } from 'react-dom';

import { X } from 'lucide-react';

import styles from './dialog.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Dialog = ({
  open,
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
