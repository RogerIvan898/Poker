import { createStore } from 'effector';

export const $viewerId = createStore<string | null>('100');
