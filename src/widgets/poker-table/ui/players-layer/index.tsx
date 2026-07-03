import React from 'react';
import { createPortal } from 'react-dom';
import { useUnit } from 'effector-react';

import { gameModel } from 'entities/game';
import { Player } from 'entities/player';
import { sessionModel } from 'entities/session';
import { useElementRect } from 'shared/hooks/useElementRect';

import { computeSeats } from './seating';
import styles from './players-layer.module.css';

interface Props {
  tableElement: HTMLDivElement | null;
}

export const PlayersLayer = ({ tableElement }: Props) => {
  const [players, dealerSeat, activeSeat, viewerId] = useUnit([
    gameModel.$players,
    gameModel.$dealerSeat,
    gameModel.$activeSeat,
    sessionModel.$viewerId,
  ]);

  const rect = useElementRect(tableElement);

  const seats = React.useMemo(() => {
    if (!rect) return [];

    const playerList = Object.values(players);
    const viewerSeat = playerList.find(p => p.id === viewerId)?.seat ?? null;

    return computeSeats(playerList, viewerSeat, rect);
  }, [players, viewerId, rect]);

  if (!tableElement || !rect || !seats.length) {
    return null;
  }

  return createPortal(
    <div className={styles.playersLayer}>
      {seats.map(({ player, betPosition, style }) => (
        <div key={player.id} className={styles.seatWrapper} style={style}>
          <Player
            player={player}
            dealer={player.seat === dealerSeat}
            currentPlayer={player.id === viewerId}
            turn={player.seat === activeSeat}
            bet={player.committed}
            betPosition={betPosition}
          />
        </div>
      ))}
    </div>,
    tableElement
  );
};
