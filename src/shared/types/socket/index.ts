export interface WSMessage {
  type: string;
  payload?: unknown;
}

export interface ConnectParams {
  playerId: string;
  baseUrl?: string;
}
