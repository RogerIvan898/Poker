import React from 'react';
import { useTable } from 'providers/table-context';
import { Player } from 'entities/Player';
import styles from './PlayersLayer.module.css';
import type { Player as PlayerType } from 'shared/types/player';

interface SeatConfig {
  margin?: number;
  cardPosition?: 'top' | 'bottom' | 'left' | 'right';
}

interface Props {
  players: PlayerType[];
  padding?: number;
  seatConfigs?: Record<number, SeatConfig>;
}

export const PlayersLayer = ({ 
  players = [], 
  padding = -68, 
  seatConfigs = {}
}: Props) => {
  const [seatPositions, setSeatPositions] = React.useState<Array<{ left: number; top: number }>>([]);
  const { tableElement, currentPlayerId} = useTable();
  const playersLayerRef = React.useRef<HTMLDivElement>(null);

  const orderedPlayers = React.useMemo(() => {
    if (!currentPlayerId) return players;

    const currentPlayerIndex = players.findIndex(p => p.id === currentPlayerId);

    if (currentPlayerIndex === -1) {
      return players;
    }

    return [
      players[currentPlayerIndex],
      ...players.slice(currentPlayerIndex + 1),
      ...players.slice(0, currentPlayerIndex)
    ];
  }, [players, currentPlayerId]);

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
        : padding;

      const playerRadius = baseSeatRadius + playerMargin;

      const angle = - (
        Math.PI * 1.5 + (index * (2 * Math.PI)) / Math.min(orderedPlayers.length, 9)
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
  }, [orderedPlayers, padding, tableElement, seatConfigs]);

  React.useEffect(() => {
    if (!tableElement) return;

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

  return (
    <div ref={playersLayerRef} className={styles.playersLayer}>
      {orderedPlayers.map((player, index) => {
        const position = seatPositions[index];
        const isCurrentPlayer = player.id === currentPlayerId;
        const config = seatConfigs[index] || {};
        const cardPosition = config.cardPosition || 'top';

        if (!position) return null;

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
              name={player.name}
              stack={player.chips}
              id={String(player.id)}
              hand={player.hand}
              status={player.status}
              isDealer={player.isDealer}
              isCurrentPlayer={isCurrentPlayer}
              cardsPosition={cardPosition}
            />
          </div>
        );
      })}
    </div>
  );
};
