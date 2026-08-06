export interface JoinRoomResponse {
  wsUrl: string;
  ticket: string;
  expiresIn: number;
}

export type RoomJoinData = Pick<JoinRoomResponse, 'wsUrl' | 'ticket'>;
