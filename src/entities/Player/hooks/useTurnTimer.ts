import React from 'react';

export const useTurnTimer = ({
  isTurn,
  turnDurationSec,
  timeBankSec,
  onTurnTimeout,
}: {
  isTurn: boolean;
  turnDurationSec: number;
  timeBankSec: number;
  onTurnTimeout?: () => void;
}) => {
  const [remainingMs, setRemainingMs] = React.useState(turnDurationSec * 1000);
  const [usingBank, setUsingBank] = React.useState(false);

  const rafRef = React.useRef<number | null>(null);
  const endRef = React.useRef<number | null>(null);
  const bankEndRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    endRef.current = null;
    bankEndRef.current = null;
    setUsingBank(false);
    setRemainingMs(turnDurationSec * 1000);

    if (!isTurn) return;

    const start = performance.now();
    endRef.current = start + turnDurationSec * 1000;

    const tick = () => {
      const now = performance.now();

      if (endRef.current && now < endRef.current) {
        setRemainingMs(endRef.current - now);
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      if (timeBankSec > 0) {
        if (!bankEndRef.current) {
          bankEndRef.current = now + timeBankSec * 1000;
          setUsingBank(true);
        }

        const bankRemaining = bankEndRef.current - now;
        setRemainingMs(Math.max(0, bankRemaining));

        if (bankRemaining <= 0) {
          onTurnTimeout?.();
          return;
        }

        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      onTurnTimeout?.();
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [isTurn, turnDurationSec, timeBankSec, onTurnTimeout]);

  const remainingSeconds = Math.ceil(remainingMs / 1000);
  const showTimer = isTurn && usingBank;
  const urgent = showTimer && remainingSeconds <= 3;
  const progress = showTimer
    ? Math.max(0, Math.min(1, remainingMs / (timeBankSec * 1000)))
    : 0;

  return {
    remainingMs,
    remainingSeconds,
    usingBank,
    showTimer,
    urgent,
    progress,
  };
};
