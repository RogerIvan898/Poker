import React from 'react';
import { Card } from 'entities/Card';
import type { Player as PlayerType } from 'shared/types/player';
import styles from './Player.module.css';
import { Logo } from 'shared/ui/logo';

const initialLetter = (name: string) => (name ? name.charAt(0).toUpperCase() : '?');

interface PlayerProps extends PlayerType {
  cardsPosition?: 'top' | 'bottom' | 'left' | 'right';
  isCurrentPlayer?: boolean;
  turnDurationSec?: number;
  timeBankSec?: number;
  onTurnTimeout?: () => void;
}

export const Player = ({
  name,
  stack,
  status,
  hand,
  cardsPosition = 'top',
  isCurrentPlayer = false,
  turnDurationSec = 15,
  timeBankSec = 10,
  onTurnTimeout,
}: PlayerProps) => {
  const isDealer = false;
  const isSitOut = status === 'SIT_OUT';
  const isFolded = status === 'FOLDED';

  const [remainingMs, setRemainingMs] = React.useState<number>(turnDurationSec * 1000);
  const [usingBank, setUsingBank] = React.useState<boolean>(false);

  const rafRef = React.useRef<number | null>(null);
  const endRef = React.useRef<number | null>(null);
  const bankEndRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    endRef.current = null;
    bankEndRef.current = null;

    setUsingBank(false);
    setRemainingMs(turnDurationSec * 1000);

    if (!isCurrentPlayer) return;

    const now = performance.now();
    endRef.current = now + turnDurationSec * 1000;
    setRemainingMs(turnDurationSec * 1000);

    const tick = () => {
      const now2 = performance.now();

      if (endRef.current && now2 < endRef.current) {
        const remMain = Math.max(0, endRef.current - now2);
        setRemainingMs(remMain);
        rafRef.current = requestAnimationFrame(tick);
        
        return;
      }

      if (timeBankSec && timeBankSec > 0) {
        if (!bankEndRef.current) {
          bankEndRef.current = now2 + timeBankSec * 1000;
          setUsingBank(true);
        }

        if (bankEndRef.current) {
          const remBank = Math.max(0, bankEndRef.current - now2);
          setRemainingMs(remBank);

          if (remBank <= 0) {
            onTurnTimeout?.();

            if (rafRef.current) {
              cancelAnimationFrame(rafRef.current);
              rafRef.current = null;
            }

            return;
          }

          rafRef.current = requestAnimationFrame(tick);

          return;
        }
      } else {
        onTurnTimeout?.();

        return;
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isCurrentPlayer, turnDurationSec, timeBankSec, onTurnTimeout]);

  const remainingSeconds = Math.ceil(remainingMs / 1000);
  const showTimer = isCurrentPlayer && usingBank;
  const urgent = showTimer && remainingSeconds <= 3;

  const bankDuration = timeBankSec * 1000;
  const progress = showTimer ? Math.max(0, Math.min(1, remainingMs / bankDuration)) : 0;

  const R = 45;
  const C = 2 * Math.PI * R;
  const dashoffset = C * (1 - progress);

  return (
    <div className={`${styles.player} ${isFolded ? styles.folded : ''} ${isSitOut ? styles.sitOut : ''}`}>
      <div className={styles.mainContainer}>
        <div className={styles.avatarWrap}>
          {showTimer && (
            <div className={`${styles.turnTimer} ${urgent ? styles.timerUrgent : ''}`} aria-hidden>
              <svg viewBox="0 0 100 100" className={styles.timerSvg}>
                <circle cx="50" cy="50" r={R} stroke="var(--timer-bg, rgba(255,255,255,0.08))" strokeWidth="6" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r={R}
                  stroke={urgent ? 'var(--timer-urgent, #ff4d4f)' : 'rgba(0, 255, 204, 0.7)'}
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${C} ${C}`}
                  strokeDashoffset={dashoffset}
                  strokeLinecap="butt"
                />
              </svg>
              <div className={styles.timerLabel}>{remainingSeconds}</div>
            </div>
          )}

          <div
          className={`${styles.avatar} ${status === 'FOLDED' ? styles.folded : ''} ${isCurrentPlayer ? styles.currentPlayer : ''}`}
          style={showTimer && {border: 'none'} || {}}
          >
            {initialLetter(name)}
          </div>
          {isDealer && <div className={styles.dealerBadge}>D</div>}
        </div>

        {(hand?.length > 0 && (!isFolded || !isCurrentPlayer)) && (
          <div className={`${styles.cards} ${styles[`cards-${cardsPosition}`]}`}>
            <Card card={hand[0]} hidden={!isCurrentPlayer} />
            <Card card={hand[1]} hidden={!isCurrentPlayer} />
          </div>
        )}
      </div>

      <div className={styles.info}>
        <div className={styles.name}>{name}</div>
        <div className={styles.stack}>
          <div className={styles.stackAmount}>{stack}</div>
          <Logo />
        </div>
      </div>
    </div>
  );
}
