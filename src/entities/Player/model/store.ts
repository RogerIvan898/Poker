import { createStore } from "effector";

import type { Player } from "shared/types/player";
import { currentPlayerRecived } from "./events";
import type { Card } from "shared/types/card";

export const $currentPlayerState = createStore<Player | null>({
    id: '100', name: 'Serg', stack: 1000, hand: [{rank:"A", suit:"hearts"}, {rank:"A", suit: "hearts"}]
}).on(currentPlayerRecived, (_, player) => player);

export const $currentHand = createStore<Card[]>([]);
