import { api } from 'shared/api';

import type { JoinRoomResponse } from '../model';

export const roomApi = {
  join: (roomId: string) => api.get<JoinRoomResponse>(`/room/${roomId}/join`),
};
