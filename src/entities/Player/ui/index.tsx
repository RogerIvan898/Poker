import React from 'react';

import { cn } from 'shared/utils';
import type { Player as PlayerType } from 'shared/types/player';

import { useTurnTimer } from '../hooks';

import styles from './Player.module.css';
import { BetBadge } from './bet-badge';
import { PlayerAvatar } from './player-avatar';
import { TurnTimer } from './turn-timer';
import { PlayerCards } from './player-cards';
import { StackBadge } from './stack-badge';

type CardPosition = 'top' | 'bottom' | 'left' | 'right';

interface Props {
  player: PlayerType;
  cardsPosition?: CardPosition;
  isCurrentPlayer?: boolean;
  isDealer: boolean;
  turnDurationSec?: number;
  timeBankSec?: number;
  onTurnTimeout?: () => void;
  isTurn: boolean;
  bet: number | null;
  betPosition?: CardPosition;
  debug?: boolean;
}

export const Player = ({
  player,
  cardsPosition = 'top',
  isCurrentPlayer = false,
  turnDurationSec = 15,
  timeBankSec = 10,
  onTurnTimeout,
  isDealer,
  isTurn,
  bet,
  betPosition = 'top',
  debug = true,
}: Props) => {
  const { status, stack, hand = [], name } = player;

  const isSitOut = status === 'SIT_OUT';
  const isFolded = status === 'FOLDED';

  const { remainingSeconds, showTimer, urgent, progress } = useTurnTimer({
    isTurn,
    turnDurationSec,
    timeBankSec,
    onTurnTimeout,
  });

  const canShowCards = hand.length >= 2 && (!isFolded || !isCurrentPlayer);
  const showBet = bet !== null;

  return (
    <section
      className={cn(
        styles.player,
        isFolded && styles.folded,
        isSitOut && styles.sitOut
      )}
    >
      <div className={styles.name}>{name}</div>

      <div className={styles.mainContainer}>
        <div className={styles.avatarWrap}>
          {showTimer && (
            <TurnTimer
              urgent={urgent}
              remainingSeconds={remainingSeconds}
              progress={progress}
            />
          )}

          <PlayerAvatar
            name={name}
            isFolded={isFolded}
            isTurn={isTurn}
            isCurrentPlayer={isCurrentPlayer}
            hideBorder={showTimer}
          />

          {isDealer && <div className={styles.dealerBadge}>D</div>}
        </div>

        {showBet && bet && <BetBadge bet={bet} position={betPosition} />}

        {canShowCards && (
          <PlayerCards
            cards={hand}
            position={cardsPosition}
            reveal={isCurrentPlayer || debug}
          />
        )}
      </div>

      <StackBadge amount={stack} />
    </section>
  );
};
