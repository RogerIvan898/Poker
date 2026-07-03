import { createEvent, createStore } from 'effector';

export type AppScreen = 'menu' | 'room';

export const playRoomClicked = createEvent<number>();
export const navigateToMenu = createEvent();

export const $screen = createStore<AppScreen>('menu')
  .on(playRoomClicked, () => 'room')
  .on(navigateToMenu, () => 'menu');

export const $activeRoomId = createStore<number | null>(null)
  .on(playRoomClicked, (_, roomId) => roomId)
  .reset(navigateToMenu);
