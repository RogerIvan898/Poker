import { sample } from 'effector';
import { createGate } from 'effector-react';

import {
  subscribeToGameSocketFx,
  unsubscribeFromGameSocketFx,
} from 'entities/game/model';

export const TablePageGate = createGate();

sample({
  clock: TablePageGate.open,
  target: subscribeToGameSocketFx,
});

sample({
  clock: TablePageGate.close,
  target: unsubscribeFromGameSocketFx,
});
