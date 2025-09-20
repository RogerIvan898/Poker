import { useUnit } from "effector-react";
import React from "react";

import { gameModel } from "features/game";
import { playerModel } from "entities/Player";
import type { GameState } from "features/game/types";
import type { Player } from "shared/types/player";

interface TableContextType extends Pick<GameState, 'dealerId'> {
  tableElement: HTMLElement | null;
  setTableElement: (element: HTMLElement | null) => void;
  currentPlayerId: Player['id'];
  playerTurnId: Player['id'] | null;
}

const TableContext = React.createContext<TableContextType | null>(null);

export const TableProvider = ({children}: React.PropsWithChildren) => {
    const [tableElement, setTableElement] = React.useState<HTMLElement | null>(null);
    const [currentPlayerId] = useUnit(playerModel.$currentPlayerId);
    const gameState = useUnit(gameModel.$gameState);

    const value = React.useMemo(() => ({
        tableElement,
        setTableElement,
        currentPlayerId,
        dealerId: gameState.dealerId,
        playerTurnId: gameState.currentTurnId,
    }), [tableElement, currentPlayerId, gameState.dealerId, gameState.currentTurnId]);

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
};

export const useTable = () => {
  const tableRef = React.useContext(TableContext);

  if (!tableRef) {
    throw new Error('useTable must be used within a TableProvider');
  }

  return tableRef;
};
