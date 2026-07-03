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
  const totalMs = (usingBank ? timeBankSec : turnDurationSec) * 1000;
  const progress = isTurn ? Math.max(0, Math.min(1, remainingMs / totalMs)) : 0;
  const urgent =
    isTurn && (usingBank ? remainingSeconds <= 3 : remainingSeconds <= 5);

  return {
    remainingMs,
    remainingSeconds,
    usingBank,
    showTimer: isTurn,
    urgent,
    progress,
  };
};
