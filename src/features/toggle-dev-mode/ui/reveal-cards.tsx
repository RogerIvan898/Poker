import { useState } from 'react';

import { useUnit } from 'effector-react';

import { gameModel } from 'entities/game';
import { CLIENT_COMMANDS } from 'entities/game';

import { $mockServerEnabled } from 'shared/config/mock-server';
import { cn } from 'shared/utils';

import styles from './toggle-dev-mode.module.css';

export const RevealCardsButton = () => {
  const [mockEnabled, sendCommand] = useUnit([
    $mockServerEnabled,
    gameModel.sendClientCommand,
  ]);
  const [visible, setVisible] = useState(false);

  if (!mockEnabled) {
    return null;
  }

  const toggle = () => {
    const next = !visible;
    setVisible(next);
    sendCommand({
      type: CLIENT_COMMANDS.REVEAL_HOLES,
      payload: { visible: next },
    });
  };

  return (
    <button
      type="button"
      className={cn(styles.revealBtn, visible && styles.revealBtnActive)}
      onClick={toggle}
    >
      {visible ? 'Hide cards' : 'Show cards'}
    </button>
  );
};
