import { createEffect, createEvent, createStore } from 'effector';

import { socket } from 'shared/api/socket';
import type { Card } from 'shared/types/card';
import type { Player } from 'shared/types/player';

import { INITIAL_GAME_STATE, SERVER_EVENTS } from './constants';
import { parseCard } from './utils';
import type {
  AllowedPlayerActionsEvent,
  GameState,
  PlayerInfo,
  ServerGameEvent,
} from './types';

export const subscribeToGameSocketFx = createEffect(() =>
  socket.on('message', (payload: ServerGameEvent) => {
    incomingEvent(payload);
  })
);

export const unsubscribeFromGameSocketFx = createEffect(() =>
  socket.off('message')
);

export const incomingEvent = createEvent<ServerGameEvent>();

// const connectToTableFx = createEffect(gameApi.connectToTable);

// const disconnectFromTableFx = createEffect((tableId: string) => {
//   socket.emit(CLIENT_COMMANDS.LEAVE_TABLE, { tableId });

//   socket.disconnect();
// });

const buildPlayer = (playerInfo: PlayerInfo, seat: number): Player => ({
  id: playerInfo.id,
  name: playerInfo.name,
  stack: playerInfo.stack,
  seat,
  status: playerInfo.status,
  committed: 0,
  hand: null,
});

export const $gameState = createStore<GameState>(INITIAL_GAME_STATE).on(
  incomingEvent,
  (state, { type, payload }) => {
    switch (type) {
      case SERVER_EVENTS.PLAYER_SEATED:
        return {
          ...state,
          players: {
            ...state.players,
            [payload.seatIndex]: buildPlayer(payload.player, payload.seatIndex),
          },
        };

      case SERVER_EVENTS.HAND_STARTED: {
        const { smallBlindSeat, bigBlindSeat, initialBets } = payload;

        const resetPlayers = Object.keys(state.players).reduce(
          (acc, key) => {
            acc[key] = {
              ...state.players[key],
              committed: initialBets[Number(key)] || 0,
              hand: null,
            };
            return acc;
          },
          {} as Record<string, Player>
        );

        return {
          ...state,
          community: payload.community.map(card => parseCard(card)),
          dealerSeat: payload.dealerSeat,
          bigBlindSeat: bigBlindSeat,
          smallBlindSeat: smallBlindSeat,
          smallBlind: initialBets[smallBlindSeat] || 0,
          bigBlind: initialBets[bigBlindSeat] || 0,
          players: resetPlayers,
          pot: 0,
          currentBet: initialBets[bigBlindSeat] || 0,
          actionHistory: [],
        };
      }

      case SERVER_EVENTS.PLAYER_ACTED:
        return {
          ...state,
          players: {
            ...state.players,
            [payload.seat]: {
              ...state.players[payload.seat],
              stack: payload.stack,
              status: payload.status,
              committed:
                state.players[payload.seat].committed + (payload.amount ?? 0),
            },
          },
        };

      case SERVER_EVENTS.TURN_CHANGED:
        return {
          ...state,
          activeSeat: payload.activeSeat,
        };

      case SERVER_EVENTS.STREET_CONCLUDED: {
        const clearedPlayers = Object.keys(state.players).reduce(
          (acc, key) => {
            acc[key] = { ...state.players[key], committed: 0 };

            return acc;
          },
          {} as Record<string, Player>
        );

        const totalSidePots = payload.sidePots.reduce(
          (sum, sp) => sum + sp.amount,
          0
        );

        return {
          ...state,
          players: clearedPlayers,
          pot: payload.main + totalSidePots,
          currentBet: 0,
        };
      }

      case SERVER_EVENTS.BOARD_DEALT:
        return {
          ...state,
          round: payload.street,
          community: [
            ...state.community,
            ...payload.cards.map(card => parseCard(card)),
          ],
        };

      case SERVER_EVENTS.SHOWDOWN: {
        const revealedPlayers = { ...state.players };

        Object.entries(payload.revealedHands).forEach(([seat, cards]) => {
          if (revealedPlayers[seat]) {
            revealedPlayers[seat] = {
              ...revealedPlayers[seat],
              hand: cards.map(card => parseCard(card)) as [Card, Card],
            };
          }
        });

        return {
          ...state,
          players: revealedPlayers,
        };
      }

      case SERVER_EVENTS.HAND_COMPLETED: {
        const updatedPlayers = { ...state.players };

        payload.winners.forEach(winner => {
          if (updatedPlayers[winner.seatIndex]) {
            updatedPlayers[winner.seatIndex] = {
              ...updatedPlayers[winner.seatIndex],
              stack: updatedPlayers[winner.seatIndex].stack + winner.amountWon,
            };
          }
        });

        return {
          ...state,
          players: updatedPlayers,
          activeSeat: null,
        };
      }
    }

    return state;
  }
);

export const $myCards = createStore<Player['hand']>(null).on(
  incomingEvent,
  (state, { type, payload }) => {
    if (type === SERVER_EVENTS.YOUR_CARDS) {
      return payload.cards.map(card => parseCard(card)) as [Card, Card];
    }

    return state;
  }
);

export const $myAllowedActions = createStore<
  AllowedPlayerActionsEvent['payload'] | null
>(null).on(incomingEvent, (state, event) => {
  if (event.type === SERVER_EVENTS.ALLOWED_ACTIONS) {
    return event.payload;
  }

  if (
    event.type === SERVER_EVENTS.PLAYER_ACTED ||
    event.type === SERVER_EVENTS.STREET_CONCLUDED
  ) {
    return null;
  }

  return state;
});

export const $dealerSeat = $gameState.map(state => state.dealerSeat);
export const $players = $gameState.map(state => state.players);
export const $activeSeat = $gameState.map(state => state.activeSeat);
