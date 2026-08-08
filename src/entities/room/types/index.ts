export interface JoinRoomResponse {
  wsUrl: string;
  expiresIn: number;
}

export type RoomJoinData = Pick<JoinRoomResponse, 'wsUrl' | 'ticket'>;
