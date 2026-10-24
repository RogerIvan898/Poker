export type RoomMode = 'cash' | 'heads-up';

export interface RoomCardInfo {
  name: string;
  mode: RoomMode;
  blinds: string;
  players: number;
  max: number;
  minBuy: string;
}
