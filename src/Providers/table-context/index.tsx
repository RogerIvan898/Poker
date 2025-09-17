import React from "react";

interface TableContextType {
  tableElement: HTMLElement | null;
  setTableElement: (element: HTMLElement | null) => void;
}

const TableContext = React.createContext<TableContextType | null>(null);

export const TableProvider = ({children}: React.PropsWithChildren) => {
    const [tableElement, setTableElement] = React.useState<HTMLElement | null>(null);

    const value = React.useMemo(() => ({
        tableElement,
        setTableElement
    }), [tableElement]);

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
};

export const useTable = () => {
  const tableRef = React.useContext(TableContext);

  if (!tableRef) {
    throw new Error('useTable must be used within a TableProvider');
  }

  return tableRef;
};
