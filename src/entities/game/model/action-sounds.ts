import type { Event } from 'effector';

import { mapPlayerActedToSound } from '../lib/map-player-action-sound';
import { pokerSoundEngine } from '../lib/poker-sound-engine';

import { SERVER_EVENTS } from './constants';
import type { ServerGameEvent } from './types';

export const watchPlayerActionSounds = (events: Event<ServerGameEvent>) => {
  events.watch(event => {
    if (event.type !== SERVER_EVENTS.PLAYER_ACTED) {
      return;
    }

    void pokerSoundEngine.playAction(
      mapPlayerActedToSound(event.payload.action, event.payload.status)
    );
  });
};
