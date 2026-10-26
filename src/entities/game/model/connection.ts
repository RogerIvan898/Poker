import type { GameConnectParams, ServerGameEvent } from './types';
import { createGameSocket, initializeAudio } from './utils';

let openSocket: WebSocket | null = null;

export const openGameSocket = async (
  { wsUrl }: GameConnectParams,
  onEvent: (event: ServerGameEvent) => void
) => {
  openSocket?.close();
  openSocket = null;
  await initializeAudio();
  const socket = createGameSocket(wsUrl, onEvent);
  openSocket = socket;
  return socket;
};

export const closeOpenGameSocket = (socket: WebSocket | null) => {
  openSocket = null;
  socket?.close();
};
