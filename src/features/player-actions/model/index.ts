import { createEffect, createEvent, sample } from 'effector';

import { CLIENT_COMMANDS } from 'entities/game/model/constants';
import { PLAYER_ACTIONS } from 'shared/constants/player';
import { socket } from 'shared/api/socket';

import type {
  ClientPlayerEvent,
  PlayerActionPayloadAmount,
  PlayerActionPayloadBase,
} from './types';

export const sendActionFx = createEffect(
  ({ playerId, payload }: ClientPlayerEvent) =>
    socket.emit(CLIENT_COMMANDS.PLAYER_ACTION, { playerId, payload })
);

export const fold = createEvent<PlayerActionPayloadBase>();
export const call = createEvent<PlayerActionPayloadBase>();
export const check = createEvent<PlayerActionPayloadBase>();
export const raise = createEvent<PlayerActionPayloadAmount>();
export const bet = createEvent<PlayerActionPayloadAmount>();

sample({
  clock: fold,
  fn: ({ playerId }) => ({
    playerId,
    payload: {
      action: PLAYER_ACTIONS.FOLD,
    },
  }),
  target: sendActionFx,
});

sample({
  clock: call,
  fn: ({ playerId }) => ({
    payload: {
      action: PLAYER_ACTIONS.CALL,
    },
    playerId,
  }),
  target: sendActionFx,
});

sample({
  clock: raise,
  fn: ({ playerId, amount }) => ({
    payload: {
      action: PLAYER_ACTIONS.RAISE,
      amount,
    },
    playerId,
  }),
  target: sendActionFx,
});

sample({
  clock: bet,
  fn: ({ playerId, amount }) => ({
    payload: {
      action: PLAYER_ACTIONS.BET,
      amount,
    },
    playerId,
  }),
  target: sendActionFx,
});

sample({
  clock: check,
  fn: ({ playerId }) => ({
    payload: {
      action: PLAYER_ACTIONS.CHECK,
    },
    playerId,
  }),
  target: sendActionFx,
});
