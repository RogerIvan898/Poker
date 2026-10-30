import React from 'react';
import { createPortal } from 'react-dom';

import { useUnit } from 'effector-react';

import { gameModel } from 'entities/game';
import { findPlayerById, Player } from 'entities/player';
import { sessionModel } from 'entities/session';
import { useElementSize } from 'shared/hooks/use-element-size';
import { Logo } from 'shared/ui/logo';
import { cn } from 'shared/utils/cn';
import { formatAmount } from 'shared/utils/format';

import styles from './players-layer.module.css';
import { computeSeats } from './seating';
import { useCollectFlights } from './use-collect-flights';
import { usePotFlights } from './use-pot-flights';

interface Props {
  tableElement: HTMLDivElement | null;
  onHidePot: (hidden: boolean) => void;
}

export const PlayersLayer = ({ tableElement, onHidePot }: Props) => {
  const [
    players,
    dealerSeat,
    smallBlindSeat,
    bigBlindSeat,
    activeSeat,
    viewerId,
    myCards,
    debugHoles,
    collecting,
  ] = useUnit([
    gameModel.$players,
    gameModel.$dealerSeat,
    gameModel.$smallBlindSeat,
    gameModel.$bigBlindSeat,
    gameModel.$activeSeat,
    sessionModel.$currentUserId,
    gameModel.$myCards,
    gameModel.$debugHoles,
    gameModel.$collectingBets,
  ]);

  const tableSize = useElementSize(tableElement);
  const { collectFlights, collectAtPot } = useCollectFlights(
    collecting,
    tableElement
  );
  const playerList = Object.values(players);
  const viewerSeat = findPlayerById(players, viewerId)?.seat ?? null;
  const seatNumbersKey = playerList.map(player => player.seat).join(',');

  const seats = React.useMemo(() => {
    if (!tableSize || !seatNumbersKey) return [];

    return computeSeats(
      seatNumbersKey.split(',').map(Number),
      viewerSeat,
      tableSize
    );
  }, [seatNumbersKey, viewerSeat, tableSize]);

  const { wins, flights, flightId, atWinner } = usePotFlights(
    tableElement,
    seats,
    onHidePot
  );

  if (!tableElement || !tableSize || !seats.length) {
    return null;
  }

  return createPortal(
    <div className={styles.playersLayer}>
      {collectFlights?.map(flight => (
        <div
          key={`collect-${flight.seat}`}
          className={cn(styles.potFlight, styles.collectFlight)}
          style={{
            left: collectAtPot ? flight.toX : flight.fromX,
            top: collectAtPot ? flight.toY : flight.fromY,
          }}
        >
          <Logo size={16} className={styles.potFlightLogo} />
          <span>{formatAmount(flight.amount)}</span>
        </div>
      ))}
      {flights?.map(flight => (
        <div
          key={`${flightId}-${flight.seat}`}
          className={styles.potFlight}
          style={{
            left: atWinner ? flight.toX : flight.fromX,
            top: atWinner ? flight.toY : flight.fromY,
          }}
        >
          <Logo size={16} className={styles.potFlightLogo} />
          <span>{formatAmount(flight.amount)}</span>
        </div>
      ))}
      {seats.map(({ seat, towardCenter, x, y }) => {
        const player = players[seat];

        if (!player) return null;

        const isViewer = player.id === viewerId;
        const revealed = debugHoles[player.seat];
        const hand = isViewer && myCards ? myCards : (revealed ?? player.hand);
        const blindRole =
          player.seat === smallBlindSeat
            ? 'sb'
            : player.seat === bigBlindSeat
              ? 'bb'
              : null;

        return (
          <div
            key={player.id}
            className={styles.seatWrapper}
            style={{ left: x, top: y }}
          >
            <Player
              player={player}
              hand={hand}
              dealer={player.seat === dealerSeat}
              blindRole={blindRole}
              currentPlayer={isViewer}
              turn={player.seat === activeSeat}
              towardCenter={towardCenter}
              reveal={!isViewer && Boolean(revealed)}
              winAmount={wins[player.seat]?.amount}
              winId={wins[player.seat]?.id}
              collecting={collecting}
            />
          </div>
        );
      })}
    </div>,
    tableElement
  );
};
