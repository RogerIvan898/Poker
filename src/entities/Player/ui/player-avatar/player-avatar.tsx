import { cn, getInitialLetter } from 'shared/utils';

import styles from './player-avatar.module.css';

interface Props {
  name: string;
  folded: boolean;
  currentPlayer: boolean;
}

export const PlayerAvatar = ({ name, folded, currentPlayer }: Props) => (
  <div
    className={cn(
      styles.avatar,
      folded && styles.foldedAvatar,
      currentPlayer && styles.currentPlayer
    )}
  >
    {getInitialLetter(name)}
  </div>
);
