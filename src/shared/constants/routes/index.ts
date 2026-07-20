export const ROUTES = {
  MENU: '/',
  GAME_ROOM_PATTENR: 'game/:roomId',
  GAME_ROOM: (roomId: string) => `game/${roomId}`,
};
