import { createEffect, createEvent, createStore, sample } from 'effector';

import type { Card } from 'entities/card/model/types';
import type { Player } from 'entities/player/model/types';

import {
  mapPlayerActedToSound,
  pokerSoundEngine,
} from '../lib/poker-sound-engine';

import { INITIAL_GAME_STATE, SERVER_EVENTS } from './constants';
import * as reducers from './reducers';
import type {
  AllowedPlayerActionsEvent,
  ClientGameEvent,
  GameConnectParams,
  GameState,
  ServerGameEvent,
} from './types';
import { createGameSocket, initializeAudio, parseCard } from './utils';

export const incomingEvent = createEvent<ServerGameEvent>();

let openSocket: WebSocket | null = null;

export const initializeGameFx = createEffect(
  async ({ wsUrl }: GameConnectParams) => {
    openSocket?.close();
    openSocket = null;
    await initializeAudio();
    const socket = createGameSocket(wsUrl, incomingEvent);
    openSocket = socket;
    return socket;
  }
);

export const sendClientCommandFx = createEffect(
  ({ socket, command }: { socket: WebSocket | null; command: unknown }) => {
    if (!socket) {
      console.warn('[WS] Cannot send action: socket is disconnected');

      return;
    }

    socket.send(JSON.stringify(command));
  }
);

export const connectGame = createEvent<GameConnectParams>();
export const sendClientCommand = createEvent<ClientGameEvent>();
export const disconnectGame = createEvent();

export const $socketClient = createStore<WebSocket | null>(null)
  .on(initializeGameFx.doneData, (_, socket) => socket)
  .reset(disconnectGame);

export const $isGameLoading = initializeGameFx.pending;

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
  .reset(disconnectGame);

export const $debugHoles = createStore<Record<number, [Card, Card]>>({})
  .on(incomingEvent, (state, event) => {
    if (event.type === SERVER_EVENTS.DEBUG_HOLES) {
      return Object.entries(event.payload.hands).reduce(
        (hands, [seat, cards]) => {
          const [first, second] = cards;

          if (first && second) {
            hands[Number(seat)] = [parseCard(first), parseCard(second)];
          }

          return hands;
        },
        {} as Record<number, [Card, Card]>
      );
    }

    if (event.type === SERVER_EVENTS.HAND_STARTED) {
      return {};
    }

    return state;
  })
  .reset(disconnectGame);

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
  .reset(disconnectGame);

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
  .reset(disconnectGame);

export const $dealerSeat = $gameState.map(state => state.dealerSeat);
export const $players = $gameState.map(state => state.players);
export const $activeSeat = $gameState.map(state => state.activeSeat);

sample({
  clock: connectGame,
  target: initializeGameFx,
});

sample({
  clock: sendClientCommand,
  source: $socketClient,
  fn: (socket, command) => ({ socket, command }),
  target: sendClientCommandFx,
});

sample({
  clock: disconnectGame,
  source: $socketClient,
  fn: socket => {
    openSocket = null;
    socket?.close();
  },
});

incomingEvent.watch(event => {
  if (event.type !== SERVER_EVENTS.PLAYER_ACTED) {
    return;
  }

  const sound = mapPlayerActedToSound(
    event.payload.action,
    event.payload.status
  );

  void pokerSoundEngine.playAction(sound);
});
