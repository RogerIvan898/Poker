export interface SeatConfig {
  angle: number;
  cardPosition: 'top' | 'bottom' | 'left' | 'right';
  betPosition: 'top' | 'bottom' | 'left' | 'right';
}

export const VISUAL_SEATS_CONFIG: Record<number, SeatConfig> = {
  0: {
    angle: 180,
    cardPosition: 'right',
    betPosition: 'top',
  },
  1: {
    angle: 235,
    cardPosition: 'right',
    betPosition: 'right',
  },
  2: {
    angle: 305,
    cardPosition: 'right',
    betPosition: 'right',
  },
  3: {
    angle: 0,
    cardPosition: 'right',
    betPosition: 'bottom',
  },
  4: {
    angle: 55,
    cardPosition: 'left',
    betPosition: 'left',
  },
  5: {
    angle: 125,
    cardPosition: 'left',
    betPosition: 'left',
  },
};
