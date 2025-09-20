import React from 'react';

import { useTable } from 'providers/table-context';
import { Player } from 'entities/Player';
import type { Player as PlayerType, SeatConfig } from 'shared/types/player';
import styles from './PlayersLayer.module.css';

interface Props {
  players: PlayerType[];
  currentPlayerId: PlayerType['id'];
  seatConfigs?: Record<number, SeatConfig>;
  playerTurnId: PlayerType['id'] | null;
}

export const PlayersLayer = ({ 
  players = [], 
  seatConfigs = {},
  currentPlayerId,
  playerTurnId = null,
}: Props) => {
  const [seatPositions, setSeatPositions] = React.useState<Array<{ left: number; top: number }>>([]);
  const { tableElement, dealerId, bigBlind } = useTable();
  const playersLayerRef = React.useRef<HTMLDivElement>(null);

  const sortedPlayers = React.useMemo(() => {
    return [...players].sort((a, b) => a.seat - b.seat);
  }, [players]);

  const orderedPlayers = React.useMemo(() => {
    if (!currentPlayerId) return sortedPlayers;

    const currentPlayerIndex = sortedPlayers.findIndex(p => p.id === currentPlayerId);

    if (currentPlayerIndex === -1) {
      return sortedPlayers;
    }

    return [
      ...sortedPlayers.slice(currentPlayerIndex),
      ...sortedPlayers.slice(0, currentPlayerIndex)
    ];
  }, [sortedPlayers, currentPlayerId]);

  const calculatePositions = React.useCallback(() => {
    if (!tableElement || !playersLayerRef.current) return;

    const tableRect = tableElement.getBoundingClientRect();
    const layerRect = playersLayerRef.current.getBoundingClientRect();

    const offsetX = tableRect.left - layerRect.left;
    const offsetY = tableRect.top - layerRect.top;

    const width = tableRect.width;
    const height = tableRect.height;
    const centerX = width / 2;
    const centerY = height / 2;

    let measuredSeatSize = 72;
    try {
      const avatarEl = playersLayerRef.current.querySelector(`.${(styles as any).avatar}`);
      if (avatarEl instanceof HTMLElement) {
        const r = avatarEl.getBoundingClientRect();
        if (r.width > 0) measuredSeatSize = r.width;
      }
    } catch (e) {}

    const extraGapOutside = 6;
    const seatSize = measuredSeatSize;
    const baseSeatRadius = seatSize / 2 + extraGapOutside;

    const rx = width / 2;
    const ry = height / 2;

    const positions = orderedPlayers.map((_, index) => {
      const config = seatConfigs[index] || {};
      
      const playerMargin = config.margin !== undefined 
        ? config.margin * Math.min(width, height) / 100
        : 0;

      const playerRadius = baseSeatRadius + playerMargin;

      const angle = - (
        Math.PI * 1.5 - (index * (2 * Math.PI)) / Math.min(orderedPlayers.length, 9)
      );
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);

      const x = centerX + (rx + playerRadius) * dx;
      const y = centerY + (ry + playerRadius) * dy;

      return {
        left: x + offsetX,
        top: y + offsetY,
      };
    });

    setSeatPositions(positions);
  }, [orderedPlayers, tableElement, seatConfigs]);

  React.useEffect(() => {
    if (!tableElement) {
      return;
    }

    calculatePositions();

    const resizeObserver = new ResizeObserver(calculatePositions);
    resizeObserver.observe(tableElement);
    
    if (playersLayerRef.current) {
      resizeObserver.observe(playersLayerRef.current);
    }

    const handleResize = () => calculatePositions();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [calculatePositions, tableElement]);

  if (!orderedPlayers.length) return null;

  return (
    <div ref={playersLayerRef} className={styles.playersLayer}>
      {orderedPlayers.map((player, index) => {
        const position = seatPositions[index];
        const isCurrentPlayer = player.id === currentPlayerId;
        const isTurn = player.id === playerTurnId;
        const isDealer = player.id === dealerId;
        const config = seatConfigs[index] || {};
        const cardPosition = config.cardPosition || 'top';
        const betPosition = config.betPosition;
        
        let blind = null;

        if (bigBlindPlayer.id === player.id) {
          blind = bigBlind;
        } 
        else if (smallBlindPlayer.id === player.id) {
          blind = bigBlind / 2;
        }

        if (!position) {
          return null;
        }

        return (
          <div
            key={player.id || index}
            className={styles.seat}
            style={{
              left: `${position.left}px`,
              top: `${position.top}px`,
            }}
          >
            <Player
              player={player}
              isDealer={isDealer}
              isCurrentPlayer={isCurrentPlayer}
              isTurn={isTurn}
              cardsPosition={cardPosition}
              bet={isDealer ? 100 : null}
              betPosition={betPosition}
            />
          </div>
        );
      })}
    </div>
  );
};
