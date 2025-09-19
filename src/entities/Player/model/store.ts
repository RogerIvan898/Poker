import { createStore } from "effector";

import type { Player } from "shared/types/player";
import { currentPlayerRecived } from "./events";
import type { Card } from "shared/types/card";

export const $currentPlayerId = createStore<string>('787');

export const $currentHand = createStore<Card[]>([]);
