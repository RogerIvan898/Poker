import { createEvent } from "effector";
import type { Player, PlayerAction } from "shared/types/player";

export const playerConnected = createEvent<Player>();
export const playersUpdated = createEvent<Player[]>();
export const currentPlayerRecived = createEvent<Player>();
export const playerActionRecived = createEvent<PlayerAction>();

