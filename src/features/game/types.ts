import type { Card } from "shared/types/card";

export type PlayerStatus =
  | "SEATED" 
  | "SIT_OUT" 
  | "ACTIVE" 
  | "FOLDED" 
  | "ALL_IN" 
  | "BUSTED" 
  | "LEFT";

export interface Player {
  id: string;
  name: string;
  chips: number;
  seat: number;
  status: PlayerStatus;
  hand?: [Card | null, Card | null]
};

export interface PlayerAction {
  type: 'BET' | 'FOLD' | 'CALL' | 'CHECK' | 'RAISE';
  playerId: string;
  amount?: number;
  serverSeq: number;
  timestamp: number;
}

export type Round =
  | 'PRE_FLOP'
  | 'FLOP'
  | 'TURN'
  | 'RIVER'
  | 'SHOWDOWN'
  | 'IDLE';

export interface GameState {
  tableId: string | null;
  players: Player[];
  dealerId: string | null;
  currentTurnId: string | null;
  round: Round;
  community: Card[];
  pot: number;
  serverSeq: number;
  actionHistory: PlayerAction[];
  bigBlind: number;
  minimumRaise: number;
  currentBet: number;
}












export type GameEvent =
  | { type: "SNAPSHOT"; state: GameState }
  | { type: "PLAYER_BET"; playerId: string; amount: number; serverSeq?: number }
  | { type: "PLAYER_CHECK"; playerId: string; serverSeq: number }
  | { type: "PLAYER_FOLD"; playerId: string; serverSeq?: number }
  | { type: "DEAL_PRIVATE"; playerId: string; cards: [Card, Card] }
  | { type: "DEAL_COMMUNITY"; cards: Card[]; serverSeq?: number }
  | { type: "HAND_RESULT"; winners: string[]; serverSeq?: number }
  | { type: "ERROR"; payload: any };







