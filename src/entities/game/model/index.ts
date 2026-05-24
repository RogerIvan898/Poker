import { createEffect, createEvent, createStore } from 'effector';

import { socket } from 'shared/api/socket';
import type { Card } from 'shared/types/card';
import type { Player } from 'shared/types/player';

import * as reducers from './reducers';
import { INITIAL_GAME_STATE, SERVER_EVENTS } from './constants';
import { parseCard } from './utils';
import type {
  AllowedPlayerActionsEvent,
  GameState,
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

export const $gameState = createStore<GameState>(INITIAL_GAME_STATE).on(
  incomingEvent,
  (state, { type, payload }) => {
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
