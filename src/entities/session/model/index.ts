import { createEvent, createStore } from 'effector';

export const sessionStarted = createEvent<{ id: string }>();

export const $viewerId = createStore<string | null>('100').on(
  sessionStarted,
  (_, { id }) => id
);
