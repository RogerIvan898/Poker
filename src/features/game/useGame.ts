import React from "react";

import { socket } from "shared/lib/socketClient";
import type { GameEvent } from "./types";
import { incomingEvent } from "./model/store";

export function useGameSocket(
  tableId: string,
) {
  React.useEffect(() => {
    if (!tableId) return;

    if (!socket.connected) socket.connect();

    socket.emit("join_table", { tableId });

    const handleEvent = (event: GameEvent) => incomingEvent(event);
    const handleSnapshot = (event: GameEvent) => incomingEvent(event);
    const handleError = (error: any) => incomingEvent({ type: "ERROR", payload: error });

    socket.on("EVENT", handleEvent);
    socket.on("SNAPSHOT", handleSnapshot);
    socket.on("ERROR", handleError);

    return () => {
      socket.off("EVENT", handleEvent);
      socket.off("SNAPSHOT", handleSnapshot);
      socket.off("ERROR", handleError);
      socket.emit("leave_table", { tableId });
    };
  }, [tableId]);

  const sendAction = React.useCallback((action: string, payload?: any) => {
    const msgId = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    socket.emit("ACTION", { action, payload, msgId });
    
    return msgId;
  }, []);

  return { sendAction };
}
