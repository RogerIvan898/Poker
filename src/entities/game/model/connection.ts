import { getAudioContext, preloadSounds } from 'shared/lib/audio';
import { createSocket } from 'shared/lib/websocket';

import { pokerSoundEngine } from '../lib';

import { GAME_SOUNDS } from './constants';
import {
  enqueueServerEvent,
  markGameQueueLive,
  resetEventQueue,
} from './event-queue';
import type { GameConnectParams, ServerGameEvent } from './types';

let openSocket: WebSocket | null = null;

const isServerGameEvent = (data: unknown): data is ServerGameEvent =>
  typeof data === 'object' && data !== null && 'type' in data;

const initializeAudio = async () => {
  const audioContext = getAudioContext();
  pokerSoundEngine.init(audioContext);

  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  return preloadSounds(GAME_SOUNDS);
};

const createGameSocket = (wsUrl: string) =>
  createSocket(wsUrl, {
    onMessage: data => {
      if (isServerGameEvent(data)) {
        enqueueServerEvent(data);
      } else {
        console.warn('[WS] Received non-game event:', data);
      }
    },
  });

export const openGameSocket = async ({ wsUrl }: GameConnectParams) => {
  resetEventQueue();
  openSocket?.close();
  openSocket = null;
  await initializeAudio();
  const socket = createGameSocket(wsUrl);
  openSocket = socket;
  queueMicrotask(markGameQueueLive);
  return socket;
};

export const closeOpenGameSocket = (socket: WebSocket | null) => {
  openSocket = null;
  socket?.close();
};
