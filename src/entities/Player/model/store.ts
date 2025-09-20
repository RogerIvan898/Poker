import { createStore } from "effector";

import type { Card } from "shared/types/card";

export const $currentPlayerId = createStore<string>('787');

export const $currentHand = createStore<Card[]>([]);
