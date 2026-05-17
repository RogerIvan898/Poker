import { PLAYER_STATUSES } from 'shared/constants/player';

import type { GameState } from '../../types';

export const INITIAL_GAME_STATE: GameState = {
  tableId: null,
  players: [
    {
      id: '787',
      name: 'You',
      stack: 12.5,
      status: PLAYER_STATUSES.IN_GAME,
      hand: [
        { rank: 'A', suit: 'hearts' },
        { rank: 'K', suit: 'hearts' },
      ],
      seat: 6,
    },
    {
      id: '2',
      name: 'Anna',
      stack: 2.4,
      status: PLAYER_STATUSES.IN_GAME,
      hand: [
        { rank: '10', suit: 'hearts' },
        { rank: '6', suit: 'clubs' },
      ],
      seat: 7,
    },
    {
      id: '3',
      name: 'Mark',
      stack: 32,
      status: PLAYER_STATUSES.IN_GAME,
      hand: [
        { rank: 'J', suit: 'clubs' },
        { rank: 'A', suit: 'diamonds' },
      ],
      seat: 8,
    },
    {
      id: '4',
      name: 'Luca',
      stack: 98,
      status: PLAYER_STATUSES.SITTING_OUT,
      hand: [
        { rank: 'A', suit: 'spades' },
        { rank: 'A', suit: 'clubs' },
      ],
      seat: 5,
    },
    {
      id: '100',
      name: 'Serg',
      stack: 4.1,
      status: PLAYER_STATUSES.IN_GAME,
      hand: [
        { rank: '7', suit: 'clubs' },
        { rank: '10', suit: 'diamonds' },
      ],
      seat: 4,
    },
    {
      id: '6',
      name: 'Priya',
      stack: 17,
      status: PLAYER_STATUSES.FOLDED,
      hand: [
        { rank: '9', suit: 'hearts' },
        { rank: '5', suit: 'clubs' },
      ],
      seat: 3,
    },
  ],
  dealerSeatIndex: 3,
  activeSeatIndex: 6,
  round: 'IDLE',
  community: [],
  pot: 0,
  serverSeq: 0,
  actionHistory: [],
  bigBlind: 0,
  smallBlindSeatIndex: 4,
  bigBlindSeatIndex: 5,
  minimumRaise: 0,
  currentBet: 0,
};
