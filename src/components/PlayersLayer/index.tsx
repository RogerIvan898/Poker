import React, { useEffect, useState, useCallback } from 'react';
import styles from './PlayersLayer.module.css';
import Player from '../Player';
import { useTable } from '../../Providers/table-context';

interface PlayerData {
  id: string | number;
  name: string;
  stack: number;
  status: string;
  isDealer?: boolean;
}

interface Props {
  players: PlayerData[];
  padding?: number;
}

const PlayersLayer: React.FC<Props> = ({ players = [], padding = -68 }) => {
  const { tableElement } = useTable();
  const [seatPositions, setSeatPositions] = useState<Array<{ left: number; top: number; z: number; scale: number }>>([]);

  const calculatePositions = useCallback(() => {
    if (!tableElement) return;

    const rect = tableElement.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const positions = players.map((_, index) => {
      const angle = Math.PI * 1.5 + (index * (2 * Math.PI)) / players.length;
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);

      // Вычисляем точку пересечения
      const padX = Math.min(padding, halfWidth * 0.9);
      const padY = Math.min(padding, halfHeight * 0.9);
      const hx = halfWidth - padX;
      const hy = halfHeight - padY;

      const tx = dx === 0 ? Infinity : hx / Math.abs(dx);
      const ty = dy === 0 ? Infinity : hy / Math.abs(dy);
      const t = Math.min(tx, ty);

      const x = centerX + dx * t;
      const y = centerY + dy * t;

      // Вычисляем глубину и масштаб
      const depthNorm = (y - centerY) / (halfHeight || 1);
      const scale = 1 + depthNorm * 0.08;
      const z = Math.round(100 + depthNorm * 100);

      // Преобразуем в глобальные координаты
      return {
        left: rect.left + x,
        top: rect.top + y,
        z,
        scale,
      };
    });

    setSeatPositions(positions);
  }, [players, padding, tableElement]);

  // Эффект для подписки на изменения размеров
  useEffect(() => {
    if (!tableElement) return;

    calculatePositions();

    const resizeObserver = new ResizeObserver(calculatePositions);
    resizeObserver.observe(tableElement);

    // Обработчики для изменений окна
    const handleResize = () => calculatePositions();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [calculatePositions, tableElement]);

  if (!seatPositions.length) return null;

  return (
    <div className={styles.playersLayer}>
      {players.map((player, index) => {
        const position = seatPositions[index];

        return (
          <div
            key={player.id || index}
            className={styles.seat}
            style={{
              left: `${position.left}px`,
              top: `${position.top}px`,
              zIndex: position.z,
              transform: `translate(-50%, -50%) scale(${position.scale})`,
              position: 'absolute',
            }}
          >
            <Player name={player.name} stack={player.stack} status={player.status} isDealer={!!player.isDealer} />
          </div>
        );
      })}
    </div>
  );
};

export default PlayersLayer;