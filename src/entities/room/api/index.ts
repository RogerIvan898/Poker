import { http } from 'shared/api/http';

import type { JoinRoomResponse } from '../types';

export const roomApi = {
  join: (roomId: string) => http.get<JoinRoomResponse>(`/room/${roomId}/join`),
};
