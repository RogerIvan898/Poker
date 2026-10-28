import type { PlayerAction } from 'entities/player';

export type PreAction = 'check' | 'check_fold' | 'call';

export type PreActionDecision = 'check' | 'fold' | 'call';

export interface PreActionOptions {
  canCheck: boolean;
  canCall: boolean;
}

export interface PlayerActionPayloadBase {
  playerId: string;
}

export interface PlayerActionPayloadAmount extends PlayerActionPayloadBase {
  amount: number;
}

interface PlayerFoldPayload {
  action: typeof PlayerAction.FOLD;
}

interface PlayerCallPayload {
  action: typeof PlayerAction.CALL;
}

interface PlayerBetPayload {
  action: typeof PlayerAction.BET;
  amount: number;
}

interface PlayerRaisePayload {
  action: typeof PlayerAction.RAISE;
  amount: number;
}

interface PlayerCheckPayload {
  action: typeof PlayerAction.CHECK;
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
