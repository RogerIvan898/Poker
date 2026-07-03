import type { DirectionType } from 'shared/types/primitives';

/**
 * Вычисляет betPosition исходя из угла игрока на столе.
 * angle: 0° = верх, 90° = правый бок, 180° = низ, 270° = левый бок.
 * Бейдж ставки направлен в сторону центра стола.
 */
export function betPositionFromAngle(angleDeg: number): DirectionType {
  const a = ((angleDeg % 360) + 360) % 360;
  if (a > 315 || a <= 45) return 'bottom'; // игрок сверху → ставка вниз (к центру)
  if (a > 45 && a <= 135) return 'left'; // игрок справа  → ставка влево
  if (a > 135 && a <= 225) return 'top'; // игрок снизу   → ставка вверх
  return 'right'; // игрок слева   → ставка вправо
}

/**
 * Раскладывает n игроков равномерно по эллипсу.
 * Текущий игрок (viewerSeat) всегда оказывается снизу (angle 180°).
 */
export function computeSeats(
  players: { seat: number; id: string }[],
  viewerSeat: number | null,
  rect: { width: number; height: number }
) {
  const n = players.length;
  if (!n) return [];

  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const rx = rect.width * 0.52;
  const ry = rect.height * 0.46;

  // Находим минимальный seat, чтобы нумерация шла по порядку
  const refSeat = viewerSeat ?? players[0].seat;

  return players.map(player => {
    const relSeat = (player.seat - refSeat + n) % n;
    // Зритель (relSeat=0) → угол 180° (низ), остальные по часовой стрелке
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
