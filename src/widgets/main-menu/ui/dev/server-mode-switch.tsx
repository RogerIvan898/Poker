import { useState } from 'react';

import { useUnit } from 'effector-react';

import {
  $mockServerEnabled,
  setMockServerEnabled,
} from 'shared/config/mock-server';
import { Switch } from 'shared/ui/switch';

import styles from '../main-menu.module.css';

export const ServerModeSwitch = () => {
  const enabled = useUnit($mockServerEnabled);
  const [pending, setPending] = useState(false);

  const toggle = async () => {
    setPending(true);
    try {
      await setMockServerEnabled(!enabled);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className={styles.serverSwitch}>
      <span className={styles.serverSwitchTitle}>Mock server</span>
      <Switch
        checked={enabled}
        disabled={pending}
        label="Toggle mock server"
        onChange={() => void toggle()}
      />
    </div>
  );
};
