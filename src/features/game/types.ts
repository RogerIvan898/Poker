import type { Card } from "shared/types/card";
import type { Player, PlayerAction } from "shared/types/player";

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
  bigBlindId: string | null;
  smallBlindId: string;
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
