import { cn, getInitialLetter } from 'shared/utils';

import styles from './player-avatar.module.css';

interface Props {
  name: string;
  folded: boolean;
  turn: boolean;
  currentPlayer: boolean;
  hideBorder: boolean;
}

export const PlayerAvatar = ({
  name,
  folded,
  turn,
  currentPlayer,
  hideBorder,
}: Props) => (
  <div
    className={cn(
      styles.avatar,
      folded && styles.foldedAvatar,
      turn && styles.turn,
      currentPlayer && styles.currentPlayer
    )}
    style={hideBorder ? { border: 'none' } : undefined}
  >
    {getInitialLetter(name)}
  </div>
);
