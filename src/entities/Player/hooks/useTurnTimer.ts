import React from 'react';

import timeBankSound from 'assets/sounds/time-bank.mp3';
import turnSound from 'assets/sounds/turn.mp3';

import { useSound } from 'shared/hooks/useSound';

export const useTurnTimer = ({
  isTurn,
  turnDurationSec,
  timeBankSec,
  onTurnTimeout,
  playSound = false,
}: {
  isTurn: boolean;
  turnDurationSec: number;
  timeBankSec: number;
  onTurnTimeout?: () => void;
  playSound?: boolean;
}) => {
  const { play: playTurnSound } = useSound(turnSound);
  const { play: playTimeBankSound } = useSound(timeBankSound);
  const wasTurnRef = React.useRef(false);
  const wasUsingBankRef = React.useRef(false);

  React.useEffect(() => {
    if (playSound && isTurn && !wasTurnRef.current) {
      playTurnSound();
    }

    wasTurnRef.current = isTurn;
  }, [isTurn, playSound, playTurnSound]);

  const [remainingMs, setRemainingMs] = React.useState(turnDurationSec * 1000);
  const [usingBank, setUsingBank] = React.useState(false);

  React.useEffect(() => {
    if (!isTurn) {
      wasUsingBankRef.current = false;
      return;
    }

    if (playSound && usingBank && !wasUsingBankRef.current) {
      playTimeBankSound();
    }

    wasUsingBankRef.current = usingBank;
  }, [isTurn, usingBank, playSound, playTimeBankSound]);

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

  return {
    remainingMs,
    remainingSeconds,
    usingBank,
    showTimer: isTurn,
    progress,
  };
};
