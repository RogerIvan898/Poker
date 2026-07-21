import React, { useState } from 'react';

import { Copy, Check } from 'lucide-react';

import styles from './copy-field.module.css';

interface CopyFieldProps {
  label: string;
  value: string;
  badgeText?: string;
  onCopy?: (value: string) => void;
}

export const CopyField = ({
  label,
  value,
  badgeText,
  onCopy,
}: CopyFieldProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(value);

    setCopied(true);
    onCopy?.(value);

    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={styles.fieldGroup}>
      <div className={styles.fieldHeader}>
        <span>{label}</span>
        {badgeText && <b>{badgeText}</b>}
      </div>
      <div className={styles.fieldBox}>
        <span className={styles.text}>{value}</span>
        <button className={styles.copyBtn} onClick={handleCopy} type="button">
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
};
