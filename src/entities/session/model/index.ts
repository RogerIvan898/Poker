import { createEvent, createStore } from 'effector';

import type { Card } from 'shared/types/card';

export const sessionStarted = createEvent<{ id: string }>();
export const handDealt = createEvent<[Card, Card]>();
export const handFolded = createEvent();

export const $viewerId = createStore<string | null>(null).on(
  sessionStarted,
  (_, { id }) => id
);

export const $privateHand = createStore<[Card, Card] | null>(null)
  .on(handDealt, (_, cards) => cards)
  .reset(handFolded);
