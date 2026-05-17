import React from 'react';
import { createPortal } from 'react-dom';
import { useUnit } from 'effector-react';

import { gameModel } from 'entities/game';
import { Player } from 'entities/player';
import { sessionModel } from 'entities/session';
import { useElementRect } from 'shared/hooks/useElementRect';

import { VISUAL_SEATS_CONFIG } from './constants';
import styles from './players-layer.module.css';

interface Props {
  tableElement: HTMLDivElement | null;
}

export const PlayersLayer = ({ tableElement }: Props) => {
  const [players, dealerSeatIndex, activeSeatIndex, viewerId] = useUnit([
    gameModel.$players,
    gameModel.$dealerSeatIndex,
    gameModel.$activeSeatIndex,
    sessionModel.$viewerId,
  ]);

  const rect = useElementRect(tableElement);

  const maxSeats = Object.keys(VISUAL_SEATS_CONFIG).length;

  const seatOffset = React.useMemo(() => {
    const currentPlayer = players.find(player => player.id === viewerId);

    if (!currentPlayer) {
      return 0;
    }

    return (maxSeats - currentPlayer.seat) % maxSeats;
  }, [players, viewerId, maxSeats]);

  const playersWithStyles = React.useMemo(() => {
    if (!rect) {
      return [];
    }

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const radiusX = rect.width * 0.7;
    const radiusY = rect.height * 0.3;

    return players.map(player => {
      const visualSeatIndex = (player.seat + seatOffset) % maxSeats;

      const config =
        VISUAL_SEATS_CONFIG[visualSeatIndex] ?? VISUAL_SEATS_CONFIG[0];

      const angle = ((config.angle - 90) * Math.PI) / 180;

      const x = centerX + Math.cos(angle) * radiusX;

      const y = centerY + Math.sin(angle) * radiusY;

      return {
        player,
        config,
        style: {
          left: `${x}px`,
          top: `${y}px`,
        },
      };
    });
  }, [players, seatOffset, maxSeats, rect]);

  if (!tableElement || !rect || !players.length) {
    return null;
  }

  return createPortal(
    <div className={styles.playersLayer}>
      {playersWithStyles.map(({ player, config, style }) => (
        <div key={player.id} className={styles.seatWrapper} style={style}>
          <Player
            player={player}
            dealer={player.seat === dealerSeatIndex}
            isCurrentPlayer={player.id === viewerId}
            turn={player.seat === activeSeatIndex}
            cardsPosition={config.cardPosition}
            bet={player.committed}
            betPosition={config.betPosition}
          />
        </div>
      ))}
    </div>,
    tableElement
  );
};
