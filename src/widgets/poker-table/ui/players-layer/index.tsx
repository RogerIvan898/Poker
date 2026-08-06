import React from 'react';
import { createPortal } from 'react-dom';

import { useUnit } from 'effector-react';

import { gameModel } from 'entities/game';
import { Player } from 'entities/player';
import { sessionModel } from 'entities/session';

import { useElementRect } from 'shared/hooks/useElementRect';

import styles from './players-layer.module.css';
import { computeSeats } from './seating';

interface Props {
  tableElement: HTMLDivElement | null;
}

export const PlayersLayer = ({ tableElement }: Props) => {
  const [players, dealerSeat, activeSeat, viewerId, myCards] = useUnit([
    gameModel.$players,
    gameModel.$dealerSeat,
    gameModel.$activeSeat,
    sessionModel.$currentUserId,
    gameModel.$myCards,
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
      {seats.map(({ player, betPosition, style }) => {
        const isViewer = player.id === viewerId;
        const hand = isViewer && myCards ? myCards : player.hand;

        return (
          <div key={player.id} className={styles.seatWrapper} style={style}>
            <Player
              player={{ ...player, hand }}
              dealer={player.seat === dealerSeat}
              currentPlayer={isViewer}
              turn={player.seat === activeSeat}
              betPosition={betPosition}
            />
          </div>
        );
      })}
    </div>,
    tableElement
  );
};
