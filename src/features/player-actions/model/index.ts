import { createEvent, merge, sample } from 'effector';

import { gameModel } from 'entities/game';
import { CLIENT_COMMANDS } from 'entities/game/model/constants';
import { sessionModel } from 'entities/session';

import { PlayerAction } from 'shared/constants/player';

import type { PlayerActionPayloadAmount } from './types';

export const fold = createEvent();
export const call = createEvent();
export const check = createEvent();
export const raise = createEvent<PlayerActionPayloadAmount>();

const action = (type: string, amount?: number) => ({
  action: type,
  ...(amount && { amount }),
});

const simpleActionTriggered = merge([
  fold.map(() => action(PlayerAction.FOLD)),
  call.map(() => action(PlayerAction.CALL)),
  check.map(() => action(PlayerAction.CHECK)),
]);

const raiseActionTriggered = raise.map(({ amount }) =>
  action(PlayerAction.RAISE, amount)
);

const playerAction = merge([simpleActionTriggered, raiseActionTriggered]);

sample({
  clock: playerAction,
  source: sessionModel.$currentUserId,
  filter: (playerId): playerId is string => Boolean(playerId),
  fn: (playerId, payload) => ({
    type: CLIENT_COMMANDS.PLAYER_ACTION,
    payload: { playerId, payload },
  }),
  target: gameModel.sendClientCommand,
});
