import { cn, getInitialLetter } from 'shared/utils';

import styles from './player-avatar.module.css';

interface Props {
  name: string;
  isFolded: boolean;
  isTurn: boolean;
  isCurrentPlayer: boolean;
  hideBorder: boolean;
}

export const PlayerAvatar = ({
  name,
  isFolded,
  isTurn,
  isCurrentPlayer,
  hideBorder,
}: Props) => (
  <div
    className={cn(
      styles.avatar,
      isFolded && styles.foldedAvatar,
      isTurn && styles.turn,
      isCurrentPlayer && styles.currentPlayer
    )}
    style={hideBorder ? { border: 'none' } : undefined}
  >
    {getInitialLetter(name)}
  </div>
);
