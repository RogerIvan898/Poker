import { createEvent, createStore, createEffect, sample } from 'effector';

import type { ConnectParams, WSMessage } from 'shared/types/socket';

const DEFAULT_WS_URL = 'ws://localhost:8080/ws';

export const wsConnect = createEvent<ConnectParams>();
export const wsDisconnect = createEvent();
export const wsSendMessage = createEvent<WSMessage>();

export const $wsStatus = createStore<
  'disconnected' | 'connecting' | 'connected' | 'error'
>('disconnected');

export const wsMessageReceived = createEvent<WSMessage>();
export const wsErrorOccurred = createEvent<Event>();

const $socket = createStore<WebSocket | null>(null, { serialize: 'ignore' });

const buildWsUrl = ({ playerId, baseUrl = DEFAULT_WS_URL }: ConnectParams) => {
  const url = new URL(baseUrl);
  url.searchParams.set('playerId', playerId);
  return url.toString();
};

const connectFx = createEffect(
  (url: string) =>
    new Promise<WebSocket>((resolve, reject) => {
      const socket = new WebSocket(url);

      socket.onopen = () => resolve(socket);
      socket.onerror = () => {
        reject(new Error(`Failed to connect to WebSocket: ${url}`));
      };
    })
);

const sendFx = createEffect(
  ({ socket, message }: { socket: WebSocket | null; message: WSMessage }) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
      return;
    }

    console.warn('WebSocket не подключен. Сообщение не отправлено:', message);
  }
);

sample({
  clock: wsConnect,
  fn: buildWsUrl,
  target: connectFx,
});

$wsStatus.on(connectFx, () => 'connecting');

sample({
  clock: connectFx.doneData,
  target: $socket,
});

$wsStatus.on(connectFx.doneData, () => 'connected');
$wsStatus.on(connectFx.fail, () => 'error');
$wsStatus.on(wsErrorOccurred, () => 'error');

connectFx.doneData.watch(socket => {
  socket.onmessage = event => {
    try {
      const data = JSON.parse(event.data) as WSMessage;
      wsMessageReceived(data);
    } catch {
      console.error('Ошибка парсинга WS сообщения:', event.data);
    }
  };

  socket.onerror = error => wsErrorOccurred(error);
  socket.onclose = () => wsDisconnect();
});

sample({
  clock: wsDisconnect,
  source: $socket,
  fn: socket => {
    if (socket) {
      socket.onclose = null;
      socket.close();
    }

    return null;
  },
  target: $socket,
});

$wsStatus.on(wsDisconnect, () => 'disconnected');

sample({
  clock: wsSendMessage,
  source: $socket,
  fn: (socket, message) => ({ socket, message }),
  target: sendFx,
});
