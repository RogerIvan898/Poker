import {
  enqueueServerEvent,
  markGameQueueLive,
  resetEventQueue,
} from './event-queue';
import type { GameConnectParams } from './types';
import { createGameSocket, initializeAudio } from './utils';

let openSocket: WebSocket | null = null;

export const openGameSocket = async ({ wsUrl }: GameConnectParams) => {
  resetEventQueue();
  openSocket?.close();
  openSocket = null;
  await initializeAudio();
  const socket = createGameSocket(wsUrl, enqueueServerEvent);
  openSocket = socket;
  queueMicrotask(markGameQueueLive);
  return socket;
};

export const closeOpenGameSocket = (socket: WebSocket | null) => {
  openSocket = null;
  socket?.close();
};
