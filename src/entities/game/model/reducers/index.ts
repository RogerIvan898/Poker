import type { Card } from 'shared/types/card';
import type { Player } from 'shared/types/player';

import type * as T from '../types';
import { buildPlayer, parseCard } from '../utils';

export const reducePlayerSeated = (
  state: T.GameState,
  payload: T.PlayerSeatedEvent['payload']
): T.GameState => ({
  ...state,
  players: {
    ...state.players,
    [payload.seatIndex]: buildPlayer(payload.player, payload.seatIndex),
  },
});

export const reduceHandStarted = (
  state: T.GameState,
  payload: T.HandStartedEvent['payload']
): T.GameState => {
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
};

export const reducePlayerActed = (
  state: T.GameState,
  payload: T.PlayerActedEvent['payload']
): T.GameState => ({
  ...state,
  players: {
    ...state.players,
    [payload.seat]: {
      ...state.players[payload.seat],
      stack: payload.stack,
      status: payload.status,
      committed: state.players[payload.seat].committed + (payload.amount ?? 0),
    },
  },
});

export const reduceTurnChanged = (
  state: T.GameState,
  payload: T.TurnChangedEvent['payload']
): T.GameState => ({
  ...state,
  activeSeat: payload.activeSeat,
});

export const reduceStreetConcluded = (
  state: T.GameState,
  payload: T.StreetConcludedEvent['payload']
): T.GameState => {
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
};

export const reduceBoardDealt = (
  state: T.GameState,
  payload: T.BoardDealtEvent['payload']
): T.GameState => ({
  ...state,
  round: payload.street,
  community: [
    ...state.community,
    ...payload.cards.map(card => parseCard(card)),
  ],
});

export const reduceShowdown = (
  state: T.GameState,
  payload: T.ShowdownEvent['payload']
): T.GameState => {
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
};

export const reduceHandCompleted = (
  state: T.GameState,
  payload: T.HandCompleteEvent['payload']
): T.GameState => {
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
};
