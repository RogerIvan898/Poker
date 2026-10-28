import { api } from 'shared/api';

import type { JoinRoomResponse } from '../types';

export const roomApi = {
  join: (roomId: string) => api.get<JoinRoomResponse>(`/room/${roomId}/join`),
};
