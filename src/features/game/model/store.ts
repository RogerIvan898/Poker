import { createEffect, createEvent, createStore, sample } from "effector";

import { socket } from "shared/lib/socketClient";
import type { PlayerAction } from "shared/types/player";
import type { GameEvent, GameState } from "../types";
import type { PlayerInitActionPayload } from "./types";

export const incomingEvent = createEvent<GameEvent>();

export const fold = createEvent<PlayerInitActionPayload>();
export const call = createEvent<PlayerInitActionPayload>();
export const check = createEvent<PlayerInitActionPayload>();
export const raise = createEvent<PlayerInitActionPayload & { amount: number }>();

export const sendActionFx = createEffect(async (args: { action: string; payload?: any }) => {
  const msgId = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

  socket.emit("ACTION", { action: args.action, payload: args.payload, msgId });
  
  return msgId;
});

const initialState: GameState = {
  tableId: null,
  players: [
    { id: '787', name: 'You', stack: 12.5, status: 'ACTIVE', hand: [{rank: 'A', suit: 'hearts'}, {rank: 'A', suit: 'hearts'}]},
    { id: '2', name: 'Anna', stack: 2.4, status: 'SEATED', hand:[null, null]},
    { id: '3', name: 'Mark', stack: 32, status: 'SEATED', hand:[null, null] },
    { id: '4', name: 'Luca', stack: 98, status: 'SIT_OUT', hand:[null, null] },
    { id: '100', name: 'Serg', stack: 4.1, status: 'SEATED', hand:[null, null] },
    { id: '6', name: 'Priya', stack: 17, status: 'SEATED', hand:[null, null] },
    { id: '90', name: 'Lucaй', stack: 6.8, status: 'SEATED', hand:[null, null] },
    { id: '89', name: 'Sergй', stack: 41, status: 'SEATED', hand:[null, null] },
    { id: '09', name: 'Priyaq', stack: 17, status: 'FOLDED', hand:[null, null] },
  ],
  dealerId: '100',
  currentTurnId: '787',
  round: "IDLE",
  community: [],
  pot: 0,
  serverSeq: 0,
  actionHistory: [],
  bigBlind: 0,
  minimumRaise: 0,
  currentBet: 0,
};

export const $gameState = createStore<GameState>(initialState)
  .on(incomingEvent, (state, evt) => {
    if (evt.type === "SNAPSHOT") {
      return evt.state;
    }
    
    return state;
  })
  .on(incomingEvent, (state, evt) => {
    switch (evt.type) {
      case "PLAYER_BET": {
        const { playerId, amount, serverSeq } = evt;
        const action: PlayerAction = { type: "BET", playerId, amount, serverSeq: serverSeq ?? state.serverSeq + 1, timestamp: Date.now() };

        return { ...state, serverSeq: Math.max(state.serverSeq, action.serverSeq), pot: state.pot + amount, currentBet: Math.max(state.currentBet, amount), actionHistory: [...state.actionHistory, action] };
      }
      case "PLAYER_CHECK": {
        const { playerId, serverSeq } = evt;
        const action: PlayerAction = { type: "CHECK", playerId, serverSeq, timestamp: Date.now() };

        return { ...state, serverSeq: Math.max(state.serverSeq, serverSeq ?? state.serverSeq + 1), actionHistory: [...state.actionHistory, action] };
      }
      case "PLAYER_FOLD": {
        const { playerId, serverSeq } = evt;
        const action: PlayerAction = { type: "FOLD", playerId, serverSeq, timestamp: Date.now() };
        
        return { ...state, serverSeq: Math.max(state.serverSeq, serverSeq ?? state.serverSeq + 1), actionHistory: [...state.actionHistory, action] };
      }
      case "DEAL_PRIVATE": {
        const { playerId, cards } = evt;

        return { ...state, players: state.players.map(p => p.id === playerId ? { ...p, hand: cards } : p) };
      }
      case "DEAL_COMMUNITY": {
        const { cards, serverSeq } = evt;

        return { ...state, serverSeq: Math.max(state.serverSeq, serverSeq ?? state.serverSeq + 1), community: [...state.community, ...cards] };
      }
      case "HAND_RESULT": return state;
      case "ERROR": return state;
      default: return state;
    }
  });

  sample({
  clock: fold,
  fn: ({ playerId, serverSeq }) => ({ action: "PLAYER_FOLD", payload: { playerId }, meta: { clientSeq: serverSeq } }),
  target: sendActionFx,
});

sample({
  clock: call,
  fn: ({ playerId, serverSeq }) => ({ action: "PLAYER_CALL", payload: { playerId }, meta: { clientSeq: serverSeq } }),
  target: sendActionFx,
});

sample({
  clock: check,
  fn: ({ playerId, serverSeq }) => ({ action: "PLAYER_CHECK", payload: { playerId }, meta: { clientSeq: serverSeq } }),
  target: sendActionFx,
});

sample({
  clock: raise,
  fn: ({ playerId, amount, serverSeq }) => ({ action: "PLAYER_RAISE", payload: { playerId, amount }, meta: { clientSeq: serverSeq } }),
  target: sendActionFx,
});
