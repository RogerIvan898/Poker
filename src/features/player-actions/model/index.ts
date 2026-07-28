import { createEvent, sample } from 'effector';

import { CLIENT_COMMANDS } from 'entities/game/model/constants';

import { wsSendMessage } from 'shared/api/socket';
import { PLAYER_ACTIONS } from 'shared/constants/player';

import type {
  ClientPlayerEvent,
  PlayerActionPayloadAmount,
  PlayerActionPayloadBase,
} from './types';

export const fold = createEvent<PlayerActionPayloadBase>();
export const call = createEvent<PlayerActionPayloadBase>();
export const check = createEvent<PlayerActionPayloadBase>();
export const raise = createEvent<PlayerActionPayloadAmount>();

const toPlayerActionMessage = ({ playerId, payload }: ClientPlayerEvent) => ({
  type: CLIENT_COMMANDS.PLAYER_ACTION,
  payload: { playerId, payload },
});

sample({
  clock: fold,
  fn: ({ playerId }) =>
    toPlayerActionMessage({
      playerId,
      payload: { action: PLAYER_ACTIONS.FOLD },
    }),
  target: wsSendMessage,
});

sample({
  clock: call,
  fn: ({ playerId }) =>
    toPlayerActionMessage({
      playerId,
      payload: { action: PLAYER_ACTIONS.CALL },
    }),
  target: wsSendMessage,
});

sample({
  clock: raise,
  fn: ({ playerId, amount }) =>
    toPlayerActionMessage({
      playerId,
      payload: { action: PLAYER_ACTIONS.RAISE, amount },
    }),
  target: wsSendMessage,
});

sample({
  clock: check,
  fn: ({ playerId }) =>
    toPlayerActionMessage({
      playerId,
      payload: { action: PLAYER_ACTIONS.CHECK },
    }),
  target: wsSendMessage,
});
