import { http } from 'shared/api';

import type { JoinRoomResponse } from '../types';

export const roomApi = {
  join: (roomId: string) => http.get<JoinRoomResponse>(`/room/${roomId}/join`),
};
