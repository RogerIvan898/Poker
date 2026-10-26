import { PlayerStatus } from './constants';
import type { Player, PlayerStatusType } from './types';

const STATUSES_IN_HAND = new Set<PlayerStatusType>([
  PlayerStatus.IN_GAME,
  PlayerStatus.RAISE,
  PlayerStatus.ALL_IN,
]);

export const shouldShowHoleCards = ({
  hand,
  status,
  currentPlayer,
  reveal,
}: {
  hand: Player['hand'];
  status: PlayerStatusType;
  currentPlayer: boolean;
  reveal: boolean;
}) => {
  if (reveal && hand) {
    return true;
  }

  return STATUSES_IN_HAND.has(status) && Boolean(hand || !currentPlayer);
};
