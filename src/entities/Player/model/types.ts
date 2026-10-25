import type { Card } from 'entities/card/model/types';

import type { PlayerAction, PlayerStatus } from './constants';

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
  lastAction: PlayerActionType | null;
  lastActionAmount: number | null;
}
