import { useUnit } from 'effector-react';

import { MenuPage } from 'pages/menu-page';
import { RoomPage } from 'pages/room-page';

import { $screen } from '../model';

export const App = () => {
  const screen = useUnit($screen);

  switch (screen) {
    case 'room':
      return <RoomPage />;
    case 'menu':
    default:
      return <MenuPage />;
  }
};
