import { createEffect, createEvent, createStore, sample } from "effector";

import { socket } from "shared/lib/socketClient";
import type { GameEvent, GameState, PlayerAction } from "../types";
import type { PlayerInitActionPayload } from "./types";

export const incomingEvent = createEvent<GameEvent>();

export const foldClicked = createEvent<PlayerInitActionPayload>();
export const callClicked = createEvent<PlayerInitActionPayload>();
export const checkClicked = createEvent<PlayerInitActionPayload>();
export const raiseClicked = createEvent<PlayerInitActionPayload & { amount: number }>();

export const sendActionFx = createEffect(async (args: { action: string; payload?: any }) => {
  const msgId = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  socket.emit("ACTION", { action: args.action, payload: args.payload, msgId });
  
  return msgId;
});

const initialState: GameState = {
  tableId: null,
  players: [
    { id: '1', name: 'You', chips: 1250, status: 'ACTIVE' },
    { id: '2', name: 'Anna', chips: 2400, status: 'FOLDED'},
    { id: '3', name: 'Mark', chips: 3200, status: 'SEATED', isDealer: false },
    { id: '4', name: 'Luca', chips: 680, status: 'SEATED', isDealer: false },
    { id: '100', name: 'Serg', chips: 4100, status: 'SEATED', isDealer: true },
    { id: '6', name: 'Priya', chips: 1750, status: 'SEATED', isDealer: false },
    { id: '90', name: 'Lucaй', chips: 680, status: 'SEATED', isDealer: false },
    { id: '89', name: 'Sergй', chips: 4100, status: 'SEATED', isDealer: true },
    { id: '09', name: 'Priyaq', chips: 1750, status: 'SEATED', isDealer: false },
  ],
  dealerId: null,
  currentTurnId: null,
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
  clock: foldClicked,
  fn: ({ playerId, serverSeq }) => ({ action: "PLAYER_FOLD", payload: { playerId }, meta: { clientSeq: serverSeq } }),
  target: sendActionFx,
});

sample({
  clock: callClicked,
  fn: ({ playerId, serverSeq }) => ({ action: "PLAYER_CALL", payload: { playerId }, meta: { clientSeq: serverSeq } }),
  target: sendActionFx,
});

sample({
  clock: checkClicked,
  fn: ({ playerId, serverSeq }) => ({ action: "PLAYER_CHECK", payload: { playerId }, meta: { clientSeq: serverSeq } }),
  target: sendActionFx,
});

sample({
  clock: raiseClicked,
  fn: ({ playerId, amount, serverSeq }) => ({ action: "PLAYER_RAISE", payload: { playerId, amount }, meta: { clientSeq: serverSeq } }),
  target: sendActionFx,
});
