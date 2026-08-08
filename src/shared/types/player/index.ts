import type { PlayerAction, PlayerStatus } from 'shared/constants/player';

import type { Card } from '../card';

export type PlayerActionType = (typeof PlayerAction)[keyof typeof PlayerAction];

export type PlayerStatusType = (typeof PlayerStatus)[keyof typeof PlayerStatus];

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
  hand: [Card, Card] | null;
  committed: number;
}
