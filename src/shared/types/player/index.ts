import type { Card } from "../card";

type PlayerStatus =
  | "SEATED" 
  | "SIT_OUT" 
  | "ACTIVE" 
  | "FOLDED" 
  | "ALL_IN" 
  | "BUSTED" 
  | "LEFT";

export interface PlayerAction {
  type: 'BET' | 'FOLD' | 'CALL' | 'CHECK' | 'RAISE';
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
  status: PlayerStatus;
  hand?: [Card | null, Card | null]
};

export interface SeatConfig {
  margin?: number;
  cardPosition?: 'top' | 'bottom' | 'left' | 'right';
}
