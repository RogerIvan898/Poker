import type { BetPosition, PlayerType as Player } from 'entities/player';

export interface SeatLayout {
  player: Player;
  betPosition: BetPosition;
  x: number;
  y: number;
}

interface TableSize {
  width: number;
  height: number;
}

const COMPACT_TABLE_WIDTH = 380;

const ELLIPSE_SCALE = {
  compact: { x: 0.5, y: 0.46 },
  regular: { x: 0.54, y: 0.48 },
};

const FULL_TURN_DEG = 360;

const getBetPosition = (angleDeg: number): BetPosition => {
  if (angleDeg <= 45 || angleDeg > 315) return 'top';
  if (angleDeg <= 135) return 'right';
  if (angleDeg <= 225) return 'bottom';
  return 'left';
};

export const computeSeats = (
  players: Player[],
  viewerSeat: number | null,
  table: TableSize
): SeatLayout[] => {
  const count = players.length;

  if (!count) return [];

  const scale =
    table.width < COMPACT_TABLE_WIDTH
      ? ELLIPSE_SCALE.compact
      : ELLIPSE_SCALE.regular;
  const centerX = table.width / 2;
  const centerY = table.height / 2;
  const radiusX = table.width * scale.x;
  const radiusY = table.height * scale.y;
  const referenceSeat = viewerSeat ?? players[0].seat;
  const seatSpan = Math.max(...players.map(player => player.seat)) + 1;
  const distanceFromReference = (seat: number) =>
    (((seat - referenceSeat) % seatSpan) + seatSpan) % seatSpan;
  const orderedSeats = players
    .map(player => player.seat)
    .sort((a, b) => distanceFromReference(a) - distanceFromReference(b));

  return players.map(player => {
    const position = orderedSeats.indexOf(player.seat);
    const angleDeg = (position / count) * FULL_TURN_DEG;
    const angleRad = (angleDeg * Math.PI) / 180;

    return {
      player,
      betPosition: getBetPosition(angleDeg),
      x: centerX - Math.sin(angleRad) * radiusX,
      y: centerY + Math.cos(angleRad) * radiusY,
    };
  });
};
