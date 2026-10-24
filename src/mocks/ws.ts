import { ws } from 'msw';

import { PokerTable } from './poker/table';
import { getMockRoom } from './rooms';

const roomSocket = ws.link('*/mock-ws/room/:roomId');

export const wsHandlers = [
  roomSocket.addEventListener('connection', ({ client, params }) => {
    const table = new PokerTable(client, getMockRoom(String(params.roomId)));

    client.addEventListener('message', event => {
      table.handleMessage(event.data);
    });
    client.addEventListener('close', () => {
      table.dispose();
    });

    table.start();
  }),
];
