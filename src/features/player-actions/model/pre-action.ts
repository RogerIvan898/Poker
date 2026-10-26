import {
  createEffect,
  createEvent,
  createStore,
  merge,
  sample,
} from 'effector';

import { gameModel, SERVER_EVENTS } from 'entities/game';
import type { AllowedPlayerActionsEvent } from 'entities/game';

import { call, check, fold, raise } from './actions';

export type PreAction = 'check_fold' | 'call_any' | 'auto_fold';

export const setPreAction = createEvent<PreAction | null>();
export const clearPreAction = createEvent();

export const $preAction = createStore<PreAction | null>(null)
  .on(setPreAction, (_, action) => action)
  .reset(clearPreAction);

export const resolvePreAction = (
  preAction: PreAction,
  allowed: AllowedPlayerActionsEvent['payload']
) => {
  switch (preAction) {
    case 'check_fold':
      if (allowed.canCheck) {
        check();
      } else {
        fold();
      }
      return;

    case 'call_any':
      if (allowed.canCall) {
        call();
      } else if (allowed.canCheck) {
        check();
      } else {
        fold();
      }
      return;

    case 'auto_fold':
      if (allowed.canCall) {
        fold();
      } else if (allowed.canCheck) {
        check();
      } else {
        fold();
      }
      return;
  }
};

const runPreActionFx = createEffect(
  ({
    preAction,
    allowed,
  }: {
    preAction: PreAction;
    allowed: AllowedPlayerActionsEvent['payload'];
  }) => {
    resolvePreAction(preAction, allowed);
  }
);

sample({
  clock: gameModel.$myAllowedActions,
  source: $preAction,
  filter: (preAction, allowedActions) =>
    preAction !== null && allowedActions !== null,
  fn: (preAction, allowedActions) => ({
    preAction: preAction!,
    allowed: allowedActions!,
  }),
  target: runPreActionFx,
});

sample({
  clock: runPreActionFx.done,
  target: clearPreAction,
});

sample({
  clock: merge([fold, call, check, raise]),
  target: clearPreAction,
});

sample({
  clock: gameModel.incomingEvent,
  filter: event =>
    event.type === SERVER_EVENTS.HAND_STARTED ||
    event.type === SERVER_EVENTS.HAND_COMPLETED,
  target: clearPreAction,
});

sample({
  clock: gameModel.disconnectGame,
  target: clearPreAction,
});
