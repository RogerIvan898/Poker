import { useUnit } from "effector-react";
import { $currentPlayerId } from "entities/Player/model/store";
import React from "react";

interface TableContextType {
  tableElement: HTMLElement | null;
  setTableElement: (element: HTMLElement | null) => void;
  currentPlayerId: string;
}

const TableContext = React.createContext<TableContextType | null>(null);

export const TableProvider = ({children}: React.PropsWithChildren) => {
    const [tableElement, setTableElement] = React.useState<HTMLElement | null>(null);
    const [currentPlayerId] = useUnit([$currentPlayerId]);

    const value = React.useMemo(() => ({
        tableElement,
        setTableElement,
        currentPlayerId
    }), [tableElement, currentPlayerId]);

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
};

export const useTable = () => {
  const tableRef = React.useContext(TableContext);

  if (!tableRef) {
    throw new Error('useTable must be used within a TableProvider');
  }

  return tableRef;
};
