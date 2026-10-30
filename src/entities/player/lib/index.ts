import {
  PlayerAction,
  PlayerStatus,
  SeatBadgeKind,
  type BlindRole,
  type Player,
  type PlayerActionType,
  type PlayerStatusType,
  type SeatActionBadge,
  type SeatDirection,
} from '../model';

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

export const resolveSeatActionBadge = (
  lastAction: PlayerActionType | null,
  status: PlayerStatusType,
  blindRole?: BlindRole | null
): SeatActionBadge | null => {
  if (status === PlayerStatus.ALL_IN) {
    return SeatBadgeKind.ALL_IN;
  }

  if (status === PlayerStatus.FOLDED) {
    return PlayerAction.FOLD;
  }

  if (lastAction) {
    return lastAction;
  }

  if (blindRole === 'sb') {
    return SeatBadgeKind.SB;
  }

  if (blindRole === 'bb') {
    return SeatBadgeKind.BB;
  }

  return null;
};

export const isBlindBadge = (badge: SeatActionBadge) =>
  badge === SeatBadgeKind.SB || badge === SeatBadgeKind.BB;

const DEALER_OFFSET_RAD = (55 * Math.PI) / 180;

const rotate = ({ x, y }: SeatDirection, angle: number): SeatDirection => ({
  x: x * Math.cos(angle) - y * Math.sin(angle),
  y: x * Math.sin(angle) + y * Math.cos(angle),
});

export const getDealerDirection = (towardCenter: SeatDirection) => {
  const clockwise = rotate(towardCenter, DEALER_OFFSET_RAD);
  const counterClockwise = rotate(towardCenter, -DEALER_OFFSET_RAD);

  return counterClockwise.y < clockwise.y - 1e-6 ? counterClockwise : clockwise;
};
