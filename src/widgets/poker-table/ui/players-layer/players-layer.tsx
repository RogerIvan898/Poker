import React from 'react';
import { createPortal } from 'react-dom';

import { useUnit } from 'effector-react';

import { SERVER_EVENTS, gameModel } from 'entities/game';
import { Player } from 'entities/player';
import { sessionModel } from 'entities/session';
import { useElementRect } from 'shared/hooks/useElementRect';
import { Logo } from 'shared/ui/logo';
import { cn } from 'shared/utils';
import { formatChipAmount } from 'shared/utils/format';

import styles from './players-layer.module.css';
import { computeSeats } from './seating';
import type { CollectFlight, PotFlight } from './types';

const POT_MOVE_MS = 750;

interface Props {
  tableElement: HTMLDivElement | null;
  onHidePot: (hidden: boolean) => void;
}

export const PlayersLayer = ({ tableElement, onHidePot }: Props) => {
  const [
    players,
    dealerSeat,
    { smallBlindSeat, bigBlindSeat },
    activeSeat,
    viewerId,
    myCards,
    debugHoles,
    collecting,
  ] = useUnit([
    gameModel.$players,
    gameModel.$dealerSeat,
    gameModel.$gameState,
    gameModel.$activeSeat,
    sessionModel.$currentUserId,
    gameModel.$myCards,
    gameModel.$debugHoles,
    gameModel.$collectingBets,
  ]);

  const rect = useElementRect(tableElement);
  const [wins, setWins] = React.useState<
    Record<number, { amount: number; id: number }>
  >({});
  const [flights, setFlights] = React.useState<PotFlight[] | null>(null);
  const [flightId, setFlightId] = React.useState(0);
  const [atWinner, setAtWinner] = React.useState(false);
  const [collectFlights, setCollectFlights] = React.useState<
    CollectFlight[] | null
  >(null);
  const [collectAtPot, setCollectAtPot] = React.useState(false);

  React.useLayoutEffect(() => {
    if (!collecting || !tableElement) {
      setCollectFlights(null);
      setCollectAtPot(false);
      return;
    }

    const tableRect = tableElement.getBoundingClientRect();
    const potEl = tableElement.querySelector('[data-pot]');
    const bets = [...tableElement.querySelectorAll<HTMLElement>('[data-bet]')];

    if (bets.length === 0) {
      return;
    }

    const potRect = potEl?.getBoundingClientRect();
    const toX = potRect
      ? potRect.left - tableRect.left + potRect.width / 2
      : tableRect.width / 2;
    const toY = potRect
      ? potRect.top - tableRect.top + potRect.height / 2
      : tableRect.height / 2;

    setCollectAtPot(false);
    setCollectFlights(
      bets.map(bet => {
        const betRect = bet.getBoundingClientRect();

        return {
          seat: bet.dataset.betSeat ?? '',
          amount: Number(bet.dataset.bet),
          fromX: betRect.left - tableRect.left + betRect.width / 2,
          fromY: betRect.top - tableRect.top + betRect.height / 2,
          toX,
          toY,
        };
      })
    );

    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => setCollectAtPot(true));
    });

    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [collecting, tableElement]);

  React.useEffect(
    () =>
      gameModel.incomingEvent.watch(event => {
        if (event.type === SERVER_EVENTS.HAND_STARTED) {
          setFlights(null);
          setAtWinner(false);
          onHidePot(false);
          return;
        }

        if (event.type !== SERVER_EVENTS.HAND_COMPLETED || !tableElement) {
          return;
        }

        const tableRect = tableElement.getBoundingClientRect();
        const potEl = tableElement.querySelector('[data-pot]');
        let fromX = tableRect.width / 2;
        let fromY = tableRect.height / 2;

        if (potEl) {
          const potRect = potEl.getBoundingClientRect();
          fromX = potRect.left - tableRect.left + potRect.width / 2;
          fromY = potRect.top - tableRect.top + potRect.height / 2;
        }

        const playerList = Object.values(gameModel.$players.getState());
        const viewerSeat =
          playerList.find(
            player => player.id === sessionModel.$currentUserId.getState()
          )?.seat ?? null;
        const seatLayout = computeSeats(playerList, viewerSeat, tableRect);
        const next = event.payload.winners.flatMap(winner => {
          const seat = seatLayout.find(
            item => item.player.seat === winner.seatIndex
          );

          if (!seat) {
            return [];
          }

          return [
            {
              seat: winner.seatIndex,
              amount: winner.amountWon,
              fromX,
              fromY,
              toX: Number.parseFloat(seat.style.left),
              toY: Number.parseFloat(seat.style.top),
            },
          ];
        });

        if (!next.length) {
          return;
        }

        setWins(current => {
          const updated = { ...current };

          event.payload.winners.forEach(winner => {
            updated[winner.seatIndex] = {
              amount: winner.amountWon,
              id: (current[winner.seatIndex]?.id ?? 0) + 1,
            };
          });

          return updated;
        });
        setFlights(next);
        setAtWinner(false);
        setFlightId(id => id + 1);
        onHidePot(true);
      }),
    [onHidePot, tableElement]
  );

  React.useEffect(() => {
    if (!flights) {
      return;
    }

    const frame = requestAnimationFrame(() => setAtWinner(true));
    const done = window.setTimeout(() => setFlights(null), POT_MOVE_MS);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(done);
    };
  }, [flightId, flights]);

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
          <span>{formatChipAmount(flight.amount)}</span>
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
          <span>{formatChipAmount(flight.amount)}</span>
        </div>
      ))}
      {seats.map(({ player, betPosition, style }) => {
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
          <div key={player.id} className={styles.seatWrapper} style={style}>
            <Player
              player={{ ...player, hand }}
              dealer={player.seat === dealerSeat}
              blindRole={blindRole}
              currentPlayer={isViewer}
              turn={player.seat === activeSeat}
              betPosition={betPosition}
              reveal={!isViewer && Boolean(revealed)}
              winAmount={wins[player.seat]?.amount}
              winId={wins[player.seat]?.id}
            />
          </div>
        );
      })}
    </div>,
    tableElement
  );
};
