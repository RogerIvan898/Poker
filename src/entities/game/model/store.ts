import { createEffect, createEvent, createStore, sample } from 'effector';

import { socket } from 'shared/lib/socketClient';
import type { PlayerAction } from 'shared/types/player';

import type { GameEvent, GameState } from '../types';

import { INITIAL_GAME_STATE } from './constants';
import type { PlayerInitActionPayload } from './types';

export const incomingEvent = createEvent<GameEvent>();

export const fold = createEvent<PlayerInitActionPayload>();
export const call = createEvent<PlayerInitActionPayload>();
export const check = createEvent<PlayerInitActionPayload>();
export const raise = createEvent<
  PlayerInitActionPayload & { amount: number }
>();

export const sendActionFx = createEffect(
  async (args: { action: string; payload?: unknown }) => {
    const msgId = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

    socket.emit('ACTION', {
      action: args.action,
      payload: args.payload,
      msgId,
    });

    return msgId;
  }
);

export const $gameState = createStore<GameState>(INITIAL_GAME_STATE)
  .on(incomingEvent, (state, evt) => {
    if (evt.type === 'SNAPSHOT') {
      return evt.state;
    }

    return state;
  })
  .on(incomingEvent, (state, evt) => {
    switch (evt.type) {
      case 'PLAYER_BET': {
        const { playerId, amount, serverSeq } = evt;
        const action: PlayerAction = {
          type: 'BET',
          playerId,
          amount,
          serverSeq: serverSeq ?? state.serverSeq + 1,
          timestamp: Date.now(),
        };

        return {
          ...state,
          serverSeq: Math.max(state.serverSeq, action.serverSeq),
          pot: state.pot + amount,
          currentBet: Math.max(state.currentBet, amount),
          actionHistory: [...state.actionHistory, action],
        };
      }
      case 'PLAYER_CHECK': {
        const { playerId, serverSeq } = evt;
        const action: PlayerAction = {
          type: 'CHECK',
          playerId,
          serverSeq,
          timestamp: Date.now(),
        };

        return {
          ...state,
          serverSeq: Math.max(
            state.serverSeq,
            serverSeq ?? state.serverSeq + 1
          ),
          actionHistory: [...state.actionHistory, action],
        };
      }
      case 'PLAYER_FOLD': {
        const { playerId, serverSeq } = evt;
        const action: PlayerAction = {
          type: 'FOLD',
          playerId,
          serverSeq,
          timestamp: Date.now(),
        };

        return {
          ...state,
          serverSeq: Math.max(
            state.serverSeq,
            serverSeq ?? state.serverSeq + 1
          ),
          actionHistory: [...state.actionHistory, action],
        };
      }
      case 'DEAL_PRIVATE': {
        const { playerId, cards } = evt;

        return {
          ...state,
          players: state.players.map(p =>
            p.id === playerId ? { ...p, hand: cards } : p
          ),
        };
      }
      case 'DEAL_COMMUNITY': {
        const { cards, serverSeq } = evt;

        return {
          ...state,
          serverSeq: Math.max(
            state.serverSeq,
            serverSeq ?? state.serverSeq + 1
          ),
          community: [...state.community, ...cards],
        };
      }
      case 'HAND_RESULT':
        return state;
      case 'ERROR':
        return state;
      default:
        return state;
    }
  });

export const $dealerSeatIndex = $gameState.map(state => state.dealerSeatIndex);
export const $players = $gameState.map(state => state.players);
export const $activeSeatIndex = $gameState.map(state => state.activeSeatIndex);

sample({
  clock: fold,
  fn: ({ playerId, serverSeq }) => ({
    action: 'PLAYER_FOLD',
    payload: { playerId },
    meta: { clientSeq: serverSeq },
  }),
  target: sendActionFx,
});

sample({
  clock: call,
  fn: ({ playerId, serverSeq }) => ({
    action: 'PLAYER_CALL',
    payload: { playerId },
    meta: { clientSeq: serverSeq },
  }),
  target: sendActionFx,
});

sample({
  clock: check,
  fn: ({ playerId, serverSeq }) => ({
    action: 'PLAYER_CHECK',
    payload: { playerId },
    meta: { clientSeq: serverSeq },
  }),
  target: sendActionFx,
});

sample({
  clock: raise,
  fn: ({ playerId, amount, serverSeq }) => ({
    action: 'PLAYER_RAISE',
    payload: { playerId, amount },
    meta: { clientSeq: serverSeq },
  }),
  target: sendActionFx,
});
