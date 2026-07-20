import { GameRoomPage } from 'pages/game-room';
import { MenuPage } from 'pages/main-menu';
import { createBrowserRouter, Navigate } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    // element: <div />,
    children: [
      {
        index: true,
        element: <MenuPage />,
      },
      {
        path: 'game/:roomId',
        element: <GameRoomPage />,
      },
      {
        path: '*',
        element: <Navigate to={'/'} replace />,
      },
    ],
  },
]);
