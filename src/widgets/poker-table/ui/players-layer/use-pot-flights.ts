import React from 'react';

import { SERVER_EVENTS, gameModel } from 'entities/game';
import { sessionModel } from 'entities/session';

import { getPotCenter } from './get-pot-center';
import { computeSeats } from './seating';
import type { PotFlight } from './types';

const POT_MOVE_MS = 750;

export const usePotFlights = (
  tableElement: HTMLDivElement | null,
  onHidePot: (hidden: boolean) => void
) => {
  const [wins, setWins] = React.useState<
    Record<number, { amount: number; id: number }>
  >({});
  const [flights, setFlights] = React.useState<PotFlight[] | null>(null);
  const [flightId, setFlightId] = React.useState(0);
  const [atWinner, setAtWinner] = React.useState(false);

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
        const { x: fromX, y: fromY } = getPotCenter(tableElement, tableRect);

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

  return { wins, flights, flightId, atWinner };
};
