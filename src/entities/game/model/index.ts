import { createEffect, createEvent, createStore, sample } from 'effector';

import type { Card } from 'shared/types/card';
import type { Player } from 'shared/types/player';
import { createSocket } from 'shared/utils/socket';

import { INITIAL_GAME_STATE, SERVER_EVENTS } from './constants';
import * as reducers from './reducers';
import type {
  AllowedPlayerActionsEvent,
  ClientGameEvent,
  GameConnectParams,
  GameState,
  ServerGameEvent,
} from './types';
import { isServerGameEvents, parseCard } from './utils';

export const incomingEvent = createEvent<ServerGameEvent>();

export const connectWebSocketFx = createEffect(
  ({ wsUrl, ticket }: GameConnectParams) => {
    const url = new URL(wsUrl);
    url.searchParams.set('ticket', ticket);

    return createSocket(url.toString(), {
      onMessage: data => {
        if (isServerGameEvents(data)) {
          incomingEvent(data);
        } else {
          console.warn('[WS] Recived non-game event:', data);
        }
      },
    });
  }
);

export const sendClientCommandFx = createEffect(
  ({ socket, command }: { socket: WebSocket | null; command: unknown }) => {
    if (!socket) {
      console.warn('[WS] Cannot send action: socket is disconnected');
      return;
    }

    socket.send(command);
  }
);

export const connectGame = createEvent<GameConnectParams>();
export const resetTable = createEvent();
export const sendClientCommand = createEvent<ClientGameEvent>();

export const $socketClient = createStore<WebSocket | null>(null);

export const $gameState = createStore<GameState>(INITIAL_GAME_STATE)
  .on(incomingEvent, (state, { type, payload }) => {
    switch (type) {
      case SERVER_EVENTS.PLAYER_SEATED:
        return reducers.reducePlayerSeated(state, payload);

      case SERVER_EVENTS.HAND_STARTED:
        return reducers.reduceHandStarted(state, payload);

      case SERVER_EVENTS.PLAYER_ACTED:
        return reducers.reducePlayerActed(state, payload);

      case SERVER_EVENTS.TURN_CHANGED:
        return reducers.reduceTurnChanged(state, payload);

      case SERVER_EVENTS.STREET_CONCLUDED:
        return reducers.reduceStreetConcluded(state, payload);

      case SERVER_EVENTS.BOARD_DEALT:
        return reducers.reduceBoardDealt(state, payload);

      case SERVER_EVENTS.SHOWDOWN:
        return reducers.reduceShowdown(state, payload);

      case SERVER_EVENTS.HAND_COMPLETED:
        return reducers.reduceHandCompleted(state, payload);
    }

    return state;
  })
  .reset(resetTable);

export const $myCards = createStore<Player['hand']>(null)
  .on(incomingEvent, (state, { type, payload }) => {
    if (type === SERVER_EVENTS.YOUR_CARDS) {
      return payload.cards.map(card => parseCard(card)) as [Card, Card];
    }

    if (
      type === SERVER_EVENTS.HAND_STARTED ||
      type === SERVER_EVENTS.HAND_COMPLETED
    ) {
      return null;
    }

    return state;
  })
  .reset(resetTable);

export const $myAllowedActions = createStore<
  AllowedPlayerActionsEvent['payload'] | null
>(null)
  .on(incomingEvent, (state, event) => {
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
  })
  .reset(resetTable);

export const $dealerSeat = $gameState.map(state => state.dealerSeat);
export const $players = $gameState.map(state => state.players);
export const $activeSeat = $gameState.map(state => state.activeSeat);

sample({
  clock: connectGame,
  target: connectWebSocketFx,
});

sample({
  clock: sendClientCommand,
  source: $socketClient,
  fn: (socket, command) => ({ socket, command }),
  target: sendClientCommandFx,
});
