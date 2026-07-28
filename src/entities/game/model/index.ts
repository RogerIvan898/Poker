import { createEvent, createStore } from 'effector';

import type { Card } from 'shared/types/card';
import type { Player } from 'shared/types/player';

import { INITIAL_GAME_STATE, SERVER_EVENTS } from './constants';
import * as reducers from './reducers';
import type {
  AllowedPlayerActionsEvent,
  GameState,
  ServerGameEvent,
} from './types';
import { parseCard } from './utils';

export const incomingEvent = createEvent<ServerGameEvent>();
export const joinTable = createEvent();

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

    if (
      type === SERVER_EVENTS.HAND_STARTED ||
      type === SERVER_EVENTS.HAND_COMPLETED
    ) {
      return null;
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
