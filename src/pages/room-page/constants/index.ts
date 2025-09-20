import type { SeatConfig } from "shared/types/player";

export const playerSeatsConfig: Record<string, SeatConfig> = {
    0: {
        margin: 18,
        cardPosition: 'right',
        betPosition: 'top',
    },
    1: {
        margin: 32,
        cardPosition: 'left',
        betPosition: 'top',
    },
    2: {
        margin: 14,
        cardPosition: 'left',
        betPosition: 'right',
    },
    3: {
        margin: 32,
        cardPosition: 'left',
        betPosition: 'right',
    },
    4: {
        margin: 22,
        cardPosition: 'left',
        betPosition: 'bottom',
    },
    5: {
        margin: 22,
        cardPosition: 'right',
        betPosition: 'bottom'
    },
    6: {
        margin: 32,
        cardPosition: 'right',
        betPosition: 'left'
    },
    7: {
        margin: 12,
        cardPosition: 'right',
        betPosition: 'left'
    },
    8: {
        margin: 32,
        cardPosition: 'right',
        betPosition: 'top',
    }      
}