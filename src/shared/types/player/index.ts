import type { PLAYER_ACTIONS, PLAYER_STATUSES } from 'shared/constants/player';

import type { Card } from '../card';

export type PlayerActionType =
  (typeof PLAYER_ACTIONS)[keyof typeof PLAYER_ACTIONS];

type PlayerStatusType = (typeof PLAYER_STATUSES)[keyof typeof PLAYER_STATUSES];

export interface PlayerAction {
  type: PlayerActionType;
  playerId: string;
  amount?: number;
  serverSeq: number;
  timestamp: number;
}

export interface Player {
  id: string;
  name: string;
  stack: number;
  seat: number;
  status: PlayerStatusType;
  hand?: [Card | null, Card | null];
}

export interface SeatConfig {
  margin?: number;
  cardPosition?: 'top' | 'bottom' | 'left' | 'right';
  betPosition?: 'top' | 'bottom' | 'left' | 'right';
}
