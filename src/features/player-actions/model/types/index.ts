import type { PLAYER_ACTIONS } from 'shared/constants/player';

export interface PlayerActionPayloadBase {
  playerId: string;
}

export interface PlayerActionPayloadAmount extends PlayerActionPayloadBase {
  amount: number;
}

interface PlayerFoldPayload {
  action: typeof PLAYER_ACTIONS.FOLD;
}

interface PlayerCallPayload {
  action: typeof PLAYER_ACTIONS.CALL;
}

interface PlayerBetPayload {
  action: typeof PLAYER_ACTIONS.BET;
  amount: number;
}

interface PlayerRaisePayload {
  action: typeof PLAYER_ACTIONS.RAISE;
  amount: number;
}

interface PlayerCheckPayload {
  action: typeof PLAYER_ACTIONS.CHECK;
}

export type ClientPlayerActionPayload =
  | PlayerFoldPayload
  | PlayerCallPayload
  | PlayerBetPayload
  | PlayerRaisePayload
  | PlayerCheckPayload;

export interface ClientPlayerEvent {
  playerId: string;
  payload: ClientPlayerActionPayload;
}
