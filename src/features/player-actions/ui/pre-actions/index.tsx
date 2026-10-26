import { useLingui } from '@lingui/react/macro';
import { useUnit } from 'effector-react';

import { Button } from 'shared/ui/button';

import { $preAction, setPreAction, type PreAction } from '../../model';
import styles from '../base-actions/base-actions.module.css';

export const PreActions = () => {
  const { t } = useLingui();
  const [activeAction, setActive] = useUnit([$preAction, setPreAction]);

  const toggle = (action: PreAction) => {
    setActive(activeAction === action ? null : action);
  };

  // lingui-set context="poker-pre-action"
  const checkFoldLabel = t`Check / Fold`;
  const callAnyLabel = t`Call Any`;
  const autoFoldLabel = t`Fold`;
  // lingui-reset

  return (
    <div className={styles.buttonRow}>
      <Button
        color="neutral"
        text={checkFoldLabel}
        isActive={activeAction === 'check_fold'}
        onClick={() => toggle('check_fold')}
      />

      <Button
        color="neutral"
        text={callAnyLabel}
        isActive={activeAction === 'call_any'}
        onClick={() => toggle('call_any')}
      />

      <Button
        color="neutral"
        text={autoFoldLabel}
        isActive={activeAction === 'auto_fold'}
        onClick={() => toggle('auto_fold')}
      />
    </div>
  );
};
