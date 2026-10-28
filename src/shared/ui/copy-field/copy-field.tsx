import React from 'react';

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
  const [copied, setCopied] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);

      setCopied(true);
      onCopy?.(value);

      clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className={styles.fieldGroup}>
      <div className={styles.fieldHeader}>
        <span>{label}</span>
        {badgeText && <b>{badgeText}</b>}
      </div>
      <div className={styles.fieldBox}>
        <span className={styles.text}>{value}</span>
        <button
          className={styles.copyBtn}
          onClick={handleCopy}
          type="button"
          aria-label={copied ? 'Скопировано' : 'Скопировать'}
          title={copied ? 'Скопировано' : 'Скопировать'}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
};
