import { CardSuit } from 'shared/constants/cards';
import { Sound } from 'shared/constants/sound';

import type { GameState } from '../types';

export const INITIAL_GAME_STATE: GameState = {
  tableId: null,
  players: {},
  dealerSeat: null,
  activeSeat: null,
  round: 'IDLE',
  community: [],
  pot: 0,
  serverSeq: 0,
  actionHistory: [],
  bigBlind: 0,
  smallBlind: 0,
  smallBlindSeat: null,
  bigBlindSeat: null,
  minimumRaise: 0,
  currentBet: 0,
};

export const SERVER_EVENTS = {
  HAND_STARTED: 'EV_HAND_STARTED',
  PLAYER_SEATED: 'EV_PLAYER_SEATED',
  TURN_CHANGED: 'EV_TURN_CHANGED',
  STREET_CONCLUDED: 'EV_STREET_CONCLUDED',
  PLAYER_ACTED: 'EV_PLAYER_ACTED',
  YOUR_CARDS: 'EV_YOUR_CARDS',
  ALLOWED_ACTIONS: 'EV_ALLOWED_ACTIONS',
  BOARD_DEALT: 'EV_BOARD_DEALT',
  SHOWDOWN: 'EV_SHOWDOWN',
  HAND_COMPLETED: 'EV_HAND_COMPLETED',
} as const;

export const CLIENT_COMMANDS = {
  PLAYER_ACTION: 'CMD_PLAYER_ACTION',
} as const;

export const GAME_SOUNDS = [
  Sound.CARD_DEAL,
  Sound.CHECK,
  Sound.TIME_BANK,
  Sound.CHIPS,
  Sound.TURN,
];

export const SuitMap = {
  h: CardSuit.HEARTS,
  d: CardSuit.DIAMONDS,
  c: CardSuit.CLUBS,
  s: CardSuit.SPADES,
} as const;
