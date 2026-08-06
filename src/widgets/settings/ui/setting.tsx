import styles from './settings-dialog.module.css';

interface Props {
  label: string;
}

export const Setting = ({
  label,
  children,
}: React.PropsWithChildren<Props>) => {
  return (
    <div className={styles.setting}>
      <p className={styles.settingLabel}>{label}</p>
      {children}
    </div>
  );
};
