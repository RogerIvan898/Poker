export const ROUTES = {
  MENU: '/',
  GAME_ROOM_PATTERN: 'room/:roomId',
  GAME_ROOM: (roomId: string) => `/room/${roomId}`,
};
