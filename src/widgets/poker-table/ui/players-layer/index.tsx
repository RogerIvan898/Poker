import React from 'react';
import { createPortal } from 'react-dom';
import { useUnit } from 'effector-react';

import { gameModel } from 'entities/game';
import { Player } from 'entities/player';
import type { Player as PlayerType } from 'shared/types/player';

import { VISUAL_SEATS_CONFIG } from './constants';
import styles from './players-layer.module.css';

interface Props {
  players: PlayerType[];
  currentPlayerId: string | null;
  playerTurnId: string | null;
  tableElement: HTMLDivElement | null;
}

export const PlayersLayer = ({
  players = [],
  currentPlayerId,
  playerTurnId,
  tableElement,
}: Props) => {
  const dealerId = useUnit(gameModel.$dealerId);

  const [rect, setRect] = React.useState<DOMRect | null>(null);

  React.useLayoutEffect(() => {
    if (!tableElement) {
      return;
    }

    const update = () => {
      setRect(tableElement.getBoundingClientRect());
    };

    update();

    const observer = new ResizeObserver(update);

    observer.observe(tableElement);

    window.addEventListener('resize', update);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [tableElement]);

  const maxSeats = Object.keys(VISUAL_SEATS_CONFIG).length;

  const seatOffset = React.useMemo(() => {
    const currentPlayer = players.find(player => player.id === currentPlayerId);

    if (!currentPlayer) {
      return 0;
    }

    return (maxSeats - currentPlayer.seat) % maxSeats;
  }, [players, currentPlayerId, maxSeats]);

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
            isDealer={player.id === dealerId}
            isCurrentPlayer={player.id === currentPlayerId}
            isTurn={player.id === playerTurnId}
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
