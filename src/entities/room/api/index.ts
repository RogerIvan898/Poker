import { api } from 'shared/api/axios';

import type { JoinRoomResponse } from '../types';

export const roomApi = {
  join: (roomId: string) =>
    api.get<JoinRoomResponse>(`/room/${roomId}/join`).then(res => res.data),
};
