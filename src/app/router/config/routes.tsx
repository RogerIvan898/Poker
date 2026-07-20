import { GameRoomPage } from 'pages/game-room';
import { MenuPage } from 'pages/main-menu';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from 'shared/constants/routes';

export const router = createBrowserRouter([
  {
    path: ROUTES.MENU,
    children: [
      {
        index: true,
        element: <MenuPage />,
      },
      {
        path: ROUTES.GAME_ROOM_PATTENR,
        element: <GameRoomPage />,
      },
      {
        path: '*',
        element: <Navigate to={ROUTES.MENU} replace />,
      },
    ],
  },
]);
