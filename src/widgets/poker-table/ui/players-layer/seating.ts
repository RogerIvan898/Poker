import type { BetPosition, PlayerType as Player } from 'entities/player';

function betPositionFromAngle(angleDeg: number): BetPosition {
  const a = ((angleDeg % 360) + 360) % 360;
  if (a > 315 || a <= 45) return 'bottom';
  if (a > 45 && a <= 135) return 'left';
  if (a > 135 && a <= 225) return 'top';
  return 'right';
}

export function computeSeats(
  players: Player[],
  viewerSeat: number | null,
  rect: { width: number; height: number }
) {
  const n = players.length;
  if (!n) return [];

  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const rx = rect.width * (rect.width < 380 ? 0.5 : 0.54);
  const ry = rect.height * (rect.width < 380 ? 0.46 : 0.48);

  const refSeat = viewerSeat ?? players[0].seat;

  return players.map(player => {
    const relSeat = (player.seat - refSeat + n) % n;
    const angleDeg = (180 + (relSeat / n) * 360) % 360;
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;

    const x = cx + Math.cos(angleRad) * rx;
    const y = cy + Math.sin(angleRad) * ry;

    return {
      player,
      betPosition: betPositionFromAngle(angleDeg),
      style: { left: `${x}px`, top: `${y}px` },
    };
  });
}
