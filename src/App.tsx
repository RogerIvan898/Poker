import { useUnit } from 'effector-react';

import { $screen } from 'app/model';
import { RoomPage } from 'pages/room-page';
import { MainMenu } from 'widgets/main-menu';

function App() {
  const screen = useUnit($screen);

  if (screen === 'room') {
    return <RoomPage />;
  }

  return <MainMenu />;
}

export default App;
